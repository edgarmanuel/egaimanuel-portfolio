const CATEGORIES = [
  {
    title: "AI Automation Platforms",
    items: ["n8n (Self-hosted)", "Make.com", "Zapier (Advanced)", "HighLevel"],
  },
  {
    title: "AI & Orchestration",
    items: ["Claude API", "Prompt Engineering", "RAG Workflows", "AI Agents", "Process Mapping"],
  },
  {
    title: "Amazon Seller VA",
    items: [
      "Helium 10 (Black Box · Cerebro · Magnet · Frankenstein · Scribbles · Keyword Tracker)",
      "Keepa",
      "FBA / FBM Operations",
      "Amazon PPC (Sponsored Ads)",
      "Alibaba Supplier Sourcing",
      "Product Listing (Flat Files · A+ Content)",
    ],
  },
  {
    title: "Crypto & Compliance",
    items: ["Cryptocurrency & Blockchain", "KYC / AML Compliance", "Risk Awareness", "Escalation Management"],
  },
  {
    title: "Web & Portfolio",
    items: ["Lovable.dev", "WordPress + Elementor", "Basic HTML / CSS"],
  },
  {
    title: "Leadership & Ops",
    items: [
      "BPO Team Leadership",
      "Client Relations & Coaching",
      "Cross-functional Collaboration",
      "Process Improvement & Documentation",
      "Google Workspace · MS Office · Slack",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto border-t border-zinc-100 dark:border-zinc-800">
      <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-6">Skills & Tools</p>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-zinc-100 mb-14 max-w-[24ch] leading-tight">
        The full stack, tool by tool.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
                  <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
