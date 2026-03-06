# Phase 12: Scene Storytelling and AI Formats - Research

**Researched:** 2026-03-06
**Domain:** React component authoring, Next.js API routes, Redux selectors, OpenAI prompt engineering
**Confidence:** HIGH — all findings derived from direct codebase inspection of Phases 8–11 source files

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**SceneNarrative Placement**
- Position: Full-width banner card at the very top of each tab content, BEFORE any SectionHeader or section content
- Layout: Tab name + callout badges in the top row (space-between); AI-generated narrative text below in italic muted font
- Callout badges placement: Float in the top-right of the same banner card alongside the tab name — 1-2 badges per tab, horizontal row
- Visual style: Indigo wash background (`#f0f2f8` / `var(--section-warm)`), 3px amber left border (`var(--accent)`), border-radius 12px

**Callout Data Logic**
- Reactivity: Dynamic threshold checks — each callout reads a live Redux selector value and compares it to a threshold rule
- Status colors: Good = `#05AB8C` (`var(--color-success)`), Watch = `#F5A800` (`var(--accent)`), Concern = `#E5376B` (`var(--color-error)`)
- Rule file: `src/lib/calloutRules.ts` — exported `CALLOUT_RULES` array with shape `{ tab, metric, goodThreshold, watchThreshold, labels }`
- Metric access: Each rule's metric key maps to an existing Redux selector

**Scene Narrative Content (5 locked texts)**
- Overview, Close Tracker, Charts, AI Summary, Scenario — verbatim texts defined in CONTEXT.md

**Scene Narrative Generation**
- API call fires on named preset selection only — NOT on slider drags
- New route: `/api/scene-narrative` accepts `{ kpis, presetName, tabId }` returns 2-3 sentence tab-scoped text
- Cached by `presetId + tabId` — new file `src/lib/scenarioNarrativeCache.ts`
- Initial state: locked baseline texts serve as default — no API call on page load
- Stale behavior: preset change marks all AI-generated tab narratives stale; auto-regenerates when user visits stale tab

**AI Dropdowns Layout (AIFMT-01, AIFMT-02)**
- Position: Inline control row between SectionHeader and narrative text in AI Summary tab
- Layout: `Audience: [dropdown]  Focus: [dropdown]  [Regenerate]` — horizontal row
- Dropdown component: reuse existing shadcn `Select` from `src/components/ui/Select.tsx`
- Stale behavior: either dropdown change sets `isStale = true` — same `controlsMatch` pattern; does NOT auto-trigger API call

**AI Dropdown Prompt Engineering (Locked)**
- 5 Audience options with system prompt modifiers (CFO / Board / Operations / External / Internal FP&A)
- 5 Focus options with user prompt additions (Full Overview / Revenue & Profitability / Cash & Working Capital / Close Efficiency / Scenario Impact)
- API payload extension: `POST /api/enhance-summary` receives `{ audience, focus }` added to existing `{ kpis, presetName }`

### Claude's Discretion
- Exact threshold values for callout rules (ar90Ratio ~0.10, ebitda margin warning ~0.14, close progress warning ~60%)
- Whether `SceneNarrative` is a standalone component file or co-located with each tab
- Exact border-radius, padding, and spacing of the banner card
- The `scene-narrative` route's system prompt base text (2-3 sentence, tab-scoped)
- Loading state for scene narrative while API call is in progress (skeleton text, pulsing line)

### Deferred Ideas (OUT OF SCOPE)
- Word doc export of scene narratives — Phase 13 (alongside RPT-04 PDF export)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| STORY-01 | Each tab displays a 2-3 sentence narrative header scoped to the scene | SceneNarrative component with locked baseline texts; new `/api/scene-narrative` route for AI-generated replacement on preset selection |
| STORY-02 | Each tab surfaces 1-2 highlight callouts (good/watch/concern) with color, icon, one-line explanation | `calloutRules.ts` pure threshold rules, `useSelector` reads live Redux KPI values, colored badge renders in banner top-right |
| AIFMT-01 | AI Summary tab has Audience dropdown (5 options) changing narrative tone | Add `audience` state + shadcn Select to `AiSummarySection`; inject system prompt modifier in `/api/enhance-summary` |
| AIFMT-02 | AI Summary tab has Focus dropdown (5 options) directing metric emphasis | Add `focus` state + shadcn Select; append focus instruction to user prompt in `/api/enhance-summary` |
</phase_requirements>

---

## Summary

