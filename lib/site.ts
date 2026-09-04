// Canonical deployment facts — everything SEO-shaped reads from here.
//
// An env var that EXISTS BUT IS BLANK has to be treated as absent. `??` only
// falls through on null/undefined, so a blank NEXT_PUBLIC_SITE_URL used to
// reach `new URL("")` and fail the production build outright:
//   TypeError: Invalid URL … input: ''  (while collecting page data)
// Anything that does not parse as a URL is discarded here instead, so
// `site.url` is always a usable absolute origin.
const origin = (raw?: string, scheme = ""): string | undefined => {
  const v = raw?.trim();
  if (!v) return undefined;
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : scheme + v).toString().replace(/\/+$/, "");
  } catch {
    return undefined;
  }
};

// the origin the owner configured — the only one allowed into the index
const canonical = origin(process.env.NEXT_PUBLIC_SITE_URL);

export const site = {
  url:
    canonical ??
    // Vercel's stable production domain, then the per-deployment URL: both
    // keep the build working before NEXT_PUBLIC_SITE_URL is set
    origin(process.env.VERCEL_PROJECT_PRODUCTION_URL, "https://") ??
    origin(process.env.VERCEL_URL, "https://") ??
    "http://localhost:3800",
  // Indexable only on a configured https origin, and never on a Vercel
  // preview — without this the VERCEL_URL fallback above would hand every
  // preview deployment a crawlable https origin.
  indexable:
    Boolean(canonical?.startsWith("https://") && !canonical.includes("localhost")) &&
    process.env.VERCEL_ENV !== "preview",
  name: "NORATUN",
  legalName: "Noratun — residences across Armenia",
  title: "NORATUN — houses & apartments in Yerevan, Dilijan, Sevan, Tsaghkadzor",
  description:
    "«Նոր տուն» — a new house. Apartments in Yerevan and houses in Dilijan, Sevan and Tsaghkadzor, checked and placed by one small team.",
  locale: "en_US",
  lang: "en",
  city: "Yerevan",
  country: "AM",
  themeColor: "#f4f2ea",
};

export const abs = (path = "/") => new URL(path, site.url).toString();
