import { ImageResponse } from "next/og";
import { ClioMascot } from "@/components/ClioMascot";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

// Clio is the favicon. The viewBox crops the empty space around her so she fills the tab icon.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <ClioMascot animated={false} viewBox="76 56 296 296" width={192} height={192} />
      </div>
    ),
    size,
  );
}
