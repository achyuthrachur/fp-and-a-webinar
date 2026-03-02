import type { GlobalFilters, SeedProfile } from "@/lib/types";

export function applyGlobalFilters(data: SeedProfile, filters: GlobalFilters): SeedProfile {
  if (filters.period === "All") return data;
  return {
    ...data,
    periods: data.periods.filter((p) => p.period <= filters.period),
  };
}
