import { ImageResponse } from "next/og";
import { DragonMascot } from "@/components/DragonMascot";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

// Draco is the favicon on lesson pages (Clio is the site-wide one). The
// viewBox crops the empty space around him so he fills the tab icon.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <DragonMascot animated={false} viewBox="74 28 284 284" width={192} height={192} />
      </div>
    ),
    size,
  );
}
