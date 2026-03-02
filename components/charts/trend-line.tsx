"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export function TrendLine({ data }: { data: { period: string; actual: number; forecast: number }[] }) {
  return (
    <div className="h-72 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="trend-line"><span>12-Month Revenue Trend (Actual vs Forecast)</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Tracks top-line trajectory and forecast alignment over time</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="#E0E0E0" />
          <XAxis dataKey="period" tickMargin={10} label={{ value: "Month", position: "insideBottom", offset: -18 }} />
          <YAxis tickMargin={8} label={{ value: "Revenue ($M)", angle: -90, position: "insideLeft", dx: -24 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual" stroke="#011E41" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#F5A800" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
