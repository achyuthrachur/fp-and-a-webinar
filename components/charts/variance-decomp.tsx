"use client";

import { TooltipWrapper } from "@/components/tooltips/tooltip-wrapper";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function VarianceDecomp({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-80 rounded-xl bg-white p-3 shadow-[var(--shadow-1)]">
      <div className="mb-2">
        <h3 className="section-title">
          <TooltipWrapper id="variance-decomp"><span>Variance Decomposition by Driver</span></TooltipWrapper>
        </h3>
        <p className="section-subtitle">Breakdown of variance effects across labor, freight, price, mix, and volume</p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 22, bottom: 34, left: 36 }}>
          <CartesianGrid stroke="#E0E0E0" />
          <XAxis dataKey="name" tickMargin={10} label={{ value: "Driver", position: "insideBottom", offset: -18 }} />
          <YAxis tickMargin={8} label={{ value: "Variance ($M)", angle: -90, position: "insideLeft", dx: -24 }} />
          <Tooltip />
          <Bar dataKey="value" name="Variance" fill="#05AB8C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
