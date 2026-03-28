# Dark Mode

## Summary

- Add app-wide dark mode using the existing token-driven styling system rather than per-screen overrides.
- Introduce a shared theme provider that supports `light`, `dark`, and `system`, persists the user preference, and applies the `.dark` class to `<html>`.
- Add a shared theme toggle to both workspace and public navigation, eliminate flash-of-wrong-theme before hydration, and keep tests defaulting to light mode.

## Key Changes

- **Theme system**
  - Add a shared theme module under `src/lib/theme` with:
    - `Theme = "light" | "dark" | "system"`
    - `ResolvedTheme = "light" | "dark"`
    - `ThemeProvider`
    - `useTheme()`
  - Store the user preference in `localStorage` under `expensify.theme`.
  - On mount, read the stored preference, fall back to `system`, resolve system mode with `window.matchMedia("(prefers-color-scheme: dark)")`, and apply or remove `.dark` on `document.documentElement`.
  - Subscribe to `matchMedia` changes only while the saved theme is `system`.
  - Wrap the existing provider stack in `src/app/layout.tsx` with `ThemeProvider`.
  - Add an inline `<script>` in the root layout `<head>` that mirrors the provider's resolution logic and applies `.dark` before hydration to avoid flash-of-wrong-theme.

- **Global tokens and styling**
  - Extend `src/app/globals.css` with a full `.dark` token block that reassigns every existing CSS custom property, including:
    - surface and container tiers
    - card and popover tokens
    - primary, secondary, muted, accent, and destructive colors
    - border, input, ring, outline, and ghost-border tokens
    - ambient shadow tokens
    - sidebar tokens
    - chart tokens
  - Keep the dark palette in the same editorial blue-grey family, using deep navy and charcoal surfaces rather than pure black.
  - Add dark overrides for the body background gradient, `bg-editorial-grid`, sidebar scrollbar colors, and `::selection`.
  - Apply short theme transitions for color and background-color on the app chrome so switching feels polished without animating layout.
  - Use a more saturated dark hero gradient to preserve visual impact on the dashboard.
  - Use slightly brighter chart tokens in dark mode so series remain distinguishable on dark backgrounds.

- **UI integration**
  - Add a shared `ThemeToggle` component under `src/ui/composite` and export it through the composite index.
  - Implement the toggle as a keyboard-accessible button that cycles `light -> dark -> system -> light`, with:
    - an accessible `aria-label`
    - a visible icon for the active mode (`Sun`, `Moon`, `Monitor`)
    - a subtle icon rotation and scale transition on change
  - Place the toggle in the sidebar footer in `src/ui/composite/app-sidebar.tsx` near the support and logout actions.
  - Place the toggle in the public top navigation in `src/ui/composite/public-navbar.tsx`.
  - Include the toggle in the public mobile sheet as well so theme switching remains available on small screens.
  - Let the workspace mobile nav inherit the toggle automatically through `AppSidebar`.

## Public Interfaces

- Add and export the theme module's public contract:
  - `ThemeProvider`
  - `useTheme()`
  - `Theme`
  - `ResolvedTheme`
- Persist browser state only through `localStorage["expensify.theme"]` with values `"light"`, `"dark"`, or `"system"`.

## Test Plan

- Add theme provider tests under `src/lib/theme/__tests__` covering:
  - default behavior with no stored preference
  - stored `light` and `dark` preferences
  - invalid stored values falling back to `system`
  - `setTheme()` updating provider state, `localStorage`, and the `<html>` class
  - `system` mode responding to mocked `matchMedia` changes
- Add theme toggle tests under `src/ui/composite/__tests__` covering:
  - icon and accessible label rendering
  - cycling through all three modes
  - persistence updates after interaction
- Update `src/test/render.tsx` to include `ThemeProvider` in the shared test wrapper.
- Update `src/test/setup.ts` with a stable `matchMedia` mock for `prefers-color-scheme`, keeping the default test environment in light mode.
- Update existing `AppSidebar` and `PublicNavbar` tests to verify the toggle renders in the intended placement.
- Run `pnpm test`, `pnpm typecheck`, and `pnpm lint` after implementation.

## Assumptions

- The theme control should be a single cycle button, not a dropdown or segmented control.
- Existing screens should adapt through token changes first; per-screen dark-mode overrides are only added if a specific contrast issue is discovered.
- The pre-hydration script will closely mirror the provider logic so hydration stays consistent.
- No new runtime dependencies are needed for theming, persistence, or theme detection.
