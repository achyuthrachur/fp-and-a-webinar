// src/features/model/aiPromptUtils.ts
// Pure utility functions for AI summary prompt construction.
// Separated from the route handler so they can be imported in tests
// without triggering Next.js route-export type constraints.

import type { ControlState, ScenarioPreset } from '@/features/model/types';

export interface KpiPayload {
  netSales: string;
  cogs: string;
  grossProfit: string;
  ebitda: string;
  cash: string;
  ar: string;
  ap: string;
  inventory: string;
}

// Pure function — exported for Vitest testability (no React, no fetch).
// Produces the user message sent to GPT-4o. Contains all 8 KPI labels
// plus the preset name so the AI can reference scenario context.
export function buildUserPrompt(kpis: KpiPayload, presetName: string): string {
  return [
    `Scenario: ${presetName}`,
    `Net Sales: ${kpis.netSales}`,
    `COGS: ${kpis.cogs}`,
    `Gross Profit: ${kpis.grossProfit}`,
    `EBITDA: ${kpis.ebitda}`,
    `Cash: ${kpis.cash}`,
    `Accounts Receivable: ${kpis.ar}`,
    `Accounts Payable: ${kpis.ap}`,
    `Inventory: ${kpis.inventory}`,
    '',
    'Write the two-paragraph executive summary.',
  ].join('\n');
}

// Pure function — shared by DashboardApp (via TabContent) and AiSummarySection.
// Compares all ControlState fields against each preset's controls to find a named match.
// Falls back to 'Custom Scenario' when controls do not match any preset exactly.
export function getActivePresetName(controls: ControlState, presets: ScenarioPreset[]): string {
  const match = presets.find(p =>
    (Object.keys(controls) as Array<keyof ControlState>).every(k => controls[k] === p.controls[k])
  );
  return match ? match.label : 'Custom Scenario';
}
