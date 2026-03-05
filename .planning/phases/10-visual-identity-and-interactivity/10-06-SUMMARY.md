---
phase: 10-visual-identity-and-interactivity
plan: "06"
subsystem: infra
tags: [vercel, webpack, recharts, next.js, build, deployment, qa, browser-qa]

requires:
  - phase: 10-05
    provides: All 4 VISU requirements implemented — landing page, animations, shadcn components, explain mode

provides:
  - Production build passing via webpack (not Turbopack) — recharts ESM issues bypassed
  - Vercel production deployment at https://fpa-close-efficiency-dashboard.vercel.app
  - aiPromptUtils.ts extracted from route.ts — buildUserPrompt no longer causes Next.js route type violation
  - .npmrc with legacy-peer-deps=true for Vercel npm install compatibility
  - All 4 VISU requirements VERIFIED by 19-point human browser QA at production URL

affects: []

tech-stack:
  added: []
  patterns:
    - "next build --webpack flag: bypasses Turbopack ESM resolution failures with recharts/victory-vendor"
    - "Route-safe exports: buildUserPrompt/KpiPayload extracted to aiPromptUtils.ts — Next.js route files must only export HTTP method handlers"
    - ".npmrc legacy-peer-deps=true: required for recharts 2.15.x + React 19 peer dep conflict on Vercel"

key-files:
  created:
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/features/model/aiPromptUtils.ts
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/.npmrc
  modified:
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/next.config.ts
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/package.json
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/package-lock.json
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/app/api/enhance-summary/route.ts
    - Catie/FP&A Application/fpa-close-efficiency-dashboard/src/features/model/__tests__/aiSummary.test.ts

key-decisions:
  - "next build --webpack instead of Turbopack: recharts 2.15.x ES6 build uses victory-vendor ESM stubs that re-export from bare 'd3-scale' — Turbopack strict ESM resolution fails; webpack resolves correctly via CJS alias"
  - "recharts webpack alias to lib/index.js (CJS): prevents webpack from picking the es6/ module entry via package.json 'module' field"
  - "buildUserPrompt extracted to aiPromptUtils.ts: Next.js build-time type checking enforces that route files only export HTTP handlers — non-handler exports cause type constraint failures in .next/types/"
  - ".npmrc legacy-peer-deps=true: recharts 2.15.4 declares peer react@'^16||^17||^18' but project uses react@19; --legacy-peer-deps bypasses this on Vercel where npm ci would otherwise fail"
  - "19-point browser QA APPROVED 2026-03-05 — all VISU-01 through VISU-04 verified at production URL"

patterns-established:
  - "Production QA gate: browser verification is the final gate for visual/interactive features that cannot be covered by unit tests"
  - "Webpack fallback pattern: for ESM-problematic libraries in Next.js, --webpack build with CJS alias is the reliable fix"

requirements-completed: [VISU-01, VISU-02, VISU-03, VISU-04]

duration: 30min
completed: "2026-03-05"
---

# Phase 10 Plan 06: Production Build and Browser QA Summary

**Production webpack build, Vercel deployment, and 19-point human browser QA — all 4 VISU requirements verified at https://fpa-close-efficiency-dashboard.vercel.app**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-03-05T22:30:00Z
- **Completed:** 2026-03-05T23:00:00Z
- **Tasks:** 2/2 (Task 1: production build + deploy; Task 2: 19-point browser QA checkpoint — approved)
- **Files modified:** 7

## Accomplishments

- Diagnosed and fixed three production build blockers (Turbopack ESM failure, route type violation, npm peer dep conflict)
- Switched to webpack build with recharts CJS alias — reliable fix for Next.js 16.x + recharts 2.x
- Deployed to Vercel production: https://fpa-close-efficiency-dashboard.vercel.app
- 19/19 browser QA checks passed — VISU-01 through VISU-04 all verified by human at production URL
- Vitest 86/86 GREEN confirmed post-approval
- Phase 10 complete. Milestone v1.0 complete — all 10 phases done.

## Task Commits

1. **Task 1 (partial fix): Downgrade recharts + set turbopack.root** — `71f8f4e` (fix)
2. **Task 1 (final fix): Webpack build + route exports + .npmrc** — `49d6763` (fix)
3. **Task 2: 19-point browser QA checkpoint** — human approved, no code changes required

## Files Created/Modified

- `src/features/model/aiPromptUtils.ts` — buildUserPrompt and KpiPayload extracted from route.ts (created)
- `.npmrc` — legacy-peer-deps=true for Vercel npm install (created)
- `next.config.ts` — turbopack.root + webpack alias for recharts CJS
- `package.json` — build script updated to `next build --webpack`; recharts pinned to `^2.15.4`
- `package-lock.json` — updated after recharts re-pin
- `src/app/api/enhance-summary/route.ts` — imports from aiPromptUtils, re-exports KpiPayload type
- `src/features/model/__tests__/aiSummary.test.ts` — imports from aiPromptUtils directly

## Browser QA Results (19/19 PASSED)

**VISU-01 — Landing Page**
1. `/` renders: Crowe Indigo Dark background, particles animation, wordmark, headline, 3 feature bullets, Amber CTA — PASS
2. "Enter Dashboard" CTA navigates to `/dashboard` — PASS
3. `/dashboard` directly loads all functionality — PASS

