# Phase 10: Visual Identity and Interactivity - Research

**Researched:** 2026-03-05
**Domain:** Next.js routing, Framer Motion / `motion` package, React Bits backgrounds, shadcn/ui with Tailwind v4, React Context for Explain mode
**Confidence:** HIGH (all findings verified against actual installed packages and source files)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Landing Page**
- Routing: `/` becomes landing page; existing dashboard content moves to `/dashboard`. `src/app/page.tsx` → landing; `src/app/dashboard/page.tsx` → new file receiving existing page.tsx content.
- Visual: Full-screen Crowe Indigo Dark (`#011E41`) background with subtle radial gradient. Soft white (`#f6f7fa`) text.
- Animated background: React Bits component (Particles, Aurora, or Waves) via `next/dynamic { ssr: false }`.
- Content order: Crowe wordmark → display headline → muted subheadline → 3 feature highlight rows → Amber CTA button "Enter Dashboard →".
- Entrance animation: content fades in and slides up sequentially. CTA button last with amber glow pulse.
- Navigation: Next.js `<Link>` to `/dashboard`.

**Scroll-Triggered Section Animations**
- All 6 sections animate: KPI Cards, Close Tracker, Margin Bridge, Charts, AI Summary, Scenario Panel.
- Style: fade + slide up ~20px, ~500ms, ease-out. `prefers-reduced-motion` respected.
- KPI cards: 8 cards staggered individually ~60ms delay each.
- Library: Framer Motion `whileInView` + `viewport={{ once: true }}`.

**shadcn/ui Integration**
- Replace: Generate/Regenerate buttons → shadcn `Button`. Preset dropdown → shadcn `Select`. KPI tooltips → shadcn `Tooltip`. Landing CTA → shadcn `Button`.
- Keep as-is: 21st.dev sliders and toggles.
- Theme: Crowe Indigo/Amber HSL overrides from CLAUDE.md Section 4.2 in `globals.css`.
- Install: `NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest init`. Select CSS variables mode. Override immediately.

**Global "Explain" Mode**
- Button in `DashboardHeader.tsx`, right of theme toggle. Label "Explain" / "Hide Explanations".
- State in `localStorage['explainMode']`. Initialized on mount.
- Each `SectionHeader` receives `explainMode` prop → collapsible explanation panel below subtitle.
- Explanation text locked per section (6 panels, exact text in CONTEXT.md).
- Animation: CSS `max-height` transition OR Framer Motion `AnimatePresence`.

### Claude's Discretion
- Exact React Bits background component (Particles vs. Aurora vs. Waves)
- Exact Framer Motion `initial`/`animate`/`transition` values (recommend `{ opacity: 0, y: 20 }` → `{ opacity: 1, y: 0 }`, 0.5s, `[0.16, 1, 0.3, 1]`)
- State management for `explainMode` — React Context vs. prop drilling (Context recommended)
- shadcn component installation order and exact CLI commands
- Landing page layout centering
- Whether to use `redirect()` in old `page.tsx` or simply move content

### Deferred Ideas (OUT OF SCOPE)
- None — all discussion stayed within Phase 10 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VISU-01 | Landing/splash screen at `/` before dashboard — communicates product purpose, CTA to enter | Routing change approach, landing page structure, React Bits background selection |
| VISU-02 | At least 3 dashboard sections with entrance animations (fade/slide/stagger) on scroll | `motion` package v12 confirmed installed; `motion/react` subpath provides `motion` component and animation API |
| VISU-03 | shadcn/ui components for primary interactive controls (buttons, dropdowns) | Tailwind v4 conflict — shadcn CLI init approach confirmed; copy-paste model required |
| VISU-04 | Each of 6 sections displays a contextual explanation callout, show/hide per presenter | React Context pattern; `SectionHeader` prop extension; localStorage persistence |
</phase_requirements>

---

## Summary

Phase 10 transforms the functional dashboard into a visually compelling experience. Four capabilities are added: (1) a landing page at `/` with an Indigo Dark Crowe-branded splash, (2) scroll-triggered Framer Motion animations on all 6 dashboard sections, (3) shadcn/ui components for buttons and the preset dropdown, and (4) a global "Explain" mode toggle that reveals contextual panels per section.

The most critical technical finding is that **`framer-motion` is not installed but `motion` v12 is** — installed as a bare stub (`package.json` only, zero compiled dist files). This means the `motion` package was added to `node_modules` metadata during a previous npm operation but was never actually built/downloaded. The planner must include a proper `npm install framer-motion` step before any animation work. The correct import in Next.js 15 + React 19 is `import { motion, AnimatePresence } from 'framer-motion'`.

