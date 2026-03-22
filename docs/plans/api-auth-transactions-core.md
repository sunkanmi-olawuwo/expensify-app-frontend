# API Client, Auth, Public Pages & Transactions Core

## Summary

- Stand up a robust, typed HTTP client for the external .NET Core API with `ProblemDetails` error handling, auth token injection, and Zod response validation.
- Add TanStack Query for server-state management (caching, background refetch, optimistic updates, deduplication).
- Build authentication flows (login, signup, logout) with JWT token management and route protection.
- Create public pages (home, login, signup) in a `(public)` route group — no sidebar, no auth guard.
- Add a profile page (edit profile, change password) inside the workspace layout.
- Wire transactions to real API service functions, replace placeholder components with interactive CRUD UI (filters, paginated table, log-transaction modal).
- The .NET Core API is a separate project — this plan covers only the frontend. API contracts are defined here as TypeScript types + Zod schemas; the backend implements them independently.

## Key Technical Decisions

- **`fetch` wrapper, not axios** — native to both server and client components, smaller bundle, no extra dependency. The thin `httpClient` wrapper provides the same ergonomics (typed generics, interceptors, error normalization).
- **TanStack Query (`@tanstack/react-query`)** — server-state management for all API data. Provides caching, background refetching, stale-while-revalidate, optimistic mutations, query invalidation, and request deduplication. Each feature module defines its own query keys and hooks; the API client functions are the `queryFn` implementations.
- **Zod for API boundary validation** — runtime type checking at the network boundary catches .NET contract drift before it reaches components. Schemas live beside the API service functions in each feature module.
- **`.NET ProblemDetails` support** — the `ApiError` class parses RFC 7807 `ProblemDetails` and `ValidationProblemDetails` responses natively, mapping field-level errors for form display.
- **`(public)` route group** — clean layout separation from `(workspace)`. No sidebar, no auth required.
- **Auth via React context + localStorage** — JWT access/refresh tokens stored client-side. Context provides auth state to the tree. `AuthGuard` component redirects unauthenticated users. Next.js middleware can be layered on later for server-side protection without refactoring.
- **No heavy form library yet** — use controlled components with local state for the MVP forms (login, signup, profile, transaction modal). React Hook Form or similar can be introduced when form complexity warrants it.

## Design System Adherence Rules

Every component built in this phase must follow these cross-cutting rules from DESIGN.md. This section exists so the implementer has a single checklist rather than needing to re-derive rules from the design spec.

### Boundaries & Borders

- **No-Line Rule**: Never use `1px solid` borders to section content. Boundaries come from background color shifts and tonal transitions only.
- **Ghost Border Fallback**: When a border is needed for accessibility or selected states (e.g., payment method cards), use `outline-variant` at **15% opacity** (the `--ghost-border` token). This creates a "suggestion" of a container.
- **Dashed borders**: Only for "add new" affordances (e.g., Quick Add Expense). This is the single exception.

### Surfaces & Elevation

- **Nesting logic**: Place `surface-container-lowest` cards on `surface-container-low` sections for soft natural lift. Never place same-tier surfaces on each other.
- **Glassmorphism**: All floating elements (modals, dropdowns, popovers, mobile sheet menus) use `surface` at 70% opacity + `20px` backdrop-blur.
- **Ambient shadows**: Use `shadow-ambient-sm` / `shadow-ambient-md` / `shadow-ambient-lg` — never raw `box-shadow` with pure black. Shadow color is always tinted `on-surface` (dark blue-grey) at 4-8% opacity.
- **Signature gradients**: Primary CTA buttons and hero backgrounds use `linear-gradient(135deg, var(--primary), var(--primary-container))` — never flat hex.

### Typography

- **Manrope** (`font-display`): used for `display-lg` and `headline-md` only — high-impact headings and hero text.
- **Inter** (`font-sans`): used for `title-lg`, `body-md`, `label-sm` — data, labels, body copy.
- **All-caps `label-sm`**: for all eyebrow labels, metadata, column headers (e.g., "AVAILABLE CAPITAL", "DATE", "STATUS").
- **Asymmetrical layout**: offset large headings with small labels to break the "centered default" — e.g., `display-lg` balance left with `label-sm` tag right.

### Inputs & Forms

- **Base state**: `surface-container-low` background, `rounded-md`.
- **Focus state**: transition to `surface-container-highest` background + ghost border ring (`primary` at 20% opacity).
- **Labels**: `label-sm` positioned strictly **above** the field. Never use placeholder text as a label.
- **Dropdowns**: trigger styled as input, floating menu uses glassmorphism, active/selected item uses `primary-fixed` tinted background.

