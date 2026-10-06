import { ImageResponse } from "next/og";
import { ClioMascot } from "@/components/ClioMascot";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

// Clio is the favicon; the browser scales this down to tab size.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <ClioMascot animated={false} width={192} height={192} />
      </div>
    ),
    size,
  );
}
