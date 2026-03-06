# Phase 11: Polish and Tab Navigation - Research

**Researched:** 2026-03-05
**Domain:** React tab navigation, Framer Motion spring animations, CSS typography, localStorage persistence
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Tab Layout and Position**
- Tab row position: Below the existing sticky 56px header — a second sticky row for tab navigation
- Tab row is sticky: Sticks below the header at the viewport top when scrolling tab content — always accessible
- 5 tabs: Overview | Close Tracker | Charts | AI Summary | Scenario
- Scenario Panel moves into Scenario tab: The 280px sidebar is removed from the persistent layout — Scenario controls only visible when Scenario tab is active. All other tabs get full content width.
- Active tab persistence: localStorage under key 'activeTab' — same pattern as theme toggle and explainMode
- Tab transition: Framer Motion fade (opacity) on tab content switch — existing framer-motion already installed

**Tab Visual Style**
- Active indicator: 2-3px amber bottom border (var(--accent)) — underline style, not pill/chip
- Inactive text: var(--muted-color) — muted/dimmed
- Active text: var(--foreground) — full foreground color + amber underline
- Tab row background: var(--card) — subtle lift from page background, sticky

**Overview Tab Content**
- Full dashboard summary — KPI cards + close status + Margin Bridge chart in one tab
- Margin Bridge also in Charts tab — reactive centerpiece appears in both Overview and Charts
- Tab content layout: Overview is the "everything at a glance" tab; other tabs are focused deep-dives

**Section Title Treatment (PLSH-01)**
- Size: Increase from current 1.125rem to 1.5rem (24px) — noticeably larger, clear hierarchy
- Accent: Left border (vertical amber bar) — 3-4px var(--accent) left border on the title block
- Pattern reuse: Same visual language as the explain panel border-left — creates consistent Crowe design language
- Title color: var(--foreground) — full foreground, bold weight (700)
- Subtitle: Unchanged — stays at 0.875rem, var(--muted-color), below the amber-accented title

**KPI $ Sign Sizing (PLSH-02)**
- Root cause: In KpiCard.tsx line 141, the `$` span has `fontSize: '1.1rem', fontWeight: 500` while the parent div has `fontSize: '1.75rem', fontWeight: 700`
- Fix: Remove the smaller span override — let `$` inherit the parent 1.75rem size (or set explicitly to `1.75rem, fontWeight: 700`)
- Scope: Only the currency prefix span in KpiCard.tsx needs updating — no other files

**Explain Panel Animation (PLSH-03)**
- Spring physics: Framer Motion spring — `type: 'spring', stiffness: 300, damping: 28` (~400ms natural settle with slight overshoot)
- Staggered two-step reveal: Height/container springs open first, then text content fades in with ~80ms delay
- Implementation: Two motion.div layers — outer for height spring, inner for text opacity with delay
- Exit: Reverse — text fades out fast, then height collapses with spring
- Overflow: `overflow: hidden` stays on the outer wrapper to clip during height animation

### Claude's Discretion
- Exact tab row height (suggest 48px)
- Tab text font size (suggest 0.875rem–0.9375rem, not too large)
- Spring stiffness/damping fine-tuning within the ~400ms target
- Whether to use `motion.section` or `motion.div` for tab content wrapper
- Transition direction for tab switch (fade only, no slide — simpler and less disorienting)

### Deferred Ideas (OUT OF SCOPE)
- None — all discussion stayed within Phase 11 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PLSH-01 | Section title typography is clearly hierarchical — matching Crowe heading scale (size, weight, color) so titles read as prominent headings, not muted labels | SectionHeader.tsx h2 fontSize 1.125rem → 1.5rem; add amber left border wrapper div |
| PLSH-02 | KPI card currency symbol ($) renders at the same visual size as the number, not subscript-small | KpiCard.tsx line 141: remove fontSize/fontWeight override from $ span |
| PLSH-03 | Explain mode panel enters and exits with an elegant spring animation — clean, smooth, no height flicker | Replace tween transition with framer-motion spring; add inner motion.div for text opacity stagger |
| NAV-01 | Dashboard layout uses 5-tab navigation (Overview, Close Tracker, Charts, AI Summary, Scenario) — no full-page scroll required to access any section | DashboardApp.tsx: remove aside sidebar, add TabRow + tabbed content switch |
| NAV-02 | Active tab persists across page refresh via localStorage | useState + useEffect localStorage pattern (same as ExplainContext.tsx) |
| NAV-03 | Tab content panels animate on switch (fade or slide transition) | Framer Motion AnimatePresence + motion.div opacity fade; key= prop drives exit/enter |
</phase_requirements>

