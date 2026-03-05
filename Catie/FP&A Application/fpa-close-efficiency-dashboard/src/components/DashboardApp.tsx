// src/components/DashboardApp.tsx
// "use client" — single client boundary for the entire dashboard.
// Uses makeStore + useRef pattern (NOT module-level singleton) to prevent
// Redux state leaking between SSR requests in Next.js App Router.
'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import type { AppStore } from '@/store';
import type { DashboardSeedData } from '@/lib/dataLoader';
import { initializeFromSeedData } from '@/store/scenarioSlice';
import KpiSection from '@/components/dashboard/KpiSection';
import ScenarioPanel from '@/components/dashboard/ScenarioPanel/ScenarioPanel';
import { CloseTracker } from '@/components/dashboard/CloseTracker/CloseTracker';
import ChartsSection from '@/components/dashboard/ChartsSection/ChartsSection';
import MarginBridgeSection from '@/components/dashboard/MarginBridgeSection/MarginBridgeSection';
import AiSummarySection from '@/components/dashboard/AiSummarySection/AiSummarySection';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { TooltipProvider } from '@/components/ui/Tooltip';

interface DashboardAppProps {
  seedData?: DashboardSeedData;
}

// Section-level entrance animation — fade + slide up 20px
const SECTION_ANIM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

export default function DashboardApp({ seedData }: DashboardAppProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // prefers-reduced-motion check — JS-level (CSS media query doesn't disable Framer Motion)
  // Evaluated inside component body (not module scope) to avoid SSR window access
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Seed Redux store with real financial data from the server.
  // Finds the 'baseline' preset (or first preset) to initialize controls.
  useEffect(() => {
    if (seedData && storeRef.current) {
      const defaultPreset =
        seedData.presets.find(p => p.id === 'baseline') ?? seedData.presets[0];
      storeRef.current.dispatch(
        initializeFromSeedData({
          baseInputs: seedData.baseInputs,
          defaultControls: defaultPreset.controls,
        })
      );
    }
  }, [seedData]);

  // Helper: wrap a section in motion.div for scroll-triggered entrance.
  // viewport margin -60px triggers animation slightly before section is fully visible.
  const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      variants={SECTION_ANIM}
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );

  return (
    <Provider store={storeRef.current}>
      <TooltipProvider delayDuration={300}>
      {/* Two-column layout: 280px sticky sidebar + flex-1 main content.
          alignItems: flex-start ensures sidebar height is its own content height,
          not stretched to match the (much taller) main column. */}
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'flex-start' }}>

        {/* Left sidebar: fixed 280px, sticky, scrollable */}
        <aside
          style={{
            width: '280px',
            flexShrink: 0,
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            position: 'sticky',
            top: 0,
            height: '100vh',
            background: 'var(--card)',
          }}
        >
          {seedData && <ScenarioPanel presets={seedData.presets} />}
        </aside>

        {/* Main content area: flex-1, scrollable */}
        <main style={{ flex: 1, minWidth: 0, padding: '1.5rem', overflowY: 'auto' }}>
          {/* DashboardHeader is NOT animated — it is always visible at the top */}
          {seedData && <DashboardHeader seedData={seedData} />}

          {/* KPI section — stagger handled inside KpiSection.tsx */}
          {seedData ? (
            <KpiSection seedData={seedData} />
          ) : (
            <div id="slot-kpi-section" />
          )}

          {/* Sections 2-5: each wrapped in scroll-triggered motion.div */}
          {seedData && (
            <SectionWrapper>
              <CloseTracker seedData={seedData} />
            </SectionWrapper>
          )}

          <SectionWrapper>
            <MarginBridgeSection />
          </SectionWrapper>

          {seedData && (
            <SectionWrapper>
              <ChartsSection seedData={seedData} />
            </SectionWrapper>
          )}

          {seedData && (
            <SectionWrapper>
              <AiSummarySection seedData={seedData} />
            </SectionWrapper>
          )}

          <p
            style={{
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
              fontSize: '0.75rem',
              opacity: 0.4,
            }}
          >
            FP&amp;A Close Efficiency Dashboard — Phase 10 Visual Identity
          </p>
        </main>
      </div>
      </TooltipProvider>
    </Provider>
  );
}
