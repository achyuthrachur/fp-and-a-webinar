"use client";

import type { DashboardTab } from "@/lib/types";

const tabs: { key: DashboardTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "close-command-center", label: "Close" },
  { key: "risk-indicators", label: "Risk" },
  { key: "scenario-levers", label: "Scenario" },
  { key: "cash-working-capital", label: "Cash" },
  { key: "variance-drivers", label: "Variance" },
  { key: "data-explorer", label: "Data" },
  { key: "readme-definitions", label: "ReadMe" },
];

export function TabHeader({ activeTab, onChange }: { activeTab: DashboardTab; onChange: (tab: DashboardTab) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-[var(--shadow-1)]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-lg px-3 py-2 text-sm transition ${
            activeTab === tab.key
              ? "bg-[rgb(var(--indigo-dark))] text-white"
              : "text-[rgb(var(--text-soft))] hover:bg-[rgb(var(--wash))]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
