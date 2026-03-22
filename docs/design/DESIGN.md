# Design System Specification: Editorial Excellence in Finance

## 1. Overview & Creative North Star: "expensify"

This design system moves away from the sterile, "template" feel of traditional FinTech dashboards. Our Creative North Star is **expensify**: a space that feels bespoke, curated, and intentionally crafted.

We reject the rigid, boxed-in layouts of 2010-era banking. Instead, we embrace **High-End Editorial** design: a world of generous breathing room, intentional asymmetry, and tonal depth. By utilizing overlapping elements and a dramatic typographic scale, we transform data from a chore into a narrative. The experience should feel like reading a premium financial journal—authoritative yet approachable.

---

## 2. Colors & Surface Architecture

Our palette uses deep, scholarly blues to establish trust, while leveraging forest greens and soft reds to narrate the flow of capital.

### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section sitting on a `surface` background provides all the separation the eye needs without the "visual noise" of a stroke.

### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers—stacked sheets of frosted glass or fine paper.

- **Nesting Logic:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
- **The Glass & Gradient Rule:** For floating elements (modals, dropdowns), use `surface` colors with a 70% opacity and a `20px` backdrop-blur.
- **Signature Textures:** Main CTAs and Hero backgrounds should utilize a subtle linear gradient (e.g., `primary` to `primary_container` at 135°) to provide a "soul" and professional polish that flat hex codes cannot achieve.

---

## 3. Typography: Authority Through Contrast

We pair the structural precision of **Inter** with the editorial elegance of **Manrope**.

| Role            | Font Family | Size      | Intent                                                  |
| :-------------- | :---------- | :-------- | :------------------------------------------------------ |
| **Display-LG**  | Manrope     | 3.5rem    | High-impact hero balances and monthly summaries.        |
| **Headline-MD** | Manrope     | 1.75rem   | Section headers; should feel like a magazine title.     |
| **Title-LG**    | Inter       | 1.375rem  | Bold, authoritative card titles.                        |
| **Body-MD**     | Inter       | 0.875rem  | Standard data reading and descriptions.                 |
| **Label-SM**    | Inter       | 0.6875rem | Micro-metadata; used sparingly in all caps for utility. |

**The Editorial Shift:** Use `display-lg` for primary balances, but offset it with an asymmetrical `label-md` descriptive tag to break the "centered" default of standard apps.

---

## 4. Elevation & Depth: Tonal Layering

Depth is achieved through light and shadow, not lines.

- **The Layering Principle:** Use the `surface-container` tiers (Lowest to Highest) to stack information. A higher financial priority item should sit on a "brighter" surface tier.
- **Ambient Shadows:** When a "floating" effect is required, shadows must be extra-diffused. Use a blur of `24px` to `40px` with an opacity of `4-8%`. The shadow color should be a tint of `on-surface` (dark blue-grey), never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. This creates a suggestion of a container rather than a hard cage.
- **Glassmorphism:** Apply a subtle `surface_tint` to semi-transparent layers to ensure the "glass" feels like it belongs to the brand's blue-tone family.

---

## 5. Layout Structure

### Sidebar Navigation

- **Width:** Fixed at ~200px.
- **Background:** `surface` (white/off-white), visually separated from main content via tonal shift—no border.
- **Nav Items:** Icon + `body-md` label. Active state uses `primary` text with a `primary_fixed` tinted background pill on the left edge.
- **Items:** Dashboard, Transactions, Analytics, Settings.
- **Footer Section:** "Upgrade to Pro" CTA card pinned to the bottom, followed by Support and Logout links.
- **Brand Mark:** "expensify" wordmark with a concise personal finance subtitle at the top.

### Top Bar / Header

- **Layout:** Spans the main content area (not full-width—sits to the right of the sidebar).
- **Left:** Page title or contextual label (e.g., "Visual Analytics", "Atelier Finance").
- **Center:** Search input with magnifying glass icon, placeholder text contextual to the page (e.g., "Search transactions...", "Search analytics...").
- **Right:** Notification bell (with badge dot for unread), Help icon (?), "+ Add New" primary button, User avatar (circular).

