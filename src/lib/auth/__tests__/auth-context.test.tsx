import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockJwt } from "@/test/jwt";
import { getMockRouter } from "@/test/next-navigation";
import { render, screen, waitFor } from "@/test/render";

import { useAuth } from "../auth-context";
import { authService } from "../auth-service";
import {
  clearAuthSession,
  getStoredUser,
  getToken,
  setTokens,
} from "../auth-store";
import { DEFAULT_SIGNUP_ROLE } from "../types";

function AuthConsumer() {
  const { isAuthenticated, isLoading, login, logout, register, user } = useAuth();

  return (
    <div>
      <p>loading:{String(isLoading)}</p>
      <p>authenticated:{String(isAuthenticated)}</p>
      <p>email:{user?.email ?? "none"}</p>
      <button onClick={() => login("user@example.com", "secret123")} type="button">
        Log in
      </button>
      <button
        onClick={() =>
          register("Morgan", "Lee", "user@example.com", "secret123")
        }
        type="button"
      >
        Register
      </button>
      <button onClick={() => logout()} type="button">
        Log out
      </button>
    </div>
  );
}

function createUserToken(overrides?: Partial<Record<string, unknown>>) {
  return createMockJwt({
    email: "user@example.com",
    exp: Math.floor(Date.now() / 1000) + 3600,
    firstName: "Morgan",
    lastName: "Lee",
    role: "User",
    sub: "user-1",
    ...overrides,
  });
}

function createBackendUserToken(overrides?: Partial<Record<string, unknown>>) {
  return createMockJwt({
    exp: Math.floor(Date.now() / 1000) + 3600,
    role: "User",
    sub: "user@example.com",
    userid: "user-1",
    ...overrides,
  });
}

describe("AuthProvider", () => {
  beforeEach(() => {
    clearAuthSession();
    vi.restoreAllMocks();
  });

  it("hydrates a valid stored session on mount", async () => {
    const token = createUserToken();

    setTokens(token, "refresh-1");

    render(<AuthConsumer />);

    await waitFor(() => {
      expect(screen.getByText("loading:false")).toBeInTheDocument();
    });

    expect(screen.getByText("authenticated:true")).toBeInTheDocument();
    expect(screen.getByText("email:user@example.com")).toBeInTheDocument();
  });

  it("refreshes an expired session during hydration", async () => {
    const expiredToken = createUserToken({
      exp: Math.floor(Date.now() / 1000) - 60,
    });
    const refreshedToken = createUserToken({
      email: "refreshed@example.com",
      sub: "user-2",
    });

    setTokens(expiredToken, "refresh-1");
    vi.spyOn(authService, "refreshTokens").mockResolvedValue({
      refreshToken: "refresh-2",
      token: refreshedToken,
    });

    render(<AuthConsumer />);

    await waitFor(() => {
      expect(screen.getByText("authenticated:true")).toBeInTheDocument();
    });

    expect(screen.getByText("email:refreshed@example.com")).toBeInTheDocument();
    expect(getToken()).toBe(refreshedToken);
  });

  it("logs in, hydrates the profile, and redirects to the dashboard", async () => {
    const user = userEvent.setup();
    const token = createBackendUserToken();
    const router = getMockRouter();

    vi.spyOn(authService, "login").mockResolvedValue({
      refreshToken: "refresh-1",
      token,
    });
    vi.spyOn(authService, "getProfile").mockResolvedValue({
      currency: "GBP",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      monthStartDay: 1,
      timezone: "Europe/London",
    });

    render(<AuthConsumer />);
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/dashboard");
    });

    expect(getToken()).toBe(token);
    expect(getStoredUser()).toMatchObject({
      email: "user@example.com",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
    });
  });

  it("registers with the default signup role without redirecting from context", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();
    const registerSpy = vi
      .spyOn(authService, "register")
      .mockResolvedValue({ userId: "user-1" });

    render(<AuthConsumer />);
    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalledWith({
        email: "user@example.com",
        firstName: "Morgan",
        lastName: "Lee",
        password: "secret123",
        role: DEFAULT_SIGNUP_ROLE,
      });
    });
    expect(router.push).not.toHaveBeenCalledWith("/login?status=registered");
  });

  it("clears the session and redirects even when logout fails", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();
    const token = createUserToken();

    setTokens(token, "refresh-1");
    vi.spyOn(authService, "logout").mockRejectedValue(new Error("offline"));

    render(<AuthConsumer />);

    await waitFor(() => {
      expect(screen.getByText("authenticated:true")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/login?status=logged_out");
    });

    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
