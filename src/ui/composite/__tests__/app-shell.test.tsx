import { describe, expect, it } from "vitest";

import { setMockPathname } from "@/test/next-navigation";
import { render, screen } from "@/test/render";

import { AppShell } from "../app-shell";

describe("AppShell", () => {
  it("renders the shell chrome around page content", () => {
    setMockPathname("/dashboard");

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