---

## Summary

Phase 11 is a focused UI polish and layout restructuring phase. There are no new library dependencies, no new data layer changes, and no Redux store changes required. Every change is a component-level edit touching 2-3 files per requirement.

The three polish fixes (PLSH-01 through PLSH-03) are surgical: a CSS property change in SectionHeader.tsx, a span attribute removal in KpiCard.tsx, and an animation transition upgrade in SectionHeader.tsx. All three are isolated to existing files with no downstream type changes.

The tab navigation (NAV-01 through NAV-03) is the primary structural change. DashboardApp.tsx transforms from a two-column sidebar+main layout into a full-width layout with a sticky tab row. The tab state is a simple `useState<TabId>` initialized from localStorage on mount — identical to the `explainMode` pattern in ExplainContext.tsx. The Scenario Panel, currently a 280px fixed sidebar, moves intact into the Scenario tab content area.

**Primary recommendation:** Implement all three polish fixes in Plan 11-01, build the tab navigation layer in Plan 11-02, then add tab content transitions and QA in Plan 11-03.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | ^12.35.0 (installed) | Spring animations, AnimatePresence, tab fades | Already installed; used for SectionWrapper, explain panel |
| React | 19.x (installed) | Component state, useState/useEffect | Foundation |
| TypeScript | 5.x (installed) | Type safety for tab IDs, component props | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| localStorage API | Browser built-in | Tab persistence | Same pattern as explainMode, theme toggle |
| CSS custom properties | var(--accent), etc. | All colors in tab nav | All theming uses CSS vars — dark mode free |

### No New Dependencies
Phase 11 requires zero new npm installs. Framer Motion 12.35.0 is already installed with `AnimatePresence`, `motion.div`, and spring transition support.

---

## Architecture Patterns

### Recommended File Change Map
```
src/components/
├── DashboardApp.tsx          # PRIMARY: sidebar → tab layout (NAV-01, NAV-02, NAV-03)
└── dashboard/
    ├── SectionHeader.tsx     # PLSH-01 title size + amber border; PLSH-03 spring animation
    └── KpiCard.tsx           # PLSH-02: $ span fontSize fix (line 141)
```

No new files required for Plans 11-01 and 11-02. Plan 11-03 is QA only.

### Pattern 1: Tab State with localStorage Persistence (NAV-01, NAV-02)

**What:** `useState<TabId>` in DashboardApp, initialized from localStorage on mount.
**When to use:** Single-level navigation state within one client component.
**No separate Context needed** — the tab state lives and is consumed entirely within DashboardApp.

```typescript
// Source: established pattern in ExplainContext.tsx
type TabId = 'overview' | 'close-tracker' | 'charts' | 'ai-summary' | 'scenario';

const [activeTab, setActiveTab] = useState<TabId>('overview');

useEffect(() => {
  try {
    const stored = localStorage.getItem('activeTab') as TabId | null;
    const valid: TabId[] = ['overview', 'close-tracker', 'charts', 'ai-summary', 'scenario'];
    if (stored && valid.includes(stored)) setActiveTab(stored);
  } catch (_) {}
}, []);

const handleTabChange = (tab: TabId) => {
  setActiveTab(tab);
  try { localStorage.setItem('activeTab', tab); } catch (_) {}
};
```

**Key detail:** Validate the stored string against the valid tab ID list before using it. If an old or invalid value is stored, fall back to 'overview' silently.

### Pattern 2: Tab Row Sticky Below Header (NAV-01)

