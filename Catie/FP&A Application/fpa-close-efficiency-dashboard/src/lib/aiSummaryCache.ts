// src/lib/aiSummaryCache.ts
// Pre-cached AI executive narrative for the Jan 2026 Baseline scenario.
// Displayed immediately on page load when controls match the baseline preset.
// Avoids an API call on first render — zero latency, zero cost for the primary demo scenario.
// Computed KPI basis: Net Sales $9.5M, Gross Margin 22.6% (post-fuel), EBITDA $959K,
//   Cash $4.3M, AR $2.8M, Fuel Index 118 vs 100 baseline.
export const BASELINE_SUMMARY: string = `Summit Logistics Group closed January 2026 with net revenue of $9.5M, reflecting 3% sequential growth against the December baseline. Post-fuel gross margin settled at 22.6% — below the 25% target margin — as the elevated fuel index (118 vs. 100 baseline) added approximately $230K in logistics cost of goods above plan. EBITDA reached $959K, with operating expenses holding at $1.18M. Cash on hand of $4.3M reflects collections performance in line with the 97% target rate.

Looking ahead to close, AR aging shows 10.9% of the $2.8M receivables balance in the 90-plus-day bucket, approaching the 11% watch threshold. With five business days remaining to the close target and 47 manual journal entries in progress (up from 38 in December), the accruals and JE stage carries the highest execution risk. Finance leaders should prioritize pending-approval JE clearance and monitor the 90-plus AR cohort for collectability adjustments before the financial statement package is finalized.`;