Phase 12 is a pure in-codebase extension phase — no new npm packages required. All primitives are already in place: Redux selectors for live KPI values, a streaming OpenAI API route, shadcn Select components, the `controlsMatch` stale-detection pattern, and the `aiSummaryCache.ts` module pattern. The work falls into four surgical additions:

1. A new `SceneNarrative` presentational component that renders the banner card at the top of each tab, reading its narrative text from component state (baseline locked strings) or from an API call result.
2. A new `src/lib/calloutRules.ts` pure configuration file and a `CalloutBadge` sub-component that reads live Redux selector values against threshold rules.
3. A new `/api/scene-narrative` Next.js route that accepts `{ kpis, presetName, tabId }` and returns a short (2-3 sentence) tab-scoped narrative. Cache keyed by `presetId:tabId` stored in `src/lib/scenarioNarrativeCache.ts`.
4. Extension of `AiSummarySection.tsx` and `POST /api/enhance-summary` with Audience and Focus dropdown state and prompt injection.

**Primary recommendation:** Build in four sequential plans — (1) calloutRules + SceneNarrative shell, (2) scene narrative API + cache + preset trigger, (3) AI dropdowns in AiSummarySection, (4) enhance-summary route extension.

---

## Standard Stack

### Core (already installed — no new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | 19.x | Component rendering | Already project foundation |
| `react-redux` / `@reduxjs/toolkit` | ^2.0.0 | Live KPI selector reads for callout rules | Already installed; `useSelector` + `createSelector` already working |
| `openai` | ^4.0.0 | Scene narrative API + enhanced summary | Already installed in `route.ts` |
| `framer-motion` | ^11.x | Stale state indicator fade, narrative load skeleton | Already installed for tab animations |
| `@radix-ui/react-select` | existing | Audience + Focus dropdowns | Already wrapped in `src/components/ui/Select.tsx` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/dynamic` | built-in | SSR guard for any browser-API sub-component | Only if loading skeleton uses browser APIs — probably not needed here |

**Installation:** None required.

---

## Architecture Patterns

### Recommended New File Structure

```
src/
├── components/
│   └── dashboard/
│       └── SceneNarrative/
│           ├── SceneNarrative.tsx       # Banner component — tab narrative + callout badges
│           └── CalloutBadge.tsx         # Single badge — color, label, value
├── lib/
│   ├── calloutRules.ts                  # Pure config: CALLOUT_RULES array
│   └── scenarioNarrativeCache.ts        # Map<string, string> keyed by presetId:tabId
└── app/
    └── api/
        └── scene-narrative/
            └── route.ts                 # POST { kpis, presetName, tabId } → string
```

`AiSummarySection.tsx` and `src/app/api/enhance-summary/route.ts` are extended in-place (not replaced).

### Pattern 1: SceneNarrative Component Shape

The component receives `tabId`, the current preset name (for generating AI text), and reads its own narrative state. It does NOT receive narrative text as a prop — it manages its own `text` state seeded from the locked baseline constants, then replaced by API calls.

```tsx
// Source: inferred from existing AiSummarySection.tsx pattern
interface SceneNarrativeProps {
  tabId: TabId;
  presetName: string;          // current active preset — triggers stale check
  seedData: DashboardSeedData; // for KPI payload construction
}

export default function SceneNarrative({ tabId, presetName, seedData }: SceneNarrativeProps) {
  const [narrativeText, setNarrativeText] = useState(BASELINE_NARRATIVES[tabId]);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedPreset, setCachedPreset] = useState<string>('baseline');
  // ... useEffect watches presetName — fires API call when preset changes and result not cached
}
```

**Integration point in DashboardApp.tsx:** Add `<SceneNarrative tabId="overview" presetName={activePresetName} seedData={seedData} />` as the first child of each tab block. `activePresetName` is a new state variable derived from `scenarioSlice.controls` — use the same `getPresetName()` logic already in `AiSummarySection`.

### Pattern 2: calloutRules.ts Shape

```typescript
// Source: inferred from CONTEXT.md rule spec
export type CalloutStatus = 'good' | 'watch' | 'concern';

export interface CalloutRule {
  tab: TabId;
  metric: string;        // maps to a selector or seedData prop
  goodThreshold: number;
  watchThreshold: number;
  labels: { good: string; watch: string; concern: string };
}

