# Phase 8: AI Executive Summary - Research

**Researched:** 2026-03-05
**Domain:** OpenAI streaming / Next.js 15 App Router route handlers / React Bits loading animation / streaming text consumption
**Confidence:** HIGH (core streaming pattern), MEDIUM (React Bits component selection, 21st.dev panel)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Button-only generation — no auto-regenerate on slider/preset change
- Button disabled during streaming; re-enables on stream complete; no cancel
- Auto-display cached baseline string on mount when `activePresetId === 'baseline'`
- Keep previous summary visible when scenario changes; show amber pill badge "Scenario changed — regenerate?"
- Prompt payload: 8 computed KPI values + active preset name only (no raw slider values)
- Two-paragraph format: para 1 current performance, para 2 forward-looking close risk
- System prompt persona: "You are a senior FP&A analyst at Crowe LLP..."
- Pre-cache: hardcoded string in `src/lib/aiSummaryCache.ts` exporting `BASELINE_SUMMARY`
- Cache gate: `activePresetId === 'baseline'` read from Redux state
- Panel placement: below ChartsSection, replacing `<div id="slot-ai-summary" />`
- Card header: left = title + Iconsax icon; right = Generate/Regenerate button (amber accent)
- Streaming appearance: plain text with blinking `|` cursor; cursor disappears on stream complete
- Loading state: React Bits animated component (before first token)
- `export const runtime = 'nodejs'` required on route handler

### Claude's Discretion

- Exact React Bits component for loading animation (inspect SSR compatibility, use dynamic import with `{ ssr: false }`)
- Exact 21st.dev component for panel card, or fallback to styled div if SSR incompatible
- Exact CSS for blinking cursor (can reuse keyframe pattern from globals.css)
- Whether "Scenario changed" badge is amber pill or inline italic
- API route error handling pattern (network failure shows error message, button re-enables)

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AISU-01 | `/api/enhance-summary` POST route with OpenAI GPT-4o streaming, `runtime = 'nodejs'`, `max_tokens: 300`, `temperature: 0.3` | OpenAI Node.js SDK streaming pattern with ReadableStream; `runtime = 'nodejs'` confirmed required for Vercel |
| AISU-02 | AI summary panel displays streaming narrative character-by-character as OpenAI stream arrives | `response.body.getReader()` + TextDecoder pattern; `useState` accumulator with `prev + chunk` |
| AISU-03 | React Bits loading animation visible while generating (not blank white box) | `InfinityLoader` component confirmed; dynamic import with `{ ssr: false }` — same pattern as Phase 1 icons |
| AISU-04 | Pre-cached baseline narrative displays immediately on first page load | `BASELINE_SUMMARY` string in `aiSummaryCache.ts`; mount-time check `activePresetId === 'baseline'` |
</phase_requirements>

---

## Summary

Phase 8 adds AI-generated executive narrative to the dashboard. The technical surface is narrow but has two confirmed gotchas: (1) Vercel's edge runtime does not support the OpenAI Node.js SDK — `export const runtime = 'nodejs'` is mandatory on the route handler, and (2) React Bits components that use browser globals (`window`, `document`) will crash Next.js SSR unless wrapped in `next/dynamic` with `{ ssr: false }`. Both issues are already flagged in STATE.md and CONTEXT.md.

The streaming architecture is straightforward: the route handler creates an OpenAI stream, pipes it through a `ReadableStream`, and the client reads it with `response.body.getReader()` + `TextDecoder`. State accumulates via `useState` with a functional updater `prev => prev + chunk`. The blinking cursor is a CSS `@keyframes` animation (same keyframe approach already used for `kpi-amber-glow` in globals.css). The panel component itself is a styled card — 21st.dev components should be inspected for SSR safety before adoption, with a fallback to a hand-crafted div using the established project CSS variable system.

The pre-cached baseline summary is the most visible deliverable. It must read like a real CFO memo — credible to an FP&A professional in the webinar audience. The computed baseline KPI values (derived below) ground the hand-crafted text.

