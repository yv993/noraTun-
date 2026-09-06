import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";
import { listings } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: abs("/homes"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // every home has its own page, prerendered from the same list
    ...listings.map((l) => ({
      url: abs(`/homes/${l.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    { url: abs("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: abs("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
