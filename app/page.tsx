"use client";

import { useMemo, useState } from "react";
import { SummaryDrawer } from "@/components/executive/summary-drawer";
import { LeftControls } from "@/components/shell/left-controls";
import { LeftNav } from "@/components/shell/left-nav";
import { TabHeader } from "@/components/shell/tab-header";
import { TopBanner } from "@/components/shell/top-banner";
import { UploadModal } from "@/components/upload/upload-modal";
import CloseCommandCenterFeature from "@/features/close-command-center";
import CashWorkingCapitalFeature from "@/features/cash-working-capital";
import DataExplorerFeature from "@/features/data-explorer";
import OverviewFeature from "@/features/overview";
import ReadmeDefinitionsFeature from "@/features/readme-definitions";
import RiskIndicatorsFeature from "@/features/risk-indicators";
import ScenarioLeversFeature from "@/features/scenario-levers";
import VarianceDriversFeature from "@/features/variance-drivers";
import { useDashboardStore } from "@/lib/state/dashboardStore";

const controlsEnabledTabs = new Set([
  "overview",
  "risk-indicators",
  "scenario-levers",
  "cash-working-capital",
  "variance-drivers",
]);

export default function Home() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(true);

  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const filters = useDashboardStore((s) => s.filters);
  const levers = useDashboardStore((s) => s.levers);
  const setFilter = useDashboardStore((s) => s.setFilter);
  const setLever = useDashboardStore((s) => s.setLever);
  const resetLevers = useDashboardStore((s) => s.resetLevers);
  const setUploadResult = useDashboardStore((s) => s.setUploadResult);

  const showControls = controlsEnabledTabs.has(activeTab);

  const content = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return <OverviewFeature />;
      case "close-command-center":
        return <CloseCommandCenterFeature />;
      case "risk-indicators":
        return <RiskIndicatorsFeature />;
      case "scenario-levers":
        return <ScenarioLeversFeature />;
      case "cash-working-capital":
        return <CashWorkingCapitalFeature />;
      case "variance-drivers":
        return <VarianceDriversFeature />;
      case "data-explorer":
        return <DataExplorerFeature />;
      case "readme-definitions":
        return <ReadmeDefinitionsFeature />;
      default:
        return <OverviewFeature />;
    }
  }, [activeTab]);

  return (
    <div className="p-4 md:p-6">
      {showUpload && (
        <UploadModal
          onDone={(success, issues) => {
            setUploadResult({ success, issues, usedFallback: !success });
            setShowUpload(false);
          }}
        />
      )}
      <SummaryDrawer open={summaryOpen} onClose={() => setSummaryOpen(false)} />

      <div className="mx-auto max-w-[1600px] space-y-4">
        <TopBanner onOpenSummary={() => setSummaryOpen(true)} />

        <div className={showControls ? "grid gap-4 xl:grid-cols-[260px_360px_1fr]" : "grid gap-4 xl:grid-cols-[260px_1fr]"}>
          <LeftNav activeTab={activeTab} onChange={setActiveTab} />
          {showControls ? <LeftControls filters={filters} levers={levers} setFilter={setFilter} setLever={setLever} resetLevers={resetLevers} /> : null}
          <main className="space-y-4">
            <TabHeader activeTab={activeTab} onChange={setActiveTab} />
            {content}
          </main>
        </div>
      </div>
    </div>
  );
}