export const CALLOUT_RULES: CalloutRule[] = [
  {
    tab: 'overview',
    metric: 'ebitdaMargin',       // computed as selectEbitda / selectNetSales
    goodThreshold: 0.14,
    watchThreshold: 0.10,
    labels: {
      good: 'EBITDA on target',
      watch: 'Margin under pressure',
      concern: 'EBITDA at risk',
    },
  },
  // ... 1-2 rules per tab
];
```

The `metric` string is resolved inside `SceneNarrative` or `CalloutBadge` using a `METRIC_SELECTORS` map. No new selectors are needed — `selectEbitda`, `selectNetSales`, `selectAr`, and `seedData.ar90Ratio` / `seedData.closeStages` cover all 5 tabs.

### Pattern 3: Scene Narrative Cache (mirrors aiSummaryCache.ts)

```typescript
// src/lib/scenarioNarrativeCache.ts
// Keyed by `presetId:tabId` — persists across tab switches within a session.
// Client-side only (module-level Map in browser JS) — no localStorage needed.

export const sceneNarrativeCache = new Map<string, string>();

export function getCacheKey(presetId: string, tabId: string): string {
  return `${presetId}:${tabId}`;
}
```

This is a runtime in-memory cache (not localStorage). The same session-local pattern used by `BASELINE_SUMMARY` constant in `aiSummaryCache.ts` — the map resets on page refresh, which is acceptable.

### Pattern 4: /api/scene-narrative Route

Mirrors `/api/enhance-summary` exactly, with three differences:
- System prompt: shorter, tab-scoped instruction (2-3 sentences for THIS tab only)
- No streaming: response is short enough to return as a single JSON string (avoids ReadableStream complexity for 2-3 sentences)
- Request: `{ kpis: KpiPayload, presetName: string, tabId: TabId }`

```typescript
// Source: mirrors route.ts pattern from enhance-summary
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { kpis, presetName, tabId } = await req.json();
  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 80,        // 2-3 sentences only — much tighter than the 300-token summary
    temperature: 0.3,
    messages: [
      { role: 'system', content: buildSceneSystemPrompt(tabId) },
      { role: 'user', content: buildSceneUserPrompt(kpis, presetName, tabId) },
    ],
  });
  const text = completion.choices[0]?.message?.content ?? '';
  return Response.json({ text });
}
```

Non-streaming is correct here: 80 tokens arrives instantly (~1-2 seconds). No ReadableStream required — simpler implementation, simpler component state management.

### Pattern 5: Audience + Focus Dropdown Integration

The `AiSummarySection.tsx` gets two new state variables and a control row. The existing `handleGenerate` function includes them in the POST body. The `isStale` detection is extended to also fire when either dropdown changes from its value at last generation time.

```tsx
// Inside AiSummarySection — additions only
const [audience, setAudience] = useState<AudienceOption>('CFO');
const [focus, setFocus] = useState<FocusOption>('Full Dashboard Overview');
const summaryAudienceRef = useRef<AudienceOption>('CFO');
const summaryFocusRef = useRef<FocusOption>('Full Dashboard Overview');

// Extend stale detection:
useEffect(() => {
  if (!summaryText || !summaryControlsRef.current) return;
  const controlsDrifted = !controlsMatch(controls, summaryControlsRef.current);
  const audienceDrifted = audience !== summaryAudienceRef.current;
  const focusDrifted = focus !== summaryFocusRef.current;
  if (controlsDrifted || audienceDrifted || focusDrifted) setIsStale(true);
}, [controls, audience, focus, summaryText]);

