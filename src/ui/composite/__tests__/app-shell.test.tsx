import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { AppShell } from "../app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("AppShell", () => {
  it("renders the shell chrome around page content", () => {
    render(
      <AppShell>
        <div>Ledger page placeholder</div>
      </AppShell>,
    );

    expect(screen.getByLabelText("Search workspace")).toBeInTheDocument();
    expect(screen.getByText("Ledger page placeholder")).toBeInTheDocument();
    expect(screen.getByText("expensify")).toBeInTheDocument();
  });
});