**What:** The tab row is `position: sticky; top: 56px` — it sticks exactly below the 56px DashboardHeader.
**When to use:** Second sticky row pattern after a primary sticky header.

```typescript
// Tab row — sticks 56px from top (below 56px DashboardHeader)
<nav
  style={{
    position: 'sticky',
    top: 56,
    zIndex: 40,
    height: 48,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 0,
    background: 'var(--card)',
    borderBottom: '1px solid var(--border)',
    // Cancel parent padding (mirrors DashboardHeader negative margin pattern)
    marginLeft: '-1.5rem',
    marginRight: '-1.5rem',
    width: 'calc(100% + 3rem)',
    padding: '0 1.5rem',
    marginBottom: '1.5rem',
  }}
>
  {TABS.map(tab => (
    <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
      height: '100%',
      padding: '0 1rem',
      background: 'none',
      border: 'none',
      borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
      color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-color)',
      fontWeight: activeTab === tab.id ? 600 : 400,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'color 150ms ease, border-color 150ms ease',
    }}>
      {tab.label}
    </button>
  ))}
</nav>
```

**Critical detail:** Use `borderBottom: '2px solid transparent'` on inactive tabs to prevent layout shift — all tabs have the same 2px border slot, only color changes.

### Pattern 3: Tab Content Fade with AnimatePresence (NAV-03)

**What:** `AnimatePresence mode="wait"` with `motion.div key={activeTab}` drives exit/enter fade.
**When to use:** Replacing content entirely on tab switch without re-mounting child components.

```typescript
// Source: framer-motion AnimatePresence docs, established in project for explain panel
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={reducedMotion ? false : { opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
  >
    {/* active tab content */}
  </motion.div>
</AnimatePresence>
```

**Key detail:** `mode="wait"` ensures the exit animation completes before the enter animation starts — prevents both tabs visible simultaneously. Duration 0.18s is fast enough to not feel slow.

**Key detail:** `reducedMotion` guard is already computed at the top of DashboardApp — reuse the same variable.

### Pattern 4: Spring Animation for Explain Panel (PLSH-03)

**What:** Two-layer `motion.div` — outer controls height spring, inner controls text opacity with delay.
**When to use:** Expanding panels where content must not be visible during height collapse.

```typescript
// Source: framer-motion spring docs; established overflow:hidden pattern in project
<AnimatePresence>
  {explainMode && explanation && (
    <motion.div
      key="explanation"
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{ overflow: 'hidden' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, delay: 0.08 }}  // 80ms delay after height starts
      >
        <div style={{
          marginTop: '0.75rem',
          padding: '0.875rem 1rem',
          background: 'var(--surface)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: '0 8px 8px 0',
          fontSize: '0.875rem',
          color: 'var(--muted-color)',
          lineHeight: 1.65,
        }}>
          {explanation}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

**Framer Motion spring behavior:** `stiffness: 300, damping: 28` produces ~400ms natural settle with slight overshoot — confirmed by framer-motion spring physics. Higher stiffness = faster; higher damping = less bounce.

**Why two layers:** Animating `height: 0 → 'auto'` with `opacity` on the same `motion.div` causes the text to fade in while the container is still at zero height, making it appear to flash. Separating the layers means height expands first, then text fades in after 80ms.

### Pattern 5: Section Title Treatment (PLSH-01)

**What:** Add a wrapper `div` with `paddingLeft + borderLeft` around the h2, not on the h2 itself.
**When to use:** Amber left border that spans both title and creates visual anchoring.

```typescript
// In SectionHeader.tsx — replace bare h2 with a wrapper
<div style={{ paddingLeft: '0.75rem', borderLeft: '3px solid var(--accent)' }}>
  <h2 style={{
    fontSize: '1.5rem',       // was 1.125rem
    fontWeight: 700,
    color: 'var(--foreground)',
    margin: 0,
    lineHeight: 1.3,
  }}>
    {title}
  </h2>
