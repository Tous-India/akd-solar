// Home hero checks: full opacity while scrolling, colours, no lower sun, no GSAP/console noise.
// Usage: node scripts/hero-test.mjs (production server on :3100)
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = new URL("../screenshots/hero/", import.meta.url);
const shot = (name) => fileURLToPath(new URL(name, OUT));
await mkdir(OUT, { recursive: true });

const failures = [];
const fail = (m) => (failures.push(m), console.log("  ✗", m));
const pass = (m) => console.log("  ✓", m);

const browser = await chromium.launch();

const open = async ([width, height]) => {
  const touch = width < 1024;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch });
  const page = await context.newPage();
  const noise = [];
  page.on("pageerror", (e) => noise.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && /gsap|target|not found/i.test(m.text()))) noise.push(m.text());
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000); // entrance finished
  return { context, page, noise };
};

/** Effective opacity (own × ancestors) and any washing-out ancestor effects for every hero element in view */
const audit = (page) =>
  page.evaluate(() => {
    const hero = document.querySelector("main section");
    const els = {
      heading: hero.querySelector("h1"),
      lead: hero.querySelector("h1 ~ p, [data-hero-heading] + p"),
      primary: hero.querySelector('a[href="/contact"]'),
      secondary: hero.querySelector('a[href="/calculator"]'),
      checklist: hero.querySelector("ul"),
      ...Object.fromEntries([...hero.querySelectorAll("[data-word]")].map((w) => [`word "${w.textContent}"`, w])),
    };
    const out = {};
    for (const [name, el] of Object.entries(els)) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) continue; // scrolled out of view
      let opacity = 1;
      const effects = [];
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        opacity *= Number(cs.opacity);
        if (cs.filter !== "none") effects.push(`filter ${cs.filter}`);
        if (cs.mixBlendMode !== "normal") effects.push(`blend ${cs.mixBlendMode}`);
        if (cs.visibility === "hidden") effects.push("hidden");
      }
      out[name] = { opacity: +opacity.toFixed(3), effects };
    }
    return { scrollY: Math.round(scrollY), out };
  });

for (const size of [
  [1366, 768],
  [390, 844],
]) {
  const [w, h] = size;
  console.log(`\n${w}x${h}`);
  const { context, page, noise } = await open(size);

  // Scroll like a visitor: wheel on desktop (Lenis), touch-style scroll on phones
  if (w >= 1024) await page.mouse.move(w / 2, h / 2);
  let at = 0;
  for (const target of [0, 150, 300, 500]) {
    if (target > at) {
      if (w >= 1024) await page.mouse.wheel(0, target - at);
      else await page.evaluate((y) => window.scrollTo(0, y), target);
      at = target;
    }
    await page.waitForTimeout(1600);
    const { scrollY, out } = await audit(page);
    await page.screenshot({ path: shot(`hero-${w}x${h}-scroll-${target}.png`) });
    const bad = Object.entries(out).filter(([, v]) => v.opacity !== 1 || v.effects.length);
    bad.length
      ? fail(`scroll ${scrollY}: ${bad.map(([k, v]) => `${k} opacity ${v.opacity} ${v.effects.join(",")}`).join(" | ")}`)
      : pass(`scroll ${scrollY}: ${Object.keys(out).length} visible elements at full opacity, no filter/blend`);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const style = await page.evaluate(() => {
    const hero = document.querySelector("main section");
    const word = (t) => getComputedStyle([...hero.querySelectorAll("[data-word]")].find((w) => w.textContent === t)).color;
    const cs = (sel) => getComputedStyle(hero.querySelector(sel));
    const hex = (c) => c;
    return {
      pay: word("Pay"),
      less: word("less,"),
      greener: word("greener."),
      primaryBg: hex(cs('a[href="/contact"]').backgroundColor),
      primaryText: hex(cs('a[href="/contact"]').color),
      secondaryBg: hex(cs('a[href="/calculator"]').backgroundColor),
      secondaryBorder: cs('a[href="/calculator"]').borderTopWidth,
      secondaryText: hex(cs('a[href="/calculator"]').color),
      lowerSun: hero.querySelectorAll("[data-sun-group]").length,
      sparkle: hero.querySelectorAll('svg path[fill="#F7931E"]').length,
      leftoverInline: [...hero.querySelectorAll("[data-hero-fade], [data-hero-art]")].filter((e) => e.style.opacity || e.style.transform).length,
    };
  });
  const INK = "rgb(16, 24, 40)";
  style.pay === INK && style.less === INK ? pass('"Pay less," is ink #101828') : fail(`Pay less colour ${style.pay} / ${style.less}`);
  style.greener === "rgb(46, 139, 30)" ? pass('"greener." is solar green #2E8B1E') : fail(`greener colour ${style.greener}`);
  style.primaryBg === "rgb(247, 147, 30)" && style.primaryText === INK ? pass("primary button: solid #F7931E with ink text") : fail(`primary ${style.primaryBg} / ${style.primaryText}`);
  style.secondaryBg === "rgb(255, 255, 255)" && style.secondaryBorder === "1px" && style.secondaryText === INK
    ? pass("secondary button: white, 1px border, ink text")
    : fail(`secondary ${style.secondaryBg} / ${style.secondaryBorder} / ${style.secondaryText}`);
  style.lowerSun === 0 ? pass("lower sun removed") : fail("lower sun still in the hero");
  style.sparkle >= 1 ? pass("small sparkle kept") : fail("sparkle missing");
  style.leftoverInline === 0 ? pass("entrance left no inline opacity/transform behind") : fail(`${style.leftoverInline} elements kept inline opacity/transform`);
  noise.length ? fail(`console: ${noise.slice(0, 3).join(" | ")}`) : pass("no GSAP warnings or console errors");
  await context.close();
}

// Balance of the illustration at each width
console.log("\nIllustration balance");
for (const size of [
  [360, 800],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
]) {
  const { context, page, noise } = await open(size);
  const m = await page.evaluate(() => {
    const hero = document.querySelector("main section");
    const art = hero.querySelector("[data-hero-art] > svg").getBoundingClientRect();
    return { gap: Math.round(hero.getBoundingClientRect().bottom - art.bottom), overflow: document.documentElement.scrollWidth > innerWidth };
  });
  await page.locator("main section").first().screenshot({ path: shot(`hero-balance-${size[0]}.png`) });
  m.overflow ? fail(`${size[0]}: horizontal overflow`) : pass(`${size[0]}: no overflow, ${m.gap}px below the illustration`);
  if (noise.length) fail(`${size[0]}: console ${noise[0]}`);
  await context.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} FAILURE(S)` : "\nHERO: ALL CHECKS PASSED");
process.exit(failures.length ? 1 : 0);
