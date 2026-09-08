import axios, {
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Send without the managed bearer token and never refresh on a 401. */
    skipAuth?: boolean;
    /** Disable automatic refresh, e.g. for login/logout endpoints. */
    skipAuthRefresh?: boolean;
    /** Set false to disable transient GET/HEAD retries for this request. */
    retry?: boolean;
  }
}

export interface ApiClientOptions {
  baseURL: string;
  refreshPath?: string;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  maxRetryDelayMs?: number;
  autoRefresh?: boolean;
  browserOnly?: boolean;
  onSessionExpired?: () => void;
  /** Override when the backend uses a different refresh response envelope. */
  readAccessToken?: (data: unknown) => string;
  /** Transport injection for testing or specialized runtimes. */
  adapter?: AxiosAdapter;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; requestId?: string; details?: unknown } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code ?? 'API_ERROR';
    this.requestId = options.requestId;
    this.details = options.details;
  }
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object'
    ? value as Record<string, unknown>
    : undefined;
}

/** Normalize server errors without exposing Axios config, headers, or tokens. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!axios.isAxiosError(error)) {
    return new ApiError('The request could not be completed.', { code: 'CLIENT_ERROR' });
  }
  const body = record(error.response?.data);
  const messages = body?.message;
  const message = typeof messages === 'string'
    ? messages
    : Array.isArray(messages) && messages.every((item) => typeof item === 'string')
      ? messages.join('; ')
      : error.response
        ? 'The server could not complete the request.'
        : 'Unable to reach the server.';
  const requestId = error.response?.headers?.['x-request-id'];
  return new ApiError(message, {
    status: error.response?.status,
    code: typeof body?.code === 'string' ? body.code : error.code,
    requestId: typeof requestId === 'string' ? requestId : undefined,
    details: body?.errors,
  });
}

type Signal = AxiosRequestConfig['signal'];
type RequestState = {
  session: number;
  tokenVersion: number;
  refreshed: boolean;
  retries: number;
};
type TrackedConfig = InternalAxiosRequestConfig & { __sgip?: RequestState };

function cancelled(): Error {
  return new axios.CanceledError('Request cancelled or authentication session changed.');
}

function assertNotAborted(signal: Signal): void {
  if (signal?.aborted) throw cancelled();
}

/** Cancelling one waiter must not cancel the shared refresh for other requests. */
function waitFor<T>(promise: Promise<T>, signal: Signal): Promise<T> {
  assertNotAborted(signal);
  if (!signal) return promise;
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      signal.removeEventListener?.('abort', onAbort);
      reject(cancelled());
    };
    signal.addEventListener?.('abort', onAbort);
    promise.then(
      (value) => { signal.removeEventListener?.('abort', onAbort); resolve(value); },
      (error: unknown) => { signal.removeEventListener?.('abort', onAbort); reject(error); },
    );
  });
}

function sleep(ms: number, signal: Signal): Promise<void> {
  assertNotAborted(signal);
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener?.('abort', onAbort);
      reject(cancelled());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener?.('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener?.('abort', onAbort);
  });
}

function readDefaultAccessToken(data: unknown): string {
  const token = record(data)?.accessToken;
  if (typeof token !== 'string') {
    throw new ApiError('Invalid refresh response.', { code: 'INVALID_REFRESH_RESPONSE' });
  }
  return token;
}

function validateToken(token: string): string {
  if (!token || /\s/.test(token)) {
    throw new ApiError('Invalid access token.', { code: 'INVALID_ACCESS_TOKEN' });
  }
  return token;
}

function finiteOption(value: number, min: number, max: number, name: string): number {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new ApiError('Invalid ' + name + ' configuration.', { code: 'INVALID_CONFIG' });
  }
  return value;
}

/**
 * One factory instance owns one authentication session.
 * Create a fresh instance per server request; never share server-side tokens.
 */
