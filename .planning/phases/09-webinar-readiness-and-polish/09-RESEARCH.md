# Phase 9: Webinar Readiness and Polish - Research

**Researched:** 2026-03-05
**Domain:** React/Next.js dashboard polish — sticky layout, dark mode chart fixes, section headers, build validation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Sticky Header:** New `DashboardHeader` component replaces `<div id="slot-header" />` in `DashboardApp.tsx`. Contains: "Crowe" text wordmark (left, Indigo Dark `#011E41`), company name + period label (center, from `seedData`), theme toggle (right, Iconsax `Sun1`/`Moon`). Sticky (`position: sticky`, `top: 0`, `z-index: 50`). No image file.
2. **Section Subtitles:** All 6 sections get title + one-line subtitle (always visible). FP&A practitioner tone. Text locked in CONTEXT.md. New reusable `SectionHeader` component.
3. **Chart Layout:** ChartsSection restructured — Pipeline + AR in 2-column CSS Grid row (equal width), Cash Flow full-width below. (Already implemented as `flex` — verify current state is correct or convert to CSS Grid.)
4. **KPI Grid:** 4-column `repeat(4, 1fr)` locked in `KpiSection.tsx` — already implemented, confirm no responsive override breaks it.
5. **Dark Mode:** Priority = chart axis labels, tick text, tooltip text readable in dark mode. Fix hardcoded hex text colors in Recharts tick/label components. Replace with CSS variables.
6. **Build:** `npm run build` zero TS errors + zero console errors.
7. **Preset QA:** Browser checkpoint — all 6 presets load, no NaN/error values.

### Claude's Discretion

- Exact CSS for sticky header height and z-index (recommend `height: 56px`, `z-index: 50`)
- Subtitle font size and color (recommend `text-sm` / `0.8125rem`, `var(--muted-foreground)`)
- Whether header has bottom border or box-shadow (recommend `border-bottom: 1px solid var(--border)`)
- Exact 2-column chart grid implementation (CSS Grid `grid-template-columns: 1fr 1fr` or flex with gap)
- How main content area accounts for sticky header height (top padding or margin on main scroll area)
- Which Recharts prop approach resolves the dark-mode tick color issue

### Deferred Ideas (OUT OF SCOPE)

- None — all discussion stayed within Phase 9 scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WBNR-01 | Dashboard fills presenter display without awkward whitespace — layout responsive and optimized for 1080p/4K widescreen | KPI 4-col grid analysis, ChartsSection flex layout audit, sidebar fixed-width findings |
| WBNR-02 | All components and charts render correctly in both light and dark themes — no element invisible in either mode | Recharts tick/label prop audit, CSS variable inventory in globals.css, dark mode mechanism in layout.tsx |
| WBNR-03 | Production build clean — `npm run build` zero TypeScript errors, `npm run start` zero console errors or React dev warnings | Current DashboardApp footer text, TypeScript audit path |
| WBNR-04 | All scenario presets work end-to-end — each named preset produces correct, non-error KPI values and chart renders | Full preset inventory: 6 presets confirmed in scenario-presets.json |
</phase_requirements>

---

## Summary

Phase 9 is a surgical polish pass on a fully-functional dashboard. The codebase is in excellent structural shape — all charts exist, Redux is wired, dark mode detection is live, and the CSS variable system is well-established. The work falls into four non-overlapping streams that each touch different files.

**Stream 1 (New component):** `DashboardHeader` is greenfield — slots into the existing `<div id="slot-header" />` placeholder. The theme toggle mechanism is already understood: `layout.tsx` sets `data-theme` from `localStorage` via a blocking script. A toggle button needs only to read the current attribute, flip it, and persist to `localStorage` — no Redux state, no new hooks needed.

**Stream 2 (Section subtitles):** No section currently has a subtitle — only `CloseTracker` has an `<h2>` heading. A new shared `SectionHeader` component renders a title + muted subtitle div. Six sections need it inserted: `KpiSection`, `CloseTracker`, `MarginBridgeSection`, `ChartsSection`, `AiSummarySection`, and `ScenarioPanel`.

