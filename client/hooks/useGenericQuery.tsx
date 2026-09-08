// hooks/shared/use-enterprise-query.tsx
"use client";

import * as React from "react";
import {
  QueryKey,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import {toast} from "@heroui/react";

type ToastTone = "default" | "accent" | "success" | "warning" | "danger";

type QueryToastPhase = "loading" | "success" | "error" | "refetching";

type EnterpriseQueryToastContext<TData, TError> = {
  phase: QueryToastPhase;
  data?: TData;
  error?: TError;
  startedAt: number;
  durationMs?: number;
  isRefetch: boolean;
};

type ResolvableNode<TContext> =
  | React.ReactNode
  | ((context: TContext) => React.ReactNode);

type QueryToastField<TContext> = {
  label: React.ReactNode;
  value: ResolvableNode<TContext>;
  tone?: ToastTone;
};

type EnterpriseQueryToastConfig<TData, TError> = {
  entity?: string;

  /**
   * Recommended defaults:
   * loading: false for normal page queries
   * success: false unless it is a manual/important load
   * error: true
   */
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  refetching?: boolean;

  loadingTitle?: ResolvableNode<EnterpriseQueryToastContext<TData, TError>>;
  successTitle?: ResolvableNode<EnterpriseQueryToastContext<TData, TError>>;
  errorTitle?: ResolvableNode<EnterpriseQueryToastContext<TData, TError>>;
  refetchingTitle?: ResolvableNode<EnterpriseQueryToastContext<TData, TError>>;

  loadingDescription?: ResolvableNode<
    EnterpriseQueryToastContext<TData, TError>
  >;
  successDescription?: ResolvableNode<
    EnterpriseQueryToastContext<TData, TError>
  >;
  errorDescription?: ResolvableNode<EnterpriseQueryToastContext<TData, TError>>;
  refetchingDescription?: ResolvableNode<
    EnterpriseQueryToastContext<TData, TError>
  >;

  getFields?: (
    context: EnterpriseQueryToastContext<TData, TError>,
  ) => QueryToastField<EnterpriseQueryToastContext<TData, TError>>[];

  getErrorMessage?: (error: TError) => React.ReactNode;

  errorAction?: {
    label: React.ReactNode;
    onPress: (context: {error: TError; refetch: () => void}) => void;
  };
};

type EnterpriseQueryOptions<TQueryFnData, TError, TData> = {
  queryKey: QueryKey;
  queryFn: () => Promise<TQueryFnData>;

  toasts?: EnterpriseQueryToastConfig<TData, TError>;

  queryOptions?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
    "queryKey" | "queryFn"
  >;
};

function resolveNode<TContext>(
  value: ResolvableNode<TContext> | undefined,
  context: TContext,
  fallback: React.ReactNode,
): React.ReactNode {
  if (typeof value === "function") {
    return value(context);
  }

  return value ?? fallback;
}

function formatDuration(ms: number | undefined) {
  if (ms === undefined) return "—";
  if (ms < 1000) return `${ms}ms`;

  return `${(ms / 1000).toFixed(1)}s`;
}

function getDefaultErrorMessage(error: unknown): React.ReactNode {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as {message?: unknown}).message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return "The request failed. Please check your connection or try again.";
}

