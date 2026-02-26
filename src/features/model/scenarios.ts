import type { ScenarioPreset } from "./types";

export function presetsById(presets: ScenarioPreset[]): Record<string, ScenarioPreset> {
  return presets.reduce<Record<string, ScenarioPreset>>((acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  }, {});
}
