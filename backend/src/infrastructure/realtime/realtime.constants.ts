export const REALTIME_NAMESPACE = '/realtime';
export const REALTIME_USER_ROOM_PREFIX = 'user:';
export const REALTIME_MAX_CONNECTIONS_PER_USER = 8;
export const REALTIME_DEFAULT_MAX_HTTP_BUFFER_SIZE = 1_000_000;
export const REALTIME_DEFAULT_PING_INTERVAL_MS = 25_000;
export const REALTIME_DEFAULT_PING_TIMEOUT_MS = 20_000;
export const REALTIME_CONNECTION_RECOVERY_MS = 120_000;

export const REALTIME_EVENTS = {
  ready: 'realtime.ready',
  error: 'realtime.error',
  ping: 'realtime.ping',
  subscribe: 'realtime.subscribe',
  unsubscribe: 'realtime.unsubscribe',
} as const;

export const REALTIME_ERROR_CODES = {
  authRequired: 'REALTIME_AUTH_REQUIRED',
  authInvalid: 'REALTIME_AUTH_INVALID',
  authUnavailable: 'REALTIME_AUTH_UNAVAILABLE',
  forbidden: 'REALTIME_FORBIDDEN',
  invalidPayload: 'REALTIME_INVALID_PAYLOAD',
  rateLimited: 'REALTIME_RATE_LIMITED',
  tooManyConnections: 'REALTIME_TOO_MANY_CONNECTIONS',
} as const;
