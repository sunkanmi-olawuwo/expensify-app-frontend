# Admin Panel Foundation

## Summary

- Add a new admin route group under the existing workspace shell, with a dedicated admin-only guard and a server-side redirect from `/admin` to `/admin/users`.
- Wire admin navigation into the current shell without changing the main workspace IA: admin links live in a separate `Administration` sidebar section shown only to `Admin` users, and admin screens share a small horizontal sub-nav that scrolls with the page.
- Establish the admin feature boundary now: thin route files, shared page chrome metadata, a feature barrel, placeholder screens, and Zod-backed admin contract types so later phases can add data logic without revisiting the shell.

## Implementation Changes

- **Routing and Guard**
  - Create `src/app/(workspace)/admin/layout.tsx` that wraps children in a new `AdminGuard`.
  - Add thin route files for `admin/page.tsx`, `admin/users/page.tsx`, `admin/users/[userId]/page.tsx`, and `admin/catalogs/page.tsx`.
  - Implement `/admin` as a server redirect to `/admin/users`.
  - Keep route files thin by dynamically importing `AdminUsersScreen`, `AdminUserDetailScreen`, and `AdminCatalogsScreen` from `src/features/admin`.
  - Add `src/lib/auth/admin-guard.tsx` and export it from `src/lib/auth/index.ts`.
  - `AdminGuard` behavior:
    - while auth is hydrating, render `null` to avoid flashing protected content
    - if `user` is missing or `user.role !== "Admin"`, call `router.replace("/dashboard")` and render `null`
    - otherwise render children

- **Shell Metadata and Navigation**
  - Refactor `src/lib/app-shell.ts` so page-chrome route keys are separate from sidebar href types.
  - Keep primary nav href typing limited to real sidebar destinations; do not let `/admin/users/[userId]` leak into the generic nav item type.
  - Add admin page chrome entries for:
    - `/admin/users`
    - `/admin/users/[userId]`
    - `/admin/catalogs`
  - Add pathname normalization or matcher logic so `/admin/users/<id>` resolves to the user-detail chrome entry.
  - Add `adminNavItems` metadata in `src/lib/app-shell.ts` and render it from `AppSidebar`.
  - Place the `Administration` section immediately after primary nav, separated by spacing and a muted label, not by borders.
  - Show admin links only when `user?.role === "Admin"` on both desktop and mobile sidebar render paths.

- **Admin Feature Skeleton**
  - Create `src/features/admin/components/admin-sub-nav.tsx` with two links:
    - `/admin/users`
    - `/admin/catalogs`
  - Use pathname prefix matching so both `/admin/users` and `/admin/users/<id>` activate the `Users` tab.
  - Style the sub-nav as a non-sticky tonal pill group using existing surface tokens; no underline treatment.
  - Create placeholder screen components in `src/features/admin/screens/` for users, user detail, and catalogs.
  - Each screen should render:
    - `PageHeader` with eyebrow `Administration`
    - the shared `AdminSubNav`
    - a centered muted placeholder body inside a subtle surface container
  - Add `src/features/admin/index.ts` exporting the three screens and the admin types module.

- **Shared Admin Types**
  - Create `src/features/admin/types/index.ts` with Zod schemas and inferred types for:
    - `AdminUserListItem`
    - `Currency`
    - `Timezone`
    - `ExpenseListItem`
    - `IncomeListItem`
    - `ExpenseMonthlySummary`
    - `IncomeMonthlySummary`
    - `InvestmentCategory`
    - `InvestmentAccountListItem`
  - Include the summary child-item schemas needed by the monthly summary payloads.
  - Add request/filter schemas and inferred types for:
    - user list filters
    - expense list filters
    - income list filters
  - Implement a reusable paged-response schema/helper that transforms backend `curentPage` into frontend `currentPage`, and use it for users, expenses, and income envelopes.
  - Keep this phase limited to response contracts plus the listed filter param types; do not add API services, React Query hooks, or CRUD request body schemas yet.

## Public Interfaces and Types

- `src/lib/auth/index.ts` gains a new exported `AdminGuard`.
- `src/lib/app-shell.ts` gains admin page-chrome metadata, admin nav metadata, and dynamic route matching for user detail paths.
- `src/features/admin/index.ts` becomes the public entrypoint for admin screens and admin contract types.

## Test Plan

- Add `src/lib/auth/__tests__/admin-guard.test.tsx` for:
  - loading/no-flash behavior
  - admin user renders children
  - non-admin user redirects to `/dashboard`
- Add `src/features/admin/components/__tests__/admin-sub-nav.test.tsx` for:
  - `/admin/users` active tab
  - `/admin/users/<id>` still highlighting `Users`
  - `/admin/catalogs` active tab
- Update `src/ui/composite/__tests__/app-sidebar.test.tsx` to verify:
  - admin section appears for admin users
  - admin section never appears for non-admin users
- Add a focused `src/lib` test for admin page chrome resolution on `/admin/users/<id>`.
- Verify with `pnpm typecheck`, `pnpm lint`, and `pnpm test`.

## Assumptions and Defaults

- Role gating uses `user.role === "Admin"` exactly.
- The admin sub-nav scrolls with page content instead of being sticky.
- The `Administration` sidebar section appears directly after primary navigation.
- Admin placeholder copy stays minimal and editorial; no admin-specific loading skeletons or error boundaries are added in this phase.
- Baseline repo health is acceptable for this work: `pnpm typecheck` and `pnpm test` passed during planning.
