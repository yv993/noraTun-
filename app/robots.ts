import type { MetadataRoute } from "next";
import { abs, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // previews and localhost stay unindexed; only the real https origin opens up
  const isProd = site.url.startsWith("https://") && !site.url.includes("localhost");
  return {
    rules: isProd
      ? [{ userAgent: "*", allow: "/", disallow: ["/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: abs("/sitemap.xml"),
    host: site.url,
  };
}
