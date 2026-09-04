// Canonical deployment facts — everything SEO-shaped reads from here.
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const fromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

export const site = {
  url: fromEnv ?? fromVercel ?? "http://localhost:3800",
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
