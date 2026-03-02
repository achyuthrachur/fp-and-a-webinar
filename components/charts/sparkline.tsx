"use client";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export function Sparkline({ values }: { values: number[] }) {
  const data = values.map((value, i) => ({ i, value }));
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#011E41" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
