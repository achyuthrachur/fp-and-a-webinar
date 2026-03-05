// src/components/dashboard/SectionHeader.tsx
// Reusable two-line section heading used across all 6 dashboard sections.
// No 'use client' — runs inside DashboardApp client boundary.

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
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
    </div>
  );
}
