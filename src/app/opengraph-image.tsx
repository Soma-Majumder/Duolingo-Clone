import { ImageResponse } from "next/og";
import { ClioMascot } from "@/components/ClioMascot";
import { DragonMascot } from "@/components/DragonMascot";
import { LagoonIsland, LagoonSky, LagoonWater } from "@/components/LagoonScene";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE} Spanish, French and Japanese. Draco the dragon and Clio the jellyfish play in the lagoon.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LANGUAGES = [
  { flag: "🇪🇸", name: "Spanish" },
  { flag: "🇫🇷", name: "French" },
  { flag: "🇯🇵", name: "Japanese" },
];

/** Nunito from Google Fonts, subset to the card's text. Falls back to the default font offline. */
async function loadNunito(weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Nunito:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const text = SITE_NAME + SITE_TAGLINE + LANGUAGES.map((l) => l.name).join("");
  const [black, bold] = await Promise.all([loadNunito(900, text), loadNunito(800, text)]);
  const fonts = [
    black && { name: "Nunito", data: black, weight: 900 as const, style: "normal" as const },
    bold && { name: "Nunito", data: bold, weight: 800 as const, style: "normal" as const },
  ].filter((f) => !!f);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#effaf7",
          fontFamily: "Nunito",
        }}
      >
        <LagoonSky width={1200} height={333} style={{ position: "absolute", top: -70, left: 0 }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, display: "flex", flexDirection: "column" }}>
          <LagoonWater width={1200} height={160} />
          <div style={{ flex: 1, background: "#89dae4" }} />
        </div>
        <LagoonIsland width={420} height={280} style={{ position: "absolute", left: -70, bottom: -40 }} />

        <div
          style={{
            position: "absolute",
            top: 60,
            left: 56,
            width: 720,
            display: "flex",
            flexDirection: "column",
            padding: "36px 44px",
            borderRadius: 36,
            background: "rgba(255, 255, 255, 0.92)",
            border: "4px solid #ffffff",
            boxShadow: "0 18px 60px rgba(50, 107, 119, 0.18)",
          }}
        >
          <div style={{ fontSize: 82, fontWeight: 900, color: "#58cc02", lineHeight: 1, letterSpacing: -1 }}>
            {SITE_NAME}
          </div>
          <div style={{ marginTop: 22, fontSize: 30, fontWeight: 800, color: "#3c3c3c", lineHeight: 1.25, whiteSpace: "nowrap" }}>
            {SITE_TAGLINE}
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 28, fontSize: 30, fontWeight: 800, color: "#49676b" }}>
            {LANGUAGES.map((l) => (
              <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 40 }}>{l.flag}</span>
                {l.name}
              </div>
            ))}
          </div>
        </div>

        <DragonMascot
          animated={false}
          width={300}
          height={300}
          style={{ position: "absolute", left: 825, top: 105 }}
        />
        <ClioMascot
          animated={false}
          width={300}
          height={300}
          style={{ position: "absolute", left: 330, top: 330 }}
        />
      </div>
    ),
    { ...size, fonts, emoji: "twemoji" },
  );
}
