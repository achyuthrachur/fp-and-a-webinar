import { requiredColumns, uploadSchemas } from "@/data/schemas/uploadSchemas";
import type { UploadFamily, UploadedFile, UploadResult } from "@/lib/types";

const families: UploadFamily[] = [
  "gl_trial_balance",
  "ap_aging",
  "ar_aging",
  "sales_pipeline",
  "inventory_snapshot",
  "close_calendar",
  "journal_entries",
  "workforce_cost",
];

export function parseAndValidate(files: UploadedFile[]): UploadResult {
  const issues: UploadResult["issues"] = [];

  for (const family of families) {
    const file = files.find((f) => f.family === family);
    if (!file) {
      issues.push({ family, message: "Missing required file family" });
      continue;
    }

    const [headerLine, ...rows] = file.content.split(/\r?\n/).filter(Boolean);
    if (!headerLine) {
      issues.push({ family, message: "File is empty" });
      continue;
    }

    const headers = headerLine.split(",").map((h) => h.trim());
    const required = requiredColumns[family];
    const missing = required.filter((col) => !headers.includes(col));

    if (missing.length) {
      issues.push({ family, message: `Missing required columns: ${missing.join(", ")}` });
      continue;
    }

    const parser = uploadSchemas[family];
    for (const row of rows.slice(0, 25)) {
      const values = row.split(",");
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = (values[i] ?? "").trim();
      });
      const result = parser.safeParse(obj);
      if (!result.success) {
        issues.push({ family, message: `Schema validation failed for ${family}` });
        break;
      }
    }
  }

  return {
    success: issues.length === 0,
    issues,
    usedFallback: issues.length > 0,
  };
}
