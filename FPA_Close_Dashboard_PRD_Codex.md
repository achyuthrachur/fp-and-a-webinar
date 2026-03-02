# FP&A Quarterly Close Command Center PRD (Codex Build Spec)

## 1) Document Metadata
- Project Name: `CloseVision - FP&A Quarterly Close Command Center`
- Version: `1.0`
- Date: `February 28, 2026`
- Audience: `CFOs, Controllers, Tax leaders, finance professionals, implementation Codex agent`
- Webinar context: `30-minute live demo for 4,000+ finance/tax professionals`
- Primary business question: **"How can I drive efficiency during month-end close without increasing risk?"**

## 2) Executive Summary
This project is a single-page, tabbed dashboard designed for a live webinar demo. It must be visually premium, operationally realistic, and fully demo-safe. The dashboard does not claim speculative automation percentages. It gives CFO and tax/accounting teams a shared command center to see close progress, risks, cash pressure, and decision levers using pre-loaded static data that appears to load from user uploads.

Core narrative from transcript inputs:
- Mid-market teams are still manual and Excel-heavy during close.
- FP&A and close are blended in smaller organizations.
- The highest value is dual-purpose: forward-looking modeling + early warning controls.
- Cash, AR collection quality, and sales pipeline conversion are major risk drivers.
- Teams need warning signals early enough to act before decisions are late.

## 3) The Company and Story
### 3.1 Company Profile
**Company name:** `NorthRiver Distribution Group (NRDG)`

**Description:**
NRDG is a Midwest-based, mid-market wholesale distribution company supplying industrial supplies, electrical components, safety products, and MRO inventory to regional manufacturers, contractors, and public-sector buyers.

**Demographics and operating profile**
- HQ: `Indianapolis, Indiana`
- Distribution centers: `Indianapolis (IN), Joliet (IL), Columbus (OH), St. Louis (MO)`
- FY2025 Revenue: `$612M`
- Gross Margin: `24.8%`
- EBITDA Margin: `9.3%`
- Employees: `1,420`
- Customers: `4,900 active B2B accounts`
- Product SKUs: `38,000`
- Avg monthly invoices: `42,000`
- Avg monthly journal entries: `1,250`
- ERP: `Microsoft Dynamics 365 (analog)`
- CRM: `Salesforce (analog)`
- HRIS: `Workday (analog)`
- WMS/TMS: `Blue Yonder + TMW (analog)`

**Close and finance team makeup**
- CFO: `1`
- Controller: `1`
- Accounting Manager: `1`
- Staff Accountants: `5`
- Senior Tax Manager: `1`
- Tax Analyst: `1`
- FP&A Manager: `1`
- FP&A Analyst: `2`
- AP Specialists: `3`
- AR Specialists: `3`
- Treasury Analyst: `1`

**Cost drivers**
- Inbound and outbound freight
- Warehouse labor overtime
- Fuel surcharge volatility
- Inventory carrying cost and shrink
- Customer returns and credits
- Contract labor during peak periods

### 3.2 Storyline for Webinar Demo
NRDG’s close process is under stress because growth outpaced process maturity. The team uses multiple spreadsheets to reconcile ERP outputs, adjust accruals, track close tasks, and interpret forecast variance. The result is recurring delays, late journal entries, and inconsistent visibility into where close risk is forming.

Close pain points to present in live narrative:
1. Reconciliation and review activities are still manual and scattered.
2. Forecast and close views are disconnected, so leadership sees backward results but limited early warning.
3. Cash and AR warning signs appear too late to respond proactively.
4. Pipeline assumptions are not consistently tied to close-quality metrics.
5. The close calendar is managed, but risk triggers are not operationalized.

Dashboard role in story:
- It does not replace judgment.
- It gives CFO/tax/finance one “command center” to monitor close posture and risk trajectory.
- It helps teams identify where intervention is needed before risk breaches.

## 4) Product Goals, Non-Goals, and Success Criteria
### 4.1 Goals
- Provide a single-page dashboard with 8 tabs and robust interactions.
- Deliver 100% demo-safe behavior with deterministic preloaded data.
- Show realistic close + FP&A insights for a mid-market distributor.
- Support executive storytelling in a 30-minute webinar.

### 4.2 Non-Goals
- No live external integrations.
- No probabilistic AI agents making autonomous accounting decisions.
- No speculative “AI will improve close by X%” claims.

