"use client";

import type { SummaryDocument } from "@/lib/types";

export function SummaryPreview({ summary }: { summary: SummaryDocument | null }) {
  if (!summary) return <p className="text-sm text-[rgb(var(--text-soft))]">No summary generated yet.</p>;
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[rgb(var(--indigo-dark))]">{summary.title}</h3>
      {summary.sections.map((section) => (
        <section key={section.heading}>
          <h4 className="text-sm font-semibold text-[rgb(var(--text-strong))]">{section.heading}</h4>
          <p className="text-sm text-[rgb(var(--text-soft))]">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
