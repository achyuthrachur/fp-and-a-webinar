# Phase 12: Scene Storytelling and AI Formats - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add scene context to every tab (SceneNarrative banner + callout badges) and give the AI Summary tab audience/focus controls that change GPT-4o's tone and emphasis. All five tabs gain a narrative header card. The AI Summary tab gains two dropdowns.

Requirements: STORY-01, STORY-02, AIFMT-01, AIFMT-02

</domain>

<decisions>
## Implementation Decisions

### SceneNarrative Placement

- **Position:** Full-width banner card at the very top of each tab content, BEFORE any SectionHeader or section content
- **Layout:** Tab name + callout badges in the top row (space-between); AI-generated narrative text below in italic muted font
- **Callout badges placement:** Float in the top-right of the same banner card alongside the tab name — 1-2 badges per tab, horizontal row
- **Visual style:** Indigo wash background (`#f0f2f8` / `var(--section-warm)`), 3px amber left border (`var(--accent)`), border-radius 12px, consistent with the existing explain panel and SectionHeader amber-border treatment

### Callout Data Logic

- **Reactivity:** Dynamic threshold checks — each callout reads a live Redux selector value and compares it to a threshold rule. Color and one-line label update in real time as sliders move.
- **Status colors:**
  - Good = Crowe Teal (`#05AB8C` / `var(--color-success)`)
  - Watch = Crowe Amber (`#F5A800` / `var(--accent)`)
  - Concern = Crowe Coral (`#E5376B` / `var(--color-error)`)
- **Rule file:** `src/lib/calloutRules.ts` — exported array of rule objects with shape:
  ```ts
  { tab: TabId; metric: string; goodThreshold: number; watchThreshold: number;
    labels: { good: string; watch: string; concern: string }; }
  ```
- **Metric access:** Each rule's `metric` key maps to an existing Redux selector (e.g., `'ebitdaMargin'` → `selectEbitda / selectNetSales`, `'ar90Ratio'` → seedData prop, `'closeProgress'` → computed from closeStages)

### Scene Narrative Content (Locked)

All five tab narrative texts are locked below. These are pre-written baseline narratives. They are replaced by AI-generated text when a preset is selected (see generation model below).

**Overview:**
"Summit Logistics Group's January close is tracking ahead of the prior month, with net sales reaching $9.2M and gross margin holding near target. KPI cards update in real time as scenario controls change — the Margin Bridge below shows how each lever flows through to adjusted EBITDA."

**Close Tracker:**
"Month-end close is progressing through six stages with mixed health signals across the team. Revenue recognition and Financial Statement Package are on the critical path — delays here compress the reporting timeline. RAG indicators are computed live from journal entry completion counts in the GL data."

**Charts:**
"The Pipeline to Invoiced funnel shows $4.8M in Qualified opportunities converting through to invoiced revenue. AR Aging flags 10.9% of receivables in the 90-plus-day bucket — a key collection risk heading into February. The 13-week cash flow separates actuals from the forward forecast."

**AI Summary:**
"The narrative below synthesizes current scenario conditions into an executive-ready briefing. Use the Audience and Focus dropdowns to tailor tone and emphasis for your intended reader — then click Regenerate to produce a fresh analysis. On first load the baseline summary is served from cache for instant display."

**Scenario:**
"Scenario controls let you model alternative close conditions in real time. Adjust revenue growth, margin assumptions, and operational factors — KPIs and the Margin Bridge update immediately. Use the preset selector to jump to named scenarios, or reset to the baseline with one click."

### Scene Narrative Generation Model

- **Trigger:** API call fires when user selects a named preset from the dropdown (NOT on individual slider drags — too expensive)
- **API pattern:** Per-tab API call — new route `/api/scene-narrative` that accepts `{ kpis, presetName, tabId }` and returns narrative text for that specific tab
- **Caching:** Cached by `presetId + tabId` — switching back to a previously generated preset/tab combination does not re-call the API
- **Initial state:** Locked baseline texts (above) serve as the default until a preset is explicitly selected. No API call on page load for scene narratives.
- **Stale state:** When a preset changes, all tab narratives that have been AI-generated are marked stale. The next time the user visits a tab with a stale narrative, it auto-regenerates.

### AI Dropdowns Layout (AIFMT-01, AIFMT-02)

- **Position:** Inline control row between the SectionHeader and the narrative text in the AI Summary tab
- **Layout:** `Audience: [dropdown]   Focus: [dropdown]   [Regenerate]` — all in one horizontal row, left-aligned labels, right-side button
- **Dropdown component:** Reuse existing shadcn `Select` component (already in the project from Phase 10)
- **Stale behavior:** Changing either dropdown sets `isStale = true` — same pattern as scenario drift detection in the existing `AiSummarySection`. Shows the "Regenerate to update" indicator. Does NOT auto-trigger a new API call.

### AI Dropdown Prompt Engineering

**Audience dropdown — changes the system prompt persona:**

| Audience | System prompt modifier |
|----------|----------------------|
| CFO | "...write in a strategic, bottom-line-first tone. CFOs want: risk headline, financial impact, recommended actions." |
| Board of Directors | "...write with a governance lens. Board members want: risk appetite, fiduciary context, and strategic implications." |
| Operations Team | "...write with operational detail. Ops teams want: what's late, who owns it, what needs to happen next." |
| External Stakeholders | "...write in accessible, non-technical language. Stakeholders want: plain English summary, no jargon, clear outcomes." |
| Internal FP&A | "...write for a technical FP&A audience. Include formula-level context, variance drivers, and close process flags." |

