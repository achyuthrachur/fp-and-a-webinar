"use client";

import { JournalImpact } from "@/components/charts/journal-impact";
import { VarianceDecomp } from "@/components/charts/variance-decomp";
import { Waterfall } from "@/components/charts/waterfall";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function VarianceDriversFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const waterfallData = [
    { name: "Budget", value: 54.7 },
    { name: "Forecast", value: 56.0 },
    { name: "Actual", value: data.periods[data.periods.length - 1]?.revenueActual ?? 0 },
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <Waterfall data={waterfallData} />
      <VarianceDecomp data={data.varianceDrivers} />
      <div className="xl:col-span-2">
        <JournalImpact />
      </div>
    </section>
  );
}
