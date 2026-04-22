# AI Chat Agent — Architecture

## Overview
The chat widget (`components/AgentChat.tsx`) connects to an n8n instance on Hostinger. All workflow logic lives in n8n, not in this repo. The `egai-agent/` directory (repo root) contains workflow documentation only.

## Endpoints
- **n8n instance:** `https://n8n.srv1518028.hstgr.cloud` (regular mode — do NOT switch to queue mode)
- **Webhook:** `https://n8n.srv1518028.hstgr.cloud/webhook/chat`
- **Workflow IDs:** Chat: `YVztGwi5dUSqfkwx` · Booking sub-workflow: `W1bs2EMOwRutN15s`

## Widget → n8n Payload
```ts
{
  message: string
  session_id: string           // crypto.randomUUID(), persists in useRef
  turnstileToken: string       // Cloudflare Turnstile (invisible mode)
  history: { role: "user" | "assistant"; content: string }[]  // last 20
  booking_cookie?: { booking_uid: string; attendee_email: string }
}
```

## n8n → Widget Response
```ts
{
  reply: string
  session_id: string
  booking_uid?: string         // triggers cookie set
  attendee_email?: string
}
```

Widget sets `egai_agent_session` cookie (30-day, SameSite=Lax) when both `booking_uid` + `attendee_email` are present.

**n8n is stateless** — conversation history is sent by the client on every request. The server never stores messages between calls.

See `egai-agent/CLAUDE.md` for full workflow architecture, credentials, and key decisions (especially the Lakera Guard false-positive fix).

## Environment Variables (`portfolio/.env.local`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Bot protection (widget side) |
| `CLOUDFLARE_TURNSTILE_SECRET` | Bot protection (server verify) |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Chat webhook endpoint |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Voice widget (not yet embedded) |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Voice widget (not yet embedded) |
