"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import type { RiskIndicatorValue } from "@/lib/types";

export function RiskCard({ risk }: { risk: RiskIndicatorValue }) {
  const reduce = useReducedMotion();
  const bg = risk.status === "red" ? "bg-rose-50" : risk.status === "yellow" ? "bg-amber-50" : "bg-emerald-50";
  return (
    <motion.article
      animate={risk.status === "red" && !reduce ? { scale: [1, 1.01, 1] } : { scale: 1 }}
      transition={{ duration: 2.5, repeat: risk.status === "red" && !reduce ? Infinity : 0 }}
      className={`relative z-10 overflow-visible rounded-xl ${bg} p-3 shadow-[var(--shadow-1)] hover:z-30`}
    >
      <TooltipWrapper id={risk.key}>
        <h4 className="text-sm font-medium text-[rgb(var(--text-strong))]">{risk.name}</h4>
      </TooltipWrapper>
      <p className="mt-2 text-xl font-semibold text-[rgb(var(--indigo-dark))]">{risk.value.toFixed(1)}</p>
      <p className="text-xs text-[rgb(var(--text-soft))]">{risk.daysToBreach} days to breach</p>
    </motion.article>
  );
}
