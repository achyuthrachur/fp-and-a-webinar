"use client";

import type { ExecutiveSummary } from "@/features/model/types";

type SummaryDrawerProps = {
  open: boolean;
  summary: ExecutiveSummary | null;
  llmEnabled: boolean;
  llmPending: boolean;
  onToggleLlm: (value: boolean) => void;
  onEnhance: () => void;
};

export function SummaryDrawer({ open, summary, llmEnabled, llmPending, onToggleLlm, onEnhance }: SummaryDrawerProps) {
  return (
    <aside
      aria-live="polite"
      className={`fixed right-0 top-0 z-30 h-full w-full max-w-xl border-l border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_0_60px_-30px_var(--shadow)] transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h2 className="text-xl font-semibold">AI Executive Summary</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Deterministic narrative with optional rephrase enhancement.</p>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <input id="llm-enhance" type="checkbox" checked={llmEnabled} onChange={(e) => onToggleLlm(e.target.checked)} />
        <label htmlFor="llm-enhance" className="text-sm">LLM Enhance (rephrase only)</label>
        <button
          onClick={onEnhance}
          disabled={!summary || !llmEnabled || llmPending}
          className="ml-auto rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[#1f2a3e] disabled:opacity-50"
        >
          {llmPending ? "Enhancing..." : "Enhance"}
        </button>
      </div>

      {!summary ? (
        <p className="mt-6 text-sm text-[var(--muted)]">Click Generate Summary from the top bar.</p>
      ) : (
        <div className="mt-6 space-y-4 overflow-y-auto pb-20 text-sm">
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Executive Bullets</h3>
            <ul className="space-y-2">
              {summary.bullets.map((item) => (
                <li key={item} className="rounded-lg bg-[var(--surface)] p-2">{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">What Changed vs Baseline</h3>
            <ul className="list-disc space-y-1 pl-4">
              {summary.changedVsBaseline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Risks and Mitigations</h3>
            <ul className="list-disc space-y-1 pl-4">
              {summary.risksAndMitigations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Assumptions Used</h3>
            <ul className="list-disc space-y-1 pl-4">
              {summary.assumptionsUsed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </aside>
  );
}
