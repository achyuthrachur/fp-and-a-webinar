# Phase 10: Visual Identity and Interactivity - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the functional dashboard into a visually compelling, animated experience with four additions: (1) a separate landing page at `/`, (2) scroll-triggered React Bits entrance animations across all 6 sections, (3) shadcn/ui components replacing hand-crafted buttons/dropdown with Crowe theming, and (4) a global "Explain" mode button that reveals contextual explanation panels per section. The existing dashboard moves to `/dashboard`.

**Out of scope:** New financial data, new chart types, new Redux state for financial logic.

Requirements covered: VISU-01, VISU-02, VISU-03, VISU-04

</domain>

<decisions>
## Implementation Decisions

### Landing Page

- **Routing:** Separate Next.js route — `/` (new landing page) and `/dashboard` (existing dashboard, moved from current `/`). `src/app/page.tsx` becomes the landing; `src/app/dashboard/page.tsx` receives the existing dashboard content.
- **Visual style:** Full-screen Crowe Indigo Dark (`#011E41`) background with subtle radial gradient. Soft white (`#f6f7fa`) text. No pure black, no harsh lines.
- **Animated background:** React Bits animated background component (Particles, Aurora, or Waves) behind the content. SSR-safe via `next/dynamic` with `{ ssr: false }` (established pattern from Phase 8).
- **Content structure (top to bottom):**
  1. "Crowe" text wordmark — bold, Indigo-appropriate weight
  2. "FP&A Close Efficiency Dashboard" — large display headline
  3. "Summit Logistics Group · January 2026" — muted subheadline
  4. Three feature highlight rows (icon + label):
     - Real-time Scenario Modeling
     - AI-Generated Executive Narrative
     - Live Month-End Close Tracking
  5. "Enter Dashboard →" CTA button — Crowe Amber (`#F5A800`), shadcn Button component (Crowe-themed)
- **Entrance animation:** Content animates in on load — headline and bullets fade in and slide up sequentially (CSS or Framer Motion). CTA button appears last with a subtle amber glow pulse.
- **Navigation:** Clicking "Enter Dashboard →" routes to `/dashboard` via Next.js `<Link>`.

### Scroll-Triggered Section Animations

- **Coverage:** All 6 dashboard sections animate on scroll into viewport — KPI Cards, Close Tracker, Margin Bridge, Charts, AI Summary, Scenario Panel.
- **Style:** Fade in + slide up ~20px. Professional and restrained — motion serves UX, not decoration. Duration ~500ms, ease-out curve.
- **KPI cards:** Staggered individually — 8 cards appear left-to-right, top-to-bottom with ~60ms delay between each. Creates a satisfying reveal effect.
- **Other sections:** Each section block animates as a whole unit as it enters the viewport.
- **Library:** Framer Motion `whileInView` + `viewport={{ once: true }}` — animations fire once on first scroll into view, never repeat. `InfinityLoader` (React Bits) and `CountUp` (React Bits) already in the project; this phase adds Framer Motion for section-level animations.
- **Reduced motion:** Respect `prefers-reduced-motion` — wrap all animations in a check and skip if user has set this preference.

### shadcn/ui Integration (Buttons + Dropdown + Tooltip)

- **Scope:** Replace only: hand-crafted buttons (Generate/Regenerate in AI panel, Enter on landing, Reset in Scenario Panel) → shadcn `Button`. Preset selector dropdown → shadcn `Select`. KPI card (?) explanation tooltips → shadcn `Tooltip`.
- **Keep as-is:** 21st.dev sliders and toggles in the Scenario Panel — already working well, no regression risk.
- **Theme:** Apply Crowe Indigo/Amber HSL overrides from CLAUDE.md Section 4.2 in `globals.css` when initializing shadcn. All shadcn components inherit warm palette automatically via CSS variables.
- **Installation:** `NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest init` (Crowe corporate network requires the TLS bypass). Select CSS variables mode. Do NOT use the default theme — override immediately with CLAUDE.md Section 4.2 values.

### Global "Explain" Mode

- **Location:** A third button in `DashboardHeader.tsx`, to the right of the theme toggle. Label: "Explain" when OFF, "Hide Explanations" when ON.
- **Behavior:** Toggle state stored in `localStorage` under key `'explainMode'`. Initializes from localStorage on mount (same pattern as theme toggle). Persists across refreshes — presenter can set it before the webinar starts.
- **Effect when ON:** Each `SectionHeader` component receives an `explainMode` prop (passed down from DashboardApp via context or direct prop). When `explainMode` is true, a collapsible explanation panel appears below the subtitle line with a smooth height-animate transition.
- **Explanation panel content:** 2-3 sentences per section, FP&A practitioner tone. Text locked below:
  - **KPI Cards:** "These 8 metrics reflect Summit Logistics Group's January 2026 GL data, adjusted in real time for the active scenario. Net Sales and EBITDA update immediately as sliders move — the variance delta shows movement against the December prior period."
  - **Close Tracker:** "Progress bars are computed from actual journal entry counts in `erp_journal_entries.csv`. RAG status (On Track / At Risk / Delayed) is determined by completion percentage thresholds. The days-to-close metric reads from `company.json`."
  - **Margin Bridge:** "This waterfall chart shows how each scenario lever — revenue growth, gross margin, fuel index, and all other inputs combined — flows through to the change in adjusted EBITDA versus the baseline. Bars above zero help EBITDA; bars below hurt it."
  - **Pipeline & Collections:** "The Pipeline to Invoiced chart shows the CRM funnel from Qualified leads to Invoiced revenue. AR Aging breaks the $2.8M receivables balance into aging buckets — the 90-plus-day ratio is the key watch metric for collection risk. The 13-Week Cash Flow distinguishes actuals (solid) from forecast (dashed)."
  - **AI Executive Summary:** "This two-paragraph narrative is generated by OpenAI GPT-4o from the current scenario's KPI values. On page load it shows a pre-cached baseline summary. Click Regenerate after changing the scenario to get a fresh AI-generated analysis."
  - **Scenario Controls:** "Use these levers to model different close scenarios. Sliders adjust financial rates and operational factors; toggles activate business mode assumptions. Select a named preset from the dropdown to jump to a pre-configured scenario in one click."
