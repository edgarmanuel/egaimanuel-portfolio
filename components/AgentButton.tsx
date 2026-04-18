"use client";

import { Robot } from "@phosphor-icons/react";

export default function AgentButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {/* Pulse ring */}
      <span className="absolute w-14 h-14 rounded-full bg-sky-400/30 animate-ping" />

      <button
        aria-label="Talk to AI Agent"
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(2,132,199,0.35)] transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)",
        }}
      >
        <Robot size={24} weight="bold" color="white" />
      </button>

      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
        AI Agent
      </span>
    </div>
  );
}
