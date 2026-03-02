"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";

export function JournalImpact() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
      <h3 className="section-title">
        <TooltipWrapper id="journal-impact"><span>Journal Adjustment Impact</span></TooltipWrapper>
      </h3>
      <p className="section-subtitle">Late and manual adjustments affecting reported margin stability</p>
      <p className="mt-3 text-xl font-semibold text-[rgb(var(--indigo-dark))]">$2.1M late adjustment impact</p>
      <p className="mt-1 text-xs text-[rgb(var(--muted))]">Manual late postings increased volatility in final reported margin.</p>
    </div>
  );
}