### 4.3 Success Criteria
- Presenter can run complete demo without internet.
- All tabs load populated insights in <3 seconds after upload flow.
- Every visual element includes hover explanation and formula (if applicable).
- Visual polish is boardroom-grade and aligned to Crowe branding.

## 5) Demo-Safe Data Strategy
### 5.1 Upload Contract (Public Interface)
`UploadContract`
- Accepted file types: `.csv`, `.json`
- Required file families:
  - `gl_trial_balance`
  - `ap_aging`
  - `ar_aging`
  - `sales_pipeline`
  - `inventory_snapshot`
  - `close_calendar`
  - `journal_entries`
  - `workforce_cost`
- Validation:
  - Required columns present
  - Data types valid
  - Date ranges within supported timeline
  - Numeric fields parseable
- Behavior:
  - UI simulates ingest and mapping steps
  - If files pass schema checks, app maps to deterministic seeded dataset
  - If files fail, fallback profile auto-loads with warning toast

### 5.2 Tables, Sources, Relationships, and Why They Matter
| Table | Type | Source Analog | Key Fields | Joins | Why It Matters to Close |
|---|---|---|---|---|---|
| `dim_company` | Dimension | ERP master | `company_id (PK), name, fiscal_calendar` | base key | Defines legal entity and fiscal context for all close metrics. |
| `dim_location` | Dimension | ERP/WMS | `location_id (PK), company_id (FK), region, dc_type` | company/location joins | Enables region/DC-level close and cost analysis. |
| `dim_customer` | Dimension | CRM/ERP | `customer_id (PK), segment, payment_terms, risk_band` | AR/pipeline joins | Explains AR behavior and cash collection risk by customer mix. |
| `dim_product` | Dimension | ERP/PIM | `product_id (PK), family, margin_band` | GL/inventory joins | Ties margin and inventory pressure to operational categories. |
| `dim_employee` | Dimension | HRIS | `employee_id (PK), department, role, location_id` | workforce joins | Supports close staffing and overtime pressure analysis. |
| `fact_gl_monthly` | Fact | ERP GL | `period, account, location_id, amount_actual, amount_budget, amount_forecast` | company/location | Baseline P&L and variance analysis during close. |
| `fact_close_tasks` | Fact | Close mgmt tool | `task_id (PK), period, owner, due_date, completed_at, status` | employee/period | Tracks on-time close execution and cycle risk. |
| `fact_journal_entries` | Fact | ERP | `je_id (PK), period, posted_date, entry_type, approver, late_flag` | employee/period | Measures late/manual journal risk and control maturity. |
| `fact_ap_aging` | Fact | ERP AP | `vendor_id, period, bucket_0_30, bucket_31_60, bucket_61_90, bucket_90_plus` | period/location | Shows payable pressure and cash timing obligations. |
| `fact_ar_aging` | Fact | ERP AR | `customer_id, period, bucket_0_30, bucket_31_60, bucket_61_90, bucket_90_plus, collections` | customer/period | Shows collection slippage affecting cash and risk indicators. |
| `fact_sales_pipeline` | Fact | CRM | `opportunity_id, stage, expected_close_date, amount, win_prob` | customer/period | Links forward-looking revenue assumptions to close confidence. |
| `fact_inventory_snapshot` | Fact | WMS/ERP | `period, location_id, on_hand_value, turns, shrink_pct, obsolescence_reserve` | location/period | Surfaces inventory-driven margin and close adjustment pressure. |
| `fact_cashflow_13week` | Fact | Treasury model | `week_start, inflows, outflows, net_cash, ending_cash` | period/company | Provides near-term liquidity outlook and breach monitoring. |
| `fact_headcount_cost` | Fact | HRIS/payroll | `period, department, base_pay, overtime, contractor_spend` | employee/location | Explains labor variance and close resource strain. |
| `fact_risk_events` | Fact | Internal controls log | `event_id, period, indicator_name, severity, detected_at` | period | Historical trigger evidence for risk trend analytics. |
| `fact_controls_exceptions` | Fact | SOX/control workflow | `exception_id, control_id, period, status, aging_days` | period | Tracks unresolved control exceptions increasing reporting risk. |

## 6) Dashboard State and Computation Model
### 6.1 DashboardState (Public Interface)
`DashboardState`
- Global filters:
  - `entity`
  - `period`
  - `scenario`
  - `region`
  - `product_family`
  - `risk_threshold_profile`
