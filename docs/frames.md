# WebP Frames — Hosting Notes

- 192 frames: `public/frames/frame0001.webp` → `frame0192.webp`
- Committed to git — served from Vercel via the repo directly (no separate hosting needed)
- Repo: `https://github.com/edgarmanuel/egaimanuel-portfolio/tree/main/public/frames`
- `BackgroundLayers.tsx` preloads all frames into `HTMLImageElement[]` on mount, drawn to fixed canvas via `requestAnimationFrame`, tied to scroll position
