// src/features/model/__tests__/aiSummary.test.ts
// Wave 0 RED stubs — all tests must FAIL until Plan 08-02 implements the real code.
import { describe, it, expect, beforeAll } from 'vitest';
import type { KpiPayload } from '@/app/api/enhance-summary/route';

let buildUserPrompt: (kpis: KpiPayload, presetName: string) => string;
let BASELINE_SUMMARY: string;
let routeImportError: unknown;
let cacheImportError: unknown;

beforeAll(async () => {
  try {
    const routeMod = await import('@/app/api/enhance-summary/route');
    buildUserPrompt = (routeMod as unknown as Record<string, unknown>).buildUserPrompt as typeof buildUserPrompt;
  } catch (err) {
    routeImportError = err;
  }
});

beforeAll(async () => {
  try {
    const cacheMod = await import('@/lib/aiSummaryCache');
    BASELINE_SUMMARY = (cacheMod as unknown as Record<string, unknown>).BASELINE_SUMMARY as string;
  } catch (err) {
    cacheImportError = err;
  }
});

describe('buildUserPrompt (AISU-01)', () => {
  it('Test 1: includes all 8 KPI labels in output', () => {
    if (routeImportError) throw routeImportError;
    const kpis: KpiPayload = {
      netSales: '$9,476,000',
      cogs: '$7,337,267',
      grossProfit: '$2,138,733',
      ebitda: '$958,733',
      cash: '$4,250,000',
      ar: '$2,800,000',
      ap: '$3,100,000',
      inventory: '$6,400,000',
    };
    const result = buildUserPrompt(kpis, 'Jan 2026 Baseline');
    expect(result).toContain('Net Sales');
    expect(result).toContain('COGS');
    expect(result).toContain('Gross Profit');
    expect(result).toContain('EBITDA');
    expect(result).toContain('Cash');
    expect(result).toContain('Accounts Receivable');
    expect(result).toContain('Accounts Payable');
    expect(result).toContain('Inventory');
  });

  it('Test 2: includes presetName in output', () => {
    if (routeImportError) throw routeImportError;
    const kpis: KpiPayload = {
      netSales: '$9,476,000',
      cogs: '$7,337,267',
      grossProfit: '$2,138,733',
      ebitda: '$958,733',
      cash: '$4,250,000',
      ar: '$2,800,000',
      ap: '$3,100,000',
      inventory: '$6,400,000',
    };
    const result = buildUserPrompt(kpis, 'Fuel Cost Shock');
    expect(result).toContain('Fuel Cost Shock');
  });

  it('Test 3: includes the instruction to write the summary', () => {
    if (routeImportError) throw routeImportError;
    const kpis: KpiPayload = {
      netSales: '$9,476,000',
      cogs: '$7,337,267',
      grossProfit: '$2,138,733',
      ebitda: '$958,733',
      cash: '$4,250,000',
      ar: '$2,800,000',
      ap: '$3,100,000',
      inventory: '$6,400,000',
    };
    const result = buildUserPrompt(kpis, 'Jan 2026 Baseline');
    expect(result).toContain('executive summary');
  });
});

describe('BASELINE_SUMMARY (AISU-04)', () => {
  it('Test 4: exports a non-empty string', () => {
    if (cacheImportError) throw cacheImportError;
    expect(typeof BASELINE_SUMMARY).toBe('string');
    expect(BASELINE_SUMMARY.length).toBeGreaterThan(100);
  });

  it('Test 5: contains CFO-relevant financial reference ($9.5M area)', () => {
    if (cacheImportError) throw cacheImportError;
    const hasFinancialContent =
      BASELINE_SUMMARY.includes('9.5') ||
      BASELINE_SUMMARY.includes('$9') ||
      BASELINE_SUMMARY.includes('959');
    expect(hasFinancialContent).toBe(true);
  });

  it('Test 6: contains two paragraphs (double newline separator)', () => {
    if (cacheImportError) throw cacheImportError;
    expect(BASELINE_SUMMARY).toContain('\n\n');
  });
});