</div>
<p style={{
  fontSize: '0.875rem',
  color: 'var(--muted-color)',
  margin: '0.375rem 0 0',
  lineHeight: 1.5,
}}>
  {subtitle}
</p>
```

**Alternative:** Put `borderLeft` directly on the h2 with `paddingLeft`. Both work; the wrapper approach keeps it semantically clean and allows the subtitle to optionally align below without the border.

### Pattern 6: KPI $ Sign Fix (PLSH-02)

**What:** Remove explicit `fontSize` and `fontWeight` from the currency prefix `<span>` at line 141 in KpiCard.tsx so it inherits the parent div's `1.75rem / 700`.

Current (line 141):
```typescript
<span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
```

Fixed:
```typescript
<span>
```

Or explicit (equally valid):
```typescript
<span style={{ fontSize: '1.75rem', fontWeight: 700 }}>
```

**Why remove rather than match:** The `$` inherits `fontSize: '1.75rem'` and `fontWeight: 700` from its parent div already. Removing the override is the cleaner fix; no risk of future desync if parent size changes.

### Tab Content Structure

Each tab renders a `<section>` or `<div>` containing the relevant section components. No new wrapper components needed — reuse `SectionWrapper` (the existing `motion.div` scroll-trigger helper) within each tab's content.

```
Overview tab:    KpiSection + CloseTracker + MarginBridgeSection
Close Tracker:   CloseTracker (full)
Charts:          ChartsSection + MarginBridgeSection
AI Summary:      AiSummarySection
Scenario:        ScenarioPanel (moved from sidebar)
```

**Scenario tab note:** ScenarioPanel currently receives `presets={seedData.presets}` as a prop. The Scenario tab content simply renders `<ScenarioPanel presets={seedData.presets} />` — no structural change to ScenarioPanel.tsx needed. The full-width context gives the sliders more room; no layout changes inside ScenarioPanel.

### Layout After Refactor

```
<main style={{ flex: 1, ... }}>
  <DashboardHeader />         ← sticky, top: 0, height: 56px (unchanged)
  <TabRow />                   ← sticky, top: 56px, height: 48px (NEW)
  <AnimatePresence mode="wait">
    <motion.div key={activeTab}>
      {/* tab content for activeTab */}
    </motion.div>
  </AnimatePresence>
