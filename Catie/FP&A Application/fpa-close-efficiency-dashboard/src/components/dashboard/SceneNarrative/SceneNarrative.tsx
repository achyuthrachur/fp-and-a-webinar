// src/components/dashboard/SceneNarrative/SceneNarrative.tsx
// No 'use client' — runs inside DashboardApp client boundary.
// Banner card shown at the top of every tab: tab label + callout badges + italic narrative text.

import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/index';
import {
  selectNetSales,
  selectEbitda,
  selectCash,
} from '@/store/kpiSelectors';
import { CALLOUT_RULES, BASELINE_NARRATIVES } from '@/lib/calloutRules';
import type { CalloutRule } from '@/lib/calloutRules';
import { CalloutBadge } from './CalloutBadge';
import type { DashboardSeedData } from '@/lib/dataLoader';

type TabId = 'overview' | 'close-tracker' | 'charts' | 'ai-summary' | 'scenario';

export interface SceneNarrativeProps {
  tabId: TabId;
  presetName: string;
  seedData: DashboardSeedData;
  /** If provided, overrides the baseline narrative text (e.g. AI-generated text). */
  narrativeText?: string;
  /** If true, shows a pulsing loading placeholder instead of narrative text. */
  isLoading?: boolean;
}

const TAB_LABELS: Record<TabId, string> = {
  overview: 'Overview',
  'close-tracker': 'Close Tracker',
  charts: 'Charts',
  'ai-summary': 'AI Summary',
  scenario: 'Scenario',
};

// ─── Metric resolvers: map rule.metric → (kpis, seedData, controls) => number ─

type KpiBundle = {
  netSales: number;
  ebitda: number;
  cash: number;
};
type ControlsBundle = {
  revenueGrowthPct: number;
  grossMarginPct: number;
};

type MetricResolver = (
  kpis: KpiBundle,
  seedData: DashboardSeedData,
  controls: ControlsBundle
) => number;

const METRIC_RESOLVERS: Record<string, MetricResolver> = {
  ebitdaMargin: ({ netSales, ebitda }) => (netSales > 0 ? ebitda / netSales : 0),
  netSalesGrowth: (_kpis, seedData) => seedData.baseInputs.variancePct ?? 0,
  closeProgress: (_kpis, seedData) => {
    const stages = seedData.closeStages;
    if (stages.length === 0) return 0;
    return stages.reduce((sum, s) => sum + s.progress, 0) / stages.length;
  },
  daysRemaining: (_kpis, seedData) => {
    // Use closeTargetBusinessDays from company as proxy for days remaining
    return seedData.company?.closeTargetBusinessDays ?? 5;
  },
  ar90Ratio: (_kpis, seedData) => seedData.ar90Ratio,
  cashCoverage: ({ cash, netSales }) => (netSales > 0 ? cash / netSales : 0),
  revenueGrowth: (_kpis, _seedData, controls) => controls.revenueGrowthPct,
  grossMargin: (_kpis, _seedData, controls) => controls.grossMarginPct,
};

export function SceneNarrative({
  tabId,
  seedData,
  narrativeText,
  isLoading,
}: SceneNarrativeProps) {
  const netSales = useSelector(selectNetSales);
  const ebitda = useSelector(selectEbitda);
  const cash = useSelector(selectCash);
  const controls = useSelector((state: RootState) => state.scenario.controls);

  const kpis: KpiBundle = { netSales, ebitda, cash };
  const controlsBundle: ControlsBundle = {
    revenueGrowthPct: controls.revenueGrowthPct,
    grossMarginPct: controls.grossMarginPct,
  };

  // Filter rules to this tab (max 2 badges)
  const tabRules: CalloutRule[] = CALLOUT_RULES.filter(r => r.tab === tabId).slice(0, 2);

  const displayText = narrativeText ?? BASELINE_NARRATIVES[tabId];

  return (
    <div
      style={{
        background: '#f0f2f8',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 12,
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Top row: tab label left, badges right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: 'var(--foreground)',
          }}
        >
          {TAB_LABELS[tabId]}
        </span>

        {tabRules.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabRules.map(rule => {
              const resolver = METRIC_RESOLVERS[rule.metric];
              const value = resolver ? resolver(kpis, seedData, controlsBundle) : 0;
              return <CalloutBadge key={rule.metric} rule={rule} value={value} />;
            })}
          </div>
        )}
      </div>

      {/* Narrative text or loading placeholder */}
      {isLoading ? (
        <div
          style={{
            height: '1rem',
            width: '80%',
            borderRadius: 4,
            background:
              'linear-gradient(90deg, rgba(1,30,65,0.06) 25%, rgba(1,30,65,0.12) 50%, rgba(1,30,65,0.06) 75%)',
            backgroundSize: '200% 100%',
            animation: 'scene-narrative-pulse 1.5s ease-in-out infinite',
          }}
        />
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            fontStyle: 'italic',
            color: 'var(--muted-foreground, var(--muted-color))',
            lineHeight: 1.6,
          }}
        >
          {displayText}
        </p>
      )}

      {/* Keyframe for pulse animation */}
      <style>{`
        @keyframes scene-narrative-pulse {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
