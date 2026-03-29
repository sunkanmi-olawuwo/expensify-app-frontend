# Admin Users List

## Overview

Build the fully functional user management screen for the admin console. This replaces the placeholder `AdminUsersScreen` from Phase 1 with a searchable, sortable, paginated user table backed by `GET /api/v1/users`, plus a confirmation-gated delete flow backed by `DELETE /api/v1/users/{id}`.

## Motivation

The admin foundation (Phase 1) established routing, the role guard, shared Zod types, and placeholder screens. Admins can now navigate to `/admin/users` but see only a stub. This phase delivers the first real admin capability: viewing and managing the user directory. The backend endpoints are implemented and documented in `docs/api/frontend-admin-integration-spec.md`.

## User Stories

- As an admin, I want to see a paginated table of all users so I can browse the user directory.
- As an admin, I want to search users by name or email so I can quickly find a specific person.
- As an admin, I want to sort the table by email, first name, last name, or role so I can organize the directory.
- As an admin, I want to filter users by role so I can see only admins or only regular users.
- As an admin, I want to click a user row to navigate to their detail page so I can inspect their financial data.
- As an admin, I want to delete a user with an explicit confirmation step so I don't accidentally remove someone.
- As an admin, I want clear feedback when a delete succeeds or fails so I know the outcome.

## Functional Requirements

1. **Admin Users Service** (`src/features/admin/services/admin-users-service.ts`): Create an API service layer with two functions:
   - `getUsers(filters)` — calls `GET /api/v1/users` with query params mapped from `UserListFilters`. Returns parsed response using the existing `pagedUsersResponseSchema`. Must also extract `X-Pagination-*` headers and use them as the authoritative pagination source.
   - `deleteUser(id)` — calls `DELETE /api/v1/users/{id}`. Returns void on `204`. Throws `ApiError` on failure.

2. **React Query Hooks**:
   - `useAdminUsers(filters)` (`src/features/admin/hooks/use-admin-users.ts`) — wraps `getUsers` in `useQuery`. Query key should include all filter/sort/page params so the cache invalidates correctly when filters change. Enable `keepPreviousData` to avoid layout shift during pagination.
   - `useDeleteUser()` (`src/features/admin/hooks/use-delete-user.ts`) — wraps `deleteUser` in `useMutation`. On success: show a success toast, invalidate the users query cache, and close the delete dialog. On `404`: show an "already deleted" toast and invalidate the cache. On `403`: show an "insufficient permissions" toast. On other errors: show a generic error toast.

3. **Debounced Value Hook** (`src/lib/hooks/use-debounced-value.ts`): Create a generic `useDebouncedValue<T>(value, delayMs)` hook that delays updating the returned value until `delayMs` has elapsed since the last change. Default delay: 300ms. Export from `src/lib/hooks/index.ts`.

4. **Users Table Toolbar** (`src/features/admin/components/users-table-toolbar.tsx`):
   - Search input with debounced query (300ms). Placeholder text: "Search by name or email...". Clears on explicit action.
   - Sort dropdown with options: Email, First Name, Last Name, Role. Each option toggles asc/desc on re-select.
   - Role filter dropdown: All, Admin, User. "All" clears the filter.
   - All controls update the filter state which feeds into the `useAdminUsers` query key.

5. **Users Table** (`src/features/admin/components/users-table.tsx`):
   - Columns: Name (combined first + last), Email, Role.
   - Each row is clickable and navigates to `/admin/users/{userId}`.
   - Each row has a delete action button (icon or text) that opens the delete dialog for that user.
   - Pagination controls at the bottom showing current page, total pages, and page size. Next/previous buttons. Driven by `X-Pagination-*` header values.
   - Empty state when no users match the current filters.
   - Loading state with skeleton rows matching the editorial design.

6. **User Delete Dialog** (`src/features/admin/components/user-delete-dialog.tsx`):
   - Modal confirmation dialog that shows the user's name and email.
   - Requires the admin to explicitly confirm deletion (e.g., "Delete" button with destructive styling).
   - Shows a loading state on the confirm button while the mutation is in-flight.
   - Closes automatically on success or if the user was already deleted (`404`).
   - Cancel button dismisses without action.

7. **Admin Users Screen** (`src/features/admin/screens/admin-users-screen.tsx`):
   - Replace the existing placeholder with the full composition: `PageHeader` (eyebrow "Administration", title "User Management"), `AdminSubNav`, `UsersTableToolbar`, `UsersTable`.
   - Manage filter/sort/page state at the screen level, passing it down to toolbar and table.
   - The delete dialog is rendered at the screen level, controlled by which user (if any) is selected for deletion.

