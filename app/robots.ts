import type { MetadataRoute } from "next";
import { abs, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // previews and localhost stay unindexed; only the configured https origin
  // opens up (see lib/site.ts — a Vercel preview URL must not qualify)
  return {
    rules: site.indexable
      ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/admin"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: abs("/sitemap.xml"),
    host: site.url,
  };
}
