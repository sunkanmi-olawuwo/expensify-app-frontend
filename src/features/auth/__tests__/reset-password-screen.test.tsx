import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";
import { authService } from "@/lib/auth/auth-service";
import { getMockRouter } from "@/test/next-navigation";
import { render, screen, waitFor } from "@/test/render";

import { ResetPasswordScreen } from "../screens/reset-password-screen";

describe("ResetPasswordScreen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the provided email and token and submits the reset", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();

    vi.spyOn(authService, "resetPassword").mockResolvedValue(undefined);

    render(
      <ResetPasswordScreen email="user@example.com" token="reset-token" />,
    );

    await user.type(screen.getByLabelText("New Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        newPassword: "secret123",
        token: "reset-token",
      });
    });
    expect(router.replace).toHaveBeenCalledWith("/login?status=password_reset");
  });

  it("shows an invalid-link message when query params are missing", () => {
    render(<ResetPasswordScreen />);

    expect(screen.getByText("Invalid or expired reset link.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset Password" })).toBeDisabled();
  });

  it("shows the invalid-link message for validation failures", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "resetPassword").mockRejectedValue(
      new ApiError({
        detail: "Invalid token.",
        message: "Invalid token.",
        status: 400,
        title: "Users.InvalidResetToken",
      }),
    );

    render(
      <ResetPasswordScreen email="user@example.com" token="reset-token" />,
    );

    await user.type(screen.getByLabelText("New Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(
      await screen.findByText("Invalid or expired reset link."),
    ).toBeInTheDocument();
  });
});
