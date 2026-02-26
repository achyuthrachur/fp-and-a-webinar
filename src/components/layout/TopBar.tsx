"use client";

import { motion } from "motion/react";

type TopBarProps = {
  scenarioLabel: string;
  closeDayLabel: string;
  periodLabel: string;
  onGenerateSummary: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function TopBar({
  scenarioLabel,
  closeDayLabel,
  periodLabel,
  onGenerateSummary,
  theme,
  onToggleTheme,
}: TopBarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 p-4 shadow-[0_20px_55px_-35px_var(--shadow)] backdrop-blur"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Crowe | Close Efficiency Insights</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Great Lakes Industrial Supply</h1>
        <p className="text-sm text-[var(--muted)]">{periodLabel} | {closeDayLabel} | Scenario: {scenarioLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:scale-[1.03]"
          aria-label="Toggle theme"
        >
          Theme: {theme}
        </button>
        <button
          onClick={onGenerateSummary}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#1f2a3e] shadow-[0_16px_28px_-22px_var(--accent)] transition hover:scale-[1.03]"
        >
          Generate Summary
        </button>
      </div>
    </motion.header>
  );
}
