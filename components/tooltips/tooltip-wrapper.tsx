"use client";

import { Info } from "lucide-react";
import { tooltipLibrary } from "@/content/tooltips/tooltipLibrary";

export function TooltipWrapper({ id, children, overrideText }: { id: string; children: React.ReactNode; overrideText?: string }) {
  const tip = overrideText ?? tooltipLibrary[id] ?? "Tooltip not configured.";
  return (
    <span className="group relative z-20 inline-flex items-center gap-1 hover:z-[9999]">
      {children}
      <Info className="h-3.5 w-3.5 text-[rgb(var(--muted))]" aria-hidden />
      <span className="pointer-events-none absolute left-0 top-full z-[9999] mt-2 hidden w-80 rounded-md border border-[rgb(var(--border))] bg-white p-2 text-xs leading-5 text-[rgb(var(--text-strong))] shadow-[var(--shadow-2)] group-hover:block">
        {tip}
      </span>
    </span>
  );
}
