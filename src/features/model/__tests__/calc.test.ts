import { describe, expect, it } from "vitest";
import { computeDerivedMetrics } from "@/features/model/calc";
import type { BaseInputs, ControlState } from "@/features/model/types";

const base: BaseInputs = {
  baseNetSales: 14920000,
  baseOpex: 2510000,
  baseCash: 5350000,
  baseCashInWeekly: 3730000,
  arTotal: 8510000,
  manualJeCount: 95,
  closeAdjustmentsCount: 15,
  pipelineExecutionRatio: 0.93,
  variancePct: 0.04,
};

const controls: ControlState = {
  revenueGrowthPct: 0.03,
  grossMarginPct: 0.23,
  fuelIndex: 100,
  collectionsRatePct: 0.98,
  returnsPct: 0.012,
  prioritizeCashMode: true,
  conservativeForecastBias: false,
  tightenCreditHolds: false,
  lateInvoicesHours: 6,
  journalLoadMultiplier: 1,
  inventoryComplexity: false,
};

describe("computeDerivedMetrics", () => {
  it("computes deterministic metrics", () => {
    const first = computeDerivedMetrics(base, controls);
    const second = computeDerivedMetrics(base, controls);
    expect(first).toEqual(second);
    expect(first.projNetSales).toBeCloseTo(15367600, 0);
    expect(first.forecastConfidence).toBe(82);
  });

  it("applies close eta clamp at upper bound", () => {
    const result = computeDerivedMetrics(base, {
      ...controls,
      returnsPct: 0.025,
      lateInvoicesHours: 14,
      journalLoadMultiplier: 1.3,
    });
    expect(result.closeEtaBusinessDays).toBeLessThanOrEqual(9);
  });

  it("lowers confidence when risk controls are active", () => {
    const result = computeDerivedMetrics(base, {
      ...controls,
      conservativeForecastBias: true,
      inventoryComplexity: true,
    });
    expect(result.forecastConfidence).toBe(68);
  });
});
