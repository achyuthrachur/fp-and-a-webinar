import { DashboardApp } from "@/components/DashboardApp";
import { loadDashboardSeedData } from "@/lib/dataLoader";

export default async function Home() {
  const seed = await loadDashboardSeedData();

  return (
    <DashboardApp
      companyName={seed.company.name}
      periodLabel="Jan 2026"
      presets={seed.presets}
      baseInputs={seed.baseInputs}
      ar90Ratio={seed.ar90Ratio}
      closeStages={seed.closeStages}
    />
  );
}
