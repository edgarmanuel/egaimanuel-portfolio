"use client";

import { useState, useRef, useCallback } from "react";
import Script from "next/script";
import { ArrowRight, LinkedinLogo, Globe, EnvelopeSimple, CalendarCheckIcon } from "@phosphor-icons/react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string;

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, opts: object) => string;
      reset: (id: string) => void;
      execute: (id: string) => void;
    };
  }
}

type FormState = "idle" | "loading" | "success" | "error";

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tsToken, setTsToken] = useState<string | null>(null);
  const tsContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const initTurnstile = useCallback(() => {
    if (!window.turnstile || !tsContainer.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(tsContainer.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (t: string) => setTsToken(t),
      "error-callback": () => setTsToken(null),
      "expired-callback": () => setTsToken(null),
      appearance: "interaction-only",
      execution: "render",
    });
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required.";
    if (!message.trim() || message.trim().length < 12) e.message = "Message must be at least 12 characters.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, turnstileToken: tsToken }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      if (widgetId.current) {
        window.turnstile.reset(widgetId.current);
        setTsToken(null);
      }
    }
  };

  return (
    <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
      onLoad={initTurnstile}
    />
    <footer id="contact" className="relative">
      {/* Liquid glass band */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          borderTop: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      />
      {/* CTA band */}
      <div className="relative py-24 px-6 md:px-10 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-800 mb-6">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-zinc-100 leading-tight mb-6 max-w-[18ch]">
            Ready to automate what&apos;s slowing you down?
          </h2>
          <p className="text-base text-zinc-800 dark:text-zinc-300 leading-relaxed max-w-[48ch] mb-8">
            Tell me what you want to automate — I&apos;ll scope it and propose a solution
            in 24 hours. Free consultation, no pitch decks.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:egai@egaimanuel.tech"
              className="inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <EnvelopeSimple size={16} />
              egai@egaimanuel.tech
            </a>
            <a
              href="https://linkedin.com/in/egaimanuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <LinkedinLogo size={16} />
              linkedin.com/in/egaimanuel
            </a>
            <a
              href="https://egaimanuel.tech"
              className="inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Globe size={16} />
              egaimanuel.tech
            </a>
          </div>
        </div>

        {/* Right — contact form */}
        <div>
          {status === "error" && (
            <p className="text-sm text-red-500 mb-4">Something went wrong — please try again or email me directly.</p>
          )}
          {status === "success" ? (
            <div className="border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-8 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                <ArrowRight size={16} />
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Message received.</p>
              <p className="text-sm text-zinc-800 dark:text-zinc-300">
                I&apos;ll reply within 24 hours. Looking forward to it.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-mono text-zinc-800 dark:text-zinc-300">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maris Navarro"
                  className="w-full border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-600 outline-none focus:border-accent transition-colors duration-200"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-mono text-zinc-800 dark:text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maris@company.io"
                  className="w-full border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-600 outline-none focus:border-accent transition-colors duration-200"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-mono text-zinc-800 dark:text-zinc-300">
                  What do you want to automate?
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="We're manually reconciling invoices every week and it takes 3 hours..."
                  className="w-full border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-600 outline-none focus:border-accent transition-colors duration-200 resize-none"
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-100 dark:border-t-zinc-900 rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
              <a
                href="https://cal.com/egai-manuel"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 hover:border-sky-500 hover:text-sky-600 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98]"
              >
                <CalendarCheckIcon size={15} className="group-hover:scale-110 transition-transform duration-200" />
                Book a Discovery Call
              </a>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-zinc-200/60 py-6 px-6 md:px-10 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-xs text-zinc-800 font-mono">
          egai<span className="text-accent">.</span>manuel · Manila, Philippines
        </span>
        <span className="text-xs text-zinc-800 font-mono">
          Built with n8n logic and Next.js precision.
        </span>
      </div>
      {/* Hidden Turnstile container */}
      <div ref={tsContainer} className="hidden" />
    </footer>
    </>
  );
}
