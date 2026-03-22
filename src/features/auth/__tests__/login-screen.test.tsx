import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authService } from "@/lib/auth/auth-service";
import { createMockJwt } from "@/test/jwt";
import { getMockRouter } from "@/test/next-navigation";
import { render, screen, waitFor } from "@/test/render";

import { LoginScreen } from "../screens/login-screen";

function createBackendUserToken() {
  return createMockJwt({
    exp: Math.floor(Date.now() / 1000) + 3600,
    role: "User",
    sub: "user@example.com",
    userid: "user-1",
  });
}

describe("LoginScreen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows validation errors for empty and invalid input", async () => {
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "invalid-email");
    await user.tab();

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("shows the status banner from the login status prop", () => {
    render(<LoginScreen status="registered" />);

    expect(
      screen.getByText("Account created successfully. Log in to continue."),
    ).toBeInTheDocument();
  });

  it("calls login and redirects on a successful submit", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();

    vi.spyOn(authService, "login").mockResolvedValue({
      refreshToken: "refresh-1",
      token: createBackendUserToken(),
    });
    vi.spyOn(authService, "getProfile").mockResolvedValue({
      currency: "GBP",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      monthStartDay: 1,
      timezone: "Europe/London",
    });

    render(<LoginScreen />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays the fallback error message on failure", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "login").mockRejectedValue(
      new Error("Invalid email or password."),
    );

    render(<LoginScreen />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(
      await screen.findByText("Unable to log in right now. Please try again."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Forgot password?" }),
    ).toHaveAttribute("href", "/forgot-password");
  });
});
