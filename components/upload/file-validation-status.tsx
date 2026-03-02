"use client";

import type { UploadResult } from "@/lib/types";

export function FileValidationStatus({ result }: { result: UploadResult }) {
  return (
    <div className="rounded-lg border border-[rgb(var(--border))] p-2 text-xs">
      <p className={result.success ? "text-emerald-700" : "text-rose-700"}>{result.success ? "Validation passed" : "Validation failed; fallback loaded"}</p>
      {result.issues.slice(0, 4).map((issue, i) => (
        <p key={i} className="text-[rgb(var(--text-soft))]">{issue.family}: {issue.message}</p>
      ))}
    </div>
  );
}
