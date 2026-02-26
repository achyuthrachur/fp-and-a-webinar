"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ChartsPipeline({ data }: { data: { label: string; value: number }[] }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_30px_60px_-45px_var(--shadow)]">
      <h3 className="mb-2 text-lg font-semibold">Revenue: Pipeline to Invoiced</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "var(--muted-color)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted-color)", fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#05AB8C" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
