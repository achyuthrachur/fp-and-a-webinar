---
phase: 10-visual-identity-and-interactivity
plan: "06"
subsystem: infra
tags: [vercel, webpack, recharts, next.js, build, deployment, qa]

requires:
  - phase: 10-05
    provides: All 4 VISU requirements implemented — landing page, animations, shadcn components, explain mode

provides:
  - Production build passing via webpack (not Turbopack) — recharts ESM issues bypassed
  - Vercel production deployment at https://fpa-close-efficiency-dashboard.vercel.app
  - aiPromptUtils.ts extracted from route.ts — buildUserPrompt no longer causes Next.js route type violation
  - .npmrc with legacy-peer-deps=true for Vercel npm install compatibility
  - AWAITING: 19-point browser QA human verification

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
  - "CHECKPOINT STATUS: awaiting 19-point browser QA human verification"

requirements-completed: []

duration: TBD (checkpoint reached)
completed: "2026-03-05"
---

# Phase 10 Plan 06: Production Build and Browser QA Summary

**Production webpack build passing, Vercel deployed — 19-point browser QA checkpoint awaiting human verification of all 4 VISU requirements**

## Performance

- **Duration:** ~25 min (Task 1 complete; checkpoint at Task 2)
- **Started:** 2026-03-05T22:30:00Z
- **Status:** CHECKPOINT REACHED — awaiting human QA at production URL

## Accomplishments

- Diagnosed and fixed three production build blockers:
  1. Turbopack ESM build failure: recharts 2.15.x `es6/` build imports missing files (`isWellBehavedNumber`, `PanoramaContext`) not published in the tarball; victory-vendor ESM stubs use bare `export * from "d3-scale"` which fails Turbopack strict ESM resolution
  2. Route type violation: `buildUserPrompt` exported from a Next.js route file triggers `OmitWithTag` constraint failure in `.next/types/` — extracted to `aiPromptUtils.ts`
  3. Vercel `npm install` peer dep conflict: recharts 2.15.4 requires React `^16||^17||^18` but project uses React 19 — added `.npmrc` with `legacy-peer-deps=true`
- Switched build to `next build --webpack` — webpack + CJS alias for recharts resolves all ESM issues
- Vitest 86/86 GREEN throughout all fix iterations
- Vercel production deployment succeeded: https://fpa-close-efficiency-dashboard.vercel.app

## Task Commits

1. **Task 1 (partial fix): Downgrade recharts + set turbopack.root** — `71f8f4e` (fix)
2. **Task 1 (final fix): Webpack build + route exports + .npmrc** — `49d6763` (fix)

## Files Created/Modified

- `src/features/model/aiPromptUtils.ts` — buildUserPrompt and KpiPayload extracted from route.ts (created)
- `.npmrc` — legacy-peer-deps=true for Vercel npm install (created)
- `next.config.ts` — turbopack.root + webpack alias for recharts CJS
- `package.json` — build script updated to `next build --webpack`; recharts pinned to `^2.15.4`
- `package-lock.json` — updated after recharts re-pin
- `src/app/api/enhance-summary/route.ts` — imports from aiPromptUtils, re-exports KpiPayload type
- `src/features/model/__tests__/aiSummary.test.ts` — imports from aiPromptUtils directly

## Decisions Made

- Switch to webpack build: Turbopack in Next.js 16.1.6 cannot resolve recharts' victory-vendor ESM stubs due to the bare `export * from "d3-scale"` pattern; webpack with a CJS alias resolves cleanly
- Extract buildUserPrompt: Next.js App Router enforces that route files only export HTTP method handlers (`GET`, `POST`, etc.) and special directives (`runtime`, `dynamic`); any other export causes a type constraint failure during `next build`
- .npmrc legacy-peer-deps: Vercel's fresh `npm install` fails without this flag because recharts 2.15.x peer deps predate React 19; the flag was needed locally too but had been applied with `--legacy-peer-deps` inline

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Turbopack ESM build failure blocking npm run build**
- **Found during:** Task 1 (production build check)
- **Issue:** recharts 2.15.x ES6 module build imports `isWellBehavedNumber` and `PanoramaContext` from victory-vendor's ESM stubs which re-export from bare `"d3-scale"` — Turbopack strict ESM resolution fails; these files are missing from the published tarball in 2.15.4
- **Fix:** Switched build to `next build --webpack`; added webpack `resolve.alias` to redirect `recharts` to its CJS `lib/index.js` build; set `turbopack.root: __dirname` to silence workspace root warning
- **Files modified:** `next.config.ts`, `package.json`
- **Verification:** `npm run build` completes cleanly with webpack; 86/86 tests GREEN
- **Committed in:** `71f8f4e`, `49d6763`

**2. [Rule 3 - Blocking] Fixed Next.js route type violation (buildUserPrompt export)**
- **Found during:** Task 1 (production build TypeScript phase)
- **Issue:** Next.js `next build` type-checks route files via `.next/types/` — any non-HTTP-method export causes `OmitWithTag` constraint failure; `buildUserPrompt` and `KpiPayload` exported from `route.ts` since Phase 8 were invisible to `tsc --noEmit` but fail `next build`
- **Fix:** Created `aiPromptUtils.ts` with `buildUserPrompt` and `KpiPayload`; updated `route.ts` to import from there; updated test to import directly from `aiPromptUtils`; kept type-only re-export in route for backward compatibility
- **Files modified:** `src/app/api/enhance-summary/route.ts`, `src/features/model/__tests__/aiSummary.test.ts`, `src/features/model/aiPromptUtils.ts` (new)
- **Verification:** webpack build TypeScript phase passes; 86/86 tests GREEN
- **Committed in:** `49d6763`

**3. [Rule 3 - Blocking] Added .npmrc with legacy-peer-deps for Vercel npm install**
- **Found during:** Task 1 (Vercel deploy after recharts downgrade attempt)
- **Issue:** recharts 2.15.4 peer dep `react@"^16||^17||^18"` conflicts with project's `react@^19.0.0`; Vercel's `npm install` without `--legacy-peer-deps` fails with ERESOLVE
- **Fix:** Added `.npmrc` with `legacy-peer-deps=true` — Vercel reads this file during install
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

- Production URL: https://fpa-close-efficiency-dashboard.vercel.app
- Checkpoint Task 2 (19-point browser QA) is active — human verification required
- After approval: SUMMARY.md will be updated, STATE.md advanced to mark Phase 10 complete

## Self-Check: PASSED

- Verified files: aiPromptUtils.ts exists, .npmrc exists, next.config.ts has webpack config
- Commits verified: 71f8f4e and 49d6763 in git log
- Vercel deploy succeeded at https://fpa-close-efficiency-dashboard.vercel.app
- Vitest 86/86 GREEN; TypeScript clean; npm run build passes

---
*Phase: 10-visual-identity-and-interactivity*
*Completed: 2026-03-05 (checkpoint pending)*
