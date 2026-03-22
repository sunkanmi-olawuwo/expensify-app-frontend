# Bootstrap the expensify Frontend Foundation

## Summary

- Bootstrap the empty repo into a `pnpm`-managed Next.js App Router app using `src/`, strict TypeScript, Tailwind, and the latest stable framework and dependency releases verified at implementation time.
- Keep this pass strictly foundational: shared app shell, feature route placeholders, theme tokens, component ownership rules, and test/tooling scaffolding. Do not build product CRUD, auth, CSV import, or AI data wiring yet.
- Align the initial shell to the docs: `/dashboard`, `/transactions`, `/analytics`, `/settings`, and a real `/chat` route that is intentionally omitted from primary navigation until design catches up.
- Treat the design samples as visual inspiration during page design: [dashboard.png](/C:/Users/sunka/source/repos/BigTechHQ/expensify-app-frontend/docs/design/samples/dashboard.png) for dashboard composition, [transaction_history.png](/C:/Users/sunka/source/repos/BigTechHQ/expensify-app-frontend/docs/design/samples/transaction_history.png) for transactions, [analytics.png](/C:/Users/sunka/source/repos/BigTechHQ/expensify-app-frontend/docs/design/samples/analytics.png) for analytics, and [log_transaction.png](/C:/Users/sunka/source/repos/BigTechHQ/expensify-app-frontend/docs/design/samples/log_transaction.png) for transaction-entry flows.

## Key Technical Decisions

- Drop `exactOptionalPropertyTypes` — breaks React/Next.js type definitions. Defer to a future strictness pass.
- Use temp-directory strategy for `create-next-app` since the repo root already has files (`docs/`, `.gitignore`, `README.md`).
- Use `eslint-plugin-import-x` instead of `eslint-plugin-import` (flat config compatibility).
- Add `.gitattributes` first (critical for LF line endings on Windows).
- Use `next/font/google` for Inter + Manrope font loading with CSS variable injection.
- Use the latest stable releases for all direct dependencies and dev dependencies, verified on March 22, 2026, instead of older starter defaults.
- Verified baseline on March 22, 2026: Next.js `16.2.1`, React `19.2.4`, TypeScript `5.9.3`, Tailwind CSS `4.2.2`, `shadcn` CLI v4, ESLint `10.0.2`, Prettier `3.8.1`, Vitest `4.0.17`, Playwright `1.57.0`, and pnpm `10.32.1`.
- Resolve all companion packages to their latest stable compatible releases at scaffold time, including `@testing-library/*`, `jsdom`, ESLint plugins/configs, Prettier plugins, path-alias helpers, and the dependencies introduced by `shadcn`.

---

## Phase 0: Environment Prep

**Step 0.1** — Create `.gitattributes` with LF enforcement and binary handling for images.
**Step 0.2** — Create `.editorconfig` (LF, UTF-8, 2-space indent, trim trailing whitespace).

## Phase 1: Next.js Scaffold

**Step 1.1** — Run `pnpm dlx create-next-app@latest` into a **temp sibling directory** (`../expensify-temp`) with flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes`.
**Step 1.2** — Move scaffold files (`package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `src/`) into the real repo. Discard temp dir's `.git`, `README.md`, `.gitignore`. Delete temp directory.
**Step 1.3** — `pnpm install` in the real repo.
**Step 1.4** — `pnpm build` to verify base scaffold compiles.

## Phase 2: TypeScript Hardening

**Step 2.1** — Tighten `tsconfig.json`: enable `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `forceConsistentCasingInFileNames`. Do NOT add `exactOptionalPropertyTypes`.
**Step 2.2** — `pnpm tsc --noEmit` to verify.

## Phase 3: Fonts, Tokens, and Tailwind

**Step 3.1** — Configure `next/font/google` for Inter and Manrope in `src/app/layout.tsx`, applying CSS variables `--font-inter` and `--font-manrope` to `<html>`.

**Step 3.2** — Replace default `globals.css` with design token foundation (CSS custom properties):

| Token                         | Approx Value | Source                    |
| ----------------------------- | ------------ | ------------------------- |
| `--primary`                   | `#1B2B5B`    | Deep navy from hero card  |
| `--primary-container`         | `#2A3F7A`    | Lighter navy gradient end |
| `--primary-fixed`             | `#6B7EC2`    | Muted blue secondary      |
| `--secondary`                 | `#2D6A4F`    | Forest green (income)     |
| `--error`                     | `#C44536`    | Soft red (expenses)       |
| `--surface`                   | `#FFFFFF`    | Base white                |
| `--surface-container-low`     | `#F5F6FA`    | Card backgrounds          |
| `--surface-container`         | `#ECEEF5`    | Mid-tier                  |
| `--surface-container-high`    | `#E2E5EF`    | Elevated                  |
| `--surface-container-highest` | `#D8DCE8`    | Top tier                  |
| `--surface-bright`            | `#FAFBFF`    | Peak highlights           |
| `--on-surface`                | `#1A2340`    | Text color                |
| `--on-primary`                | `#FFFFFF`    | Text on primary           |
| `--outline-variant`           | `#C4C8D4`    | Ghost borders             |

