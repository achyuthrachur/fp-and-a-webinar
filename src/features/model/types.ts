import { z } from "zod";

export const controlStateSchema = z.object({
  revenueGrowthPct: z.number().min(-0.04).max(0.08),
  grossMarginPct: z.number().min(0.18).max(0.28),
  fuelIndex: z.number().min(80).max(140),
  collectionsRatePct: z.number().min(0.94).max(1),
  returnsPct: z.number().min(0.006).max(0.025),
  prioritizeCashMode: z.boolean(),
  conservativeForecastBias: z.boolean(),
  tightenCreditHolds: z.boolean(),
  lateInvoicesHours: z.number().min(0).max(14),
  journalLoadMultiplier: z.number().min(0.8).max(1.3),
  inventoryComplexity: z.boolean(),
});

export type ControlState = z.infer<typeof controlStateSchema>;

export type DerivedMetrics = {
  projNetSales: number;
  projGrossProfit: number;
  projOpex: number;
  returnsDollars: number;
  cashCoverageWeeks: number;
  arDso: number;
  forecastConfidence: number;
  closeEtaBusinessDays: number;
  journalLoad: number;
  pipelineExecutionRatio: number;
  variancePct: number;
};

export type BaseInputs = {
  baseNetSales: number;
  baseOpex: number;
  baseCash: number;
  baseCashInWeekly: number;
  arTotal: number;
  manualJeCount: number;
  closeAdjustmentsCount: number;
  pipelineExecutionRatio: number;
  variancePct: number;
};

export type ScenarioPreset = {
  id: string;
  label: string;
  controls: ControlState;
};

export type RiskSeverity = "info" | "yellow" | "red";

export type RiskFlag = {
  id: string;
  severity: RiskSeverity;
  title: string;
  whatChanged: string;
  whyItMatters: string;
  suggestedAction: string;
};

export type ExecutiveSummary = {
  bullets: string[];
  changedVsBaseline: string[];
  risksAndMitigations: string[];
  assumptionsUsed: string[];
  generatedAt: string;
  enhancedByLlm: boolean;
};

export const glRowSchema = z.object({
  period: z.string(),
  net_sales: z.coerce.number(),
  cogs: z.coerce.number(),
  gross_profit: z.coerce.number(),
  opex: z.coerce.number(),
  ebitda: z.coerce.number(),
  cash: z.coerce.number(),
  ar: z.coerce.number(),
  ap: z.coerce.number(),
  inventory: z.coerce.number(),
  manual_je_count: z.coerce.number(),
  close_adjustments_count: z.coerce.number(),
});

export const arRowSchema = z.object({
  as_of_date: z.string(),
  segment: z.string(),
  ar_total: z.coerce.number(),
  ar_current: z.coerce.number(),
  ar_1_30: z.coerce.number(),
  ar_31_60: z.coerce.number(),
  ar_61_90: z.coerce.number(),
  ar_90_plus: z.coerce.number(),
  collections_rate: z.coerce.number(),
});

export const pipelineRowSchema = z.object({
  opp_id: z.string(),
  stage: z.string(),
  expected_close_date: z.string(),
  probability: z.coerce.number(),
  amount_usd: z.coerce.number(),
  segment: z.string(),
});

export type GLRow = z.infer<typeof glRowSchema>;
export type ARRow = z.infer<typeof arRowSchema>;
export type PipelineRow = z.infer<typeof pipelineRowSchema>;
