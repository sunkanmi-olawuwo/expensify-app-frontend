import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { DashboardScreen } from "../screens/dashboard-screen";

describe("DashboardScreen", () => {
  it("renders the hero and key placeholder sections", () => {
    render(<DashboardScreen />);

    expect(screen.getByText("Available Capital")).toBeInTheDocument();
    expect(screen.getByText("Money Tools")).toBeInTheDocument();
    expect(screen.getByText("Recent Ledger")).toBeInTheDocument();
  });
});
