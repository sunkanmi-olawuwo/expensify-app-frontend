import { useQueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import { render, screen } from "@/test/render";

import {
  createQueryClient,
  QueryClientProvider,
  queryClient,
} from "../query-client";

function QueryClientProbe() {
  const activeClient = useQueryClient();

  return (
    <span>{activeClient === queryClient ? "singleton-client" : "custom-client"}</span>
  );
}

describe("query-client", () => {
  it("configures the expected default query and mutation behavior", () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.mutations?.retry).toBe(0);
  });

  it("creates isolated clients for tests", () => {
    const first = createQueryClient();
    const second = createQueryClient();

    expect(first).not.toBe(second);
    expect(first).not.toBe(queryClient);
  });

  it("uses the singleton client by default and supports overrides", () => {
    const customClient = createQueryClient();
    const { unmount } = render(
      <QueryClientProvider>
        <QueryClientProbe />
      </QueryClientProvider>,
    );

    expect(screen.getByText("singleton-client")).toBeInTheDocument();

    unmount();

    render(
      <QueryClientProvider client={customClient}>
        <QueryClientProbe />
      </QueryClientProvider>,
    );

    expect(screen.getByText("custom-client")).toBeInTheDocument();
  });

  it("surfaces normalized errors through query and mutation toast handlers", () => {
    const toastErrorSpy = vi.spyOn(toast, "error").mockReturnValue("toast-1");
    const client = createQueryClient();

    client.getQueryCache().config.onError?.(
      new ApiError({
        detail: "The query failed.",
        message: "The query failed.",
        status: 500,
      }),
      {} as never,
    );

    client.getMutationCache().config.onError?.(
      new Error("The mutation failed."),
      undefined,
      undefined,
      {} as never,
      {} as never,
    );

    expect(toastErrorSpy).toHaveBeenNthCalledWith(1, "The query failed.", {
      dedupeKey: "query-error:The query failed.",
    });
    expect(toastErrorSpy).toHaveBeenNthCalledWith(2, "The mutation failed.", {
      dedupeKey: "query-error:The mutation failed.",
    });
  });

  it("skips the global error toast when query or mutation meta suppresses it", () => {
    const toastErrorSpy = vi.spyOn(toast, "error").mockReturnValue("toast-1");
    const client = createQueryClient();

    client.getQueryCache().config.onError?.(
      new Error("Muted query"),
      {
        meta: {
          suppressErrorToast: true,
        },
      } as never,
    );

    client.getMutationCache().config.onError?.(
      new Error("Muted mutation"),
      undefined,
      undefined,
      {
        options: {
          meta: {
            suppressErrorToast: true,
          },
        },
      } as never,
      {} as never,
    );

    expect(toastErrorSpy).not.toHaveBeenCalled();
  });
});
