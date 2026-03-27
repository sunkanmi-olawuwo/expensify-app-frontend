# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expensify is a personal finance workspace built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. It follows an editorial, high-end design aesthetic — not a typical FinTech template.

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm test             # Vitest (single run)
pnpm test:watch       # Vitest (watch mode)
pnpm test:e2e         # Playwright E2E tests
pnpm format           # Prettier
```

Package manager is **pnpm** (pinned 10.32.1). Do not use npm or yarn.

## Architecture

### Route Structure (Next.js App Router)

- `src/app/(public)/` — Unauthenticated pages (login, signup, forgot-password, reset-password, home)
- `src/app/(workspace)/` — Authenticated pages wrapped in `AuthGuard` (dashboard, transactions, analytics, settings, chat)
- Route files should be thin — import and render a feature screen, nothing more.

### Feature Modules (`src/features/`)

Each feature is self-contained: `screens/`, `components/`, `types/`, `__tests__/`, and a barrel `index.ts`. Features export screens and types.

### UI Layer (`src/ui/`)

Three-tier component architecture:

1. **`ui/internal/shadcn/`** — Raw shadcn/ui primitives. Treat as private — never import directly from feature code.
2. **`ui/base/`** — App-owned wrappers around shadcn primitives. This is what features import.
3. **`ui/composite/`** — Higher-level building blocks (AppShell, AppSidebar, TopBar, MetricCard, SurfaceCard, PageHeader, etc.).

ESLint enforces the shadcn import boundary via `no-restricted-imports`.

### Shared Libraries (`src/lib/`)

- **`api/http-client.ts`** — Fetch-based HTTP client with auto auth headers, 401 token refresh, and 429 rate-limit handling. Base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`).
- **`api/query-client.tsx`** — TanStack React Query v5 provider. Default staleTime 30s, 1 retry for queries, 0 for mutations.
- **`api/api-error.ts`** — `ApiError` class following RFC 7807 ProblemDetails. Has helpers: `isUnauthorized()`, `isValidation()`, `isForbidden()`, `isNotFound()`.
- **`api/types.ts`** — Shared API types including `PaginatedResponse<T>` and `ApiRequestOptions`.
- **`auth/`** — Auth context, service, guard, and localStorage-based token store (keys prefixed `expensify.auth.*`).
- **`app-shell.ts`** — Route metadata (page titles, nav items, search placeholders). `AppRoute` type is a union of all routes.

### Testing (`src/test/`)

- `setup.ts` — Mocks `next/navigation`, clears localStorage between tests.
- `render.tsx` — Custom render wrapping `QueryClientProvider`, `AuthProvider`, `TooltipProvider`.
- Tests live in `__tests__/` directories beside the code they test.
- E2E tests live in `e2e/` and run against `http://127.0.0.1:3000`.

## Import Order (ESLint-enforced)

1. Builtin (`node:*`)
2. External (`node_modules`)
3. Internal (`@/*`)
4. Relative (parent/sibling)
5. Type imports

Path alias: `@/*` maps to `./src/*`.

## Design System Rules

The app uses an editorial design language with CSS custom property tokens in `globals.css`. Key rules:

- **No 1px solid borders.** Boundaries are defined through background color shifts (`surface-container-*` tiers) and tonal layering.
- **No pure black shadows.** Use tinted `on-surface` variants at 4–8% opacity with 24–40px blur.
- Use semantic token classes: `bg-surface-container-low`, `text-muted-foreground`, `text-title-lg`, etc.
- No hard-coded hex values in feature code — add tokens to the theme layer first.
- Typography uses **Manrope** (`font-display`) for headlines/display and **Inter** for body/labels.
- Dashed borders are reserved exclusively for "add new" affordances.
- Icons: Lucide React, default 20px inline / 24px nav / 32px feature cards.
- Currency: always formatted with commas and two decimal places (e.g., `$142,850.00`).

Full design spec: `docs/design/DESIGN.md`. Architecture conventions: `docs/architecture/frontend-conventions.md`.

## Provider Stack

Root layout wraps the app in this order: `QueryClientProvider` → `AuthProvider` → `TooltipProvider`.

## API Integration

Backend API spec for auth endpoints is in `docs/api/auth-api-spec.md`. Token refresh is automatic via the HTTP client on 401 responses.