### Buttons

- **Primary**: gradient `primary` → `primary-container` at 135°, `on-primary` text, `rounded-lg`.
- **Secondary**: `surface-container-high` background, `on-surface` text, no border.
- **Tertiary/Ghost**: transparent, `on-surface` text, subtle `primary-fixed` glow on hover.

### Spacing & Rhythm

- 4px base unit throughout.
- `spacing-6` (1.5rem) for card internal padding.
- `spacing-8` (2rem) for modal internal padding.
- `spacing-10` (2.5rem) for section gaps.
- `spacing-20` (5rem) for major section breaks ("let the UI breathe").
- Interactive targets: minimum `spacing-12` (3rem) height.

### Color Semantics

- Income: `secondary` (forest green `#2D6A4F`) — only in typography or small indicators, never as large background blocks.
- Expenses: `destructive` (soft red `#C44536`) — same rule, typography/indicators only.
- Currency formatting: commas + two decimal places (e.g., "$142,850.00").
- Never use pure black (`#000000`) for anything — text is `on-surface` (`#1A2340`), shadows are tinted.

### Iconography

- Lucide icons with 1.5px stroke weight, rounded caps and joins.
- Sizes: 20px inline, 24px navigation, 32px feature cards.
- Category icons: rendered inside a tinted circular container — container uses the category's token color at 10% opacity, icon in full token color.

---

## Phase 1: API Client Foundation (`src/lib/api/`)

**Step 1.1** — Install dependencies: `zod`, `@tanstack/react-query`.

**Step 1.2** — Create `src/lib/api/http-client.ts`:

- Thin wrapper around `fetch` with typed generics
- Base URL from `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:5000/api`)
- Methods: `get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `delete<T>()`
- Automatic JSON serialization/deserialization
- Automatic `Authorization: Bearer <token>` header injection from auth store
- Automatic `Content-Type: application/json` for request bodies
- Query parameter serialization (supports arrays, dates, optional params)
- Request timeout support with `AbortController`
- Centralized error handling — non-2xx responses parsed as `ApiError`
- 401 response interceptor — clears auth state, redirects to `/login`

**Step 1.3** — Create `src/lib/api/api-error.ts`:

- `ApiError` class extending `Error`
- Properties: `status`, `code`, `title`, `detail`, `validationErrors` (keyed by field name)
- Parses .NET `ProblemDetails` (`{ type, title, status, detail, errors }`) and `ValidationProblemDetails` (`{ errors: { field: string[] } }`)
- Type guard: `isApiError(error): error is ApiError`
- Convenience checks: `isNotFound()`, `isUnauthorized()`, `isForbidden()`, `isValidationError()`, `isConflict()`

**Step 1.4** — Create `src/lib/api/types.ts`:

- `PaginatedResponse<T>` — `{ items: T[]; page: number; pageSize: number; totalCount: number; totalPages: number }`
- `ApiRequestOptions` — `{ params?, signal?, timeout?, headers? }`
- `ProblemDetails` type matching RFC 7807

**Step 1.5** — Create `src/lib/api/query-client.tsx`:

- `QueryClientProvider` wrapper component with default options:
  - `staleTime: 30_000` (30s)
  - `retry: 1` for queries, `retry: 0` for mutations
  - Default error handler logs to console (can be wired to toast later)
- Export the `QueryClient` instance for use in tests

**Step 1.6** — Create `src/lib/api/index.ts` — barrel export.

---

## Phase 2: Public Pages (`src/app/(public)/`)

**Step 2.1** — Create public shell components in `src/ui/composite/`:

- `public-navbar.tsx` — horizontal top bar for unauthenticated pages:
  - Left: "expensify" brand wordmark in `font-display` (Manrope) at `title-lg` weight — links to `/`
  - Right: "Log In" tertiary/ghost button (`on-surface` text, subtle `primary-fixed` glow on hover), "Get Started" primary button (gradient `primary` → `primary-container` at 135°, `on-primary` text, `rounded-lg`)
  - Height: `spacing-16` (4rem) to match the workspace top bar height
  - Sticky top, `surface` background — separated from content via tonal shift only (no border — "No-Line" rule)
  - Ambient shadow: `shadow-ambient-sm` for subtle floating lift
  - Responsive: collapses to hamburger menu on mobile via `Sheet` (sheet uses glassmorphism: `surface` at 70% opacity + `20px` backdrop-blur)
- `public-footer.tsx` — minimal footer for public pages:
  - Left: "© 2026 expensify" in `label-sm` (all-caps, `muted-foreground`)
  - Center/Right: links — "Privacy", "Terms", "Support" in `body-md` `muted-foreground`, hover transitions to `foreground`
  - `surface-container-low` background, `spacing-6` internal padding, `spacing-10` top margin for section breathing room
  - No top border — tonal shift separation only ("No-Line" rule)
  - Links are interactive targets at least `spacing-12` (3rem) height per spacing spec

**Step 2.2** — Create `src/app/(public)/layout.tsx`:

- Renders `PublicNavbar` at top, `{children}` in centered content area, `PublicFooter` at bottom
- No sidebar, no auth guard
- `min-h-screen` flex column layout so footer stays at bottom
- `bg-editorial-grid` on the body background (the radial gradient wash already in globals.css) — gives the public pages the same editorial texture as the workspace
- Content area: `max-w-6xl mx-auto` for comfortable reading width with generous side padding

**Step 2.3** — Create `src/features/auth/` module:

- `types/index.ts` — form state types, validation helpers
- `components/auth-form-card.tsx` — shared card wrapper for auth forms:
  - `surface` background, `rounded-xl` shape, `shadow-ambient-md` for editorial floating lift
  - `max-w-md` centered on page — narrow, focused form experience
  - `spacing-8` internal padding (per modal/card padding spec)
  - Title in `headline-md` (Manrope), subtitle in `body-md` `muted-foreground`
  - No border — tonal separation from page background is sufficient
- `screens/login-screen.tsx`:
  - Email + password inputs: `surface-container-low` background, `rounded-md`, labels in `label-sm` positioned above the field (never as placeholder text — per input field spec)
  - Focus state: transitions to `surface-container-highest` with ghost border (`primary` at 20% opacity via `ring` token)
  - "Log in" button: full-width primary gradient (`primary` → `primary-container` at 135°), `on-primary` text, `rounded-lg`
  - "Forgot password?" link in `body-md` `primary` below the password field, right-aligned → navigates to `/forgot-password`
  - "Don't have an account? Sign up" link in `body-md` `muted-foreground`, "Sign up" portion in `primary` as a text link
  - Inline validation errors in `body-md` `destructive` with `spacing-2` gap below the field
  - API error display: `surface-container-low` card with `destructive` accent, `body-md` text
- `screens/signup-screen.tsx`:
  - Same input styling as login
  - Fields: first name, last name, email, password, confirm password — each with `label-sm` above-field labels (split name into `firstName`/`lastName` to match API contract)
  - "Sign up" full-width primary gradient button
  - "Already have an account? Log in" link in same style as login screen
- `index.ts` — barrel export

**Step 2.4** — Create route files:

- `src/app/(public)/login/page.tsx` → renders `LoginScreen`
- `src/app/(public)/signup/page.tsx` → renders `SignupScreen`

**Step 2.5** — Create `src/features/home/` module:

- `screens/home-screen.tsx` — editorial landing page:
  - Hero section: "expensify" in `display-lg` (Manrope, 3.5rem) left-aligned or slightly offset (asymmetrical layout per Do's), subtitle tagline in `body-md` `muted-foreground` — e.g., "Your monthly financial narrative, not a spreadsheet."
  - CTA row: "Get Started" primary gradient button → `/signup`, "Log In" ghost/tertiary button → `/login`, with `spacing-4` gap between them
  - Optional: 2-3 value proposition cards in a grid below the hero, each using `surface-container-low` background, `rounded-xl`, `shadow-ambient-sm`, with an icon, `title-lg` heading, and `body-md` description — e.g., "Track spending", "AI-powered insights", "Recurring subscriptions"
  - Generous vertical spacing: `spacing-20` (5rem) between hero and cards section per the "let the UI breathe" guideline
  - Background: inherits the `bg-editorial-grid` radial wash from the layout — gives the premium, textured feel
- `index.ts`

**Step 2.6** — Update `src/app/page.tsx`:

- Render the home screen instead of redirecting to `/dashboard`
- Authenticated users visiting `/` can still navigate to `/dashboard` via the CTA or nav

**Step 2.7** — Update `src/ui/composite/index.ts` — add `PublicNavbar` and `PublicFooter` to barrel export.

---

## Phase 3: Auth State & Token Management (`src/lib/auth/`)

> **API reference:** All auth endpoints live under `/api/v1/users/` — see [auth-api-spec.md](../api/auth-api-spec.md) for full contracts. Key differences from earlier assumptions:
>
> - Registration = `POST /api/v1/users/register` (not `/auth/signup`)
> - Login = `POST /api/v1/users/login` (not `/auth/login`)
> - Response field is `token` (not `accessToken`)
> - Registration returns only `{ userId }` — no tokens, user must log in separately
> - No `GET /auth/me` endpoint — user info is decoded from JWT claims (`sub`, `email`, `firstName`, `lastName`, `role`)
> - Forgot/reset password flows are supported by the API and should be implemented

**Step 3.1** — Create `src/lib/auth/types.ts`:

```ts
// Request/response types matching the .NET API contract

