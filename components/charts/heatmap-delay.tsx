"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function HeatmapDelay({ data }: { data: { workstream: string; delayedDays: number }[] }) {
  return (
    <div className="h-72 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="heatmap-delay"><span>Task Delay by Workstream</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Workstream bottlenecks visible by delayed-day concentration</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="#E0E0E0" />
          <XAxis dataKey="workstream" tickMargin={10} label={{ value: "Workstream", position: "insideBottom", offset: -18 }} />
          <YAxis tickMargin={8} label={{ value: "Delayed Days", angle: -90, position: "insideLeft", dx: -24 }} />
          <Tooltip />
          <Bar dataKey="delayedDays" name="Delayed Days" fill="#011E41" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
