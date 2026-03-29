import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getMockRouter } from "@/test/next-navigation";

import { AdminGuard } from "../admin-guard";
import * as authContextModule from "../auth-context";

describe("AdminGuard", () => {
  it("renders a loading status while auth is hydrating", () => {
    vi.spyOn(authContextModule, "useAuth").mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateUser: vi.fn(),
      user: null,
    });

    render(
      <AdminGuard>
        <div>Protected admin area</div>
      </AdminGuard>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Protected admin area")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to the dashboard", async () => {
    const router = getMockRouter();

    vi.spyOn(authContextModule, "useAuth").mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateUser: vi.fn(),
      user: null,
    });

    render(
      <AdminGuard>
        <div>Protected admin area</div>
      </AdminGuard>,
    );

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/dashboard");
    });
    expect(screen.queryByText("Protected admin area")).not.toBeInTheDocument();
  });

  it("redirects non-admin users to the dashboard", async () => {
    const router = getMockRouter();

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

    render(
      <AdminGuard>
        <div>Protected admin area</div>
      </AdminGuard>,
    );

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/dashboard");
    });
    expect(screen.queryByText("Protected admin area")).not.toBeInTheDocument();
  });

  it("renders children for admin users", () => {
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

    render(
      <AdminGuard>
        <div>Protected admin area</div>
      </AdminGuard>,
    );

    expect(screen.getByText("Protected admin area")).toBeInTheDocument();
  });
});
