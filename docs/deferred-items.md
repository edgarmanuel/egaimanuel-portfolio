# Deferred Items & Known Issues

Last scanned: 2026-04-25

---

## Security — Unresolved (from 2026-04-23 audit)

- **Turnstile not verified server-side on contact form** — `app/api/contact/route.ts` has the secret env var but no verification call
- **No rate limiting** — contact form, chat webhook, and idea generator have no per-IP limits
- **Idea generator calls n8n directly from browser** — `IdeaGeneratorDemo.tsx` has no server proxy, no token, no auth
- **No fetch timeout on `/api/contact`** — no `AbortController` on the n8n proxy call
- **No CSRF origin check** on `/api/contact`
- **No security headers** (CSP, X-Frame-Options, HSTS) in `next.config.mjs`
- **Projects API path traversal** — `app/api/projects/route.ts` has no guard on filenames

---

## Code Quality

- `console.log("[AgentChat] n8n response: ...")` (`components/AgentChat.tsx` ~line 118) — remove before next production deploy
- `eslint-disable-next-line react-hooks/exhaustive-deps` (`components/AutomationBento.tsx` ~line 69) — `prompts` array may be a missing dep; verify or fix

---

## Hardcoded / Placeholder Data

- `"Live · 47 runs today"` (`AutomationBento.tsx`) — static string in `LiveStatusDot`; pull real data or remove
- `"+1 task completed"` toast (`AutomationBento.tsx`) — decorative, not tied to real events

---

## Planned (Not Yet Started)

- **AutomationBento real project data** — 6 tiles (`AUTOMATIONS` array) are placeholder; user will supply markdown files or replace the array
- **Voice widget (Vapi)** — env vars exist (`NEXT_PUBLIC_VAPI_PUBLIC_KEY`, `NEXT_PUBLIC_VAPI_ASSISTANT_ID`) but widget is not embedded