Plus typography scale tokens, shadow tokens (`ambient-sm`/`ambient-md`/`ambient-lg` at 24-40px blur, 4-8% opacity, tinted `on-surface`), radius tokens, and shadcn-compatible semantic aliases (`--background`, `--foreground`, `--card`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, etc.).

**Step 3.3** — Extend `tailwind.config.ts` with semantic color utilities referencing CSS vars, typography utilities for the 5-level scale (Display-LG through Label-SM), font families (Inter + Manrope), and shadow/radius tokens.

## Phase 4: shadcn/ui Initialization

**Step 4.1** — Init shadcn: `pnpm dlx shadcn@latest init` targeting `src/ui/internal/shadcn` for components and `src/lib/utils.ts` for the `cn()` utility.
**Step 4.2** — Install minimal primitives: `button`, `separator`, `avatar`, `badge`, `input`, `tooltip`, `sheet` — only what the shell needs.
**Step 4.3** — Verify files landed in `src/ui/internal/shadcn/`.

## Phase 5: UI Layer Scaffolding

**Step 5.1** — Create `src/ui/base/` wrappers — thin re-exports for each shadcn primitive. Barrel export at `src/ui/base/index.ts`.

**Step 5.2** — Create `src/ui/composite/` shell components:

- `app-sidebar.tsx` — Fixed 200px sidebar: brand mark ("expensify" with a concise personal finance subtitle), nav items (Dashboard, Transactions, Analytics, Settings with icons), Upgrade to Pro CTA card pinned to bottom, Support/Logout links. Active state via primary color pill.
- `top-bar.tsx` — Spans content area. Search input (contextual placeholder), notification bell (with badge dot), help icon, "+ Add New" primary button, user avatar.
- `app-shell.tsx` — Combines sidebar + top bar + `{children}`. Sidebar fixed left, content area right with top bar above scrollable content.
- `page-header.tsx` — Reusable page title/subtitle component.

**Step 5.3** — Barrel export at `src/ui/composite/index.ts`.

## Phase 6: Routes and Feature Modules

**Step 6.1** — Create `src/app/(workspace)/layout.tsx` — server component rendering `AppShell` around `{children}`. This is the central layout file for all workspace routes.

**Step 6.2** — Scaffold feature modules with `screens/`, `components/`, `types/`, `__tests__/`, `index.ts`:

- `src/features/dashboard/` — placeholder hero card, allocation section, recent ledger
- `src/features/transactions/` — placeholder filter bar and table structure
- `src/features/analytics/` — chart placeholders with spending breakdown
- `src/features/settings/` — settings form placeholder
- `src/features/chat/` — chat interface placeholder

**Step 6.3** — Create thin route files importing feature screens:

```
src/app/(workspace)/dashboard/page.tsx
src/app/(workspace)/transactions/page.tsx
src/app/(workspace)/analytics/page.tsx
src/app/(workspace)/settings/page.tsx
src/app/(workspace)/chat/page.tsx
```

Each is a server component that imports and renders the corresponding feature screen. May set page metadata (title).

**Step 6.4** — `src/app/page.tsx` uses `redirect("/dashboard")` from `next/navigation` (server-side redirect, no client flash).

**Step 6.5** — `pnpm build` to verify all routes compile.

## Phase 7: ESLint (Flat Config)

