import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";
import { authService } from "@/lib/auth/auth-service";
import { getMockRouter } from "@/test/next-navigation";
import { render, screen, waitFor } from "@/test/render";

import { SignupScreen } from "../screens/signup-screen";

describe("SignupScreen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders validation errors and password mismatch feedback", async () => {
    const user = userEvent.setup();

    render(<SignupScreen />);

    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(screen.getByText("Confirm your password.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("First Name"), "Morgan");
    await user.type(screen.getByLabelText("Last Name"), "Lee");
    await user.type(screen.getByLabelText("Email"), "morgan@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "different");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Passwords must match.")).toBeInTheDocument();
  });

  it("registers and redirects to login on success", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();

    vi.spyOn(authService, "register").mockResolvedValue({ userId: "user-1" });

    render(<SignupScreen />);

    await user.type(screen.getByLabelText("First Name"), "Morgan");
    await user.type(screen.getByLabelText("Last Name"), "Lee");
    await user.type(screen.getByLabelText("Email"), "morgan@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/login?status=registered");
    });
  });

  it("shows a conflict error toast without logging the user in", async () => {
    const user = userEvent.setup();
    const router = getMockRouter();

    vi.spyOn(authService, "register").mockRejectedValue(
      new ApiError({
        detail: "Already exists.",
        message: "Already exists.",
        status: 409,
        title: "Users.EmailConflict",
      }),
    );

    render(<SignupScreen />);

    await user.type(screen.getByLabelText("First Name"), "Morgan");
    await user.type(screen.getByLabelText("Last Name"), "Lee");
    await user.type(screen.getByLabelText("Email"), "morgan@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    const errorToast = await screen.findByText(
      "An account with this email already exists.",
    );

    expect(errorToast.closest("[aria-live]")).toHaveAttribute("aria-live", "assertive");
    expect(router.push).not.toHaveBeenCalledWith("/dashboard");
  });
});
