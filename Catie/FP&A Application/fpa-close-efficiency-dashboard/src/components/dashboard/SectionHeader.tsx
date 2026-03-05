// src/components/dashboard/SectionHeader.tsx
// Reusable two-line section heading used across all 6 dashboard sections.
// No 'use client' — runs inside DashboardApp client boundary.
// Phase 10: extended with optional explanation prop + AnimatePresence panel.
import { motion, AnimatePresence } from 'framer-motion';
import { useExplainMode } from '@/components/ExplainContext';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  explanation?: string; // Optional locked text per section — shown when explainMode is ON
}

export default function SectionHeader({ title, subtitle, explanation }: SectionHeaderProps) {
  const { explainMode } = useExplainMode();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--foreground)',
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--muted-color)',
          margin: '0.25rem 0 0',
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      {/* Explanation panel — animated open/close via AnimatePresence */}
      <AnimatePresence>
        {explainMode && explanation && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.875rem 1rem',
                background: 'var(--surface)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.875rem',
                color: 'var(--muted-color)',
                lineHeight: 1.65,
              }}
            >
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
