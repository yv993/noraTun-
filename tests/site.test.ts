import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// lib/site.ts decides two things that are invisible until they are wrong:
// the canonical origin every URL is built from, and whether this deployment is
// allowed into a search index. Both are computed once at module load from env,
// so every case needs a fresh module — hence resetModules rather than a plain
// import at the top.
//
// This file exists because both halves have already failed in production once:
// a blank NEXT_PUBLIC_SITE_URL crashed `new URL("")` during the build, and the
// robots gate shipped `index: true` while robots.txt said `Disallow: /`.

const load = async () => (await import("@/lib/site")).site;

beforeEach(() => {
  vi.resetModules();
  for (const k of [
    "NEXT_PUBLIC_SITE_URL",
    "VERCEL_PROJECT_PRODUCTION_URL",
    "VERCEL_URL",
    "VERCEL_ENV",
  ]) {
    vi.stubEnv(k, "");
  }
});
afterEach(() => vi.unstubAllEnvs());

describe("origin parsing", () => {
  it("uses the configured origin and strips a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noratun.am/");
    expect((await load()).url).toBe("https://noratun.am");
  });

  it("treats a blank value as absent rather than crashing on new URL('')", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "   ");
    const site = await load();
    expect(site.url).toBe("http://localhost:3800");
    expect(site.indexable).toBe(false);
  });

  it("discards a value that is not a URL at all", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "noratun dot am");
    expect((await load()).url).toBe("http://localhost:3800");
  });

  it("falls back to Vercel's production domain, adding the scheme", async () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "noratun.vercel.app");
    expect((await load()).url).toBe("https://noratun.vercel.app");
  });

  it("prefers the configured origin over any Vercel fallback", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noratun.am");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "noratun.vercel.app");
    expect((await load()).url).toBe("https://noratun.am");
  });
});

describe("the indexing gate", () => {
  it("opens only on a configured https origin", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noratun.am");
    expect((await load()).indexable).toBe(true);
  });

  it("stays shut on http", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://noratun.am");
    expect((await load()).indexable).toBe(false);
  });

  it("stays shut on a Vercel preview even with a real origin set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noratun.am");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect((await load()).indexable).toBe(false);
  });

  it("stays shut when only the Vercel fallback supplied the https origin", async () => {
    // the fallback exists to keep the BUILD working before the domain is set;
    // it must never be enough on its own to invite a crawler in
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "noratun.vercel.app");
    const site = await load();
    expect(site.url).toBe("https://noratun.vercel.app");
    expect(site.indexable).toBe(false);
  });

  it("stays shut on localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://localhost:3800");
    expect((await load()).indexable).toBe(false);
  });
});

describe("robots.txt agrees with the meta gate", () => {
  // the pair that contradicted each other in production
  it("disallows everything when not indexable", async () => {
    vi.resetModules();
    const robots = (await import("@/app/robots")).default();
    expect(robots.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
  });

  it("allows crawling, minus /api and /admin, when indexable", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noratun.am");
    vi.resetModules();
    const robots = (await import("@/app/robots")).default();
    const rule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toContain("/admin");
    expect(robots.sitemap).toBe("https://noratun.am/sitemap.xml");
  });
});