export function createApiClient(options: ApiClientOptions): {
  client: AxiosInstance;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  refreshAccessToken: () => Promise<string>;
} {
  const baseURL = options.baseURL.replace(/\/+$/, '');
  const refreshPath = options.refreshPath ?? '/auth/refresh';
  const timeout = finiteOption(options.timeoutMs ?? 15_000, 1, 120_000, 'timeout');
  const maxRetries = Math.floor(finiteOption(options.maxRetries ?? 2, 0, 3, 'retries'));
  const retryDelay = finiteOption(options.retryDelayMs ?? 300, 0, 60_000, 'retry delay');
  const maxRetryDelay = finiteOption(options.maxRetryDelayMs ?? 8_000, 0, 60_000, 'maximum retry delay');
  const autoRefresh = options.autoRefresh ?? (typeof window !== 'undefined');
  const defaults: AxiosRequestConfig = {
    baseURL,
    timeout,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: { Accept: 'application/json' },
    maxRedirects: 0,
    ...(options.adapter ? { adapter: options.adapter } : {}),
  };
  const client = axios.create(defaults);
  // Separate transport: refresh cannot trigger its own interceptors or retries.
  const refreshClient = axios.create(defaults);
  let accessToken: string | null = null;
  let session = 0;
  let tokenVersion = 0;
  let refreshInFlight: Promise<string> | null = null;
  let refreshController: AbortController | null = null;

  function assertRuntime(): void {
    if (options.browserOnly && typeof window === 'undefined') {
      throw new ApiError('Use createApiClient() per server request.', { code: 'BROWSER_CLIENT_ONLY' });
    }
  }

  function destination(config: AxiosRequestConfig): URL {
    assertRuntime();
    const origin = typeof window === 'undefined' ? undefined : window.location.origin;
    let base: URL;
    let target: URL;
    try {
      base = new URL(baseURL, origin);
      target = new URL(axios.getUri({ baseURL: config.baseURL ?? baseURL, url: config.url }), origin);
    } catch {
      throw new ApiError('Configure a valid API base URL.', { code: 'INVALID_API_URL' });
    }
    const prefix = base.pathname.replace(/\/+$/, '');
    if (
      !['http:', 'https:'].includes(base.protocol) ||
      target.origin !== base.origin ||
      target.username || target.password || base.username || base.password ||
      (prefix && target.pathname !== prefix && !target.pathname.startsWith(prefix + '/'))
    ) {
      throw new ApiError('Request destination is outside the configured API.', { code: 'UNTRUSTED_API_URL' });
    }
    return target;
  }

  function resetSession(): void {
    session += 1;
    tokenVersion += 1;
    accessToken = null;
    refreshController?.abort();
    refreshController = null;
    refreshInFlight = null;
  }

  function expireSession(): void {
    resetSession();
    // Observer failures must not change request/authentication semantics.
    try { options.onSessionExpired?.(); } catch { /* Application observer owns its errors. */ }
  }

  function setAccessToken(token: string): void {
    assertRuntime();
    const validated = validateToken(token);
    resetSession();
    accessToken = validated;
  }

  function clearSession(): void {
    assertRuntime();
    resetSession();
  }

  function refreshAccessToken(): Promise<string> {
    assertRuntime();
    if (refreshInFlight) return refreshInFlight;
    destination({ url: refreshPath });
    const currentSession = session;
    const controller = new AbortController();
    refreshController = controller;
    const pending = refreshClient.post<unknown>(refreshPath, undefined, {
      signal: controller.signal,
    }).then((response) => {
      if (currentSession !== session) throw cancelled();
      const token = validateToken((options.readAccessToken ?? readDefaultAccessToken)(response.data));
      accessToken = token;
      tokenVersion += 1;
      return token;
    }).catch((error: unknown) => {
      if (currentSession !== session || axios.isCancel(error)) throw cancelled();
      const normalized = toApiError(error);
      if (
        normalized.status === 401 || normalized.status === 403 ||
        normalized.code === 'INVALID_REFRESH_RESPONSE' || normalized.code === 'INVALID_ACCESS_TOKEN'
      ) expireSession();
      throw normalized;
    }).finally(() => {
      if (refreshInFlight === pending) {
        refreshInFlight = null;
        refreshController = null;
      }
    });
    refreshInFlight = pending;
    return pending;
  }

  function ensureCurrent(config: TrackedConfig): void {
    assertNotAborted(config.signal);
    if (!config.skipAuth && config.__sgip && config.__sgip.session !== session) {
      throw cancelled();
    }
  }

  client.interceptors.request.use((request) => {
    const config = request as TrackedConfig;
    destination(config);
    ensureCurrent(config);
    config.__sgip ??= { session, tokenVersion, refreshed: false, retries: 0 };
    config.__sgip.tokenVersion = tokenVersion;
    config.headers = AxiosHeaders.from(config.headers);
    if (config.skipAuth || !accessToken) config.headers.delete('Authorization');
    else config.headers.set('Authorization', 'Bearer ' + accessToken);
    if (!config.headers.has('X-Request-ID') && globalThis.crypto?.randomUUID) {
      config.headers.set('X-Request-ID', globalThis.crypto.randomUUID());
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => { ensureCurrent(response.config as TrackedConfig); return response; },
    async (error: unknown) => {
      if (axios.isCancel(error)) throw error;
      if (!axios.isAxiosError(error) || !error.config) throw toApiError(error);
      const config = error.config as TrackedConfig;
      ensureCurrent(config);
      const state = config.__sgip;
      if (!state) throw toApiError(error);
      const status = error.response?.status;
      const isRefreshEndpoint = destination(config).pathname === destination({ url: refreshPath }).pathname;

      if (status === 401 && !config.skipAuth && !config.skipAuthRefresh && !isRefreshEndpoint && autoRefresh) {
        if (state.refreshed) {
          if (state.tokenVersion === tokenVersion) expireSession();
          throw toApiError(error);
        }
        state.refreshed = true;
        // A late 401 for an older token can reuse the already refreshed token.
        if (state.tokenVersion === tokenVersion) {
          await waitFor(refreshAccessToken(), config.signal);
        }
        ensureCurrent(config);
        return client.request(config);
      }

      const safeMethod = ['get', 'head'].includes((config.method ?? 'get').toLowerCase());
      const transient = status !== undefined
        ? [408, 429, 502, 503, 504].includes(status)
        : ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN'].includes(error.code ?? '');
      if (safeMethod && config.retry !== false && transient && state.retries < maxRetries) {
        let delay = Math.random() * Math.min(maxRetryDelay, retryDelay * 2 ** state.retries);
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter !== undefined) {
          const seconds = Number(retryAfter);
          const required = Number.isFinite(seconds)
            ? seconds * 1_000
            : Date.parse(String(retryAfter)) - Date.now();
          if (Number.isFinite(required)) {
            // Do not retry earlier than the server asks, or wait beyond our budget.
            if (required > maxRetryDelay) throw toApiError(error);
            delay = Math.max(delay, required, 0);
          }
        }
        state.retries += 1;
        await sleep(delay, config.signal);
        ensureCurrent(config);
        return client.request(config);
      }
      throw toApiError(error);
    },
  );

  return { client, setAccessToken, clearSession, refreshAccessToken };
}

const browserSession = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  refreshPath: process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH ?? '/auth/refresh',
  browserOnly: true,
  autoRefresh: true,
  onSessionExpired: () => window.dispatchEvent(new Event('auth:session-expired')),
});

/** Browser singleton. AxiosResponse<T> is preserved; use response.data. */
export const axiosClient = browserSession.client;
export const setAccessToken = browserSession.setAccessToken;
export const clearSession = browserSession.clearSession;
export const refreshAccessToken = browserSession.refreshAccessToken;
export default axiosClient;
