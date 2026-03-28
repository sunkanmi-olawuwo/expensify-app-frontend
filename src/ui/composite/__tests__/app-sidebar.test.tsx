import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { authService } from "@/lib/auth/auth-service";
import { getMockRouter, setMockPathname } from "@/test/next-navigation";
import { render, screen } from "@/test/render";

import { AppSidebar } from "../app-sidebar";

describe("AppSidebar", () => {
  it("renders the primary nav without exposing chat", () => {
    setMockPathname("/dashboard");

    render(<AppSidebar />);

    expect(screen.getByText("expensify")).toBeInTheDocument();
    expect(
      screen.queryByText(/a purpose-built shell for the personal finance experience/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /transactions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /analytics/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /settings/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /chat/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /support/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /upgrade now/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("switch", { name: /dark mode/i })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveClass(
      "overflow-y-auto",
      "sidebar-scrollbar",
    );
  });

  it("logs the user out from the sidebar action", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();

    setMockPathname("/dashboard");
    vi.spyOn(authService, "logout").mockResolvedValue(undefined);

    render(<AppSidebar />);

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(router.replace).toHaveBeenCalledWith("/login?status=logged_out");
  });
});
