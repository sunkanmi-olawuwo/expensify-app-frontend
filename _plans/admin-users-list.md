# Admin Users List

## Summary

- Build the first functional admin screen on top of the existing `/admin/users` route: a searchable, sortable, paginated user directory plus confirmation-gated delete.
- Keep this slice scoped to the current auth model: role-based admin access only, local screen state only, no URL query sync.
- Replace the current placeholder `AdminUsersScreen` with the real screen composition while preserving the existing admin route shell and sub-navigation.

## Key Changes

- Fix the shared admin paged-response contract so backend `curentPage` is normalized to frontend `currentPage` in the reusable schema helper, not only in users-specific code.
- Add a small pagination-header parser and treat `X-Pagination-*` header values as the primary pagination source, with body metadata only as fallback if headers are missing or invalid.
- Add `src/features/admin/services/admin-users-service.ts` with:
  - `getUsers(filters)` mapping frontend filter state to backend PascalCase query params: `SearchQuery`, `SortBy`, `SortOrder`, `FilterBy`, `FilterQuery`, `Page`, `PageSize`
  - `deleteUser(id)` calling `DELETE /api/v1/users/{id}` and resolving only on `204`
- Add users query infrastructure:
  - stable users query keys built from normalized filter values
  - `useAdminUsers(filters)` using TanStack Query v5 `placeholderData: keepPreviousData` to preserve the previous page during pagination
  - `useDeleteUser()` owning success/error toast behavior and invalidating the users list on `204` and `404`
- Extend the shared QueryClient error handling to support a query/mutation `meta` flag that suppresses the default generic error toast. Use that in the delete mutation so custom 403/404 messaging does not double-toast with the global handler.
- Add `src/lib/hooks/use-debounced-value.ts` and export it from `src/lib/hooks/index.ts`. Use it only for the search term with a default delay of `300ms`.
- Replace the placeholder users screen with a composed client screen that owns local state for:
  - `searchQuery`
  - `sortBy`
  - `sortOrder`
  - `filterBy`
  - `filterQuery`
  - `page`
  - fixed `pageSize`
  - selected user for deletion
- Add reusable base `Select` and `AlertDialog` wrappers from the installed Radix package, then use them in this slice instead of feature-local primitives.
- Implement the toolbar with:
  - search input plus explicit clear action
  - role filter select: `All`, `Admin`, `User`
  - sort as a `Sort by` select plus a separate asc/desc toggle button
  - page reset to `1` whenever debounced search, role filter, or sort changes
- Implement the users table with:
  - desktop table and mobile card layout following the existing editorial table patterns
  - columns: combined name, email, role, row action
  - clickable row navigation to `/admin/users/{userId}`
  - delete button that stops row navigation
  - previous/next pagination with `Page X of Y` and visible page size from normalized pagination metadata
  - loading skeleton rows and empty state
- Implement the delete dialog at screen level with the selected user snapshot. The confirm button is destructive, disabled while pending, closes on `204` and `404`, and stays open on `403` or other failures.

## Public APIs And Types

- Update the shared paged-response schema/helper so consumers always see `currentPage` even though the backend body sends `curentPage`.
- Introduce a normalized admin users service result that returns `{ users, pagination }` so components do not parse headers directly.
- Add `useDebouncedValue<T>(value, delayMs = 300)`.
- Add `useAdminUsers(filters)` keyed by normalized filter state.
- Add `useDeleteUser()` with custom toast handling and users-query invalidation.
- Add a shared QueryClient convention allowing query/mutation `meta` to suppress the default global error toast when a feature handles errors explicitly.

## Test Plan

- Schema tests for `curentPage` normalization and pagination-header parsing/fallback behavior.
- Service tests for correct query-param casing, omission of empty params, header-first pagination, and delete `204` handling.
- Hook tests for:
  - `useDebouncedValue` timing with fake timers
  - `useAdminUsers` cache-key changes across filter, sort, and page updates
  - `useDeleteUser` success, `404`, `403`, and generic-failure branches, including prevention of duplicate global error toasts
- Component tests for:
  - toolbar interactions resetting page to `1` and updating filters
  - row click navigating to detail
  - delete button not triggering row navigation
  - dialog close behavior on success and already-deleted cases
  - empty and loading states
- Verification run:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`

## Assumptions

- Delete affordances remain visible to admin-role users even if the backend later rejects with `403`; this slice does not add granular claim decoding to auth state.
- Table state remains local to the screen and is not mirrored into the URL.
- Page size is fixed for v1; the UI displays the active page size from headers but does not offer a page-size selector.
- The current admin foundation route wrappers, sidebar wiring, and `AdminSubNav` remain in place; this feature only replaces the `/admin/users` placeholder with functional content.