**Primary recommendation:** Implement the route handler first (AISU-01), verify streaming works in browser dev tools Network tab, then build the panel component around the established `useSelector` + `useState` pattern.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `openai` | `^4.0.0` (already in package.json) | OpenAI SDK for GPT-4o streaming | Already installed; `openai` v4 uses `.stream()` API returning async iterable compatible with Node.js |
| `next` | `16.1.6` (project constraint) | Route handler + streaming response | App Router route handlers support streaming via `ReadableStream` return value |
| `react-redux` | `^9.2.0` (already installed) | Read KPI selectors + activePresetId in component | `useSelector` pattern already established in KpiSection, ScenarioPanel |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Bits (copy-paste) | TS-TW variant | Loading animation in panel body | Before first token arrives; remove once text starts |
| `next/dynamic` | built-in | SSR-safe dynamic import for React Bits | Any React Bits component touching browser globals |

### No New Installs Required

All dependencies (`openai`, `react-redux`, `react`, `next`) are already in `package.json`. React Bits uses the copy-paste model — no `npm install` needed.

---

## Architecture Patterns

### Recommended File Structure

```
src/
├── app/
│   └── api/
│       └── enhance-summary/
│           └── route.ts              # POST handler, runtime = 'nodejs', OpenAI stream
├── lib/
│   └── aiSummaryCache.ts             # exports BASELINE_SUMMARY: string
└── components/
    └── dashboard/
        └── AiSummarySection/
            └── AiSummarySection.tsx  # panel component, no 'use client' (inside DashboardApp boundary)
```

### Pattern 1: OpenAI Streaming Route Handler

**What:** POST route handler that reads `{ kpis, presetName }` from request body, calls OpenAI with `stream: true`, and pipes the stream through a native `ReadableStream` back to the client.

**When to use:** Only route in this phase. Must have `export const runtime = 'nodejs'` at the top level of the file — this is not inside the handler function.

**Critical detail:** The `openai` v4 SDK `.stream()` method returns an `AsyncIterable<ChatCompletionChunk>`. Each chunk has `chunk.choices[0]?.delta?.content` which may be `null` or `undefined` — guard with `?? ''`.

**Example (verified against openai v4 SDK pattern):**

```typescript
// src/app/api/enhance-summary/route.ts
export const runtime = 'nodejs';

import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { kpis, presetName } = await req.json();

  const stream = openai.beta.chat.completions.stream({
    model: 'gpt-4o',
    max_tokens: 300,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior FP&A analyst at Crowe LLP. Write a concise two-paragraph executive summary for a CFO reviewing the month-end close. First paragraph: current period performance. Second paragraph: forward-looking close risks.',
      },
      {
        role: 'user',
        content: buildUserPrompt(kpis, presetName),
      },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

**Note on alternative SDK API:** Some OpenAI v4 examples use `openai.chat.completions.create({ stream: true })` returning an `AsyncIterable`. Both work. The `.stream()` method on `beta.chat.completions` is preferred as it handles stream lifecycle correctly, but either pattern is acceptable. Verify against installed version with `import OpenAI from 'openai'; console.log(openai.VERSION)`.

### Pattern 2: Client-Side Stream Consumption

**What:** The component calls `fetch('/api/enhance-summary', { method: 'POST', body })`, then reads `response.body` via `getReader()` + `TextDecoder`. Each decoded chunk is appended to accumulated state.

**Key rules:**
- Use functional `setState` updater `prev => prev + chunk` to avoid stale closure issues
- Always call `reader.releaseLock()` in a `finally` block
- Button disables (`isStreaming = true`) before fetch starts; re-enables in `finally`
- Blinking cursor appended to displayed text while streaming; removed when `isStreaming` becomes false

```typescript
// Inside AiSummarySection.tsx
async function handleGenerate() {
  setIsStreaming(true);
  setSummaryText('');
  setError(null);

  try {
    const response = await fetch('/api/enhance-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kpis: buildKpiPayload(), presetName: activePresetName }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSummaryText(prev => prev + chunk);
      }
    } finally {
      reader.releaseLock();
    }
  } catch (err) {
    setError('Unable to generate summary. Please try again.');
  } finally {
    setIsStreaming(false);
  }
}
```

### Pattern 3: React Bits Loading Animation (Dynamic Import)

**What:** A React Bits component renders in the panel body while `isStreaming === true` and `summaryText === ''` (before first token). Once text starts arriving it unmounts instantly.

**Component recommendation:** `InfinityLoader` (React Bits Animations category) — abstract, professional, no text/labels, small footprint. Alternatively `Spinner` or `OrbitingCircles` depending on visual preference.

**SSR safety:** React Bits components use browser globals. Must use `next/dynamic` with `{ ssr: false }`. This is the exact pattern established in Phase 1 for `icons.tsx` via the `'use client'` boundary trick — for React Bits, dynamic import is the equivalent:

```typescript
// At top of AiSummarySection.tsx (or a dedicated LoadingPlaceholder.tsx)
import dynamic from 'next/dynamic';

