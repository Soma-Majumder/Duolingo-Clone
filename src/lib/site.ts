/** Shared copy and URLs for page metadata, the social card, robots and sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://duolingo-clone-pursuit.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Duolingo Clone";
export const SITE_TAGLINE = "Learn a language. Build a streak. Have fun.";
export const SITE_DESCRIPTION =
  "A free Duolingo-style language app: bite-sized Spanish, French and Japanese lessons with XP, daily streaks, streak freezes and friendly mascots.";
