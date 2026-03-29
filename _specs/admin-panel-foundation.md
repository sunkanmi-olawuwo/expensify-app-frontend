# Admin Panel Foundation

## Overview

Set up the foundational infrastructure for the admin console: route shell, role-based access guard, sidebar navigation integration, admin sub-navigation, shared types, and placeholder screens. This phase delivers no functional admin features but establishes all the wiring so that subsequent phases (Users List, Catalogs, User Detail) can focus purely on feature logic.

## Motivation

The backend already exposes 12 admin endpoints (user management, catalog CRUD, financial drill-down) documented in `docs/api/frontend-admin-integration-spec.md`. The frontend has no admin surface today. Before building any admin screens, the app needs a route group, a role gate, sidebar entries, shared Zod types matching the API contract, and stub screens that prove the plumbing works end-to-end.

## User Stories

- As an admin user, I want to see an "Admin" section in the sidebar so I can navigate to the admin console.
- As a non-admin user, I should not see admin navigation items, and if I manually visit `/admin/*` I should be redirected to the dashboard.
- As an admin user, I want to navigate between Users and Catalogs sub-sections via a horizontal tab bar.
- As an admin user, I want to see placeholder pages with proper headers so I know the admin area is wired up and ready.

## Functional Requirements

1. **Admin Route Group**: Create a `src/app/(workspace)/admin/` route group with its own `layout.tsx` that wraps children in an `AdminGuard` component. The root `admin/page.tsx` should redirect to `/admin/users`. Create thin route files for `users/page.tsx`, `users/[userId]/page.tsx`, and `catalogs/page.tsx`.
2. **AdminGuard Component**: A client component that reads `useAuth()`, checks `user.role === "Admin"`, and redirects to `/dashboard` if the user is not an admin. While the role check is pending (user is null during hydration), render nothing or a loading state to avoid flash of unauthorized content. This component sits inside the existing workspace `AuthGuard`, so the user is guaranteed to be authenticated.
3. **Sidebar Integration**: Add an admin navigation section to `AppSidebar` that is only visible when `user.role === "Admin"`. The section should be visually separated from the primary navigation with a label or divider. Include two nav items: "Users" (`/admin/users`) and "Catalogs" (`/admin/catalogs`). Use the `Shield` icon from lucide-react for the section or items.
4. **App Shell Metadata**: Extend `src/lib/app-shell.ts` to include admin routes in the `AppRoute` type union and add `PageChrome` entries for `/admin/users`, `/admin/users/[userId]`, and `/admin/catalogs` with appropriate eyebrow, title, description, and search placeholder values.
5. **Admin Sub-Navigation**: Create an `AdminSubNav` component that renders a horizontal tab bar with "Users" and "Catalogs" links. The active tab should be visually indicated based on the current pathname. This component is rendered inside each admin screen (not in a nested layout) to keep screen structures independent.
6. **Shared Admin Types**: Create `src/features/admin/types/index.ts` with Zod schemas and inferred TypeScript types for all API response shapes defined in the admin integration spec. This includes:
   - `AdminUserListItem` (id, email, firstName, lastName, role)
   - `PagedUsersResponse` with the `curentPage` misspelling mapped via Zod `.transform()` to `currentPage`
   - `Currency` (code, name, symbol, minorUnit, isActive, isDefault, sortOrder)
   - `Timezone` (ianaId, displayName, isActive, isDefault, sortOrder)
   - `ExpenseListItem` (id, amount, currency, date, categoryId, categoryName, merchant, note, paymentMethod, tagIds, tagNames)
   - `IncomeListItem` (id, amount, currency, date, source, type, note)
   - `ExpenseMonthlySummary` and `IncomeMonthlySummary`
   - `InvestmentCategory` and `InvestmentAccountListItem` (for planned endpoints)
   - Shared pagination envelope type that handles the `curentPage` quirk
   - Request parameter types for user list filters, expense filters, and income filters
7. **Placeholder Screens**: Create three screen components in `src/features/admin/screens/` that render a `PageHeader` with the appropriate eyebrow and title, the `AdminSubNav` component, and a placeholder body indicating the feature is under construction. These screens prove the route, guard, and navigation wiring works.
8. **Feature Barrel**: Create `src/features/admin/index.ts` that exports the three screens and the types module.

