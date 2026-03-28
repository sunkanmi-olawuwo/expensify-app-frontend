import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import { render, screen } from "@/test/render";

import { ThemeToggle } from "../theme-toggle";

describe("ThemeToggle", () => {
  it("renders the current theme and cycles through all modes", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(THEME_STORAGE_KEY, "light");

    render(<ThemeToggle />);

    const button = await screen.findByRole("button", { name: /theme light/i });

    expect(button).toHaveAttribute("data-theme", "light");
    expect(screen.getByText("Light")).toBeInTheDocument();

    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute("data-theme", "dark");
    });

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute("data-theme", "system");
    });

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
    expect(screen.getByText(/System \(light\)/i)).toBeInTheDocument();
  });

  it("renders a compact icon-only variant with the active theme metadata", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(<ThemeToggle compact />);

    const button = await screen.findByRole("button", { name: /theme dark/i });

    expect(button).toHaveAttribute("data-theme", "dark");
    expect(button).toHaveAttribute("data-resolved-theme", "dark");
  });

  it("renders a switch-style control and toggles dark mode directly", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(THEME_STORAGE_KEY, "system");

    render(<ThemeToggle switchStyle />);

    const toggle = await screen.findByRole("switch", { name: /dark mode off/i });

    expect(toggle).toHaveAttribute("data-theme", "system");
    expect(toggle).not.toBeChecked();

    await user.click(toggle);

    await waitFor(() => {
      expect(toggle).toHaveAttribute("data-theme", "dark");
    });

    expect(toggle).toBeChecked();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
