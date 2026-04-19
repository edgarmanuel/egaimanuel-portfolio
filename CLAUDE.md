# Portfolio — CLAUDE.md

## Project
Next.js 14 App Router · Tailwind CSS v3 · TypeScript · Phosphor Icons · Framer Motion
Path: `c:\Users\edgar\OneDrive\Documents\Egai\egaimanuel.tech\portfolio\`

## Owner
Edgardo "Egai" Manuel — AI Automation Expert, Manila PH
Email: egai@egaimanuel.tech · egaimanuel.tech

## Layer Architecture (fixed, do not change z-index order)
| z | Layer | File |
|---|-------|------|
| 1 | WebP frame canvas (192 frames, scroll-tied) | `components/BackgroundLayers.tsx` |
| 2 | Hero video `hero.mp4` (autoplay loop, fades after hero) | `components/BackgroundLayers.tsx` |
| 3 | WebGL fluid sim iframe `fluid.html` (transparent) | `components/BackgroundLayers.tsx` |
| 10 | `<main>` — all page content | `app/page.tsx` |
| 50 | AgentButton (fixed bottom-right) | `components/AgentButton.tsx` |

BackgroundLayers is rendered in `app/layout.tsx`, not page.tsx.

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
- Footer is the only exception: full-width glass band (`rgba(255,255,255,0.88)`, blur 28px)

## Frames
- 192 WebP frames in `public/frames/frame0001.webp` → `frame0192.webp`
- Gitignored (17MB). Must be hosted separately for Vercel production.
- Preloaded into `HTMLImageElement[]` on mount, drawn to fixed canvas via rAF

## Key Conventions
- Sections have `transparent` backgrounds so layers show through
- `min-h-[100dvh]` on Hero, never `h-screen`
- Font: Geist (imported in layout)
- Accent: sky-blue (`#0284c7`, Tailwind `sky-500/600`)
- No emojis anywhere
- Design taste: invoke `@egaimanuel.tech/taste-skill.md` only when building new UI

## Page Structure
```
Navbar → Hero → About → AutomationBento → Footer
```

## Navbar links
About · Automations · Contact (no ThemeToggle)
