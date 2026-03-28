# Admin Panel

## Summary

- Build a claim-gated admin console within the existing workspace layout, covering user management, financial drill-down, and system catalog administration.
- The backend surface is defined in `docs/api/frontend-admin-integration-spec.md` — 12 implemented endpoints and 3 planned investment endpoints.
- Implementation follows the established feature-module pattern with TanStack React Query hooks, Zod-validated types, and the editorial design system.

## Route Structure

All routes nest under `(workspace)/admin/`, inheriting `AuthGuard` and `AppShell`:

```
src/app/(workspace)/admin/
  layout.tsx              → AdminGuard (checks role === "Admin", redirects otherwise)
  page.tsx                → redirect to /admin/users
  users/page.tsx          → AdminUsersScreen
  users/[userId]/page.tsx → AdminUserDetailScreen
  catalogs/page.tsx       → AdminCatalogsScreen
```

## Feature Module Structure

```
src/features/admin/
  index.ts                          → barrel exports
  types/
    index.ts                        → Zod schemas + inferred TS types
  services/
    admin-users-service.ts          → GET /users, DELETE /users/{id}
    admin-catalogs-service.ts       → currencies + timezones CRUD
    admin-expenses-service.ts       → user expenses, income, monthly summaries
  hooks/
    use-admin-users.ts              → useQuery for paginated user list
    use-delete-user.ts              → useMutation for user deletion
    use-admin-currencies.ts         → useQuery + useMutation for currencies
    use-admin-timezones.ts          → useQuery + useMutation for timezones
    use-admin-user-expenses.ts      → useQuery for user expenses + summary
    use-admin-user-income.ts        → useQuery for user income + summary
  components/
    admin-guard.tsx                 → role-based access gate component
    admin-sub-nav.tsx               → horizontal tab nav (Users | Catalogs)
    users-table.tsx                 → paginated, sortable, searchable user table
    users-table-toolbar.tsx         → search input, sort controls, filter by role
    user-delete-dialog.tsx          → confirmation dialog for user deletion
    user-summary-header.tsx         → user profile card on detail page
    user-detail-tabs.tsx            → tab container (Expenses | Income)
    user-expenses-tab.tsx           → expenses table + filters + monthly summary
    user-income-tab.tsx             → income table + filters + monthly summary
    catalogs-currency-tab.tsx       → currency list with active toggle
    catalogs-timezone-tab.tsx       → timezone list with active toggle
    catalog-form-modal.tsx          → Sheet modal for create/edit currency or timezone
  screens/
    admin-users-screen.tsx
    admin-user-detail-screen.tsx
    admin-catalogs-screen.tsx
```

## Screen Breakdown

### Admin / Users (`/admin/users`)

- `PageHeader` — eyebrow: "Administration", title: "User Management"
- `UsersTableToolbar` — debounced search (300ms), sort dropdown (Email, FirstName, LastName, Role), role filter
- `UsersTable` — columns: Name, Email, Role. Row actions: View (navigate to detail), Delete (open dialog). Pagination at bottom using `X-Pagination-*` headers as authoritative source.
- `UserDeleteDialog` — requires explicit confirmation, removes row only after `204`, refreshes table on `404`

### Admin / Users / {userId} (`/admin/users/[userId]`)

- `UserSummaryHeader` — `SurfaceCard` showing user name, email, role (data from the users list row, passed via query params or cached from list query)
- `UserDetailTabs` — client-side tab toggle between Expenses and Income
- `UserExpensesTab` — month picker (`yyyy-MM`), filter bar (category, merchant, payment method, amount range, tags), expenses table, `MetricCard` for monthly summary (total, count, category breakdown)
- `UserIncomeTab` — month picker, filter bar (source, type, amount range), income table, monthly summary card (total, count, type breakdown)

### Admin / Catalogs (`/admin/catalogs`)

- `PageHeader` — eyebrow: "Administration", title: "System Catalogs"
- Tab toggle: Currencies | Timezones
- `CatalogsCurrencyTab` — table (code, name, symbol, minorUnit, active, default, sortOrder). "Add Currency" button. Row click opens edit Sheet. Always fetches with `includeInactive=true`.
- `CatalogsTimezoneTab` — table (IANA ID, display name, active, default, sortOrder). Same pattern.
- `CatalogFormModal` — `Sheet` component (slide-in panel). Form fields adapt for currency vs timezone. Zod validation matching backend rules. Special handling: default currency/timezone cannot be deactivated — show warning and disable toggle.

## Auth Strategy

Layered approach:

1. **Route-level** — `AdminGuard` component in `admin/layout.tsx` reads `useAuth()`, checks `user.role === "Admin"`, redirects to `/dashboard` if not. This sits on top of the existing `AuthGuard` in the workspace layout.
2. **Nav-level** — Conditionally render admin nav items in `AppSidebar` only when `user.role === "Admin"`. Admin section should be visually separated with a divider/label. Icon: `Shield` from lucide-react.
3. **API-level** — Backend enforces granular `admin:*` claims. Frontend does not check individual claims. If backend returns `403`, existing `ApiError` handling surfaces it via toast with "insufficient permissions" message.

## Key Technical Decisions

