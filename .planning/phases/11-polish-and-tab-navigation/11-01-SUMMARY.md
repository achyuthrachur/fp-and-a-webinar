---
phase: 11-polish-and-tab-navigation
plan: 01
subsystem: ui
tags: [framer-motion, react, typescript, kpi-cards, section-header, animation]

# Dependency graph
requires:
  - phase: 10-visual-identity-and-interactivity
    provides: SectionHeader with AnimatePresence explain panel, KpiCard with CountUp animation
provides:
  - SectionHeader with amber left border (3px var(--accent)), 1.5rem title, two-layer spring explain panel
  - KpiCard with $ prefix inheriting 1.75rem/700 from parent div (no font-size override)
affects:
  - 11-02-tab-navigation
  - Any phase using SectionHeader or KpiCard components

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Two-layer spring animation: outer motion.div controls height via spring, inner controls opacity with delay"
    - "Section hierarchy via amber left border wrapper div (not on h2 directly)"
    - "CSS inheritance for prefix symbols — remove overrides, inherit from parent"

key-files:
  created: []
  modified:
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/components/dashboard/SectionHeader.tsx
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/components/dashboard/KpiCard.tsx

key-decisions:
  - "subtitle p margin-top changed from 0.25rem to 0.375rem to account for the amber bar adding visual height to the title block"
  - "Two-layer spring pattern: outer controls height (stiffness:300, damping:28), inner controls opacity (duration:0.15, delay:0.08) — delay lets height start before text appears, prevents text flash"
  - "$ prefix span: removed fontSize/fontWeight override entirely (not set to inherit explicitly) — CSS natural inheritance from parent div handles it"

patterns-established:
  - "Two-layer AnimatePresence: outer height spring + inner opacity delay — avoids simultaneous opacity+height tween jank"
  - "Amber border hierarchy: wrapper div with borderLeft + paddingLeft, h2 inside (not styled with border directly)"

requirements-completed: [PLSH-01, PLSH-02, PLSH-03]

# Metrics
duration: 2min
completed: 2026-03-06
---

# Phase 11 Plan 01: Visual Polish — Section Titles, KPI $ Sizing, Spring Animation

**Amber left-border section titles at 1.5rem, visually matched $ prefix on KPI cards, and two-layer spring explain panel animation replacing the simultaneous tween.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-06T01:33:15Z
- **Completed:** 2026-03-06T01:34:52Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- PLSH-01: SectionHeader h2 increased from 1.125rem to 1.5rem, wrapped in div with 3px amber left border accent
- PLSH-02: KpiCard $ prefix span style attribute removed — $ now inherits 1.75rem / 700 from parent div, matching digit size
- PLSH-03: Explain panel replaced from single simultaneous tween to two-layer spring — outer div controls height expansion via spring (stiffness:300, damping:28), inner div controls text opacity with 80ms delay

## Task Commits

Each task was committed atomically:

1. **Task 1: SectionHeader amber border + title size + spring animation** - `034d6e4` (feat)
2. **Task 2: KpiCard remove $ prefix font-size override** - `21c0211` (fix)

**Plan metadata:** committed with SUMMARY.md (docs: complete plan)

## Files Created/Modified

- `Catie/FP&A Application/fpa-close-efficiency-dashboard/src/components/dashboard/SectionHeader.tsx` — wrapper div with borderLeft amber accent, h2 at 1.5rem, two-layer spring AnimatePresence panel
- `Catie/FP&A Application/fpa-close-efficiency-dashboard/src/components/dashboard/KpiCard.tsx` — $ span style attribute removed (inherits from parent)

## Decisions Made

- subtitle `p` margin-top adjusted from 0.25rem to 0.375rem: the amber bar adds visual height to the title block, so a slightly larger gap keeps proportions correct
- Two-layer spring pattern chosen: outer height spring lets the panel physically expand before text appears, eliminating the opacity flash that occurred when both animated simultaneously
- $ span: inline style removed entirely (not set to `fontSize: 'inherit'`) — CSS default inheritance from the 1.75rem/700 parent div handles it without any explicit declaration

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. TypeScript clean (`tsc --noEmit` exits 0). Vitest suite: 64 passing, 22 pre-existing failures (dataLoader CSV schema issues unrelated to this plan).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- SectionHeader and KpiCard visual polish complete — both components ready for 11-02 tab navigation work
- No blockers or concerns

---
*Phase: 11-polish-and-tab-navigation*
*Completed: 2026-03-06*