### Content Grid

- **Dashboard:** Two-column layout. Left column (~65%) holds the hero capital card, allocation chart, and secondary widgets. Right column (~35%) holds Atelier Tools and Recent Ledger.
- **Analytics:** Primary chart area (~65%) with a sidebar panel (~35%) for Spending Breakdown. Below: full-width Daily Spending Velocity chart, then a two-column row for Sustainable Spending and Budget Alert cards.
- **Transactions:** Full-width filter bar, followed by full-width transaction table.

---

## 6. Components

Our components prioritize clarity and tactile feedback.

### Data Cards

- **Style:** No borders. Use `surface_container_low` for the background.
- **Layout:** Use vertical white space (`spacing-8`) instead of dividers.
- **Income/Expense:** Represent income with `secondary` (Forest Green) and expenses with `error` (Soft Red), but only in typography or small indicators—never as large background blocks.

### Hero Capital Card (Dashboard)

- **Background:** Deep dark gradient (`primary` to `primary_container` at ~135°), creating the signature editorial "dark hero" look.
- **Content:** "AVAILABLE CAPITAL" label in `label-sm` (all-caps, muted white), balance in `display-lg` (white, Manrope), percentage change badge (pill-shaped, semi-transparent white background), and a row of "MONTHLY INCOME" / "MONTHLY EXPENSES" with mini sparkline icons.
- **Shape:** `rounded-xl` (1rem) with generous internal padding (`spacing-8`).

### Allocation / Donut Chart

- **Style:** A donut/ring chart with a centered summary value (e.g., "SPENT $4,120") inside the ring.
- **Legend:** Below the chart, use a horizontal legend with colored dots + `body-md` labels + percentage values.
- **Colors:** Use the full token palette—`primary` (Luxury Goods), `primary_fixed` (Properties), `secondary` (Advisory), `outline_variant` (Others).

### Charts (Line / Area)

- **Monthly Performance:** Dual-series line/area chart (Income vs. Expenses). Use `primary` for Income dots, `error` for Expenses dots. X-axis: month abbreviations in `label-sm`. No gridlines—use subtle `surface_container_low` horizontal bands if needed.
- **Daily Spending Velocity:** Single-series area chart with a gradient fill from `primary_fixed` (top) fading to transparent (bottom). Active data point shown as a filled circle with a tooltip card.
- **Tooltips:** Dark `primary` background, white text, `rounded-md` shape. Show date and formatted value (e.g., "JUNE 24: $1,240.00").
- **Time Toggle:** A segmented control (Daily / Weekly / Monthly) in `surface_container_low` with the active segment in `surface` with subtle shadow.

### Spending Breakdown Panel

- **Layout:** Vertical list of categories. Each row: category name in `body-md` (bold), percentage in `body-md` on the right, and a thin horizontal progress bar below.
- **Bar Colors:** Each category uses a distinct token—`primary` (Housing), `primary_fixed` (Lifestyle), `secondary` (Investments), `error` (Food & Dining).
- **Footer:** "View All Categories" link/button in `body-md`.

### Recent Ledger / Transaction List

- **Layout:** Each row contains: category icon (in a tinted circular or rounded-square container), merchant name in `title-lg`, category/subcategory in `body-md` muted, time ago in `label-sm`, and amount on the right in `title-lg` with `secondary` for income (+) and `error` for expenses (-).
- **Status Labels:** Below the amount, right-aligned: "APPROVED", "SETTLED" in `label-sm` all-caps. Use muted `on_surface` for approved, `secondary` for settled.
- **Dividers:** None. Use `spacing-6` vertical gaps between rows.
- **Footer:** "LOAD OLDER ENTRIES" link centered below the list.

### Transaction History Table

