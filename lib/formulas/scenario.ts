import type { ScenarioLevers, SeedProfile } from "@/lib/types";

export const defaultLevers: ScenarioLevers = {
  revenueConversionAdjustmentPct: 0,
  collectionSpeedDays: 0,
  freightInflationPct: 0,
  overtimeReductionPct: 0,
  inventoryShrinkChangePct: 0,
  hiringFreeze: false,
};

export function applyScenarioLevers(data: SeedProfile, levers: ScenarioLevers): SeedProfile {
  const factorRevenue = 1 + levers.revenueConversionAdjustmentPct / 100;
  const factorFreight = 1 + levers.freightInflationPct / 100;

  return {
    ...data,
    periods: data.periods.map((p) => {
      const revenueActual = p.revenueActual * factorRevenue;
      const cogsActual = p.cogsActual * factorFreight;
      const overtimeImpact = (levers.overtimeReductionPct / 100) * 0.15;
      const cashEffect = levers.collectionSpeedDays * 0.08;
      return {
        ...p,
        revenueActual,
        cogsActual,
        inventoryShrinkPct: Math.max(0, p.inventoryShrinkPct + levers.inventoryShrinkChangePct / 100),
        dso: Math.max(30, p.dso - levers.collectionSpeedDays),
        closeCycleDays: levers.hiringFreeze ? p.closeCycleDays + 0.3 : p.closeCycleDays,
        netCash: p.netCash + cashEffect + overtimeImpact,
      };
    }),
    cash13Week: data.cash13Week.map((w) => ({ ...w, endingCash: w.endingCash + levers.collectionSpeedDays * 0.12 })),
  };
}
