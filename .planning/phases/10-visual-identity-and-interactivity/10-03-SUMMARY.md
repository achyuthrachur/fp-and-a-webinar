---
phase: 10-visual-identity-and-interactivity
plan: 03
subsystem: ui
tags: [framer-motion, whileInView, scroll-animation, stagger, prefers-reduced-motion]

# Dependency graph
requires:
  - phase: 10-visual-identity-and-interactivity
    plan: 01
    provides: framer-motion ^12.35.0 installed
  - phase: 10-visual-identity-and-interactivity
    plan: 02
    provides: stable 86-test baseline, DashboardApp client boundary
provides:
  - scroll-triggered fade+slide entrance animations on all 5 animated dashboard sections
  - staggered KPI card reveal (8 cards, 60ms offset each, left-to-right grid order)
  - prefers-reduced-motion JS-level gating on all Framer Motion animations
affects: [VISU-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - whileInView + viewport once:true for scroll-triggered section entrances
    - SectionWrapper helper defined inside component to capture reducedMotion scope
    - kpiContainerVariants + kpiItemVariants stagger pattern (staggerChildren: 0.06)
    - motion.section as stagger container preserving aria-label + semantic HTML

key-files:
  created: []
  modified:
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/components/DashboardApp.tsx
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/components/dashboard/KpiSection.tsx

key-decisions:
  - "SECTION_ANIM defined at module scope; reducedMotion check inside component body to avoid SSR window access"
  - "SectionWrapper defined as local function inside DashboardApp to capture reducedMotion without prop drilling"
  - "motion.section used instead of motion.div+section nesting to preserve aria-label on the KPI grid"
  - "whileInView viewport margin -60px for sections, -40px for KPI grid triggers animation before full visibility"

requirements-completed: [VISU-02]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 10 Plan 03: Dashboard Scroll Animations Summary

**Framer Motion whileInView entrance animations on all 6 dashboard sections with staggered KPI card reveal at 60ms per card — all animations gated by prefers-reduced-motion JS check, 86/86 Vitest tests GREEN**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-05T22:15:47Z
- **Completed:** 2026-03-05T22:17:49Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `DashboardApp.tsx` updated: imports `motion` from framer-motion, defines `SECTION_ANIM` variant (fade + slide 20px, outQuint easing), adds `reducedMotion` JS-level check via `window.matchMedia`, defines `SectionWrapper` helper inside component body, wraps CloseTracker/MarginBridgeSection/ChartsSection/AiSummarySection each in `SectionWrapper` — 4 sections with scroll-triggered whileInView entrance
- `KpiSection.tsx` updated: imports `motion`, defines `kpiContainerVariants` (staggerChildren: 0.06) and `kpiItemVariants` (same fade+slide), adds `reducedMotion` check, converts `<section>` to `<motion.section>` stagger container with whileInView, wraps each of 8 KpiCard renders in `<motion.div variants={kpiItemVariants}>` — left-to-right, top-to-bottom 60ms staggered reveal
- All animations fire once only (`viewport: { once: true }`) — no re-trigger on re-scroll
- `prefers-reduced-motion: reduce` detected via JS-level `window.matchMedia` (CSS alone does not disable Framer Motion) — sets `initial={false}` and `whileInView={undefined}` skipping all animation
- 86/86 Vitest tests GREEN, TypeScript `tsc --noEmit` clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Add section-level whileInView animations in DashboardApp.tsx** — `154f433` (feat)
2. **Task 2: Add staggered KPI card animations in KpiSection.tsx** — `3a0dcd4` (feat)

## Files Modified

- `src/components/DashboardApp.tsx` — motion import, SECTION_ANIM, reducedMotion check, SectionWrapper helper, 4 section wrappers, footer text updated to Phase 10
- `src/components/dashboard/KpiSection.tsx` — motion import, kpiContainerVariants, kpiItemVariants, reducedMotion check, motion.section stagger container, 8 motion.div card wrappers

## Decisions Made

- `SECTION_ANIM` constant defined at module scope (no window access — just plain object) while `reducedMotion` check is inside the component body to safely read `window.matchMedia` after client hydration
- `SectionWrapper` is a local function inside `DashboardApp` rather than a standalone component — intentional design to capture `reducedMotion` from component scope without passing as prop; recreated on each render is acceptable for non-performance-critical section wrappers
- Used `motion.section` (not `div > section` nesting) in KpiSection so `aria-label="KPI Metrics"` stays on the animated element — preserves semantic HTML integrity
- Viewport margins: `-60px` for full sections (triggers before fully in view), `-40px` for KPI grid (tighter, grid is near top of scroll)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- FOUND: `src/components/DashboardApp.tsx` — contains `import { motion } from 'framer-motion'`
- FOUND: `src/components/DashboardApp.tsx` — contains `whileInView` (SectionWrapper definition, used 4 times)
- FOUND: `src/components/DashboardApp.tsx` — contains `reducedMotion` check (3 occurrences: variable, initial prop, whileInView prop)
- FOUND: `src/components/dashboard/KpiSection.tsx` — contains `staggerChildren: 0.06`
- FOUND: `src/components/dashboard/KpiSection.tsx` — 8 `motion.div` wrappers (one per KpiCard)
- FOUND: `src/components/dashboard/KpiSection.tsx` — contains `reducedMotion` check
- FOUND: commit `154f433` (feat(10-03): add whileInView section animations in DashboardApp.tsx)
- FOUND: commit `3a0dcd4` (feat(10-03): add staggered KPI card animations in KpiSection.tsx)
- VERIFIED: 86/86 Vitest tests GREEN (run from app directory)
- VERIFIED: TypeScript `tsc --noEmit` clean
