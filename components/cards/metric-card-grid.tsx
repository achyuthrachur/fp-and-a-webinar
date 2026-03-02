"use client";

import type { Kpi } from "@/lib/types";
import { KpiCard } from "@/components/cards/kpi-card";

export function MetricCardGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi, i) => (
        <KpiCard key={kpi.key} kpi={kpi} index={i} />
      ))}
    </section>
  );
}
