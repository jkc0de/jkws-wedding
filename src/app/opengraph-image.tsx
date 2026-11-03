import { ImageResponse } from "next/og";

export const alt = "Jordan Koh & Wai Seun — 23 January 2027, The St. Regis Kuala Lumpur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf6ec",
          color: "#2b1d1f",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 10, color: "#961e2e", textTransform: "uppercase" }}>
          Together with their families
        </div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 28, fontSize: 104 }}>
          <span>Jordan Koh</span>
          <span style={{ color: "#961e2e", fontStyle: "italic", margin: "0 36px" }}>&amp;</span>
          <span>Wai Seun</span>
        </div>
        <div style={{ marginTop: 36, fontSize: 40, color: "#5a4a47" }}>Saturday, 23 January 2027</div>
        <div style={{ marginTop: 12, fontSize: 22, letterSpacing: 8, color: "#7a6a66", textTransform: "uppercase" }}>
          The St. Regis Kuala Lumpur
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, background: "#961e2e" }} />
      </div>
    ),
    size,
  );
}
