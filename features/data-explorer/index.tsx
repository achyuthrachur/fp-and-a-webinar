"use client";

import { DataGrid } from "@/components/tables/data-grid";
import { SchemaInspector } from "@/components/tables/schema-inspector";
import { useDashboardStore } from "@/lib/state/dashboardStore";

const tableMap = {
  periods: "periods",
  closeTasks: "closeTasks",
  cash13Week: "cash13Week",
  arAging: "arAging",
  apAging: "apAging",
  varianceDrivers: "varianceDrivers",
  customerCashRisk: "customerCashRisk",
} as const;

export default function DataExplorerFeature() {
  const data = useDashboardStore((s) => s.filtered);
  const key = "periods";
  const rows = data[tableMap[key]] as unknown[];
  const columns = rows[0] ? Object.keys(rows[0] as object) : [];

  return (
    <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <DataGrid data={rows} />
      <SchemaInspector columns={columns} />
    </section>
  );
}
