# Phase 8: AI Executive Summary - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Build an AI-generated executive narrative panel that streams a two-paragraph OpenAI GPT-4o response into a 21st.dev card below the charts section. A pre-cached baseline summary displays on first page load (no API call). All other scenarios require a manual "Generate Summary" button click. React Bits handles the loading animation while awaiting the first token.

**Out of scope:** Layout polish (Phase 9), any new Redux slices or data files.

Requirements covered: AISU-01, AISU-02, AISU-03, AISU-04

</domain>

<decisions>
## Implementation Decisions

### Trigger Behavior

- **Button-only generation** — A "Generate Summary" button in the panel card header triggers the API call. No auto-regeneration on slider movement or preset change.
- **Disabled during streaming** — Button grays out while a response is in-flight; re-enables when the stream completes. No cancel/restart behavior.
- **Auto-display cached baseline on page load** — On component mount, if `activePresetId === 'baseline'`, show the cached string immediately with no API call. Button label becomes "Regenerate" once content is visible.
- **Keep previous summary when scenario changes** — When the user drags sliders or loads a non-baseline preset after a summary is visible, the old summary stays displayed with a subtle hint badge ("Scenario changed — regenerate?"). Panel does NOT go blank automatically.

### Prompt Construction

- **KPIs only payload** — The client sends the 8 computed KPI values (Net Sales, COGS, Gross Profit, EBITDA, Cash, AR, AP, Inventory) plus the active preset name (e.g., "Fuel Cost Shock"). No raw slider values or toggle states in the payload — AI narrativizes outcomes, not controls.
- **Two-paragraph format** — Para 1: current period performance summary (key KPI movements). Para 2: forward-looking close risk observations (what risks should finance leaders watch).
- **Crowe FP&A analyst persona** — System prompt: "You are a senior FP&A analyst at Crowe LLP. Write a concise two-paragraph executive summary for a CFO reviewing the month-end close. First paragraph: current period performance. Second paragraph: forward-looking close risks."

### Pre-cache Mechanism

- **Hardcoded string in `src/lib/aiSummaryCache.ts`** — Exports `BASELINE_SUMMARY: string`. Zero runtime overhead, version-controlled, no file I/O needed.
- **Cache gate: `activePresetId === 'baseline'`** — Client reads from Redux state. If baseline, component initializes with `BASELINE_SUMMARY` on mount. If non-baseline, panel starts empty waiting for Generate click.
- **Hand-crafted by Claude during planning** — The planner writes a realistic 2-paragraph CFO memo using the known baseline KPI values from the data files. Committed to source. Does not need the OpenAI API at build time.

### Panel Visual Design

- **Placement: below ChartsSection, full-width card** — The slot `<div id="slot-ai-summary" />` is already in `DashboardApp.tsx`. Replace it with `<AiSummarySection />` after `<ChartsSection />`. Natural reading flow: KPIs → Bridge → Charts → AI synthesis.
- **Card header** — Left: "AI Executive Summary" label + Iconsax document/chart icon. Right: "Generate Summary" / "Regenerate" button (amber `var(--accent)` color, same style as other action buttons).
- **Streaming text appearance** — Plain progressive text with a blinking `|` cursor at the insertion point. Cursor disappears when the stream completes. Two paragraph blocks with standard line spacing.
- **Loading state (before first token)** — React Bits animated loading component fills the card body area. Disappears the moment first token arrives and text begins rendering.

### Claude's Discretion

- Exact React Bits component for loading animation (inspect SSR compatibility — use dynamic import with `{ ssr: false }` if needed, consistent with Phase 1 icon pattern)
- Exact 21st.dev component for the panel card, or fallback to a styled `<div>` if SSR incompatible
- Exact CSS for the blinking cursor animation (can reuse existing keyframe patterns from `globals.css`)
- Whether the "Scenario changed" hint badge is a small amber pill or inline italic text
- API route error handling (network failure → show error message in panel body, button re-enables)
- `export const runtime = 'nodejs'` on the route handler (confirmed required for OpenAI streaming on Vercel — STATE.md blocker)

</decisions>

<specifics>
## Specific Ideas

- The cached baseline summary should read like a real CFO deliverable — credible enough that an FP&A professional in the webinar audience nods along. Reference the $9.2M Net Sales, the gross margin, and the days-to-close metric from the data files.
- The "Scenario changed — regenerate?" badge is the presenter's cue to click Generate after loading the "Fuel Cost Shock" preset. Keep it understated — a small amber pill, not a warning banner.
- The blinking cursor during streaming is a visual anchor for the webinar audience — it shows the AI is "thinking" in real time. Do not suppress it even if tokens arrive quickly.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/components/DashboardApp.tsx` — `<div id="slot-ai-summary" />` already reserves the integration point after `<ChartsSection />`; replace with `<AiSummarySection />`
- `src/store/kpiSelectors.ts` — `selectNetSales`, `selectCogs`, `selectGrossProfit`, `selectEbitda` provide the 8 KPI values for the prompt payload; use `useSelector` in `AiSummarySection`
- `src/store/scenarioSlice.ts` — `state.scenario.activePresetId` is the cache gate field; `useSelector(state => state.scenario.activePresetId)` gives the current preset
- `src/lib/formatters.ts` — `formatCurrency()` for KPI values sent in the prompt (readable numbers for the AI system prompt)
- `src/components/ui/icons.tsx` — Iconsax wrapper for the panel header icon

### Established Patterns

- **No `'use client'`** — `AiSummarySection` renders inside `DashboardApp.tsx` client boundary; no additional directive needed
- **`useSelector` from `react-redux`** — for reading KPI values and `activePresetId`
- **Dynamic import with `{ ssr: false }`** — required for any React Bits component that uses browser APIs (established in Phase 1 icon pattern); apply same treatment here
- **CSS variables for colors** — `var(--accent)`, `var(--card)`, `var(--foreground)`, `var(--border)` — no hardcoded hex except SVG fills
- **Hardcoded hex only in SVG** — not applicable here (no SVG fills in this panel)

### Integration Points

- `DashboardApp.tsx` line ~78 — replace `<div id="slot-ai-summary" />` with `{seedData && <AiSummarySection />}`
- New files needed:
  - `src/app/api/enhance-summary/route.ts` — POST route with `export const runtime = 'nodejs'`; receives `{ kpis, presetName }`, streams OpenAI GPT-4o response
  - `src/lib/aiSummaryCache.ts` — exports `BASELINE_SUMMARY` string constant
  - `src/components/dashboard/AiSummarySection/AiSummarySection.tsx` — the panel component
- `OPENAI_API_KEY` already in `.env.local` (Phase 2 requirement FOND-05)

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-ai-executive-summary*
*Context gathered: 2026-03-05*
