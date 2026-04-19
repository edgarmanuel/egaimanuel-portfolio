"use client";

import { useState, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import {
  ArrowRight, Play, CaretDown, CaretUp, Lightning, Robot, YoutubeLogo,
  CalendarCheck, ShoppingBag, ChartBar, Envelope,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Automation {
  id: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  icon: React.ReactNode;
  colSpan: string;
  rowSpan?: string;
  how: string;
  loomUrl?: string;
  n8nEmbed?: boolean;
  animation: "typewriter" | "list-sort" | "carousel" | "pulse" | "highlight";
}

// ─── Isolated perpetual animation leaf components ─────────────────────────────

const TypewriterDisplay = memo(function TypewriterDisplay() {
  const prompts = [
    "Summarise new Xero invoices → Asana tasks",
    "Sort inbound Gmail by intent + priority",
    "Draft YouTube script from trending topic",
    "Book appointment + send confirmation SMS",
    "Pull ASIN data → research report PDF",
  ];
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("typing");
  const charRef = useRef(0);

  useEffect(() => {
    const target = prompts[idx];
    if (phase === "typing") {
      if (charRef.current < target.length) {
        const t = setTimeout(() => {
          charRef.current++;
          setDisplayed(target.slice(0, charRef.current));
        }, 42);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("erasing"), 2200);
        return () => clearTimeout(t);
      }
    }
    if (phase === "erasing") {
      if (charRef.current > 0) {
        const t = setTimeout(() => {
          charRef.current--;
          setDisplayed(target.slice(0, charRef.current));
        }, 22);
        return () => clearTimeout(t);
      } else {
        setIdx((i) => (i + 1) % prompts.length);
        setPhase("typing");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, displayed, idx]);

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl px-3 py-2 min-h-[2.5rem]">
      <span className="text-accent">›</span>
      <span>{displayed}</span>
      <span className="inline-block w-0.5 h-3.5 bg-accent animate-pulse" />
    </div>
  );
});

const LiveStatusDot = memo(function LiveStatusDot() {
  const [pop, setPop] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setPop(true);
      setTimeout(() => setPop(false), 3200);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex items-center gap-2 mt-auto">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="text-xs text-emerald-600 font-mono">Live · 47 runs today</span>
      <AnimatePresence>
        {pop && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="absolute -top-8 left-0 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] font-mono px-2 py-1 rounded-lg whitespace-nowrap"
          >
            +1 task completed
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const InfiniteCarousel = memo(function InfiniteCarousel({ items }: { items: string[] }) {
  const x = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((_, delta) => {
    x.current -= delta * 0.03;
    const w = (containerRef.current?.scrollWidth ?? 0) / 2;
    if (w && x.current < -w) x.current = 0;
    if (containerRef.current) containerRef.current.style.transform = `translateX(${x.current}px)`;
  });

  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden -mx-2">
      <div ref={containerRef} className="flex gap-2 w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="shrink-0 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full px-2.5 py-1 bg-white dark:bg-zinc-900"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const AUTOMATIONS: Automation[] = [
  {
    id: "xero-asana",
    title: "Xero → Asana Pipeline",
    description:
      "Watches Xero for new invoices and approved bills, creates structured Asana tasks with due dates, amounts, and client tags — zero manual entry.",
    metric: "3.2h",
    metricLabel: "saved per week",
    tags: ["n8n", "Xero API", "Asana API", "Webhook"],
    icon: <Lightning weight="fill" size={20} />,
    colSpan: "md:col-span-2",
    how: "Built on n8n self-hosted. Xero webhook fires on invoice events → HTTP node maps fields → Asana API creates task in the correct project section. Error path sends Slack alert. Runs 24/7 with zero maintenance.",
    animation: "pulse",
  },
  {
    id: "gmail-sorter",
    title: "Gmail AI Sorter",
    description:
      "Reads inbound Gmail, classifies intent via Claude API, applies labels and draft replies for high-priority threads — client response time cut by 61%.",
    metric: "61%",
    metricLabel: "faster response",
    tags: ["Make.com", "Gmail", "Claude API", "Labels"],
    icon: <Envelope weight="fill" size={20} />,
    colSpan: "md:col-span-1",
    how: "Make.com scenario: Gmail watch trigger → Claude 3.5 Haiku classifies email body → Apply Label module sorts to folder. If urgency = high, draft reply is created and starred. Runs every 5 minutes.",
    animation: "typewriter",
  },
  {
    id: "yt-shorts",
    title: "YouTube Shorts Creator",
    description:
      "Turns a trending topic into a full short-form video: script → voiceover → captions → upload. End-to-end in under 4 minutes.",
    metric: "4min",
    metricLabel: "topic to upload",
    tags: ["n8n", "ElevenLabs", "Claude", "YouTube API"],
    icon: <YoutubeLogo weight="fill" size={20} />,
    colSpan: "md:col-span-1",
    how: "n8n workflow: manual trigger with topic → Claude writes 60s script → ElevenLabs TTS → Creatomate renders video + auto-captions → YouTube Data API v3 uploads as Short with generated title and tags.",
    animation: "list-sort",
  },
  {
    id: "appt-setter",
    title: "Appointment Setter",
    description:
      "HighLevel AI bot qualifies inbound leads via SMS, books calls on Calendly, and sends branded confirmation emails — fully hands-off.",
    metric: "83%",
    metricLabel: "show-up rate",
    tags: ["HighLevel", "Calendly", "Twilio", "Zapier"],
    icon: <CalendarCheck weight="fill" size={20} />,
    colSpan: "md:col-span-1",
    how: "HighLevel workflow builder + AI conversation node qualifies lead in 3 SMS turns. On qualification, Zapier Calendly integration books slot → HighLevel sends branded HTML confirmation email + 1h reminder.",
    animation: "pulse",
  },
  {
    id: "amazon-research",
    title: "Amazon Product Research",
    description:
      "Pulls Helium 10 Cerebro data for a given ASIN, scores competition, and generates a formatted opportunity report in Google Sheets.",
    metric: "47min",
    metricLabel: "research automated",
    tags: ["Make.com", "Helium 10", "Google Sheets", "Claude"],
    icon: <ShoppingBag weight="fill" size={20} />,
    colSpan: "md:col-span-1",
    how: "Make.com: ASIN input via Google Form → Helium 10 API fetches Cerebro keyword + competitor data → Claude summarises opportunity score → Google Sheets row appended with full analysis and go/no-go flag.",
    animation: "carousel",
  },
  {
    id: "amazon-ppc",
    title: "Amazon PPC Optimizer",
    description:
      "Scans Sponsored Ads performance daily — pauses bleeders, scales winners, and logs changes with reasoning in a shared Notion dashboard.",
    metric: "28%",
    metricLabel: "ACoS reduction",
    tags: ["n8n", "Amazon Ads API", "Notion", "Claude"],
    icon: <ChartBar weight="fill" size={20} />,
    colSpan: "md:col-span-2",
    how: "n8n cron at 06:00 Manila time: Amazon Ads API fetches 7-day campaign performance → Claude evaluates ACoS thresholds per rule set → HTTP node pauses/scales bids → Notion DB logs action with reasoning and timestamp.",
    animation: "highlight",
  },
];

// ─── Single tile ──────────────────────────────────────────────────────────────

const AutomationTile = memo(function AutomationTile({ a }: { a: Automation }) {
  const [expanded, setExpanded] = useState(false);

  const carouselItems = ["Helium 10", "Cerebro", "ASIN Score", "Black Box", "Keepa", "BSR", "PPC Bid", "Keyword Rank"];

  return (
    <motion.div
      layout
      className={`${a.colSpan} ${a.rowSpan ?? ""} group relative rounded-[2rem] p-7 flex flex-col gap-4 overflow-hidden`}
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
          {a.icon}
        </div>
        <a
          href="#contact"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-mono text-accent border border-accent/20 rounded-full px-2.5 py-1 flex items-center gap-1"
        >
          Demo <ArrowRight size={10} />
        </a>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight text-base">{a.title}</h3>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed mt-1">{a.description}</p>
      </div>

      {/* Metric */}
      <div className="flex items-end gap-1">
        <span className="text-3xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">{a.metric}</span>
        <span className="text-xs text-zinc-400 pb-1">{a.metricLabel}</span>
      </div>

      {/* Perpetual animation zone */}
      <div className="min-h-[2.5rem]">
        {a.animation === "typewriter" && <TypewriterDisplay />}
        {a.animation === "pulse" && <LiveStatusDot />}
        {a.animation === "carousel" && <InfiniteCarousel items={carouselItems} />}
        {a.animation === "list-sort" && (
          <motion.div layout className="flex flex-col gap-1">
            {["Script", "Voiceover", "Render", "Upload"].map((s, i) => (
              <motion.div
                key={s}
                layout
                layoutId={`step-${a.id}-${s}`}
                className="flex items-center gap-2 text-xs text-zinc-400"
              >
                <span className="w-4 h-4 rounded-full bg-accent/10 text-accent text-[9px] flex items-center justify-center font-mono">{i + 1}</span>
                {s}
                <span className="ml-auto font-mono text-emerald-500">done</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        {a.animation === "highlight" && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Robot size={13} className="text-accent" />
            <span>ACoS &gt; 38% → pausing 3 keywords</span>
          </div>
        )}
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {a.tags.map((t) => (
          <span key={t} className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full px-2.5 py-0.5">
            {t}
          </span>
        ))}
      </div>

      {/* Expandable "How I Built It" */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-accent transition-colors duration-200 w-fit"
      >
        {expanded ? <CaretUp size={11} /> : <CaretDown size={11} />}
        How I Built It
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs text-zinc-500 leading-relaxed border-t border-white/40 pt-3">
              {a.how}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ─── n8n embed placeholder ────────────────────────────────────────────────────

function N8nEmbed() {
  return (
    <div
      className="md:col-span-3 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 min-h-[180px]"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px dashed rgba(255,255,255,0.55)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.07)",
      }}
    >
      <Lightning size={24} weight="thin" className="text-zinc-300 dark:text-zinc-600" />
      <p className="text-sm text-zinc-400 font-mono text-center">
        n8n self-hosted embed — <span className="text-accent">live workflow canvas</span> goes here
      </p>
      <a
        href="#contact"
        className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 hover:border-accent hover:text-accent transition-colors duration-200"
      >
        Request a live demo
      </a>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function AutomationBento() {
  return (
    <section id="automations" className="relative py-24 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">

      {/* Section header — contained glass panel */}
      <div
        className="mb-10 rounded-3xl px-8 py-7 flex flex-col md:flex-row md:items-end gap-4 justify-between"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.07)",
        }}
      >
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-sky-600 mb-4">Featured Automations</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 max-w-[20ch] leading-tight">
            Workflows I&apos;ve shipped to production.
          </h2>
        </div>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 group self-start md:self-auto shrink-0"
        >
          Hire me to build yours
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
        </a>
      </div>

      {/* Bento grid — 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AUTOMATIONS.map((a) => (
          <AutomationTile key={a.id} a={a} />
        ))}
        <N8nEmbed />
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 flex justify-center">
        <a
          href="#contact"
          className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <Play size={14} weight="fill" className="text-accent" />
          Book a free automation audit
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
        </a>
      </div>
      </div>{/* wrapper end */}
    </section>
  );
}