- **Header Row:** `label-sm` all-caps columns: DATE, DESCRIPTION & CATEGORY, STATUS, AMOUNT. Background: `surface_container_low`.
- **Data Rows:** Each row shows date + time, category icon + description + subcategory, status badge, and amount. Alternate row backgrounds are not used—rely on spacing.
- **Status Badges:** Pill-shaped with tinted backgrounds. "Completed" = `secondary` tint with `secondary` text. "Pending" = `outline_variant` tint with `on_surface` text.
- **Amount Formatting:** Expenses prefixed with "-" in `error`. Income prefixed with "+" in `secondary`.
- **Actions:** "Export CSV" and "Print" buttons in the top-right as secondary buttons with icons.

### Filter Bar (Transaction History)

- **Layout:** Horizontal row of filter chips/cards with `surface_container_low` background and `spacing-4` gaps.
- **Filter Types:** Date Range (calendar icon + formatted range), Category dropdown, Payment Method dropdown.
- **Clear Action:** "Clear All Filters" button on the far right with a filter icon, using `error` or `on_surface` text.

### Pagination

- **Style:** Centered below the table. Page numbers in `body-md` within circular/rounded containers. Active page uses `primary` background with `on_primary` text. Inactive pages use `surface_container_low`. Previous/Next arrows on either side.
- **Summary:** "Showing 1 to 5 of 248 transactions" in `label-sm` on the left.

### Modal / Dialog (Log Transaction)

- **Overlay:** Semi-transparent dark backdrop (use `on_surface` at ~50% opacity).
- **Container:** `surface` background, `rounded-xl` shape, centered on screen, max-width ~600px. Close button (X) in the top-right corner.
- **Header:** Title in `headline-md` ("Log Transaction") with a subtitle in `body-md` muted ("Update your financial record").
- **Amount Input:** Large centered input using `display-lg` for the value with a `$` prefix in `body-md` muted. Placeholder: "0.00".
- **Category Selector:** Dropdown with category icon + `body-md` label.
- **Date Picker:** Input field with a calendar icon on the right.
- **Payment Method:** Horizontal row of selectable cards (Credit Card, Cash, Transfer) with icons. Selected state uses a "Ghost Border" of `primary` at 20% opacity. Unselected uses `surface_container_low`.
- **Notes:** Textarea with `surface_container_low` background and placeholder text in `body-md` muted.
- **Submit:** Full-width primary button ("Save Transaction") at the bottom, followed by a security note ("Secure end-to-end encrypted entry") with a lock icon in `label-sm`.

### Quick Action Cards (Atelier Tools)

- **Layout:** Grid of square-ish cards (e.g., "Send Money", "Add Funds") with a centered icon and `body-md` label below.
- **Style:** `surface_container_low` background, `rounded-lg` shape, subtle hover lift.
- **Quick Add Expense:** Dashed border card with a "+" icon and "QUICK ADD EXPENSE" label in `label-sm` all-caps. This is the one exception to the no-border rule—dashed borders signal "add new" affordance.

### Alert / Notification Cards

- **Budget Alert:** `surface_container_low` background with a warning icon (triangle with "!" in `error`). Title in `title-lg`, description in `body-md`. Two action buttons at the bottom: "Adjust Limit" (secondary) and "Review Activity" (primary).
- **Sustainable Spending:** Tinted background (light green/cream) with an eco icon. Title in `title-lg`, description in `body-md`, and a "View Details" link with an arrow.

### Upgrade to Pro CTA

- **Sidebar Variant:** Compact card pinned to the sidebar bottom. `primary` background, white text, "Get Started" or "Upgrade Now" button in `surface` (white) with `primary` text.
- **Content:** "PRO FEATURE" label in `label-sm`, title in `title-lg`, and a brief value proposition in `body-md`.

### Progress Bars

- **Track:** `surface_container_highest` (subtle grey-blue).
- **Indicator:** A gradient from `primary_fixed` to `primary`.
- **Shape:** `rounded-full` for a modern, soft feel.

### Buttons (Call-to-Action)

