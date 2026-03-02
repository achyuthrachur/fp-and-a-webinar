"use client";

import { Search } from "lucide-react";

export function TopBanner({ onOpenSummary }: { onOpenSummary: () => void }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-[var(--shadow-1)]">
      <div>
        <p className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">CloseVision</p>
        <h1 className="text-2xl font-bold text-[rgb(var(--indigo-dark))]">NorthRiver Distribution Group</h1>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--wash))] px-3 py-2">
          <Search className="h-4 w-4 text-[rgb(var(--muted))]" />
          <input className="w-40 bg-transparent text-sm outline-none" placeholder="Search" aria-label="Search" />
        </label>
        <button
          onClick={onOpenSummary}
          className="rounded-xl bg-[rgb(var(--amber-core))] px-4 py-2 text-sm font-semibold text-[rgb(var(--indigo-dark))] transition hover:-translate-y-0.5"
        >
          Generate Executive Summary
        </button>
      </div>
    </header>
  );
}
