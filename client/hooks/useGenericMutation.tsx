"use client";

import * as React from "react";
import {
  QueryKey,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import {toast} from "@heroui/react";

type MaybePromise<T> = T | Promise<T>;

type ToastTone = "default" | "accent" | "success" | "warning" | "danger";

type MutationToastPhase = "pending" | "success" | "error";

type MutationToastContext<TData, TError, TVariables> = {
  phase: MutationToastPhase;
  variables: TVariables;
  data?: TData;
  error?: TError;
  startedAt: number;
  durationMs?: number;
  optimisticApplied: boolean;
};

type ResolvableNode<TContext> =
  | React.ReactNode
  | ((context: TContext) => React.ReactNode);

type ToastField<TContext> = {
  label: React.ReactNode;
  value: ResolvableNode<TContext>;
  tone?: ToastTone;
};

type GenericToastConfig<TData, TError, TVariables> = {
  entity?: string;
  action?: string;

  pending?: false;
  success?: false;
  error?: false;

  pendingTitle?: ResolvableNode<MutationToastContext<TData, TError, TVariables>>;
  successTitle?: ResolvableNode<MutationToastContext<TData, TError, TVariables>>;
  errorTitle?: ResolvableNode<MutationToastContext<TData, TError, TVariables>>;

  pendingDescription?: ResolvableNode<
    MutationToastContext<TData, TError, TVariables>
  >;
  successDescription?: ResolvableNode<
    MutationToastContext<TData, TError, TVariables>
  >;
  errorDescription?: ResolvableNode<
    MutationToastContext<TData, TError, TVariables>
  >;

  getFields?: (
    context: MutationToastContext<TData, TError, TVariables>,
  ) => ToastField<MutationToastContext<TData, TError, TVariables>>[];

  getErrorMessage?: (error: TError) => React.ReactNode;

  errorAction?: {
    label: React.ReactNode;
    onPress: (context: {
      error: TError;
      variables: TVariables;
    }) => void;
  };
};

type GenericMutationContext<TCache, TExtraContext> = {
  previousData: TCache | undefined;
  hadPreviousQuery: boolean;
  pendingToastId?: string;
  startedAt: number;
  optimisticApplied: boolean;
  extraContext?: TExtraContext;
};

type GenericMutationOptions<
  TData,
  TError,
  TVariables,
  TCache,
  TExtraContext,
> = {
  mutationKey?: QueryKey;
  queryKey: QueryKey;

  mutationFn: (variables: TVariables) => Promise<TData>;

  optimisticUpdate?: (
    oldData: TCache | undefined,
    variables: TVariables,
  ) => TCache | undefined;

  successUpdate?: (
    oldData: TCache | undefined,
    data: TData,
    variables: TVariables,
  ) => TCache | undefined;

  invalidateKeys?: QueryKey[];

  toasts?: GenericToastConfig<TData, TError, TVariables>;

  onMutateExtra?: (variables: TVariables) => MaybePromise<TExtraContext>;

  onSuccessExtra?: (context: {
    data: TData;
    variables: TVariables;
    mutationContext: GenericMutationContext<TCache, TExtraContext>;
  }) => MaybePromise<void>;

  onErrorExtra?: (context: {
    error: TError;
    variables: TVariables;
    mutationContext: GenericMutationContext<TCache, TExtraContext>;
  }) => MaybePromise<void>;

  onSettledExtra?: (context: {
    data: TData | undefined;
    error: TError | null;
    variables: TVariables;
    mutationContext: GenericMutationContext<TCache, TExtraContext> | undefined;
  }) => MaybePromise<void>;

  mutationOptions?: Omit<
    UseMutationOptions<
      TData,
      TError,
      TVariables,
      GenericMutationContext<TCache, TExtraContext>
    >,
    "mutationFn" | "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled"
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

  return "The server rejected the request. Please review the data and try again.";
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

function DataPill({
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
    <div
      className={[
        "min-w-0 rounded-xl border px-2.5 py-2",
        "shadow-sm backdrop-blur-md",
        toneClass,
      ].join(" ")}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {label}
      </div>
      <div className="mt-0.5 truncate text-xs font-semibold">{value}</div>
    </div>
  );
}

function MutationToastBody<TData, TError, TVariables>({
  context,
  description,
  fields,
  errorMessage,
}: {
  context: MutationToastContext<TData, TError, TVariables>;
  description?: React.ReactNode;
  fields: ToastField<MutationToastContext<TData, TError, TVariables>>[];
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
          <DataPill
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

export function useGenericMutation<
  TData,
  TError = Error,
  TVariables = void,
  TCache = unknown,
  TExtraContext = unknown,
>({
  mutationKey,
  queryKey,
  mutationFn,
  optimisticUpdate,
  successUpdate,
  invalidateKeys = [queryKey],
  toasts,
  onMutateExtra,
  onSuccessExtra,
  onErrorExtra,
  onSettledExtra,
  mutationOptions,
}: GenericMutationOptions<
  TData,
  TError,
  TVariables,
  TCache,
  TExtraContext
>): UseMutationResult<
  TData,
  TError,
  TVariables,
  GenericMutationContext<TCache, TExtraContext>
> {
  const queryClient = useQueryClient();

  return useMutation<
    TData,
    TError,
    TVariables,
    GenericMutationContext<TCache, TExtraContext>
  >({
    mutationKey,
    mutationFn,
    ...mutationOptions,

    onMutate: async (variables: TVariables) => {
      const startedAt = Date.now();

      await queryClient.cancelQueries({queryKey});

      const previousData = queryClient.getQueryData<TCache>(queryKey);
      const hadPreviousQuery = queryClient.getQueryState(queryKey) !== undefined;

      let optimisticApplied = false;

      if (optimisticUpdate) {
        queryClient.setQueryData<TCache | undefined>(queryKey, (oldData: any) => {
          optimisticApplied = true;

          return optimisticUpdate(oldData, variables);
        });
      }

      const toastContext: MutationToastContext<TData, TError, TVariables> = {
        phase: "pending",
        variables,
        startedAt,
        optimisticApplied,
      };

      const defaultFields: ToastField<typeof toastContext>[] = [
        {
          label: "Operation",
          value: toasts?.action ?? "Save",
          tone: "accent",
        },
        {
          label: "Resource",
          value: toasts?.entity ?? "Record",
        },
        {
          label: "Cache",
          value: optimisticApplied ? "Optimistic" : "Sync only",
          tone: optimisticApplied ? "warning" : "default",
        },
        {
          label: "Status",
          value: "Pending",
          tone: "warning",
        },
      ];

      const pendingToastId =
        toasts?.pending === false
          ? undefined
          : toast(
              resolveNode(
                toasts?.pendingTitle,
                toastContext,
                `${toasts?.action ?? "Saving"} ${toasts?.entity ?? "record"}…`,
              ),
              {
                variant: "accent",
                isLoading: true,
                timeout: 0,
                indicator: <ToastIndicator tone="accent" />,
                description: (
                  <MutationToastBody
                    context={toastContext}
                    description={resolveNode(
                      toasts?.pendingDescription,
                      toastContext,
                      "The interface was updated immediately. Server confirmation is still running.",
                    )}
                    fields={toasts?.getFields?.(toastContext) ?? defaultFields}
                  />
                ),
              },
            );

      const extraContext = await onMutateExtra?.(variables);

      return {
        previousData,
        hadPreviousQuery,
        pendingToastId,
        startedAt,
        optimisticApplied,
        extraContext,
      };
    },

    onSuccess: async (data: TData, variables: TVariables, mutationContext: any) => {
      if (mutationContext?.pendingToastId) {
        toast.close(mutationContext.pendingToastId);
      }

      if (successUpdate) {
        queryClient.setQueryData<TCache | undefined>(queryKey, (oldData: any) =>
          successUpdate(oldData, data, variables),
        );
      }

      const durationMs = Date.now() - mutationContext.startedAt;

      const toastContext: MutationToastContext<TData, TError, TVariables> = {
        phase: "success",
        variables,
        data,
        startedAt: mutationContext.startedAt,
        durationMs,
        optimisticApplied: mutationContext.optimisticApplied,
      };

      const defaultFields: ToastField<typeof toastContext>[] = [
        {
          label: "Operation",
          value: toasts?.action ?? "Save",
          tone: "accent",
        },
        {
          label: "Resource",
          value: toasts?.entity ?? "Record",
        },
        {
          label: "Duration",
          value: formatDuration(durationMs),
        },
        {
          label: "Status",
          value: "Confirmed",
          tone: "success",
        },
      ];

      if (toasts?.success !== false) {
        toast.success(
          resolveNode(
            toasts?.successTitle,
            toastContext,
            `${toasts?.entity ?? "Record"} saved successfully`,
          ),
          {
            timeout: 5000,
            indicator: <ToastIndicator tone="success" />,
            description: (
              <MutationToastBody
                context={toastContext}
                description={resolveNode(
                  toasts?.successDescription,
                  toastContext,
                  "Server confirmed the change and the cache is being synchronized.",
                )}
                fields={toasts?.getFields?.(toastContext) ?? defaultFields}
              />
            ),
          },
        );
      }

      await onSuccessExtra?.({
        data,
        variables,
        mutationContext,
      });
    },

    onError: async (error: TError, variables: TVariables, mutationContext: any) => {
      if (mutationContext?.pendingToastId) {
        toast.close(mutationContext.pendingToastId);
      }

      if (mutationContext?.optimisticApplied) {
        if (mutationContext.hadPreviousQuery) {
          queryClient.setQueryData<TCache | undefined>(
            queryKey,
            mutationContext.previousData,
          );
        } else {
          queryClient.removeQueries({queryKey, exact: true});
        }
      }

      const durationMs = mutationContext
        ? Date.now() - mutationContext.startedAt
        : undefined;

      const toastContext: MutationToastContext<TData, TError, TVariables> = {
        phase: "error",
        variables,
        error,
        startedAt: mutationContext?.startedAt ?? Date.now(),
        durationMs,
        optimisticApplied: mutationContext?.optimisticApplied ?? false,
      };

      const errorMessage =
        toasts?.getErrorMessage?.(error) ?? getDefaultErrorMessage(error);

      const defaultFields: ToastField<typeof toastContext>[] = [
        {
          label: "Operation",
          value: toasts?.action ?? "Save",
          tone: "accent",
        },
        {
          label: "Resource",
          value: toasts?.entity ?? "Record",
        },
        {
          label: "Rollback",
          value: mutationContext?.optimisticApplied ? "Applied" : "Not needed",
          tone: mutationContext?.optimisticApplied ? "warning" : "default",
        },
        {
          label: "Status",
          value: "Failed",
          tone: "danger",
        },
      ];

      if (toasts?.error !== false) {
        toast.danger(
          resolveNode(
            toasts?.errorTitle,
            toastContext,
            `${toasts?.entity ?? "Record"} could not be saved`,
          ),
          {
            timeout: 9000,
            indicator: <ToastIndicator tone="danger" />,
            actionProps: toasts?.errorAction
              ? {
                  children: toasts.errorAction.label,
                  onPress: () =>
                    toasts.errorAction?.onPress({
                      error,
                      variables,
                    }),
                }
              : undefined,
            description: (
              <MutationToastBody
                context={toastContext}
                description={resolveNode(
                  toasts?.errorDescription,
                  toastContext,
                  "The optimistic change was safely rolled back to protect data consistency.",
                )}
                fields={toasts?.getFields?.(toastContext) ?? defaultFields}
                errorMessage={errorMessage}
              />
            ),
          },
        );
      }

      if (mutationContext) {
        await onErrorExtra?.({
          error,
          variables,
          mutationContext,
        });
      }
    },

    onSettled: async (data: any, error: any, variables: TVariables, mutationContext: any) => {
      await onSettledExtra?.({
        data,
        error,
        variables,
        mutationContext,
      });

      await Promise.all(
        invalidateKeys.map((key) =>
          queryClient.invalidateQueries({
            queryKey: key,
          }),
        ),
      );
    },
  });
}
