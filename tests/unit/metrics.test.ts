import { describe, expect, it } from "vitest";
import { computeGrossMarginPct } from "@/lib/formulas/metrics";
import { computeRiskValues } from "@/lib/formulas/risk";

describe("metrics formulas", () => {
  it("computes gross margin percent", () => {
    expect(
      computeGrossMarginPct({
        period: "2025-12",
        revenueActual: 100,
        revenueForecast: 100,
        cogsActual: 70,
        closeCycleDays: 9,
        onTimeTaskPct: 80,
        lateJournalPct: 10,
        dso: 48,
        controlExceptionAgingDays: 13,
        forecastBiasPct: 4,
        inventoryShrinkPct: 1,
        pipelineGapPct: 8,
        netCash: 10,
      }),
    ).toBe(30);
  });

  it("computes risk states at boundaries", () => {
    const points = [
      { period: "2025-10", revenueActual: 1, revenueForecast: 1, cogsActual: 1, closeCycleDays: 9.1, onTimeTaskPct: 80, lateJournalPct: 12.1, dso: 52.3, controlExceptionAgingDays: 18.2, forecastBiasPct: 5.1, inventoryShrinkPct: 1.3, pipelineGapPct: 10.1, netCash: 10 },
      { period: "2025-11", revenueActual: 1, revenueForecast: 1, cogsActual: 1, closeCycleDays: 9.2, onTimeTaskPct: 80, lateJournalPct: 12.2, dso: 52.4, controlExceptionAgingDays: 18.3, forecastBiasPct: 5.2, inventoryShrinkPct: 1.4, pipelineGapPct: 10.2, netCash: 10 },
      { period: "2025-12", revenueActual: 1, revenueForecast: 1, cogsActual: 1, closeCycleDays: 9.3, onTimeTaskPct: 80, lateJournalPct: 12.3, dso: 52.5, controlExceptionAgingDays: 18.4, forecastBiasPct: 5.3, inventoryShrinkPct: 1.5, pipelineGapPct: 10.3, netCash: 10 },
    ];
    const risks = computeRiskValues(points);
    expect(risks.find((r) => r.key === "close")?.status).toBe("red");
    expect(risks.find((r) => r.key === "ar")?.status).toBe("red");
  });
});
