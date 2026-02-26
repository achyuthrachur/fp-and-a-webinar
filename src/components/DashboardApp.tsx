"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { computeDerivedMetrics } from "@/features/model/calc";
import { buildExecutiveSummary, evaluateRiskFlags } from "@/features/model/insightEngine";
import type { BaseInputs, ControlState, ExecutiveSummary, ScenarioPreset } from "@/features/model/types";
import { TopBar } from "@/components/layout/TopBar";
import { LeftControls } from "@/components/layout/LeftControls";
import { KpiRibbon } from "@/components/dashboard/KpiRibbon";
import { CloseTimeline } from "@/components/dashboard/CloseTimeline";
import { SummaryDrawer } from "@/components/layout/SummaryDrawer";
import { currency, number, percent } from "@/lib/format";

const ChartsCash13Week = dynamic(() => import("@/components/dashboard/ChartsCash13Week").then((m) => m.ChartsCash13Week), {
  ssr: false,
});
const ChartsPipeline = dynamic(() => import("@/components/dashboard/ChartsPipeline").then((m) => m.ChartsPipeline), {
  ssr: false,
});
const ChartsMarginBridge = dynamic(
  () => import("@/components/dashboard/ChartsMarginBridge").then((m) => m.ChartsMarginBridge),
  { ssr: false },
);

type DashboardAppProps = {
  companyName: string;
  periodLabel: string;
  presets: ScenarioPreset[];
  baseInputs: BaseInputs;
  ar90Ratio: number;
  closeStages: { name: string; progress: number }[];
};

export function DashboardApp({ companyName, periodLabel, presets, baseInputs, ar90Ratio, closeStages }: DashboardAppProps) {
  const baselinePreset = presets[0];
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedPresetId, setSelectedPresetId] = useState(baselinePreset.id);
  const [controls, setControls] = useState<ControlState>(baselinePreset.controls);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [llmEnabled, setLlmEnabled] = useState(process.env.NEXT_PUBLIC_LLM_ENHANCE === "true");
  const [llmPending, setLlmPending] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const baselineMetrics = useMemo(() => computeDerivedMetrics(baseInputs, baselinePreset.controls), [baseInputs, baselinePreset.controls]);
  const metrics = useMemo(() => computeDerivedMetrics(baseInputs, controls), [baseInputs, controls]);
  const flags = useMemo(() => evaluateRiskFlags(metrics, baselineMetrics, ar90Ratio), [metrics, baselineMetrics, ar90Ratio]);

  const cashChartData = useMemo(() => {
    const startingCash = baseInputs.baseCash;
    return Array.from({ length: 13 }).map((_, idx) => {
      const weeklyDrift = (metrics.projGrossProfit - metrics.projOpex) / 12;
      return {
        week: `W${idx + 1}`,
        cash: Math.round(startingCash + idx * weeklyDrift + idx * 45000 * (controls.collectionsRatePct - 0.95)),
      };
    });
  }, [baseInputs.baseCash, metrics, controls.collectionsRatePct]);

  const pipelineData = useMemo(
    () => [
      { label: "Pipeline", value: Math.round(metrics.projNetSales * 1.35) },
      { label: "Bookings", value: Math.round(metrics.projNetSales * 1.08) },
      { label: "Invoiced", value: Math.round(metrics.projNetSales) },
    ],
    [metrics.projNetSales],
  );

  const marginBridgeData = useMemo(
    () => [
      { driver: "Vendor Inflation", impact: -Math.round((1 - controls.grossMarginPct / 0.23) * 220000) },
      { driver: "Freight", impact: -Math.round(((controls.fuelIndex - 100) / 100) * 170000) },
      { driver: "Returns", impact: -Math.round(metrics.returnsDollars) },
      { driver: "Mix Uplift", impact: Math.round(metrics.projGrossProfit - baselineMetrics.projGrossProfit + metrics.returnsDollars) },
    ],
    [controls.grossMarginPct, controls.fuelIndex, metrics.returnsDollars, metrics.projGrossProfit, baselineMetrics.projGrossProfit],
  );

  const kpis = [
    { label: "Close ETA", value: `D+${metrics.closeEtaBusinessDays.toFixed(1)}`, helper: "Target D+6" },
    { label: "At-Risk Areas", value: number(flags.length), helper: "Red + yellow thresholds" },
    { label: "Cash Coverage", value: `${metrics.cashCoverageWeeks.toFixed(1)} weeks`, helper: "13-week horizon" },
    { label: "AR DSO", value: `${metrics.arDso.toFixed(1)} days`, helper: "Collections pressure" },
    { label: "Forecast Confidence", value: `${metrics.forecastConfidence}/100`, helper: `Variance ${percent(metrics.variancePct, 1)}` },
    { label: "Journal Load", value: number(metrics.journalLoad), helper: "Expected monthly entries" },
  ];

  const selectedPreset = presets.find((preset) => preset.id === selectedPresetId) ?? presets[0];

  const handlePresetChange = (presetId: string) => {
    const preset = presets.find((candidate) => candidate.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setControls(preset.controls);
  };

  const handleControlChange = <K extends keyof ControlState>(key: K, value: ControlState[K]) => {
    setSelectedPresetId("custom");
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateSummary = () => {
    const nextSummary = buildExecutiveSummary({
      companyName,
      controls,
      metrics,
      baseline: baselineMetrics,
      flags,
      scenarioLabel: selectedPreset.label,
    });
    setSummary(nextSummary);
    setSummaryOpen(true);
  };

  const handleEnhance = async () => {
    if (!summary || !llmEnabled) return;
    setLlmPending(true);
    try {
      const response = await fetch("/api/enhance-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      if (!response.ok) throw new Error("Enhance failed");
      const payload = (await response.json()) as { summary: ExecutiveSummary };
      setSummary(payload.summary);
    } catch {
      setSummary((prev) => (prev ? { ...prev, enhancedByLlm: false } : prev));
    } finally {
      setLlmPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 pb-12 pt-5 md:px-6 xl:px-10">
      <TopBar
        scenarioLabel={selectedPreset.label}
        closeDayLabel="Close Day: D+3"
        periodLabel={periodLabel}
        onGenerateSummary={handleGenerateSummary}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      />

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <LeftControls
          controls={controls}
          presets={presets}
          selectedPresetId={selectedPresetId}
          onPresetChange={handlePresetChange}
          onControlChange={handleControlChange}
          onReset={() => handlePresetChange(baselinePreset.id)}
        />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-5"
        >
          <KpiRibbon items={kpis} />
          <CloseTimeline stages={closeStages} flags={flags} />

          <section className="grid gap-5 xl:grid-cols-3">
            <ChartsCash13Week data={cashChartData} />
            <ChartsPipeline data={pipelineData} />
            <ChartsMarginBridge data={marginBridgeData} />
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            Flags indicate deterministic threshold watch items. Suggested actions are operational follow-ups, not autonomous automation steps.
            <div className="mt-2 text-xs">Projected net sales: {currency(metrics.projNetSales)} | Projected gross profit: {currency(metrics.projGrossProfit)}</div>
          </section>
        </motion.main>
      </div>

      <SummaryDrawer
        open={summaryOpen}
        summary={summary}
        llmEnabled={llmEnabled}
        llmPending={llmPending}
        onToggleLlm={setLlmEnabled}
        onEnhance={handleEnhance}
      />
    </div>
  );
}
