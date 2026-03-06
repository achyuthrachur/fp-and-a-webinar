---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Defining requirements
stopped_at: Completed 12-scene-storytelling-and-ai-formats/12-03-PLAN.md — browser QA approved
last_updated: "2026-03-06T16:24:55.572Z"
last_activity: 2026-03-05 — Milestone v1.1 started — 3 phases, 8 plans, 12 requirements defined
progress:
  total_phases: 13
  completed_phases: 12
  total_plans: 41
  completed_plans: 41
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-05)

**Core value:** FP&A teams can interactively model real financial close scenarios and immediately see the impact on KPIs, charts, and an AI-generated executive narrative — fully functional for a live webinar demonstration.
**Current focus:** Phase 11 — Polish and Tab Navigation

## Current Position

Phase: Not started (Milestone v1.1 defined)
Plan: —
Status: Defining requirements
Last activity: 2026-03-05 — Milestone v1.1 started — 3 phases, 8 plans, 12 requirements defined

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: 29 min
- Total execution time: 1 hour

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 01-project-scaffolding | 2/3 | 58 min | 29 min |
| Phase 02-data-layer | 3/4 | 18 min | 6 min |

**Recent Trend:**
- Last 5 plans: P01(23min), P02(35min), P02-01(3min), P02-02(3min), P02-03(12min)
- Trend: Stable

