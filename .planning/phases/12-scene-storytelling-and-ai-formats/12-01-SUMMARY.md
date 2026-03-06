---
phase: 12-scene-storytelling-and-ai-formats
plan: "01"
subsystem: ui
tags: [react, redux, vitest, tdd, callout-rules, scene-narrative, badge]

requires:
  - phase: 11-polish-and-tab-navigation
    provides: TabId type, tab content switch in DashboardApp, AnimatePresence tab transitions
  - phase: 08-ai-executive-summary
    provides: aiPromptUtils.ts KpiPayload + buildUserPrompt, aiSummaryCache, beforeAll error-capture TDD pattern
  - phase: 03-kpi-cards-and-variance-layer
    provides: kpiSelectors (selectNetSales, selectEbitda, selectCash), Redux RootState
  - phase: 05-close-stage-tracker
    provides: CloseStage[] shape in DashboardSeedData, closeStages computed from journal entries

provides:
  - "src/lib/calloutRules.ts: CALLOUT_RULES (10 rules, 5 tabs), getCalloutStatus(), BASELINE_NARRATIVES constants"
  - "src/components/dashboard/SceneNarrative/SceneNarrative.tsx: banner card component"
  - "src/components/dashboard/SceneNarrative/CalloutBadge.tsx: colored pill badge"
  - "sceneStorytelling.test.ts: 8 RED tests for STORY-01/STORY-02 (tests 3-8 now GREEN after Task 2)"
  - "aiSummary.test.ts extended with AIFMT-01/02 stubs (remain RED until Plan 12-03)"

affects:
  - 12-02-scene-narrative-api
  - 12-03-ai-format-dropdowns
  - DashboardApp integration (Plan 12-02 adds SceneNarrative to each tab)

tech-stack:
  added: []
  patterns:
    - "BASELINE_NARRATIVES exported from calloutRules.ts alongside CALLOUT_RULES — single import for both tab narrative text and threshold rules"
    - "METRIC_RESOLVERS record maps rule.metric string to (kpis, seedData, controls) => number — avoids switch/if chains in SceneNarrative"
    - "CalloutBadge uses heuristic: if goodThreshold <= 1 treat value as ratio and format as % — no explicit format prop needed for most rules"

key-files:
  created:
    - src/lib/calloutRules.ts
    - src/components/dashboard/SceneNarrative/SceneNarrative.tsx
    - src/components/dashboard/SceneNarrative/CalloutBadge.tsx
    - src/features/model/__tests__/sceneStorytelling.test.ts
  modified:
    - src/features/model/__tests__/aiSummary.test.ts

key-decisions:
  - "BASELINE_NARRATIVES co-located in calloutRules.ts (not a separate file) — both are pure config with no React; single import handles both concerns in SceneNarrative"
  - "ControlState uses revenueGrowthPct/grossMarginPct (not revenueGrowth/grossMarginTarget) — plan spec had wrong field names; corrected to match scenarioSlice.ts"
  - "daysRemaining metric uses company.closeTargetBusinessDays as proxy — actual days-remaining computation requires date logic not yet in seedData; Plan 12-02 can refine"
  - "Pre-existing erp_gl_summary.csv modification (other developer) causes dataLoader.test.ts regression — logged to deferred-items.md, out of scope for Phase 12"

patterns-established:
  - "SceneNarrative: no 'use client', runs inside DashboardApp boundary — consistent with all Phase 10-11 dashboard components"
  - "CalloutBadge status colors via CSS variables: var(--color-success), var(--accent), var(--color-error) — dark mode compatible"
  - "loading pulse: inline keyframe @keyframes scene-narrative-pulse with background-position shift — simpler than CSS modules approach"

requirements-completed: [STORY-01, STORY-02]

duration: 5min
completed: 2026-03-06
---

# Phase 12 Plan 01: Scene Storytelling — Wave 0 TDD Stubs + calloutRules + SceneNarrative Component Summary

**calloutRules.ts with 10 FP&A threshold rules (5 tabs) + SceneNarrative banner component + CalloutBadge pill + BASELINE_NARRATIVES locked text; RED stubs for STORY-01/02/AIFMT-01/02**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-06T15:32:11Z
- **Completed:** 2026-03-06T15:37:20Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Established Wave 0 RED test stubs: sceneStorytelling.test.ts (8 tests) and 2 new AIFMT tests in aiSummary.test.ts — all fail as intended before implementation
- Created calloutRules.ts with 10 callout rules (2 per tab), getCalloutStatus() threshold function, and BASELINE_NARRATIVES for all 5 tabs — tests 1 and 3-8 now GREEN
- SceneNarrative.tsx renders banner card (indigo wash bg, amber left border, tab label + live callout badges + italic narrative text) using Redux selectors and METRIC_RESOLVERS map
- CalloutBadge.tsx renders colored pill with teal/amber/coral CSS variable colors based on status

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave 0 RED failing test stubs** - `8b71009` (test)
2. **Task 2: calloutRules.ts + SceneNarrative component** - `4a2ae45` (feat)

