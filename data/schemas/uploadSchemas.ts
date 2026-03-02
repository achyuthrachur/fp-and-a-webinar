import { z } from "zod";

const periodRegex = /^\d{4}-\d{2}$/;

export const uploadSchemas = {
  gl_trial_balance: z.object({
    period: z.string().regex(periodRegex),
    account: z.string(),
    location_id: z.string(),
    amount_actual: z.coerce.number(),
    amount_budget: z.coerce.number(),
    amount_forecast: z.coerce.number(),
  }),
  ap_aging: z.object({
    vendor_id: z.string(),
    period: z.string().regex(periodRegex),
    bucket_0_30: z.coerce.number(),
    bucket_31_60: z.coerce.number(),
    bucket_61_90: z.coerce.number(),
    bucket_90_plus: z.coerce.number(),
  }),
  ar_aging: z.object({
    customer_id: z.string(),
    period: z.string().regex(periodRegex),
    bucket_0_30: z.coerce.number(),
    bucket_31_60: z.coerce.number(),
    bucket_61_90: z.coerce.number(),
    bucket_90_plus: z.coerce.number(),
    collections: z.coerce.number(),
  }),
  sales_pipeline: z.object({
    opportunity_id: z.string(),
    stage: z.string(),
    expected_close_date: z.string(),
    amount: z.coerce.number(),
    win_prob: z.coerce.number(),
  }),
  inventory_snapshot: z.object({
    period: z.string().regex(periodRegex),
    location_id: z.string(),
    on_hand_value: z.coerce.number(),
    turns: z.coerce.number(),
    shrink_pct: z.coerce.number(),
    obsolescence_reserve: z.coerce.number(),
  }),
  close_calendar: z.object({
    task_id: z.string(),
    period: z.string().regex(periodRegex),
    owner: z.string(),
    due_date: z.string(),
    completed_at: z.string(),
    status: z.string(),
  }),
  journal_entries: z.object({
    je_id: z.string(),
    period: z.string().regex(periodRegex),
    posted_date: z.string(),
    entry_type: z.string(),
    approver: z.string(),
    late_flag: z.union([z.literal("true"), z.literal("false"), z.boolean()]),
  }),
  workforce_cost: z.object({
    period: z.string().regex(periodRegex),
    department: z.string(),
    base_pay: z.coerce.number(),
    overtime: z.coerce.number(),
    contractor_spend: z.coerce.number(),
  }),
};

export const requiredColumns = {
  gl_trial_balance: ["period", "account", "location_id", "amount_actual", "amount_budget", "amount_forecast"],
  ap_aging: ["vendor_id", "period", "bucket_0_30", "bucket_31_60", "bucket_61_90", "bucket_90_plus"],
  ar_aging: ["customer_id", "period", "bucket_0_30", "bucket_31_60", "bucket_61_90", "bucket_90_plus", "collections"],
  sales_pipeline: ["opportunity_id", "stage", "expected_close_date", "amount", "win_prob"],
  inventory_snapshot: ["period", "location_id", "on_hand_value", "turns", "shrink_pct", "obsolescence_reserve"],
  close_calendar: ["task_id", "period", "owner", "due_date", "completed_at", "status"],
  journal_entries: ["je_id", "period", "posted_date", "entry_type", "approver", "late_flag"],
  workforce_cost: ["period", "department", "base_pay", "overtime", "contractor_spend"],
} as const;
