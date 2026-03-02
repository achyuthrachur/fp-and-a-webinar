"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FanChart({ data }: { data: { period: string; forecast: number; low: number; high: number }[] }) {
  return (
    <div className="h-72 rounded-xl bg-[rgb(var(--indigo-dark))] p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title section-title--inverse">
          <TooltipWrapper id="fan-chart"><span>Forecast Confidence Fan Chart</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle section-subtitle--inverse">Baseline forecast with upper and lower confidence bands</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.15)" />
          <XAxis dataKey="period" stroke="rgba(255,255,255,0.85)" tickMargin={10} label={{ value: "Month", position: "insideBottom", offset: -18, fill: "rgba(255,255,255,0.85)" }} />
          <YAxis stroke="rgba(255,255,255,0.85)" tickMargin={8} label={{ value: "Revenue ($M)", angle: -90, position: "insideLeft", dx: -24, fill: "rgba(255,255,255,0.85)" }} />
          <Tooltip />
          <Area type="monotone" dataKey="high" name="Upper Band" stroke="#FFD231" fill="rgba(255,210,49,0.2)" />
          <Area type="monotone" dataKey="low" name="Lower Band" stroke="#54C0E8" fill="rgba(84,192,232,0.2)" />
          <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#F5A800" fill="rgba(245,168,0,0.35)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
