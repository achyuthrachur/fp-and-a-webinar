import type { RiskFlag } from "@/features/model/types";

export function InsightFlag({ flag }: { flag: RiskFlag }) {
  const color = flag.severity === "red" ? "bg-[#E5376B]" : flag.severity === "yellow" ? "bg-[#F5A800]" : "bg-[#05AB8C]";

  return (
    <div className="group relative inline-flex">
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs text-white ${color}`}>!</span>
      <div className="pointer-events-none absolute left-7 top-0 z-10 hidden w-72 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-xl group-hover:block">
        <p className="font-semibold">{flag.title}</p>
        <p className="mt-1 text-[var(--muted)]">{flag.whatChanged}</p>
        <p className="mt-1">{flag.whyItMatters}</p>
        <p className="mt-1 font-medium">Action: {flag.suggestedAction}</p>
      </div>
    </div>
  );
}
