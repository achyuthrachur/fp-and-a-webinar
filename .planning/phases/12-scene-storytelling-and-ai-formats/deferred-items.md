# Deferred Items — Phase 12

## Pre-existing Issue: erp_gl_summary.csv modified in working tree

**Discovered:** During 12-01 Task 2 full suite run
**Status:** Pre-existing — CSV was already modified before Phase 12 started (shown in initial git status)
**Symptom:** `dataLoader.test.ts > baseNetSales is 9200000` FAILS — gets `14920000` instead
**Root cause:** `src/data/erp_gl_summary.csv` has been modified by another developer (Catie's workstream) and contains different net_sales values than the Jan-2026 baseline row that the test expects
**Scope boundary:** Out of scope for Phase 12 — pre-existing state of the working tree before any Phase 12 changes
**Action needed:** Before Phase 12 deployment, restore erp_gl_summary.csv to the committed baseline, OR update the test to match the new values if the CSV changes are intentional
