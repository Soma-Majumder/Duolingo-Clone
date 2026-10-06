import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_TAGLINE } from "@/lib/site";

// The root URL is the main shared link (signed-out visitors land here from it),
// so /login points search engines and link previews back to "/".
export const metadata: Metadata = {
  title: "Log in or try the demo",
  description: `${SITE_TAGLINE} Log in or try the demo to practice Spanish, French and Japanese with daily lessons and streaks.`,
  alternates: { canonical: "/" },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
