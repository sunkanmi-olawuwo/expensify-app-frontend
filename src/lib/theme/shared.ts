export const THEME_STORAGE_KEY = "expensify.theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const themeValues = ["light", "dark", "system"] as const;

export type Theme = (typeof themeValues)[number];
export type ResolvedTheme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themeValues.includes(value as Theme);
}

export function getNextTheme(theme: Theme): Theme {
  switch (theme) {
    case "light":
      return "dark";
    case "dark":
      return "system";
    default:
      return "light";
  }
}

export function resolveTheme(
  theme: Theme,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}
