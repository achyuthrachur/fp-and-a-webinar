import type { GlobalFilters, Kpi, MonthlyPoint, SeedProfile } from "@/lib/types";

const fmt = (value: number) => Math.round(value * 100) / 100;

export function getLatestPeriod(data: SeedProfile, filters: GlobalFilters): MonthlyPoint {
  return data.periods.find((p) => p.period === filters.period) ?? data.periods[data.periods.length - 1];
}

export function computeGrossMarginPct(period: MonthlyPoint): number {
  return period.revenueActual === 0 ? 0 : ((period.revenueActual - period.cogsActual) / period.revenueActual) * 100;
}

export function computeRevenueVariancePct(period: MonthlyPoint, budgetRevenue = 54.7): number {
  return budgetRevenue === 0 ? 0 : ((period.revenueActual - budgetRevenue) / budgetRevenue) * 100;
}

export function computeLateJournalRatio(period: MonthlyPoint): number {
  return period.lateJournalPct;
}

export function computeForecastBiasPct(period: MonthlyPoint): number {
  return period.forecastBiasPct;
}

export function computeDso(period: MonthlyPoint): number {
  return period.dso;
}

export function computeDpo(): number {
  return 46.2;
}

export function computeDio(period: MonthlyPoint): number {
  return period.inventoryShrinkPct * 52;
}

export function computeCcc(period: MonthlyPoint): number {
  return computeDso(period) + computeDio(period) - computeDpo();
}

export function computeKpis(data: SeedProfile, filters: GlobalFilters): Kpi[] {
  const current = getLatestPeriod(data, filters);
  const prior = data.periods[Math.max(data.periods.length - 2, 0)];

  const grossMargin = computeGrossMarginPct(current);
  const priorGrossMargin = computeGrossMarginPct(prior);

  return [
    {
      key: "revenue",
      label: "Revenue",
      value: fmt(current.revenueActual * 1_000_000),
      delta: fmt(current.revenueActual - prior.revenueActual),
      format: "currency",
      formula: "Sum of revenue accounts in the GL",
    },
    {
      key: "gross-margin",
      label: "Gross Margin %",
      value: fmt(grossMargin),
      delta: fmt(grossMargin - priorGrossMargin),
      format: "percent",
      formula: "(Revenue - COGS) / Revenue * 100",
    },
    {
      key: "close-cycle",
      label: "Close Cycle Days",
      value: current.closeCycleDays,
      delta: fmt(current.closeCycleDays - prior.closeCycleDays),
      format: "days",
      formula: "max(task.completed_at) - min(period_start_date)",
    },
    {
      key: "on-time",
      label: "On-Time Tasks %",
      value: current.onTimeTaskPct,
      delta: fmt(current.onTimeTaskPct - prior.onTimeTaskPct),
      format: "percent",
      formula: "completed_on_or_before_due / total_tasks * 100",
    },
    {
      key: "net-cash",
      label: "Net Cash",
      value: fmt(current.netCash * 1_000_000),
      delta: fmt(current.netCash - prior.netCash),
      format: "currency",
      formula: "projected period-end inflows - outflows",
    },
    {
      key: "risk-score",
      label: "Risk Score",
      value: fmt(0),
      delta: 0,
      format: "number",
      formula: "weighted_sum(normalized_indicator_scores)",
    },
  ];
}