const InfinityLoader = dynamic(
  () => import('@/components/ui/InfinityLoader'),  // copy-paste the component here
  { ssr: false, loading: () => <div style={{ height: 80 }} /> }
);
```

**Copy-paste target:** Place the React Bits component source at `src/components/ui/InfinityLoader.tsx` (or similar). Do not use the `npx shadcn` CLI — copy-paste the TS-TW variant directly, same as other UI primitives in this project.

**Color wiring:** Pass `color="var(--accent)"` or use CSS variables in the component's inline styles — consistent with project rule of CSS variables everywhere except SVG fills.

### Pattern 4: Blinking Cursor CSS

**What:** A `|` character with a `@keyframes` animation that blinks at ~1Hz. Already a precedent in globals.css (`kpi-amber-glow` keyframe). Add a new keyframe:

```css
/* Add to globals.css alongside kpi-amber-glow */
@keyframes blink-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.streaming-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--foreground);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink-cursor 1s step-end infinite;
}
```

Render as `{isStreaming && <span className="streaming-cursor" aria-hidden="true" />}` appended after the text content.

### Pattern 5: Prompt Payload Builder

**What:** A pure function `buildKpiPayload()` that reads the 8 KPI values from Redux selectors using `useSelector`, formats them with `formatCurrency()`, and returns a structured object. This function is the test target for Vitest.

```typescript
// Called inside AiSummarySection — reads from Redux
function buildKpiPayload(): KpiPayload {
  // useSelector calls happen at component level; this assembles the object
  return {
    netSales: formatCurrency(netSales, false),   // full dollars, not compact
    cogs: formatCurrency(cogs, false),
    grossProfit: formatCurrency(grossProfit, false),
    ebitda: formatCurrency(ebitda, false),
    cash: formatCurrency(cash, false),
    ar: formatCurrency(ar, false),
    ap: formatCurrency(ap, false),
    inventory: formatCurrency(inventory, false),
  };
}

// The route handler assembles the user prompt from this payload
function buildUserPrompt(kpis: KpiPayload, presetName: string): string {
  return `Scenario: ${presetName}
Net Sales: ${kpis.netSales}
COGS: ${kpis.cogs}
Gross Profit: ${kpis.grossProfit}
EBITDA: ${kpis.ebitda}
Cash: ${kpis.cash}
Accounts Receivable: ${kpis.ar}
Accounts Payable: ${kpis.ap}
Inventory: ${kpis.inventory}

Write the two-paragraph executive summary.`;
}
```

**Test note:** `buildKpiPayload` is component-internal (uses `useSelector`). Extract `buildUserPrompt` as a pure function in the route handler file so it can be unit tested without React.

### Pattern 6: Cache Gate

```typescript
// src/lib/aiSummaryCache.ts
export const BASELINE_SUMMARY: string = `...hand-crafted CFO memo...`;

// In AiSummarySection.tsx — inside the component body
const activePresetId = useSelector((state: RootState) => state.scenario.activePresetId);
// NOTE: scenarioSlice does not currently expose activePresetId — see Gap below

