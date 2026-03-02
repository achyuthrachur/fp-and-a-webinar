"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AgingBars({ ar, ap }: { ar: { bucket: string; value: number }[]; ap: { bucket: string; value: number }[] }) {
  const data = ar.map((row, i) => ({ bucket: row.bucket, ar: row.value, ap: ap[i]?.value ?? 0 }));
  return (
    <div className="h-80 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="aging-bars"><span>AR and AP Aging by Bucket</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Collection quality and payable obligation profile by aging tranche</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="#E0E0E0" />
          <XAxis dataKey="bucket" tickMargin={10} label={{ value: "Aging Bucket", position: "insideBottom", offset: -18 }} />
          <YAxis tickMargin={8} label={{ value: "Balance ($M)", angle: -90, position: "insideLeft", dx: -24 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="ar" name="AR" fill="#011E41" />
          <Bar dataKey="ap" name="AP" fill="#F5A800" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