- Active tab routing:
  - `overview`
  - `close-command-center`
  - `risk-indicators`
  - `scenario-levers`
  - `cash-working-capital`
  - `variance-drivers`
  - `data-explorer`
  - `readme-definitions`
- Derived calculation order:
  1. Load validated seed data
  2. Apply global filters
  3. Compute base KPIs
  4. Compute risk indicators and time-to-breach
  5. Apply scenario lever adjustments
  6. Render charts/cards/tooltips

## 7) ASCII Layout
```text
+--------------------------------------------------------------------------------------------------+
| CloseVision | NorthRiver Distribution Group | [Search]                      [Generate Exec Summary] |
+--------------------------------------------------------------------------------------------------+
| NAV (left)                  | Tabs: Overview | Close | Risk | Scenario | Cash | Variance | Data | ReadMe |
|----------------------------|---------------------------------------------------------------------|
| - Overview                 | KPI Cards Row (6 cards, animated deltas)                             |
| - Close Command Center     |---------------------------------------------------------------------|
| - Risk Indicators          | Primary Visual Area (fan chart / trend / waterfall / risk matrix)   |
| - Scenario Levers          |                                                                     |
| - Cash & Working Capital   |---------------------------------------------------------------------|
| - Variance & Drivers       | Secondary visuals + detail table + indicator cards                   |
| - Data Explorer            |                                                                     |
| - ReadMe & Definitions     |                                                                     |
|----------------------------|---------------------------------------------------------------------|
| Left controls panel: period, region, risk threshold, product family, scenario toggles, reset   |
+--------------------------------------------------------------------------------------------------+
```

## 8) Tabs and Content Specifications
## 8.1 Overview (default post-upload)
Purpose: Executive snapshot of financial position and close readiness.
- KPI cards: Revenue, Gross Margin %, Close Cycle Days, On-Time Tasks %, Net Cash, Risk Score
- Charts:
  - Animated fan chart for forecast confidence
  - 12-month trend line (actual vs forecast)
  - Close completion donut
- Motion:
  - 1.2-second staged card reveal
  - Delta arrows animate up/down
  - Line redraw on filter change

## 8.2 Close Command Center
Purpose: Detailed close execution visibility.
- KPI cards: Open Tasks, Overdue Tasks, Late Journals %, Reconciliation Completion %, Control Exceptions
- Gantt-style close calendar visualization
- Heatmap: task delays by owner and workstream
- Table: top blockers with aging

## 8.3 Risk Indicators
Purpose: Early-warning panel with breach countdown.
- 8 indicator cards with red-zone animation and time-to-breach
- Trend sparkline per indicator
- DEFCON-style overall risk dial

## 8.4 Scenario Levers
Purpose: CFO “what-if” decision controls with transparent assumptions.
- 6 levers/toggles:
  - Revenue conversion rate adjustment
  - AR collection speed days +/-
  - Freight cost inflation %
  - Overtime reduction %
  - Inventory shrink change
  - Hiring freeze toggle
- Instant recast of cash flow, close risk score, and margin outlook

## 8.5 Cash and Working Capital
Purpose: Liquidity and operating cash stress visibility.
- 13-week cash flow curve
- AR/AP aging stacked bars
- DSO, DPO, CCC cards
- Customer concentration cash risk table

## 8.6 Variance and Drivers
Purpose: Explain “what changed and why.”
- Waterfall bridge (budget -> forecast -> actual)
- Variance decomposition by labor/freight/price/mix/volume
- Journal adjustment impact chart

## 8.7 Data Explorer
Purpose: Demo upload transparency and trust.
- Dropdown to select any uploaded table
- Data grid preview with row counts and data quality badges
- Schema inspector panel

## 8.8 ReadMe and Definitions
Purpose: Built-in guide for non-finance attendees.
- Business glossary
- Metric definitions and formulas
- Data lineage map
- Scenario lever guidance and caveats

## 9) RiskIndicatorSpec (Public Interface)
`RiskIndicatorSpec` includes `name`, `green/yellow/red thresholds`, `breach_formula`, `time_to_breach_logic`, `severity_motion`.

