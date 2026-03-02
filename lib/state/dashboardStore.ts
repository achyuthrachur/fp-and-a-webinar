import seed from "@/data/static/seedProfile.json";
import { applyGlobalFilters } from "@/lib/formulas/selectors";
import { applyScenarioLevers, defaultLevers } from "@/lib/formulas/scenario";
import { computeKpis } from "@/lib/formulas/metrics";
import { computeRiskCompositeScore, computeRiskValues } from "@/lib/formulas/risk";
import type {
  DashboardTab,
  ExecutiveSummaryRequest,
  GlobalFilters,
  ScenarioLevers,
  SeedProfile,
  SummaryDocument,
  UploadResult,
} from "@/lib/types";
import { create } from "zustand";

const baseData = seed as SeedProfile;

interface DashboardStore {
  activeTab: DashboardTab;
  filters: GlobalFilters;
  levers: ScenarioLevers;
  uploadResult: UploadResult;
  data: SeedProfile;
  filtered: SeedProfile;
  riskScore: number;
  setActiveTab: (tab: DashboardTab) => void;
  setFilter: <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => void;
  setLever: <K extends keyof ScenarioLevers>(key: K, value: ScenarioLevers[K]) => void;
  resetLevers: () => void;
  setUploadResult: (result: UploadResult) => void;
  recompute: () => void;
  generateExecutiveSummary: (request: ExecutiveSummaryRequest) => SummaryDocument;
}

const defaultFilters: GlobalFilters = {
  entity: "NRDG",
  period: "2025-12",
  scenario: "Base",
  region: "All",
  product_family: "All",
  risk_threshold_profile: "Standard",
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  activeTab: "overview",
  filters: defaultFilters,
  levers: defaultLevers,
  uploadResult: { success: true, issues: [], usedFallback: false },
  data: baseData,
  filtered: baseData,
  riskScore: 0,
  setActiveTab: (activeTab) => set({ activeTab }),
  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
    get().recompute();
  },
  setLever: (key, value) => {
    set((state) => ({ levers: { ...state.levers, [key]: value } }));
    get().recompute();
  },
  resetLevers: () => {
    set({ levers: defaultLevers });
    get().recompute();
  },
  setUploadResult: (uploadResult) => set({ uploadResult }),
  recompute: () => {
    const { data, filters, levers } = get();
    const withScenario = applyScenarioLevers(data, levers);
    const filtered = applyGlobalFilters(withScenario, filters);
    const risks = computeRiskValues(filtered.periods);
    set({ filtered, riskScore: computeRiskCompositeScore(risks) });
  },
  generateExecutiveSummary: (request) => {
    const state = get();
    const kpis = computeKpis(state.filtered, state.filters);
    const topRisks = computeRiskValues(state.filtered.periods)
      .filter((r) => r.status !== "green")
      .slice(0, 3)
      .map((r) => `${r.name} (${r.status.toUpperCase()}, ${r.daysToBreach} days to breach)`)
      .join("; ");

    return {
      title: `${request.template} - ${request.period} (${request.scenario})`,
      generatedAt: new Date().toISOString(),
      sections: [
        {
          heading: "Current close posture",
          body: `Close cycle is ${kpis.find((k) => k.key === "close-cycle")?.value} days with on-time task completion at ${kpis.find((k) => k.key === "on-time")?.value} percent.`,
        },
        {
          heading: "Top 3 risks and reason codes",
          body: topRisks || "No material elevated indicators in current scenario.",
        },
        {
          heading: "Cash and working capital status",
          body: `Projected net cash is ${kpis.find((k) => k.key === "net-cash")?.value} with DSO trend pressure still active in the selected period.`,
        },
        {
          heading: "Recommended management focus for next 5 business days",
          body: "Prioritize overdue reconciliations, tighten AR follow-up cadence, and clear aging control exceptions before final reporting lock.",
        },
      ],
    };
  },
}));

useDashboardStore.getState().recompute();