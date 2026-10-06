import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Lessons sit behind sign-in, so only the public entry points are listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
