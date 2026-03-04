// src/components/DashboardApp.tsx
// "use client" — single client boundary for the entire dashboard.
// Uses makeStore + useRef pattern (NOT module-level singleton) to prevent
// Redux state leaking between SSR requests in Next.js App Router.
'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import type { AppStore } from '@/store';
import type { DashboardSeedData } from '@/lib/dataLoader';
import { initializeFromSeedData } from '@/store/scenarioSlice';
import KpiSection from '@/components/dashboard/KpiSection';

interface DashboardAppProps {
  seedData?: DashboardSeedData;
}

export default function DashboardApp({ seedData }: DashboardAppProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

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

  return (
    <Provider store={storeRef.current}>
      <div style={{ minHeight: '100vh', padding: '1.5rem' }}>
        <div id="slot-header" />
        {seedData ? (
          <KpiSection seedData={seedData} />
        ) : (
          <div id="slot-kpi-section" />
        )}
        <div id="slot-close-tracker" />
        <div id="slot-scenario-panel" />
        <div id="slot-charts" />
        <div id="slot-ai-summary" />
        <p style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)', margin: 0, fontSize: '0.75rem', opacity: 0.4 }}>
          FP&amp;A Close Efficiency Dashboard — Phase 3 KPI cards active
        </p>
      </div>
    </Provider>
  );
}
