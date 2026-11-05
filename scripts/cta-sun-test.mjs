// Focused test for the CTA "rising sun". Usage: node scripts/cta-sun-test.mjs (server on :3100)
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = new URL("../screenshots/cta-sun/", import.meta.url);
const SIZES = [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];
const failures = [];
const fail = (m) => (failures.push(m), console.log("  ✗", m));
const pass = (m) => console.log("  ✓", m);
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function measure(page) {
  return page.evaluate(() => {
    const scene = document.querySelector("[data-sun-scene]");
    const svg = scene.querySelector("[data-sun-group]").ownerSVGElement;
    const core = svg.querySelector("[data-sun-core]");
    const group = svg.querySelector("[data-sun-group]");
    const buttons = [...scene.querySelectorAll("[data-sun-reveal]")].map((b) => b.getBoundingClientRect());
    const wa = document.querySelector('a[aria-label^="Chat with AKD Solar on WhatsApp"]').getBoundingClientRect();
    const c = core.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    // only the visible (clipped by the card) part of the core counts
    const vis = { left: c.left, right: c.right, top: c.top, bottom: Math.min(c.bottom, sceneRect.bottom) };
    const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    return {
      coreTop: c.top - sceneRect.top,
      groupTransform: getComputedStyle(group).transform,
      warm: getComputedStyle(scene).getPropertyValue("--sun-c").trim(),
      revealOpacity: Number(getComputedStyle(scene.querySelector("[data-sun-reveal]")).opacity),
      coreOverButtons: buttons.some((b) => hit(vis, b)),
      coreOverWhatsApp: hit(vis, wa),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
}

for (const [w, h] of SIZES) {
  const touch = w < 1024;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // Walk down the page to the CTA so everything above has initialised
  const top = await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    const el = document.querySelector("[data-sun-scene]");
    return el.getBoundingClientRect().top + window.scrollY;
  });

  const frames = [];
  for (const [label, frac] of [
    ["start", 0.9],
    ["mid", 0.45],
    ["end", 0.05],
  ]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, top - h * frac));
    await page.waitForTimeout(1600);
    const m = await measure(page);
    frames.push(m);
    await page.locator("[data-sun-scene]").screenshot({ path: fileURLToPath(new URL(`cta-${w}-${label}.png`, OUT)) });
    if (m.overflow) fail(`${w}: horizontal overflow at ${label}`);
    if (m.coreOverButtons) fail(`${w}: sun overlaps buttons at ${label}`);
    if (touch && label === "end" && m.coreOverWhatsApp) fail(`${w}: sun overlaps WhatsApp button at ${label}`);
  }
  const [start, , end] = frames;
  start.coreTop > end.coreTop ? pass(`${w}: sun rises (${Math.round(start.coreTop)}px → ${Math.round(end.coreTop)}px from card top)`) : fail(`${w}: sun did not rise`);
  if (w >= 768) {
    start.warm !== end.warm ? pass(`${w}: card warms (${start.warm} → ${end.warm})`) : fail(`${w}: card warmth did not change`);
    end.revealOpacity > 0.95 ? pass(`${w}: buttons revealed by the end`) : fail(`${w}: buttons not revealed (${end.revealOpacity})`);
  }
  errors.length ? fail(`${w}: console errors ${errors.join(" | ")}`) : pass(`${w}: no console errors`);
  await ctx.close();
}

// Reduced motion: final state, static
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.locator("[data-sun-scene]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const m = await measure(page);
  m.groupTransform === "none" && m.revealOpacity === 1 ? pass("reduced motion: sun fully risen and static, buttons visible") : fail(`reduced motion: transform=${m.groupTransform} reveal=${m.revealOpacity}`);
  await page.locator("[data-sun-scene]").screenshot({ path: fileURLToPath(new URL("cta-reduced-motion.png", OUT)) });
  await ctx.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} FAILURE(S)` : "\nCTA SUN: ALL CHECKS PASSED");
process.exit(failures.length ? 1 : 0);
