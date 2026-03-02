"use client";

import { MetricCardGrid } from "@/components/cards/metric-card-grid";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function ScenarioLeversFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const latest = data.periods[data.periods.length - 1];

  const kpis = [
    { key: "cash-outlook", label: "Cash Outlook", value: (latest?.netCash ?? 0) * 1_000_000, delta: 0.4, format: "currency" as const, formula: "13-week projected ending cash" },
    { key: "risk-outlook", label: "Close Risk Outlook", value: latest?.closeCycleDays ?? 0, delta: 0.2, format: "days" as const, formula: "close cycle recast with staffing/volume assumptions" },
    { key: "margin-outlook", label: "Margin Outlook %", value: ((latest?.revenueActual ?? 1) - (latest?.cogsActual ?? 0)) / (latest?.revenueActual ?? 1) * 100, delta: -0.3, format: "percent" as const, formula: "(recast revenue - recast COGS) / recast revenue" },
  ];

  return (
    <section className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
        <h3 className="text-sm text-[rgb(var(--text-soft))]">Scenario Levers are controlled from the left panel and apply instantly.</h3>
      </div>
      <MetricCardGrid kpis={kpis} />
    </section>
  );
}
