"use client";

import { MetricCardGrid } from "@/components/cards/metric-card-grid";
import { AgingBars } from "@/components/charts/aging-bars";
import { CashCurve } from "@/components/charts/cash-curve";
import { CustomerCashRiskTable } from "@/components/tables/customer-cash-risk-table";
import { computeCcc, computeDpo, computeDso } from "@/lib/formulas/metrics";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function CashWorkingCapitalFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const latest = data.periods[data.periods.length - 1];

  const dso = latest ? computeDso(latest) : 0;
  const dpo = latest ? computeDpo() : 0;
  const ccc = latest ? computeCcc(latest) : 0;

  const kpis = [
    { key: "dso", label: "DSO", value: dso, delta: 0.5, format: "days" as const, formula: "(ending_AR / trailing_3mo_credit_sales) * 90" },
    { key: "dpo", label: "DPO", value: dpo, delta: -0.2, format: "days" as const, formula: "(ending_AP / trailing_3mo_COGS) * 90" },
    { key: "ccc", label: "CCC", value: ccc, delta: 0.9, format: "days" as const, formula: "DSO + DIO - DPO" },
  ];

  return (
    <section className="space-y-4">
      <CashCurve data={data.cash13Week.map((w) => ({ week: w.week, endingCash: w.endingCash }))} />
      <AgingBars ar={data.arAging} ap={data.apAging} />
      <MetricCardGrid kpis={kpis} />
      <CustomerCashRiskTable data={data.customerCashRisk} />
    </section>
  );
}

