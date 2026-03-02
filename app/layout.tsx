import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloseVision - FP&A Quarterly Close Command Center",
  description: "Demo-safe command center for close risk, cash pressure, and scenario planning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
