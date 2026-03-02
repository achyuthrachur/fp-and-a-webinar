"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";

export function RiskDial({ score }: { score: number }) {
  const color = score >= 70 ? "#E5376B" : score >= 45 ? "#F5A800" : "#05AB8C";
  return (
    <div className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
      <h3 className="section-title">
        <TooltipWrapper id="risk-dial"><span>DEFCON Risk Dial</span></TooltipWrapper>
      </h3>
      <p className="section-subtitle">Aggregate severity from weighted risk indicator signals</p>
      <div className="mt-3 h-3 w-full rounded-full bg-[rgb(var(--wash))]">
        <div className="h-3 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <p className="mt-2 text-xl font-semibold text-[rgb(var(--indigo-dark))]">{score}/100</p>
    </div>
  );
}
