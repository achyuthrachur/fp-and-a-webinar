"use client";

export function IngestProgress({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="rounded-lg bg-[rgb(var(--wash))] p-2 text-xs text-[rgb(var(--text-soft))]">
      Mapping files to deterministic seed profile...
    </div>
  );
}
