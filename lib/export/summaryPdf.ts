import { jsPDF } from "jspdf";
import type { SummaryDocument } from "@/lib/types";

export function exportSummaryPdf(summary: SummaryDocument): void {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(1, 30, 65);
  doc.setFontSize(16);
  doc.text(summary.title, 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(10);
  doc.text(`Generated ${summary.generatedAt}`, 40, 68);

  let y = 96;
  summary.sections.forEach((section) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.heading, 40, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(section.body, 520);
    doc.text(lines, 40, y);
    y += lines.length * 12 + 14;
  });

  doc.save("closevision-executive-summary.pdf");
}
