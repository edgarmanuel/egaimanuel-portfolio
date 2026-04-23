"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ArrowRight, Clock, Spinner } from "@phosphor-icons/react";

interface Idea {
  title: string;
  description: string;
  timeSaved: string;
}

const WEBHOOK = "https://n8n.srv1518028.hstgr.cloud/webhook/idea-generator";

const EXAMPLES = ["real estate agent", "e-commerce store", "freelance designer", "dental clinic", "SaaS startup"];

export default function IdeaGeneratorDemo() {
  const [input, setInput] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = async (overrideValue?: string) => {
    const businessType = (overrideValue ?? input).trim();
    if (!businessType || loading) return;
    setLoading(true);
    setError(null);
    setIdeas([]);
    setSubmitted(true);

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const result: Idea[] = Array.isArray(data.ideas) ? data.ideas : [];
      if (result.length === 0) throw new Error("No ideas returned");
      setIdeas(result);
    } catch {
      setError("Could not generate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setIdeas([]);
    setError(null);
    setSubmitted(false);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div
      className="md:col-span-3 rounded-[2rem] flex flex-col overflow-hidden min-h-[260px]"
      style={{
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2.5 shrink-0"
        style={{ background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)" }}
      >
        <Lightbulb size={18} weight="bold" color="white" />
        <p className="text-sm font-semibold text-white">Automation Idea Generator</p>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-sky-100 font-mono">live demo</span>
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 py-4 gap-4 min-h-0">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="input-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="text-xs text-zinc-800 leading-relaxed">
                Enter your job title or business type and get 3 tailored automation ideas — instantly.
              </p>
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); generate(); } }}
                  placeholder="e.g. real estate agent, e-commerce store…"
                  className="flex-1 text-xs rounded-xl border border-zinc-200 bg-white/60 text-zinc-900 px-3 py-2 outline-none focus:border-sky-400 transition-colors placeholder:text-zinc-400"
                />
                <button
                  onClick={() => generate()}
                  disabled={!input.trim() || loading}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-white px-3 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)" }}
                >
                  Generate <ArrowRight size={12} weight="bold" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => { setInput(ex); generate(ex); }}
                    className="text-[10px] font-mono text-zinc-800 border border-zinc-200 rounded-full px-2.5 py-0.5 hover:border-sky-400 hover:text-sky-600 transition-colors bg-white/60"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-3 py-6"
            >
              <Spinner size={24} className="text-sky-500 animate-spin" />
              <p className="text-xs text-zinc-800 font-mono">Generating ideas for &ldquo;{input}&rdquo;…</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-3 py-6"
            >
              <p className="text-xs text-zinc-800">{error}</p>
              <button onClick={reset} className="text-[11px] font-mono text-sky-600 hover:underline">
                Try again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2.5"
            >
              {ideas.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-zinc-100 bg-white/70 px-4 py-3 flex gap-3 items-start"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-600 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 leading-snug">{idea.title}</p>
                    <p className="text-[11px] text-zinc-800 leading-relaxed mt-0.5">{idea.description}</p>
                  </div>
                  <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                    <Clock size={10} weight="bold" />
                    {idea.timeSaved}
                  </span>
                </motion.div>
              ))}
              <button
                onClick={reset}
                className="self-start text-[11px] font-mono text-zinc-800 hover:text-sky-600 transition-colors mt-1"
              >
                Try another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
