# Frontend Conventions

## Purpose

This codebase is a foundation-first Next.js App Router frontend. It prioritizes an app-owned UI layer, strict TypeScript, editorial design tokens, and clean feature boundaries before product CRUD or backend integration.

## Folder Layout

- `src/app`: Routing, layouts, and metadata only.
- `src/features/<feature>`: Feature-owned screens, local components, tests, and types.
- `src/ui/internal/shadcn`: Generated raw `shadcn` primitives. Treat as implementation detail.
- `src/ui/base`: App-owned wrappers around raw primitives. Feature code imports from here, never from the internal layer.
- `src/ui/composite`: Shared shell and higher-level UI building blocks.
- `src/lib`: Shared non-UI helpers and route metadata.
- `src/test`: Shared testing utilities.
- `e2e`: Playwright smoke coverage.

## Import Boundaries

- Feature modules may import from `@/ui/base`, `@/ui/composite`, `@/lib`, and their own feature subtree.
- Feature modules must not import from `@/ui/internal/shadcn/*`.
- The base layer may import from the internal shadcn layer.
- Route files in `src/app` should import feature screens, not page-specific implementation details from other routes.

The ESLint `no-restricted-imports` rule enforces the shadcn boundary.

## Theming

- Global tokens live in [globals.css](/C:/Users/sunka/source/repos/BigTechHQ/expensify-app-frontend/src/app/globals.css).
- Use semantic token classes such as `bg-surface-container-low`, `text-muted-foreground`, and `text-title-lg`.
- Avoid hard-coded hex values in feature code. If a new color or elevation token is needed, add it to the global theme layer first.
- The design system and the four sample images under `docs/design/samples/` are the visual reference for page-level composition.

## Routing and Screens

- `src/app/page.tsx` should only redirect.
- `src/app/(workspace)/<route>/page.tsx` should stay thin and render the feature screen.
- Page-aware shell behavior such as nav items and search placeholders belongs in shared route metadata under `src/lib`.

## Testing

- Unit and integration tests live beside the code they validate in `__tests__`.
- Shared render helpers live in `src/test/render.tsx`.
- Prefer screen-level tests for features and shell-level tests for shared UI.
- Playwright covers smoke paths: root redirect, primary navigation, and direct `/chat` access.
