// src/app/api/enhance-summary/route.ts
// STUB — Wave 0 placeholder. Full implementation in Plan 08-02.
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';

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

// Pure function exported for testability — Wave 0 stub returns empty string.
export function buildUserPrompt(kpis: KpiPayload, presetName: string): string {
  return '';
}

export async function POST(_req: NextRequest) {
  return new Response('stub', { status: 200 });
}