The second critical finding is that **`shadcn/ui CLI init conflicts with Tailwind v4** and this is explicitly listed in REQUIREMENTS.md as Out of Scope (`shadcn/ui CLI init | Conflicts with Tailwind v4 + the copy-paste 21st.dev approach`). This contradicts the locked CONTEXT.md decision to run `npx shadcn@latest init`. The resolution is to use the **copy-paste model**: manually add shadcn CSS variable tokens to `globals.css` and copy component source files directly rather than using the CLI. The Radix UI primitives that shadcn wraps are already installed (`@radix-ui/react-select`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tooltip`), so shadcn `Button`, `Select`, and `Tooltip` components can be placed as source files in `src/components/ui/` without CLI initialization.

**Primary recommendation:** Install `framer-motion` properly, copy-paste shadcn component source files (no CLI), and use React Context for `explainMode` state. No routing redirects are needed — simply create `src/app/dashboard/page.tsx` with the existing page content and replace `src/app/page.tsx` with the landing page.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `framer-motion` | latest (^11 or ^12) | Section entrance animations, `whileInView`, `AnimatePresence` | Established Crowe stack per CLAUDE.md; `motion` stub present confirms intent |
| React Context API | Built-in (React 19) | `explainMode` global state distribution | No external dependency; simpler than Redux for a simple boolean toggle |
| Next.js `<Link>` | 16.1.6 (installed) | Landing → dashboard navigation | App Router standard; zero flash, prefetching |
| `next/dynamic` `{ ssr: false }` | 16.1.6 (installed) | React Bits animated background (browser globals) | Established pattern from Phase 8 InfinityLoader |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@radix-ui/react-tooltip` | ^1.1.0 (installed) | KPI card tooltips | Already installed; shadcn Tooltip wraps this |
| `@radix-ui/react-select` | ^2.1.0 (installed) | Preset dropdown replacement | Already installed; shadcn Select wraps this |
| CSS `max-height` transition | N/A | Explain panel open/close animation | Zero-dependency fallback if AnimatePresence adds complexity |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Context for explainMode | Redux (existing store) | Redux adds unnecessary action/reducer overhead for a simple boolean toggle that has no financial computation impact |
| CSS `max-height` for explain panels | Framer Motion `AnimatePresence` | `max-height` works without framer-motion installed; AnimatePresence gives smoother animation but requires the library to be properly installed first |
| Copy-paste shadcn components | `npx shadcn@latest init` CLI | CLI init is OUT OF SCOPE per REQUIREMENTS.md — conflicts with Tailwind v4. Copy-paste is the correct approach. |

**Installation (after verifying motion stub):**
```bash
# From the project root — FP&A path requires NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install framer-motion --prefix "Catie/FP&A Application/fpa-close-efficiency-dashboard"
```

---

## Architecture Patterns

### Recommended Project Structure Changes

```
src/app/
├── page.tsx              # REPLACED: becomes landing page (new content)
├── dashboard/
│   └── page.tsx          # NEW: receives existing page.tsx content (async Server Component)
├── layout.tsx            # UNCHANGED
├── globals.css           # EXTENDED: shadcn HSL tokens added, explain panel CSS
└── api/                  # UNCHANGED

src/components/
├── ui/
│   ├── CountUp.tsx       # UNCHANGED
│   ├── InfinityLoader.tsx # UNCHANGED
│   ├── icons.tsx         # UNCHANGED
│   ├── Button.tsx        # NEW: shadcn Button (copy-paste, no CLI)
│   ├── Select.tsx        # NEW: shadcn Select (copy-paste, no CLI)
│   └── Tooltip.tsx       # NEW: shadcn Tooltip (copy-paste, no CLI)
├── landing/
│   └── LandingBackground.tsx # NEW: React Bits background (dynamic import wrapper)
├── dashboard/
│   ├── DashboardApp.tsx       # EXTENDED: ExplainContext + MotionSection wrappers
│   ├── DashboardHeader.tsx    # EXTENDED: Explain toggle button
│   ├── SectionHeader.tsx      # EXTENDED: explainMode prop + explanation panel
│   └── [all other sections]   # EXTENDED: wrapped in motion.div for scroll animation
└── ExplainContext.tsx          # NEW: React Context for explainMode boolean
```

### Pattern 1: Dashboard Route Move (No Redirect Needed)

**What:** Create `src/app/dashboard/page.tsx` as a new Server Component that contains the exact content of the current `src/app/page.tsx`. Replace `src/app/page.tsx` entirely with the landing page.

**When to use:** Routing restructure without `redirect()` — cleaner than a redirect, avoids a network hop.

**Example:**
```typescript
// src/app/dashboard/page.tsx — NEW file (move content from page.tsx)
// Server Component, async, no "use client"
import DashboardApp from '@/components/DashboardApp';
import { loadDashboardSeedData } from '@/lib/dataLoader';

