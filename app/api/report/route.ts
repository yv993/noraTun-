import { NextResponse } from "next/server";

// Error intake. The site had no way to tell anyone it was broken: a client-side
// crash printed to a console nobody is watching, and `error.tsx` showed the
// visitor a phone number while the owner learned nothing. This is the smallest
// thing that fixes that.
//
//   ERROR_WEBHOOK_URL   → POST the report as JSON (Slack, Discord, Make, Zapier)
//   unset               → structured console.error, which Vercel keeps in its
//                         runtime logs and can alert on
//
// Deliberately NOT @sentry/nextjs. That SDK is the better product — grouping,
// release health, source-mapped stacks — but it costs ~40 KB gzipped on the
// client and wraps the build. On a site whose entire proposition is a fast
// cinematic first paint, that is a real trade against the LCP, and the five
// dependencies in package.json are five on purpose. This route gives the owner
// the one thing they had none of — knowing at all — for ~1 KB. Layer Sentry on
// top when volume justifies the weight; nothing here is in its way.

export const runtime = "nodejs";

const MAX = { message: 500, stack: 4000, url: 500, digest: 80, agent: 200 };

// Same shape of in-memory limiter the contact route uses, and the same caveat:
// per-instance, reset on redeploy. A crash loop can fire hundreds of reports a
// second, so this one is tighter — it exists to stop one broken page from
// flooding the log, not to stop an attacker.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const LIMIT = 10;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000)
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > LIMIT;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 204 rather than 429: the client is already broken, and an error reporter
  // that makes noise about its own failures is worse than one that stays quiet.
  if (limited(ip)) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const report = {
    kind: clean(body.kind, 40) || "client",
    message: clean(body.message, MAX.message),
    digest: clean(body.digest, MAX.digest),
    stack: clean(body.stack, MAX.stack),
    url: clean(body.url, MAX.url),
    agent: (request.headers.get("user-agent") ?? "").slice(0, MAX.agent),
    at: new Date().toISOString(),
  };

  if (!report.message && !report.digest) return new NextResponse(null, { status: 204 });

  // One line, JSON, greppable. `[noratun/error]` is the string to alert on.
  console.error("[noratun/error]", JSON.stringify(report));

  const hook = process.env.ERROR_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `text` is what Slack and Discord both render without a schema; the
        // structured copy rides alongside for anything that parses JSON.
        body: JSON.stringify({
          text: `🔴 noratun ${report.kind}: ${report.message || report.digest}\n${report.url}`,
          report,
        }),
      });
    } catch (e) {
      console.error("[noratun/error] webhook failed", e);
    }
  }

  return new NextResponse(null, { status: 204 });
}
