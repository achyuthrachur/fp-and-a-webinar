# Phase 9: Webinar Readiness and Polish - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the complete dashboard presentation-ready for a live webinar. Deliver four improvements: (1) a sticky top header bar with Crowe branding, (2) section subtitles across all 6 sections, (3) layout and card polish optimized for 1080p/4K widescreen, and (4) theme correctness + clean production build + all 5 scenario presets validated. No new data files, no new Redux slices, no new charts.

Requirements covered: WBNR-01, WBNR-02, WBNR-03, WBNR-04

</domain>

<decisions>
## Implementation Decisions

### Sticky Top Header Bar

- **Form:** A sticky top header bar — NOT a separate route or splash screen. The `<div id="slot-header" />` in `DashboardApp.tsx` is the integration point.
- **Sticky behavior:** Fixed at the top of the viewport; main content scrolls beneath it. Presenter sees Crowe branding and theme toggle from any scroll position.
- **Content (left to right):** `Crowe` text wordmark (left) → company name + period label (center) → theme toggle (right).
- **Logo:** Text wordmark only — "Crowe" in Helvetica Now Display Bold style, Crowe Indigo Dark (`#011E41`) in light mode, soft white in dark mode. No image file required.
- **Company name and period:** Loaded from `seedData` (company name from `company.json`, period label from `seedData.periodLabel`). Not hardcoded.
- **Theme toggle:** Light/dark switch — same mechanism already used in the app (`localStorage` + `data-theme` attribute on `<html>`). Iconsax sun/moon icons.

### Section Subtitles

- **Coverage:** All 6 sections get a title + one-line subtitle. Sections: KPI Cards, Close Tracker, Margin Bridge, Pipeline/AR Aging/Cash Flow (charts), AI Executive Summary, and the Scenario Panel sidebar.
- **Format:** Section title in bold (existing section heading style), subtitle as a muted second line immediately beneath — always visible, no hover or interaction.
- **Tone:** FP&A practitioner — speaks to CFO-level audience, assumes financial literacy. Examples:
  - KPI Cards: "January 2026 Performance Snapshot — Key financials against prior month and scenario adjustments"
  - Close Tracker: "Month-End Close Progress — Journal entry completion rates and days remaining to close target"
  - Margin Bridge: "Scenario Impact on EBITDA — How lever adjustments flow through revenue, margin, and cost to adjusted EBITDA"
  - Charts: "Pipeline & Collections Health — AR aging risk, CRM pipeline funnel, and 13-week cash outlook"
  - AI Executive Summary: "AI-Generated CFO Narrative — Two-paragraph executive summary synthesized from current scenario KPIs"
  - Scenario Panel: "Scenario Controls — Adjust revenue, cost, and operations levers to model close outcomes in real time"

### Layout for Widescreen (1080p / 4K)

- **Static charts layout:** The three charts currently in `ChartsSection` move to a 2-column layout:
  - Row 1: Pipeline to Invoiced (left col) + AR Aging (right col) — equal width
  - Row 2: 13-Week Cash Flow — full content width
- **KPI cards:** 4-column grid at 1920px wide. 8 cards = 2 rows of 4. Confirm and lock this in `KpiSection.tsx`.
- **Sidebar:** Keep 280px fixed — sufficient for all 11 controls with labels.
- **Main content max-width:** No max-width constraint — fill the available column (flex-1). The 2-column chart layout naturally uses horizontal space better.

### Theme Correctness

- **Priority:** Chart readability in dark mode. Recharts axis labels, tick text, tooltip text, and chart titles are the highest-risk elements — some may use hardcoded hex colors (Phase 6 decision) that are invisible on dark backgrounds.
- **Fix approach:** Replace hardcoded dark-text hex values in chart tick/label components with CSS variable equivalents (`var(--foreground)`, `var(--muted-foreground)`). Recharts SVG `fill` attributes can use CSS variable strings in some contexts — use `stroke` and `fill` props with variable values; fall back to `var(--foreground)` evaluated inline if needed.
- **Full component sweep:** Check KPI cards, close tracker badges, sidebar, AI panel, and header in both themes. Any component with a hardcoded light-mode color that becomes invisible in dark mode gets fixed.

### Production Build

- **Acceptance bar:** `npm run build` completes with zero TypeScript errors. `npm run start` shows zero console errors and zero React dev warnings in the browser.
- **No Lighthouse target** — build cleanliness is the gate, not a performance score.

