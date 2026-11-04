/* eslint-disable @next/next/no-img-element -- ImageResponse renders plain img tags */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

import type { NextRequest } from "next/server";
import { coupleNames, hasGroomFlag } from "@/lib/names";

/**
 * Link-preview image for WhatsApp, iMessage, Facebook, etc.
 * Photo on the right, names on the left, exported as a JPEG under ~100 KB so
 * every messaging app will show it. `/og?g` puts the groom first.
 */

const WIDTH = 1200;
const HEIGHT = 630;

// Literal paths so Next can trace these files into the deployment.
const root = process.cwd();

export async function GET(request: NextRequest) {
  const [first, second] = coupleNames(hasGroomFlag(request.nextUrl.searchParams));
  const [photo, logo, stRegis, light, regular, lightItalic, scriptFont] = await Promise.all([
    sharp(path.join(root, "public/hero.jpg"))
      .resize(600, HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality: 88 })
      .toBuffer(),
    readFile(path.join(root, "public/logo.png")),
    readFile(path.join(root, "public/st-regis-logo.svg")),
    readFile(path.join(root, "src/app/og/cormorant-300.woff")),
    readFile(path.join(root, "src/app/og/cormorant-400.woff")),
    readFile(path.join(root, "src/app/og/cormorant-300-italic.woff")),
    readFile(path.join(root, "src/app/og/pinyon-script-400.woff")),
  ]);

  const png = await new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf6ec",
          fontFamily: "Cormorant",
          color: "#2b1d1f",
        }}
      >
        <div
          style={{
            width: 600,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 48px",
            textAlign: "center",
          }}
        >
          <img src={`data:image/png;base64,${logo.toString("base64")}`} width={56} height={84} alt="" />
          <div
            style={{
              marginTop: 28,
              fontSize: 15,
              letterSpacing: 6,
              color: "#961e2e",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            Together with their families
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14, lineHeight: 1.15 }}>
            <span style={{ fontFamily: "Script", fontSize: 74, whiteSpace: "nowrap" }}>{first}</span>
            <span style={{ color: "#961e2e", fontStyle: "italic", fontWeight: 300, fontSize: 44, margin: "0 0 2px" }}>&amp;</span>
            <span style={{ fontFamily: "Script", fontSize: 74, whiteSpace: "nowrap" }}>{second}</span>
          </div>
          <div style={{ marginTop: 24, fontSize: 32, fontWeight: 400, color: "#5a4a47" }}>Saturday, 23 January 2027</div>
          <div style={{ marginTop: 8, fontSize: 15, letterSpacing: 5, color: "#7a6a66", textTransform: "uppercase", fontFamily: "sans-serif" }}>
            The St. Regis Kuala Lumpur
          </div>
          <img
            src={`data:image/svg+xml;base64,${stRegis.toString("base64")}`}
            width={110}
            height={30}
            alt=""
            style={{ marginTop: 16 }}
          />
        </div>
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          width={600}
          height={HEIGHT}
          alt=""
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Cormorant", data: light, weight: 300, style: "normal" },
        { name: "Cormorant", data: regular, weight: 400, style: "normal" },
        { name: "Cormorant", data: lightItalic, weight: 300, style: "italic" },
        { name: "Script", data: scriptFont, weight: 400, style: "normal" },
      ],
    },
  ).arrayBuffer();

  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
