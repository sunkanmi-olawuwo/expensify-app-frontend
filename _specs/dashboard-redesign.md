# Dashboard Redesign

## Overview

Redesign the Dashboard page into a production-quality, data-driven layout with a minimal and modern aesthetic. Replace hardcoded placeholder content with structured mock data that maps directly to a defined API contract, so the page is realistic, polished, and ready to connect to a backend with minimal refactoring.

## Motivation

The current Dashboard screen uses inline hardcoded values and a placeholder chart component with fixed bar heights. It looks like a wireframe rather than a finished product. To validate the design system, establish data-fetching patterns for other features, and give the workspace a credible first impression, the dashboard needs real structure backed by typed mock data and a clear API contract.

## User Stories

- As a user, I want to see my net cash flow front and center so I immediately understand how the month is trending.
- As a user, I want to see monthly income, expenses, and net cash flow with month-over-month change indicators so I can spot trends at a glance.
- As a user, I want to see a visual breakdown of where my money is going so I can identify spending categories that need attention.
- As a user, I want to see my most recent transactions so I can verify recent activity without navigating away.
- As a user, I want the dashboard to load quickly and feel responsive on both desktop and mobile.

## Functional Requirements

1. **Net Cash Flow Hero Section**: Display net cash flow as the primary hero metric with a month-over-month percentage change badge, monthly income total, and monthly expenses total.
2. **Metric Cards Row**: Show three top-level KPIs - monthly income, monthly expenses, and net cash flow - each with a formatted currency value and a signed change indicator.
3. **Spending Breakdown**: A categorized spending summary showing each category's name, amount, percentage of total, and a proportional progress bar. Categories should be sorted by amount descending.
4. **Monthly Performance Chart**: A dual-series area or line chart showing income vs. expenses over the past 6 months with labeled axes and a tooltip on hover.
5. **Recent Transactions List**: The five most recent ledger entries showing merchant name, category, formatted amount (color-coded for income/expense), status, and relative time. Include a "View all transactions" link to the transactions page.
6. **Quick Actions Grid**: Retain the quick action cards (Send Money, Add Funds, Quick Add Expense, etc.) in a compact grid within the sidebar column.
7. **Responsive Layout**: Two-column grid on large screens (main ~65%, sidebar ~35%); single column stacked on small screens.
8. **Static Mock Data**: All sections are populated from typed mock data objects that mirror the API contract shapes exactly. No inline magic strings or numbers in components.

## API Contract

Define the following endpoint and response types that map 1:1 to the dashboard UI sections. These types live in the dashboard feature's types directory and will later be used with React Query hooks.

### `GET /api/v1/dashboard/summary`

Returns the complete dashboard payload in a single request.

#### Response Shape

- **monthlyIncome**: total amount, currency, change percentage vs. prior month
- **monthlyExpenses**: total amount, currency, change percentage vs. prior month
- **netCashFlow**: total amount, currency, change percentage vs. prior month
- **spendingBreakdown**: array of objects each containing category name, amount, percentage of total, and a color token key
- **monthlyPerformance**: array of objects each containing month label, income amount, and expenses amount (most recent 6 months)
- **recentTransactions**: array of the 5 most recent transactions each containing id, merchant, category, amount, type (income or expense), status, and ISO timestamp

All currency amounts are numbers (not pre-formatted strings) so the frontend controls formatting. Percentages are numbers (e.g., `12.5` for 12.5%). The hero section reads from `netCashFlow`, not from a separate available-capital field.

## Non-Functional Requirements

- All mock data must be typed with the API contract interfaces so switching to real fetches is a type-safe find-and-replace.
- Components must use the existing design token palette and editorial styling rules (no 1px borders, tonal layering for depth, Manrope for headlines, Inter for body).
- The chart must be a real rendered visualization (SVG or canvas), not a placeholder with hardcoded bar heights.
- The page must be fully responsive and usable on mobile without horizontal scrolling.
- No new runtime dependencies for charts - use a lightweight approach (inline SVG or an existing dependency if one is already in the project).

## UI / UX Guidelines

- Follow the editorial design system: generous whitespace, tonal surface layering, no solid borders.
- Hero net cash flow card uses the dark gradient tone (`primary` to `primary_container` at 135 degrees) with white typography.
- Metric cards sit on `surface-container-low` with ambient shadow.
- Spending breakdown uses category-specific color tokens for progress bars and icon containers.
- Chart area uses semantic tokens for the two series (`secondary` for income, `destructive` for expenses) with gradient fills fading to transparent.
- Recent transactions list uses spacing instead of dividers, with Lucide category icons in tinted circular containers.
- Currency values are formatted with commas and two decimal places (`$12,340.00`).
- Change indicators use `secondary` (green) for positive and `destructive` (red) for negative, with arrow icons.

## Integration Points

- **React Query**: Create a custom `useDashboardSummary` query hook that returns the dashboard summary type. Initially this hook returns mock data; later it calls the real API endpoint.
- **HTTP Client**: The existing `httpClient.get<T>()` pattern will be used when the backend is ready.
- **Toast System**: API errors from the dashboard query will automatically surface via the global React Query error handler and the toast notification system.
- **Navigation**: The "View all transactions" link routes to `/transactions`. Quick action cards can open placeholder modals until their real features are built.

## Out of Scope

- Backend implementation of the dashboard summary endpoint.
- Real-time data updates or WebSocket integration.
- User-configurable dashboard layout or widget ordering.
- Date range picker or time period filtering (the API returns current month data).
- Dark mode.

## Open Questions

- Should the monthly performance chart support a time-range toggle (Daily / Weekly / Monthly) now, or is the default 6-month view sufficient for this pass? default 6-month view
- Should the spending breakdown show a fixed number of categories (e.g., top 5) with an "Others" rollup, or display all categories? top 5
- Should quick action cards trigger placeholder modals or simply be inert buttons until their features are built? placeholder modals

## Acceptance Criteria

- [ ] Dashboard summary API contract types are defined and exported from the dashboard feature types.
- [ ] Mock data objects conform exactly to the API contract types.
- [ ] A `useDashboardSummary` hook exists and returns typed mock data.
- [ ] The hero section displays net cash flow, monthly income, monthly expenses, and month-over-month change from mock data.
- [ ] Three metric cards display monthly income, expenses, and net cash flow with change indicators from mock data.
- [ ] A spending breakdown section renders categorized spending with proportional progress bars from mock data.
- [ ] A monthly performance chart renders a real dual-series visualization (not a placeholder) from mock data.
- [ ] The recent transactions list renders the 5 most recent entries with formatted amounts, icons, and status badges from mock data.
- [ ] All currency values are formatted consistently (`$X,XXX.XX`).
- [ ] The layout is responsive: two columns on large screens, single column on small screens.
- [ ] No hardcoded values exist in component JSX - all data flows from the mock data objects.
- [ ] The page follows the editorial design system (tonal layering, no borders, correct typography pairing).
- [ ] Unit tests verify that the dashboard screen renders key sections with mock data.
- [ ] TypeScript compiles with no errors and ESLint passes.
