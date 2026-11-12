// Generates TEMPORARY placeholder homepage banners from project photos.
// Usage: node scripts/make-banners.mjs  →  public/images/banners/banner-N.jpg (1920×600) + banner-N-mobile.jpg (1080×1080)
// Replace the output with final artwork when it's ready (see README).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = new URL("../public/images/projects/", import.meta.url);
const OUT = new URL("../public/images/banners/", import.meta.url);
await mkdir(OUT, { recursive: true });

const NAVY = "#0a1730";
const SUN = "#f7931e";
const GOLD = "#ffc93c";
const FONT = "Segoe UI, Arial, sans-serif";

const banners = [
  { photo: "p19-1.jpg", line: "Up to ₹78,000 PM Surya Ghar subsidy", tag: "Apply before 31 March 2027" },
  { photo: "p01-1.jpg", line: "493+ rooftops powered in Haryana", tag: "AKD Solar · since 2017" },
  { photo: "p17-1.jpg", line: "Rooftop solar installed in 3 days", tag: "Free site visit · Sonipat & Delhi NCR" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function desktopSvg({ line, tag }) {
  return `<svg width="1920" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="${NAVY}" stop-opacity="0.94"/>
    <stop offset="0.45" stop-color="${NAVY}" stop-opacity="0.75"/>
    <stop offset="0.8" stop-color="${NAVY}" stop-opacity="0.05"/>
  </linearGradient></defs>
  <rect width="1920" height="600" fill="url(#g)"/>
  <rect x="160" y="236" width="72" height="8" rx="4" fill="${SUN}"/>
  <text x="160" y="330" font-family="${FONT}" font-size="64" font-weight="800" fill="#fff">${esc(line)}</text>
  <text x="160" y="392" font-family="${FONT}" font-size="30" font-weight="600" fill="${GOLD}">${esc(tag)}</text>
</svg>`;
}

function mobileSvg({ line, tag }) {
  // wrap the line into at most 2 rows
  const words = line.split(" ");
  const rows = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 20 && cur) {
      rows.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  rows.push(cur);
  const text = rows
    .map((r, i) => `<text x="80" y="${860 + i * 84 - (rows.length - 1) * 84}" font-family="${FONT}" font-size="72" font-weight="800" fill="#fff">${esc(r)}</text>`)
    .join("");
  return `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0.3" stop-color="${NAVY}" stop-opacity="0"/>
    <stop offset="0.65" stop-color="${NAVY}" stop-opacity="0.85"/>
    <stop offset="1" stop-color="${NAVY}" stop-opacity="0.96"/>
  </linearGradient></defs>
  <rect width="1080" height="1080" fill="url(#g)"/>
  <rect x="80" y="${740 - (rows.length - 1) * 84}" width="72" height="8" rx="4" fill="${SUN}"/>
  ${text}
  <text x="80" y="945" font-family="${FONT}" font-size="38" font-weight="600" fill="${GOLD}">${esc(tag)}</text>
</svg>`;
}

for (const [i, b] of banners.entries()) {
  const n = i + 1;
  const photo = new URL(b.photo, SRC).pathname.replace(/^\/(\w:)/, "$1");
  await sharp(photo)
    .resize(1920, 600, { fit: "cover", position: "attention" })
    .composite([{ input: Buffer.from(desktopSvg(b)) }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(new URL(`banner-${n}.jpg`, OUT).pathname.replace(/^\/(\w:)/, "$1"));
  await sharp(photo)
    .resize(1080, 1080, { fit: "cover", position: "attention" })
    .composite([{ input: Buffer.from(mobileSvg(b)) }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(new URL(`banner-${n}-mobile.jpg`, OUT).pathname.replace(/^\/(\w:)/, "$1"));
  console.log(`banner-${n}: ${b.line}`);
}
