"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  isTheme,
  resolveTheme,
  THEME_MEDIA_QUERY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "./shared";

import type { ReactNode } from "react";

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme;
  setTheme: (nextTheme: Theme) => void;
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isTheme(storedTheme) ? storedTheme : "system";
  } catch {
    return "system";
  }
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  if (typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

function readDomResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  const datasetTheme = document.documentElement.dataset.themeResolved;

  if (datasetTheme === "light" || datasetTheme === "dark") {
    return datasetTheme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors and keep the in-memory theme state.
  }
}

function applyResolvedTheme(theme: Theme, resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
  root.dataset.themePreference = theme;
  root.dataset.themeResolved = resolvedTheme;
}

function enableThemeTransitions() {
  if (typeof document === "undefined") {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const root = document.documentElement;

  root.classList.add("theme-animating");

  window.setTimeout(() => {
    root.classList.remove("theme-animating");
  }, 220);
}

function getInitialThemeState() {
  const theme = readStoredTheme();
  const hasDomResolvedTheme =
    typeof document !== "undefined" &&
    (document.documentElement.dataset.themeResolved === "light" ||
      document.documentElement.dataset.themeResolved === "dark");

  return {
    systemTheme: hasDomResolvedTheme ? readDomResolvedTheme() : getSystemTheme(),
    theme,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeState, setThemeState] = useState(getInitialThemeState);
  const { systemTheme, theme } = themeState;
  const resolvedTheme = resolveTheme(theme, systemTheme);

  useEffect(() => {
    applyResolvedTheme(theme, resolvedTheme);
    writeStoredTheme(theme);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      const nextSystemTheme: ResolvedTheme = event.matches ? "dark" : "light";

      enableThemeTransitions();
      setThemeState((currentThemeState) =>
        currentThemeState.systemTheme === nextSystemTheme
          ? currentThemeState
          : {
              ...currentThemeState,
              systemTheme: nextSystemTheme,
            },
      );
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
    } else {
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQueryList.removeEventListener === "function") {
        mediaQueryList.removeEventListener("change", handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      resolvedTheme,
      setTheme: (nextTheme: Theme) => {
        if (nextTheme === theme) {
          return;
        }

        enableThemeTransitions();
        setThemeState((currentThemeState) => ({
          ...currentThemeState,
          theme: nextTheme,
        }));
      },
      theme,
    }),
    [resolvedTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
