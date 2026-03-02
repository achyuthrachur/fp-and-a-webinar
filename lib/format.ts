export function formatValue(value: number, format: "currency" | "percent" | "days" | "number"): string {
  if (format === "currency") return `$${(value / 1_000_000).toFixed(1)}M`;
  if (format === "percent") return `${value.toFixed(1)}%`;
  if (format === "days") return `${value.toFixed(1)}d`;
  return value.toFixed(1);
}
