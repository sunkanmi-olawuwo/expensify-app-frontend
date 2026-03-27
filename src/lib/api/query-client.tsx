"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";

import { getToastErrorMessage, toast } from "@/lib/toast";

import type { ReactNode } from "react";

function handleQueryError(error: unknown): void {
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
      onError: handleQueryError,
    }),
    queryCache: new QueryCache({
      onError: handleQueryError,
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
