---
phase: 9
slug: webinar-readiness-and-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.0 |
| **Config file** | `vitest.config.ts` (inside `Catie/FP&A Application/fpa-close-efficiency-dashboard/`) |
| **Quick run command** | `node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose` |
| **Full suite command** | Same |
| **Build check** | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && npx tsc --noEmit` |
| **Estimated runtime** | ~15 seconds (unit tests) |

> **CRITICAL:** Use `node .../vitest.mjs run` NOT `npx vitest` — ampersand in `FP&A` path breaks npx. Run from project root.

---

## Sampling Rate

- **After every task commit:** Run Vitest suite — confirm 86/86 still green (no regressions)
- **After every plan wave:** Full suite + TypeScript check
- **Before `/gsd:verify-work`:** Full suite green + all browser QA items confirmed
- **Max feedback latency:** ~15 seconds (automated)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 9-01-01 | 01 | 1 | WBNR-01, WBNR-02 | unit suite (no regression) | `node .../vitest.mjs run` | existing | ⬜ pending |
| 9-01-02 | 01 | 1 | WBNR-02 | unit suite | same | existing | ⬜ pending |
| 9-02-01 | 02 | 1 | WBNR-01, WBNR-02 | unit suite | same | existing | ⬜ pending |
| 9-02-02 | 02 | 1 | WBNR-01 | unit suite | same | existing | ⬜ pending |
| 9-03-01 | 03 | 2 | WBNR-03 | build check | `npx tsc --noEmit` | N/A | ⬜ pending |
| 9-03-02 | 03 | 2 | WBNR-01, WBNR-02, WBNR-03, WBNR-04 | browser QA | manual checkpoint | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No new test files needed — Phase 9 makes no new logic or pure functions that require RED/GREEN TDD. The existing 86-test suite provides regression coverage. Validation is:
1. Automated: Vitest suite stays green (no regressions from file edits)
2. Automated: `tsc --noEmit` passes clean
3. Manual: Browser QA checkpoint at end

*Existing infrastructure covers all phase requirements — no Wave 0 stubs needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sticky header visible at top on all scroll positions | WBNR-01 | Requires browser rendering | Scroll down in main content — confirm header stays pinned at top of main column |
| Company name + period label load from data | WBNR-01 | Requires live seedData | Confirm header shows "Summit Logistics Group" and "Jan 2026" (or similar) not placeholder text |
| Theme toggle switches light/dark correctly | WBNR-02 | Requires DOM interaction | Click sun/moon icon in header — confirm full page switches theme immediately |
| All charts readable in dark mode (tick labels, axes) | WBNR-02 | Requires visual inspection | Switch to dark mode — confirm all axis tick text, chart labels are visible (not invisible on dark bg) |
| Dashboard fills 1920px without gaps | WBNR-01 | Requires viewport sizing | Open at 1920×1080 — confirm no empty whitespace or overflow |
| Section subtitles visible on all 6 sections | WBNR-01 | Requires visual check | Scroll through dashboard — confirm title + subtitle on KPIs, Close Tracker, Margin Bridge, Charts, AI Summary, Scenario Panel |
| `npm run build` completes with zero errors | WBNR-03 | Requires build execution | Run Vercel deploy — confirm build log shows no TypeScript errors |
| Zero console errors in production | WBNR-03 | Requires browser console | Open deployed URL — confirm zero errors in DevTools Console |
| All 6 presets load valid output | WBNR-04 | Requires UI interaction | Load each preset (Baseline, Conservative, Q4 Push, Fuel Shock, Cash Preservation, Optimistic Recovery) — confirm all KPI cards and charts show non-NaN values |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 section confirmed not needed (no new pure functions)
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s (automated)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
