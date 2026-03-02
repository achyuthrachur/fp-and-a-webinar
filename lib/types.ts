export type DashboardTab =
  | "overview"
  | "close-command-center"
  | "risk-indicators"
  | "scenario-levers"
  | "cash-working-capital"
  | "variance-drivers"
  | "data-explorer"
  | "readme-definitions";

export type SummaryTemplate = "CFO Brief" | "Close Risk Brief" | "Tax and Control Brief";

export interface GlobalFilters {
  entity: string;
  period: string;
  scenario: "Base" | "Stress" | "Upside";
  region: string;
  product_family: string;
  risk_threshold_profile: "Standard" | "Conservative" | "Aggressive";
}

export interface UploadContract {
  acceptedFileTypes: (".csv" | ".json")[];
  requiredFamilies: UploadFamily[];
}

export type UploadFamily =
  | "gl_trial_balance"
  | "ap_aging"
  | "ar_aging"
  | "sales_pipeline"
  | "inventory_snapshot"
  | "close_calendar"
  | "journal_entries"
  | "workforce_cost";

export interface UploadedFile {
  family: UploadFamily;
  fileName: string;
  content: string;
}

export interface UploadValidationIssue {
  family: UploadFamily;
  message: string;
}

export interface UploadResult {
  success: boolean;
  issues: UploadValidationIssue[];
  usedFallback: boolean;
}

export interface Kpi {
  key: string;
  label: string;
  value: number;
  delta: number;
  format: "currency" | "percent" | "days" | "number";
  formula: string;
}

export interface RiskIndicatorSpec {
  name: string;
  key: string;
  thresholds: {
    green: number;
    yellow: number;
    red: number;
    direction: "higher-is-worse" | "lower-is-worse";
  };
  breachFormula: string;
  severityMotion: "pulse-red" | "none";
}

export interface RiskIndicatorValue {
  key: string;
  name: string;
  value: number;
  daysToBreach: number;
  status: "green" | "yellow" | "red";
}

export interface ScenarioLevers {
  revenueConversionAdjustmentPct: number;
  collectionSpeedDays: number;
  freightInflationPct: number;
  overtimeReductionPct: number;
  inventoryShrinkChangePct: number;
  hiringFreeze: boolean;
}

export interface ExecutiveSummaryRequest {
  template: SummaryTemplate;
  period: string;
  scenario: string;
}

export interface SummaryDocument {
  title: string;
  generatedAt: string;
  sections: { heading: string; body: string }[];
}

export interface MonthlyPoint {
  period: string;
  revenueActual: number;
  revenueForecast: number;
  cogsActual: number;
  closeCycleDays: number;
  onTimeTaskPct: number;
  lateJournalPct: number;
  dso: number;
  controlExceptionAgingDays: number;
  forecastBiasPct: number;
  inventoryShrinkPct: number;
  pipelineGapPct: number;
  netCash: number;
}

export interface SeedProfile {
  companyName: string;
  periods: MonthlyPoint[];
  closeTasks: { owner: string; workstream: string; delayedDays: number; blocker: string; agingDays: number }[];
  cash13Week: { week: string; inflows: number; outflows: number; netCash: number; endingCash: number }[];
  arAging: { bucket: string; value: number }[];
  apAging: { bucket: string; value: number }[];
  varianceDrivers: { name: string; value: number }[];
  customerCashRisk: { customer: string; concentrationPct: number; risk: string; exposure: number }[];
}
