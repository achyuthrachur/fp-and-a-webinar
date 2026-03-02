"use client";

import { downloadMarkdown, exportSummaryMarkdown } from "@/lib/export/summaryMarkdown";
import { exportSummaryPdf } from "@/lib/export/summaryPdf";
import type { SummaryDocument } from "@/lib/types";

export function ExportActions({ summary }: { summary: SummaryDocument | null }) {
  if (!summary) return null;
  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => navigator.clipboard.writeText(exportSummaryMarkdown(summary))}
        className="rounded-lg border border-[rgb(var(--border))] px-2 py-1 text-xs"
      >
        Copy
      </button>
      <button onClick={() => downloadMarkdown(exportSummaryMarkdown(summary))} className="rounded-lg border border-[rgb(var(--border))] px-2 py-1 text-xs">
        Download .md
      </button>
      <button onClick={() => exportSummaryPdf(summary)} className="rounded-lg bg-[rgb(var(--amber-core))] px-2 py-1 text-xs font-semibold text-[rgb(var(--indigo-dark))]">
        Download .pdf
      </button>
    </div>
  );
}