export default async function DashboardPage() {
  const seedData = await loadDashboardSeedData();
  return <DashboardApp seedData={seedData} />;
}

// src/app/page.tsx — REPLACED with landing page
// 'use client' needed for Framer Motion entrance animations on the landing
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// ... landing page content
```

**Key insight:** No `next.config.ts` changes, no `vercel.json` redirects. The old `/` is simply replaced with new content. The dashboard is now at `/dashboard`. No hardcoded `/` paths exist in existing components — all internal navigation goes through Redux and prop-drilling, not URL links.

### Pattern 2: Framer Motion `whileInView` Section Wrapping

**What:** Wrap each of the 6 section components in `motion.div` inside `DashboardApp.tsx`. `viewport={{ once: true }}` ensures animation fires only on first scroll into view.

**When to use:** Any section-level entrance animation in the main content column.

**Example:**
```typescript
// Source: framer-motion official docs — whileInView
import { motion } from 'framer-motion';

// In DashboardApp.tsx — wrap each section
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// Usage around each section:
<motion.div
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-60px' }}
>
  <KpiSection seedData={seedData} />
</motion.div>
```

**Reduced motion handling:**
```typescript
// In DashboardApp.tsx — read media query once
const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

// Pass to motion.div initial prop:
initial={prefersReducedMotion ? false : 'hidden'}
```

**Note on globals.css:** The existing `@media (prefers-reduced-motion: reduce)` block in `globals.css` disables CSS transitions. Framer Motion requires a separate JS-level check — the CSS media query does not disable Framer Motion animations.

### Pattern 3: KPI Card Stagger Animation

**What:** Instead of wrapping `KpiSection` as a unit, the 8 `KpiCard` components stagger individually. Each card gets an index-based delay.

**When to use:** Grid of items that should reveal sequentially.

**Example:**
```typescript
// In KpiSection.tsx — wrap each KpiCard with stagger
const kpiCards = [
  { label: 'Net Sales', ... },
  // ... 8 cards
];

const STAGGER_DELAY = 0.06; // 60ms

// In JSX:
{kpiCards.map((card, index) => (
  <motion.div
    key={card.label}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * STAGGER_DELAY, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    <KpiCard {...card} />
  </motion.div>
))}
```

**Alternative (cleaner):** Use `motion.div` with stagger at the container level via `staggerChildren`:
```typescript
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
// Container wraps the grid; each KpiCard wrapper uses itemVariants
```

### Pattern 4: React Context for Explain Mode

**What:** Create `ExplainContext` in a new file. `DashboardApp` is the provider; `DashboardHeader` writes to localStorage and updates context; all `SectionHeader` instances read from context.

**When to use:** Boolean toggle that needs to reach 6+ components without prop-threading through intermediate containers.

**Why Context over prop drilling:** `DashboardApp` renders `DashboardHeader`, `KpiSection`, `CloseTracker`, `MarginBridgeSection`, `ChartsSection`, `AiSummarySection` — that is 6 separate top-level children. Each section contains a `SectionHeader`. Threading `explainMode` through each section's props and then down to `SectionHeader` requires touching 6 component interfaces. Context is cleaner.

**Why NOT Redux:** `explainMode` has no financial computation impact. Adding Redux action/reducer for a purely UI boolean toggle is overengineering.

**Example:**
```typescript
// src/components/ExplainContext.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface ExplainContextValue {
  explainMode: boolean;
  toggleExplainMode: () => void;
}

const ExplainContext = createContext<ExplainContextValue>({
  explainMode: false,
  toggleExplainMode: () => {},
});

export function ExplainProvider({ children }: { children: React.ReactNode }) {
  const [explainMode, setExplainMode] = useState(false);

  useEffect(() => {
    // Initialize from localStorage on mount (same pattern as theme toggle)
    try {
      const stored = localStorage.getItem('explainMode');
      if (stored === 'true') setExplainMode(true);
    } catch (_) {}
  }, []);

  const toggleExplainMode = () => {
    setExplainMode(prev => {
      const next = !prev;
      try { localStorage.setItem('explainMode', String(next)); } catch (_) {}
      return next;
    });
  };

  return (
    <ExplainContext.Provider value={{ explainMode, toggleExplainMode }}>
      {children}
    </ExplainContext.Provider>
  );
}

