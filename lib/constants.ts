import type { UploadContract } from "@/lib/types";

export const uploadContract: UploadContract = {
  acceptedFileTypes: [".csv", ".json"],
  requiredFamilies: [
    "gl_trial_balance",
    "ap_aging",
    "ar_aging",
    "sales_pipeline",
    "inventory_snapshot",
    "close_calendar",
    "journal_entries",
    "workforce_cost",
  ],
};
