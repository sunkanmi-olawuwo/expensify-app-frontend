# Toast Notification System

## Summary

- Build an app-owned toast system using a lightweight pub/sub store plus a rendering provider, not a context-only state tree and not a third-party toast library.
- Desktop behavior: bottom-right stacked toasts. Mobile behavior: near-full-width stacked toasts at the top.
- Default timing: `success`, `info`, and `warning` auto-dismiss after 5s; `error` persists until dismissed unless a caller overrides `duration`.
- Auth screens should use toasts for submit/query-string success and recoverable API failures, while keeping inline field validation and the invalid reset-link state in-page.

## Key Changes

- Add a shared toast module under `src/lib/toast` with:
  - `ToastVariant = "success" | "error" | "warning" | "info"`
  - `ToastInput` with `message`, optional `duration`, optional `dedupeKey`, and optional `action: { label, onClick }`
  - imperative API: `toast.show(...)`, `toast.success(...)`, `toast.error(...)`, `toast.warning(...)`, `toast.info(...)`, `toast.dismiss(id)`, `toast.dismissAll()`
  - store-level rules: max 5 active toasts, FIFO eviction when the limit is exceeded, dedupe by active `dedupeKey` or fallback `variant + message`
  - returned toast id from every create call so callers can dismiss/update later if needed

- Add a client `ToastProvider`/viewport component in the shared UI layer and mount it in `src/app/layout.tsx` and the shared test wrapper in `src/test/render.tsx`.
  - render a fixed viewport with `pointer-events-none`; each toast card uses `pointer-events-auto`
  - desktop classes anchor bottom-right; mobile classes anchor top with safe-area spacing and near-full-width sizing
  - variant styling uses existing tokens: destructive for errors, primary/secondary-tinted surfaces for success/info/warning
  - Lucide icons per variant and a close button on every toast
  - animations use the existing `tw-animate-css` utilities with explicit enter/exit timing; dismiss first marks the toast exiting, then removes it after the exit duration

- Accessibility and behavior:
  - viewport uses an ARIA live region without stealing focus
  - non-error toasts announce politely; error toasts use assertive semantics so failures are announced promptly
  - action support is one optional button; clicking it runs the callback and then dismisses the toast
  - no focus trapping, no auto-focus, and no overlay that blocks the page

- Integrate with existing error surfaces:
  - update `src/lib/api/query-client.tsx` so global React Query `onError` handlers call `toast.error(...)` instead of only `console.error(...)`
  - centralize error-to-message normalization so React Query and auth flows produce consistent toast copy from `ApiError.detail`, `ApiError.message`, or a generic fallback
  - keep logging in development if helpful, but the user-visible path becomes the toast system

- Auth flow changes:
  - `login`, `forgot-password`, and `signup` screens stop rendering `AuthFeedbackBanner` for recoverable submit/query-string feedback and call the toast API instead
  - login page consumes `status` query feedback once on mount and shows a success toast for `registered`, `logged_out`, and `password_reset`
  - forgot-password success/error becomes toast-driven
  - signup conflict and generic registration failures become toast-driven
  - reset-password keeps the invalid or expired link banner inline because it is stateful page context, not transient feedback
  - inline field validation remains unchanged

## Public Interfaces

- Expose `toast` for non-React call sites and `useToast()` for client components that prefer a hook-shaped API.
- Keep the public shape intentionally small:
  - `toast.success(message, options?)`
  - `toast.error(message, options?)`
  - `toast.warning(message, options?)`
  - `toast.info(message, options?)`
  - `toast.dismiss(id?)`
- `useToast()` should return the same imperative methods, not local state, so components and non-component code use one consistent contract.

## Test Plan

- Add store/provider tests with fake timers covering:
  - create and render each variant
  - auto-dismiss timing for non-error toasts
  - persistent default behavior for errors
  - manual dismiss via close button
  - stack limit eviction at 6th toast
  - dedupe behavior for matching active toasts
  - action button callback and dismissal
  - exit-animation removal timing
  - ARIA live-region semantics

- Update query client tests to assert global cache handlers trigger `toast.error(...)` with normalized messaging.

- Update auth screen tests to assert toast behavior instead of inline banner rendering where banners are being replaced, while preserving existing assertions for inline field validation and invalid reset-link handling.

- Add one responsive component test that verifies mobile top placement classes and desktop bottom-right placement classes so viewport behavior is covered without introducing a special demo route.

## Assumptions

- No new dependency is needed; this stays within React, Tailwind, Lucide, and existing animation utilities.
- The clean architecture choice is pub/sub plus provider because React Query cache callbacks and other non-component code need imperative access outside React hooks.
- The existing `AuthFeedbackBanner` component can remain for the reset-password invalid-link case; it does not need to be fully removed in this pass.
