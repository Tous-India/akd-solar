import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

let logoData: string | null = null;
async function logo() {
  if (!logoData) {
    const buf = await readFile(join(process.cwd(), "src/assets/og-logo.png"));
    logoData = `data:image/png;base64,${buf.toString("base64")}`;
  }
  return logoData;
}

/** Branded 1200×630 Open Graph image: sunrise motif, logo, eyebrow and title. */
export async function renderOg({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const src = await logo();
  const rays = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI + (i / 8) * Math.PI;
    return { x1: 1000 + Math.cos(a) * 200, y1: 630 + Math.sin(a) * 200, x2: 1000 + Math.cos(a) * 260, y2: 630 + Math.sin(a) * 260 };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #FBF8F2 0%, #FBF8F2 55%, #FFE7B8 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="630" stroke="#1E4FB0" strokeOpacity="0.06" strokeWidth="1" />
          ))}
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 44} x2="1200" y2={i * 44} stroke="#1E4FB0" strokeOpacity="0.06" strokeWidth="1" />
          ))}
          <circle cx="1000" cy="630" r="320" fill="#FFC93C" fillOpacity="0.25" />
          <circle cx="1000" cy="630" r="170" fill="#FFC93C" />
          {rays.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#F7931E" strokeWidth="14" strokeLinecap="round" />
          ))}
          <rect x="0" y="610" width="1200" height="20" fill="#2E8B1E" />
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={330} height={134} alt="" style={{ position: "relative" }} />

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 820, position: "relative" }}>
          {eyebrow ? (
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#B35900", marginBottom: 18 }}>{eyebrow}</div>
          ) : null}
          <div style={{ fontSize: title.length > 48 ? 58 : 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#101828" }}>{title}</div>
          <div style={{ marginTop: 26, fontSize: 26, color: "#475467" }}>
            {`${site.tagline} · ${site.url.replace("https://", "")}`}
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