## API Contract

This phase does not call any API endpoints. All types are defined proactively to match the backend contract documented in `docs/api/frontend-admin-integration-spec.md`. The key API quirk to handle in the type layer:

- Paginated response bodies use the misspelled field `curentPage` instead of `currentPage`
- Pagination headers (`X-Pagination-CurrentPage`, `X-Pagination-PageSize`, `X-Pagination-TotalCount`, `X-Pagination-TotalPages`) use correct spelling and should be treated as authoritative

## Non-Functional Requirements

- The `AdminGuard` must not flash unauthorized content — render nothing while the auth state is loading.
- Admin nav items must not appear in the sidebar for non-admin users under any circumstance (SSR, hydration, client nav).
- All new files must pass TypeScript type checking and ESLint with the existing configuration.
- The Zod schemas must faithfully represent the API contract so that subsequent phases can use them without modification.
- Admin routes should not affect bundle size for non-admin users — use dynamic imports for admin screens in route files.

## UI / UX Guidelines

- The admin sidebar section should use a muted label (e.g., "Administration") above the nav items, using `text-muted-foreground` and a smaller font size, consistent with the editorial design language.
- The `AdminSubNav` horizontal tab bar should use tonal surface layering for the active state (not a colored underline). Follow the existing design system: `bg-surface-container-low` for the tab group, `bg-surface-container` for active tab, no 1px borders.
- Placeholder screens should show a centered message using `text-muted-foreground` that communicates the section is being built, consistent with the editorial tone.
- Admin `PageHeader` eyebrow text should be "Administration" for all admin screens. Titles: "User Management" for users, "User Detail" for user detail, "System Catalogs" for catalogs.

## Integration Points

- **Workspace Layout** (`src/app/(workspace)/layout.tsx`): Admin routes inherit the existing `AuthGuard` and `AppShell` — no changes needed to the workspace layout itself.
- **AppSidebar** (`src/ui/composite/app-sidebar.tsx`): Needs modification to conditionally render admin nav items.
- **App Shell** (`src/lib/app-shell.ts`): Needs new route types and page chrome entries for admin routes.
- **Auth Context** (`src/lib/auth/`): The `AdminGuard` reads `useAuth()` — no changes needed to the auth module, just consumption of the existing `user.role` field.

## Out of Scope

- Actual data fetching, API service functions, or React Query hooks (Phase 2+).
- User table, delete dialog, or any interactive admin features (Phase 2).
- Catalog CRUD forms or sheets (Phase 3).
- User detail drill-down with expenses and income (Phase 4).
- Investment-related endpoints or UI (planned, not yet implemented on backend).
- Admin-specific error boundaries or loading skeletons (Phase 5).

## Open Questions

- Should the admin sub-nav be sticky at the top of the content area, or scroll with the page content?
- Should the admin sidebar section appear at the top or bottom of the nav list?

## Acceptance Criteria

- [ ] Navigating to `/admin` as an admin user redirects to `/admin/users`.
- [ ] Navigating to `/admin/users`, `/admin/users/{any-id}`, and `/admin/catalogs` as an admin user renders the correct placeholder screen with `PageHeader` and `AdminSubNav`.
- [ ] Navigating to any `/admin/*` route as a non-admin user redirects to `/dashboard`.
- [ ] The sidebar shows an "Administration" section with "Users" and "Catalogs" nav items only for admin users.
- [ ] The sidebar does not show any admin nav items for non-admin users.
- [ ] The `AdminSubNav` correctly highlights the active tab based on the current route.
- [ ] `src/features/admin/types/index.ts` exports Zod schemas and TypeScript types for all endpoint response shapes listed in the admin integration spec.
- [ ] The `curentPage` misspelling in paginated responses is handled via Zod transform, so consuming code uses `currentPage`.
- [ ] All new files pass `pnpm typecheck` and `pnpm lint` with zero errors.
- [ ] Admin screen route files use dynamic imports to avoid bundling admin code for non-admin users.
- [ ] Unit tests verify `AdminGuard` redirects non-admin users and renders children for admin users.
- [ ] Unit tests verify `AdminSubNav` highlights the correct active tab.
