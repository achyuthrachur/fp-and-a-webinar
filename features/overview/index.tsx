"use client";

import { MetricCardGrid } from "@/components/cards/metric-card-grid";
import { DonutClose } from "@/components/charts/donut-close";
import { FanChart } from "@/components/charts/fan-chart";
import { TrendLine } from "@/components/charts/trend-line";
import { computeKpis } from "@/lib/formulas/metrics";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function OverviewFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const filters = useDashboardStore((s) => s.filters);

  const kpis = computeKpis(data, filters);
  const trend = data.periods.map((p) => ({ period: p.period.slice(5), actual: p.revenueActual, forecast: p.revenueForecast }));
  const fan = data.periods.map((p) => ({ period: p.period.slice(5), forecast: p.revenueForecast, low: p.revenueForecast * 0.94, high: p.revenueForecast * 1.06 }));

  return (
    <section className="space-y-4">
      <MetricCardGrid kpis={kpis} />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FanChart data={fan} />
        </div>
        <DonutClose completion={data.periods[data.periods.length - 1]?.onTimeTaskPct ?? 80} />
      </div>
      <TrendLine data={trend} />
    </section>
  );
}
