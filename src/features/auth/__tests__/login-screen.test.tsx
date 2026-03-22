import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { LoginScreen } from "../screens/login-screen";

describe("LoginScreen", () => {
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

  it("shows the neutral auth wiring message after a valid submit", async () => {
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(
      screen.getByText(
        "Auth wiring is not available yet. This form is ready for backend integration.",
      ),
    ).toBeInTheDocument();
  });

  it("defers success handling to onSubmit when provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<LoginScreen onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(
      screen.queryByText(
        "Auth wiring is not available yet. This form is ready for backend integration.",
      ),
    ).not.toBeInTheDocument();
  });
});
