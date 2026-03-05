// src/components/dashboard/CloseTracker/CloseTracker.tsx
// Section container: renders header + DaysToCloseCard + 6x StageCard from seedData.
// No "use client" — runs inside DashboardApp client boundary.
import type { DashboardSeedData } from '@/lib/dataLoader';
import { DaysToCloseCard } from './DaysToCloseCard';
import { StageCard } from './StageCard';
import SectionHeader from '@/components/dashboard/SectionHeader';

interface CloseTrackerProps {
  seedData: DashboardSeedData;
}

export function CloseTracker({ seedData }: CloseTrackerProps) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <SectionHeader
        title="Close Tracker"
        subtitle="Month-End Close Progress — Journal entry completion rates and days remaining to close target"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <DaysToCloseCard days={seedData.company.closeTargetBusinessDays} />
        {seedData.closeStages.map((stage) => (
          <StageCard key={stage.name} stage={stage} />
        ))}
      </div>
    </section>
  );
}