RegisterRequest { email, password, firstName, lastName, role }
RegisterResponse { userId: string }

LoginRequest { email, password }
LoginResponse { token: string, refreshToken: string }

RefreshRequest { token: string, refreshToken: string }
RefreshResponse { token: string, refreshToken: string }

ChangePasswordRequest { currentPassword: string, newPassword: string }

ForgotPasswordRequest { email: string }

ResetPasswordRequest { email: string, token: string, newPassword: string }

// Decoded from JWT claims — no /me endpoint
AuthUser { id (sub), email, firstName, lastName, role }
```

Refer to [auth-api-spec.md](../api/auth-api-spec.md) for full details.

**Step 3.2** — Create `src/lib/auth/auth-store.ts`:

- Token storage using `localStorage` with an in-memory fallback for SSR
- `getToken()`, `getRefreshToken()`, `setTokens(token, refreshToken)`, `clearTokens()`
  - Note: field name is `token` (not `accessToken`) to match API response shape
- `isTokenExpired(token)` — decode JWT `exp` claim via base64 (no library needed)
- `decodeUser(token): AuthUser` — extract `sub`, `email`, `firstName`, `lastName`, `role` claims from JWT payload (no `/me` endpoint exists, so user info comes from the token)
- `getStoredUser()`, `setStoredUser(user)`, `clearStoredUser()`

**Step 3.3** — Create `src/lib/auth/auth-service.ts`:

- Typed API service functions for all auth endpoints:
  - `register(data: RegisterRequest): Promise<RegisterResponse>` — `POST /api/v1/users/register` (201)
  - `login(data: LoginRequest): Promise<LoginResponse>` — `POST /api/v1/users/login` (200)
  - `refreshTokens(data: RefreshRequest): Promise<RefreshResponse>` — `POST /api/v1/users/refresh` (200)
  - `logout(): Promise<void>` — `POST /api/v1/users/logout` (204, requires auth)
  - `changePassword(data: ChangePasswordRequest): Promise<void>` — `POST /api/v1/users/change-password` (204, requires auth, invalidates ALL sessions)
  - `forgotPassword(data: ForgotPasswordRequest): Promise<void>` — `POST /api/v1/users/forgot-password` (always 204)
  - `resetPassword(data: ResetPasswordRequest): Promise<void>` — `POST /api/v1/users/reset-password` (204)

**Step 3.4** — Create `src/lib/auth/auth-context.tsx`:

- `AuthProvider` component wrapping React context
- Provides: `user`, `isAuthenticated`, `isLoading`, `login(email, password)`, `register(firstName, lastName, email, password, role)`, `logout()`, `updateUser(user)`
- On mount: hydrates from stored token, decodes JWT to extract user info, validates token expiry
- `login()` — calls `POST /api/v1/users/login`, stores `token` + `refreshToken`, decodes user from JWT claims, sets user state
- `register()` — calls `POST /api/v1/users/register`, returns `{ userId }`. Does NOT auto-login — redirects to `/login` with a success message. The register endpoint returns no tokens.
- `logout()` — calls `POST /api/v1/users/logout` (server-side to invalidate all sessions), then clears tokens, clears user, redirects to `/login`

**Step 3.5** — Update `src/lib/api/http-client.ts` — add token refresh interceptor:

- On 401 response: before clearing auth, attempt `POST /api/v1/users/refresh` with current `{ token, refreshToken }`
- If refresh succeeds: store new token pair, retry the original request with new Bearer token
- If refresh fails (e.g., refresh token also expired): clear auth state, redirect to `/login`
- Prevent concurrent refresh attempts — use a promise lock so multiple 401s don't trigger parallel refreshes
- Handle 429 (rate limit) responses: extract `Retry-After` header if present, surface as a user-friendly error message

**Step 3.6** — Create `src/lib/auth/auth-guard.tsx`:

- Client component wrapping protected content
- If `isLoading` → render a full-page loading state: centered "expensify" wordmark in `headline-md` `muted-foreground` with a subtle pulse animation on `surface` background — keeps the editorial feel during auth hydration rather than showing a generic spinner
- If `!isAuthenticated` → redirect to `/login` via `useRouter`
- Otherwise → render `children`

**Step 3.7** — Create forgot/reset password pages:

- `src/features/auth/screens/forgot-password-screen.tsx`:
  - Email input field + "Send Reset Link" primary gradient button
  - On submit: calls `POST /api/v1/users/forgot-password` with `{ email }`
  - Always shows "Check your email for a reset link" success message (API always returns 204 to prevent user enumeration)
  - "Back to Log In" link
- `src/features/auth/screens/reset-password-screen.tsx`:
  - Reads `email` and `token` from URL query parameters (from the email link)
  - New password + confirm password fields
  - On submit: calls `POST /api/v1/users/reset-password` with `{ email, token, newPassword }`
  - On success: redirects to `/login` with "Password reset successfully" message
  - On error (400): displays "Invalid or expired reset link" message
- Route files:
  - `src/app/(public)/forgot-password/page.tsx` → renders `ForgotPasswordScreen`
  - `src/app/(public)/reset-password/page.tsx` → renders `ResetPasswordScreen`

**Step 3.8** — Update signup screen for new API contract:

- Update `src/features/auth/screens/signup-screen.tsx`:
  - Fields: first name, last name, email, password, confirm password (split name into `firstName`/`lastName` to match API)
  - On submit: calls `register()` from auth context
  - On success (201): redirect to `/login` with success toast/message — do NOT auto-login (register returns no tokens)
  - On error (409 Conflict): display "An account with this email already exists"

**Step 3.9** — Create `src/lib/auth/index.ts` — barrel export.

---

## Phase 4: Profile Management

**Step 4.1** — Create `src/features/profile/` module:

- `types/index.ts` — form state types
- `components/profile-form.tsx`:
  - Wrapped in `SurfaceCard` (existing composite component) — `surface-container-low` background, `rounded-xl`, no border
  - Eyebrow: "ACCOUNT" in `label-sm` all-caps
  - Fields: name input, email (read-only, visually muted with `surface-container` background), currency dropdown, timezone dropdown, month start day selector
  - All inputs: `surface-container-low` base, `label-sm` labels above fields, focus state with ghost border
  - Dropdowns: styled per design system dropdown spec — trigger matches input styling, floating menu uses glassmorphism (70% opacity + 20px backdrop-blur), active item uses `primary-fixed` tinted background
  - "Save Changes" primary gradient button, right-aligned
- `components/change-password-form.tsx`:
  - Separate `SurfaceCard` — keeps the two concerns visually distinct with `spacing-10` gap between cards
  - Eyebrow: "SECURITY" in `label-sm` all-caps
  - Fields: current password, new password, confirm new password — same input styling
  - API sends only `{ currentPassword, newPassword }` — confirm is client-side validation only
  - "Update Password" primary gradient button, right-aligned
  - **Post-submit behavior**: on success (204), ALL sessions are invalidated (per API spec). Must clear tokens and redirect to `/login` with a "Password changed — please log in again" message. Show a confirmation dialog before submitting to warn the user they will be logged out everywhere.
- `screens/profile-screen.tsx`:
  - `PageHeader` with eyebrow "Account", editorial title and description in the established pattern
  - Stacks profile form card + change password card with `spacing-8` between them
  - Uses `useAuth()` for current user data, pre-populates form
  - `max-w-2xl` content width — profile forms shouldn't stretch full-width, keeps the editorial "focused" feel
- `index.ts`

- `reset-password-screen.tsx` must pass `email` and `token` exactly as received from the URL query parameters. Do not URL-decode or base64-decode the token.
- profile planning should use first-name and last-name fields instead of a single name field unless the backend profile contract changes.

**Step 4.2** — Create route `src/app/(workspace)/profile/page.tsx`.

**Step 4.3** — Update `src/lib/app-shell.ts`:

- Add `/profile` to `AppRoute` type
- Add `PageChrome` entry for `/profile`

**Step 4.4** — Update `src/ui/composite/top-bar.tsx`:

- Wire user avatar click to navigate to `/profile`

---
