const CERTS = [
  {
    title: "Technical Virtual Assistant Course",
    org: "Technical Virtual Assistants Community",
    date: "Mar 2026",
    detail:
      "10+ production workflows: Zapier, Make.com, n8n, HighLevel, Prompt Engineering, Claude Code, AI Agents, RAG, Xero-to-Asana, Gmail sorting, YouTube Shorts creator, appointment setter.",
  },
  {
    title: "Amazon Seller VA Masterclass",
    org: "AmazeNation",
    date: "2025",
    detail:
      "Full Helium 10 mastery (Black Box, Cerebro, Magnet, Frankenstein, Scribbles, Keyword Tracker) + Keepa. Advanced PPC, FBA/FBM, Alibaba sourcing, A+ Content, client acquisition.",
  },
  {
    title: "Java Programming I (Fundamentals)",
    org: "UP System Information Technology Foundation",
    date: "Jan 2016",
    detail: "Core programming fundamentals — logical thinking applied to modern automation engineering.",
  },
  {
    title: "B.S. Applied Physics (Undergraduate)",
    org: "University of the Philippines Diliman",
    date: "1999 – 2001",
    detail: "Analytical and quantitative foundations that underpin rigorous process design and data reasoning.",
  },
];

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto border-t border-zinc-100 dark:border-zinc-800"
    >
      <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-6">
        Certifications & Education
      </p>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-zinc-100 mb-14 max-w-[24ch] leading-tight">
        Continuously levelling up.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CERTS.map((c) => (
          <div
            key={c.title}
            className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-accent/30 transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug">{c.title}</h3>
              <span className="shrink-0 font-mono text-[10px] text-zinc-400 mt-0.5">{c.date}</span>
            </div>
            <p className="text-[11px] font-mono text-accent">{c.org}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