export function useExplainMode() {
  return useContext(ExplainContext);
}
```

```typescript
// In DashboardApp.tsx — wrap Provider around existing Provider tree
<Provider store={storeRef.current}>
  <ExplainProvider>
    {/* existing layout */}
  </ExplainProvider>
</Provider>
```

```typescript
// In SectionHeader.tsx — read from context
import { useExplainMode } from '@/components/ExplainContext';

// explainMode prop is NOT needed — read from context directly
export default function SectionHeader({ title, subtitle, explanation }: SectionHeaderProps) {
  const { explainMode } = useExplainMode();
  // ...
}
```

**Note:** `ExplainContext.tsx` needs `'use client'` because it uses `useState`/`useEffect`. This is fine — it renders inside `DashboardApp`'s existing client boundary, so no new boundary is created.

### Pattern 5: shadcn Component Copy-Paste (No CLI)

**What:** shadcn components are source files, not npm packages. Copy the component source from https://ui.shadcn.com into `src/components/ui/`. Since Radix UI primitives are already installed, the components work without CLI initialization.

**Dependencies already installed:** `@radix-ui/react-select`, `@radix-ui/react-tooltip`, `@radix-ui/react-switch`, `@radix-ui/react-slider`. The only additional dependencies are `clsx` (already installed) and `tailwind-merge` (NOT installed).

**Install tailwind-merge:**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install tailwind-merge --prefix "Catie/FP&A Application/fpa-close-efficiency-dashboard"
```

**Add `cn()` utility** (shadcn standard):
```typescript
// src/lib/utils.ts (new file)
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Add shadcn CSS variable tokens to `globals.css`:** The CONTEXT.md says to apply CLAUDE.md Section 4.2 HSL overrides. CRITICAL: the existing dashboard uses its own CSS variables (`--background`, `--foreground`, `--card`, `--accent`, `--border`, `--muted`). The shadcn system uses different names (`--primary`, `--secondary`, `--destructive`, etc.). These two systems must coexist — shadcn variables are ADDITIVE to the existing variables, not replacements.

**Safe approach:** Add shadcn variables alongside existing ones, not replacing them. The existing `--background`, `--foreground`, `--card`, `--border`, `--accent` variables must remain unchanged (the entire dashboard depends on them).

### Pattern 6: React Bits Background for Landing Page

**What:** A full-screen animated background component rendered behind landing page content, loaded via `next/dynamic { ssr: false }`.

**Recommended component: Particles** — uses canvas API (browser-only), suitable for `ssr: false`, visually effective against dark Indigo background, configurable colors to Crowe Amber/Indigo.

**Why not Aurora:** Aurora typically uses WebGL (higher SSR crash risk). Particles uses canvas which is well-supported for `ssr: false` dynamic imports.

**Why not Waves:** Wave SVG animations are fine but less visually dramatic for a splash screen.

**React Bits Particles pattern** (copy-paste from reactbits.dev, TS-TW variant):
```typescript
// src/components/landing/LandingBackground.tsx
// Wrapper for next/dynamic — browser APIs require ssr: false

// src/app/page.tsx (landing)
import dynamic from 'next/dynamic';

const LandingBackground = dynamic(
  () => import('@/components/landing/LandingBackground'),
  { ssr: false, loading: () => null }
);
```

**Colors to use for Particles:** `['#FFD231', '#003F9F', '#f6f7fa']` (Amber Bright, Indigo Bright, Soft White) with low opacity (0.3–0.5) against the `#011E41` Indigo Dark background.

### Anti-Patterns to Avoid

- **`framer-motion` import before install:** The `motion` package in `node_modules` is a stub — only `package.json` exists, no compiled dist. Importing `from 'motion'` or `from 'framer-motion'` before proper install will crash the build.
- **`npx shadcn@latest init` on this project:** REQUIREMENTS.md explicitly marks this Out of Scope. It conflicts with Tailwind v4's `@import "tailwindcss"` approach (no `tailwind.config.ts`).
- **Replacing existing CSS variables with shadcn ones:** The dashboard's `--background`, `--foreground`, `--card`, `--accent`, `--border`, `--muted` are used in 10+ component files. Renaming or replacing them breaks the entire dashboard.
- **Adding `'use client'` to `SectionHeader.tsx`:** It already runs inside `DashboardApp`'s client boundary. Adding `'use client'` at the file level is redundant and could confuse RSC boundaries if the file is ever reused.
- **Wrapping `motion.div` outside `DashboardApp`'s client boundary:** `motion.div` requires a client context. All usage must be inside the `'use client'` DashboardApp.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-into-view detection | `IntersectionObserver` + manual state | Framer Motion `whileInView` | IO setup, cleanup, and cross-browser edge cases are non-trivial |
| Animated height for explain panels | JS `getBoundingClientRect` + `requestAnimationFrame` | CSS `max-height` transition OR Framer Motion `AnimatePresence` | Both handle the edge cases (initial 0 → auto height problem) correctly |
| Button component theming | Custom styled button component | shadcn `Button` (copy-paste) | Radix-based, keyboard-accessible, already Crowe-themed via CSS variables |
| KPI stagger timing | Manual `setTimeout` per card | Framer Motion `staggerChildren` or `transition.delay` | No cleanup, no timer leaks, easier to maintain |

