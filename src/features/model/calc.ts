import type { BaseInputs, ControlState, DerivedMetrics } from "./types";

export function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeDerivedMetrics(base: BaseInputs, controls: ControlState): DerivedMetrics {
  const projNetSales = base.baseNetSales * (1 + controls.revenueGrowthPct);
  const projGrossProfit = projNetSales * controls.grossMarginPct;
  const fuelPressure = Math.max(0, (controls.fuelIndex - 100) / 100);
  const projOpex = base.baseOpex * (1 + 0.18 * fuelPressure);
  const returnsDollars = projNetSales * controls.returnsPct;
  const cashIn = base.baseCashInWeekly * controls.collectionsRatePct;
  const cashCoverageWeeks = clamp(1, 20, (base.baseCash + cashIn * 4 - returnsDollars) / Math.max(1, projOpex / 4));
  const arDso = base.arTotal / Math.max(1, projNetSales / 30);

  let forecastConfidence = 82;
  if (base.pipelineExecutionRatio < 0.92) forecastConfidence -= 15;
  if (Math.abs(base.variancePct) > 0.05) forecastConfidence -= 10;
  if (controls.inventoryComplexity) forecastConfidence -= 8;
  if (controls.conservativeForecastBias) forecastConfidence -= 6;
  forecastConfidence = clamp(20, 98, forecastConfidence);

  const journalLoad = Math.round(base.manualJeCount * controls.journalLoadMultiplier);
  const etaRaw =
    4 +
    0.08 * base.manualJeCount * controls.journalLoadMultiplier +
    0.15 * base.closeAdjustmentsCount +
    0.25 * controls.lateInvoicesHours +
    0.1 * (returnsDollars / 100000);
  const closeEtaBusinessDays = Number(clamp(4, 9, etaRaw).toFixed(1));

  return {
    projNetSales,
    projGrossProfit,
    projOpex,
    returnsDollars,
    cashCoverageWeeks: Number(cashCoverageWeeks.toFixed(1)),
    arDso: Number(arDso.toFixed(1)),
    forecastConfidence,
    closeEtaBusinessDays,
    journalLoad,
    pipelineExecutionRatio: base.pipelineExecutionRatio,
    variancePct: base.variancePct,
  };
}
