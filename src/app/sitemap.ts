import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/projects", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p ? 0.8 : 1 })),
    ...site.services.map((s) => ({ url: `${site.url}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
