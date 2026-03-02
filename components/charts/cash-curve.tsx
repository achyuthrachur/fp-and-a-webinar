"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CashCurve({ data }: { data: { week: string; endingCash: number }[] }) {
  return (
    <div className="h-80 rounded-xl bg-[rgb(var(--indigo-dark))] p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title section-title--inverse">
          <TooltipWrapper id="cash-curve"><span>13-Week Ending Cash Curve</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle section-subtitle--inverse">Projected liquidity trajectory with weekly ending balance</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.15)" />
          <XAxis dataKey="week" stroke="rgba(255,255,255,0.85)" tickMargin={10} label={{ value: "Week", position: "insideBottom", offset: -18, fill: "rgba(255,255,255,0.85)" }} />
          <YAxis stroke="rgba(255,255,255,0.85)" tickMargin={8} label={{ value: "Ending Cash ($M)", angle: -90, position: "insideLeft", dx: -24, fill: "rgba(255,255,255,0.85)" }} />
          <Tooltip />
          <Area dataKey="endingCash" name="Ending Cash" stroke="#F5A800" fill="rgba(245,168,0,0.35)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
