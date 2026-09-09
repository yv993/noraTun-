import { NextResponse } from "next/server";
import { brand } from "@/lib/content";

// Lead intake. No dependencies: validation is hand-written, the rate limit is
// in-memory. Delivery is ENV-GATED and the response says which path it took, so
// the dialog can never claim an enquiry was sent when nothing could send it.
//
//   RESEND_API_KEY + CONTACT_TO   → email via Resend
//   CONTACT_WEBHOOK_URL           → POST the lead as JSON (Zapier, Make, Slack…)
//   neither                       → logged server-side, delivered: false
//
// In-memory means per-instance and reset on redeploy. That is the right trade
// for a brochure site: it stops a bored visitor, and a determined flood is the
// platform's job, not this file's.

export const runtime = "nodejs";

type Lead = { name: string; phone: string; email: string; message: string };

const MAX = { name: 120, phone: 40, email: 160, message: 4000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // keep the map from growing without bound on a long-lived instance
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > LIMIT;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string"
    ? // strip CONTROL characters only (U+0000–U+001F and U+007F). Newlines in
      // the message become spaces; nothing printable is altered.
      v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max)
    : "";

function validate(body: Record<string, unknown>) {
  const lead: Lead = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    message: clean(body.message, MAX.message),
  };
  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(lead.email)) errors.email = "That email address doesn't look right.";
  if (lead.message.length < 10) errors.message = "A sentence or two about the project, please.";
  return { lead, errors };
}

async function deliver(lead: Lead, ua: string) {
  const to = process.env.CONTACT_TO ?? brand.email;
  const text = [
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    `Phone:   ${lead.phone || "—"}`,
    "",
    lead.message,
    "",
    `— sent from the Noratun site · ${new Date().toISOString()} · ${ua.slice(0, 120)}`,
  ].join("\n");

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? `Noratun site <onboarding@resend.dev>`,
        to: [to],
        reply_to: lead.email,
        subject: `Call request from ${lead.name}`,
        text,
      }),
    });
    if (res.ok) return true;
    console.error("[noratun/contact] resend rejected", res.status, await res.text().catch(() => ""));
    return false;
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // was "kar-site" — copied from the KAR project. Anyone routing leads from
      // both sites into one webhook would have filed every Noratun enquiry
      // under the architecture studio.
      body: JSON.stringify({ ...lead, source: "noratun-site", at: new Date().toISOString() }),
    });
    if (res.ok) return true;
    console.error("[noratun/contact] webhook rejected", res.status);
    return false;
  }

  return false;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // honeypot — a field no human sees, so anything in it is a bot. Answer 200 so
  // the bot learns nothing from the status code.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true, delivered: true });

  // min-time — a real person cannot read four fields and submit in under 2s
  const elapsed = Number(body.elapsed);
  if (Number.isFinite(elapsed) && elapsed < 2000) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "That's a few messages in a short time — try again shortly." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const { lead, errors } = validate(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  let delivered = false;
  try {
    delivered = await deliver(lead, request.headers.get("user-agent") ?? "");
  } catch (e) {
    console.error("[noratun/contact] delivery threw", e);
  }

  if (!delivered) {
    // nothing is configured (or the provider failed) — the lead must not vanish
    console.info("[noratun/contact] UNDELIVERED LEAD", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true, delivered });
}
