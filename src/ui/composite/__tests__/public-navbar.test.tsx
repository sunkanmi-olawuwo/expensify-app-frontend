import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { PublicNavbar } from "../public-navbar";

describe("PublicNavbar", () => {
  it("renders the brand and primary actions", () => {
    render(<PublicNavbar />);

    expect(screen.getByRole("link", { name: "expensify" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Log In" })).not.toHaveLength(0);
    expect(
      screen.getAllByRole("link", { name: "Get Started" }),
    ).not.toHaveLength(0);
  });

  it("shows the public links in the mobile sheet", async () => {
    const user = userEvent.setup();

    render(<PublicNavbar />);

    await user.click(screen.getByRole("button", { name: "Open public navigation" }));

    expect(
      screen.getByRole("navigation", { name: "Public navigation menu" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Home" })).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Log In" })).not.toHaveLength(0);
    expect(
      screen.getAllByRole("link", { name: "Get Started" }),
    ).not.toHaveLength(0);
  });
});
