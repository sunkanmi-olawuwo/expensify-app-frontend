import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as authContextModule from "@/lib/auth/auth-context";
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
      screen.queryByText(
        /a purpose-built shell for the personal finance experience/i,
      ),
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
    expect(
      screen.getByRole("switch", { name: /dark mode/i }),
    ).toBeInTheDocument();
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

  it("shows the administration section for admin users", () => {
    setMockPathname("/admin/users");
    vi.spyOn(authContextModule, "useAuth").mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateUser: vi.fn(),
      user: {
        email: "admin@example.com",
        firstName: "Alex",
        id: "user-1",
        lastName: "Admin",
        role: "Admin",
      },
    });

    render(<AppSidebar />);

    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Administration" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute(
      "href",
      "/admin/users",
    );
    expect(screen.getByRole("link", { name: "Catalogs" })).toHaveAttribute(
      "href",
      "/admin/catalogs",
    );
    expect(
      screen.queryByRole("navigation", { name: "Primary navigation" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });

  it("does not show admin navigation for non-admin users", () => {
    setMockPathname("/dashboard");
    vi.spyOn(authContextModule, "useAuth").mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateUser: vi.fn(),
      user: {
        email: "user@example.com",
        firstName: "Morgan",
        id: "user-1",
        lastName: "Lee",
        role: "User",
      },
    });

    render(<AppSidebar />);

    expect(screen.queryByText("Administration")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Administration" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Catalogs" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
  });
});
