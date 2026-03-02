"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function DonutClose({ completion }: { completion: number }) {
  const data = [
    { name: "Completed", value: completion },
    { name: "Remaining", value: 100 - completion },
  ];
  return (
    <div className="relative h-72 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="close-donut"><span>Close Completion Donut</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Completed versus remaining close tasks in current cycle</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} innerRadius={62} outerRadius={95} dataKey="value" nameKey="name">
            <Cell fill="#011E41" />
            <Cell fill="#E0E0E0" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-white/95 px-3 py-1 text-xs text-[rgb(var(--text-soft))] shadow-[var(--shadow-1)]">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#011E41]" />
          Completed
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E0E0E0]" />
          Remaining
        </span>
      </div>
    </div>
  );
}
