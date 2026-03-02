"use client";

import type { DashboardTab } from "@/lib/types";

const items: { key: DashboardTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "close-command-center", label: "Close Command Center" },
  { key: "risk-indicators", label: "Risk Indicators" },
  { key: "scenario-levers", label: "Scenario Levers" },
  { key: "cash-working-capital", label: "Cash and Working Capital" },
  { key: "variance-drivers", label: "Variance and Drivers" },
  { key: "data-explorer", label: "Data Explorer" },
  { key: "readme-definitions", label: "ReadMe and Definitions" },
];

export function LeftNav({ activeTab, onChange }: { activeTab: DashboardTab; onChange: (tab: DashboardTab) => void }) {
  return (
    <nav className="rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => onChange(item.key)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                activeTab === item.key
                  ? "bg-[rgba(245,168,0,0.15)] text-[rgb(var(--indigo-dark))]"
                  : "text-[rgb(var(--text-soft))] hover:bg-[rgb(var(--wash))]"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
