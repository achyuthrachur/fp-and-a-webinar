import type { MonthlyPoint, RiskIndicatorSpec, RiskIndicatorValue } from "@/lib/types";

export const indicatorSpecs: RiskIndicatorSpec[] = [
  { key: "close", name: "Close Cycle Overrun Risk", thresholds: { green: 7.5, yellow: 9, red: 9, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "pulse-red" },
  { key: "journals", name: "Late Journal Entry Risk", thresholds: { green: 8, yellow: 12, red: 12, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
  { key: "ar", name: "AR Collection Slippage", thresholds: { green: 45, yellow: 52, red: 52, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
  { key: "cash", name: "Cash Runway Compression", thresholds: { green: 10, yellow: 7, red: 7, direction: "lower-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
  { key: "controls", name: "Control Exception Aging", thresholds: { green: 12, yellow: 18, red: 18, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
  { key: "bias", name: "Forecast Bias Escalation", thresholds: { green: 3, yellow: 5, red: 5, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
  { key: "shrink", name: "Inventory Shrink Pressure", thresholds: { green: 0.8, yellow: 1.2, red: 1.2, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
  { key: "pipeline", name: "Pipeline Conversion Gap", thresholds: { green: 6, yellow: 10, red: 10, direction: "higher-is-worse" }, breachFormula: "days_to_breach = (threshold - current_value) / daily_change_rate", severityMotion: "none" },
];

function statusFor(value: number, green: number, yellow: number, direction: "higher-is-worse" | "lower-is-worse"): "green" | "yellow" | "red" {
  if (direction === "higher-is-worse") {
    if (value <= green) return "green";
    if (value <= yellow) return "yellow";
    return "red";
  }
  if (value >= green) return "green";
  if (value >= yellow) return "yellow";
  return "red";
}

function slope(values: number[]): number {
  if (values.length < 2) return 0;
  return (values[values.length - 1] - values[0]) / (values.length - 1);
}

function daysToBreach(current: number, threshold: number, trendPerPeriod: number): number {
  const daily = trendPerPeriod / 30;
  if (daily === 0) return 999;
  return Math.max(0, Math.round((threshold - current) / daily));
}

export function computeRiskValues(periods: MonthlyPoint[]): RiskIndicatorValue[] {
  const tail = periods.slice(-3);
  const latest = periods[periods.length - 1];

  const values: Record<string, { value: number; history: number[]; threshold: number }> = {
    close: { value: latest.closeCycleDays, history: tail.map((p) => p.closeCycleDays), threshold: 9 },
    journals: { value: latest.lateJournalPct, history: tail.map((p) => p.lateJournalPct), threshold: 12 },
    ar: { value: latest.dso, history: tail.map((p) => p.dso), threshold: 52 },
    cash: { value: 6.8, history: [7.8, 7.1, 6.8], threshold: 7 },
    controls: { value: latest.controlExceptionAgingDays, history: tail.map((p) => p.controlExceptionAgingDays), threshold: 18 },
    bias: { value: latest.forecastBiasPct, history: tail.map((p) => p.forecastBiasPct), threshold: 5 },
    shrink: { value: latest.inventoryShrinkPct, history: tail.map((p) => p.inventoryShrinkPct), threshold: 1.2 },
    pipeline: { value: latest.pipelineGapPct, history: tail.map((p) => p.pipelineGapPct), threshold: 10 },
  };

  return indicatorSpecs.map((spec) => {
    const item = values[spec.key];
    return {
      key: spec.key,
      name: spec.name,
      value: item.value,
      daysToBreach: daysToBreach(item.value, item.threshold, slope(item.history)),
      status: statusFor(item.value, spec.thresholds.green, spec.thresholds.yellow, spec.thresholds.direction),
    };
  });
}

export function computeRiskCompositeScore(risks: RiskIndicatorValue[]): number {
  const weights: Record<string, number> = { close: 20, cash: 20, ar: 15, journals: 10, controls: 15, bias: 10, pipeline: 10, shrink: 0 };
  const score = risks.reduce((sum, risk) => {
    const severity = risk.status === "red" ? 1 : risk.status === "yellow" ? 0.6 : 0.2;
    return sum + severity * (weights[risk.key] ?? 0);
  }, 0);
  return Math.round(Math.min(100, score));
}
