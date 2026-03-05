// src/components/dashboard/SectionHeader.tsx
// Reusable two-line section heading used across all 6 dashboard sections.
// No 'use client' — runs inside DashboardApp client boundary.

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <h2
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--muted-color)',
          margin: '0.125rem 0 0',
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