Indicators:
1. `Close Cycle Overrun Risk`
- Thresholds: Green <=7.5 days, Yellow 7.6-9.0, Red >9.0
- Motion: Red card pulses every 2.5s
2. `Late Journal Entry Risk`
- Thresholds: Green <=8%, Yellow 8.1-12%, Red >12%
3. `AR Collection Slippage`
- Thresholds: Green <=45 DSO, Yellow 46-52, Red >52
4. `Cash Runway Compression`
- Thresholds: Green >=10 weeks, Yellow 7-9.9, Red <7
5. `Control Exception Aging`
- Thresholds: Green <=12 days avg, Yellow 12.1-18, Red >18
6. `Forecast Bias Escalation`
- Thresholds: Green <=3%, Yellow 3.1-5%, Red >5%
7. `Inventory Shrink Pressure`
- Thresholds: Green <=0.8%, Yellow 0.81-1.2%, Red >1.2%
8. `Pipeline Conversion Gap`
- Thresholds: Green <=6% miss, Yellow 6.1-10%, Red >10%

Time-to-breach:
- Linear projection from last 3 periods slope
- `days_to_breach = (threshold - current_value) / daily_change_rate`

## 10) Metric Definitions and Formulas
1. **Close Cycle Time (days)**
- Formula: `max(task.completed_at) - min(period_start_date)`
- Source: `fact_close_tasks`
- Used in: Overview, Close Command Center

2. **On-Time Task Completion %**
- Formula: `(count(tasks completed_at <= due_date) / count(total tasks)) * 100`
- Source: `fact_close_tasks`

3. **Late Journal Ratio %**
- Formula: `(count(journal where late_flag=true) / count(total journals)) * 100`
- Source: `fact_journal_entries`

4. **Forecast Bias %**
- Formula: `((forecast - actual) / actual) * 100`
- Source: `fact_gl_monthly`

5. **Revenue Variance %**
- Formula: `((actual_revenue - budget_revenue) / budget_revenue) * 100`
- Source: `fact_gl_monthly`

6. **Gross Margin %**
- Formula: `((revenue - COGS) / revenue) * 100`
- Source: `fact_gl_monthly`

7. **DSO (Days Sales Outstanding)**
- Formula: `(ending_AR / trailing_3mo_credit_sales) * 90`
- Source: `fact_ar_aging`, `fact_gl_monthly`

8. **DPO (Days Payables Outstanding)**
- Formula: `(ending_AP / trailing_3mo_COGS) * 90`
- Source: `fact_ap_aging`, `fact_gl_monthly`

9. **CCC (Cash Conversion Cycle)**
- Formula: `DSO + DIO - DPO`
- Source: AR/AP/inventory facts

10. **DIO (Days Inventory Outstanding)**
- Formula: `(avg_inventory / trailing_3mo_COGS) * 90`
- Source: `fact_inventory_snapshot`, `fact_gl_monthly`

11. **Control Exception Rate %**
- Formula: `(open_exceptions / total_controls_tested) * 100`
- Source: `fact_controls_exceptions`

12. **Risk Composite Score (0-100)**
- Formula: `weighted_sum(normalized_indicator_scores)`
- Weights: close 20, cash 20, AR 15, journals 10, controls 15, forecast 10, pipeline 10
- Source: risk + operational facts

13. **Pipeline Conversion %**
- Formula: `(won_pipeline_value / total_pipeline_due_period) * 100`
- Source: `fact_sales_pipeline`

14. **Overtime Cost Variance %**
- Formula: `((actual_overtime - baseline_overtime) / baseline_overtime) * 100`
- Source: `fact_headcount_cost`

15. **Inventory Shrink %**
- Formula: `(shrink_value / gross_inventory_value) * 100`
- Source: `fact_inventory_snapshot`

## 11) Tooltip and Hover Library (No Placeholders)
### 11.1 KPI Cards
- **Revenue**: "Total recognized sales for the selected period. This shows the top-line performance used to evaluate demand strength and forecasting accuracy. Formula: Sum of revenue accounts in the GL."
- **Gross Margin %**: "Portion of revenue retained after direct product costs. Higher margin supports cash resilience during close. Formula: (Revenue - COGS) / Revenue."
- **Close Cycle Days**: "Total elapsed days to complete month-end close from period start through final completion. Lower values typically indicate stronger process discipline."
- **On-Time Tasks %**: "Share of close tasks finished by assigned due dates. This is a direct indicator of close execution reliability."
- **Net Cash**: "Projected period-end cash after inflows and outflows. Used to evaluate liquidity pressure before final reporting."
- **Risk Score**: "Composite early-warning score combining close, cash, AR, control, and forecast risks. Higher scores mean higher intervention urgency."

