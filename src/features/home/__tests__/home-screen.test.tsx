import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { HomeScreen } from "../screens/home-screen";

describe("HomeScreen", () => {
  it("renders the editorial hero and ctas", () => {
    render(<HomeScreen />);

    expect(
      screen.getByRole("heading", {
        name: "A monthly money story with enough room to think.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("link", { name: "Log In" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
