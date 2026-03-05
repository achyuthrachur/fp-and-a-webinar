import type { DashboardSeedData } from '@/lib/dataLoader';
import PipelineChart from './PipelineChart';
import ArAgingChart from './ArAgingChart';
import CashFlowChart from './CashFlowChart';
import SectionHeader from '@/components/dashboard/SectionHeader';

interface ChartsSectionProps {
  seedData: DashboardSeedData;
}

export default function ChartsSection({ seedData }: ChartsSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
      <SectionHeader
        title="Pipeline & Collections Health"
        subtitle="AR aging risk, CRM pipeline funnel, and 13-week cash outlook"
      />
      {/* Top row: Pipeline (left ~50%) + AR Aging (right ~50%) */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <PipelineChart data={seedData.crmPipeline} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ArAgingChart data={seedData.arAging} ar90Ratio={seedData.ar90Ratio} />
        </div>
      </div>
      {/* Bottom row: full-width Cash Flow */}
      <CashFlowChart data={seedData.cash13Week} />
    </div>
  );
}
