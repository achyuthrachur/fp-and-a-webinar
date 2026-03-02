import type { SummaryDocument } from "@/lib/types";

export function exportSummaryMarkdown(summary: SummaryDocument): string {
  const sections = summary.sections.map((section) => `## ${section.heading}\n\n${section.body}`).join("\n\n");
  return `# ${summary.title}\n\nGenerated: ${summary.generatedAt}\n\n${sections}`;
}

export function downloadMarkdown(markdown: string): void {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "closevision-executive-summary.md";
  link.click();
  URL.revokeObjectURL(url);
}