### Preset Validation

- **Method:** Browser QA checkpoint. Load each of the 5 named presets from the Scenario Panel dropdown one at a time.
- **Pass criteria:** Every KPI card and every chart shows a non-NaN, non-error value for each preset. No blank cards, no "NaN", no crashed chart renders.
- **5 presets to verify:** "Jan 2026 Baseline", "Conservative Close", "Q4 Push for Target", "Fuel Cost Shock", and the 5th preset from `scenario-presets.json`.

### Claude's Discretion

- Exact CSS for the sticky header height and z-index (recommend `height: 56px`, `z-index: 50`)
- Subtitle font size and color (recommend `text-sm` / `0.8125rem`, `var(--muted-foreground)`)
- Whether the header has a bottom border or box-shadow separator (recommend subtle `border-bottom: 1px solid var(--border)`)
- Exact 2-column chart grid implementation (CSS Grid `grid-template-columns: 1fr 1fr` or flex with gap)
- How the main content area accounts for the sticky header height (top padding or margin on the main scroll area)
- Which Recharts prop approach resolves the dark-mode tick color issue (fill vs. stroke vs. tick component override)

</decisions>

<specifics>
## Specific Ideas

- The sticky header should feel like a Crowe digital brand bar — Indigo Dark background in dark mode, cream/white in light mode. The "Crowe" wordmark should use the brand weight (bold, Display variant) even as a text element.
- Section subtitles should be positioned directly beneath the section title, not separated by whitespace — they read as a two-line heading, not a separate block.
- The 2-column chart layout (Pipeline + AR side-by-side) was called out specifically — the current stacked layout feels unfinished for a widescreen presentation.
- "Cards, all of that" — every floating panel should have consistent shadow depth, border-radius, and padding. The crowe-card shadow style from `globals.css` should be uniformly applied across KPI cards, Close Tracker, chart cards, and the AI Summary panel.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/components/DashboardApp.tsx` — `<div id="slot-header" />` at line 70 is the integration point for the sticky header; replace with `<DashboardHeader seedData={seedData} />`
- `src/app/globals.css` — `--card`, `--border`, `--foreground`, `--muted-foreground`, `--accent` CSS variables; `crowe-card` shadow class; `kpi-amber-glow` keyframe — consistent with card shadow spec
- `src/store/scenarioSlice.ts` — theme toggle state may be managed here or via `localStorage` / `data-theme` — check existing theme toggle implementation in `layout.tsx`
- `src/components/dashboard/ChartsSection/ChartsSection.tsx` — currently renders all 3 charts stacked; needs 2-column CSS Grid restructure for Pipeline + AR row
- `src/components/dashboard/KpiSection.tsx` — current grid column count; confirm 4-column lock
- `src/lib/formatters.ts` — `formatCurrency()` available for any header KPI display if needed
- `src/components/ui/icons.tsx` — Iconsax wrapper; sun/moon icons for theme toggle

### Established Patterns

- **CSS variables for all colors** — `var(--card)`, `var(--foreground)`, `var(--accent)`, `var(--border)` — no hardcoded hex except SVG `fill`/`stroke` attributes
- **No `'use client'`** — new section components (DashboardHeader) render inside DashboardApp client boundary
- **`useSelector` from `react-redux`** — for any Redux-driven display values
- **Tailwind v4** — `@import "tailwindcss"` in globals.css; standard utility classes available
- **Hardcoded hex for Recharts SVG fills** — established in Phase 6. Bar fill colors stay hardcoded. Tick text and label colors (CSS text, not SVG fills) CAN use CSS variables.

### Integration Points

- `DashboardApp.tsx` — replace `<div id="slot-header" />` with `<DashboardHeader seedData={seedData} />`; add sticky header height offset to `<main>` top padding
- `ChartsSection.tsx` — restructure from vertical stack to 2-column CSS Grid (Pipeline + AR) + full-width row (Cash Flow)
- `KpiSection.tsx` — verify and lock `grid-template-columns: repeat(4, 1fr)` at full width
- `globals.css` — no changes needed beyond what's already there; section subtitle styles can use existing CSS variable tokens

</code_context>

<deferred>
## Deferred Ideas

- None — all discussion stayed within Phase 9 scope.

</deferred>

---

*Phase: 09-webinar-readiness-and-polish*
*Context gathered: 2026-03-05*
