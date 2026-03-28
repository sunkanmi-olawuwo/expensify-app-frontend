import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  ThemeProvider,
  THEME_STORAGE_KEY,
  useTheme,
} from "@/lib/theme";
import { setMockPrefersColorScheme } from "@/test/match-media";

function ThemeConsumer() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div>
      <p>theme:{theme}</p>
      <p>resolved:{resolvedTheme}</p>
      <button onClick={() => setTheme("light")} type="button">
        Set light
      </button>
      <button onClick={() => setTheme("dark")} type="button">
        Set dark
      </button>
      <button onClick={() => setTheme("system")} type="button">
        Set system
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("defaults to system and follows the system color scheme", async () => {
    setMockPrefersColorScheme("dark", { notify: false });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("theme:system")).toBeInTheDocument();
    });

    expect(screen.getByText("resolved:dark")).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("respects a stored dark preference", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    setMockPrefersColorScheme("light", { notify: false });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("theme:dark")).toBeInTheDocument();
    });

    expect(screen.getByText("resolved:dark")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("falls back to system for invalid stored values", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    setMockPrefersColorScheme("dark", { notify: false });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("theme:system")).toBeInTheDocument();
    });

    expect(screen.getByText("resolved:dark")).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
  });

  it("updates the DOM class and persistence when the theme changes", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Set dark" }));

    await waitFor(() => {
      expect(screen.getByText("theme:dark")).toBeInTheDocument();
    });

    expect(screen.getByText("resolved:dark")).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("reacts to system preference changes while in system mode", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("resolved:light")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Set system" }));
    setMockPrefersColorScheme("dark");

    await waitFor(() => {
      expect(screen.getByText("resolved:dark")).toBeInTheDocument();
    });

    expect(screen.getByText("theme:system")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });
});