**Plan metadata:** (created next)

## Files Created/Modified

- `src/lib/calloutRules.ts` — CALLOUT_RULES array (10 rules, 5 tabs), getCalloutStatus() threshold function, BASELINE_NARRATIVES locked text constants
- `src/components/dashboard/SceneNarrative/SceneNarrative.tsx` — Banner card with tab label, live callout badges, italic narrative text; isLoading pulse state
- `src/components/dashboard/SceneNarrative/CalloutBadge.tsx` — Colored pill badge using var(--color-success/accent/color-error)
- `src/features/model/__tests__/sceneStorytelling.test.ts` — 8 RED test stubs (STORY-01: BASELINE_NARRATIVES + route POST; STORY-02: CALLOUT_RULES shape, tab coverage, getCalloutStatus thresholds)
- `src/features/model/__tests__/aiSummary.test.ts` — Appended AIFMT-01/02 RED stubs targeting future buildUserPrompt(kpis, preset, audience, focus) signature

## Decisions Made

- BASELINE_NARRATIVES exported from `calloutRules.ts` alongside CALLOUT_RULES — both are pure config, single import for both concerns in SceneNarrative
- ControlState field names corrected: plan spec referenced `revenueGrowth`/`grossMarginTarget` but actual slice uses `revenueGrowthPct`/`grossMarginPct`
- `daysRemaining` metric uses `company.closeTargetBusinessDays` as a proxy — actual remaining days requires date arithmetic not yet in seedData; Plan 12-02 can refine with a real computation
- `METRIC_RESOLVERS` record pattern avoids switch statements and keeps SceneNarrative declarative

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected ControlState field names in SceneNarrative METRIC_RESOLVERS**

- **Found during:** Task 2 (SceneNarrative implementation)
- **Issue:** Plan spec referenced `controls.revenueGrowth` and `controls.grossMarginTarget` but actual ControlState in scenarioSlice.ts uses `controls.revenueGrowthPct` and `controls.grossMarginPct`
- **Fix:** Used correct field names `revenueGrowthPct` and `grossMarginPct` in METRIC_RESOLVERS
- **Files modified:** src/components/dashboard/SceneNarrative/SceneNarrative.tsx
- **Verification:** TypeScript check shows no errors in new files; field access compiles correctly
- **Committed in:** 4a2ae45 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug: wrong field names from plan spec)
**Impact on plan:** Single field-name correction; no scope changes.

## Issues Encountered

- **vitest path**: `vitest.mjs` does not exist at `_npx/1415fee72ff6294b` — correct path is `_npx/69c381f8ad94b576/node_modules/vitest/vitest.mjs` (no `.bin/` shim needed)
- **Pre-existing CSV regression**: `erp_gl_summary.csv` modified by other developer before Phase 12 — causes `dataLoader.test.ts > baseNetSales` to return 14920000 instead of 9200000. Logged to `deferred-items.md`, not caused by Phase 12 changes.

## Test Status After Plan 12-01

| Test | Status |
|------|--------|
| sceneStorytelling Test 1: BASELINE_NARRATIVES shape | GREEN |
| sceneStorytelling Test 2: route POST function | RED (route created in Plan 12-02) |
| sceneStorytelling Tests 3-8: CALLOUT_RULES + getCalloutStatus | GREEN |
| aiSummary AIFMT-01/AIFMT-02 | RED (buildUserPrompt extended in Plan 12-03) |
| aiSummary Tests 1-6 (existing) | GREEN (no regression) |

## Next Phase Readiness

- Plan 12-02 can import SceneNarrative directly into DashboardApp and create the `/api/scene-narrative` route (makes Test 2 GREEN)
- calloutRules.ts is the single source of truth for threshold rules — Plan 12-02 uses it for the route's per-tab response shape
- BASELINE_NARRATIVES are locked text — Plan 12-02 cache layer overlays AI-generated text on top

---
*Phase: 12-scene-storytelling-and-ai-formats*
*Completed: 2026-03-06*