// Extend POST body in handleGenerate:
body: JSON.stringify({ kpis: buildKpiPayload(), presetName: getPresetName(), audience, focus }),
```

The `route.ts` handler extension uses a `AUDIENCE_SYSTEM_MODIFIERS` record and `FOCUS_USER_ADDITIONS` record keyed by the option strings. The system prompt is injected by appending the modifier after the existing base system prompt text.

### Anti-Patterns to Avoid

- **Passing narrativeText as a prop from DashboardApp:** SceneNarrative manages its own text state — DashboardApp should only pass `tabId`, `presetName`, `seedData`. Centralizing all 5 narrative states in DashboardApp creates unnecessary prop drilling.
- **Streaming the scene narrative:** 80 tokens is too short to justify streaming. Use `chat.completions.create` without `stream: true` and return `Response.json({ text })`.
- **Auto-triggering scene narrative on slider drag:** The CONTEXT.md locks this — only named preset selection fires the API. Individual slider changes only invalidate cached narratives.
- **Using next/dynamic for SceneNarrative:** It's pure JSX with Redux selectors. No browser APIs. No dynamic needed.
- **Adding 'use client' to SceneNarrative:** All dashboard components run inside DashboardApp's existing `'use client'` boundary.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dropdown component | Custom dropdown HTML | `Select` from `src/components/ui/Select.tsx` | Already styled with Crowe tokens and Radix accessibility |
| Stale change detection | Custom comparison logic | `controlsMatch()` pattern from AiSummarySection | Already battle-tested with field-by-field comparison avoiding JSON.stringify key-order issues |
| Loading animation | Custom spinner | Simple CSS pulse on a single text line | InfinityLoader is too heavy for a 1-2 second scene narrative load; a pulsing placeholder line is sufficient |
| KPI value formatting | Custom currency formatter | `formatCurrency()` from `@/lib/formatters` | Already consistent across all KPI cards and the AI Summary payload |
| Callout status color | Hard-coded hex | `var(--color-success)`, `var(--accent)`, `var(--color-error)` | Already maps to the project's CSS variable theme; dark-mode compatible |

---

## Common Pitfalls

### Pitfall 1: SceneNarrative stale-on-preset-change scope
**What goes wrong:** When a preset changes, only the currently visible tab's narrative gets marked stale (because only that tab's component is mounted). Tabs not currently visible never receive the effect.
**Why it happens:** React effects only run in mounted components. Tabs use conditional rendering (`activeTab === 'xxx'`), so only the active tab's SceneNarrative is mounted.
**How to avoid:** Store stale flags in a `useRef` at DashboardApp level or in a `Map<TabId, boolean>` in SceneNarrative cache state — not in per-component `useState`. When SceneNarrative mounts for a tab, check the cache: if the cached presetId differs from the current presetId, trigger regeneration immediately.
**Warning signs:** User sees old narrative text when switching to a tab after a preset change.

### Pitfall 2: `activePresetId` derivation in DashboardApp
**What goes wrong:** DashboardApp needs to pass `presetName` to SceneNarrative, but the preset name is only derivable by comparing `controls` against `presets`. If this logic is duplicated naively, it goes stale relative to `AiSummarySection`'s equivalent logic.
**How to avoid:** Extract `getPresetName(controls, presets)` into a shared pure utility (can go in `aiPromptUtils.ts` or a new `src/lib/presetUtils.ts`). Both `AiSummarySection` and `DashboardApp` call the same function.
**Warning signs:** AiSummarySection shows "Custom Scenario" while SceneNarrative shows the preset name, or vice versa.

### Pitfall 3: Callout metric access for `closeProgress`
**What goes wrong:** `closeProgress` (average stage completion) is not a Redux selector — it's derived from `seedData.closeStages`, which is a server-loaded prop. The Redux store does not hold close stage data.
**How to avoid:** The `SceneNarrative` component must accept `seedData` as a prop (which DashboardApp already passes to all section components). The callout rule for the Close Tracker tab computes progress from `seedData.closeStages` directly, not from a Redux selector.
**Warning signs:** TypeScript error trying to call `useSelector` with a non-existent `selectCloseProgress` selector.

### Pitfall 4: Audience/Focus dropdown position within AiSummarySection
**What goes wrong:** Placing the control row inside the card header (between icon and button) makes the header overflow or look cramped.
**How to avoid:** The control row sits BETWEEN the SectionHeader and the card element — not inside the card header. The card header retains only the title + stale badge + Regenerate button. The Audience/Focus row is a separate flex row outside the card.

### Pitfall 5: Route non-streaming response format
**What goes wrong:** The existing `enhance-summary` route returns a `ReadableStream`. If scene-narrative is modeled identically but without streaming, the client-side fetch code that calls it via a stream reader will hang waiting for stream data that never comes.
**How to avoid:** The scene narrative route returns `Response.json({ text })`. The SceneNarrative component uses a simple `await fetch(...).then(r => r.json())` call — NOT a `getReader()` stream read. These are two different fetch patterns for two different routes.

---

## Code Examples

Verified patterns from existing source code:

### controlsMatch pattern (from AiSummarySection.tsx)
```typescript
// Source: src/components/dashboard/AiSummarySection/AiSummarySection.tsx line 37
function controlsMatch(a: ControlState, b: ControlState): boolean {
  return (Object.keys(a) as Array<keyof ControlState>).every(k => a[k] === b[k]);
}
```

### Stale indicator badge pattern (from AiSummarySection.tsx)
```tsx
// Source: src/components/dashboard/AiSummarySection/AiSummarySection.tsx lines 207-224
{hasContent && isStale && !isStreaming && (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 8px', borderRadius: 9999,
    background: 'rgba(245,168,0,0.12)', color: 'var(--accent)',
    fontSize: '0.75rem', fontWeight: 600, marginLeft: '0.5rem',
  }}>
    Scenario changed — regenerate?
  </span>
)}
```

### shadcn Select usage pattern (from src/components/ui/Select.tsx)
```tsx
// Source: src/components/ui/Select.tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';

