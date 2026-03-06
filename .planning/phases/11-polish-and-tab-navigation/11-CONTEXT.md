# Phase 11: Polish and Tab Navigation - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix 3 visual bugs (section title hierarchy, KPI $ sizing, explain animation elegance) and restructure the dashboard from a scroll layout into a 5-tab navigation system. All existing section components stay; only the wrapper and navigation layer change.

Requirements: PLSH-01, PLSH-02, PLSH-03, NAV-01, NAV-02, NAV-03

</domain>

<decisions>
## Implementation Decisions

### Tab Layout and Position

- **Tab row position:** Below the existing sticky 56px header — a second sticky row for tab navigation
- **Tab row is sticky:** Sticks below the header at the viewport top when scrolling tab content — always accessible
- **5 tabs:** Overview | Close Tracker | Charts | AI Summary | Scenario
- **Scenario Panel moves into Scenario tab:** The 280px sidebar is removed from the persistent layout — Scenario controls only visible when Scenario tab is active. All other tabs get full content width.
- **Active tab persistence:** localStorage under key `'activeTab'` — same pattern as theme toggle and explainMode
- **Tab transition:** Framer Motion fade (opacity) on tab content switch — existing framer-motion already installed

### Tab Visual Style

- **Active indicator:** 2-3px amber bottom border (`var(--accent)`) — underline style, not pill/chip
- **Inactive text:** `var(--muted-color)` — muted/dimmed
- **Active text:** `var(--foreground)` — full foreground color + amber underline
- **Tab row background:** `var(--card)` — subtle lift from page background, sticky

### Overview Tab Content

- **Full dashboard summary** — KPI cards + close status + Margin Bridge chart in one tab
- **Margin Bridge also in Charts tab** — reactive centerpiece appears in both Overview and Charts
- **Tab content layout:** Overview is the "everything at a glance" tab; other tabs are focused deep-dives

### Section Title Treatment (PLSH-01)

- **Size:** Increase from current 1.125rem to **1.5rem (24px)** — noticeably larger, clear hierarchy
- **Accent:** **Left border (vertical amber bar)** — 3-4px `var(--accent)` left border on the title block
- **Pattern reuse:** Same visual language as the explain panel border-left — creates consistent Crowe design language
- **Title color:** `var(--foreground)` — full foreground, bold weight (700)
- **Subtitle:** Unchanged — stays at 0.875rem, `var(--muted-color)`, below the amber-accented title

### KPI $ Sign Sizing (PLSH-02)

- **Root cause:** In KpiCard.tsx line 141, the `$` span has `fontSize: '1.1rem', fontWeight: 500` while the parent div has `fontSize: '1.75rem', fontWeight: 700`
- **Fix:** Remove the smaller span override — let `$` inherit the parent 1.75rem size (or set explicitly to `1.75rem, fontWeight: 700`)
- **Scope:** Only the currency prefix span in KpiCard.tsx needs updating — no other files

### Explain Panel Animation (PLSH-03)

- **Spring physics:** Framer Motion spring — `type: 'spring', stiffness: 300, damping: 28` (~400ms natural settle with slight overshoot)
- **Staggered two-step reveal:** Height/container springs open first, then text content fades in with ~80ms delay
- **Implementation:** Two motion.div layers — outer for height spring, inner for text opacity with delay
- **Exit:** Reverse — text fades out fast, then height collapses with spring
- **Overflow:** `overflow: hidden` stays on the outer wrapper to clip during height animation

### Claude's Discretion

- Exact tab row height (suggest 48px)
- Tab text font size (suggest 0.875rem–0.9375rem, not too large)
- Spring stiffness/damping fine-tuning within the ~400ms target
- Whether to use `motion.section` or `motion.div` for tab content wrapper
- Transition direction for tab switch (fade only, no slide — simpler and less disorienting)

</decisions>

<specifics>
## Specific Ideas

- The amber left border on section titles should match the explain panel's existing `borderLeft: '3px solid var(--accent)'` treatment — this creates a visual language where "this is important Crowe-branded content" is signaled consistently
- The $ sign fix is a 2-line change in KpiCard.tsx — very targeted, no layout impact
- Tabs replace the scroll but should feel like they belong to the same design system — not a new nav pattern, but an evolution of the existing header/card vocabulary
- The Scenario tab essentially becomes the old sidebar content, now full-width — the sliders and controls have more room to breathe

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/components/DashboardApp.tsx` — main layout file; two-column (sidebar + main) becomes tab layout here; `SectionWrapper` Framer Motion helper can be reused for tab content
- `src/components/dashboard/DashboardHeader.tsx` — localStorage persistence pattern (`explainMode`, theme toggle) — copy for `activeTab`
- `src/components/ExplainContext.tsx` — React Context with localStorage pattern — same approach for tab state (or simpler: local useState + localStorage in DashboardApp)
- `src/components/dashboard/SectionHeader.tsx` — the file where title treatment (PLSH-01) is implemented; `borderLeft` amber accent added here
- `src/components/dashboard/KpiCard.tsx` — line 141-143: the `$` prefix span needs `fontSize: '1.75rem', fontWeight: 700` to match parent
- `framer-motion` — already installed (^12.x); `AnimatePresence` + `motion.div` available for explain animation and tab transitions

### Established Patterns

- **localStorage + useEffect on mount** — established in DashboardHeader.tsx for theme and ExplainContext.tsx for explain mode; same pattern for activeTab
- **No `'use client'` in section components** — they run inside DashboardApp client boundary; new Tab wrapper does NOT need its own boundary
- **CSS variables for all colors** — `var(--accent)` (#F5A800 amber), `var(--foreground)`, `var(--muted-color)`, `var(--card)`, `var(--border)`
- **Framer Motion variants + AnimatePresence** — established in SectionHeader.tsx explain panel and DashboardApp.tsx section wrapper
- **Spring animation** — not yet used in this project; framer-motion spring available via `transition={{ type: 'spring', stiffness: 300, damping: 28 }}`

### Integration Points

- `DashboardApp.tsx` — primary file: remove sidebar layout, add tab row + tab content switch, move ScenarioPanel into Scenario tab content
- `SectionHeader.tsx` — update title size to 1.5rem + add amber left border wrapper
- `KpiCard.tsx` — fix $ prefix span sizing (2-line change)
- `DashboardHeader.tsx` — no changes needed (stays as-is above tab row)
- Tab content for Overview: `KpiSection` + compact CloseTracker summary + `MarginBridgeSection`
- Tab content for Charts: `ChartsSection` + `MarginBridgeSection`

</code_context>

<deferred>
## Deferred Ideas

- None — all discussion stayed within Phase 11 scope.

</deferred>

---

*Phase: 11-polish-and-tab-navigation*
*Context gathered: 2026-03-05*
