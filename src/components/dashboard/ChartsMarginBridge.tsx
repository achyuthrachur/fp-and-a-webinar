"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ChartsMarginBridge({ data }: { data: { driver: string; impact: number }[] }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_30px_60px_-45px_var(--shadow)]">
      <h3 className="mb-2 text-lg font-semibold">Margin Bridge</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="driver" tick={{ fill: "var(--muted-color)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted-color)", fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="impact" fill="#F5A800" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
