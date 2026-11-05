// One-off: turn the white logo background transparent and trim it.
import sharp from "sharp";
const src = process.argv[2], out = process.argv[3];
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const m = Math.min(data[i], data[i + 1], data[i + 2]);
  // Soft ramp: pure white -> transparent, keeps anti-aliased edges smooth
  if (m > 200) data[i + 3] = Math.round(255 * Math.max(0, Math.min(1, (250 - m) / 50)));
}
await sharp(data, { raw: info }).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(out);
console.log(await sharp(out).metadata().then((m) => `${m.width}x${m.height}`));
