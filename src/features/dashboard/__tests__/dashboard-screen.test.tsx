import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { render, screen, within } from "@/test/render";

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
  });

  it("opens a placeholder sheet from a quick action", async () => {
    const user = userEvent.setup();

    render(<DashboardScreen />);

    await user.click(screen.getByRole("button", { name: /send money/i }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Coming soon")).toBeInTheDocument();
    expect(within(dialog).getByText("Send Money")).toBeInTheDocument();
  });
});
