import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { AppSidebar } from "../app-sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("AppSidebar", () => {
  it("renders the primary nav without exposing chat", () => {
    render(<AppSidebar />);

    expect(screen.getByText("expensify")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /transactions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /analytics/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /chat/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upgrade now/i }),
    ).toBeInTheDocument();
  });
});
