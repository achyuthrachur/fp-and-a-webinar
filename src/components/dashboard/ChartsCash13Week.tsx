"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ChartsCash13Week({ data }: { data: { week: string; cash: number }[] }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_30px_60px_-45px_var(--shadow)]">
      <h3 className="mb-2 text-lg font-semibold">13-Week Cash Forecast</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="week" tick={{ fill: "var(--muted-color)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted-color)", fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="cash" stroke="#003F9F" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
