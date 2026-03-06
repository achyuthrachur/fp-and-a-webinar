---
phase: 11
slug: polish-and-tab-navigation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.0 |
| **Config file** | `vitest.config.ts` (inside `Catie/FP&A Application/fpa-close-efficiency-dashboard/`) |
| **Quick run command** | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && node "./node_modules/vitest/vitest.mjs" run --reporter=verbose` |
| **Full suite command** | Same (all tests in `src/**/__tests__/**/*.test.ts`) |
| **TypeScript check** | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && npx tsc --noEmit` |
| **Estimated runtime** | ~15 seconds |

> **CRITICAL:** Run from INSIDE `fpa-close-efficiency-dashboard/` directory — NOT repo root (ampersand in FP&A path breaks npx; repo root picks up unrelated Achyuth/ test files causing false failures).

> **Baseline:** 86 tests total — some pre-existing failures in dataLoader/closeStages from earlier phases are unrelated to Phase 11. Phase 11 must not change the passing/failing counts.

---

## Sampling Rate

- **After every task commit:** Run Vitest suite — confirm passing count unchanged (no regressions)
- **After every plan wave:** Full suite + TypeScript check
- **Before `/gsd:verify-work`:** Full suite green + all browser QA items confirmed
- **Max feedback latency:** ~15 seconds (automated)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | PLSH-01 | unit suite (no regression) | `node .../vitest.mjs run` | existing | ⬜ pending |
| 11-01-02 | 01 | 1 | PLSH-02 | unit suite (no regression) | same | existing | ⬜ pending |
| 11-01-03 | 01 | 1 | PLSH-03 | unit suite (no regression) | same | existing | ⬜ pending |
| 11-02-01 | 02 | 2 | NAV-01, NAV-02 | unit suite (no regression) | same | existing | ⬜ pending |
| 11-03-01 | 03 | 3 | NAV-03 | browser QA | manual checkpoint | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No new test files needed — Phase 11 introduces no new pure functions requiring RED/GREEN TDD. All changes are visual/layout — verified via Vitest regression suite (no regressions) + manual browser QA.

*Existing 86-test Vitest suite provides full regression coverage throughout Phase 11.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Section titles (KPI Cards, Close Tracker, etc.) read as prominent 1.5rem headings with amber left border | PLSH-01 | Requires visual check | Compare before/after — title should be clearly larger and have amber bar beside it |
| $ symbol on all 8 KPI cards matches number size (1.75rem) | PLSH-02 | Requires visual check | Check each KPI card — $ should not appear subscript-small vs the number |
| Explain panel opens/closes with smooth spring animation, no height flicker | PLSH-03 | Requires UI interaction | Click Explain toggle — panel should spring open elegantly, text fades in after height |
| 5-tab navigation renders below sticky header, tabs are sticky | NAV-01 | Requires browser rendering | Load /dashboard — confirm 5 tabs visible, sticky behavior on scroll |
| Active tab persists across page refresh | NAV-02 | Requires localStorage check | Switch to Charts tab, refresh — confirm Charts is still active |
| Switching tabs triggers smooth fade transition | NAV-03 | Requires UI interaction | Switch between tabs — content should fade in, not snap |
| Scenario Panel is in Scenario tab only (no persistent sidebar) | NAV-01 | Requires layout check | View Overview tab — confirm no sidebar, full-width content |
| Overview tab shows KPI cards + close status + Margin Bridge | NAV-01 | Requires visual check | Overview tab should contain all three components |
| All 4 requirements pass at 1920×1080 with both themes | all | Requires viewport | Full visual QA at 1920×1080, light and dark |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (Vitest regression suite)
- [ ] Sampling continuity confirmed
- [ ] Wave 0 not needed — no new pure functions
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s (automated)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