</main>
```

The `<aside>` sidebar is removed entirely. The outer `<div style={{ display: 'flex' }}>` wrapper can be simplified to just `<main>` taking full width.

### Anti-Patterns to Avoid

- **Do not use `AnimatePresence` without `mode="wait"`** — without it, exit and enter fire simultaneously and content overlaps.
- **Do not animate `height: 0 → 'auto'` with CSS transitions** — CSS cannot interpolate to `auto`. Framer Motion handles this by measuring the DOM element. Only Framer Motion's `motion.div` can do this.
- **Do not put `position: sticky` on the tab row without explicit `top` value** — browsers ignore sticky without a threshold. Use `top: 56` (matching header height).
- **Do not put `'use client'` on the tab content** — all section components already run inside DashboardApp's client boundary. The new tab components do not need their own directives.
- **Do not reset localStorage key on every render** — only write to localStorage in the `handleTabChange` callback, not in a `useEffect`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Height 0 → auto animation | CSS max-height hack | Framer Motion `height: 'auto'` | CSS needs explicit max-height; creates jarring snap at end |
| Tab exit/enter sequencing | Manual state flags for animating | AnimatePresence `mode="wait"` | Mode handles sequencing declaratively |
| Spring physics | Manual setTimeout/requestAnimationFrame | Framer Motion `type: 'spring'` | Spring model is physics-based; hand-rolled is always wrong |

---

## Common Pitfalls

### Pitfall 1: Tab Row `top` Value Out of Sync with Header Height
**What goes wrong:** If DashboardHeader height changes (e.g., wraps to two lines on narrow screens), the tab row overlaps it.
**Why it happens:** `position: sticky; top: 56px` is hardcoded to the 56px DashboardHeader height.
**How to avoid:** Use `top: 56` matching the exact `height: 56` in DashboardHeader. The dashboard is not responsive below 1024px per project requirements, so this is acceptable.
**Warning signs:** Tab row overlaps or gaps below header when testing.

### Pitfall 2: `height: 0 → 'auto'` Flicker Without `overflow: hidden`
**What goes wrong:** Content bleeds out during spring animation, text visible outside the panel.
**Why it happens:** Spring overshoots — container briefly exceeds its final height during animation.
**How to avoid:** `overflow: 'hidden'` on the outer `motion.div`. Already in current implementation; must stay on the outer wrapper, not the inner one.
**Warning signs:** Text visible below panel border during open animation.

### Pitfall 3: AnimatePresence Key Collision
**What goes wrong:** Tab content does not animate on switch — same component renders without exit/enter.
**Why it happens:** `key={activeTab}` must change when the tab changes. If two tabs render the same root component without a key, React reuses the DOM node and AnimatePresence sees no change.
**How to avoid:** Always use `key={activeTab}` on the `motion.div` inside `AnimatePresence`. Each tab ID is unique.
**Warning signs:** No fade animation on tab switch despite correct setup.

### Pitfall 4: localStorage Value Not Validated
**What goes wrong:** An old/stale tab ID from a previous app version causes a blank tab render.
**Why it happens:** Phase 12 might rename tab IDs; stored value is now invalid.
**How to avoid:** Always validate stored value against the known valid tab list before using it. Fall back to 'overview' silently.
**Warning signs:** Blank page after refresh.

### Pitfall 5: SectionWrapper Scroll-Trigger Fires on Hidden Tab Content
**What goes wrong:** Sections in non-active tabs are already "in view" when their tab is activated, so scroll-triggered animations don't fire.
**Why it happens:** `whileInView` uses IntersectionObserver; elements that mount already visible don't trigger a scroll event.
**How to avoid:** Tab content enters via the AnimatePresence fade — this is sufficient entrance animation. The existing `SectionWrapper` (`whileInView`) can be kept for sections within Overview tab that scroll. For other tabs, the tab fade IS the entrance. Consider wrapping non-Overview tab content in `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` instead of whileInView.
**Warning signs:** Charts/sections appear without animation when switching tabs.

### Pitfall 6: Pre-existing Test Failures
**What goes wrong:** The 22 pre-existing failing tests (dataLoader + closeStages) look like regressions from Phase 11 work.
**Why it happens:** These tests fail due to data layer issues from earlier phases (CSV schema mismatches) — unrelated to Phase 11.
**How to avoid:** Run tests before starting Phase 11 work to establish the pre-existing baseline (22 failing, 64 passing). After Phase 11, confirm the count is still 22 failing (same tests) and 64 passing.
**Warning signs:** New tests failing that were GREEN before Phase 11 changes.

---

## Code Examples

### Current SectionHeader Explain Panel (to be upgraded in PLSH-03)
```typescript
// Current — tween only, no two-layer spring stagger
transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
```

### Framer Motion Spring (v12.35.0) — Verified API
```typescript
// Source: framer-motion docs — spring transition
transition={{ type: 'spring', stiffness: 300, damping: 28 }}
// Produces: ~400ms settle, slight overshoot. Increase damping to reduce bounce.
// For exit (collapse): spring automatically runs in reverse.
```

### AnimatePresence mode="wait" (v12.35.0) — Verified API
```typescript
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}      // REQUIRED — key change triggers exit/enter cycle
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18 }}
  >
    {/* content */}
  </motion.div>
</AnimatePresence>
```

### localStorage Pattern (from ExplainContext.tsx — established project pattern)
```typescript
const [activeTab, setActiveTab] = useState<TabId>('overview');

useEffect(() => {
  try {
    const stored = localStorage.getItem('activeTab') as TabId | null;
    const valid: TabId[] = ['overview', 'close-tracker', 'charts', 'ai-summary', 'scenario'];
    if (stored && valid.includes(stored)) setActiveTab(stored);
  } catch (_) {}
}, []);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS `max-height` animation | Framer Motion `height: 'auto'` spring | Framer Motion v5+ | No more snapping at max-height; true physics-based height |
| Manual tab rendering logic | AnimatePresence `mode="wait"` | Framer Motion v4+ | Declarative exit/enter sequencing |
| Sidebar layout for scenario | Tab panel — full width | Phase 11 | Sliders get more room; layout cleaner for webinar |

