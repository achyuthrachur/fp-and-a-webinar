import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { parseCsv } from "./csv";
import {
  arRowSchema,
  controlStateSchema,
  glRowSchema,
  pipelineRowSchema,
  type ARRow,
  type BaseInputs,
  type ControlState,
  type GLRow,
  type PipelineRow,
  type ScenarioPreset,
} from "@/features/model/types";

type Company = {
  name: string;
  closeTargetBusinessDays: number;
  defaultAssumptions: Pick<ControlState, "revenueGrowthPct" | "grossMarginPct" | "fuelIndex" | "collectionsRatePct" | "returnsPct">;
};

export type DashboardSeedData = {
  company: Company;
  presets: ScenarioPreset[];
  baseInputs: BaseInputs;
  ar90Ratio: number;
  closeStages: { name: string; progress: number }[];
};

async function readDataFile(file: string): Promise<string> {
  const filePath = path.join(process.cwd(), "src", "data", file);
  return fs.readFile(filePath, "utf8");
}

export async function loadDashboardSeedData(): Promise<DashboardSeedData> {
  const companyRaw = await readDataFile("company.json");
  const presetsRaw = await readDataFile("scenario-presets.json");

  const company = z
    .object({
      name: z.string(),
      closeTargetBusinessDays: z.number(),
      defaultAssumptions: z.object({
        revenueGrowthPct: z.number(),
        grossMarginPct: z.number(),
        fuelIndex: z.number(),
        collectionsRatePct: z.number(),
        returnsPct: z.number(),
      }),
    })
    .parse(JSON.parse(companyRaw));

  const presetSchema = z.object({
    id: z.string(),
    label: z.string(),
    controls: controlStateSchema,
  });
  const presets = z.array(presetSchema).parse(JSON.parse(presetsRaw));

  const glRows = z.array(glRowSchema).parse(parseCsv(await readDataFile("erp_gl_summary.csv"))) as GLRow[];
  const arRows = z.array(arRowSchema).parse(parseCsv(await readDataFile("ar_aging.csv"))) as ARRow[];
  const pipelineRows = z.array(pipelineRowSchema).parse(parseCsv(await readDataFile("crm_pipeline.csv"))) as PipelineRow[];

  const latestGL = glRows[glRows.length - 1];
  const arTotal = arRows.reduce((sum, row) => sum + row.ar_total, 0);
  const ar90 = arRows.reduce((sum, row) => sum + row.ar_90_plus, 0);
  const weightedPipeline = pipelineRows.reduce((sum, row) => sum + row.amount_usd * row.probability, 0);
  const pipelineTotal = pipelineRows.reduce((sum, row) => sum + row.amount_usd, 0);
  const pipelineExecutionRatio = pipelineTotal > 0 ? weightedPipeline / pipelineTotal : 0.9;

  const baseInputs: BaseInputs = {
    baseNetSales: latestGL.net_sales,
    baseOpex: latestGL.opex,
    baseCash: latestGL.cash,
    baseCashInWeekly: latestGL.net_sales / 4,
    arTotal,
    manualJeCount: latestGL.manual_je_count,
    closeAdjustmentsCount: latestGL.close_adjustments_count,
    pipelineExecutionRatio,
    variancePct: 0.037,
  };

  return {
    company,
    presets,
    baseInputs,
    ar90Ratio: arTotal > 0 ? ar90 / arTotal : 0,
    closeStages: [
      { name: "AP close", progress: 78 },
      { name: "AR close", progress: 70 },
      { name: "Revenue recognition checks", progress: 66 },
      { name: "Inventory valuation", progress: 59 },
      { name: "Accruals and manual JEs", progress: 62 },
      { name: "Financial statement package", progress: 47 },
    ],
  };
}