### 11.2 Risk Indicators
- **Close Cycle Overrun Risk**: "Estimates whether close duration will exceed policy tolerance based on current completion pace and backlog."
- **Late Journal Entry Risk**: "Measures how many journals are posted after the expected cut-off window, increasing reporting and control risk."
- **AR Collection Slippage**: "Tracks deterioration in customer collections and DSO movement that may reduce short-term cash availability."
- **Cash Runway Compression**: "Projects the number of weeks before cash reaches minimum operating threshold using 13-week cash flow trends."
- **Control Exception Aging**: "Shows how long unresolved control exceptions remain open. Older exceptions elevate audit and reporting risk."
- **Forecast Bias Escalation**: "Identifies growing mismatch between forecast and actual outcomes, signaling unreliable planning assumptions."
- **Inventory Shrink Pressure**: "Monitors shrink and obsolescence levels that can create late adjustments and margin volatility."
- **Pipeline Conversion Gap**: "Compares expected pipeline conversion to realized outcomes; large gaps pressure forecast credibility and cash planning."

### 11.3 Scenario Levers
- **Revenue Conversion Lever**: "Adjusts expected win-to-revenue conversion. Use this to test downside or upside demand scenarios against close and cash outcomes."
- **Collection Speed Lever**: "Shifts assumed customer payment behavior by days. Faster collections strengthen cash, slower collections raise liquidity risk."
- **Freight Inflation Lever**: "Applies cost pressure to logistics spend assumptions. Useful for evaluating margin sensitivity to transportation volatility."
- **Overtime Reduction Lever**: "Models reductions in overtime spending to test close capacity tradeoffs and labor cost impacts."
- **Inventory Shrink Lever**: "Adjusts shrink assumptions to show sensitivity of gross margin and reserve requirements."
- **Hiring Freeze Toggle**: "Simulates paused hiring and contractor backfill effects on labor costs and close throughput risk."

### 11.4 Charts and Tables
- **Fan Chart Tooltip**: "This chart shows the baseline forecast and confidence bands. Wider bands indicate higher uncertainty in projected outcomes."
- **Waterfall Tooltip**: "Explains movement from budget to forecast to actual, isolating major financial drivers by category."
- **Close Heatmap Tooltip**: "Highlights where close tasks are delayed by workstream and owner so interventions can be prioritized."
- **AR/AP Aging Tooltip**: "Shows receivable and payable balances by aging bucket to assess collection quality and payment obligations."
- **13-Week Cash Curve Tooltip**: "Displays projected weekly cash trajectory to identify potential shortfalls before period-end decisions are locked."
- **Data Grid Tooltip**: "Displays uploaded table records and schema checks to confirm source coverage and data quality."

## 12) Visual System and Motion Spec (Crowe-aligned)
### 12.1 Design file emphasis summary
`DESIGN-NEW.md` emphasizes: warm enterprise premium look, soft surfaces, no harsh lines, Indigo/Amber dominance, restrained purposeful motion, dark indigo data canvases with white chart labels, and professional hierarchy.

### 12.2 Required UI directives
- Font: `Helvetica Now` with fallback `Helvetica Neue, Helvetica, Arial, system-ui, sans-serif`
- Primary colors:
  - Indigo Dark `#011E41`
  - Amber Core `#F5A800`
- Neutrals: `#FFFFFF, #333333, #4F4F4F, #828282, #BDBDBD, #E0E0E0`
- Cards: rounded `12px`, border-light or borderless, indigo-tinted shadows
- No full-page gradients; gradients only in charts/data visuals

### 12.3 Motion
- Micro interactions: `90-150ms`
- Standard transitions: `200-280ms`
- Complex transitions: `320-450ms`
- Reduced motion mode must disable pulse, heavy transform, and autoplay sequences

### 12.4 Anti-AI-slop constraints
- No default template composition
- No decorative-only animations
- No harsh border grids
- No low-effort generic copy
- Every component must support business intent

## 13) Tech Stack and File Structure
### 13.1 Build stack
- Framework: `Next.js 14+ (App Router) + TypeScript`
- Styling: `Tailwind CSS + CSS variables`
- Components: `shadcn/ui`
- Animation: `Framer Motion, Anime.js` 
- Charts: `Recharts, shadcn/charts`
- Validation: `Zod`
- Testing: `Vitest + React Testing Library + Playwright`