## API Contract

### GET /api/v1/users

- Query params: `SearchQuery`, `SortBy` (Email|FirstName|LastName|Role), `SortOrder` (asc|desc), `FilterBy` (role), `FilterQuery`, `Page`, `PageSize`
- Response body: `{ page, pageSize, totalCount, curentPage, totalPages, users: AdminUserListItem[] }`
- Pagination headers (authoritative): `X-Pagination-CurrentPage`, `X-Pagination-PageSize`, `X-Pagination-TotalCount`, `X-Pagination-TotalPages`
- Backend defaults: invalid sort falls back to email asc, invalid page to 1, invalid pageSize to 10

### DELETE /api/v1/users/{id}

- Path param: user GUID
- Success: `204 No Content`
- Errors: `401` (unauthenticated), `403` (missing claim), `404` (user not found), `429` (rate limited)

## Non-Functional Requirements

- Search input must debounce at 300ms to avoid excessive API calls during typing.
- Pagination must use `keepPreviousData` to prevent layout shift when changing pages.
- The delete mutation must not allow double-submission (disable confirm button while in-flight).
- All new components must pass `pnpm typecheck` and `pnpm lint`.
- Table skeleton loading should match the editorial design system (surface tiers, no shimmer).

## UI / UX Guidelines

- The users table follows the editorial design language: no 1px borders between rows, use background color shifts (`surface-container-low` for the table container, `surface` for rows) and tonal layering.
- Sort and filter controls should use existing `Select` or `DropdownMenu` base components from `src/ui/base/`.
- The search input should use an existing `Input` component with a search icon.
- The delete dialog should use existing `AlertDialog` or `Dialog` base components with destructive button styling.
- Pagination controls should be minimal: previous/next arrows with a "Page X of Y" label.
- Row hover state should use `hover:bg-surface-container-low` for subtle feedback.
- The delete action in each row should use a muted icon that becomes more prominent on row hover.

## Integration Points

- **Existing Zod types** (`src/features/admin/types/index.ts`): `adminUserListItemSchema`, `pagedUsersResponseSchema`, `userListFiltersSchema`, `AdminUserListItem`, `PagedUsersResponse`, `UserListFilters` — all defined in Phase 1.
- **HTTP client** (`src/lib/api/http-client.ts`): Use the existing fetch-based client which handles auth headers, 401 refresh, and 429 rate limiting automatically.
- **Toast system**: Use the existing toast notification system for success/error feedback.
- **ApiError** (`src/lib/api/api-error.ts`): Use `isNotFound()`, `isForbidden()` helpers for error-specific handling in the delete mutation.
- **AdminSubNav** (`src/features/admin/components/admin-sub-nav.tsx`): Already built in Phase 1, rendered inside the screen.

## Out of Scope

- User detail page content (Phase 4).
- Editing user profiles or roles (no backend endpoint exists).
- Bulk delete or bulk actions.
- CSV/Excel export of the user list.
- Real-time updates or WebSocket-driven table refresh.
- Admin-specific loading skeletons beyond table rows (Phase 5).

## Acceptance Criteria

- [ ] `/admin/users` displays a paginated table of users fetched from `GET /api/v1/users`.
- [ ] Typing in the search input filters users after a 300ms debounce.
- [ ] Selecting a sort option re-fetches with the correct `SortBy` and `SortOrder` params.
- [ ] Selecting a role filter re-fetches with `FilterBy=role` and the correct `FilterQuery`.
- [ ] Clicking a table row navigates to `/admin/users/{userId}`.
- [ ] Clicking the delete action on a row opens a confirmation dialog showing the user's name and email.
- [ ] Confirming deletion calls `DELETE /api/v1/users/{id}` and removes the row on `204`.
- [ ] A `404` response during delete closes the dialog, shows an "already deleted" toast, and refreshes the table.
- [ ] A `403` response during delete shows an "insufficient permissions" toast.
- [ ] Pagination controls correctly navigate between pages using header-derived page counts.
- [ ] The table shows a loading skeleton while fetching and an empty state when no users match.
- [ ] All new files pass `pnpm typecheck`, `pnpm lint`, and `pnpm test`.
- [ ] Unit tests cover: `useDebouncedValue` behavior, delete mutation error handling, toolbar filter state changes.
