import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authService } from "@/lib/auth/auth-service";
import { render, screen } from "@/test/render";

import { ForgotPasswordScreen } from "../screens/forgot-password-screen";

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the email field and submit button", () => {
    render(<ForgotPasswordScreen />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" }),
    ).toBeInTheDocument();
  });

  it("shows the check-your-email success toast after submit", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "forgotPassword").mockResolvedValue(undefined);

    render(<ForgotPasswordScreen />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(screen.getByRole("button", { name: "Send Reset Link" }));

    const successToast = await screen.findByText(
      "Check your email for a reset link.",
    );

    expect(successToast.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("link", { name: "Back to Log In" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
