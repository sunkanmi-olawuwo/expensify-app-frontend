# Toast Notification System

## Overview

Implement a generic, reusable toast notification system that provides consistent, non-intrusive feedback to users for errors, warnings, success messages, and informational alerts across the entire application.

## Motivation

The application currently lacks a unified notification system. Error and success feedback is handled inline via the `AuthFeedbackBanner` component, and many error paths simply log to the console. Users need consistent, visible feedback for actions like failed API calls, form submissions, and system events regardless of which page they are on.

## User Stories

- As a user, I want to see a brief notification when an action succeeds so I know it worked without navigating away.
- As a user, I want to see a clear error notification when something goes wrong so I understand what happened.
- As a user, I want to be able to dismiss a notification manually if I have read it.
- As a user, I want notifications to auto-dismiss after a reasonable time so they do not clutter the screen.
- As a user, I want to see multiple notifications stacked if several events occur in quick succession.

## Functional Requirements

1. **Toast Types**: Support at least four variants — `success`, `error`, `warning`, and `info` — each with a distinct visual style consistent with the existing design token system.
2. **Positioning**: Toasts appear in a fixed position on the screen (default: bottom-right) and stack vertically when multiple toasts are active.
3. **Auto-Dismiss**: Each toast auto-dismisses after a configurable duration (default ~5 seconds). Errors may optionally persist until manually dismissed.
4. **Manual Dismiss**: Every toast includes a close button allowing the user to dismiss it immediately.
5. **Animation**: Toasts animate in and out smoothly (slide and/or fade).
6. **Global Access**: Any component or hook in the application can trigger a toast without prop drilling — exposed via a context provider or equivalent pattern.
7. **Programmatic API**: Provide a simple imperative-style function (e.g., `toast.error("message")`) that can be called from event handlers, API response callbacks, and React Query error hooks.
8. **Accessibility**: Toasts use an ARIA live region so screen readers announce them. Focus is not stolen from the user's current interaction.
9. **Deduplication** (nice-to-have): Optionally prevent the same message from appearing multiple times simultaneously.
10. **Action Support** (nice-to-have): Optionally allow a toast to include a single action button (e.g., "Retry", "Undo").

## Non-Functional Requirements

- Must work with the existing Tailwind CSS + design token styling approach.
- Must be compatible with the Next.js App Router (client component boundary).
- Must not introduce additional global state libraries; use React Context or a lightweight pub/sub pattern.
- Must be fully responsive and not obscure critical UI on mobile viewports.
- Must not block or interfere with user interactions on the underlying page.

## UI / UX Guidelines

- Follow the existing design token palette: `--destructive` for errors, `--primary` for info/success, and appropriate surface/border tokens for each variant.
- Use Lucide icons to visually distinguish toast types (e.g., `CheckCircle`, `AlertTriangle`, `XCircle`, `Info`).
- Keep toast width constrained (max ~400px) with concise messaging.
- On mobile, toasts should span nearly full width and appear at the top or bottom of the viewport.
- Stack limit: display a maximum of 5 toasts at a time; older toasts are dismissed when the limit is exceeded.

## Integration Points

- **React Query**: Hook into the global `onError` callback in the query client configuration to automatically surface API errors as toasts.
- **Auth flows**: Replace or supplement the existing `AuthFeedbackBanner` with toast notifications for login/signup/logout feedback where appropriate.
- **Form submissions**: Use toasts for post-submit success or failure feedback across features.
- **Future features**: Any new feature can import the toast hook to show notifications without building custom feedback UI.

## Out of Scope

- Persistent notification center or notification history.
- Push notifications or browser notification API integration.
- Email or SMS notifications.
- Toast theming beyond the existing design token system.

## Open Questions

- Should the default position be bottom-right on desktop and top on mobile, or consistent across all viewports?
- Should error toasts persist until dismissed, or auto-dismiss with a longer duration?
- Should the system integrate with or replace the existing `AuthFeedbackBanner`, or coexist alongside it?

## Acceptance Criteria

- [ ] A `ToastProvider` wraps the application and exposes a toast context.
- [ ] A `useToast` hook (or equivalent) is available for any client component to trigger toasts.
- [ ] Toasts render with correct variant styling for success, error, warning, and info.
- [ ] Toasts auto-dismiss after the configured timeout.
- [ ] Toasts can be manually dismissed via a close button.
- [ ] Multiple toasts stack without overlapping.
- [ ] Toasts are announced to screen readers via ARIA live regions.
- [ ] Toasts animate in and out smoothly.
- [ ] React Query global error handler triggers an error toast automatically.
- [ ] Unit tests cover toast creation, dismissal, auto-dismiss timing, and variant rendering.
- [ ] The system works correctly on both desktop and mobile viewports.
