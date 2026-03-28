import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { DashboardScreen } from "../screens/dashboard-screen";

describe("DashboardScreen", () => {
  it("renders the dashboard summary sections with mock data", () => {
    render(<DashboardScreen />);

    expect(screen.getAllByText("Net Cash Flow").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$9,166.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Monthly income").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$18,450.00").length).toBeGreaterThan(0);
    expect(screen.getByText("Top categories")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Monthly performance chart" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View all transactions" }),
    ).toHaveAttribute("href", "/transactions");
    expect(screen.getByText("Maison et Table")).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")).toHaveLength(5);
    expect(screen.queryByText("Money Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Quick actions")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Current month performance, top spending categories, and recent transactions.",
      ),
    ).not.toBeInTheDocument();
  });
});
