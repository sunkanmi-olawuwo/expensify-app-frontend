import { useQueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

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
});