### 13.2 Proposed file tree
```text
Dashboard/
  app/
    page.tsx
    layout.tsx
  components/
    shell/
    cards/
    charts/
    tables/
    nav/
    upload/
    tooltips/
  features/
    overview/
    close-command-center/
    risk-indicators/
    scenario-levers/
    cash-working-capital/
    variance-drivers/
    data-explorer/
    readme-definitions/
  data/
    static/
      *.csv
      *.json
    schemas/
      uploadSchemas.ts
  lib/
    formulas/
      metrics.ts
      risk.ts
      scenario.ts
    state/
      dashboardStore.ts
    validation/
      parseAndValidate.ts
  content/
    tooltips/
      tooltipLibrary.ts
    readme/
      glossary.ts
  tests/
    unit/
    integration/
    e2e/
  public/
    branding/
```

## 14) Non-Functional Requirements
- Demo-safe offline execution (no API dependency for core path)
- Initial render under 2 seconds on presenter laptop
- Deterministic calculations for repeatable outcomes
- Graceful fallback dataset if upload parsing fails
- Accessibility: WCAG AA, keyboard nav, descriptive aria labels

## 15) Executive Summary Generation (Button Action)
Button: `Generate Executive Summary` (top-right banner)

Behavior:
1. Opens right drawer
2. User selects template: `CFO Brief`, `Close Risk Brief`, `Tax and Control Brief`
3. User selects period and scenario
4. Click generate -> animated progress -> 1 page detailed summary appears
5. Export options: `Copy`, `Download .md`, `Download .pdf`

Output sections:
- Current close posture
- Top 3 risks and reason codes
- Cash and working capital status
- Recommended management focus for next 5 business days

## 16) QA, Acceptance Criteria, and Test Cases
### 16.1 Acceptance criteria
- Upload flow validates and lands on Overview tab every time.
- All 8 tabs render with non-empty content.
- All KPI/risk/chart/lever/table elements have hover explanations.
- Risk thresholds trigger correct color/motion states.
- Scenario changes recalculate metrics consistently.

### 16.2 Test scenarios
1. Happy path webinar run-through (30-minute script)
2. Missing required column in upload file -> error + fallback data load
3. Risk indicator near threshold -> transitions green to yellow to red accurately
4. Scenario lever stress test -> deterministic, no chart mismatch
5. Reduced motion browser setting -> no pulse animations
6. Data integrity checks -> KPI totals reconcile to source tables
7. Cross-device check -> desktop and tablet presenter readability

## 17) Phased Build Plan (Execution Sequence for Codex)
### Phase 1: Foundation
- Scaffold Next.js app, theme tokens, shell layout, tab framework

### Phase 2: Data contracts
- Create static datasets, Zod schemas, upload parser, fallback strategy

### Phase 3: Core UI
- Build top banner, left nav, filters, KPI framework, tooltip infrastructure

### Phase 4: Overview and Close panes
- Implement charts/cards/tables and animation rules

### Phase 5: Risk and Scenario panes
- Implement risk engine, thresholds, countdowns, scenario levers

### Phase 6: Cash/Variance/Data/ReadMe panes
- Implement data explorer and glossary-driven onboarding content

### Phase 7: Executive summary workflow
- Build summary drawer, template generation, export actions

### Phase 8: QA and polish
- Automated tests, performance tuning, accessibility, webinar rehearsal checklist

## 18) Webinar Demo Runbook
1. Open app with clean cache
2. Show upload modal and select sample files
3. Trigger ingest animation
4. Land on Overview with staged KPI reveal
5. Walk close bottlenecks in Close Command Center
6. Highlight Risk Indicators and breach countdown
7. Adjust Scenario levers live and show recast
8. Show Cash and Variance driver impacts
9. Open Data Explorer to prove source transparency
10. Generate executive summary and export

## 19) Assumptions and Defaults
- Audience values realism and control-aware framing.
- Dashboard is a decision-support tool, not autonomous close automation.
- Data is synthetic but operationally plausible for U.S. mid-market distribution company.
- Single-page app with left nav + tabbed main pane is fixed architecture.
- This PRD is final handoff artifact for Codex build execution.