*Updated after each plan completion*
| Phase 01-project-scaffolding P02 | 35 | 2 tasks | 8 files |
| Phase 02-data-layer P01 | 3 | 1 task | 1 file |
| Phase 02-data-layer P02 | 3 | 2 tasks | 7 files |
| Phase 02-data-layer P03 | 12 | 2 tasks | 3 files |
| Phase 03-kpi-cards-and-variance-layer P01 | 8 | 2 tasks | 3 files |
| Phase 03-kpi-cards-and-variance-layer P02 | 15 | 2 tasks | 7 files |
| Phase 03-kpi-cards-and-variance-layer P03-03 | 45 | 3 tasks | 6 files |
| Phase 04-scenario-control-panel P01 | 2 | 1 tasks | 1 files |
| Phase 04-scenario-control-panel P02 | 5 | 1 tasks | 1 files |
| Phase 04-scenario-control-panel P03 | 9 | 2 tasks | 2 files |
| Phase 05-close-stage-tracker P01 | 3 | 2 tasks | 2 files |
| Phase 05-close-stage-tracker P02 | 3 | 1 tasks | 1 files |
| Phase 05-close-stage-tracker P03 | 35 | 3 tasks | 4 files |
| Phase 06-static-charts P01 | 2 | 2 tasks | 3 files |
| Phase 06-static-charts P02 | 2 | 3 tasks | 6 files |
| Phase 06-static-charts P03 | 8 | 2 tasks | 0 files |
| Phase 07-reactive-margin-bridge P01 | 2 | 2 tasks | 3 files |
| Phase 07-reactive-margin-bridge P02 | 5 | 2 tasks | 2 files |
| Phase 07-reactive-margin-bridge P03 | 6 | 2 tasks | 3 files |
| Phase 07-reactive-margin-bridge P04 | 15 | 2 tasks | 3 files |
| Phase 08-ai-executive-summary P01 | 2 | 2 tasks | 3 files |
| Phase 08-ai-executive-summary P02 | 4 | 1 tasks | 2 files |
| Phase 08-ai-executive-summary P03 | 6 | 3 tasks | 4 files |
| Phase 08-ai-executive-summary P03 | 6 | 4 tasks | 4 files |
| Phase 09-webinar-readiness-and-polish P02 | 3 | 2 tasks | 7 files |
| Phase 09-webinar-readiness-and-polish P01 | 7 | 2 tasks | 3 files |
| Phase 09-webinar-readiness-and-polish P03 | 5 | 1 tasks | 0 files |
| Phase 10-visual-identity-and-interactivity P01 | 8 | 2 tasks | 4 files |
| Phase 10-visual-identity-and-interactivity P02 | 3 | 2 tasks | 3 files |
| Phase 10-visual-identity-and-interactivity P03 | 2 | 2 tasks | 2 files |
| Phase 10-visual-identity-and-interactivity P04 | 3 | 2 tasks | 8 files |
| Phase 10-visual-identity-and-interactivity P05 | 3 | 2 tasks | 9 files |
| Phase 10-visual-identity-and-interactivity P06 | 30 | 2 tasks | 7 files |
| Phase 11-polish-and-tab-navigation P01 | 2 | 2 tasks | 2 files |
| Phase 11-polish-and-tab-navigation P02 | 2 | 1 tasks | 1 files |
| Phase 11-polish-and-tab-navigation P03 | 12 | 1 tasks | 1 files |
| Phase 12-scene-storytelling-and-ai-formats P01 | 5 | 2 tasks | 5 files |
| Phase 12-scene-storytelling-and-ai-formats P02 | 3 | 2 tasks | 5 files |
| Phase 12-scene-storytelling-and-ai-formats P03 | 4 | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Build all source files from scratch — other developer's files unavailable; gives full control
- [Init]: OpenAI GPT-4o for AI narrative — user preference; streaming required to avoid Vercel timeout
- [Init]: Redux Toolkit (not Zustand) — 11 interdependent controls require createSelector memoization
- [Init]: Recharts 2.15.x (not 3.x) — 3.x is beta with breaking SVG API changes
- [Init]: Zod 3.24.x (not 4.x) — 4.x is beta with API changes from 3.x
- [Phase 01-project-scaffolding]: Added root: __dirname to vitest.config.ts to fix git-root vs app-dir mismatch in test discovery
- [Phase 01-project-scaffolding]: vitest invocation: use 'node .../vitest.mjs run' (npx vitest fails due to & ampersand in FP&A path)
- [Plan 01-02]: @reduxjs/toolkit ^2.0.0 — plan stated 5.0.1 but npm max is 2.11.2; use ^2.0.0
- [Plan 01-02]: eslint ^9 required by eslint-config-next@16.1.6 (not ^8)
- [Plan 01-02]: makeStore factory pattern for Redux store for SSR compatibility with Next.js App Router
- [Phase 01-02]: @reduxjs/toolkit ^2.0.0 — plan stated 5.0.1 but npm max is 2.11.2
- [Phase 01-02]: eslint ^9 required by eslint-config-next@16.1.6
- [Phase 01-02]: makeStore factory pattern for Redux store SSR compatibility with Next.js App Router
- [Phase 02-01]: beforeAll error-capture pattern for Wave 0 RED tests — catch ENOENT in beforeAll, re-throw in each it() so tests show as FAILED not SKIPPED in Vitest
- [Phase 02-01]: No vi.mock in dataLoader integration tests — real FS calls verify actual data file presence and computed values
- [Phase 02-02]: external_vendor_price_index.csv replaced entirely — existing file had wrong period format (YYYY-MM) and wrong scale (116+ vs 100-based baseline)
- [Phase 02-02]: is_actual in cash_13_week.csv uses bare string literals (not JSON booleans) — z.string() schema, CSV format
- [Phase 02-02]: variancePct=0.034 derived from MoM revenue: (9.2M-8.9M)/8.9M = 3.37% ≈ 3.4%
- [Phase 02-03]: ar_aging.csv FINAL version scales ar_90_plus upward to reach ar90Ratio=0.1095 (within 0.10-0.12 target), redistributing from ar_current — all 13 rows still balance
- [Phase 02-03]: erp_journal_entries.csv uses 98 rows with explicit posted/approved counts per stage to hit exact progress targets (78/70/67/59/62/47%)
- [Phase 02-03]: JE description field left empty string — schema has .optional(), consistent with plan template rows
- [Phase 03-01]: makeState uses inline Partial type cast to unknown as RootState to avoid Redux module resolution errors at test parse time
- [Phase 03-01]: Wave 0 TDD: beforeAll error-capture pattern used for kpiSelectors — catch import error, re-throw in each it() for FAILED not SKIPPED status
- [Phase 03-02]: FUEL_COGS_SHARE=0.18: fuel delta applies to 18% of cogsAtMargin to prevent unrealistic negative EBITDA at high fuel indexes
- [Phase 03-02]: redux installed explicitly: @reduxjs/toolkit requires redux as peer dep for ESM resolution in Vitest v4 node path
- [Phase 03-02]: Wave 0 test stub corrected: selectCogs fuel shock expected 7_999_360 fixed to 7_883_539 to match plan formula output
- [Phase 03-02]: CountUp duration in SECONDS not milliseconds — use duration={0.5} for 500ms
- [Phase 03-kpi-cards-and-variance-layer]: KpiCard/KpiSection omit 'use client' — run inside DashboardApp client boundary; CountUp uses raw integers with prefix/suffix labels; tsconfig jsx changed to react-jsx for standalone tsc --noEmit; Net Sales delta reads variancePct from seedData per DYNM-02
- [Phase 04-scenario-control-panel]: scenarioSlice.ts already complete — tests pass GREEN immediately; reducer contract validated with direct reducer(state,action) pattern
- [Phase 04-scenario-control-panel]: onValueChange used on all sliders (not onValueCommit) — fires on every drag position for live KPI updates
- [Phase 04-scenario-control-panel]: Switch thumb animation via inline <style> data-state CSS selectors — avoids React re-render jank
- [Phase 04-scenario-control-panel]: field-by-field ControlState comparison used for activePresetId — JSON.stringify risks key-order false negatives
- [Phase 04-scenario-control-panel]: Custom sentinel option added to Radix Select so partial edits show '— Custom —' not blank
- [Phase 04-scenario-control-panel]: align-items:flex-start on outer flex container required for position:sticky to work on sidebar
- [Phase 05-close-stage-tracker]: CloseStage.posted counts both posted AND approved status rows — progress = Math.round((posted+approved)/total*100)
- [Phase 05-close-stage-tracker]: pending-approval uses hyphen (not underscore) to match exact CSV status values in erp_journal_entries.csv
- [Phase 05-close-stage-tracker]: RAG thresholds: on-track >=75, at-risk 50-74, delayed <50 — pure function tests GREEN immediately from inline definitions
- [Phase 05-close-stage-tracker]: STAGE_NAMES uses exact CSV stage values ('Accruals & JEs', 'Revenue recognition') — two wrong names were in the hardcoded array
- [Phase 05-close-stage-tracker]: Icons imported from @/components/ui/icons barrel — no direct iconsax-react imports in new component files
- [Phase 05-close-stage-tracker]: CSS variables used for all RAG colors (--color-success, --accent, --color-error) — dark mode compatible without component changes
- [Phase 05-close-stage-tracker]: Contextual note omitted for on-track stages — shown only for at-risk and delayed for clean actionable UX
- [Phase 06-static-charts]: arAging and crmPipeline inserted after ar90Ratio in DashboardSeedData type — preserves field ordering convention and groups computed vs raw data logically
- [Phase 06-static-charts]: beforeAll error-capture pattern reused for charts.test.ts RED stubs — consistent with Phase 2 TDD approach; tests show as FAILED not SKIPPED in Vitest
- [Phase 06-static-charts]: No use client directives in ChartsSection files — they run inside DashboardApp existing client boundary
- [Phase 06-static-charts]: Hardcoded hex for SVG fill colors in Recharts — CSS variables do not resolve reliably inside SVG attributes
- [Phase 06-static-charts]: No code changes required in 06-03 — all 3 charts (Pipeline, AR Aging, Cash Flow) passed 19-point browser QA on first review; phase complete
- [Phase 07-reactive-margin-bridge]: Dual beforeAll blocks with chartUtilsError/selectorError: two separate modules need independent import error isolation in marginBridge.test.ts
- [Phase 07-reactive-margin-bridge]: baseEbitda formula: net_sales * seedGrossMarginPct - opex with no fuel adjustment (fuelIndex=100 baseline means FUEL_COGS_SHARE * 0 = 0)
- [Phase 07-reactive-margin-bridge]: seedGrossMarginPct derived from baseline preset in dataLoader.ts via presets.find(p => p.id === 'baseline') ?? presets[0]
- [Phase 07-reactive-margin-bridge]: buildMarginBridgeData accepts (baselineEbitda, adjustedEbitda, state) 3-param signature matching test stub; inline state computation derives lever deltas to avoid circular @/store import
- [Phase 07-reactive-margin-bridge]: selectFuelIndexImpact uses || 0 guard to prevent -0 floating point artifact (JavaScript -0 != 0 under Object.is used by Vitest toBe)
- [Phase 07-reactive-margin-bridge]: useStore().getState() used in MarginBridgeSection to pass full Redux state to 3-param buildMarginBridgeData (inline state computation avoids 6 separate useSelector calls)
- [Phase 07-reactive-margin-bridge]: No 'use client' in MarginBridgeChart.tsx or MarginBridgeSection.tsx — both run inside DashboardApp client boundary
- [Phase 07-reactive-margin-bridge]: Vercel production QA used instead of localhost — ampersand in FP&A path crashes Turbopack SQLite persistence from bash; production build is equivalent verification surface
- [Phase 07-reactive-margin-bridge]: 3 Vercel build fixes: BOM stripped from globals.css, tailwindcss added to devDependencies, baseEbitda/baseGrossMarginPct added to DEFAULT_BASE_INPUTS
- [Phase 08-ai-executive-summary]: Dual beforeAll blocks for route/cache modules — independent routeImportError/cacheImportError variables prevent one import failure masking the other in Wave 0 RED stubs
- [Phase 08-ai-executive-summary]: KpiPayload interface defined in route.ts and type-imported in aiSummary.test.ts — establishes the type contract Wave 1 must satisfy
- [Phase 08-ai-executive-summary]: Lazy OpenAI client init via getOpenAI() factory — module-level new OpenAI() throws when OPENAI_API_KEY absent in Vitest; moved to factory called only inside POST handler
- [Phase 08-ai-executive-summary]: ScenarioPreset.label used (not .name) — types.ts defines label field; plan template had wrong property name
- [Phase 08-ai-executive-summary]: Vitest must run from app directory — @/ aliases resolve only when cwd is fpa-close-efficiency-dashboard/
- [Phase 08-ai-executive-summary]: ScenarioPreset.label used (not .name) — types.ts defines label field; plan template had wrong property name
- [Phase 08-ai-executive-summary]: next/dynamic ssr:false for InfinityLoader — pure SVG has no browser globals but defensive guard per plan spec and consistent with React Bits intent
- [Phase 09-webinar-readiness-and-polish]: SectionHeader uses var(--muted) for title and var(--muted-color) for subtitle — intentional color hierarchy; no 'use client' directive; CloseTracker h2 fully replaced not wrapped
- [Phase 09-webinar-readiness-and-polish]: periodLabel does not exist on DashboardSeedData — DashboardHeader uses baseline preset label instead (same semantic value, correct type)
- [Phase 09-webinar-readiness-and-polish]: --muted-foreground alias pattern: add as alias of --muted-color in every theme block so chart tick fills and secondary text resolve across themes
- [Phase 09-webinar-readiness-and-polish]: Vitest must run from app directory (not repo root) — repo-root cwd picks up both Achyuth and Catie test files causing @/ alias resolution failures in Achyuth tests
- [Phase 09-webinar-readiness-and-polish]: Human QA APPROVED 2026-03-05 — all 16 checklist items passed (WBNR-01 layout, WBNR-02 dark mode, WBNR-03 zero console errors, WBNR-04 all 6 presets valid)
- [Phase 10-visual-identity-and-interactivity]: framer-motion installed with --legacy-peer-deps due to React 19 peer dep requirement
- [Phase 10-visual-identity-and-interactivity]: Vitest must run from app directory (not repo root) — repo root picks up Achyuth test files causing @/ alias failures
- [Phase 10-visual-identity-and-interactivity]: ExplainContext uses same localStorage persistence pattern as DashboardHeader theme toggle for consistency
- [Phase 10-visual-identity-and-interactivity]: Used fallback canvas particle implementation — reactbits.dev copy-paste not needed; plan provided exact fallback code matching all spec requirements
- [Phase 10-visual-identity-and-interactivity]: LandingBackground uses export default for next/dynamic compatibility; reducedMotion checked via window.matchMedia with SSR guard
- [Phase 10-visual-identity-and-interactivity]: SECTION_ANIM at module scope; reducedMotion check inside component body to avoid SSR window access
- [Phase 10-visual-identity-and-interactivity]: motion.section used (not div+section nesting) in KpiSection to preserve aria-label on animated stagger container
- [Phase 10-visual-identity-and-interactivity]: Copy-paste shadcn model: components use cn() + Crowe CSS vars directly (no --primary HSL tokens, no CLI) to avoid Tailwind v4 conflict
- [Phase 10-visual-identity-and-interactivity]: Only --radius added to globals.css (not full shadcn HSL token set) — components reference var(--accent), var(--border), var(--card) directly
- [Phase 10-visual-identity-and-interactivity]: ExplainProvider nesting: Provider > ExplainProvider > TooltipProvider — context available to full dashboard tree including DashboardHeader
- [Phase 10-visual-identity-and-interactivity]: explanation prop is optional on SectionHeader — zero-change backward compatibility for all existing callers
- [Phase 10-visual-identity-and-interactivity]: overflow: hidden on motion.div wrapper (not inner div) — required for height: 0 collapse to clip content correctly
- [Phase 10-visual-identity-and-interactivity]: 19-point browser QA APPROVED 2026-03-05 — all VISU-01 through VISU-04 verified at production URL; Milestone v1.0 complete
- [Phase 11-polish-and-tab-navigation]: Two-layer spring pattern: outer height spring (stiffness:300, damping:28) + inner opacity (delay:0.08) for explain panel — eliminates simultaneous opacity+height tween flash
- [Phase 11-polish-and-tab-navigation]: SectionHeader amber border: wrapper div with borderLeft+paddingLeft around h2 at 1.5rem — subtitle p stays outside wrapper
- [Phase 11-polish-and-tab-navigation]: KpiCard $ prefix: removed fontSize/fontWeight override entirely — CSS inheritance from parent 1.75rem/700 div handles it
- [Phase 11-polish-and-tab-navigation]: Tab layout replaces sidebar: aside removed; ScenarioPanel rendered only in Scenario tab
- [Phase 11-polish-and-tab-navigation]: AnimatePresence deferred to 11-03: tab content switches via conditional rendering only in 11-02
- [Phase 11-polish-and-tab-navigation]: localStorage fallback: invalid stored tab values silently fall back to 'overview' via valid[] includes() guard
- [Phase 11-polish-and-tab-navigation]: AnimatePresence mode='wait' with motion.div key={activeTab}: exit-then-enter sequence ensures outgoing tab fully fades before incoming tab appears
- [Phase 12-scene-storytelling-and-ai-formats]: BASELINE_NARRATIVES co-located in calloutRules.ts — both are pure config, single import for both concerns in SceneNarrative
- [Phase 12-scene-storytelling-and-ai-formats]: ControlState field names: plan spec had revenueGrowth/grossMarginTarget but actual slice uses revenueGrowthPct/grossMarginPct — corrected in SceneNarrative METRIC_RESOLVERS
- [Phase 12-scene-storytelling-and-ai-formats]: METRIC_RESOLVERS record pattern maps rule.metric string to resolver function — avoids switch/if chains in SceneNarrative component
- [Phase 12-scene-storytelling-and-ai-formats]: TabContent inner component pattern for useSelector inside Provider tree — DashboardApp IS the Provider, child component needed
- [Phase 12-scene-storytelling-and-ai-formats]: SceneNarrative self-manages narrative state — removes narrativeText/isLoading props, fires /api/scene-narrative on preset change, uses sceneNarrativeCache
- [Phase 12-scene-storytelling-and-ai-formats]: Non-streaming /api/scene-narrative route: lazy getOpenAI() factory, tab-scoped system prompts, Response.json({ text }), max_tokens:80
- [Phase 12-scene-storytelling-and-ai-formats]: Focus addition includes focus key name to satisfy AIFMT-02 toContain assertion
- [Phase 12-scene-storytelling-and-ai-formats]: AUDIENCE_SYSTEM_MODIFIERS and FOCUS_USER_ADDITIONS exported from aiPromptUtils.ts for testability
- [Phase 12-scene-storytelling-and-ai-formats]: Browser QA APPROVED 2026-03-06 — all 12 checks passed: SceneNarrative banners on all 5 tabs, callout badges, audience/focus dropdowns, stale detection, and narrative quality verified

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 8]: OpenAI streaming behavior with Next.js 16.1.6 App Router needs validation — `export const runtime = 'nodejs'` behavior on Vercel must be confirmed before AI phase begins
- [Phase 1]: 21st.dev and React Bits components must be inspected per-component for RSC/SSR compatibility before use — do not assume blanket compatibility
- [Data]: All 10 data files are synthetic — invest time making GL entries, AR aging buckets, and cash flow numbers internally consistent so FP&A professionals find them credible

## Session Continuity

Last session: 2026-03-06T16:00:00.000Z
Stopped at: Completed 12-scene-storytelling-and-ai-formats/12-03-PLAN.md — browser QA approved
Resume file: None
Resumed: N/A — project complete
