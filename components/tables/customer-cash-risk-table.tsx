"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";

export function CustomerCashRiskTable({ data }: { data: { customer: string; concentrationPct: number; risk: string; exposure: number }[] }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <h3 className="mb-2 section-title">
        <TooltipWrapper id="customer-cash-risk-table"><span>Customer Concentration Cash Risk</span></TooltipWrapper>
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[rgb(var(--muted))]">
            <th>Customer</th>
            <th>Conc. %</th>
            <th>Risk</th>
            <th>Exposure ($M)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.customer} className="border-t border-[rgb(var(--border))]">
              <td>{r.customer}</td>
              <td>{r.concentrationPct.toFixed(1)}%</td>
              <td>{r.risk}</td>
              <td>{r.exposure.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
