import { currency, number } from "@/lib/format";

export function KpiRibbon({
  items,
}: {
  items: Array<{ label: string; value: string; helper?: string }>;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_25px_50px_-42px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">{item.value}</p>
          {item.helper ? <p className="mt-1 text-xs text-[var(--muted)]">{item.helper}</p> : null}
        </article>
      ))}
    </section>
  );
}

export const kpiFormatters = { currency, number };
