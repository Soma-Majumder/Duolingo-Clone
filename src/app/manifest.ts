import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Duo Clone",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#effaf7",
    theme_color: "#58cc02",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
