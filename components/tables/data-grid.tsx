"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";

export function DataGrid({ data }: { data: unknown[] }) {
  const sample = data.slice(0, 6) as Record<string, unknown>[];
  const cols = sample[0] ? Object.keys(sample[0]) : [];
  return (
    <div className="rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <h3 className="mb-2 section-title">
        <TooltipWrapper id="data-grid"><span>Data Grid Preview ({data.length} rows)</span></TooltipWrapper>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              {cols.map((col) => (
                <th key={col} className="p-1 text-left text-[rgb(var(--muted))]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sample.map((row, idx) => (
              <tr key={idx} className="border-t border-[rgb(var(--border))]">
                {cols.map((c) => (
                  <td key={c} className="p-1">{String(row[c])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