**Focus dropdown — appends to user prompt:**

| Focus | User prompt addition |
|-------|---------------------|
| Full Dashboard Overview | (no additional instruction — existing prompt covers all metrics) |
| Revenue & Profitability | "Emphasize net sales, gross margin, and EBITDA. Minimize discussion of cash, AR, and close operations." |
| Cash & Working Capital | "Focus on cash position, AR aging risk, and AP exposure. Minimize discussion of revenue and margin commentary." |
| Close Efficiency | "Focus on month-end close progress, journal entry completion, and days-to-close metric. Minimize P&L commentary." |
| Scenario Impact | "Focus on how the active scenario differs from baseline. Highlight which levers drove the biggest KPI changes." |

**API payload extension:** The existing `POST /api/enhance-summary` adds `{ audience, focus }` to the request body alongside the existing `{ kpis, presetName }`. The route handler selects the system prompt modifier and user prompt addition based on these values.

### Claude's Discretion

- Exact threshold values for each callout rule in `calloutRules.ts` (use FP&A-appropriate values consistent with the data: ar90Ratio threshold ~0.10, ebitda margin warning ~0.14, close progress warning ~60%)
- Whether `SceneNarrative` is a standalone component file or co-located with each tab
- Exact border-radius, padding, and spacing of the banner card (consistent with existing card patterns)
- The `scene-narrative` route's system prompt base text (separate from the AI Summary system prompt — scene narratives are shorter, 2-3 sentences only, and tab-scoped)
- Loading state for scene narrative while API call is in progress (suggest a single pulsing line or skeleton text, simpler than InfinityLoader)

</decisions>

<specifics>
## Specific Ideas

- The SceneNarrative banner should feel like a "scene card" — the presenter looks at it before starting to talk about that tab. Think of it as speaker notes made visual.
- The callout badges in the top-right of the banner are the "at a glance" version of the narrative — color + one number + one label. These are the things the audience notices before the presenter starts talking.
- For the AI-generated scene narratives: these are tab-scoped (2-3 sentences about what this tab shows) vs. the AI Summary's full 2-paragraph executive narrative. The prompts are different and shorter.
- Word doc export was mentioned — captured in Phase 13 deferred ideas (see below).

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/components/DashboardApp.tsx` — tab content switch is the integration point; SceneNarrative component added at the top of each `activeTab === 'xxx'` block
- `src/components/dashboard/AiSummarySection/AiSummarySection.tsx` — extend with Audience + Focus dropdowns row + updated stale detection; `controlsMatch` pattern reuses for dropdown change detection
- `src/app/api/enhance-summary/route.ts` — extend to accept `{ audience, focus }` params; add system prompt modifier selection based on audience; append focus instruction to user prompt
- `src/components/ui/Select.tsx` (shadcn copy-paste) — already in project from Phase 10; use for both Audience and Focus dropdowns
- `src/lib/aiSummaryCache.ts` — existing `BASELINE_SUMMARY` constant; new scene narrative cache follows same pattern but keyed by `presetId + tabId`
- `src/store/kpiSelectors.ts` — selectors for EBITDA, Net Sales, Gross Profit etc. already exist; callout rules reference these selector names

### Established Patterns

- **Stale detection via `controlsMatch()`** — in `AiSummarySection.tsx`; apply same pattern for audience/focus dropdown changes
- **`next/dynamic` with `ssr: false`** — only needed for browser-API components; SceneNarrative is pure JSX, no dynamic needed
- **CSS variables for all colors** — `var(--accent)` amber, `var(--color-success)`, `var(--color-error)`, `var(--card)`, `var(--foreground)`
- **No `'use client'` in dashboard components** — they run inside DashboardApp client boundary
- **shadcn `Select` copy-paste pattern** — established in Phase 10 for the preset selector dropdown

### Integration Points

- `DashboardApp.tsx` — add `<SceneNarrative tabId={activeTab} ... />` at top of each tab content block (5 additions, one per tab)
- `AiSummarySection/AiSummarySection.tsx` — add Audience + Focus state, dropdown row UI, extend `isStale` detection to include dropdown changes, extend POST payload
- `src/app/api/enhance-summary/route.ts` — add `audience` and `focus` params to destructured request body; inject system prompt modifier + user prompt addition
- `src/lib/calloutRules.ts` — new file; export `CALLOUT_RULES` array for all 5 tabs
- `src/lib/scenarioNarrativeCache.ts` — new file; export `Map<string, string>` cache keyed by `presetId:tabId`

</code_context>

<deferred>
## Deferred Ideas

- **Word doc export of scene narratives** — user mentioned generating one narrative at a time and exporting to a formatted Word doc. This belongs in Phase 13 alongside the PDF export requirement (RPT-04). Note for Phase 13: consider `.docx` output using a library like `docx` or `officegen`, or a print-formatted HTML-to-PDF/Word approach.

</deferred>

---

*Phase: 12-scene-storytelling-and-ai-formats*
*Context gathered: 2026-03-06*
