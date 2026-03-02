"use client";

import { RiskCard } from "@/components/cards/risk-card";
import { RiskDial } from "@/components/charts/risk-dial";
import { Sparkline } from "@/components/charts/sparkline";
import { computeRiskValues } from "@/lib/formulas/risk";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function RiskIndicatorsFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const riskScore = useDashboardStore((s) => s.riskScore);
  const risks = computeRiskValues(data.periods);

  return (
    <section className="space-y-4">
      <RiskDial score={riskScore} />
      <div className="grid gap-3 overflow-visible md:grid-cols-2 xl:grid-cols-4">
        {risks.map((risk) => (
          <div key={risk.key} className="relative z-10 flex items-center justify-between gap-2 overflow-visible hover:z-30">
            <RiskCard risk={risk} />
            <Sparkline values={data.periods.slice(-6).map((p) => p.forecastBiasPct + Math.random() * 0.2)} />
          </div>
        ))}
      </div>
    </section>
  );
}