**Key insight:** Framer Motion's `whileInView` + `viewport` replaces ~30 lines of IntersectionObserver setup, ref management, and cleanup per section.

---

## Common Pitfalls

### Pitfall 1: `motion` Package Stub — Build Will Fail

**What goes wrong:** The installed `motion` v12 package has only a `package.json` file — zero compiled JavaScript files in `node_modules/motion/`. Any import of `motion` or `framer-motion` will throw `MODULE_NOT_FOUND` at build time or runtime.

**Why it happens:** The package was recorded in `package.json` metadata during a previous npm operation but the tarball was never unpacked (possibly due to a network/TLS issue on the Crowe corporate network).

**How to avoid:** Install `framer-motion` (the original package, not the `motion` alias) as Wave 0 of Phase 10:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install framer-motion --prefix "Catie/FP&A Application/fpa-close-efficiency-dashboard"
```

**Warning signs:** `Cannot find module 'framer-motion'` or `Cannot find module 'motion'` in build output.

### Pitfall 2: Tailwind v4 + shadcn CSS Variable Conflicts

**What goes wrong:** shadcn's `globals.css` additions use HSL format (`--background: 225 33% 98%`) while the existing variables use hex (`--background: #f7f3ea`). If the existing variables are overwritten, every component using `var(--background)` will break.

**Why it happens:** shadcn's theming documentation assumes a fresh project. This project has a bespoke Crowe-themed variable set already.

