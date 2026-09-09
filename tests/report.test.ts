import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/report/route";

// The error reporter is the one endpoint that is called precisely when the site
// is already broken. Two properties matter more than anything it records:
// it must never throw, and it must never become the amplifier for a crash loop.

let n = 0;
const freshIp = () => `10.1.0.${++n}`;

const post = (body: unknown, ip = freshIp()) =>
  POST(
    new Request("http://localhost/api/report", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const boom = {
  kind: "route",
  message: "Cannot read properties of undefined (reading 'progress')",
  stack: "at ScrollTrigger.update\n  at raf",
  url: "https://noratun.am/homes/Y-A4",
};

afterEach(() => vi.unstubAllEnvs());

describe("intake", () => {
  it("accepts a report with 204 and no body", async () => {
    const res = await post(boom);
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
  });

  it("swallows malformed JSON rather than erroring at an already-broken client", async () => {
    expect((await post("{not json")).status).toBe(204);
  });

  it("ignores an empty report", async () => {
    // nothing to log and nothing to alert on — a beacon fired by a bot or a
    // half-initialised page must not create a log line
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await post({ kind: "route", message: "", digest: "" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("logs one greppable line per report", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await post(boom);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe("[noratun/error]");
    const logged = JSON.parse(String(spy.mock.calls[0][1]));
    expect(logged.message).toContain("Cannot read properties");
    expect(logged.url).toBe(boom.url);
    // the stack's newlines are flattened so one report stays one log line
    expect(logged.stack).not.toContain("\n");
    // ...but hyphens and slashes in the url must survive the control-char strip
    expect(logged.url).toContain("/homes/Y-A4");
  });
});

describe("crash-loop protection", () => {
  it("takes ten reports a minute from one client, then goes quiet", async () => {
    const ip = freshIp();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    for (let i = 0; i < 10; i++) await post(boom, ip);
    expect(spy).toHaveBeenCalledTimes(10);

    spy.mockClear();
    for (let i = 0; i < 5; i++) expect((await post(boom, ip)).status).toBe(204);
    // still 204 — but nothing written. A loop cannot bill you for a log.
    expect(spy).not.toHaveBeenCalled();
  });

  it("limits per client, so one broken browser does not blind the rest", async () => {
    const stuck = freshIp();
    vi.spyOn(console, "error").mockImplementation(() => {});
    for (let i = 0; i < 12; i++) await post(boom, stuck);

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    spy.mockClear();
    await post(boom, freshIp());
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("webhook forwarding", () => {
  it("posts a renderable text field plus the structured report", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "https://hooks.example.com/alerts");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    await post(boom);
    const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    // Slack and Discord both render `text` with no schema configuration
    expect(sent.text).toContain("noratun route");
    expect(sent.report.url).toBe(boom.url);
  });

  it("still returns 204 when the webhook itself is down", async () => {
    vi.stubEnv("ERROR_WEBHOOK_URL", "https://hooks.example.com/alerts");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ENOTFOUND"));
    expect((await post(boom)).status).toBe(204);
  });
});
