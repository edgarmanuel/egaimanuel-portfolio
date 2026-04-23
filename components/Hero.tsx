"use client";

import { ArrowRight } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Inward vignette — darkens edges, keeps center alive */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 70%, rgba(0,0,0,0.52) 100%)",
        }}
      />

      {/* Bottom lift — text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 45%, transparent 100%)",
        }}
      />

      {/* Content anchored bottom-left */}
      <div
        className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-20 flex flex-col gap-6"
        style={{ zIndex: 1 }}
      >
        <span className="inline-flex items-center gap-2 w-fit text-[11px] font-mono uppercase tracking-widest text-sky-300 border border-sky-700/60 bg-black/30 backdrop-blur-sm rounded-full px-3.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          Open to work · Manila, PH
        </span>

        <h1 className="text-[clamp(3rem,8vw,6rem)] font-semibold tracking-tighter leading-[0.92] text-white max-w-[16ch]">
          I build{" "}
          <span className="text-sky-400">workflows</span>{" "}
          that replace manual work.
        </h1>

        <a
          href="#automations"
          className="group inline-flex items-center gap-2 w-fit bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px active:scale-[0.98] shadow-[0_4px_24px_rgba(2,132,199,0.4)]"
        >
          See My Automations
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </a>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">scroll</span>
      </div>
    </section>
  );
}