- **`curentPage` misspelling** — Define the Zod schema with `curentPage` matching the API, then apply a `.transform()` to output `currentPage`. All hooks and components see the correct spelling.
- **Pagination source of truth** — Use `X-Pagination-*` response headers for table pagination controls, not the body fields.
- **Timezone IANA ID encoding** — URL-encode `ianaId` in the service layer via `encodeURIComponent()` since IDs contain `/` (e.g., `Europe/London`).
- **Catalog modals** — Use existing `Sheet` component for create/edit forms (editorial slide-in panel, not centered dialog).
- **Search debounce** — Create `useDebouncedValue` hook in `src/lib/hooks/` for the user search input.
- **No nested layout for sub-nav** — Use component-level tab bars per screen rather than a Next.js nested layout, since Users and Catalogs screens have different enough structures.
- **Period handling** — Admin month picker emits `yyyy-MM`. Do not assume calendar-month semantics — periods are shifted by target user's `monthStartDay`.
- **Investment endpoints** — Marked as planned. Create placeholder UI with "Coming Soon" state. Do not build service/hook layer until backend is implemented.

## Error Handling

Follow existing `ApiError` patterns:

| Status | Frontend Behavior |
|--------|-------------------|
| `401` | Automatic token refresh via HTTP client, then retry |
| `403` | Toast: "insufficient permissions", hide the failed action |
| `400` | Inline form/filter error from `ProblemDetails.detail` |
| `404` | Toast: "item no longer exists", refresh the list |
| `409` | Toast: retryable conflict message |
| `429` | Toast: "rate limited, try again later" |

## API Endpoints Matrix

| # | Method | Endpoint | Claim | Status |
|---|--------|----------|-------|--------|
| 1 | GET | `/v1/users` | `admin:users:read` | Implemented |
| 2 | DELETE | `/v1/users/{id}` | `admin:users:delete` | Implemented |
| 3 | GET | `/v1/currencies` | `admin:users:preferences:manage` | Implemented |
| 4 | POST | `/v1/currencies` | `admin:users:preferences:manage` | Implemented |
| 5 | PUT | `/v1/currencies/{code}` | `admin:users:preferences:manage` | Implemented |
| 6 | GET | `/v1/timezones` | `admin:users:preferences:manage` | Implemented |
| 7 | POST | `/v1/timezones` | `admin:users:preferences:manage` | Implemented |
| 8 | PUT | `/v1/timezones/{ianaId}` | `admin:users:preferences:manage` | Implemented |
| 9 | GET | `/v1/expenses/users/{userId}` | `admin:expenses:read` | Implemented |
| 10 | GET | `/v1/expenses/users/{userId}/summary/monthly` | `admin:expenses:read` | Implemented |
| 11 | GET | `/v1/income/users/{userId}` | `admin:income:read` | Implemented |
| 12 | GET | `/v1/income/users/{userId}/summary/monthly` | `admin:income:read` | Implemented |
| 13 | GET | `/v1/investments/categories` | `investments:read` | Planned |
| 14 | PUT | `/v1/admin/investments/categories/{id}` | `admin:investments:manage-categories` | Planned |
| 15 | GET | `/v1/admin/investments` | `admin:investments:read` | Planned |

## Phased Implementation

### Phase 1 — Foundation

1. Create `src/features/admin/types/index.ts` with all Zod schemas and inferred types
2. Create `admin-guard.tsx` component
3. Create `src/app/(workspace)/admin/layout.tsx` wrapping children in `AdminGuard`
4. Create route `page.tsx` files as thin wrappers importing screens
5. Update `src/lib/app-shell.ts` to add admin nav items (`Shield` icon)
6. Update `src/ui/composite/app-sidebar.tsx` to conditionally render admin nav for Admin role
7. Create `admin-sub-nav.tsx` horizontal tab component
8. Create placeholder screens rendering `PageHeader` only

### Phase 2 — Users List

1. Create `admin-users-service.ts` (GET users, DELETE user)
2. Create `use-admin-users.ts` and `use-delete-user.ts` hooks
3. Create `useDebouncedValue` hook in `src/lib/hooks/`
4. Build `UsersTableToolbar` with search, sort, and role filter
5. Build `UsersTable` with pagination controls
6. Build `UserDeleteDialog` with confirmation flow
7. Assemble `AdminUsersScreen`

### Phase 3 — Catalogs

1. Create `admin-catalogs-service.ts` (currencies + timezones CRUD)
2. Create `use-admin-currencies.ts` and `use-admin-timezones.ts` hooks
3. Build `CatalogsCurrencyTab` with table and active/default indicators
4. Build `CatalogsTimezoneTab` with table
5. Build `CatalogFormModal` using `Sheet` with adaptive form fields and Zod validation
6. Assemble `AdminCatalogsScreen`

### Phase 4 — User Detail

1. Create `admin-expenses-service.ts` (expenses, income, monthly summaries)
2. Create `use-admin-user-expenses.ts` and `use-admin-user-income.ts` hooks
3. Build `UserSummaryHeader` card
4. Build `UserExpensesTab` with month picker, filters, table, and summary card
5. Build `UserIncomeTab` with month picker, filters, table, and summary card
6. Build `UserDetailTabs` container
7. Assemble `AdminUserDetailScreen`

### Phase 5 — Polish & Testing

1. Add unit tests in `__tests__/` directories following existing patterns
2. Add empty states for all tables and tabs
3. Add loading skeletons matching the editorial design
4. Add error boundaries per screen
5. Stub investment placeholders with "Coming Soon" state
6. E2E tests for critical admin flows (user list, delete, catalog CRUD)

## Known Gaps (Backend Not Available)

- No admin endpoint to fetch a full user profile by ID — detail page header uses cached list data
- No admin endpoint to edit another user's profile or role
- No admin endpoint to CRUD another user's expenses or income
- Investment endpoints are planned but not implemented
- No aggregate admin dashboard endpoint across all users
