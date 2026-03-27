import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { useDashboardSummary } from "../hooks/use-dashboard-summary";

function HookProbe() {
  const { data } = useDashboardSummary();

  return (
    <div>
      <span data-testid="net-cash-flow">{data?.netCashFlow.amount}</span>
      <span data-testid="spending-order">
        {data?.spendingBreakdown.map((item) => item.category).join(",")}
      </span>
      <span data-testid="transaction-count">{data?.recentTransactions.length}</span>
      <span data-testid="first-merchant">
        {data?.recentTransactions[0]?.merchant}
      </span>
    </div>
  );
}

describe("useDashboardSummary", () => {
  it("returns a typed summary payload with stable ordering", () => {
    render(<HookProbe />);

    expect(screen.getByTestId("net-cash-flow")).toHaveTextContent("9166");
    expect(screen.getByTestId("spending-order")).toHaveTextContent(
      "Housing,Travel,Dining,Software,Utilities",
    );
    expect(screen.getByTestId("transaction-count")).toHaveTextContent("5");
    expect(screen.getByTestId("first-merchant")).toHaveTextContent(
      "Maison et Table",
    );
  });
});
