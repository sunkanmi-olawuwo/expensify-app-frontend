# Dark Mode

## Overview

Add a full dark mode to the application, including a dark color palette mapped to all existing CSS custom property tokens, a theme toggle UI, user preference persistence, and system preference detection. The app already defines a `@custom-variant dark (&:is(.dark *))` in `globals.css`, so the infrastructure hook is in place — this feature fills in the dark token values, adds the toggle mechanism, and ensures every screen renders correctly in both themes.

## Motivation

Dark mode is an accessibility and comfort expectation for modern web apps. The current codebase only ships a light palette; the dashboard redesign spec explicitly listed dark mode as out of scope. Users working in low-light environments or who simply prefer dark interfaces currently have no option. Adding dark mode also validates that the design token architecture is truly theme-agnostic.

## User Stories

- As a user, I want to toggle between light and dark themes so I can choose the appearance that suits my environment.
- As a user, I want the app to default to my operating system's color scheme preference so it looks right the first time.
- As a user, I want my theme choice to persist across sessions so I don't have to re-select it every time.
- As a user, I want smooth transitions when switching themes so the experience feels polished, not jarring.

## Functional Requirements

1. **Dark Token Palette**: Define a complete `.dark` selector block in `globals.css` that reassigns every CSS custom property (`--background`, `--foreground`, `--surface`, `--surface-container-*`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--outline-variant`, `--ghost-border`, `--shadow-ambient-*`, `--sidebar-*`, `--chart-*`) to dark-appropriate values. The dark palette must follow the same editorial design language: tonal layering through surface tiers, no pure-black backgrounds (use deep navy/charcoal tones consistent with the primary hue family), and tinted shadows.
2. **Body Background Gradient (Dark)**: Override the `body` background gradient in dark mode to use dark-appropriate radial and linear gradients that maintain the editorial feel.
3. **Editorial Grid Utility (Dark)**: Provide a dark variant of the `bg-editorial-grid` utility so public pages render correctly.
4. **Scrollbar Styling (Dark)**: Update sidebar scrollbar colors for dark mode.
5. **Selection Color (Dark)**: Update `::selection` background for dark mode legibility.
6. **Theme Provider**: Create a `ThemeProvider` context in `src/lib/theme/` that exposes the current theme (`light`, `dark`, `system`) and a `setTheme` function. On mount, it reads the user's saved preference from `localStorage` (key: `expensify.theme`), falling back to the `system` option which defers to `prefers-color-scheme`. It applies or removes the `.dark` class on the `<html>` element accordingly.
7. **Theme Toggle Component**: Add a theme toggle control in `src/ui/composite/` that allows cycling between light, dark, and system modes. The toggle should be accessible (proper `aria-label`, keyboard operable) and display an icon reflecting the current active theme (sun, moon, or monitor).
8. **Toggle Placement**: The theme toggle should appear in the sidebar footer area for authenticated (workspace) pages and in the top navigation for public pages.
9. **Transition Animation**: Apply a short CSS transition (`transition: background-color 200ms, color 200ms`) on theme switch to prevent a harsh flash.
10. **Provider Integration**: Add `ThemeProvider` to the root provider stack, wrapping it around the existing providers.

## API Contract

No backend API is required. Theme preference is stored entirely in `localStorage` under the key `expensify.theme` with values `"light"`, `"dark"`, or `"system"`.

## Non-Functional Requirements

- The dark palette must maintain WCAG 2.1 AA contrast ratios (4.5:1 for body text, 3:1 for large text and UI components) across all token pairings.
- Theme switching must not cause a full page re-render or layout shift.
- The flash-of-wrong-theme (FOWT) on initial page load must be eliminated using an inline script in the root layout `<head>` that reads `localStorage` and applies the `.dark` class before React hydrates.
- No new runtime dependencies. The theme system uses only React context and the DOM API.
- All existing tests must continue to pass with no modifications (the test setup should default to light theme).

## UI / UX Guidelines

- Dark backgrounds should use deep navy/charcoal tones from the primary hue family (blue-grey), not pure `#000000`. Suggested base range: `#0f1324` to `#1a2140`.
- Surface tiers in dark mode step upward in lightness (opposite of light mode), maintaining the same number of tonal layers.
- Primary and secondary accent colors may need slight luminance adjustments to maintain contrast against dark surfaces.
- Shadows in dark mode should be darker and more diffuse, using `rgb(0 0 0 / 0.3–0.5)` instead of the light theme's tinted `on-surface` shadows.
- The theme toggle icon should animate with a subtle rotation/scale transition on change.
- Chart colors should remain distinguishable in dark mode — verify contrast between chart series and the dark chart background.

## Integration Points

- **Root Layout**: `ThemeProvider` wraps the existing provider stack. An inline `<script>` in `<head>` prevents FOWT.
- **AppSidebar**: The theme toggle is placed in the sidebar footer.
- **Public Pages Layout**: The theme toggle is placed in the top navigation area.
- **globals.css**: The `.dark` selector block and dark-mode overrides for body gradient, editorial grid, scrollbar, and selection.

## Out of Scope

- Per-page or per-component theme overrides.
- Scheduling (auto-switch by time of day).
- Custom user-defined color themes beyond light/dark/system.
- High-contrast mode or other accessibility themes.

## Open Questions

- Should the dark mode hero gradient on the dashboard use a lighter or more saturated variant of the primary gradient to maintain visual impact?
- Should charts in dark mode use slightly brighter/more saturated colors to compensate for the dark background, or keep the same token values?

## Acceptance Criteria

- [ ] A `.dark` block in `globals.css` reassigns all CSS custom property tokens to dark-appropriate values.
- [ ] The body background gradient, editorial grid utility, scrollbar styles, and selection color all have dark mode variants.
- [ ] A `ThemeProvider` in `src/lib/theme/` manages theme state, persists preference to `localStorage`, and toggles the `.dark` class on `<html>`.
- [ ] A theme toggle component in `src/ui/composite/` allows switching between light, dark, and system modes with appropriate icons.
- [ ] The toggle appears in the sidebar footer (workspace pages) and top navigation (public pages).
- [ ] System preference (`prefers-color-scheme`) is respected when theme is set to "system".
- [ ] Theme preference persists across page reloads and new sessions.
- [ ] No flash of wrong theme on initial page load.
- [ ] Theme transitions are smooth (no harsh flash on toggle).
- [ ] All text and interactive elements meet WCAG 2.1 AA contrast ratios in dark mode.
- [ ] All existing pages (dashboard, transactions, analytics, settings, chat, login, signup, forgot-password, reset-password, home) render correctly in dark mode with no broken layouts or illegible text.
- [ ] All existing tests pass without modification.
- [ ] TypeScript compiles with no errors and ESLint passes.
- [ ] Unit tests verify the ThemeProvider (default state, toggle, persistence, system preference).
- [ ] Unit tests verify the theme toggle component renders and cycles through modes.
