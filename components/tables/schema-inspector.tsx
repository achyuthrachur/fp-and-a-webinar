"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";

export function SchemaInspector({ columns }: { columns: string[] }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <h3 className="mb-2 section-title">
        <TooltipWrapper id="schema-inspector"><span>Schema Inspector</span></TooltipWrapper>
      </h3>
      <ul className="space-y-1 text-xs">
        {columns.map((col) => (
          <li key={col} className="rounded bg-[rgb(var(--wash))] px-2 py-1">{col}</li>
        ))}
      </ul>
    </div>
  );
}