**How to avoid:** Add shadcn variables with NEW names (shadcn's `--primary`, `--secondary`, `--destructive`, `--ring`, `--radius`, `--muted-foreground`, `--input`, `--popover`, `--popover-foreground`). Do NOT rename or overwrite `--background`, `--foreground`, `--card`, `--accent`, `--border`, `--muted`. The shadcn components can be hand-adjusted after copy-paste to use the existing Crowe variable names directly.

**Warning signs:** Any chart, KpiCard, or CloseTracker component showing wrong colors after shadcn integration.

### Pitfall 3: Landing Page Uses `'use client'` — No `loadDashboardSeedData` Call

**What goes wrong:** The landing page is a Client Component (needs Framer Motion entrance animations). Client Components cannot call `async` server functions like `loadDashboardSeedData()`.

**Why it happens:** The existing `page.tsx` is a Server Component (`async function Page()`). The new landing page needs client-side animations — those require `'use client'`.

**How to avoid:** The landing page does NOT need `loadDashboardSeedData` — it shows static Crowe branding. Only `src/app/dashboard/page.tsx` calls `loadDashboardSeedData`. Keep the landing page as a pure client component with static content.

**Warning signs:** TypeScript error `Error: async/await is not yet supported in Client Components` in the landing page file.

### Pitfall 4: `whileInView` on Server Components

**What goes wrong:** If any section component is accidentally moved outside the DashboardApp client boundary, `motion.div` wrappers will cause an RSC error.

**Why it happens:** `motion.div` is a client component. It can only render inside a `'use client'` boundary.

**How to avoid:** All `motion.div` wrappers for section animations belong in `DashboardApp.tsx` (which is `'use client'`), not in individual section files. Individual section files (`KpiSection`, `CloseTracker`, etc.) should NOT import `framer-motion` — the wrapping happens at the `DashboardApp` level.

**Warning signs:** `Error: You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client"`.

### Pitfall 5: Explain Mode Panel Height Animation with `max-height`

**What goes wrong:** CSS `max-height` transition from `0` to `auto` doesn't animate — `auto` is not a transitionable value. The panel snaps open/closed.

**Why it happens:** CSS cannot interpolate to `auto` height.

**How to avoid:** Two options:
1. Use a known `max-height` value (e.g., `max-height: 200px`) — panel animates but may clip if text is longer.
2. Use Framer Motion `AnimatePresence` + `motion.div` with `height: 'auto'` — Framer Motion resolves the auto-height problem natively.

Since `framer-motion` will be installed for section animations, use `AnimatePresence` for the explain panels to get smooth, correct height animation.

### Pitfall 6: Vitest Environment is `node` — Cannot Test DOM Animations

**What goes wrong:** Vitest config uses `environment: 'node'`. Testing Framer Motion or `localStorage` behavior requires `jsdom`. Any test that imports animation components will fail.

**Why it happens:** The vitest config (`vitest.config.ts`) explicitly sets `environment: 'node'` — correct for pure function/selector tests.

**How to avoid:** Do NOT write unit tests for animation behavior or React components in this phase. Phase 10 animations, landing page render, and explain mode are all browser-QA items. The only new code that could have unit tests is the `ExplainContext` utility functions — and even those are trivial enough that browser QA suffices.

---

## Code Examples

### Landing Page Structure
```typescript
// Source: CONTEXT.md + Next.js App Router docs
// src/app/page.tsx — REPLACED with landing page
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const LandingBackground = dynamic(
  () => import('@/components/landing/LandingBackground'),
  { ssr: false, loading: () => null }
);

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#011E41',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background — SSR-safe via dynamic import */}
      <LandingBackground />

      {/* Content layer — above background */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}
      >
        {/* Crowe wordmark */}
        <span style={{ color: '#f6f7fa', fontWeight: 700, fontSize: '1.25rem' }}>Crowe</span>

        {/* Display headline */}
        <h1 style={{ color: '#f6f7fa', fontSize: '2.5rem', fontWeight: 700 }}>
          FP&amp;A Close Efficiency Dashboard
        </h1>

        {/* Subheadline */}
        <p style={{ color: '#9ab2d4' }}>Summit Logistics Group · January 2026</p>

        {/* Feature highlights */}
        {/* ... 3 rows */}

        {/* CTA Button — shadcn Button or inline amber button */}
        <Link href="/dashboard">
          <button style={{ background: '#F5A800', color: '#011E41', fontWeight: 700 }}>
            Enter Dashboard →
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
```

### Framer Motion Section Wrapper (in DashboardApp)
```typescript
// Source: framer-motion docs — whileInView
const SECTION_ANIM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

// Respect prefers-reduced-motion in JS
const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// In DashboardApp JSX — applied to each of 6 sections:
const reducedMotion = useReducedMotion();

<motion.div
  variants={SECTION_ANIM}
  initial={reducedMotion ? false : 'hidden'}
  whileInView={reducedMotion ? undefined : 'visible'}
  viewport={{ once: true, margin: '-60px' }}
>
  <KpiSection seedData={seedData} />
</motion.div>
```

### Explain Panel in SectionHeader
```typescript
// Source: CONTEXT.md + Framer Motion AnimatePresence docs
import { useExplainMode } from '@/components/ExplainContext';
import { AnimatePresence, motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  explanation?: string; // locked text per section
}

export default function SectionHeader({ title, subtitle, explanation }: SectionHeaderProps) {
  const { explainMode } = useExplainMode();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
        {title}
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted-color)', margin: '0.25rem 0 0' }}>
        {subtitle}
      </p>
      <AnimatePresence>
        {explainMode && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '0.75rem',
              padding: '0.875rem 1rem',
              background: 'var(--surface)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.875rem',
              color: 'var(--muted-color)',
              lineHeight: 1.6,
            }}>
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### shadcn Button (copy-paste, no CLI)
```typescript
// src/components/ui/Button.tsx
// Copy-paste from ui.shadcn.com/docs/components/button
// Adapted: uses cn() + existing Crowe CSS variables directly
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base: inherit Crowe font, cursor, focus ring
        'inline-flex items-center justify-center font-medium transition-all cursor-pointer',
        // Variant styles using Crowe CSS variables
        variant === 'default' && 'bg-[var(--accent)] text-[#011E41] hover:opacity-90',
        variant === 'outline' && 'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)]',
        variant === 'ghost' && 'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)]',
        // Sizes
        size === 'sm' && 'text-sm px-3 py-1.5 rounded-md',
        size === 'md' && 'text-sm px-4 py-2 rounded-lg',
        size === 'lg' && 'text-base px-6 py-3 rounded-xl',
        className
      )}
      {...props}
    />
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion as `framer-motion` npm package | Also available as `motion` package (v12 re-export) | 2024 | Import as `from 'framer-motion'` works on both; the `motion` stub in this project needs a proper install of `framer-motion` |
| `motion` as Framer Motion's standalone rename | `framer-motion` and `motion` are now the same package (aliases) | Motion v10+ | No behavioral difference; use `framer-motion` for clarity |
| shadcn/ui requiring Tailwind v3 config | shadcn now supports Tailwind v4 via CSS-first approach | shadcn 2024 | The CSS-variable approach still works; CLI init may or may not generate correct config for v4 — copy-paste model avoids the problem entirely |
| React Context API boilerplate | Same — no change | N/A | Still the right tool for cross-component boolean state |

