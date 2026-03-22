"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";

import type { ReactNode } from "react";

function logQueryError(error: unknown): void {
  console.error(error);
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
      onError: logQueryError,
    }),
    queryCache: new QueryCache({
      onError: logQueryError,
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
