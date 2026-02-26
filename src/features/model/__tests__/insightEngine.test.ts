import { describe, expect, it } from "vitest";
import { evaluateRiskFlags } from "@/features/model/insightEngine";
import type { DerivedMetrics } from "@/features/model/types";

const baseline: DerivedMetrics = {
  projNetSales: 15000000,
  projGrossProfit: 3450000,
  projOpex: 2500000,
  returnsDollars: 180000,
  cashCoverageWeeks: 6,
  arDso: 18,
  forecastConfidence: 82,
  closeEtaBusinessDays: 6,
  journalLoad: 90,
  pipelineExecutionRatio: 0.93,
  variancePct: 0.03,
};

describe("evaluateRiskFlags", () => {
  it("returns no red flags for stable scenario", () => {
    const flags = evaluateRiskFlags(baseline, baseline, 0.04);
    expect(flags.filter((f) => f.severity === "red")).toHaveLength(0);
  });

  it("fires threshold flags at boundaries", () => {
    const scenario: DerivedMetrics = {
      ...baseline,
      cashCoverageWeeks: 3.9,
      forecastConfidence: 54,
      closeEtaBusinessDays: 7.4,
      projGrossProfit: 3000000,
    };
    const flags = evaluateRiskFlags(scenario, baseline, 0.07);
    expect(flags.some((f) => f.id === "cash-coverage")).toBe(true);
    expect(flags.some((f) => f.id === "ar-aging")).toBe(true);
    expect(flags.some((f) => f.id === "forecast-confidence")).toBe(true);
  });
});
