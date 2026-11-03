import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32,
          background: "#961e2e",
          color: "#fbf6ec",
          fontFamily: "serif",
          fontSize: 30,
          letterSpacing: 1,
        }}
      >
        JW
      </div>
    ),
    size,
  );
}
