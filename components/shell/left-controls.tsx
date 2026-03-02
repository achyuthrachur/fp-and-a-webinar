"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import type { GlobalFilters, ScenarioLevers } from "@/lib/types";

interface LeftControlsProps {
  filters: GlobalFilters;
  levers: ScenarioLevers;
  setFilter: <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => void;
  setLever: <K extends keyof ScenarioLevers>(key: K, value: ScenarioLevers[K]) => void;
  resetLevers: () => void;
}

export function LeftControls({ filters, levers, setFilter, setLever, resetLevers }: LeftControlsProps) {
  return (
    <aside className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[rgb(var(--indigo-dark))]">Filters and Levers</h2>
        <button onClick={resetLevers} className="text-xs text-[rgb(var(--text-soft))] underline">
          Reset
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="filter-period"><span>Period</span></TooltipWrapper>
          <select className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] p-2 text-sm" value={filters.period} onChange={(e) => setFilter("period", e.target.value)}>
            {[
              "2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12",
            ].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="filter-scenario"><span>Scenario</span></TooltipWrapper>
          <select className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] p-2 text-sm" value={filters.scenario} onChange={(e) => setFilter("scenario", e.target.value as GlobalFilters["scenario"])}>
            <option value="Base">Base</option>
            <option value="Stress">Stress</option>
            <option value="Upside">Upside</option>
          </select>
        </label>

        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="lever-revenue"><span>Revenue Conversion %</span></TooltipWrapper>
          <input type="range" min={-10} max={10} value={levers.revenueConversionAdjustmentPct} onChange={(e) => setLever("revenueConversionAdjustmentPct", Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="lever-collections"><span>Collection Speed Days</span></TooltipWrapper>
          <input type="range" min={-15} max={15} value={levers.collectionSpeedDays} onChange={(e) => setLever("collectionSpeedDays", Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="lever-freight"><span>Freight Inflation %</span></TooltipWrapper>
          <input type="range" min={-5} max={15} value={levers.freightInflationPct} onChange={(e) => setLever("freightInflationPct", Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="lever-overtime"><span>Overtime Reduction %</span></TooltipWrapper>
          <input type="range" min={0} max={20} value={levers.overtimeReductionPct} onChange={(e) => setLever("overtimeReductionPct", Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="block text-xs text-[rgb(var(--muted))]">
          <TooltipWrapper id="lever-shrink"><span>Inventory Shrink Change %</span></TooltipWrapper>
          <input type="range" min={-1} max={1} step={0.1} value={levers.inventoryShrinkChangePct} onChange={(e) => setLever("inventoryShrinkChangePct", Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-[rgb(var(--border))] p-2 text-xs">
          <TooltipWrapper id="lever-hiring"><span>Hiring Freeze</span></TooltipWrapper>
          <input type="checkbox" checked={levers.hiringFreeze} onChange={(e) => setLever("hiringFreeze", e.target.checked)} />
        </label>
      </div>
    </aside>
  );
}
