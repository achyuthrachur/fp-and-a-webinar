"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";

export function BlockersTable({ data }: { data: { owner: string; blocker: string; agingDays: number }[] }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <h3 className="mb-2 section-title">
        <TooltipWrapper id="blockers-table"><span>Top Blockers</span></TooltipWrapper>
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[rgb(var(--muted))]">
            <th>Owner</th>
            <th>Blocker</th>
            <th>Aging</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={`${r.owner}-${i}`} className="border-t border-[rgb(var(--border))]">
              <td>{r.owner}</td>
              <td>{r.blocker}</td>
              <td>{r.agingDays}d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
