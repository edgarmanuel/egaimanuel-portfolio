import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AgentChat from "@/components/AgentChat";
import BackgroundLayers from "@/components/BackgroundLayers";

export const metadata: Metadata = {
  title: "Egai Manuel — AI Automation Expert",
  description:
    "Edgardo 'Egai' Manuel builds production-grade AI automations for BPO, crypto, and e-commerce teams. 16+ years of operational leadership, now engineering the workflows that replace manual work.",
  keywords: [
    "AI Automation",
    "n8n",
    "Make.com",
    "Zapier",
    "Amazon Seller VA",
    "Crypto Support",
    "HighLevel",
    "Process Automation",
  ],
  authors: [{ name: "Edgardo Manuel", url: "https://egaimanuel.tech" }],
  openGraph: {
    title: "Egai Manuel — AI Automation Expert",
    description:
      "I build the automations that replace manual work — from Xero-to-Asana pipelines to AI-powered appointment setters.",
    url: "https://egaimanuel.tech",
    siteName: "egaimanuel.tech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Egai Manuel — AI Automation Expert",
    description:
      "Production-grade AI automations. n8n · Make.com · Zapier · HighLevel.",
  },
  metadataBase: new URL("https://egaimanuel.tech"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-transparent text-zinc-900 font-sans antialiased grain">
        <BackgroundLayers />

        <ThemeProvider>
          {children}
        </ThemeProvider>

        <AgentChat />
      </body>
    </html>
  );
}
