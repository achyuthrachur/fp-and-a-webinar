---
phase: 12-scene-storytelling-and-ai-formats
plan: 02
subsystem: ui, api
tags: [openai, nextjs, react-redux, scene-narrative, preset, caching]

# Dependency graph
requires:
  - phase: 12-scene-storytelling-and-ai-formats/12-01
    provides: SceneNarrative component, CalloutBadge, calloutRules.ts with BASELINE_NARRATIVES and CALLOUT_RULES
  - phase: 08-ai-executive-summary
    provides: enhance-summary API route pattern (lazy getOpenAI factory, non-streaming vs streaming)
  - phase: 11-polish-and-tab-navigation
    provides: DashboardApp with tab layout, TabId type, AnimatePresence fade
provides:
  - scenarioNarrativeCache.ts: in-memory Map keyed presetName:tabId, getCacheKey()
  - /api/scene-narrative route: non-streaming POST returning Response.json({ text }), tab-scoped system prompts
  - getActivePresetName(controls, presets) pure function in aiPromptUtils.ts
  - SceneNarrative integrated as first child of all 5 tab blocks in DashboardApp
  - SceneNarrative self-manages narrative state: auto-regenerates on named preset change, uses cache on repeat
affects:
  - 12-03-plan (audience/focus dropdowns for AiSummarySection)
  - future-phases using getActivePresetName or sceneNarrativeCache

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TabContent inner component pattern for useSelector inside Provider tree in DashboardApp
    - Non-streaming OpenAI call returning Response.json({ text }) with lazy getOpenAI factory
    - Self-managed narrative state in SceneNarrative: local useState + useEffect on [presetName, tabId]
    - In-memory session cache keyed by presetName:tabId resets on page refresh

key-files:
  created:
    - src/lib/scenarioNarrativeCache.ts
    - src/app/api/scene-narrative/route.ts
  modified:
    - src/features/model/aiPromptUtils.ts
    - src/components/DashboardApp.tsx
    - src/components/dashboard/SceneNarrative/SceneNarrative.tsx

key-decisions:
  - "TabContent inner component pattern: DashboardApp IS the Provider, so useSelector cannot be called in DashboardApp directly; extract TabContent child rendered inside Provider to call useSelector + getActivePresetName"
  - "SceneNarrative removes narrativeText/isLoading props — self-manages state per RESEARCH.md anti-pattern warning; DashboardApp only passes tabId + presetName + seedData"
  - "Custom Scenario skips API call and resets to baseline text — only named presets trigger /api/scene-narrative"
  - "Stale-on-mount handled naturally: tabs conditionally render, so SceneNarrative remounts on every tab switch; useEffect on [presetName, tabId] fires on mount"
  - "selectAr added to SceneNarrative KpiPayload for AR field in API body"

patterns-established:
  - "Non-streaming OpenAI route pattern: export const runtime = 'nodejs'; lazy getOpenAI() factory; Response.json({ text })"
  - "Tab-scoped system prompts: buildSceneSystemPrompt(tabId) switch with 5 dedicated prompt strings"
  - "Cache-first API strategy: check sceneNarrativeCache before firing fetch; store on success"

requirements-completed: [STORY-01, STORY-02]

# Metrics
duration: 3min
completed: 2026-03-06
---

# Phase 12 Plan 02: Scene Narrative Wire-Up Summary

**Non-streaming /api/scene-narrative route with tab-scoped prompts, in-memory preset:tab cache, and SceneNarrative integrated as first child of all 5 DashboardApp tabs with auto-regeneration on named preset selection**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-06T15:41:39Z
- **Completed:** 2026-03-06T15:45:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created `scenarioNarrativeCache.ts` — in-memory `Map<string, string>` keyed by `presetName:tabId` with `getCacheKey()` helper
- Created `/api/scene-narrative/route.ts` — non-streaming POST returning `Response.json({ text })` with per-tab system prompts (max_tokens: 80) and lazy `getOpenAI()` factory pattern
- Added `getActivePresetName(controls, presets)` pure function to `aiPromptUtils.ts` — shared by TabContent and AiSummarySection
- Wired `SceneNarrative` as first child of all 5 tab blocks via new `TabContent` inner component (solves Provider/useSelector nesting constraint)
- `SceneNarrative` now self-manages narrative state: auto-regenerates via `/api/scene-narrative` on named preset change, uses cache on repeat visits, silently degrades on error
- All 8 sceneStorytelling.test.ts tests GREEN

## Task Commits

1. **Task 1: Cache + Route + aiPromptUtils** - `45ac45e` (feat)
2. **Task 2: DashboardApp + SceneNarrative wiring** - `fc4d552` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified

- `src/lib/scenarioNarrativeCache.ts` - In-memory session cache: `Map<string, string>` + `getCacheKey(presetName, tabId)`
- `src/app/api/scene-narrative/route.ts` - Non-streaming POST: tab-scoped system prompts, `Response.json({ text })`, lazy OpenAI factory
- `src/features/model/aiPromptUtils.ts` - Added `getActivePresetName(controls, presets)` pure function
- `src/components/DashboardApp.tsx` - `TabContent` inner component for useSelector; SceneNarrative in all 5 tabs; footer updated to Phase 12
- `src/components/dashboard/SceneNarrative/SceneNarrative.tsx` - Self-managed state, auto-regeneration useEffect, removed narrativeText/isLoading props

## Decisions Made

- **TabContent pattern**: `DashboardApp` is the Redux `Provider` — `useSelector` cannot be called directly in it. Extracted `TabContent` inner component rendered inside `Provider` to call `useSelector` + `getActivePresetName`. Simpler than the `useActivePresetName` hook approach suggested in the plan since the tab block rendering logic naturally belongs in TabContent anyway.
- **SceneNarrative self-managed state**: Removed `narrativeText` and `isLoading` props per RESEARCH.md anti-pattern warning. Component now owns its state entirely.
- **Custom Scenario resets to baseline**: API call skipped for custom scenario (no meaningful preset context); text resets to `BASELINE_NARRATIVES[tabId]`.
- **selectAr imported for KpiPayload**: AR is part of `KpiPayload` interface; `selectAr` added to SceneNarrative imports alongside existing netSales/ebitda/cash selectors.

## Deviations from Plan

None — plan executed exactly as written. The TabContent pattern was one of the options explicitly described in the plan spec.

## Issues Encountered

None.

## Self-Check: PASSED

All created files exist. All commits verified in git log:
- `45ac45e`: feat(12-02): scenarioNarrativeCache + /api/scene-narrative route + getActivePresetName
- `fc4d552`: feat(12-02): wire SceneNarrative into all 5 tabs + auto-regeneration on preset change

All 8 sceneStorytelling.test.ts tests GREEN.

## Next Phase Readiness

- Phase 12-03 can now implement audience/focus dropdowns for `AiSummarySection` — `aiPromptUtils.ts` is ready for `buildUserPrompt` signature extension
- `getActivePresetName` exported and available for any component needing to derive the active preset label from Redux state
- `/api/scene-narrative` live and ready for browser testing at all 5 tabs

---
*Phase: 12-scene-storytelling-and-ai-formats*
*Completed: 2026-03-06*
