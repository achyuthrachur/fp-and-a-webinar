// src/components/dashboard/DashboardHeader.tsx
// Sticky header bar for the main content column.
// No 'use client' — runs inside DashboardApp client boundary.
import { useState, useEffect, useCallback } from 'react';
import { Sun1, Moon } from '@/components/ui/icons';
import type { DashboardSeedData } from '@/lib/dataLoader';
import { useExplainMode } from '@/components/ExplainContext';

interface DashboardHeaderProps {
  seedData: DashboardSeedData;
}

export default function DashboardHeader({ seedData }: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (_) {}
  }, []);

  const { explainMode, toggleExplainMode } = useExplainMode();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        background: isDark ? 'var(--card)' : '#ffffff',
        borderBottom: '1px solid var(--border)',
        // Cancel parent <main> padding (1.5rem) on left, right, and top edges
        marginLeft: '-1.5rem',
        marginRight: '-1.5rem',
        marginTop: '-1.5rem',
        width: 'calc(100% + 3rem)',
        marginBottom: '1.5rem',
      }}
    >
      {/* Left: Crowe wordmark */}
      <span
        style={{
          fontWeight: 700,
          fontSize: '1.125rem',
          color: isDark ? '#e7eef8' : '#011E41',
          fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        Crowe
      </span>

      {/* Center: company name + period label (from baseline preset label) */}
      <span
        style={{
          color: 'var(--foreground)',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {seedData.company.name} — {
          (seedData.presets.find(p => p.id === 'baseline') ?? seedData.presets[0])?.label
        }
      </span>

      {/* Right controls: Explain button + theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Explain mode toggle */}
        <button
          onClick={toggleExplainMode}
          aria-label={explainMode ? 'Hide explanation panels' : 'Show explanation panels'}
          aria-pressed={explainMode}
          style={{
            padding: '0.3125rem 0.75rem',
            borderRadius: 6,
            border: explainMode ? '1px solid var(--accent)' : '1px solid var(--border)',
            background: explainMode ? 'var(--accent-soft)' : 'transparent',
            color: explainMode ? 'var(--accent)' : 'var(--muted)',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {explainMode ? 'Hide Explanations' : 'Explain'}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted)',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 6,
          }}
        >
          {isDark
            ? <Sun1 size={20} color="var(--accent)" />
            : <Moon size={20} color="var(--foreground)" />
          }
        </button>
      </div>
    </header>
  );
}
