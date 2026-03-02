# Close Risk Brief AI Template

Use this as a standalone template to generate an executive summary when the dashboard template selection is `Close Risk Brief`.

## 1) Input Data Contract
Provide the AI model a JSON payload in this shape:

```json
{
  "template": "Close Risk Brief",
  "period": "YYYY-MM",
  "scenario": "Base|Stress|Upside",
  "entity": "NRDG",
  "close_cycle_days": 0,
  "on_time_tasks_pct": 0,
  "net_cash_usd": 0,
  "revenue_actual_usd": 0,
  "forecast_revenue_usd": 0,
  "risk_indicators": [
    {
      "name": "Close Cycle Overrun Risk",
      "status": "green|yellow|red",
      "value": 0,
      "days_to_breach": 0,
      "reason_code": "short reason"
    }
  ]
}
```

## 2) Prefilled Example (Current Seed Data)
Based on `data/static/seedProfile.json` period `2025-12`:

```json
{
  "template": "Close Risk Brief",
  "period": "2025-12",
  "scenario": "Base",
  "entity": "NRDG",
  "close_cycle_days": 9.8,
  "on_time_tasks_pct": 78.4,
  "net_cash_usd": 20800000,
  "revenue_actual_usd": 55500000,
  "forecast_revenue_usd": 56000000,
  "risk_indicators": [
    {
      "name": "Close Cycle Overrun Risk",
      "status": "red",
      "value": 9.8,
      "days_to_breach": 0,
      "reason_code": "Close cycle above 9-day red threshold"
    },
    {
      "name": "Late Journal Entry Risk",
      "status": "red",
      "value": 14.1,
      "days_to_breach": 0,
      "reason_code": "Late journals exceed 12% threshold"
    },
    {
      "name": "AR Collection Slippage",
      "status": "red",
      "value": 52.6,
      "days_to_breach": 0,
      "reason_code": "DSO above 52-day threshold"
    }
  ]
}
```

## 3) Prompt Template

### System Prompt
```text
You are an FP&A assistant. Write concise executive close-risk briefs for CFO staff.
Be factual, specific, and action-oriented. Do not invent numbers.
```

### User Prompt
```text
Generate a Close Risk Brief from the JSON input below.

Required sections:
1. Current Close Posture (max 90 words)
2. Top Risk Signals (exactly 3 bullets, include status + days to breach)
3. 5-Business-Day Management Plan (exactly 3 numbered actions with owner and expected impact)
4. Decision Needed from CFO (1 bullet)

Rules:
- Use only facts in the JSON.
- Prioritize red risks before yellow risks.
- Keep total response under 240 words.
- Use plain business language, no jargon.

JSON input:
{{close_risk_brief_json}}
```

## 4) Optional Structured Output Contract
If you need machine-readable output from the model:

```json
{
  "title": "Close Risk Brief - YYYY-MM (Scenario)",
  "current_close_posture": "string",
  "top_risk_signals": ["string", "string", "string"],
  "management_plan_5_day": [
    { "action": "string", "owner": "string", "expected_impact": "string" },
    { "action": "string", "owner": "string", "expected_impact": "string" },
    { "action": "string", "owner": "string", "expected_impact": "string" }
  ],
  "decision_needed_from_cfo": "string"
}
```

## 5) Integration Notes
- Keep this template external to dashboard rendering.
- Populate `{{close_risk_brief_json}}` from the same metrics/risk payload used by the app.
- For production, include all 8 risk indicators; this example shows top 3 for brevity.