**Stream 3 (Chart dark mode):** The `globals.css` CSS variables (`--foreground`, `--muted-foreground`, `--border`) are already used correctly in tooltip container divs and text colors. The Recharts `tick={{ fill: '...' }}` prop in `PipelineChart`, `CashFlowChart`, and `MarginBridgeChart` already uses `'var(--muted-foreground)'` — this is correct. The one confirmed gap is `MarginBridgeChart`'s `LabelList` using `fill: 'var(--foreground)'` in a `style` object, which should work. The `ChartsSection` layout is already a flex row (Pipeline + AR side-by-side), so the layout requirement is already partially met.

**Stream 4 (Build + presets):** There are 6 presets in `scenario-presets.json` (not 5 as CONTEXT.md suggests): Baseline, Conservative, Q4 Push, Fuel Shock, Cash Preservation Mode, and Optimistic Recovery. The browser QA checklist must cover all 6.

**Primary recommendation:** Execute as four sequential mini-plans — DashboardHeader first (highest visual impact for webinar), then SectionHeader across all sections, then dark mode sweep confirming variables are correct, then build check + preset QA.

---

## Standard Stack

### Core (already installed — no new installs)

| Library | Version | Purpose | Phase 9 Usage |
|---------|---------|---------|---------------|
| React | 18.x | Component model | `useState`, `useEffect` for header toggle |
| Next.js | 16.1.x | App Router, Server Components | `layout.tsx` blocking script (no changes) |
| Recharts | 2.15.x | Chart rendering | Dark mode tick color audit |
| iconsax-react | latest | Icons | `Sun1`, `Moon` for theme toggle (already exported from `icons.tsx`) |
| Tailwind CSS v4 | `@import "tailwindcss"` | Utility classes | Section header typography |
| Redux Toolkit | 2.x | Scenario state | No changes in Phase 9 |

### CSS Variable Inventory (from globals.css)

These variables are confirmed present and theme-switching in both `html[data-theme="light"]` and `html[data-theme="dark"]`:

| Variable | Light Value | Dark Value | Use In Phase 9 |
|----------|-------------|------------|----------------|
| `--foreground` | `#1c2d47` | `#e7eef8` | Header text, tick text (confirmed in charts) |
| `--muted-foreground` | `var(--muted)` = `#5e6b80` | `#abc0dd` | Subtitle text, tick labels (already used) |
| `--card` | `#fffaf2cc` | `#17263be0` | Header background option |
| `--background` | `#f7f3ea` | `#0f1b2f` | Page background |
| `--border` | `#d7dce5` | `#2e4768` | Header bottom border, chart grid lines |
| `--accent` | `#f5a800` | `#ffd231` | Theme toggle active state |
| `--muted-color` | `#60728f` | `#9ab2d4` | Secondary muted text |

**Note:** `--muted-foreground` does not exist as its own token in globals.css. The charts reference it as `'var(--muted-foreground)'` but it resolves to nothing. This is a confirmed bug. The correct variable is `--muted` (for muted text color) or `--muted-color`. See "Common Pitfalls" section.

---

## Architecture Patterns

### Theme Toggle Mechanism (confirmed from layout.tsx)

The blocking script in `layout.tsx` sets `data-theme` on `<html>` from `localStorage` before paint. A theme toggle button needs to:

1. Read `document.documentElement.getAttribute('data-theme')`
2. Compute new value (`'dark'` → `'light'` or `'light'` → `'dark'`)
3. Set `document.documentElement.setAttribute('data-theme', newTheme)`
4. Persist `localStorage.setItem('theme', newTheme)`

`MarginBridgeSection.tsx` already implements dark mode detection with a `MutationObserver` watching `data-theme` attribute changes. This is the established pattern for components that need to react to theme changes.

```typescript
// Established pattern — already used in MarginBridgeSection.tsx
const [isDark, setIsDark] = useState(
  typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark'
);
useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}, []);
```

### DashboardHeader Integration Point (from DashboardApp.tsx)

```tsx
// Line 70 in DashboardApp.tsx — current state:
<div id="slot-header" />

// Phase 9 replacement:
<DashboardHeader seedData={seedData} />
```

The `<main>` element (line 69) uses `padding: '1.5rem'`. When a sticky header of `height: 56px` is added, the main content area does NOT need additional `paddingTop` because the header sits INSIDE the `<main>` element's content flow — it is not position:fixed overlapping the main. Verify: `<div id="slot-header" />` is the first child of `<main>`, so replacing it with a sticky header means the header stickies within the main's scroll container, not the viewport.

