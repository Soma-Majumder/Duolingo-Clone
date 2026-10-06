import { ImageResponse } from "next/og";
import { ClioMascot } from "@/components/ClioMascot";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS fills transparent home-screen icons with black, so Clio gets the lagoon sky behind her.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(#effaf7, #a9e3e5)",
        }}
      >
        <ClioMascot animated={false} width={156} height={156} />
      </div>
    ),
    size,
  );
}
