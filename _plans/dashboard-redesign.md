# Dashboard Redesign

## Summary

- Replace the current placeholder dashboard with a data-driven, production-quality layout inside the existing dashboard feature.
- Keep the data boundary behind a feature-level React Query hook so the UI ships against typed mock data now and swaps to `httpClient` later with minimal refactoring.
- Use `net cash flow` as the hero's primary headline metric, with monthly income and monthly expenses as supporting values.

## Key Changes

- **Data contract and mock source**
  - Replace the current dashboard placeholder arrays in `src/features/dashboard/types` with an API-aligned `DashboardSummary` contract and a single typed mock payload.
  - Define numeric, unformatted shapes for `monthlyIncome`, `monthlyExpenses`, `netCashFlow`, `spendingBreakdown`, `monthlyPerformance`, and `recentTransactions`.
  - Keep quick actions out of the API contract and model them as local UI config.
  - Keep spending breakdown mock data pre-limited to the top 5 categories and sorted descending.

- **Feature data access**
  - Add `useDashboardSummary()` under the dashboard feature with a stable query key and a query function that currently resolves the mock payload.
  - Structure the hook so the later backend swap is only replacing the query function with `httpClient.get<DashboardSummary>("/v1/dashboard/summary")`.
  - Keep formatting helpers feature-local for currency formatting, signed percent labels, and relative time derived from transaction ISO timestamps.

- **Screen composition and UI**
  - Refactor `src/features/dashboard/screens/dashboard-screen.tsx` into a responsive two-column layout: main content for hero, KPI row, breakdown, and chart; sidebar for quick actions and recent transactions.
  - Replace dashboard use of the shared generic `MetricCard` with dashboard-owned KPI presentation components so finance-specific trend states do not leak into shared UI primitives.
  - Update the hero to a dark gradient `SurfaceCard` with headline `net cash flow`, a month-over-month badge, and supporting income and expenses panels.
  - Add a spending breakdown section with category icon container, amount, percentage, and proportional progress bar using semantic or category token mapping.
  - Replace the placeholder chart with a real inline-SVG dual-series visualization for the last 6 months, including axes labels and hover or focus tooltip behavior.
  - Expand recent transactions to the five latest items with category icon, status pill, signed amount color, relative time, and a `View all transactions` link to `/transactions`.
  - Keep the quick actions grid in the sidebar and make each tile open a placeholder sheet with action-specific copy rather than remaining inert.

## Public Interfaces

- Add or export these dashboard feature types:
  - `DashboardMoneyMetric { amount: number; currency: string; changePercentage: number }`
  - `SpendingBreakdownItem { category: string; amount: number; percentageOfTotal: number; colorToken: string }`
  - `MonthlyPerformancePoint { month: string; income: number; expenses: number }`
  - `DashboardTransaction { id: string; merchant: string; category: string; amount: number; type: "income" | "expense"; status: string; timestamp: string }`
  - `DashboardSummary { monthlyIncome; monthlyExpenses; netCashFlow; spendingBreakdown; monthlyPerformance; recentTransactions }`
- Add `useDashboardSummary()` as the dashboard feature's public data hook.
- Keep all display formatting out of the contract and mock payload; components receive raw numbers and timestamps and format at render time.

## Test Plan

- Update dashboard screen tests to verify:
  - hero renders the net cash flow headline and supporting income and expense values
  - three KPI cards render formatted values and signed change indicators
  - spending breakdown renders 5 categories with sorted amounts
  - monthly performance chart renders as a real accessible graphic, not placeholder markup
  - recent transactions renders 5 entries and the `/transactions` link
  - quick action interaction opens the placeholder sheet
- Add focused tests for the hook or mock layer to ensure the mock payload satisfies `DashboardSummary` and keeps spending and transaction ordering stable.
- Run `pnpm test`, `pnpm typecheck`, and `pnpm lint` after implementation.

## Assumptions

- The hero intentionally does not use available capital in this pass; the primary value is `netCashFlow`.
- The corrected spec keeps a single summary endpoint and does not introduce `availableCapital`.
- No new runtime chart dependency will be added; the chart will be implemented with inline SVG.
- Quick action placeholders will use the existing shared `Sheet` primitive rather than introducing a separate modal system.