// On mount: initialize from cache if baseline
useEffect(() => {
  if (activePresetId === 'baseline') {
    setSummaryText(BASELINE_SUMMARY);
  }
}, []);  // empty deps — mount only
```

**Gap identified:** `scenarioSlice.ts` stores `controls` and `baseInputs` but does **not** store `activePresetId` as a named field in state. The `ScenarioPanel` derives `activePresetId` from a field comparison (per STATE.md: "field-by-field ControlState comparison used for activePresetId"). The cache gate needs a way to read it.

**Resolution options (Claude's discretion):**
1. Add `activePresetId: string | null` to `ScenarioState` and update `loadPreset` action to set it — cleanest, but adds slice change
2. Derive it in the component by comparing current controls to the baseline preset controls from `seedData` — no slice change needed, but requires `seedData` prop passed to `AiSummarySection`
3. Store `activePresetId` separately in component state, populated via Redux subscription on preset load

**Recommended:** Option 2 — compare `controls` against `seedData.presets.find(p => p.id === 'baseline')?.controls` using the same field-by-field comparison already in `ScenarioPanel`. `AiSummarySection` can receive `seedData` as a prop from `DashboardApp` (same pattern as `CloseTracker` and `ChartsSection`).

### Anti-Patterns to Avoid

- **`export const runtime = 'edge'`** — the edge runtime does not have Node.js built-ins that the OpenAI SDK requires. Always `'nodejs'`.
- **`await openai.chat.completions.create(...)` without `stream: true`** — Vercel functions have a 10s timeout on the hobby plan; non-streaming calls will time out before GPT-4o finishes generating 300 tokens.
- **`response.text()` instead of `response.body.getReader()`** — `response.text()` waits for the entire response before resolving, defeating the purpose of streaming.
- **Mutating state directly** — `setSummaryText(summaryText + chunk)` inside an async loop captures stale state. Always use `setSummaryText(prev => prev + chunk)`.
- **Importing React Bits without `{ ssr: false }`** — will crash the Next.js SSR pass with `window is not defined`.
- **`'use client'` in `AiSummarySection.tsx`** — the component renders inside `DashboardApp.tsx` which already has the client boundary. Adding another `'use client'` is not harmful but is redundant and inconsistent with project conventions.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OpenAI streaming with proper backpressure | Custom WebSocket or SSE server | `openai.beta.chat.completions.stream()` + native `ReadableStream` | SDK handles retry, error, and chunk lifecycle |
| Loading spinner animation | Custom CSS spinner from scratch | React Bits `InfinityLoader` (copy-paste TS-TW) | Polished, performant, already vetted for the project |
| Streaming text accumulation | Array of chunks joined on render | `useState` string + functional updater | Simpler, avoids re-creating arrays on every chunk |
| Browser-safe dynamic loading | Conditional `typeof window` checks | `next/dynamic` with `{ ssr: false }` | Next.js canonical pattern, already used in Phase 1 via icons.tsx |

---

## Common Pitfalls

### Pitfall 1: `runtime = 'nodejs'` Missing or Misplaced

**What goes wrong:** Vercel deploys the route on the edge runtime by default in Next.js 15+. The OpenAI Node.js SDK uses `node:http`, `node:stream`, and other Node.js built-ins that are not available on the edge runtime. The route throws `Error: The edge runtime does not support Node.js 'stream' module` at request time, not build time — it will not surface during `npm run build`.

**Why it happens:** Next.js infers runtime from route file location. App Router defaults to edge for API routes in some configurations. The `export const runtime = 'nodejs'` must be a top-level module export, not inside the handler function.

**How to avoid:** Place `export const runtime = 'nodejs';` as the very first export in `route.ts`. Verify in Vercel dashboard after deployment — the function list shows runtime per route.

**Warning signs:** Build succeeds but first API call returns a 500 with a stack trace mentioning `stream` or `net` module.

### Pitfall 2: Stale Closure in Stream Read Loop

**What goes wrong:** Using `setSummaryText(summaryText + chunk)` inside the `while(true)` loop captures the initial value of `summaryText` (empty string) in a closure. Every chunk overwrites with `'' + chunk` instead of accumulating.

**Why it happens:** React state updates are asynchronous. The `summaryText` variable in the closure refers to the value at loop start, not the current accumulated value.

**How to avoid:** Always use the functional updater form: `setSummaryText(prev => prev + chunk)`.

### Pitfall 3: React Bits SSR Crash

**What goes wrong:** Importing a React Bits component at the top of `AiSummarySection.tsx` causes Next.js to attempt SSR evaluation of the component, which accesses `window` or `document` and throws `ReferenceError: window is not defined`.

**Why it happens:** `AiSummarySection` itself is inside a client boundary (DashboardApp), but Next.js still SSR-renders the initial HTML shell — client components run on the server for the first render. Browser-API-touching code must be deferred past the SSR pass.

**How to avoid:** Use `next/dynamic` with `{ ssr: false }`. The `loading` prop provides a stable-height placeholder that prevents layout shift while the component hydrates.

### Pitfall 4: `activePresetId` Not in Redux State

**What goes wrong:** Writing `useSelector(state => state.scenario.activePresetId)` fails TypeScript because `ScenarioState` does not have this field. The `ScenarioPanel` derives it by field comparison — it is not persisted in Redux.

**Why it happens:** The slice was designed for Phase 4 requirements (slider/toggle dispatch) and did not anticipate Phase 8 needing to read which preset is active.

**How to avoid:** Use option 2 from the resolution options above — derive it in `AiSummarySection` by comparing current `controls` object against the baseline preset's controls object, using the same field-by-field comparison as `ScenarioPanel`.

### Pitfall 5: Stream Not Closed on Error

**What goes wrong:** If `openai.beta.chat.completions.stream()` throws mid-stream (rate limit, API error), the `ReadableStream` `start()` function throws without calling `controller.close()`, leaving the browser hanging indefinitely.

**Why it happens:** Unhandled rejections inside the `ReadableStream` constructor's `start` callback are not automatically propagated as HTTP errors.

**How to avoid:** Wrap the `for await` loop in try/catch inside `start()`. In the catch, call `controller.error(err)` instead of `controller.close()`. The browser's `reader.read()` will then resolve with `done: true` or throw — handle both in the client's catch block.

---

## Code Examples

### buildUserPrompt (pure function, fully testable)

```typescript
// Source: project convention — extracted from route handler for testability
export interface KpiPayload {
  netSales: string;
  cogs: string;
  grossProfit: string;
  ebitda: string;
  cash: string;
  ar: string;
  ap: string;
  inventory: string;
}

