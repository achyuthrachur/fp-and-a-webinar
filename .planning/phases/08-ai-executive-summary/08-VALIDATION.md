---
phase: 8
slug: ai-executive-summary
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.0 |
| **Config file** | `vitest.config.ts` (project root, inside `Catie/FP&A Application/fpa-close-efficiency-dashboard/`) |
| **Quick run command** | `node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose` |
| **Full suite command** | Same (all tests in `src/**/__tests__/**/*.test.ts`) |
| **Estimated runtime** | ~15 seconds |

> **CRITICAL:** Use `node .../vitest.mjs run` NOT `npx vitest` — the ampersand in `FP&A` breaks npx shell parsing. Run from the project root `C:/Users/RachurA/OneDrive - Crowe LLP/VS Code Programming Projects/FP&A Webinar`.

---

## Sampling Rate

- **After every task commit:** Run quick run command above
- **After every plan wave:** Run full suite + browser QA checklist items for that wave
- **Before `/gsd:verify-work`:** Full suite green + all browser QA items verified
- **Max feedback latency:** ~15 seconds (automated); ~5 minutes (manual browser QA per wave)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 0 | AISU-01, AISU-04 | unit (RED stubs) | `node .../vitest.mjs run --reporter=verbose` | ❌ W0 | ⬜ pending |
| 8-02-01 | 02 | 1 | AISU-01 | unit (GREEN) | same | ❌ W0 | ⬜ pending |
| 8-02-02 | 02 | 1 | AISU-04 | unit (GREEN) | same | ❌ W0 | ⬜ pending |
| 8-03-01 | 03 | 2 | AISU-01 | browser QA | manual (Network tab) | N/A | ⬜ pending |
| 8-03-02 | 03 | 2 | AISU-02 | browser QA | manual (streaming text) | N/A | ⬜ pending |
| 8-03-03 | 03 | 2 | AISU-03 | browser QA | manual (React Bits animation) | N/A | ⬜ pending |
| 8-03-04 | 03 | 2 | AISU-04 | browser QA | manual (fresh page load, no API call) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/features/model/__tests__/aiSummary.test.ts` — RED stubs for AISU-01 (`buildUserPrompt`) and AISU-04 (`BASELINE_SUMMARY`) using beforeAll error-capture pattern
- [ ] `src/app/api/enhance-summary/route.ts` — must exist (even as stub) and export `buildUserPrompt` as named export for test import
- [ ] `src/lib/aiSummaryCache.ts` — must exist (even as stub) and export `BASELINE_SUMMARY`

*Existing vitest.config.ts `include` glob covers `src/**/__tests__/**/*.test.ts` — no new config needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Streaming arrives incrementally (not all-at-once) | AISU-01 | Requires live OpenAI API call + network inspection | DevTools → Network → select enhance-summary → confirm chunks arrive progressively in Response tab |
| Blinking `\|` cursor visible during streaming | AISU-02 | Requires browser rendering + timing | Visual: cursor blinks at ~1Hz while text is streaming |
| Cursor disappears when stream completes | AISU-02 | Requires stream lifecycle timing | Visual: cursor gone within 100ms of last chunk |
| React Bits loading animation visible before first token | AISU-03 | Requires browser DOM + React lifecycle | Click Generate; animation must appear immediately and before any text |
| "Scenario changed — regenerate?" badge appears after preset switch | AISU-02 | Requires Redux state flow + UI | Load baseline → see summary → switch to Fuel Cost Shock preset → confirm amber badge appears |
| Baseline pre-cache loads on fresh page load (no API call) | AISU-04 | Requires mount lifecycle | Open page in new incognito window; summary visible immediately; no enhance-summary request in Network tab |
| Button disabled during streaming | AISU-02 | Requires interaction testing | Click Generate; confirm button is greyed and unclickable until stream completes |
| Error message shown on API failure | AISU-01 | Requires failure simulation | Temporarily remove OPENAI_API_KEY from .env.local; click Generate; confirm error message in panel |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING file references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s (automated)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