**Critical finding:** The outer `<div>` wrapper uses `display: flex; minHeight: 100vh`. The `<aside>` has `position: sticky; top: 0; height: 100vh`. The `<main>` has `flex: 1; overflowY: auto`. A sticky header INSIDE the `<main>` will sticky relative to the `<main>` scroll container (not the viewport) if `<main>` has `overflowY: auto`. This is the correct behavior for the webinar scenario — the header stays at the top of the main content column as the presenter scrolls.

If the header must sticky relative to the VIEWPORT (not the main container), it would need `position: fixed` with a corresponding `paddingTop` on the main. Given the CONTEXT.md says `position: sticky` + `top: 0`, use the sticky-within-main approach. This means the header IS visible to the presenter without `position: fixed` because the main area is what scrolls.

### Sticky Header Component Structure

```tsx
// src/components/dashboard/DashboardHeader.tsx
// No 'use client' — runs inside DashboardApp client boundary
import { useState, useEffect, useCallback } from 'react';
import { Sun1, Moon } from '@/components/ui/icons';
import type { DashboardSeedData } from '@/lib/dataLoader';

interface DashboardHeaderProps {
  seedData: DashboardSeedData;
}

export default function DashboardHeader({ seedData }: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  }, [isDark]);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      background: isDark ? 'var(--card)' : '#fff',
      borderBottom: '1px solid var(--border)',
      marginBottom: '1.5rem',
      // Negative margin to cancel parent padding on sides:
      marginLeft: '-1.5rem',
      marginRight: '-1.5rem',
      width: 'calc(100% + 3rem)',
    }}>
      {/* Left: Crowe wordmark */}
      <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#011E41', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
        Crowe
      </span>
      {/* Center: company + period */}
      <span style={{ color: 'var(--foreground)', fontSize: '0.875rem', fontWeight: 500 }}>
        {seedData.company.name} — {seedData.periodLabel}
      </span>
      {/* Right: theme toggle */}
      <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}>
        {isDark ? <Sun1 size={20} color="var(--accent)" /> : <Moon size={20} color="var(--foreground)" />}
      </button>
    </header>
  );
}
```

**Margin math for header inside padded main:** The `<main>` has `padding: 1.5rem`. The header needs to span full width including the padding gutters. Use `marginLeft: '-1.5rem'; marginRight: '-1.5rem'; width: 'calc(100% + 3rem)'` and `marginBottom: '1.5rem'` (replaces the padding gap below it). Alternatively, restructure the layout so the header is OUTSIDE the `<main>` padding (move it above `<main>` in the flex column). The simplest approach is the negative-margin trick to avoid restructuring the outer layout.

**Simpler alternative:** Move the `<DashboardHeader>` out of `<main>` entirely, rendering it between `<aside>` and `<main>` in the outer flex row isn't workable (wrong axis). Instead, wrap `<main>` content in a column flex container where the header is the first child with no padding, and the scrollable section has padding.

### SectionHeader Component Pattern

```tsx
// src/components/dashboard/SectionHeader.tsx
// Reusable two-line section heading. No 'use client'.

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <h2 style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'var(--muted)',  // Use --muted not --muted-foreground (see Pitfalls)
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: 0,
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--muted-color)',  // Use --muted-color for secondary muted text
        margin: '0.125rem 0 0',
        lineHeight: 1.4,
      }}>
        {subtitle}
      </p>
    </div>
  );
}
```

### Section Title + Subtitle Inventory (locked in CONTEXT.md)

| Section | Component File | Current Title Status | Title | Subtitle |
|---------|---------------|---------------------|-------|----------|
| KPI Cards | `KpiSection.tsx` | No heading element | "KPI Cards" | "January 2026 Performance Snapshot — Key financials against prior month and scenario adjustments" |
| Close Tracker | `CloseTracker.tsx` | Has `<h2>Month-End Close Tracker</h2>` | "Close Tracker" | "Month-End Close Progress — Journal entry completion rates and days remaining to close target" |
| Margin Bridge | `MarginBridgeSection.tsx` | Has `<span>Margin Bridge</span>` in card header | "Margin Bridge" | "Scenario Impact on EBITDA — How lever adjustments flow through revenue, margin, and cost to adjusted EBITDA" |
| Charts | `ChartsSection.tsx` | No heading element | "Pipeline & Collections Health" | "AR aging risk, CRM pipeline funnel, and 13-week cash outlook" |
| AI Executive Summary | `AiSummarySection.tsx` | Has `<span>AI Executive Summary</span>` in card header | "AI Executive Summary" | "AI-Generated CFO Narrative — Two-paragraph executive summary synthesized from current scenario KPIs" |
| Scenario Panel | `ScenarioPanel.tsx` | Has its own panel header (not inspected fully) | "Scenario Controls" | "Adjust revenue, cost, and operations levers to model close outcomes in real time" |

