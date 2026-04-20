"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Robot, X, PaperPlaneTilt } from "@phosphor-icons/react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, opts: object) => string;
      reset: (id: string) => void;
      execute: (id: string) => void;
    };
  }
}

type Message = { role: "user" | "assistant"; content: string };

const WEBHOOK = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string;
const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string;
const COOKIE_KEY = "egai_agent_session";

const CHIPS = [
  { label: "Me",       prompt: "Tell me about Egai's background and experience" },
  { label: "Projects", prompt: "What automation projects has Egai built?" },
  { label: "Skills",   prompt: "What tools and platforms does Egai specialize in?" },
  { label: "Fun",      prompt: "Tell me something interesting about Egai" },
  { label: "Contact",  prompt: "I'd like to book a discovery call with Egai" },
];

function getBookingCookie(): Record<string, string> | null {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(COOKIE_KEY + "="));
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw.split("=")[1]));
  } catch { return null; }
}

function setBookingCookie(data: Record<string, string>) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(data))}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function AgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Egai's AI assistant. Ask me about his work, skills, or book a discovery call.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showChips, setShowChips] = useState(true);
  const sessionId = useRef<string>("");
  const widgetId = useRef<string | null>(null);
  const tsContainer = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scriptReady = useRef(false);

  useEffect(() => {
    sessionId.current = crypto.randomUUID();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !tsContainer.current) return;
    if (widgetId.current) {
      window.turnstile.reset(widgetId.current);
      window.turnstile.execute(widgetId.current);
      return;
    }
    widgetId.current = window.turnstile.render(tsContainer.current, {
      sitekey: SITE_KEY,
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(null),
      "error-callback": () => setToken(null),
      execution: "execute",
      appearance: "interaction-only",
    });
    window.turnstile.execute(widgetId.current);
  }, []);

  useEffect(() => {
    if (open && scriptReady.current) renderTurnstile();
  }, [open, renderTurnstile]);

  const send = async (overrideMessage?: string) => {
    const userMessage = (overrideMessage ?? input).trim();
    if (!userMessage || !token || loading) return;
    setInput("");
    setShowChips(false);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    const usedToken = token;
    setToken(null);

    try {
      const bookingCookie = getBookingCookie();
      const historySnapshot = messages.slice(-20); // send up to 20 prior messages for context
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId.current,
          turnstileToken: usedToken,
          history: historySnapshot,
          ...(bookingCookie ? { booking_cookie: bookingCookie } : {}),
        }),
      });
      const data = await res.json();
      console.log("[AgentChat] n8n response:", JSON.stringify(data));
      if (data.booking_uid && data.attendee_email) {
        setBookingCookie({ booking_uid: data.booking_uid, attendee_email: data.attendee_email });
      }
      const reply =
        data.reply ??
        data.message ??
        data.output ??
        data.text ??
        (typeof data === "string" ? data : null) ??
        "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
      if (widgetId.current) window.turnstile.reset(widgetId.current);
    }
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          scriptReady.current = true;
          if (open) renderTurnstile();
        }}
      />

      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        {!open && (
          <span className="absolute w-14 h-14 rounded-full bg-sky-400/30 animate-ping" />
        )}
        <button
          aria-label="Talk to AI Agent"
          onClick={() => setOpen((o) => !o)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(2,132,199,0.35)] transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)" }}
        >
          {open ? (
            <X size={22} weight="bold" color="white" />
          ) : (
            <Robot size={24} weight="bold" color="white" />
          )}
        </button>
        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
          AI Agent
        </span>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] max-h-[520px] flex flex-col rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800"
            style={{ background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)" }}
          >
            <Robot size={20} weight="bold" color="white" />
            <div>
              <p className="text-sm font-semibold text-white">Egai's AI Assistant</p>
              <p className="text-[10px] text-sky-100">Ask me anything · Book a call</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-sky-600 text-white rounded-br-sm"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-zinc-400 animate-pulse">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Turnstile — invisible mode, renders nothing unless CF requires interaction */}
          <div ref={tsContainer} style={{ position: "absolute", bottom: 0, right: 0 }} />

          {/* Quick chips */}
          {showChips && (
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => send(c.prompt)}
                  disabled={!token || loading}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-sky-400 hover:text-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex gap-2 items-end">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  setInput((v) => v + "\n");
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={token ? "Ask me anything…" : "Verifying…"}
              disabled={loading}
              className="flex-1 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 outline-none focus:border-sky-400 transition-colors placeholder:text-zinc-400 disabled:opacity-60 resize-none overflow-hidden"
            />
            <button
              onClick={() => send()}
              disabled={!token || loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shrink-0"
              style={{ background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)" }}
            >
              <PaperPlaneTilt size={16} weight="bold" color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
