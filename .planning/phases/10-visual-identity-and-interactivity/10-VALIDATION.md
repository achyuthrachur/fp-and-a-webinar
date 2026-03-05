---
phase: 10
slug: visual-identity-and-interactivity
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.0 |
| **Config file** | `vitest.config.ts` (inside `Catie/FP&A Application/fpa-close-efficiency-dashboard/`) |
| **Quick run command** | `node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose` |
| **Full suite command** | Same (all tests in `src/**/__tests__/**/*.test.ts`) |
| **TypeScript check** | `cd "Catie/FP&A Application/fpa-close-efficiency-dashboard" && npx tsc --noEmit` |
| **Estimated runtime** | ~15 seconds |

> **CRITICAL:** Use `node .../vitest.mjs run` NOT `npx vitest` — ampersand in `FP&A` breaks npx. Run from project root.

---

## Sampling Rate

- **After every task commit:** Run Vitest suite — confirm 86/86 still green (no regressions from routing/component changes)
- **After every plan wave:** Full suite + TypeScript check
- **Before `/gsd:verify-work`:** Full suite green + all browser QA items confirmed
- **Max feedback latency:** ~15 seconds (automated)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 0 | all | unit suite (no regression) | `node .../vitest.mjs run` | existing | ⬜ pending |
| 10-02-01 | 02 | 1 | VISU-01 | unit suite | same | existing | ⬜ pending |
| 10-03-01 | 03 | 2 | VISU-02 | unit suite | same | existing | ⬜ pending |
| 10-04-01 | 04 | 3 | VISU-03 | unit suite | same | existing | ⬜ pending |
| 10-05-01 | 05 | 3 | VISU-04 | unit suite | same | existing | ⬜ pending |
| 10-06-01 | 06 | 4 | all | browser QA | manual checkpoint | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No new test files needed — Phase 10 introduces no new pure functions requiring RED/GREEN TDD.

**Wave 0 installs only:**
- [ ] `framer-motion` — required for section animations (NOT currently installed; `motion` stub in node_modules is empty)
- [ ] `tailwind-merge` — required for `cn()` utility used by Radix/shadcn copy-paste components

*Existing 86-test Vitest suite provides full regression coverage throughout Phase 10.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Landing page displays at `/` with Indigo Dark bg + React Bits animation | VISU-01 | Requires browser rendering | Navigate to `/` — confirm full-screen dark background with animated particles/aurora, Crowe wordmark, headline, 3 feature bullets, amber CTA |
| "Enter Dashboard →" button navigates to `/dashboard` | VISU-01 | Requires browser navigation | Click CTA — confirm URL changes to `/dashboard` and dashboard loads correctly |
| KPI cards stagger in on page load (8 cards, ~60ms apart) | VISU-02 | Requires browser rendering + timing | Load `/dashboard` — watch KPI section; cards should appear sequentially left-to-right |
| Section blocks fade+slide-up as they enter viewport | VISU-02 | Requires scroll interaction | Scroll down through dashboard — each section should animate in on first scroll into view |
| Animations fire once only (not re-triggered on re-scroll) | VISU-02 | Requires scroll interaction | Scroll past a section, scroll back up, scroll down again — animation should NOT re-fire |
| shadcn Button components render correctly in light and dark mode | VISU-03 | Requires visual check | Confirm Generate/Reset/Enter buttons look on-brand in both themes |
| shadcn Select preset dropdown works in dark mode | VISU-03 | Requires interaction | Open preset dropdown in dark mode — confirm readable options, no invisible text |
| "Explain" button in DashboardHeader toggles explanation panels | VISU-04 | Requires UI interaction | Click Explain — confirm all 6 sections reveal explanation text; click again — confirm panels hide |
| Explain mode persists across page refresh | VISU-04 | Requires localStorage check | Turn Explain ON, refresh page — confirm panels still visible |
| `prefers-reduced-motion` disables animations | VISU-02 | Requires OS setting | Set OS to reduce motion; load dashboard — confirm no entrance animations |
| All 4 requirements pass at 1920×1080 with both themes | all | Requires viewport sizing | Full visual QA at 1920×1080, light and dark |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (Vitest regression suite)
- [ ] Sampling continuity confirmed
- [ ] Wave 0 covers framer-motion + tailwind-merge installs
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s (automated)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
