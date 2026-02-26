"use client";

import type { ControlState, ScenarioPreset } from "@/features/model/types";

const sliderMeta: Array<{
  key: keyof Pick<ControlState, "revenueGrowthPct" | "grossMarginPct" | "fuelIndex" | "collectionsRatePct" | "returnsPct" | "lateInvoicesHours" | "journalLoadMultiplier">;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}> = [
  { key: "revenueGrowthPct", label: "Revenue Growth", min: -0.04, max: 0.08, step: 0.001, format: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "grossMarginPct", label: "Gross Margin", min: 0.18, max: 0.28, step: 0.001, format: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "fuelIndex", label: "Fuel Index", min: 80, max: 140, step: 1, format: (v) => v.toFixed(0) },
  { key: "collectionsRatePct", label: "Collections Rate", min: 0.94, max: 1, step: 0.001, format: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "returnsPct", label: "Returns of Sales", min: 0.006, max: 0.025, step: 0.001, format: (v) => `${(v * 100).toFixed(2)}%` },
  { key: "lateInvoicesHours", label: "Late Invoices (hrs)", min: 0, max: 14, step: 1, format: (v) => v.toFixed(0) },
  { key: "journalLoadMultiplier", label: "Journal Load Multiplier", min: 0.8, max: 1.3, step: 0.01, format: (v) => `${v.toFixed(2)}x` },
];

type LeftControlsProps = {
  controls: ControlState;
  presets: ScenarioPreset[];
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
  onControlChange: <K extends keyof ControlState>(key: K, value: ControlState[K]) => void;
  onReset: () => void;
};

export function LeftControls({ controls, presets, selectedPresetId, onPresetChange, onControlChange, onReset }: LeftControlsProps) {
  return (
    <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_30px_65px_-42px_var(--shadow)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Scenario Controls</h2>
        <button onClick={onReset} className="text-xs text-[var(--muted)] underline">Reset</button>
      </div>

      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Presets</p>
      <div className="mb-6 grid gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition hover:scale-[1.01] ${selectedPresetId === preset.id ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface)]"}`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Levers</p>
      <div className="space-y-4">
        {sliderMeta.map((meta) => {
          const value = Number(controls[meta.key]);
          return (
            <label key={meta.key} className="block">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{meta.label}</span>
                <span className="text-[var(--muted)]">{meta.format(value)}</span>
              </div>
              <input
                aria-label={meta.label}
                type="range"
                min={meta.min}
                max={meta.max}
                step={meta.step}
                value={value}
                onChange={(e) => onControlChange(meta.key, Number(e.target.value) as never)}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--track)] accent-[var(--accent)]"
              />
            </label>
          );
        })}
      </div>

      <p className="mb-2 mt-6 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Toggles</p>
      <div className="space-y-2">
        {[
          ["prioritizeCashMode", "Prioritize Cash Mode"],
          ["conservativeForecastBias", "Conservative Forecast Bias"],
          ["tightenCreditHolds", "Tighten Credit Holds"],
          ["inventoryComplexity", "Inventory Adjustment Complexity"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
            <span>{label}</span>
            <input
              aria-label={label}
              type="checkbox"
              checked={Boolean(controls[key as keyof ControlState])}
              onChange={(e) => onControlChange(key as keyof ControlState, e.target.checked as never)}
            />
          </label>
        ))}
      </div>
    </aside>
  );
}