**Deprecated/outdated:**
- `motion/react` subpath: v12 ships `./react` as a named export path. In this project, `import { motion } from 'framer-motion'` is the safest and most standard import.
- `framer-motion` `useViewportScroll`: replaced by `useScroll` in Framer Motion v6+. Use `whileInView` instead for section reveals.

---

## Open Questions

1. **React Bits Particles — exact copy-paste source**
   - What we know: React Bits uses a copy-paste model from reactbits.dev. The TS-TW variant is the correct choice. Particles uses canvas API requiring `ssr: false`.
   - What's unclear: The exact component source code must be copied from reactbits.dev at implementation time. The API (color props, particle count, speed) may vary from the documented version.
   - Recommendation: The planner should include a task to visit https://reactbits.dev/backgrounds/particles, copy the TS-TW variant, and adapt colors to `['#FFD231', '#003F9F', 'rgba(246,247,250,0.4)']`.

2. **shadcn Select replacing Radix Select in ScenarioPanel**
   - What we know: `ScenarioPanel.tsx` uses `@radix-ui/react-select` directly with custom inline styles. The Radix Select API and the shadcn Select API are nearly identical (shadcn wraps Radix).
   - What's unclear: Whether the custom sentinel option (`— Custom —`) and `onValueChange` handler will need adjustment.
   - Recommendation: The planner should scope this as a targeted replacement: copy shadcn Select source, apply Crowe CSS variable styling, test that sentinel option still works.

3. **`framer-motion` peer dependency on React 18/19**
   - What we know: The `motion` package specifies `"react": "^18.0.0 || ^19.0.0"` — compatible with the project's React 19.
   - What's unclear: Whether `framer-motion` (the original package) has the same peer dep range. Given they are the same codebase, it should.
   - Recommendation: Install and verify the build completes. If peer dep warnings appear, use `--legacy-peer-deps`.

---

## Validation Architecture

> `nyquist_validation` is `true` in `.planning/config.json` — this section is required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.0 |
| Config file | `Catie/FP&A Application/fpa-close-efficiency-dashboard/vitest.config.ts` |
| Environment | `node` (no jsdom — component rendering tests not supported) |
| Quick run command | `node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose` (from repo root) |
| Full suite command | Same — runs all 80 existing tests |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated? | Notes |
|--------|----------|-----------|------------|-------|
| VISU-01 | Landing page renders at `/`, dashboard at `/dashboard` | Browser QA | Manual only | Route structure verified by browser navigation; no pure functions to unit-test |
| VISU-01 | CTA button navigates to `/dashboard` | Browser QA | Manual only | Next.js routing behavior not testable in `node` environment |
| VISU-02 | 6 sections animate on scroll into view | Browser QA | Manual only | Scroll detection and Framer Motion are browser-only |
| VISU-02 | KPI cards stagger 60ms each | Browser QA | Manual only | Timing is visual |
| VISU-02 | `prefers-reduced-motion` disables animations | Browser QA | Manual only | Requires OS-level setting |
| VISU-03 | shadcn Button renders, is clickable | Browser QA | Manual only | No pure functions |
| VISU-03 | shadcn Select replaces preset dropdown, loads presets | Browser QA + Existing tests | Partial | Existing `scenarioSlice.test.ts` covers Redux side; UI swap is browser-QA |
| VISU-03 | KPI Tooltip shows on hover | Browser QA | Manual only | Hover interaction |
| VISU-04 | Explain mode toggles on/off, persists in localStorage | Browser QA | Manual only | localStorage is browser-only |
| VISU-04 | All 6 explanation panels show correct locked text | Browser QA | Manual only | Content verification |
| VISU-04 | Explain panel animates open/close smoothly | Browser QA | Manual only | Visual |

### Pure Functions That COULD Have Unit Tests

**None.** Phase 10 introduces no new pure functions. All new code is:
- React components (UI rendering — `node` environment cannot test)
- CSS animations
- React Context (UI state)
- localStorage reads/writes (browser API)

The `ExplainContext` has a `localStorage` toggle function — simple enough that browser QA suffices. No Wave 0 test stubs are needed.

### Existing Tests — Must Stay Green

