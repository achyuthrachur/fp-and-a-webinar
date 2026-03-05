---
phase: 08-ai-executive-summary
plan: "02"
subsystem: api
tags: [openai, streaming, gpt-4o, tdd, green-phase, wave-1, api-route, cache]

# Dependency graph
requires:
  - phase: 08-ai-executive-summary
    plan: "01"
    provides: Wave 0 RED stubs for route.ts and aiSummaryCache.ts, dual-beforeAll pattern, KpiPayload type contract
provides:
  - Full OpenAI streaming POST handler at /api/enhance-summary with buildUserPrompt export
  - Pre-cached BASELINE_SUMMARY CFO memo (2 paragraphs, $9.5M baseline data)
affects: [08-03-ai-summary-ui, wave-2-AiSummarySection-component]

# Tech tracking
tech-stack:
  added: []
  patterns: [lazy OpenAI client initialization pattern (getOpenAI factory) for test environment compatibility]

key-files:
  created: []
  modified:
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/app/api/enhance-summary/route.ts
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/lib/aiSummaryCache.ts

key-decisions:
  - "Lazy OpenAI client init via getOpenAI() factory — module-level new OpenAI() throws when OPENAI_API_KEY absent in Vitest; moved to factory called only inside POST handler"
  - "buildUserPrompt uses Array.join('\\n') pattern with explicit label strings — guarantees all 8 KPI labels and presetName appear in prompt, fully testable without mocking"
  - "BASELINE_SUMMARY locked to exact 08-CONTEXT.md wording — $9.5M, 22.6% margin, $959K EBITDA, $4.3M cash, $2.8M AR text not paraphrased"

patterns-established:
  - "Lazy service client pattern: wrap third-party SDK clients that validate env vars at instantiation in a factory function — prevents test environment failures"

requirements-completed: [AISU-01, AISU-04]

# Metrics
duration: 4min
completed: 2026-03-05
---

# Phase 8 Plan 02: AI Narrative Implementation — Wave 1 GREEN Summary

**OpenAI GPT-4o streaming route handler with lazy client init and pre-cached 2-paragraph BASELINE_SUMMARY CFO memo — turns all 6 RED tests GREEN (86/86 suite clean)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-05T15:20:05Z
- **Completed:** 2026-03-05T15:23:23Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Replaced route.ts stub with full implementation: lazy `getOpenAI()` factory, `buildUserPrompt` returning joined string with all 8 KPI labels and scenario name, POST handler calling `openai.chat.completions.create({ stream: true })` piped through native `ReadableStream`
- Replaced aiSummaryCache.ts stub with exact BASELINE_SUMMARY text from 08-CONTEXT.md: 2-paragraph CFO memo referencing $9.5M net revenue, 22.6% gross margin, $959K EBITDA, $4.3M cash, and $2.8M AR 90+ day watch threshold
- All 6 aiSummary.test.ts tests turned GREEN, full suite remains clean at 86/86

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement buildUserPrompt and BASELINE_SUMMARY (make tests GREEN)** - `6beb91f` (feat)

## Files Created/Modified

- `src/app/api/enhance-summary/route.ts` - Full OpenAI streaming handler: lazy getOpenAI() factory, buildUserPrompt (8 KPI labels + presetName + instruction), POST handler with gpt-4o stream:true and ReadableStream pipe, error boundary returning 500 JSON
- `src/lib/aiSummaryCache.ts` - BASELINE_SUMMARY string: 2-paragraph, ~450 chars, references $9.5M revenue, $959K EBITDA, 22.6% margin, $4.3M cash, $2.8M AR with 90-plus day bucket watch

## Decisions Made

- Lazy OpenAI client initialization: moved `new OpenAI()` out of module scope into `getOpenAI()` factory. The OpenAI SDK constructor throws immediately if `OPENAI_API_KEY` is absent or empty — which it is in the Vitest test runner environment. Moving the instantiation inside the POST handler means the module imports cleanly and `buildUserPrompt` is testable without any API key.
- BASELINE_SUMMARY text is verbatim from 08-CONTEXT.md — not paraphrased. The exact financial figures ($9.5M, 22.6%, $959K, $4.3M, $2.8M, 97%, 10.9%, 11%) are locked to the computed values from the CSV data files, ensuring CFO credibility for the live webinar demo.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Lazy OpenAI client init to prevent module-level throw in test environment**
- **Found during:** Task 1 (Implement buildUserPrompt and BASELINE_SUMMARY)
- **Issue:** Plan specified `const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })` at module level. OpenAI SDK constructor throws `"The OPENAI_API_KEY environment variable is missing or empty"` immediately when the env var is absent. Vitest imports route.ts during the `buildUserPrompt` tests, causing all 3 buildUserPrompt tests to FAIL with import error (not assertion failure).
- **Fix:** Replaced module-level `const openai` with `let _openai: OpenAI | null = null` and a `getOpenAI()` factory function. Factory is called only inside the POST handler body — never during module evaluation. Tests import the module cleanly and `buildUserPrompt` is exercised without touching OpenAI.
- **Files modified:** `src/app/api/enhance-summary/route.ts`
- **Verification:** Re-ran full Vitest suite — 86/86 GREEN, 0 failures
- **Committed in:** `6beb91f` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** Essential correctness fix. The lazy init pattern is standard practice for SDK clients that validate credentials at construction time. No scope creep — same external behavior in production (POST handler creates OpenAI client on first call, which is guaranteed to have OPENAI_API_KEY in Vercel environment).

## Issues Encountered

None beyond the auto-fixed lazy init issue above.

## Next Phase Readiness

- Wave 1 backend complete: `buildUserPrompt` (AISU-01) and `BASELINE_SUMMARY` (AISU-04) are production-ready
- Wave 2 (AiSummarySection UI component) can now import `BASELINE_SUMMARY` from `@/lib/aiSummaryCache` for zero-latency baseline display
- Wave 2 can call `/api/enhance-summary` POST with `{ kpis: KpiPayload, presetName: string }` and read the `text/plain` streaming response
- `export const runtime = 'nodejs'` is confirmed first export in route.ts — required for OpenAI SDK on Vercel
- No blockers — all 86 tests GREEN, openai package already installed

---
*Phase: 08-ai-executive-summary*
*Completed: 2026-03-05*
