# Portfolio — CLAUDE.md

## Stack & Commands
Next.js 14 · React 18 · Tailwind v3 · TypeScript · Phosphor Icons · Framer Motion

```bash
cd portfolio
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## Owner
Edgardo "Egai" Manuel — AI Automation Expert, Manila PH
Email: egai@egaimanuel.tech · egaimanuel.tech

## Page Structure
```
Navbar → Hero → About → AutomationBento → Footer
```
Navbar links: About · Automations · Contact (no ThemeToggle)

## Layer Z-Index Order (fixed — do not change)
| z | Layer | File |
|---|-------|------|
| 1 | WebP frame canvas (192 frames, scroll-tied) | `components/BackgroundLayers.tsx` |
| 2 | Hero video `hero.mp4` (autoplay loop, fades after hero) | `components/BackgroundLayers.tsx` |
| 3 | WebGL fluid sim iframe (transparent) | `components/BackgroundLayers.tsx` |
| 10 | `<main>` page content | `app/page.tsx` |
| 50 | AgentButton (fixed bottom-right) | `components/AgentButton.tsx` |

`BackgroundLayers` is rendered in `app/layout.tsx`, not `page.tsx`.

## Glass Panel Style (use this exact object everywhere)
```ts
{
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.07)",
}
```
- Apply to **immediate text containers only** — never full-width section bands
- Footer exception: full-width glass band (`rgba(255,255,255,0.88)`, blur 28px)

## Style Conventions
- Sections: `transparent` backgrounds so layers show through
- Hero: `min-h-[100dvh]` (never `h-screen`)
- Font: Geist (imported in layout)
- Accent: `#0284c7` (Tailwind `sky-500/600`)
- No emojis anywhere in UI
- Design taste: invoke `@egaimanuel.tech/taste-skill.md` only when building new UI

## Email
`egai@egaimanuel.tech` is hosted on Hostinger. Outbound email from n8n uses the `egai-agent-smtp` credential (id: `z68Fk07To51TSGMk`, type: `smtp`) — **not** Gmail OAuth2. Always use this credential for any workflow that sends email.

## AI Chat Agent
Webhook: `https://n8n.srv1518028.hstgr.cloud/webhook/chat`
Full details: `docs/agent-architecture.md`

## Contact Form
Workflow ID: `9TNJlnfTO95uAwEA` (active) — webhook on `/webhook/contact`, sends via SMTP to `egai@egaimanuel.tech`, reply-to set to sender's address.
Next.js API route: `app/api/contact/route.ts` — validates fields server-side, proxies to n8n.

## Docs
- `docs/agent-architecture.md` — n8n instance, payload schemas, env vars, cookie logic
- `docs/frames.md` — WebP frame hosting notes
- `docs/deferred-items.md` — known issues, incomplete features, planned work