**VISU-02 — Animations**
4. KPI cards stagger left-to-right (~60ms delay) on fresh load — PASS
5. Sections fade+slide-up as they enter viewport on scroll — PASS
6. Animations do NOT re-fire on second scroll (once: true) — PASS
7. prefers-reduced-motion respected — PASS

**VISU-03 — shadcn Components**
8. shadcn Button in AI Summary (amber, rounded, hover state) — PASS
9. shadcn Select preset dropdown shows all 6 named presets, Crowe-themed — PASS
10. Preset selection updates KPI values correctly — PASS
11. Reset to defaults button works — PASS
12. KPI label hover shows Tooltip with description — PASS
13. Dark mode: Button/Select/Tooltip render correctly — PASS

**VISU-04 — Explain Mode**
14. Explain button appears in DashboardHeader left of theme toggle — PASS
15. Click Explain: all 6 panels reveal simultaneously, label changes to "Hide Explanations" — PASS
16. KPI Cards explanation text matches exactly — PASS
17. Close Tracker explanation text matches exactly — PASS
18. "Hide Explanations" collapses all 6 panels smoothly — PASS
19. Refresh with Explain ON: panels still visible (localStorage persistence) — PASS

## Decisions Made

- Switch to webpack build: Turbopack in Next.js 16.1.6 cannot resolve recharts' victory-vendor ESM stubs due to the bare `export * from "d3-scale"` pattern; webpack with a CJS alias resolves cleanly
- Extract buildUserPrompt: Next.js App Router enforces that route files only export HTTP method handlers; any other export causes a type constraint failure during `next build`
- .npmrc legacy-peer-deps: Vercel's fresh `npm install` fails without this flag because recharts 2.15.x peer deps predate React 19

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Turbopack ESM build failure blocking npm run build**
- **Found during:** Task 1 (production build check)
- **Issue:** recharts 2.15.x ES6 module build imports `isWellBehavedNumber` and `PanoramaContext` from victory-vendor's ESM stubs which re-export from bare `"d3-scale"` — Turbopack strict ESM resolution fails
- **Fix:** Switched build to `next build --webpack`; added webpack `resolve.alias` to redirect `recharts` to its CJS `lib/index.js` build; set `turbopack.root: __dirname` to silence workspace root warning
- **Files modified:** `next.config.ts`, `package.json`
- **Verification:** `npm run build` completes cleanly with webpack; 86/86 tests GREEN
- **Committed in:** `71f8f4e`, `49d6763`

**2. [Rule 3 - Blocking] Fixed Next.js route type violation (buildUserPrompt export)**
- **Found during:** Task 1 (production build TypeScript phase)
- **Issue:** Next.js `next build` type-checks route files via `.next/types/` — any non-HTTP-method export causes `OmitWithTag` constraint failure; `buildUserPrompt` and `KpiPayload` exported from `route.ts` since Phase 8
- **Fix:** Created `aiPromptUtils.ts` with `buildUserPrompt` and `KpiPayload`; updated `route.ts` to import from there; updated test to import directly from `aiPromptUtils`
- **Files modified:** `src/app/api/enhance-summary/route.ts`, `src/features/model/__tests__/aiSummary.test.ts`, `src/features/model/aiPromptUtils.ts` (new)
- **Verification:** webpack build TypeScript phase passes; 86/86 tests GREEN
- **Committed in:** `49d6763`

**3. [Rule 3 - Blocking] Added .npmrc with legacy-peer-deps for Vercel npm install**
- **Found during:** Task 1 (Vercel deploy after recharts downgrade attempt)
- **Issue:** recharts 2.15.4 peer dep `react@"^16||^17||^18"` conflicts with project's `react@^19.0.0`; Vercel's `npm install` without `--legacy-peer-deps` fails with ERESOLVE
- **Fix:** Added `.npmrc` with `legacy-peer-deps=true`
- **Files modified:** `.npmrc` (new)
- **Verification:** Vercel deploy succeeded — npm install completed, build completed
- **Committed in:** `49d6763`

---

**Total deviations:** 3 auto-fixed (all Rule 3 — blocking build issues)
**Impact on plan:** All three fixes were necessary to unblock production build. No scope creep; no functional changes to the application.

## Issues Encountered

- Recharts 2.14.1 downgrade attempt (intermediate step): 2.14.1 doesn't support React 19 — Vercel install failed with ERESOLVE. Reverted to 2.15.4 and solved the build issue via webpack + CJS alias instead.
- Local `npm run build` (Turbopack default): fundamentally broken for any recharts 2.x due to victory-vendor ESM stub design; the `--webpack` flag is the correct long-term fix for this project.

## User Setup Required

None — Vercel environment variables already configured in previous phases (OPENAI_API_KEY).

## Next Phase Readiness

- Phase 10 complete. Milestone v1.0 complete — all 10 phases done.
- Production URL: https://fpa-close-efficiency-dashboard.vercel.app
- All 35/35 plans complete. All 10 phases complete.

## Self-Check: PASSED

- Verified files: aiPromptUtils.ts exists, .npmrc exists, next.config.ts has webpack config
- Commits verified: 71f8f4e and 49d6763 in git log
- Vercel deploy succeeded at https://fpa-close-efficiency-dashboard.vercel.app
- Vitest 86/86 GREEN (confirmed post-QA-approval)
- 19/19 browser QA checks: APPROVED by human 2026-03-05
- VISU-01, VISU-02, VISU-03, VISU-04 all verified

---
*Phase: 10-visual-identity-and-interactivity*
*Completed: 2026-03-05*