- **Primary:** Gradient of `primary` to `primary_container`. Text: `on_primary`. Shape: `rounded-lg` (0.5rem).
- **Secondary:** `surface_container_high` with `on_surface` text. No border.
- **Tertiary:** Ghost style. `on_surface` text with a subtle `primary_fixed` glow on hover.

### Input Fields

- **Base:** `surface_container_low`.
- **Active State:** Transition to `surface_container_highest` with a "Ghost Border" of `primary` at 20% opacity.
- **Labels:** Use `label-md` positioned strictly above the field, never as placeholder text.

### Search Input

- **Style:** `surface_container_low` background, `rounded-full` shape, magnifying glass icon on the left, placeholder text in `body-md` muted.
- **Width:** ~300px in the top bar, expanding slightly on focus.

### Dropdowns

- **Trigger:** Same styling as input fields, with a chevron-down icon on the right.
- **Menu:** Floating `surface` background with glassmorphism (70% opacity, `20px` backdrop-blur). Items use `body-md` with `spacing-2` vertical padding. Active/selected item uses `primary_fixed` tinted background.

### High-End Financial Components (Context Specific)

- **The Trend Micro-Chart:** Instead of a full graph, use a simplified sparkline within list items using the `secondary` or `error` tokens to show 7-day volatility.
- **Transaction Lists:** Forbid dividers. Use a `1px` shift in background color on hover to indicate interactivity.

---

## 7. Iconography

- **Style:** Line icons with 1.5px stroke weight, matching the editorial tone. Rounded caps and joins.
- **Size:** Default `20px` for inline use, `24px` for navigation, `32px` for feature cards (Atelier Tools).
- **Category Icons:** Each transaction category has a dedicated icon rendered inside a tinted circular container. The container uses the category’s token color at ~10% opacity, with the icon in the full token color.
  - Travel: airplane icon, `primary` tint
  - Dining: fork-knife icon, `error` tint
  - Business/Revenue: dollar-circle icon, `secondary` tint
  - SaaS/Subscriptions: play-square icon, `primary_fixed` tint
  - Equipment/Tech: monitor icon, `on_surface` tint
  - Apparel: building icon, `primary` tint
  - Investment: trending-up icon, `secondary` tint

---

## 8. Do’s and Don’ts

### Do

- **Do** use asymmetrical layouts. A large headline on the left with a small label on the right creates a premium "designed" feel.
- **Do** use the `20` (5rem) spacing token for major section breaks to let the UI breathe.
- **Do** use `surface_bright` for peak highlights in a "Dark Mode" transition.
- **Do** use dashed borders exclusively for "add new" affordances (e.g., Quick Add Expense).
- **Do** format currency values with commas and two decimal places (e.g., "$142,850.00").
- **Do** use all-caps `label-sm` for category headers and metadata labels (e.g., "PORTFOLIO OVERVIEW", "AVAILABLE CAPITAL", "MONTHLY ACTIVITY").

### Don’t

- **Don’t** use 100% opaque borders. They make the app feel like a legacy banking portal.
- **Don’t** use pure black `#000000` for shadows. Use a tinted `on_surface` variant.
- **Don’t** use standard "Success Green" (#00FF00). Stick strictly to the sophisticated `secondary` forest green provided.
- **Don’t** crowd the screen. If a view feels full, move secondary data to a `surface_container_highest` drawer.
- **Don’t** use horizontal dividers in lists or tables. Rely on spacing and tonal shifts.

---

## 9. Spacing & Rhythm

Consistency is maintained through a strict 4px base unit.

- **Card Padding:** Use `spacing-6` (1.5rem) for internal card breathing room.
- **Section Gaps:** Use `spacing-10` (2.5rem) to separate distinct financial modules.
- **Interactive Targets:** Ensure all touch points are at least `spacing-12` (3rem) in height.
- **Sidebar Width:** Fixed `200px`.
- **Top Bar Height:** `spacing-16` (4rem).
- **Modal Max-Width:** `600px`, centered with `spacing-8` internal padding.
