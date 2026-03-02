"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function GanttClose({ data }: { data: { owner: string; delayedDays: number }[] }) {
  return (
    <div className="h-72 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="gantt-close"><span>Close Calendar Delay by Owner</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Delay exposure by close owner to prioritize intervention</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="#E0E0E0" />
          <XAxis dataKey="owner" tickMargin={10} label={{ value: "Owner", position: "insideBottom", offset: -18 }} />
          <YAxis tickMargin={8} label={{ value: "Delayed Days", angle: -90, position: "insideLeft", dx: -24 }} />
          <Tooltip />
          <Bar dataKey="delayedDays" name="Delayed Days" fill="#F5A800" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