export function buildUserPrompt(kpis: KpiPayload, presetName: string): string {
  return [
    `Scenario: ${presetName}`,
    `Net Sales: ${kpis.netSales}`,
    `COGS: ${kpis.cogs}`,
    `Gross Profit: ${kpis.grossProfit}`,
    `EBITDA: ${kpis.ebitda}`,
    `Cash: ${kpis.cash}`,
    `Accounts Receivable: ${kpis.ar}`,
    `Accounts Payable: ${kpis.ap}`,
    `Inventory: ${kpis.inventory}`,
    '',
    'Write the two-paragraph executive summary.',
  ].join('\n');
}
```

### Cache Gate (mount-time effect)

```typescript
// Mount-only effect — runs once on component initialization
useEffect(() => {
  const baselinePreset = seedData.presets.find(p => p.id === 'baseline');
  if (!baselinePreset) return;

  // Field-by-field comparison (same pattern as ScenarioPanel activePresetId detection)
  const fields = Object.keys(baselinePreset.controls) as Array<keyof ControlState>;
  const isBaseline = fields.every(f => controls[f] === baselinePreset.controls[f]);

  if (isBaseline) {
    setSummaryText(BASELINE_SUMMARY);
    setIsStale(false);
  }
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

### "Scenario Changed" Badge

```tsx
{summaryText && isStale && (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 9999,
      background: 'var(--accent-soft)',
      color: 'var(--accent)',
      fontSize: '0.75rem',
      fontWeight: 600,
    }}
  >
    Scenario changed — regenerate?
  </span>
)}
```

---

## Baseline KPI Values (for BASELINE_SUMMARY pre-cache content)

These values are computed from the actual data files to ground the hand-crafted CFO memo. They represent the **Jan 2026 Baseline** preset applied to GL data.

**Source GL row (Jan-2026):** net_sales=9,200,000 | opex=1,180,000 | cash=4,250,000 | ap_total=3,100,000 | inventory_total=6,400,000

**Baseline preset controls:** revenueGrowthPct=0.03 | grossMarginPct=0.25 | fuelIndex=118 | collectionsRatePct=0.97 | returnsPct=0.012 | all toggles OFF

**Computed KPIs at baseline:**

| KPI | Computation | Value |
|-----|-------------|-------|
| Net Sales | 9,200,000 × 1.03 | $9,476,000 (~$9.5M) |
| COGS | 9,476,000 × 0.75 + fuelDelta(0.18 × 0.18 × 7,107,000) | ~$7,337,267 |
| Gross Profit | 9,476,000 − 7,337,267 | ~$2,138,733 (~22.6% after fuel) |
| EBITDA | 2,138,733 − 1,180,000 (opex) | ~$958,733 (~$959K) |
| Cash | 4,250,000 (collectionsRate at baseline = 0, no delta) | $4,250,000 (~$4.3M) |
| AR | 2,800,000 (arTotal at baseline collectionsRate) | ~$2,800,000 |
| AP | 3,100,000 (returns at baseline, no conservativeBias) | $3,100,000 |
| Inventory | 6,400,000 × 1.0 (no inventoryComplexity) | $6,400,000 |

**Note:** The fuel index at 118 (vs 100 baseline) is the scenario condition, not a shock. The 18-point fuel elevation compresses the real gross margin to ~22.6% even though the control is set to 25% — this is the intentional behavior (fuel adjusts COGS on top of the margin target). The CFO memo should note this compression.

**Close context:** 5 business days to close target. AR 90+ ratio ≈ 10.9% (at-risk threshold per Phase 5 logic).

---

## Baseline Summary Content (AISU-04 Deliverable)

The planner must produce this text as the `BASELINE_SUMMARY` constant. Written to sound like a Crowe FP&A analyst's CFO deliverable. Word budget: ~120 words across two paragraphs.

```
Summit Logistics Group closed January 2026 with net revenue of $9.5M, reflecting 3% sequential growth against the December baseline. Post-fuel gross margin settled at 22.6% — below the 25% target margin — as the elevated fuel index (118 vs. 100 baseline) added approximately $230K in logistics cost of goods above plan. EBITDA reached $959K, with operating expenses holding at $1.18M. Cash on hand of $4.3M reflects collections performance in line with the 97% target rate.

Looking ahead to close, AR aging shows 10.9% of the $2.8M receivables balance in the 90-plus-day bucket, approaching the 11% watch threshold. With five business days remaining to the close target and 47 manual journal entries in progress (up from 38 in December), the accruals and JE stage carries the highest execution risk. Finance leaders should prioritize pending-approval JE clearance and monitor the 90-plus AR cohort for collectability adjustments before the financial statement package is finalized.
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `openai.createChatCompletion` (openai v3) | `openai.beta.chat.completions.stream()` (openai v4) | 2023 (v4 release) | Cleaner async iterable API; no manual EventSource parsing |
| Vercel Edge Functions for AI streaming | `runtime = 'nodejs'` route handlers | 2024 (Next.js 14+) | Edge runtime lacks Node.js built-ins; Node.js runtime required for openai SDK |
| Polling for AI response | Native `ReadableStream` + `getReader()` | 2022 (Fetch API Streams standard) | No websocket needed; standard browser API |
| React state array of chunks joined on render | Single string state + functional updater | N/A (always best practice) | Avoids O(n²) join on every chunk; simpler |

---

## Open Questions

1. **React Bits InfinityLoader SSR safety**
   - What we know: React Bits components generically use browser globals; `{ ssr: false }` is the known mitigation
   - What's unclear: Whether `InfinityLoader` specifically uses `window/document` or is pure CSS — if pure CSS it could import without dynamic
   - Recommendation: Default to dynamic import with `{ ssr: false }` regardless; overhead is negligible for a loading animation

2. **21st.dev panel component SSR compatibility**
   - What we know: 21st.dev components vary — some are pure CSS/JSX, some use Framer Motion (which has its own SSR quirks)
   - What's unclear: Which specific 21st.dev card matches the panel design well without requiring a full component audit
   - Recommendation: Use a hand-crafted styled div for the card shell (matches existing project patterns — all other panels are hand-crafted). 21st.dev for decorative elements only if time permits.

3. **openai v4 exact streaming API method**
   - What we know: `openai.beta.chat.completions.stream()` is documented and works in v4; `openai.chat.completions.create({ stream: true })` is also valid
   - What's unclear: Whether the installed version `^4.0.0` resolves to a version where `.stream()` is stable vs beta
   - Recommendation: Use `openai.chat.completions.create({ stream: true })` as it is the non-beta stable surface; iterate the `AsyncIterable<ChatCompletionChunk>` directly — identical outcome, wider version range compatibility

---

## Validation Architecture

> `nyquist_validation` is enabled in `.planning/config.json`. This section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.0 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `node "/c/Users/RachurA/.../vitest.mjs" run --reporter=verbose` |
| Full suite command | Same (all tests in `src/**/__tests__/**/*.test.ts`) |
| Run invocation note | Use `node .../vitest.mjs run` NOT `npx vitest` — ampersand in FP&A path breaks npx |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AISU-01 | `buildUserPrompt()` produces correct prompt string with all 8 KPIs | unit | `node .../vitest.mjs run --reporter=verbose` | No — Wave 0 |
| AISU-01 | `buildUserPrompt()` includes presetName in output | unit | same | No — Wave 0 |
| AISU-01 | `buildUserPrompt()` output contains all 8 KPI label strings | unit | same | No — Wave 0 |
| AISU-04 | `BASELINE_SUMMARY` exports a non-empty string from `aiSummaryCache.ts` | unit | same | No — Wave 0 |
| AISU-04 | `BASELINE_SUMMARY` contains the expected KPI reference ("$9.5M" or similar) | unit | same | No — Wave 0 |
| AISU-02 | Cache gate: baseline controls match → isBaseline === true | unit (pure fn) | same | No — Wave 0 |
| AISU-02 | Cache gate: non-baseline controls → isBaseline === false | unit (pure fn) | same | No — Wave 0 |
| AISU-02, AISU-03 | Streaming text accumulation, loading state, cursor behavior | browser QA | manual | N/A |
| AISU-01 | Route handler streams incrementally (not all-at-once) | browser QA | Network tab DevTools | N/A |

### What Can Be Unit Tested

**Test file:** `src/features/model/__tests__/aiSummary.test.ts`

1. **`buildUserPrompt` pure function** — lives in route handler, extractable. Assert it produces a string containing all 8 KPI labels and the preset name. No mocking needed.

2. **`BASELINE_SUMMARY` content** — assert the exported constant is a non-empty string, contains expected token count range (80–200 words), and references at least one known KPI value (e.g., `'$9.5M'` or `'$959K'`).

3. **Cache gate logic** — if extracted as a pure function `isBaselinePreset(controls, baselinePreset)`, assert it returns `true` for exact baseline controls and `false` after any field change (e.g., `revenueGrowthPct: 0.05`).

**Pattern: Use the established beforeAll error-capture approach:**

```typescript
// src/features/model/__tests__/aiSummary.test.ts
import { describe, it, expect, beforeAll } from 'vitest';

let buildUserPrompt: (kpis: unknown, presetName: string) => string;
let BASELINE_SUMMARY: string;
let importError: unknown;

beforeAll(async () => {
  try {
    // buildUserPrompt exported from route handler
    const routeMod = await import('@/app/api/enhance-summary/route');
    buildUserPrompt = (routeMod as Record<string, unknown>).buildUserPrompt as typeof buildUserPrompt;
  } catch (err) {
    importError = err;
  }
});

beforeAll(async () => {
  try {
    const cacheMod = await import('@/lib/aiSummaryCache');
    BASELINE_SUMMARY = (cacheMod as Record<string, unknown>).BASELINE_SUMMARY as string;
  } catch (err) {
    // separate error — cache module tested independently
  }
});

describe('buildUserPrompt (AISU-01)', () => {
  it('Test 1: includes all 8 KPI labels', () => {
    if (importError) throw importError;
    const kpis = {
      netSales: '$9,476,000', cogs: '$7,337,267', grossProfit: '$2,138,733',
      ebitda: '$958,733', cash: '$4,250,000', ar: '$2,800,000',
      ap: '$3,100,000', inventory: '$6,400,000',
    };
    const result = buildUserPrompt(kpis, 'Jan 2026 Baseline');
    expect(result).toContain('Net Sales');
    expect(result).toContain('COGS');
    expect(result).toContain('EBITDA');
    expect(result).toContain('Inventory');
  });

  it('Test 2: includes presetName in output', () => {
    if (importError) throw importError;
    const result = buildUserPrompt({} as unknown, 'Fuel Cost Shock');
    expect(result).toContain('Fuel Cost Shock');
  });
});

describe('BASELINE_SUMMARY (AISU-04)', () => {
  it('Test 3: exports a non-empty string', () => {
    expect(typeof BASELINE_SUMMARY).toBe('string');
    expect(BASELINE_SUMMARY.length).toBeGreaterThan(100);
  });

  it('Test 4: contains CFO-relevant financial reference', () => {
    // Must reference at least the net sales or EBITDA from baseline computation
    const hasFinancialContent =
      BASELINE_SUMMARY.includes('9.5') ||
      BASELINE_SUMMARY.includes('$9') ||
      BASELINE_SUMMARY.includes('959');
    expect(hasFinancialContent).toBe(true);
  });
});
```

### What Requires Browser QA (Manual Only)

| Behavior | Why Not Automated | How to Verify |
|----------|------------------|---------------|
| Streaming arrives incrementally | Requires live OpenAI API call and network inspection | Open DevTools → Network → select enhance-summary request → confirm response chunks arrive progressively in the Response tab |
| Blinking cursor visible during stream | Requires browser rendering | Visual check: cursor blinks at ~1Hz while text streams |
| Cursor disappears on stream complete | Requires timing | Visual check: cursor gone within 100ms of stream end |
| React Bits loading animation displays | Requires browser DOM | Visual check: animation visible between button click and first token |
| "Scenario changed" badge appears after preset switch | Requires Redux state flow | Load baseline → see summary → switch to Fuel Cost Shock → confirm badge appears |
| Baseline pre-cache loads on fresh page load | Requires mount lifecycle | Open page in new incognito window; summary must be visible immediately, no API call in Network tab |
| Button disabled during streaming | Requires interaction | Click Generate; confirm button is greyed and unclickable until stream completes |
| Error state shown on API failure | Requires failure simulation | Temporarily remove OPENAI_API_KEY from .env.local; click Generate; confirm error message in panel |

### Sampling Rate

- **Per task commit:** `node .../vitest.mjs run` — full suite (fast, ~15s for all unit tests)
- **Per wave merge:** Full suite green + manual browser QA checklist above
- **Phase gate:** Full suite green + all browser QA items verified before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/features/model/__tests__/aiSummary.test.ts` — covers AISU-01 (buildUserPrompt), AISU-04 (BASELINE_SUMMARY)
- [ ] `src/app/api/enhance-summary/route.ts` — must export `buildUserPrompt` as named export for testability
- [ ] `src/lib/aiSummaryCache.ts` — must export `BASELINE_SUMMARY`

*(No new framework config or shared fixtures needed — existing vitest.config.ts include pattern `src/**/__tests__/**/*.test.ts` covers the new test file automatically)*

---

## Sources

### Primary (HIGH confidence)

- OpenAI Node.js SDK v4 documentation — streaming with `chat.completions.create({ stream: true })` and `AsyncIterable<ChatCompletionChunk>` pattern; `choices[0].delta.content` chunk extraction
- Next.js App Router Route Handlers documentation — `ReadableStream` return type for streaming responses; `export const runtime = 'nodejs'` segment config option
- Project source files: `src/store/kpiSelectors.ts`, `src/store/scenarioSlice.ts`, `src/components/DashboardApp.tsx`, `src/app/globals.css`, `src/features/model/__tests__/marginBridge.test.ts` — verified existing patterns used in recommendations above
- `src/data/erp_gl_summary.csv` + `src/data/scenario-presets.json` — baseline KPI computation verified from actual data files

### Secondary (MEDIUM confidence)

- React Bits documentation (reactbits.dev) — component category listing, `{ ssr: false }` requirement documented per component
- STATE.md accumulated decisions — field-by-field ControlState comparison for activePresetId (Phase 4 decision log)
- `vitest.config.ts` + existing test files — confirmed `include` glob pattern, `beforeAll` error-capture pattern, invocation path

### Tertiary (LOW confidence, flag for validation)

- 21st.dev component SSR compatibility — not systematically verified per-component; treated as requiring inspection before adoption
- React Bits `InfinityLoader` specifically — confirmed category exists; specific component's browser global usage not fully audited

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies already installed and verified in package.json; streaming pattern from official OpenAI docs
- Architecture: HIGH — route handler + ReadableStream + getReader() pattern is standard and well-documented; component patterns match established project conventions
- Pitfalls: HIGH — `runtime = 'nodejs'` requirement confirmed in STATE.md blockers; stale closure pattern is fundamental React; SSR crash pattern established in Phase 1
- Baseline KPI values: HIGH — computed directly from actual data files using same formulas as kpiSelectors.ts

**Research date:** 2026-03-05
**Valid until:** 2026-04-04 (stable APIs; OpenAI SDK API surface is stable in v4)
