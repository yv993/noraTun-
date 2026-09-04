import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: abs("/homes"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
