---
phase: 12
slug: scene-storytelling-and-ai-formats
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (existing) |
| **Config file** | `Catie/FP&A Application/fpa-close-efficiency-dashboard/vitest.config.ts` |
| **Quick run command** | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && node /c/Users/RachurA/AppData/Local/npm-cache/_npx/$(ls /c/Users/RachurA/AppData/Local/npm-cache/_npx/ | head -1)/node_modules/.bin/vitest.mjs run --reporter=verbose` |
| **Full suite command** | Same — all tests in `src/**/__tests__/**/*.test.ts` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run full Vitest suite from app directory
- **After every plan wave:** Run full suite
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 0 | STORY-01, STORY-02 | unit | `vitest run src/features/model/__tests__/sceneStorytelling.test.ts` | ❌ W0 | ⬜ pending |
| 12-01-02 | 01 | 0 | AIFMT-01, AIFMT-02 | unit | `vitest run src/features/model/__tests__/aiSummary.test.ts` | ✅ exists | ⬜ pending |
| 12-02-01 | 02 | 1 | STORY-01, STORY-02 | unit | `vitest run src/features/model/__tests__/sceneStorytelling.test.ts` | ❌ W0 | ⬜ pending |
| 12-02-02 | 02 | 1 | STORY-01 | manual | Browser: verify SceneNarrative banner appears at top of each tab | — | ⬜ pending |
| 12-03-01 | 03 | 2 | AIFMT-01, AIFMT-02 | unit | `vitest run src/features/model/__tests__/aiSummary.test.ts` | ✅ exists | ⬜ pending |
| 12-03-02 | 03 | 3 | AIFMT-01, AIFMT-02 | manual | Browser QA checkpoint: verify dropdowns appear, stale fires, Regenerate works | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/features/model/__tests__/sceneStorytelling.test.ts` — new file; stubs for STORY-01 (BASELINE_NARRATIVES export, route POST export) and STORY-02 (CALLOUT_RULES shape, `getCalloutStatus()` threshold function)
- [ ] Extend `src/features/model/__tests__/aiSummary.test.ts` — add stubs for AIFMT-01/02: `buildUserPrompt` called with `{ audience, focus }` includes audience modifier and focus addition in output

*Existing Vitest infrastructure covers all other requirements — no additional test files needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SceneNarrative banner visible at top of each tab | STORY-01 | React rendering — no component render tests per project constraints | Navigate to each of 5 tabs; verify indigo wash card with amber border appears above all content |
| Callout badges update color when slider moves EBITDA below threshold | STORY-02 | Live Redux + threshold check — no component tests | Drag Gross Margin slider to low value; verify callout badge changes from Teal to Coral |
| Scene narrative regenerates on tab visit after preset change | STORY-01 | API call behavior — mocked in unit tests only | Select "Conservative Close" preset; switch to Charts tab; verify narrative text updates |
| Audience dropdown changes AI narrative tone | AIFMT-01 | GPT-4o output — non-deterministic | Switch Audience to "Operations Team"; click Regenerate; verify narrative has ops-focused language |
| Focus dropdown changes metric emphasis | AIFMT-02 | GPT-4o output — non-deterministic | Switch Focus to "Cash & Working Capital"; click Regenerate; verify cash/AR metrics are prominent |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
