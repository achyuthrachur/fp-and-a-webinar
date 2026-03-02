"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function Waterfall({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-80 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="waterfall"><span>Budget to Forecast to Actual Bridge</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Bridges performance movement across reporting states</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="#E0E0E0" />
          <XAxis dataKey="name" tickMargin={10} label={{ value: "Stage", position: "insideBottom", offset: -18 }} />
          <YAxis tickMargin={8} label={{ value: "Revenue ($M)", angle: -90, position: "insideLeft", dx: -24 }} />
          <Tooltip />
          <Bar dataKey="value" name="Revenue" fill="#011E41" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
