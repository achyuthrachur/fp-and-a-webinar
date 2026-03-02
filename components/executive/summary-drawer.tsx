"use client";

import { useState } from "react";
import { useDashboardStore } from "@/lib/state/dashboardStore";
import type { SummaryDocument, SummaryTemplate } from "@/lib/types";
import { SummaryPreview } from "@/components/executive/summary-preview";
import { ExportActions } from "@/components/executive/export-actions";

export function SummaryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [template, setTemplate] = useState<SummaryTemplate>("CFO Brief");
  const [summary, setSummary] = useState<SummaryDocument | null>(null);
  const filters = useDashboardStore((s) => s.filters);
  const generate = useDashboardStore((s) => s.generateExecutiveSummary);

  if (!open) return null;

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-lg overflow-y-auto border-l border-[rgb(var(--border))] bg-white p-4 shadow-[var(--shadow-3)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[rgb(var(--indigo-dark))]">Executive Summary</h2>
        <button onClick={onClose} className="text-sm text-[rgb(var(--text-soft))]">Close</button>
      </div>

      <label className="mb-3 block text-xs text-[rgb(var(--muted))]">
        Template
        <select className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] p-2 text-sm" value={template} onChange={(e) => setTemplate(e.target.value as SummaryTemplate)}>
          <option>CFO Brief</option>
          <option>Close Risk Brief</option>
          <option>Tax and Control Brief</option>
        </select>
      </label>

      <button
        onClick={() => setSummary(generate({ template, period: filters.period, scenario: filters.scenario }))}
        className="mb-4 rounded-lg bg-[rgb(var(--amber-core))] px-3 py-2 text-sm font-semibold text-[rgb(var(--indigo-dark))]"
      >
        Generate
      </button>

      <SummaryPreview summary={summary} />
      <ExportActions summary={summary} />
    </aside>
  );
}
