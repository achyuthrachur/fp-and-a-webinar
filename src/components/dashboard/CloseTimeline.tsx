import { InsightFlag } from "./InsightFlag";
import type { RiskFlag } from "@/features/model/types";

export function CloseTimeline({
  stages,
  flags,
}: {
  stages: { name: string; progress: number }[];
  flags: RiskFlag[];
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_30px_60px_-45px_var(--shadow)]">
      <h3 className="text-lg font-semibold">Close Timeline (D+0 to D+6)</h3>
      <div className="mt-4 space-y-3">
        {stages.map((stage, idx) => (
          <div key={stage.name} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm font-medium">{stage.name}</p>
                {flags[idx] ? <InsightFlag flag={flags[idx]} /> : null}
              </div>
              <div className="h-2 rounded-full bg-[var(--track)]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#003F9F] to-[#F5A800]" style={{ width: `${stage.progress}%` }} />
              </div>
            </div>
            <p className="text-xs text-[var(--muted)]">{stage.progress}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