**Not applicable in this project:**
- Radix UI Tabs (not in use; hand-built tabs consistent with project's copy-paste component approach)
- React Router (Next.js App Router handles routes; tabs are UI state only)

---

## Open Questions

1. **Overview tab: CloseTracker in full or compact form?**
   - What we know: CONTEXT.md says "KPI cards + close status + Margin Bridge chart" for Overview
   - What's unclear: "close status" could mean the full CloseTracker component or a condensed summary
   - Recommendation: Use the full `<CloseTracker seedData={seedData} />` in Overview. The Close Tracker tab also shows it — duplication is fine since tab switching unmounts/remounts, and CloseTracker is pure display (no side effects).

2. **Scroll position on tab switch**
   - What we know: Each tab mounts fresh content; scroll position stays at wherever main was
   - What's unclear: Should switching tabs reset scroll to top?
   - Recommendation: Add `window.scrollTo(0, 0)` in `handleTabChange` before setting state — prevents arriving at a new tab mid-scroll.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.0 |
| Config file | `vitest.config.ts` (app root) |
| Quick run command | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && node "./node_modules/vitest/vitest.mjs" run` |
| Full suite command | Same (all 11 test files, ~2s) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLSH-01 | Section title font size and border are set correctly | manual-only | Browser QA | N/A |
| PLSH-02 | $ span has no font-size override | manual-only | Browser QA | N/A |
| PLSH-03 | Explain panel spring animation — no flicker | manual-only | Browser QA | N/A |
| NAV-01 | 5 tabs render and content switches | manual-only | Browser QA | N/A |
| NAV-02 | Active tab persists across refresh | manual-only | Browser QA (refresh test) | N/A |
| NAV-03 | Tab content fades on switch | manual-only | Browser QA | N/A |

**Rationale for manual-only:** All Phase 11 changes are visual/animation. None involve pure functions, data transformations, or Redux selector logic. The existing Vitest suite tests the model layer (formatters, selectors, data loading) — UI component behavior is not tested by Vitest in this project (no React Testing Library setup, `environment: 'node'` in vitest.config.ts).

### Existing Test Baseline
- **Before Phase 11:** 86 tests total — 22 FAILING (pre-existing, closeStages + dataLoader), 64 PASSING
- **After Phase 11:** Must still be exactly 22 FAILING (same tests), 64 PASSING
- **Phase 11 adds zero new test files** — all requirements are visual/UI

### Wave 0 Gaps
None — existing test infrastructure covers all phase requirements. Phase 11 does not introduce new pure functions, selectors, or data transformations that warrant unit tests.

---

## Sources

### Primary (HIGH confidence)
- Direct file reads of `DashboardApp.tsx`, `SectionHeader.tsx`, `KpiCard.tsx`, `DashboardHeader.tsx`, `ExplainContext.tsx`, `globals.css` — actual codebase state as of 2026-03-05
- `framer-motion` v12.35.0 installed package — confirmed via `node -e "require('framer-motion/package.json').version"`
- `vitest.config.ts` — confirmed test configuration, environment, and include patterns
- Live test run output — confirmed 86 tests, 22 pre-existing failures, 64 passing

### Secondary (MEDIUM confidence)
- Framer Motion AnimatePresence `mode="wait"` — consistent with established project usage in SectionHeader.tsx
- Spring transition parameters (`stiffness: 300, damping: 28`) — from CONTEXT.md locked decision, consistent with framer-motion spring API

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — framer-motion v12 installed, all patterns used elsewhere in project
- Architecture: HIGH — based on direct codebase read, no guesswork
- Pitfalls: HIGH — derived from existing code patterns and test run output

**Research date:** 2026-03-05
**Valid until:** Stable (no external dependencies; all findings based on project files)
