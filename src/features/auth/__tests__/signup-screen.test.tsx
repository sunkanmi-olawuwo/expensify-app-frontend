import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { SignupScreen } from "../screens/signup-screen";

describe("SignupScreen", () => {
  it("renders validation errors and password mismatch feedback", async () => {
    const user = userEvent.setup();

    render(<SignupScreen />);

    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(screen.getByText("Confirm your password.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Name"), "Morgan");
    await user.type(screen.getByLabelText("Email"), "morgan@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "different");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Passwords must match.")).toBeInTheDocument();
  });

  it("shows the neutral auth wiring message after a valid submit", async () => {
    const user = userEvent.setup();

    render(<SignupScreen />);

    await user.type(screen.getByLabelText("Name"), "Morgan Lee");
    await user.type(screen.getByLabelText("Email"), "morgan@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      screen.getByText(
        "Auth wiring is not available yet. This form is ready for backend integration.",
      ),
    ).toBeInTheDocument();
  });

  it("defers success handling to onSubmit when provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<SignupScreen onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "Morgan Lee");
    await user.type(screen.getByLabelText("Email"), "morgan@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(onSubmit).toHaveBeenCalledWith({
      confirmPassword: "secret123",
      email: "morgan@example.com",
      name: "Morgan Lee",
      password: "secret123",
    });
    expect(
      screen.queryByText(
        "Auth wiring is not available yet. This form is ready for backend integration.",
      ),
    ).not.toBeInTheDocument();
  });
});
