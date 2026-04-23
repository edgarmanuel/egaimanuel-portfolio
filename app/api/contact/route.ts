import { NextResponse } from "next/server";

const N8N_CONTACT_WEBHOOK = "https://n8n.srv1518028.hstgr.cloud/webhook/contact";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, message, turnstileToken } = body as Record<string, unknown>;

  if (typeof turnstileToken !== "string" || !turnstileToken) {
    return NextResponse.json({ error: "Bot check required" }, { status: 403 });
  }

  const tsRes = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
      response: turnstileToken,
    }),
  });
  const tsData = await tsRes.json() as { success: boolean };
  if (!tsData.success) {
    return NextResponse.json({ error: "Bot check failed" }, { status: 403 });
  }

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" || message.trim().length < 12
  ) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const res = await fetch(N8N_CONTACT_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
