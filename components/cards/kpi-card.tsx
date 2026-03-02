"use client";

import { motion } from "framer-motion";
import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { formatValue } from "@/lib/format";
import type { Kpi } from "@/lib/types";

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const deltaClass = kpi.delta >= 0 ? "text-emerald-600" : "text-rose-600";
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.08 }}
      className="rounded-xl bg-white p-4 shadow-[var(--shadow-1)]"
    >
      <TooltipWrapper id={kpi.key} overrideText={`${kpi.label}. Formula: ${kpi.formula}`}>
        <h3 className="text-sm text-[rgb(var(--text-soft))]">{kpi.label}</h3>
      </TooltipWrapper>
      <p className="mt-2 text-2xl font-semibold text-[rgb(var(--indigo-dark))]">{formatValue(kpi.value, kpi.format)}</p>
      <p className={`mt-1 text-xs ${deltaClass}`}>{kpi.delta >= 0 ? "▲" : "▼"} {Math.abs(kpi.delta).toFixed(2)}</p>
    </motion.article>
  );
}
