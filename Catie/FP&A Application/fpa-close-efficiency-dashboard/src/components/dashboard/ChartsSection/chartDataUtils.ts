// chartDataUtils.ts
// Pure data transformation functions for static chart components.
// No React imports — these are plain functions usable in Vitest (node env).

import type { ARRow, PipelineRow, Cash13WeekRow } from '@/features/model/types';

// ─── Pipeline to Invoiced (CHRT-02) ──────────────────────────────────────────

export const STAGE_ORDER = [
  'Qualified',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Invoiced',
] as const;

export interface PipelineChartPoint {
  stage: string;
  total: number;
  weighted: number;
}

export function buildPipelineChartData(rows: PipelineRow[]): PipelineChartPoint[] {
  return STAGE_ORDER.map(stage => {
    const stageRows = rows.filter(r => r.stage === stage);
    const total = stageRows.reduce((s, r) => s + r.amount_usd, 0);
    const weighted = stageRows.reduce((s, r) => s + r.amount_usd * r.probability, 0);
    return { stage, total, weighted };
  });
}

// ─── AR Aging (CHRT-03) ──────────────────────────────────────────────────────

export interface ArAgingPoint {
  current: number;
  d1_30: number;
  d31_60: number;
  d61_90: number;
  d90plus: number;
}

export function buildArAgingData(rows: ARRow[]): ArAgingPoint[] {
  const totals = rows.reduce<ArAgingPoint>(
    (acc, r) => ({
      current: acc.current + r.ar_current,
      d1_30: acc.d1_30 + r.ar_1_30,
      d31_60: acc.d31_60 + r.ar_31_60,
      d61_90: acc.d61_90 + r.ar_61_90,
      d90plus: acc.d90plus + r.ar_90_plus,
    }),
    { current: 0, d1_30: 0, d31_60: 0, d61_90: 0, d90plus: 0 }
  );
  return [totals];
}

// ─── 13-Week Cash Flow (CHRT-04) ─────────────────────────────────────────────

export interface CashFlowPoint {
  week: string;
  isActual: boolean;
  actualNetCash: number | null;
  forecastNetCash: number | null;
  inflow: number;
  outflow: number;
  net_cash: number;
}

export function buildCashFlowData(rows: Cash13WeekRow[]): CashFlowPoint[] {
  return rows.map(r => {
    const isActual = r.is_actual === 'true';
    return {
      week: r.week,
      isActual,
      actualNetCash: isActual ? r.net_cash : null,
      forecastNetCash: !isActual ? r.net_cash : null,
      inflow: r.inflow,
      outflow: r.outflow,
      net_cash: r.net_cash,
    };
  });
}
