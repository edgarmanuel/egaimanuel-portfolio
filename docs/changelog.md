# Changelog

Append a new entry at the top after each session. Format: `## YYYY-MM-DD — summary`.

---

## 2026-04-23 — Security audit (no code changes); dark mode trial reverted

- Full security audit completed — no code changes made this session, findings documented for next session
- Critical: Turnstile token never verified server-side in `/api/contact/route.ts` (secret env var exists, verification call absent)
- Critical: No rate limiting on contact form, chat webhook, or idea generator — unlimited requests per IP
- Critical: Idea generator calls n8n directly from the browser (`IdeaGeneratorDemo.tsx` line 13) with no server proxy, no token, no auth
- High: No fetch timeout (`AbortController`) on n8n proxy calls in `app/api/contact/route.ts`
- High: No CSRF origin check on `/api/contact`
- Medium: No security headers (CSP, X-Frame-Options, HSTS) in `next.config.mjs`
- Medium: Projects API (`app/api/projects/route.ts`) has no path traversal guard on filenames
- Dark mode implementation was attempted (CSS vars, ThemeProvider unlock, Navbar toggle) then fully reverted at user request — background layers (WebP frames + video) were not visible in dark mode trial; all files restored to pre-dark-mode state, `forcedTheme="light"` reinstated

## 2026-04-23 — Glass panel opacity + text contrast refinement (locked at 0.15)

- Reduced glass panel background opacity site-wide: `0.82` → `0.15` (Footer was `0.88` → `0.15`) across About, AutomationBento, IdeaGeneratorDemo, Footer — iterated through 0.40 → 0.35 → 0.30 → 0.25 → 0.15 before locking
- Bumped muted text colors for ~70% effective contrast: `text-zinc-400` → `text-zinc-600`, `text-zinc-500` → `text-zinc-700` across all content components and Navbar nav links; heading and interactive hover states unchanged
- Updated canonical glass panel value in both CLAUDE.md files

## 2026-04-23 — Contact form wiring, fluid sim touch fix, Book a Call CTAs, nav centering

- Added three "Book a Call" CTAs all pointing to `https://cal.com/egai-manuel`:
  - `AgentChat.tsx`: `CalendarCheckIcon` circle button above Robot button, hover tooltip
  - `Navbar.tsx`: sky-600 pill in desktop nav + animated entry in mobile overlay
  - `Footer.tsx`: outlined secondary button below "Send Message"
- Navbar links (About · Automations · Contact · Book a Call) now `absolute left-1/2 -translate-x-1/2` — centered regardless of logo/hamburger widths
- Wired "Send Message" form to n8n SMTP webhook — created n8n workflow `9TNJlnfTO95uAwEA` (active, `/webhook/contact`) using `egai-agent-smtp` credential (Hostinger); created `app/api/contact/route.ts` as server-side proxy with validation; error state added to UI
- Fixed fluid sim mobile touch: `BackgroundLayers.tsx` now listens to `touchmove` directly (skips `pointermove` for touch to avoid double-firing) — fixes stale-after-first-touch on iOS
- Reduced fluid sim `SPLAT_RADIUS` from `0.18` → `0.03` for finer strokes
- Updated `CLAUDE.md` with email hosting note (egai@egaimanuel.tech on Hostinger, always use `egai-agent-smtp`) and contact form workflow details
- Pushed to `https://github.com/edgarmanuel/egaimanuel-portfolio` (commit `185c581`)

## 2026-04-23 — Git setup + "Book a Call" CTA planning

- Initialized git repo in `portfolio/`, added `public/frames/` to `.gitignore`, pushed to `https://github.com/edgarmanuel/egaimanuel-portfolio`
- Planned next session: add persistent "Book a Call" fixed button (above AI Agent button), "Book a Call" in Navbar (desktop + mobile), and "Book a Discovery Call Now" button in Footer — all linking to `https://cal.com/egai-manuel` in a new tab
- Confirmed "Send Message" form in `Footer.tsx` is currently a stub — no real submission, fakes success after 1.2s delay. Needs wiring before it does anything.

## 2026-04-22 — Frame canvas fade-in fix + AgentChatInline removal

- Fixed WebP frame canvas appearing during hero section — canvas now starts at `opacity: 0` and fades in (`0.6s ease`) only when hero exits viewport, synced with hero video fade-out via shared `IntersectionObserver` on `#hero` (`BackgroundLayers.tsx`)
- Deleted `components/AgentChatInline.tsx` — superseded by `IdeaGeneratorDemo.tsx` which now takes full `md:col-span-3` in the bento grid

## 2026-04-22 — Automation Idea Generator (n8n + frontend)

- Created `idea-generator` n8n workflow (ID: `MIsppO57biFDdBi1`) — 5 nodes: Webhook → Prepare Prompt (Code) → Call xAI (Grok grok-3-fast) → Format Response (Code) → Respond to Webhook. Live at `https://n8n.srv1518028.hstgr.cloud/webhook/idea-generator`
- Created `components/IdeaGeneratorDemo.tsx` — bento card with input field, example chips, staggered idea cards, time-saved badge. Uses Framer Motion AnimatePresence for state transitions
- Updated `AutomationBento.tsx` to render both IdeaGeneratorDemo (col-span-2) and AgentChatInline (col-span-1) in the bottom row
- Narrowed `AgentChatInline` from `md:col-span-3` to `md:col-span-1` to share the row

## 2026-04-22 — Bento inline chat + demo webhook planning

- Replaced `N8nEmbed` placeholder in `AutomationBento.tsx` with `AgentChatInline.tsx` — live inline chat widget wired to n8n webhook, fits the 3-col bento bottom slot
- Reviewed all n8n workflows for live demo suitability — none were suitable as-is (Slack-triggered, calendar-dependent, or long-running)
- Decided to build a purpose-built "Automation Idea Generator" demo webhook (4–5 nodes: Webhook → AI prompt → Respond) — visitor types job title/business, gets 3 tailored automation ideas with time-saved estimates
- Next: create the n8n workflow + wire it to a new bento demo panel in AutomationBento.tsx

## 2026-04-22 — Docs restructure & dead code removal

- Restructured `CLAUDE.md` — stripped to essentials only
- Created `docs/agent-architecture.md`, `docs/frames.md`, `docs/deferred-items.md`
- Corrected frames hosting note: frames are committed to git, served via Vercel directly
- Deleted `components/AgentButton.tsx` — confirmed unused, superseded by button in `AgentChat.tsx`
- Opened question: replace `N8nEmbed` placeholder in `AutomationBento.tsx` with embedded egai-agent chat widget