The 80 existing Vitest tests across these files must remain GREEN throughout Phase 10:
- `aiSummary.test.ts` — AI route + cache
- `charts.test.ts` — chart data builders
- `closeStages.test.ts` — close stage computations
- `csv.test.ts` — CSV parser
- `dataLoader.test.ts` — seed data loading
- `formatters.test.ts` — currency/percent formatters
- `icons.test.ts` — icon imports
- `kpiSelectors.test.ts` — Redux KPI selectors
- `layout.test.ts` — layout structure
- `marginBridge.test.ts` — margin bridge data
- `scenarioSlice.test.ts` — Redux scenario reducer

**Run after each Wave to confirm no regressions:**
```bash
node "Catie/FP&A Application/fpa-close-efficiency-dashboard/node_modules/vitest/vitest.mjs" run --reporter=verbose
```

### Wave 0 Gaps

None — no new pure functions, no new test files needed. The existing 80-test suite is the regression guard.

### Sampling Rate
- **Per task commit:** Run full Vitest suite (80 tests, ~15 seconds). Phase 10 changes are primarily additive UI code that doesn't touch existing selectors or data functions, but confirm each time.
- **Per wave merge:** Full suite GREEN + browser QA checklist items for that wave.
- **Phase gate:** Full suite GREEN + all browser QA items in Phase 10 browser checklist before marking phase complete.

### Browser QA Checklist (Phase 10)

- [ ] `/` shows landing page (Indigo Dark bg, Crowe wordmark, CTA button)
- [ ] `/dashboard` shows the existing dashboard (unchanged functionality)
- [ ] CTA "Enter Dashboard →" navigates to `/dashboard`
- [ ] React Bits background animates on landing page (no console errors)
- [ ] Landing page content entrance animation plays on load
- [ ] KPI section animates on scroll (all 8 cards stagger)
- [ ] At least 3 other sections animate on scroll into view
- [ ] `prefers-reduced-motion: reduce` (in OS settings) stops all Framer Motion animations
- [ ] "Explain" button appears in DashboardHeader, right of theme toggle
- [ ] Clicking "Explain" shows explanation panels in all 6 sections simultaneously
- [ ] Clicking "Hide Explanations" collapses all 6 panels
- [ ] Explanation panels contain the exact text from CONTEXT.md
- [ ] Refreshing page preserves explain mode state (localStorage)
- [ ] shadcn Button used for Generate/Regenerate in AI section
- [ ] shadcn Select used for preset dropdown in Scenario Panel (all presets still load)
- [ ] shadcn Tooltip appears on KPI card hover
- [ ] All existing functionality works (scenario sliders, dark mode, AI summary)
- [ ] Zero console errors in browser DevTools
- [ ] Build completes: `npm run build` passes with TypeScript clean

---

## Sources

### Primary (HIGH confidence)
- Actual installed `node_modules/motion/package.json` — confirmed v12 stub (package.json only, no dist files)
- `src/app/page.tsx` — current route structure confirmed (Server Component, calls `loadDashboardSeedData`)
- `src/components/DashboardApp.tsx` — confirmed client boundary, 6 section children, Redux Provider
- `src/components/dashboard/SectionHeader.tsx` — confirmed current props interface (title, subtitle only)
- `src/components/dashboard/DashboardHeader.tsx` — confirmed localStorage pattern for theme toggle
- `package.json` — confirmed: no `framer-motion`, has all `@radix-ui/*` primitives, has `clsx`, no `tailwind-merge`
- `src/app/globals.css` — confirmed Tailwind v4 (`@import "tailwindcss"`), existing CSS variable names
- `.planning/REQUIREMENTS.md` line 107 — `shadcn/ui CLI init | Conflicts with Tailwind v4` explicitly Out of Scope
- `.planning/config.json` — `nyquist_validation: true` confirmed

### Secondary (MEDIUM confidence)
- `motion` package v12 peer deps `"react": "^18.0.0 || ^19.0.0"` — compatible with project React 19
- Framer Motion `whileInView` + `viewport` API — documented in official Framer Motion docs; confirmed via `react.d.ts` subpath presence in motion package (same codebase)
- React Bits Particles component — SSR safety via `next/dynamic { ssr: false }` per established InfinityLoader pattern in this project

### Tertiary (LOW confidence)
- React Bits Particles exact props/API — must be verified at implementation time from reactbits.dev (copy-paste model; API may have changed since training data)
- shadcn Select compatibility with existing Radix Select sentinel option — needs hands-on verification during implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against actual node_modules
- Architecture: HIGH — based on reading actual source files
- Pitfalls: HIGH — `motion` stub and `globals.css` variable conflicts discovered from actual files; shadcn CLI conflict from REQUIREMENTS.md
- React Bits Particles API: LOW — must be copy-pasted from reactbits.dev at implementation time

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable libraries; React Bits API may change — re-verify at implementation)