function ToastIndicator({tone}: {tone: ToastTone}) {
  const label =
    tone === "success"
      ? "✓"
      : tone === "danger"
        ? "!"
        : tone === "warning"
          ? "!"
          : "•";

  const className =
    tone === "success"
      ? "bg-success/15 text-success border-success/25"
      : tone === "danger"
        ? "bg-danger/15 text-danger border-danger/25"
        : tone === "warning"
          ? "bg-warning/15 text-warning border-warning/25"
          : "bg-primary/15 text-primary border-primary/25";

  return (
    <span
      aria-hidden="true"
      className={[
        "flex size-8 shrink-0 items-center justify-center rounded-xl border",
        "text-sm font-black shadow-sm",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function QueryDataPill({
  label,
  value,
  tone = "default",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: ToastTone;
}) {
  const toneClass =
    tone === "success"
      ? "border-success/20 bg-success/10 text-success-700 dark:text-success-300"
      : tone === "danger"
        ? "border-danger/20 bg-danger/10 text-danger-700 dark:text-danger-300"
        : tone === "warning"
          ? "border-warning/20 bg-warning/10 text-warning-700 dark:text-warning-300"
          : tone === "accent"
            ? "border-primary/20 bg-primary/10 text-primary-700 dark:text-primary-300"
            : "border-default-200 bg-default-100 text-default-700 dark:text-default-300";

  return (
    <div className={["rounded-xl border px-2.5 py-2 shadow-sm", toneClass].join(" ")}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {label}
      </div>
      <div className="mt-0.5 truncate text-xs font-semibold">{value}</div>
    </div>
  );
}

function QueryToastBody<TData, TError>({
  context,
  description,
  fields,
  errorMessage,
}: {
  context: EnterpriseQueryToastContext<TData, TError>;
  description?: React.ReactNode;
  fields: QueryToastField<EnterpriseQueryToastContext<TData, TError>>[];
  errorMessage?: React.ReactNode;
}) {
  return (
    <div className="mt-2 space-y-2">
      {description ? (
        <p className="text-xs leading-5 text-default-600 dark:text-default-400">
          {description}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-1.5">
        {fields.map((field, index) => (
          <QueryDataPill
            key={index}
            label={field.label}
            value={resolveNode(field.value, context, "—")}
            tone={field.tone}
          />
        ))}
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-xs font-medium leading-5 text-danger-700 dark:text-danger-300">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}

function getArrayCount(data: unknown): string {
  if (Array.isArray(data)) return String(data.length);

  if (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray((data as {items?: unknown}).items)
  ) {
    return String((data as {items: unknown[]}).items.length);
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as {data?: unknown}).data)
  ) {
    return String((data as {data: unknown[]}).data.length);
  }

  return "—";
}

export function useEnterpriseQuery<
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
>({
  queryKey,
  queryFn,
  toasts,
  queryOptions,
}: EnterpriseQueryOptions<TQueryFnData, TError, TData>): UseQueryResult<TData, TError> {
  const queryClient = useQueryClient();

  const startedAtRef = React.useRef<number>(Date.now());
  const loadingToastIdRef = React.useRef<string | undefined>(undefined);
  const hasShownSuccessRef = React.useRef(false);
  const lastErrorAtRef = React.useRef<number | undefined>(undefined);

  const query = useQuery<TQueryFnData, TError, TData, QueryKey>({
    queryKey,
    queryFn: async () => {
      startedAtRef.current = Date.now();
      return queryFn();
    },
    retry: 1,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });

  React.useEffect(() => {
    const shouldShowLoading =
      toasts?.loading === true && query.isPending && query.fetchStatus === "fetching";

    if (!shouldShowLoading) return;

    if (loadingToastIdRef.current) return;

    const context: EnterpriseQueryToastContext<TData, TError> = {
      phase: "loading",
      startedAt: startedAtRef.current,
      isRefetch: false,
    };

    const fields: QueryToastField<typeof context>[] =
      toasts?.getFields?.(context) ?? [
        {
          label: "Resource",
          value: toasts?.entity ?? "Records",
          tone: "accent",
        },
        {
          label: "Status",
          value: "Loading",
          tone: "warning",
        },
        {
          label: "Cache",
          value: queryClient.getQueryState(queryKey) ? "Available" : "Empty",
        },
        {
          label: "Mode",
          value: "Initial fetch",
        },
      ];

    loadingToastIdRef.current = toast(
      resolveNode(
        toasts?.loadingTitle,
        context,
        `Loading ${toasts?.entity ?? "records"}…`,
      ),
      {
        variant: "accent",
        isLoading: true,
        timeout: 0,
        indicator: <ToastIndicator tone="accent" />,
        description: (
          <QueryToastBody
            context={context}
            description={resolveNode(
              toasts?.loadingDescription,
              context,
              "Fetching fresh data from the server.",
            )}
            fields={fields}
          />
        ),
      },
    );
  }, [
    query.isPending,
    query.fetchStatus,
    queryClient,
    queryKey,
    toasts,
  ]);

  React.useEffect(() => {
    const shouldShowRefetching =
      toasts?.refetching === true &&
      query.isRefetching &&
      !query.isPending;

    if (!shouldShowRefetching) return;

    const context: EnterpriseQueryToastContext<TData, TError> = {
      phase: "refetching",
      data: query.data,
      startedAt: startedAtRef.current,
      isRefetch: true,
    };

    const fields: QueryToastField<typeof context>[] =
      toasts?.getFields?.(context) ?? [
        {
          label: "Resource",
          value: toasts?.entity ?? "Records",
          tone: "accent",
        },
        {
          label: "Status",
          value: "Refreshing",
          tone: "warning",
        },
        {
          label: "Visible Items",
          value: getArrayCount(query.data),
        },
        {
          label: "Mode",
          value: "Background sync",
        },
      ];

    toast(
      resolveNode(
        toasts?.refetchingTitle,
        context,
        `Refreshing ${toasts?.entity ?? "records"}…`,
      ),
      {
        variant: "accent",
        timeout: 3000,
        indicator: <ToastIndicator tone="accent" />,
        description: (
          <QueryToastBody
            context={context}
            description={resolveNode(
              toasts?.refetchingDescription,
              context,
              "Keeping the current view visible while checking for fresh data.",
            )}
            fields={fields}
          />
        ),
      },
    );
  }, [
    query.isRefetching,
    query.isPending,
    query.data,
    toasts,
  ]);

  React.useEffect(() => {
    if (!query.isSuccess) return;

    if (loadingToastIdRef.current) {
      toast.close(loadingToastIdRef.current);
      loadingToastIdRef.current = undefined;
    }

    const shouldShowSuccess = toasts?.success === true && !hasShownSuccessRef.current;

    if (!shouldShowSuccess) return;

    hasShownSuccessRef.current = true;

    const durationMs = Date.now() - startedAtRef.current;

    const context: EnterpriseQueryToastContext<TData, TError> = {
      phase: "success",
      data: query.data,
      startedAt: startedAtRef.current,
      durationMs,
      isRefetch: false,
    };

    const fields: QueryToastField<typeof context>[] =
      toasts?.getFields?.(context) ?? [
        {
          label: "Resource",
          value: toasts?.entity ?? "Records",
          tone: "accent",
        },
        {
          label: "Items",
          value: getArrayCount(query.data),
          tone: "success",
        },
        {
          label: "Duration",
          value: formatDuration(durationMs),
        },
        {
          label: "Status",
          value: "Ready",
          tone: "success",
        },
      ];

    toast.success(
      resolveNode(
        toasts?.successTitle,
        context,
        `${toasts?.entity ?? "Records"} loaded`,
      ),
      {
        timeout: 4500,
        indicator: <ToastIndicator tone="success" />,
        description: (
          <QueryToastBody
            context={context}
            description={resolveNode(
              toasts?.successDescription,
              context,
              "The latest data is available in the interface.",
            )}
            fields={fields}
          />
        ),
      },
    );
  }, [
    query.isSuccess,
    query.data,
    toasts,
  ]);

  React.useEffect(() => {
    if (!query.isError) return;

    if (loadingToastIdRef.current) {
      toast.close(loadingToastIdRef.current);
      loadingToastIdRef.current = undefined;
    }

    if (toasts?.error === false) return;

    const now = Date.now();

    /**
     * Prevent duplicate error toasts from retries/rerenders.
     */
    if (lastErrorAtRef.current && now - lastErrorAtRef.current < 1500) {
      return;
    }

    lastErrorAtRef.current = now;

    const durationMs = now - startedAtRef.current;

    const context: EnterpriseQueryToastContext<TData, TError> = {
      phase: "error",
      error: query.error,
      startedAt: startedAtRef.current,
      durationMs,
      isRefetch: query.isRefetchError,
    };

    const errorMessage =
      toasts?.getErrorMessage?.(query.error) ?? getDefaultErrorMessage(query.error);

    const fields: QueryToastField<typeof context>[] =
      toasts?.getFields?.(context) ?? [
        {
          label: "Resource",
          value: toasts?.entity ?? "Records",
          tone: "accent",
        },
        {
          label: "Duration",
          value: formatDuration(durationMs),
        },
        {
          label: "Mode",
          value: query.isRefetchError ? "Refetch" : "Initial load",
          tone: query.isRefetchError ? "warning" : "danger",
        },
        {
          label: "Status",
          value: "Failed",
          tone: "danger",
        },
      ];

    toast.danger(
      resolveNode(
        toasts?.errorTitle,
        context,
        `${toasts?.entity ?? "Records"} failed to load`,
      ),
      {
        timeout: 9000,
        indicator: <ToastIndicator tone="danger" />,
        actionProps: {
          children: toasts?.errorAction?.label ?? "Retry",
          onPress: () => {
            if (toasts?.errorAction) {
              toasts.errorAction.onPress({
                error: query.error,
                refetch: () => void query.refetch(),
              });

              return;
            }

            void query.refetch();
          },
        },
        description: (
          <QueryToastBody
            context={context}
            description={resolveNode(
              toasts?.errorDescription,
              context,
              query.isRefetchError
                ? "The current cached view was kept, but the latest refresh failed."
                : "No fresh data could be loaded for this view.",
            )}
            fields={fields}
            errorMessage={errorMessage}
          />
        ),
      },
    );
  }, [
    query.isError,
    query.error,
    query.isRefetchError,
    query,
    toasts,
  ]);

  return query;
}