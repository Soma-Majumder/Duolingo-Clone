import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The root URL is the main shared link; lessons sit behind sign-in, so only it is listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 }];
}
