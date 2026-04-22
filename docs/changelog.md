# Changelog

Append a new entry at the top after each session. Format: `## YYYY-MM-DD — summary`.

---

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
