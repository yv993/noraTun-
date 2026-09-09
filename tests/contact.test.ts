import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

// The enquiry route is the one path on this site that can lose a customer, and
// it is the one with the most invisible behaviour: two bot traps that answer
// 200 on purpose, a rate limit, and a delivery step that is allowed to fail as
// long as it says so. Every one of those is a place where a well-meaning edit
// could silently start throwing leads away.

const post = (body: unknown, ip = "1.1.1.1") =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );

const good = {
  name: "Anna Grigoryan",
  email: "anna@example.com",
  phone: "+374 91 234 567",
  message: "I would like to see the Dilijan house this weekend if possible.",
  elapsed: 9000,
};

// A fresh ip per test: the limiter is module-level state that survives between
// tests in the same file, exactly as it survives between requests in a running
// instance.
let n = 0;
const freshIp = () => `10.0.0.${++n}`;

afterEach(() => vi.unstubAllEnvs());

describe("validation", () => {
  it("accepts a complete enquiry", async () => {
    const res = await post(good, freshIp());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
  });

  it("rejects a missing name, a bad email and a one-word message together", async () => {
    const res = await post(
      { ...good, name: "A", email: "not-an-email", message: "hi" },
      freshIp(),
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    // all three at once — a form that reports one error per submit is a form
    // people abandon
    expect(Object.keys(body.errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("rejects a malformed body with 400, not a crash", async () => {
    const res = await POST(
      new Request("http://localhost/api/contact", { method: "POST", body: "{oh no" }),
    );
    expect(res.status).toBe(400);
  });

  it("strips control characters instead of rejecting the message", async () => {
    // D8 Postel: be liberal in what you accept. A pasted message full of \r\n
    // is a normal human paste, not an attack, and must not be bounced.
    const res = await post(
      { ...good, message: "Line one.\r\n\tLine two, pasted from a document." },
      freshIp(),
    );
    expect(res.status).toBe(200);
  });

  it("accepts a phone in any format a person might type", async () => {
    for (const phone of ["+374 10 24 24 24", "010-242424", "(010) 24 24 24", ""]) {
      const res = await post({ ...good, phone }, freshIp());
      expect(res.status, `phone: ${phone}`).toBe(200);
    }
  });
});

describe("bot traps answer 200 so the bot learns nothing", () => {
  it("swallows a filled honeypot", async () => {
    const res = await post({ ...good, company: "Acme SEO Ltd" }, freshIp());
    expect(res.status).toBe(200);
    // claims delivered, delivers nothing — that is the point of the trap
    expect(await res.json()).toMatchObject({ ok: true, delivered: true });
  });

  it("swallows a submit faster than a human could type", async () => {
    const res = await post({ ...good, elapsed: 300 }, freshIp());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ delivered: true });
  });

  it("does NOT swallow a submit with no timing information", async () => {
    // a legitimate client with JS partly broken sends no `elapsed`; treating
    // that as a bot would silently drop real enquiries
    const { elapsed: _drop, ...noTiming } = good;
    const res = await post(noTiming, freshIp());
    expect(await res.json()).toMatchObject({ ok: true, delivered: false });
  });
});

describe("rate limit", () => {
  it("allows five in the window and refuses the sixth with Retry-After", async () => {
    const ip = freshIp();
    for (let i = 0; i < 5; i++) {
      expect((await post(good, ip)).status, `request ${i + 1}`).toBe(200);
    }
    const sixth = await post(good, ip);
    expect(sixth.status).toBe(429);
    expect(sixth.headers.get("Retry-After")).toBe("600");
  });

  it("limits per ip, so one flooder cannot lock out everyone else", async () => {
    const flooder = freshIp();
    for (let i = 0; i < 6; i++) await post(good, flooder);
    expect((await post(good, flooder)).status).toBe(429);
    expect((await post(good, freshIp())).status).toBe(200);
  });
});

describe("delivery honesty", () => {
  it("reports delivered:false when nothing is configured", async () => {
    const res = await post(good, freshIp());
    // the dialog reads this flag to decide whether to promise a call back or
    // offer the phone number instead — it must never be optimistic
    expect(await res.json()).toEqual({ ok: true, delivered: false });
  });

  it("reports delivered:true when the webhook accepts", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.com/x");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const res = await post(good, freshIp());
    expect(await res.json()).toMatchObject({ delivered: true });

    const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sent.name).toBe(good.name);
    // regression guard: this said "kar-site" — leads from this site were
    // labelled as the KAR architecture project
    expect(sent.source).toBe("noratun-site");
  });

  it("reports delivered:false when the webhook rejects, and does not throw", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.com/x");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));
    const res = await post(good, freshIp());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, delivered: false });
  });

  it("survives a delivery transport that throws outright", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.com/x");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));
    const res = await post(good, freshIp());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, delivered: false });
  });
});
