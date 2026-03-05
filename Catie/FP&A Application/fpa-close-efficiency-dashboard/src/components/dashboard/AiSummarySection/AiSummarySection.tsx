// src/components/dashboard/AiSummarySection/AiSummarySection.tsx
// No 'use client' — runs inside DashboardApp client boundary.
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { DashboardSeedData } from '@/lib/dataLoader';
import type { ControlState } from '@/features/model/types';
import { BASELINE_SUMMARY } from '@/lib/aiSummaryCache';
import type { KpiPayload } from '@/app/api/enhance-summary/route';
import {
  selectNetSales,
  selectCogs,
  selectGrossProfit,
  selectEbitda,
  selectCash,
  selectAr,
  selectAp,
  selectInventory,
} from '@/store/kpiSelectors';
import { formatCurrency } from '@/lib/formatters';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { Button } from '@/components/ui/Button';

// Dynamic import — InfinityLoader uses browser APIs; ssr: false prevents SSR crash.
const InfinityLoader = dynamic(
  () => import('@/components/ui/InfinityLoader'),
  { ssr: false, loading: () => <div style={{ height: 64 }} /> }
);

interface AiSummarySectionProps {
  seedData: DashboardSeedData;
}

// Compare two ControlState objects field by field.
// JSON.stringify risks false negatives on key-order — use field iteration (Phase 4 pattern).
function controlsMatch(a: ControlState, b: ControlState): boolean {
  return (Object.keys(a) as Array<keyof ControlState>).every(k => a[k] === b[k]);
}

export default function AiSummarySection({ seedData }: AiSummarySectionProps) {
  const controls = useSelector((state: RootState) => state.scenario.controls);
  const netSales = useSelector(selectNetSales);
  const cogs = useSelector(selectCogs);
  const grossProfit = useSelector(selectGrossProfit);
  const ebitda = useSelector(selectEbitda);
  const cash = useSelector(selectCash);
  const ar = useSelector(selectAr);
  const ap = useSelector(selectAp);
  const inventory = useSelector(selectInventory);

  const [summaryText, setSummaryText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track controls snapshot at last generation to detect drift.
  const summaryControlsRef = useRef<ControlState | null>(null);

  // ── MOUNT EFFECT: display cached baseline if controls match baseline preset ──
  useEffect(() => {
    const baselinePreset = seedData.presets.find(p => p.id === 'baseline');
    if (!baselinePreset) return;
    if (controlsMatch(controls, baselinePreset.controls)) {
      setSummaryText(BASELINE_SUMMARY);
      setIsStale(false);
      summaryControlsRef.current = baselinePreset.controls;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only

  // ── STALE DETECTION: mark summary stale when controls drift from generation snapshot ──
  useEffect(() => {
    if (!summaryText || !summaryControlsRef.current) return;
    if (!controlsMatch(controls, summaryControlsRef.current)) {
      setIsStale(true);
    }
  }, [controls, summaryText]);

  // Derive active preset name for the prompt payload.
  function getPresetName(): string {
    const match = seedData.presets.find(p => controlsMatch(controls, p.controls));
    return match ? match.label : 'Custom Scenario';
  }

  function buildKpiPayload(): KpiPayload {
    return {
      netSales: formatCurrency(netSales, false),
      cogs: formatCurrency(cogs, false),
      grossProfit: formatCurrency(grossProfit, false),
      ebitda: formatCurrency(ebitda, false),
      cash: formatCurrency(cash, false),
      ar: formatCurrency(ar, false),
      ap: formatCurrency(ap, false),
      inventory: formatCurrency(inventory, false),
    };
  }

  async function handleGenerate() {
    setIsStreaming(true);
    setSummaryText('');
    setError(null);
    setIsStale(false);
    // Snapshot controls at generation time for drift detection.
    summaryControlsRef.current = { ...controls };

    try {
      const response = await fetch('/api/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kpis: buildKpiPayload(), presetName: getPresetName() }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Functional updater prevents stale closure — captures prev not initial state.
          setSummaryText(prev => prev + chunk);
        }
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      setError('Unable to generate summary. Check your connection and try again.');
      summaryControlsRef.current = null;
    } finally {
      setIsStreaming(false);
    }
  }

  const hasContent = summaryText.length > 0;
  const buttonLabel = hasContent ? 'Regenerate' : 'Generate Summary';

  // Split summary into paragraphs for readable display.
  const paragraphs = summaryText
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <>
      <SectionHeader
        title="AI Executive Summary"
        subtitle="AI-Generated CFO Narrative — Two-paragraph executive summary synthesized from current scenario KPIs"
      />
      <section
        style={{
          marginTop: '1.5rem',
        background: 'var(--card)',
        borderRadius: '12px',
        boxShadow:
          '0 1px 3px rgba(1,30,65,0.04), 0 6px 16px rgba(1,30,65,0.04), 0 12px 32px rgba(1,30,65,0.02)',
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Left: title + icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Inline SVG document icon — Iconsax not available as direct JSX here;
              use a simple SVG that matches the Iconsax Linear style */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span
            style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'var(--foreground)',
            }}
          >
            AI Executive Summary
          </span>
          {/* Stale scenario badge */}
          {hasContent && isStale && !isStreaming && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 9999,
                background: 'rgba(245,168,0,0.12)',
                color: 'var(--accent)',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginLeft: '0.5rem',
              }}
            >
              Scenario changed — regenerate?
            </span>
          )}
        </div>

        {/* Right: Generate / Regenerate button */}
        <Button
          onClick={handleGenerate}
          disabled={isStreaming}
          variant="default"
          size="sm"
        >
          {isStreaming ? 'Generating\u2026' : buttonLabel}
        </Button>
      </div>

      {/* Card body */}
      <div style={{ padding: '1.25rem', minHeight: '5rem' }}>
        {/* Loading animation: visible between button click and first token */}
        {isStreaming && summaryText === '' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 0',
            }}
          >
            <InfinityLoader size={48} color="var(--accent)" />
          </div>
        )}

        {/* Error state */}
        {error && !isStreaming && (
          <p
            style={{
              color: 'var(--destructive, #E5376B)',
              fontSize: '0.875rem',
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        {/* Summary text — split into paragraph elements */}
        {paragraphs.length > 0 && (
          <div>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  margin: i === 0 ? 0 : '1rem 0 0',
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                  color: 'var(--foreground)',
                }}
              >
                {para}
                {/* Append blinking cursor after last paragraph while streaming */}
                {isStreaming && i === paragraphs.length - 1 && (
                  <span className="streaming-cursor" aria-hidden="true" />
                )}
              </p>
            ))}
          </div>
        )}

        {/* Cursor when streaming but text not yet split into paragraphs */}
        {isStreaming && paragraphs.length === 0 && summaryText !== '' && (
          <span className="streaming-cursor" aria-hidden="true" />
        )}

        {/* Empty state when no content and not loading */}
        {!hasContent && !isStreaming && !error && (
          <p
            style={{
              color: 'var(--muted-foreground)',
              fontSize: '0.875rem',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Click &ldquo;Generate Summary&rdquo; to produce an AI-generated executive narrative for the current scenario.
          </p>
        )}
      </div>
      </section>
    </>
  );
}
