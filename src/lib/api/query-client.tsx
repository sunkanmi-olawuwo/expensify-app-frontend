"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";

import { getToastErrorMessage, toast } from "@/lib/toast";

import type { ReactNode } from "react";

type ErrorToastMeta = {
  suppressErrorToast?: boolean;
};

function shouldSuppressErrorToast(target: unknown): boolean {
  if (!target || typeof target !== "object") {
    return false;
  }

  const meta =
    (target as { meta?: ErrorToastMeta }).meta ??
    (target as { options?: { meta?: ErrorToastMeta } }).options?.meta;

  return meta?.suppressErrorToast === true;
}

function handleQueryError(error: unknown, target?: unknown): void {
  if (shouldSuppressErrorToast(target)) {
    return;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  const message = getToastErrorMessage(error);

  toast.error(message, {
    dedupeKey: `query-error:${message}`,
  });
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: 0,
      },
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30_000,
      },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) =>
        handleQueryError(error, mutation),
    }),
    queryCache: new QueryCache({
      onError: (error, query) => handleQueryError(error, query),
    }),
  });
}

export const queryClient = createQueryClient();

type QueryClientProviderProps = {
  children: ReactNode;
  client?: QueryClient;
};

export function QueryClientProvider({
  children,
  client,
}: QueryClientProviderProps) {
  const providerClient = client ?? queryClient;

  return (
    <TanStackQueryClientProvider client={providerClient}>
      {children}
    </TanStackQueryClientProvider>
  );
}
