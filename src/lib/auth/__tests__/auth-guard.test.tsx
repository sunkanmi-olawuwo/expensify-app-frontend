import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getMockRouter } from "@/test/next-navigation";

import * as authContextModule from "../auth-context";
import { AuthGuard } from "../auth-guard";

describe("AuthGuard", () => {
  it("renders the loading state while auth is hydrating", () => {
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
      <AuthGuard>
        <div>Protected area</div>
      </AuthGuard>,
    );

    expect(screen.getByText("expensify")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", async () => {
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
      <AuthGuard>
        <div>Protected area</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/login");
    });
    expect(screen.queryByText("Protected area")).not.toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
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
      <AuthGuard>
        <div>Protected area</div>
      </AuthGuard>,
    );

    expect(screen.getByText("Protected area")).toBeInTheDocument();
  });
});