**Key finding:** `CloseTracker`, `MarginBridgeSection`, and `AiSummarySection` already have their own internal section titles embedded in the card/section header. The `SectionHeader` component needs to be placed ABOVE the card boundary (before the card's own inner header) to serve as the section-level label. For `MarginBridgeSection` and `AiSummarySection`, the inner card header title can remain — the `SectionHeader` above it serves a different role (section context for the presenter).

For the Scenario Panel sidebar, the subtitle is added inside `ScenarioPanel.tsx` at the top of the sidebar, not via `DashboardApp.tsx` (the sidebar is a separate `<aside>` element outside the main content flow).

### ChartsSection Layout (already correct)

From reading `ChartsSection.tsx`, the layout is **already implemented** as a flex row for Pipeline + AR, with Cash Flow full-width below:

```tsx
// Already in ChartsSection.tsx — this IS the 2-column layout
<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
  <div style={{ display: 'flex', gap: '1.5rem' }}>  {/* Pipeline + AR side-by-side */}
    <div style={{ flex: 1, minWidth: 0 }}><PipelineChart /></div>
    <div style={{ flex: 1, minWidth: 0 }}><ArAgingChart /></div>
  </div>
  <CashFlowChart />  {/* Full-width below */}
</div>
```

WBNR-01 chart layout is therefore already met. The planner should verify this renders correctly at 1920px (browser QA) but no code changes are needed for the layout itself.

### KPI Grid (already correct)

From `KpiSection.tsx` line 57-61:
```tsx
<section style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
  padding: '0 0 1.5rem 0',
}}>
```

The 4-column grid is already implemented with no max-width constraint and no responsive media query breaking it. This is already WBNR-01 compliant. Confirm in browser QA only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme state management | Custom React Context or Redux slice for theme | `data-theme` attribute + `localStorage` (already in codebase) | Pattern already established; MutationObserver already used in MarginBridgeSection |
| Icon components for sun/moon | Custom SVG components | `Sun1`, `Moon` from `@/components/ui/icons` | Already exported at line 35-36 of icons.tsx |
| CSS-variable-aware colors | Computed style reads in JS | `var(--muted)`, `var(--muted-color)`, etc. in style strings | Browser resolves CSS vars in inline styles; no JS needed |
| Chart dark mode per-component state | Separate Redux slice for chart theme | MutationObserver pattern (established in MarginBridgeSection) | Reuse exact pattern; copy from MarginBridgeSection.tsx |

**Key insight:** Every pattern needed in Phase 9 already exists in the codebase. This phase is composition, not invention.

---

## Common Pitfalls

### Pitfall 1: `--muted-foreground` Variable Does Not Exist

**What goes wrong:** Charts reference `fill: 'var(--muted-foreground)'` in Recharts `tick` props. This variable is not defined in `globals.css`. In Tailwind v4 it is auto-generated, but since this project uses a custom CSS variable system, the variable may resolve to `initial` (empty), making tick labels invisible in some environments.

**Why it happens:** shadcn/ui uses `--muted-foreground` as a standard token name. The team established this in Phase 6 without verifying the variable exists in their custom globals.css.

**Evidence:** globals.css defines `--muted` and `--muted-color` but NOT `--muted-foreground`. The charts in PipelineChart, CashFlowChart, and MarginBridgeChart all use `fill: 'var(--muted-foreground)'`.

**How to avoid:** Either (a) add `--muted-foreground: var(--muted-color)` aliases in globals.css (one-line fix per theme block), OR (b) change all chart tick props to use `'var(--muted-color)'` directly. Option (a) is safer — less code churn across chart files.

**Warning signs:** Axis tick labels invisible or extremely faint in either theme during browser QA.

### Pitfall 2: Sticky Header Inside `overflowY: auto` Container

**What goes wrong:** `position: sticky` does not work when the element's scroll container (a parent with `overflow: auto`) is not the viewport. In this layout, `<main>` has `overflowY: auto` — the sticky header stickies within `<main>`'s scroll context, which IS the desired behavior (header stays at top as main scrolls). But if `<main>` does not actually scroll (content fits viewport), the sticky effect is invisible.

**How to avoid:** Ensure the sticky header is the FIRST child of `<main>`. The current `<div id="slot-header" />` placeholder IS the first child — preserving this position is correct.

**Warning signs:** At 1920px with a short content area, the page may not scroll at all, making the sticky behavior untestable. This is acceptable — the header is still present and visible.

### Pitfall 3: Header Width Bleeding into Parent Padding

**What goes wrong:** `<main>` has `padding: 1.5rem`. A sticky header inside it will be inset 1.5rem on all sides, not full-width. For a full-bleed header bar, compensate with negative margin + wider width, or restructure the layout.

**How to avoid:** Use `marginLeft: '-1.5rem'; marginRight: '-1.5rem'; width: 'calc(100% + 3rem)'` on the header div, plus `marginTop: '-1.5rem'` to cancel the top padding (then add the top padding back via `paddingTop` on the first content section below). Alternatively, add a wrapper inside main that separates the header (no padding) from the scrollable content (with padding).

**Warning signs:** Header visually indented from edges of the main column.

### Pitfall 4: Preset Count (6, not 5)

**What goes wrong:** CONTEXT.md says "5 presets" and names only "Jan 2026 Baseline, Conservative Close, Q4 Push for Target, Fuel Cost Shock, and the 5th preset." The actual `scenario-presets.json` has 6 presets: `baseline`, `conservative`, `q4-push`, `fuel-shock`, `cash-mode` ("Cash Preservation Mode"), and `optimistic` ("Optimistic Recovery").

**How to avoid:** Browser QA checklist must test all 6 presets, not 5.

**Warning signs:** QA checklist misses Cash Preservation Mode or Optimistic Recovery.

### Pitfall 5: `muted-foreground` Used as Tooltip Style but Missing as Variable

**What goes wrong:** `PipelineTooltip` uses `color: 'var(--muted-foreground)'` (line 29 of PipelineChart.tsx). This is a tooltip text color. If the variable is undefined, tooltip secondary text is invisible.

**Fix:** Same fix as Pitfall 1 — add alias `--muted-foreground: var(--muted-color)` to both theme blocks in globals.css.

### Pitfall 6: DashboardApp Footer Still Says "Phase 8"

**What goes wrong:** Line 89 of DashboardApp.tsx contains `FP&amp;A Close Efficiency Dashboard — Phase 8 AI Executive Summary active`. This will show as a minor console/visual issue.

**How to avoid:** Update the text to reflect Phase 9 completion, or remove it entirely.

---

## Code Examples

### Adding `--muted-foreground` Alias to globals.css

```css
/* globals.css — add to BOTH theme blocks */

:root,
html[data-theme="light"] {
  /* ... existing vars ... */
  --muted-foreground: var(--muted-color);  /* alias for chart compatibility */
}

html[data-theme="dark"] {
  /* ... existing vars ... */
  --muted-foreground: var(--muted-color);  /* alias for chart compatibility */
}
```

This is a one-line addition per theme block that makes all chart `tick={{ fill: 'var(--muted-foreground)' }}` props resolve correctly without touching any chart file.

### Theme Toggle Handler Pattern

```typescript
// Reuse from MarginBridgeSection.tsx — already battle-tested
const toggleTheme = useCallback(() => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
}, []);
```

### SectionHeader Usage in KpiSection

```tsx
// Before the <section> grid in KpiSection.tsx:
import SectionHeader from '@/components/dashboard/SectionHeader';

// Inside the return, wrapping the existing section:
<>
  <SectionHeader
    title="KPI Cards"
    subtitle="January 2026 Performance Snapshot — Key financials against prior month and scenario adjustments"
  />
  <section aria-label="KPI Metrics" style={{ display: 'grid', ... }}>
    ...
  </section>
</>
```

### Build Verification Command

```bash
# Run from the app directory
cd "Catie/FP&A Application/fpa-close-efficiency-dashboard"
npm run build 2>&1 | tail -30

# Full Vitest run from project root
node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose
```

---

## State of the Art

| Area | Current State | Phase 9 Change |
|------|--------------|----------------|
| Dark mode detection | MutationObserver pattern in MarginBridgeSection only | Extend same pattern to DashboardHeader |
| Theme toggle | No toggle button exists — only blocking script in layout.tsx sets theme from localStorage | Add toggle button to DashboardHeader |
| Section headings | Mixed: CloseTracker has `<h2>`, MarginBridge/AiSummary have card-header spans, KpiSection/ChartsSection have nothing | Uniform `SectionHeader` component across all 6 sections |
| Chart tick colors | `var(--muted-foreground)` used — likely undefined alias | Add CSS alias in globals.css |
| Preset count | 5 named in CONTEXT.md | 6 actual presets confirmed in scenario-presets.json |
| ChartsSection layout | Already flex 2-column (Pipeline + AR) + full-width Cash Flow | No change needed |
| KPI grid | Already `repeat(4, 1fr)` — no max-width constraint | No change needed |
| DashboardApp footer | Says "Phase 8 AI Executive Summary active" | Update to Phase 9 or remove |

---

## Scenario Preset Inventory (for QA Checklist)

All 6 presets confirmed from `scenario-presets.json`:

| # | ID | Label | Notable Settings |
|---|-----|-------|-----------------|
| 1 | `baseline` | "Jan 2026 Baseline" | revenueGrowthPct: 0.03, grossMarginPct: 0.25, fuelIndex: 118 |
| 2 | `conservative` | "Conservative Close" | revenueGrowthPct: 0.00, conservativeForecastBias: true, tightenCreditHolds: true |
| 3 | `q4-push` | "Q4 Push for Target" | revenueGrowthPct: 0.065, lateInvoiceHours: 11, journalLoadMultiplier: 1.25 |
| 4 | `fuel-shock` | "Fuel Cost Shock" | grossMarginPct: 0.22, fuelIndex: 137 — EBITDA stress case |
| 5 | `cash-mode` | "Cash Preservation Mode" | collectionsRatePct: 0.99, prioritizeCashMode: true, tightenCreditHolds: true |
| 6 | `optimistic` | "Optimistic Recovery" | revenueGrowthPct: 0.06, grossMarginPct: 0.27, fuelIndex: 105 |

The `fuel-shock` preset (grossMarginPct: 0.22, fuelIndex: 137) is the highest NaN risk: it compounds two adverse levers and may expose edge cases in the COGS/EBITDA selector math. Confirm EBITDA stays numeric (even if negative).

---

## Open Questions

1. **`--muted-foreground` undefined: does Tailwind v4 auto-define it?**
   - What we know: globals.css does not explicitly define it. Tailwind v4 generates CSS custom properties from the theme config.
   - What's unclear: Whether `@import "tailwindcss"` auto-injects a `--muted-foreground` value based on the Tailwind default palette.
   - Recommendation: Add the explicit alias `--muted-foreground: var(--muted-color)` in globals.css regardless. Belt-and-suspenders approach.

2. **DashboardHeader: sticky inside `<main overflowY: auto>` vs viewport-sticky**
   - What we know: `<main>` has `overflowY: auto`. Sticky within a scroll container works if that container is what scrolls.
   - What's unclear: At 1920px, does the dashboard content overflow the main column height? If the main column is taller than the viewport, the sticky header will work correctly. If not, sticky is a no-op (header is always visible anyway).
   - Recommendation: Implement as sticky-within-main per CONTEXT.md decision. The presenter scrolls within main; this is correct behavior.

3. **Scenario Panel subtitle placement**
   - What we know: The Scenario Panel is in the `<aside>` sidebar, not the `<main>` column.
   - What's unclear: Where exactly in ScenarioPanel.tsx to insert the subtitle (before or after the preset selector row).
   - Recommendation: Insert at the very top of ScenarioPanel's JSX return, before the slider groups. Use the same `SectionHeader` component.

---

## Validation Architecture

`workflow.nyquist_validation` is `true` in `.planning/config.json` — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (version from node_modules in fpa-close-efficiency-dashboard) |
| Config file | `Catie/FP&A Application/fpa-close-efficiency-dashboard/vitest.config.ts` |
| Quick run command | `node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose` |
| Full suite command | same (run from project root) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| WBNR-01 | KPI grid is 4 columns, no max-width constraint | manual-only | n/a — visual layout | Cannot be tested in Vitest headlessly |
| WBNR-01 | ChartsSection renders Pipeline + AR side-by-side | manual-only | n/a — visual layout | Already implemented; confirm in browser |
| WBNR-02 | CSS variables resolve in both themes | unit | Vitest: verify globals.css defines `--muted-foreground` | Simple string search in CSS file |
| WBNR-02 | Chart tick fills use CSS variables (not hardcoded hex) | manual-only | n/a — visual dark mode | Inspect DevTools in dark mode |
| WBNR-03 | TypeScript build passes | automated | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && npm run build` | Run once; zero exit code = pass |
| WBNR-04 | All 6 presets produce non-NaN KPI values | manual-only + unit | Vitest: selector smoke test with each preset's controls | Can unit-test selector output per preset |

### New Unit Tests Warranted

One valuable new Vitest test: a smoke test that feeds each of the 6 preset control objects into the KPI selectors and asserts no value is `NaN` or `Infinity`. This directly validates WBNR-04 without a browser.

```typescript
// Suggested test in existing test file or new src/__tests__/presetSmoke.test.ts
import scenarioPresets from '../data/scenario-presets.json';
import { makeStore } from '../store';
import { initializeFromSeedData } from '../store/scenarioSlice';
import { selectNetSales, selectCogs, selectEbitda } from '../store/kpiSelectors';

describe('All presets produce valid KPI values', () => {
  scenarioPresets.forEach(preset => {
    it(`${preset.label}: no NaN KPIs`, () => {
      const store = makeStore();
      store.dispatch(initializeFromSeedData({ baseInputs: MOCK_BASE_INPUTS, defaultControls: preset.controls }));
      const state = store.getState();
      expect(isFinite(selectNetSales(state))).toBe(true);
      expect(isFinite(selectCogs(state))).toBe(true);
      expect(isFinite(selectEbitda(state))).toBe(true);
    });
  });
});
```

This requires `MOCK_BASE_INPUTS` from the data layer test fixtures. Check if `dataLoader.test.ts` has a fixture available.

### Sampling Rate

- **Per task commit:** Full Vitest suite (`node ".../vitest.mjs" run --reporter=verbose`) — takes ~10 seconds
- **Per wave merge:** Full Vitest suite + `npm run build` from app directory
- **Phase gate:** Full Vitest suite GREEN + `npm run build` exits 0 + manual browser QA checklist complete

### Wave 0 Gaps

- [ ] No new test file strictly required — WBNR-01 and WBNR-02 are visual/manual
- [ ] Optional: `src/__tests__/presetSmoke.test.ts` — covers WBNR-04 selector math for all 6 presets
- [ ] `npm run build` as a CI-equivalent gate — not a Vitest test but required for WBNR-03

**Assessment:** Phase 9 is primarily browser-verified. Existing 80-test suite passes and continues to serve as regression guard. The optional smoke test for presets adds meaningful automated coverage for WBNR-04.

---

## Sources

### Primary (HIGH confidence)

- Direct file reads: `DashboardApp.tsx`, `layout.tsx`, `globals.css`, `KpiSection.tsx`, `ChartsSection.tsx`, `PipelineChart.tsx`, `ArAgingChart.tsx`, `CashFlowChart.tsx`, `MarginBridgeChart.tsx`, `MarginBridgeSection.tsx`, `CloseTracker.tsx`, `AiSummarySection.tsx`, `icons.tsx`, `ScenarioPanel.tsx`, `scenario-presets.json` — all authoritative source of truth
- `.planning/phases/09-webinar-readiness-and-polish/09-CONTEXT.md` — locked decisions, CONTEXT.md spec

### Secondary (MEDIUM confidence)

- `.planning/STATE.md` — Phase decision log, confirmed patterns from phases 6/7/8
- `.planning/REQUIREMENTS.md` — WBNR-01 through WBNR-04 acceptance criteria

### Tertiary (LOW confidence)

- None — all findings based on direct code inspection

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — confirmed from package.json and direct imports in source files
- Architecture: HIGH — all patterns confirmed from existing codebase code
- Pitfalls: HIGH — `--muted-foreground` gap confirmed by direct inspection of globals.css; preset count confirmed from JSON file
- Validation: HIGH — test runner command confirmed from STATE.md decisions

**Research date:** 2026-03-05
**Valid until:** Indefinite — findings based on static codebase inspection; valid until code changes
