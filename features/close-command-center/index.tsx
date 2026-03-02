"use client";

import { MetricCardGrid } from "@/components/cards/metric-card-grid";
import { GanttClose } from "@/components/charts/gantt-close";
import { HeatmapDelay } from "@/components/charts/heatmap-delay";
import { BlockersTable } from "@/components/tables/blockers-table";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function CloseCommandCenterFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const latest = data.periods[data.periods.length - 1];

  const kpis = [
    { key: "open", label: "Open Tasks", value: 42, delta: 3, format: "number" as const, formula: "count(status=open)" },
    { key: "overdue", label: "Overdue Tasks", value: 11, delta: 2, format: "number" as const, formula: "count(status=overdue)" },
    { key: "late-je", label: "Late Journals %", value: latest?.lateJournalPct ?? 0, delta: 0.6, format: "percent" as const, formula: "late journals / total journals * 100" },
    { key: "recon", label: "Reconciliation Completion %", value: latest?.onTimeTaskPct ?? 0, delta: -0.8, format: "percent" as const, formula: "completed reconciliations / total reconciliations" },
    { key: "controls", label: "Control Exceptions", value: 14, delta: 1, format: "number" as const, formula: "open control exceptions" },
  ];

  return (
    <section className="space-y-4">
      <MetricCardGrid kpis={kpis} />
      <div className="grid gap-4 xl:grid-cols-2">
        <GanttClose data={data.closeTasks.map((t) => ({ owner: t.owner, delayedDays: t.delayedDays }))} />
        <HeatmapDelay data={data.closeTasks.map((t) => ({ workstream: t.workstream, delayedDays: t.delayedDays }))} />
      </div>
      <BlockersTable data={data.closeTasks.map((t) => ({ owner: t.owner, blocker: t.blocker, agingDays: t.agingDays }))} />
    </section>
  );
}
