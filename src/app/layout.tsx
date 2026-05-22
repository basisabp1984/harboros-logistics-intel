import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "HarborOS — AI Logistics Intelligence",
  description:
    "Mission-control cockpit for ocean-freight operators: vessels, ports, voyages, disruptions, and an AI routing analyst — all on mock data."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