- **Animation:** Explanation panel slides open/closed using CSS `max-height` transition or Framer Motion `AnimatePresence`.

### Claude's Discretion

- Exact React Bits background component (Particles vs. Aurora vs. Waves — choose based on SSR safety and visual fit with Indigo Dark background; avoid components using WebGL if SSR crash risk)
- Exact Framer Motion `initial`/`animate`/`transition` values for section entrance (recommend `{ opacity: 0, y: 20 }` → `{ opacity: 1, y: 0 }`, duration 0.5s, easing `[0.16, 1, 0.3, 1]`)
- State management for `explainMode` in DashboardApp — React Context or prop drilling to all 6 section components (Context recommended to avoid prop threading through 6 components)
- shadcn component installation order and exact CLI commands
- Landing page layout centering (full-screen flex column, center-aligned)
- Whether to use Next.js `redirect()` in the old `src/app/page.tsx` or simply move content

</decisions>

<specifics>
## Specific Ideas

- The landing page Crowe Indigo background with amber CTA is the "wow" moment before the audience even sees the data. It sets the Crowe brand tone and separates the experience from a generic Next.js app.
- The staggered KPI card entrance (60ms between each of the 8 cards) should feel like the dashboard is "loading in" the data. Combined with CountUp animations already on the numbers, this creates a strong first impression.
- The "Explain" button should feel like a presenter's tool, not a user feature. It belongs next to the theme toggle in the header — something the presenter configured before going live.
- Framer Motion is already in `package.json` (installed in Phase 1 as part of the animation stack) — no new install needed for section animations.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/app/page.tsx` — currently renders the dashboard directly; will become the landing page; dashboard content moves to `src/app/dashboard/page.tsx`
- `src/components/dashboard/DashboardHeader.tsx` — add "Explain" toggle button alongside existing theme toggle; localStorage persistence pattern already implemented here
- `src/components/dashboard/SectionHeader.tsx` — add `explainMode?: boolean` prop and collapsible explanation panel block below subtitle
- `src/components/ui/InfinityLoader.tsx`, `CountUp.tsx` — React Bits already in project; Framer Motion (`framer-motion` package) is in the approved stack per CLAUDE.md and likely already installed
- `src/lib/dataLoader.ts` — `loadDashboardSeedData()` returns company name and period for landing page stat display if needed

### Established Patterns

- **`next/dynamic` with `{ ssr: false }`** — mandatory for any React Bits component using browser globals (established Phase 8 pattern for InfinityLoader)
- **`localStorage` + `useEffect` on mount** — theme toggle pattern in `DashboardHeader.tsx`; apply same pattern for `explainMode`
- **CSS variables for all colors** — `var(--accent)` (#F5A800 amber), `var(--foreground)`, `var(--card)`, `var(--border)`
- **No `'use client'`** — section components run inside DashboardApp boundary; only the landing page (`src/app/page.tsx`) may need its own boundary for animations
- **shadcn + TLS bypass** — `NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest ...` required on Crowe network

### Integration Points

- `src/app/page.tsx` → landing page (new file content)
- `src/app/dashboard/page.tsx` → new file; existing `page.tsx` content (async, calls `loadDashboardSeedData`, renders `<DashboardApp>`) moves here
- `src/components/DashboardApp.tsx` → add `explainMode` state + Context + pass to all 6 section components; wrap sections in Framer Motion `motion.div` for scroll animations
- `src/components/dashboard/DashboardHeader.tsx` → add Explain button; read/write `localStorage['explainMode']`
- `src/components/dashboard/SectionHeader.tsx` → accept `explainMode` prop; conditionally render explanation panel with animation
- `globals.css` → add shadcn HSL CSS variable overrides (CLAUDE.md Section 4.2) — do NOT break existing `--foreground`, `--accent` etc. that the dashboard already uses

</code_context>

<deferred>
## Deferred Ideas

- None — all discussion stayed within Phase 10 scope.

</deferred>

---

*Phase: 10-visual-identity-and-interactivity*
*Context gathered: 2026-03-05*