<Select value={audience} onValueChange={(v) => setAudience(v as AudienceOption)}>
  <SelectTrigger style={{ width: 180 }}>
    <SelectValue placeholder="Audience" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CFO">CFO</SelectItem>
    <SelectItem value="Board of Directors">Board of Directors</SelectItem>
    {/* ... */}
  </SelectContent>
</Select>
```

### Non-streaming OpenAI call (adapt from route.ts pattern)
```typescript
// Source: adapted from src/app/api/enhance-summary/route.ts
// For scene-narrative — no stream, JSON response
const completion = await getOpenAI().chat.completions.create({
  model: 'gpt-4o',
  max_tokens: 80,
  temperature: 0.3,
  // No stream: true
  messages: [
    { role: 'system', content: buildSceneSystemPrompt(tabId) },
    { role: 'user', content: buildSceneUserPrompt(kpis, presetName, tabId) },
  ],
});
const text = completion.choices[0]?.message?.content ?? '';
return Response.json({ text });
```

### DashboardApp tab content integration point
```tsx
// Source: src/components/DashboardApp.tsx lines 177-222
// Add SceneNarrative as first child of each tab block:
{activeTab === 'overview' && seedData && (
  <div>
    <SceneNarrative tabId="overview" presetName={activePresetName} seedData={seedData} />
    <KpiSection seedData={seedData} />
    {/* ... */}
  </div>
)}
```

### Callout banner card visual style (matches existing indigo-wash pattern)
```tsx
// Source: visual spec from CONTEXT.md, consistent with SectionHeader explain panel
// (src/components/dashboard/SectionHeader.tsx lines 65-75)
<div style={{
  background: '#f0f2f8',                           // var(--section-warm) indigo wash
  borderLeft: '3px solid var(--accent)',           // amber 3px left border
  borderRadius: 12,
  padding: '1rem 1.25rem',
  marginBottom: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{TAB_LABELS[tabId]}</span>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {/* CalloutBadge components */}
    </div>
  </div>
  <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--muted-color)', fontSize: '0.875rem' }}>
    {narrativeText}
  </p>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Full-page scroll navigation | 5-tab navigation (Phase 11) | Phase 11 | Each tab content is conditionally rendered; components mount/unmount on tab switch — relevant to SceneNarrative cache design |
| No scene context | SceneNarrative banner per tab | Phase 12 (this phase) | Adds presenter-facing narrative to every tab |
| Single AI tone | Audience + Focus dropdowns | Phase 12 (this phase) | `enhance-summary` route gains `audience`/`focus` params |

**Deprecated/outdated:**
- The footer text "Phase 11 Tab Navigation" in `DashboardApp.tsx` should be updated to "Phase 12" after implementation.

---

## Open Questions

1. **Where should `activePresetName` be derived in DashboardApp?**
   - What we know: `AiSummarySection` already derives it locally via `getPresetName(controls, presets)`. DashboardApp needs it too for the `presetName` prop on SceneNarrative.
   - What's unclear: Whether to lift this derivation to DashboardApp level (one source of truth) or keep it in each component separately.
   - Recommendation: Extract to a shared pure function in `aiPromptUtils.ts` — call it `getActivePresetName(controls, presets): string`. Both components import and call it. This avoids duplicating logic without requiring Redux state changes.

2. **Should the scene-narrative API be tab-aware (one call per tab) or batch (one call for all 5 tabs)?**
   - What we know: CONTEXT.md locks "per-tab API call" — `{ kpis, presetName, tabId }` per call.
   - What's unclear: Whether to fire all 5 calls eagerly on preset selection or lazily when user visits each tab.
   - Recommendation: Lazy is correct per CONTEXT.md — "the next time the user visits a tab with a stale narrative, it auto-regenerates." Fire one call per tab, on tab visit, if that tab is stale.

3. **`var(--section-warm)` CSS variable availability**
   - What we know: `#f0f2f8` is defined in `CLAUDE.md` as `--color-surface-brand-soft` / `.bg-section-indigo-wash`. CONTEXT.md refers to it as `var(--section-warm)`.
   - What's unclear: Whether `--section-warm` is already defined as a CSS variable in `globals.css`.
   - Recommendation: Use the hex `#f0f2f8` directly if `--section-warm` is not confirmed defined. Cross-check `globals.css` in Wave 0 before using the variable reference.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (existing) |
| Config file | `vitest.config.ts` in app directory |
| Quick run command | `node /c/Users/RachurA/AppData/Local/npm-cache/_npx/*/node_modules/.bin/vitest.mjs run --reporter=verbose` (from app dir) |
| Full suite command | Same — all tests in `src/**/__tests__/**/*.test.ts` |

**Note from STATE.md:** Vitest must run from the app directory (`fpa-close-efficiency-dashboard/`), not repo root. The `vitest` binary is invoked as `node .../vitest.mjs run` due to ampersand in path.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STORY-01 | Baseline narrative text constants export one string per tab | unit | `vitest run src/features/model/__tests__/sceneStorytelling.test.ts` | Wave 0 |
| STORY-01 | `/api/scene-narrative` route handler exports POST function | unit | same file | Wave 0 |
| STORY-02 | `calloutRules.ts` exports CALLOUT_RULES array covering all 5 tabs | unit | same file | Wave 0 |
| STORY-02 | Callout status function returns 'good'/'watch'/'concern' at correct thresholds | unit | same file | Wave 0 |
| AIFMT-01 | `buildUserPrompt` extended with audience modifier included in output | unit | `vitest run src/features/model/__tests__/aiSummary.test.ts` | Exists |
| AIFMT-02 | `buildUserPrompt` extended with focus addition included in output | unit | same file | Exists |

**Testing note from REQUIREMENTS.md:** "Comprehensive unit/integration test suite" is explicitly out of scope for demo-context deadline. Manual preset testing is the quality gate. The Vitest suite validates pure utility functions only — no component rendering tests.

### Sampling Rate
- **Per task commit:** `node .../vitest.mjs run` from app dir — all tests in ~3 seconds
- **Per wave merge:** Same full suite
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/features/model/__tests__/sceneStorytelling.test.ts` — covers STORY-01 (narrative constants + route export), STORY-02 (calloutRules shape + status thresholds)
- [ ] Extend `src/features/model/__tests__/aiSummary.test.ts` — add tests for AIFMT-01/02 (`buildUserPrompt` with `audience`/`focus` params)

*(Existing test infrastructure covers all other phase requirements — no new test files beyond these two needed.)*

---

## Sources

### Primary (HIGH confidence)
- Direct inspection of `src/components/DashboardApp.tsx` — tab structure and integration points
- Direct inspection of `src/components/dashboard/AiSummarySection/AiSummarySection.tsx` — full component pattern, stale detection, streaming, shadcn Select usage
- Direct inspection of `src/app/api/enhance-summary/route.ts` — route shape, OpenAI call, streaming pattern
- Direct inspection of `src/store/kpiSelectors.ts` — available selectors: `selectNetSales`, `selectEbitda`, `selectAr`, `selectCash`, `selectGrossProfit`
- Direct inspection of `src/lib/aiSummaryCache.ts` — cache module pattern to replicate for scene narratives
- Direct inspection of `src/features/model/aiPromptUtils.ts` — `KpiPayload` interface and `buildUserPrompt` function
- Direct inspection of `src/lib/dataLoader.ts` — `DashboardSeedData` shape including `ar90Ratio`, `closeStages`
- Direct inspection of `src/components/ui/Select.tsx` — exact import surface for Audience/Focus dropdowns
- Direct inspection of `.planning/phases/12-scene-storytelling-and-ai-formats/12-CONTEXT.md` — all locked decisions

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — historical decisions about Vitest invocation pattern, no 'use client' convention, DashboardApp client boundary

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed present in source files
- Architecture patterns: HIGH — all derived from reading the actual existing component and route implementations
- Pitfalls: HIGH — identified from direct structural analysis of the codebase (conditional rendering, existing selectors, route patterns)
- Callout threshold values: MEDIUM — FP&A-reasonable values per CONTEXT.md guidance; exact values are Claude's discretion

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable codebase — no external dependencies to expire)