**Step 7.1** — Install: `eslint-plugin-import-x`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-import-resolver-typescript`, `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`.

**Step 7.2** — Create `eslint.config.mjs` (flat config):

- Next.js + TypeScript strict rules
- Import ordering (builtin → external → internal `@/` → parent → sibling)
- **Restricted imports**: forbid `@/ui/internal/shadcn/*` outside `src/ui/base/` — enforces ownership boundary
- Unused import cleanup
- Testing overrides for `__tests__/` directories

**Step 7.3** — `pnpm lint` to verify.

## Phase 8: Prettier

**Step 8.1** — Install `prettier` + `prettier-plugin-tailwindcss`.
**Step 8.2** — Create `.prettierrc.json` and `.prettierignore` (ignore `node_modules`, `.next`, lock files, `src/ui/internal/shadcn`).
**Step 8.3** — Add `"format": "prettier --write \"src/**/*.{ts,tsx,css,json}\""` script.

## Phase 9: Testing Setup

**Step 9.1** — Install Vitest stack: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.
**Step 9.2** — Create `vitest.config.ts` (jsdom environment, globals, `@/` path alias, setup file reference). Structured so future MSW integration tests can be added without reorganizing.
**Step 9.3** — Create `src/test/setup.ts` (imports `@testing-library/jest-dom/vitest`).
**Step 9.4** — Create `src/test/render.tsx` (custom render wrapper, extensible for providers later).
**Step 9.5** — Install Playwright: `@playwright/test`, then `npx playwright install chromium`.
**Step 9.6** — Create `playwright.config.ts` (base URL `localhost:3000`, webServer: `pnpm dev`, chromium project, output artifacts in `.gitignore`-covered location).
**Step 9.7** — Add scripts: `test`, `test:watch`, `test:e2e`, `typecheck`.

## Phase 10: Tests

**Step 10.1** — Unit: `src/ui/base/__tests__/button.test.tsx` — verify wrapper exports render correctly.
**Step 10.2** — Integration: `src/ui/composite/__tests__/app-sidebar.test.tsx` — verify 4 nav items present, chat absent from nav, brand mark renders, upgrade CTA visible.
**Step 10.3** — Integration: `src/ui/composite/__tests__/app-shell.test.tsx` — verify sidebar + top bar render and children display in content area.
**Step 10.4** — Feature: `src/features/dashboard/__tests__/dashboard-screen.test.tsx` — renders placeholder content.
**Step 10.5** — E2E: `e2e/smoke.spec.ts` — redirect `/` → `/dashboard`, nav clicks work for all 4 pages, `/chat` loads via direct URL but isn't in sidebar nav.

## Phase 11: Node Pinning + Scripts

**Step 11.1** — Create `.nvmrc` with `24` (latest LTS on March 22, 2026, and above Next.js 16's minimum Node `20.9` requirement).
**Step 11.2** — Add `"packageManager"` field to `package.json`, pinned to the verified pnpm `10.32.1` release via Corepack.
**Step 11.3** — Verify all scripts present: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `test:e2e`, `format`.

## Phase 12: Documentation

**Step 12.1** — Update `README.md`: project overview, prerequisites (Node 24 LTS, pnpm 10.32.1), quick start (`pnpm install`, `pnpm dev`), available scripts, link to architecture doc.
**Step 12.2** — Create `docs/architecture/frontend-conventions.md`: folder layout, import boundary rules (who can import from where), token usage guidelines (semantic tokens only, never raw hex), page-vs-feature screen responsibilities, testing strategy, how to add new shadcn components.

## Phase 13: Final Verification

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Then `pnpm test:e2e` for smoke coverage.

Verify `.gitignore` covers: `node_modules/`, `.next/`, `out/`, `coverage/`, `test-results/`, `playwright-report/`, `.env*`, `*.tsbuildinfo`, `next-env.d.ts`.

---

## Public Interfaces and Contracts

- Stable import surfaces: `@/ui/base/*`, `@/ui/composite/*`, `@/features/*`, `@/lib/*`.
- Route surface: `/dashboard`, `/transactions`, `/analytics`, `/settings`, `/chat`, with `/` redirecting to `/dashboard`.
- Quality gates: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.

## Assumptions and Defaults

- Package manager is `pnpm`.
- `/chat` exists as a route and feature module but is hidden from primary navigation.
- This bootstrap adds only the minimal shadcn primitive set needed for the shell; more wrappers are added as real features require them.
- Node and `pnpm` are environment prerequisites; pin via `.nvmrc` and `packageManager` field.
- The implementation should prefer exact current stable releases over conservative starter versions, with the March 22, 2026 baseline above used unless a newer stable release is re-verified at execution time.
- Color token values are approximate (extracted from design samples) and may be refined during design iteration.

## Critical Files

| File                                      | Purpose                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `docs/design/DESIGN.md`                   | Design token source of truth                   |
| `docs/product/product-review-document.md` | PRD defining routes and features               |
| `src/app/(workspace)/layout.tsx`          | Central shell layout (most important new file) |
| `src/app/globals.css`                     | All CSS custom properties / design tokens      |
| `tailwind.config.ts`                      | Semantic utilities mapping                     |
| `src/ui/composite/app-shell.tsx`          | Sidebar + top bar + content composition        |
| `components.json`                         | shadcn path configuration                      |
| `eslint.config.mjs`                       | Import boundary enforcement                    |
