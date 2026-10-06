import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in or try the demo",
  description: `${SITE_TAGLINE} Log in or try the demo to practice Spanish, French and Japanese with daily lessons and streaks.`,
  alternates: { canonical: "/login" },
  openGraph: { url: "/login" },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
