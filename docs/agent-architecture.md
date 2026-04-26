# AI Chat Agent — Architecture

## Overview
The chat widget (`components/AgentChat.tsx`) connects to an n8n instance on Hostinger. All workflow logic lives in n8n, not in this repo.

## Endpoints
- **n8n instance:** `https://n8n.srv1518028.hstgr.cloud` (regular mode — do NOT switch to queue mode)
- **Chat webhook:** `https://n8n.srv1518028.hstgr.cloud/webhook/chat`
- **Booking status:** `GET https://n8n.srv1518028.hstgr.cloud/webhook/booking-status?session_id=X`
- **Production workflow IDs:** Chat `YVztGwi5dUSqfkwx` · Booking `W1bs2EMOwRutN15s`

## Widget → n8n Payload
```ts
{
  message: string
  session_id: string           // crypto.randomUUID(), persists in useRef
  turnstileToken: string       // Cloudflare Turnstile (invisible mode)
  history: { role: "user" | "assistant"; content: string }[]  // last 20
  clientTimezone: string       // Intl.DateTimeFormat().resolvedOptions().timeZone (e.g. "America/New_York")
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

## Booking Status Polling
After receiving a reply matching the "processing/booking" pattern, `AgentChat.tsx` polls `GET /webhook/booking-status?session_id=X` every 2s for up to 30s (15 attempts). On success, appends the result as a new assistant bubble. Uses `AbortController` for cleanup on unmount.

**n8n is stateless** — conversation history is sent by the client on every request.

For full workflow architecture, credentials, and routing decisions see `egai-agent-optimized/CLAUDE.md`.

## Environment Variables (`portfolio/.env.local`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Bot protection (widget side) |
| `CLOUDFLARE_TURNSTILE_SECRET` | Bot protection (server verify) |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Chat webhook endpoint |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Voice widget (not yet embedded) |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Voice widget (not yet embedded) |
