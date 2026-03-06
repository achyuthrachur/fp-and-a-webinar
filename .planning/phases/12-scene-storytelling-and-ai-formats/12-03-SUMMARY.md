---
phase: 12-scene-storytelling-and-ai-formats
plan: 03
subsystem: ui
tags: [react, openai, shadcn, select, typescript, prompt-engineering]

# Dependency graph
requires:
  - phase: 12-scene-storytelling-and-ai-formats/12-02
    provides: SceneNarrative component wired to all 5 tabs; aiSummaryCache; /api/scene-narrative route
  - phase: 10-visual-identity-and-interactivity
    provides: shadcn Select component at @/components/ui/Select
provides:
  - AudienceOption + FocusOption types exported from aiPromptUtils.ts
  - AUDIENCE_SYSTEM_MODIFIERS lookup record (5 audience tones) for system prompt injection
  - FOCUS_USER_ADDITIONS lookup record (5 focus areas) for user prompt injection
  - Extended buildUserPrompt(kpis, presetName, audience?, focus?) — backward-compatible
  - Extended /api/enhance-summary POST accepting audience/focus in body
  - AiSummarySection with Audience + Focus dropdowns and extended stale detection
affects:
  - future AI narrative enhancements
  - 12-CHECKPOINT (browser QA verifying dropdown behavior)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Audience tone injection: AUDIENCE_SYSTEM_MODIFIERS[audience] appended to system prompt string"
    - "Focus area injection: FOCUS_USER_ADDITIONS[focus] + focus key name appended to user prompt"
    - "Dropdown-to-stale pattern: ref snapshots at generation time, useEffect detects drift on next render"
    - "Control row placement: flex div outside card element, between SectionHeader and section"

key-files:
  created: []
  modified:
    - src/features/model/aiPromptUtils.ts
    - src/app/api/enhance-summary/route.ts
    - src/components/dashboard/AiSummarySection/AiSummarySection.tsx

key-decisions:
  - "Focus addition includes focus key name ('Focus Area: Cash & Working Capital') to satisfy AIFMT-02 toContain('Cash & Working Capital') assertion"
  - "AUDIENCE_SYSTEM_MODIFIERS and FOCUS_USER_ADDITIONS exported from aiPromptUtils (not route.ts) — keeps pure config in testable module"
  - "Audience/focus dropdown onValueChange handlers immediately update state; stale detection fires on next render via useEffect dependency array"

patterns-established:
  - "Prompt modifier lookup tables: export const RECORD: Record<OptionType, string> = { ... } co-located with buildUserPrompt in aiPromptUtils.ts"
  - "Ref snapshot pattern for dropdown drift: summaryAudienceRef.current = audience at generation time, compare in stale useEffect"

requirements-completed: [AIFMT-01, AIFMT-02]

# Metrics
duration: 4min
completed: 2026-03-06
---

# Phase 12 Plan 03: AI Summary Audience + Focus Dropdowns Summary

**Audience/Focus prompt injection via two shadcn Select dropdowns — AIFMT-01/02 GREEN, stale badge triggers on dropdown change, system prompt gets tone modifier and user prompt gets focus instruction**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-06T15:48:19Z
- **Completed:** 2026-03-06T15:51:44Z
- **Tasks:** 2 (auto tasks) + 1 checkpoint (paused for human verify)
- **Files modified:** 3

## Accomplishments

- Extended `buildUserPrompt` with optional `audience` and `focus` params; both AIFMT-01 and AIFMT-02 now GREEN
- Extended `/api/enhance-summary` POST to inject `AUDIENCE_SYSTEM_MODIFIERS[audience]` into system prompt and focus instruction into user prompt
- Added Audience + Focus Select dropdown control row between SectionHeader and the card in AiSummarySection, with drift detection and extended POST body

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend aiPromptUtils.ts and enhance-summary route** - `738b92e` (feat)
2. **Task 2: Audience + Focus dropdown UI in AiSummarySection** - `c968bf8` (feat)

## Files Created/Modified

- `src/features/model/aiPromptUtils.ts` - Added AudienceOption, FocusOption types; AUDIENCE_SYSTEM_MODIFIERS + FOCUS_USER_ADDITIONS exports; extended buildUserPrompt signature
- `src/app/api/enhance-summary/route.ts` - Extended POST to destructure audience/focus; builds systemPrompt with modifier; passes both to buildUserPrompt
- `src/components/dashboard/AiSummarySection/AiSummarySection.tsx` - Added audience/focus state + refs; extended stale detection useEffect; control row between SectionHeader and card; extended POST body

## Decisions Made

- Focus addition includes the focus key name (e.g., `Focus Area: Cash & Working Capital\n...`) so the literal string 'Cash & Working Capital' appears in the output — required to satisfy AIFMT-02's `toContain('Cash & Working Capital')` assertion
- `AUDIENCE_SYSTEM_MODIFIERS` and `FOCUS_USER_ADDITIONS` are exported from `aiPromptUtils.ts` (not `route.ts`) so they remain testable without Next.js route module constraints

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing test failure in `dataLoader.test.ts` (baseNetSales expected 9200000, got 14920000) caused by a modified `erp_gl_summary.csv` that was already in git working tree before this plan. This failure is **out of scope** — it is not caused by any changes in this plan. Logged to deferred items.

## Browser QA Checkpoint — APPROVED

**Task 3: checkpoint:human-verify** — All 12 checks passed (approved 2026-03-06).

Verified by human QA:
- SceneNarrative banner visible on all 5 tabs (indigo wash, amber left border)
- Callout badges functioning with correct teal/amber/coral threshold colors
- Audience + Focus dropdowns visible between SectionHeader and card in AI Summary tab
- Stale detection fires correctly on dropdown change (badge reappears)
- Regenerate with "Operations Team" audience produces operational-language narrative
- Regenerate with "Cash & Working Capital" focus produces cash/AR-focused narrative

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- Phase 12 Plan 03 fully complete including browser QA approval
- All AIFMT-01 and AIFMT-02 requirements verified end-to-end in production
- Audience tone + focus area prompt injection working in live dashboard

---
*Phase: 12-scene-storytelling-and-ai-formats*
*Completed: 2026-03-06*
