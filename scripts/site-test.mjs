// End-to-end checks + stitched screenshots for the minimal redesign.
// Usage: npm run build && npx next start -p 3100, then: node scripts/site-test.mjs
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = fileURLToPath(new URL("../screenshots/site/", import.meta.url));
const WIDTHS = [360, 768, 1024, 1440, 1920];
const PAGES = [
  ["home", "/"],
  ["pm-surya-ghar", "/pm-surya-ghar-yojana"],
  ["residential-rooftop", "/solar-solutions/residential-rooftop"],
  ["projects", "/projects"],
  ["contact", "/contact"],
];
const failures = [];
const fail = (m) => (failures.push(m), console.log("  ✗", m));
const pass = (m) => console.log("  ✓", m);
const check = (ok, m) => (ok ? pass(m) : fail(m));
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function newPage(width, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, hasTouch: width < 768 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return { ctx, page, errors };
}

/** Screenshots by scrolling the real viewport (fullPage would resize it and reset matchMedia animations). */
async function stitched(page, file) {
  const vh = page.viewportSize().height;
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const tiles = [];
  for (let y = 0; y < total; y += vh) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(450);
    const realY = await page.evaluate(() => window.scrollY);
    tiles.push({ input: await page.screenshot(), top: realY, left: 0 });
    if (tiles.length === 1) {
      // keep fixed chrome only on the first tile
      await page.addStyleTag({ content: "header,.subsidy-strip,.pointer-events-none.fixed.top-0,[aria-label^='Chat with AKD'],.pb-safe{visibility:hidden!important}" });
    }
  }
  const w = page.viewportSize().width;
  await sharp({ create: { width: w, height: total, channels: 3, background: "#fff" } })
    .composite(tiles.reverse())
    .jpeg({ quality: 70 })
    .toFile(file);
  await page.evaluate(() => window.scrollTo(0, 0));
}

// ---------- Responsive pass ----------
for (const width of WIDTHS) {
  console.log(`\n== ${width}px`);
  for (const [name, path] of PAGES) {
    const { ctx, page, errors } = await newPage(width);
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${name}: no horizontal overflow (${overflow}px)`);
    await stitched(page, `${OUT}${name}-${width}.jpg`);
    if (name === "home") {
      const g = await page.evaluate(() => {
        const r = (el) => el.getBoundingClientRect();
        const b = r(document.querySelector('[aria-roledescription="carousel"]'));
        const prev = r(document.querySelector('[aria-label="Previous banner"]'));
        const next = r(document.querySelector('[aria-label="Next banner"]'));
        const dots = r(document.querySelector('[aria-label="Choose banner"]'));
        const header = r(document.querySelector("header"));
        const hit = (a, c) => a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top;
        const mid = b.top + b.height / 2;
        return {
          ratio: +(b.width / b.height).toFixed(2),
          fullWidth: Math.round(b.left) === 0 && Math.round(b.width) === innerWidth,
          belowHeader: b.top >= header.bottom - 1,
          prevLeft: Math.round(prev.left - b.left),
          nextRight: Math.round(b.right - next.right),
          size: Math.round(prev.width),
          centred: Math.abs(prev.top + prev.height / 2 - mid) < 2 && Math.abs(next.top + next.height / 2 - mid) < 2,
          dotsInside: dots.bottom <= b.bottom && dots.top >= b.top,
          overlap: hit(prev, dots) || hit(next, dots),
        };
      });
      const mobile = width < 768;
      check(g.ratio === (mobile ? 1.5 : 3), `banner ratio ${g.ratio}`);
      check(g.fullWidth && g.belowHeader, "banner is edge-to-edge and starts below the header");
      check(g.size === (mobile ? 36 : 44) && g.prevLeft === (mobile ? 8 : 16) && g.nextRight === (mobile ? 8 : 16), `arrows ${g.size}px, ${g.prevLeft}/${g.nextRight}px from edges`);
      check(g.centred, "arrows vertically centred");
      check(g.dotsInside && !g.overlap, "dots inside banner, not covered by arrows");
    }
    const overflowAfter = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflowAfter <= 0, `${name}: no overflow after scrolling (${overflowAfter}px)`);
    check(errors.length === 0, `${name}: no console errors${errors.length ? " → " + errors.slice(0, 3).join(" | ") : ""}`);
    await ctx.close();
  }
}

// ---------- Behaviour checks ----------
console.log("\n== Behaviour");
{
  const { ctx, page, errors } = await newPage(1440);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.mouse.move(700, 15); // over the strip, not the slider (hover pauses it)

  // countdown ticks
  const strip = page.locator(".subsidy-strip [data-countdown='inline'] [aria-hidden]").first();
  const t1 = await strip.textContent();
  await page.waitForTimeout(1300);
  const t2 = await strip.textContent();
  check(t1 !== t2 && !t2.includes("–"), `strip countdown ticks (${t1} → ${t2})`);

  // banner slider
  const current = () => page.evaluate(() => [...document.querySelectorAll('[aria-label^="Show banner"]')].findIndex((b) => b.getAttribute("aria-current") === "true"));
  check((await current()) === 0, "slider starts on banner 1");
  await page.waitForTimeout(5600);
  check((await current()) === 1, "slider autoplays to banner 2 after 5s");
  const banner = page.locator('[aria-roledescription="carousel"]');
  await banner.hover();
  await page.waitForTimeout(5600);
  check((await current()) === 1, "hover pauses autoplay");
  await page.getByRole("button", { name: "Next banner" }).click();
  check((await current()) === 0, "next arrow loops → banner 1");
  await page.getByRole("button", { name: "Previous banner" }).click();
  check((await current()) === 1, "previous arrow loops → banner 2");
  await page.getByRole("button", { name: "Show banner 1" }).click();
  check((await current()) === 0, "dot → banner 1");
  await banner.focus();
  await page.keyboard.press("ArrowRight");
  check((await current()) === 1, "keyboard ArrowRight → banner 2");
  await page.keyboard.press("ArrowLeft");
  check((await current()) === 0, "keyboard ArrowLeft → banner 1");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(800);
  const op = await page.evaluate(() => [...document.querySelectorAll('[aria-roledescription="slide"]')].map((s) => getComputedStyle(s).opacity));
  check(op.join(",") === "0,1", `only banner 2 visible (${op.join(",")})`);
  const lcp = await page.evaluate(() => [...document.querySelectorAll('[aria-roledescription="slide"] img')].map((i) => i.getAttribute("fetchpriority") ?? "-"));
  check(lcp[0] === "high" && lcp.slice(1).every((p) => p === "auto"), `priority on first banner only (${lcp.join(",")})`);
  await page.mouse.move(700, 15);

  // dropdown
  await page.getByRole("button", { name: /Solar Solutions/ }).first().click();
  check(await page.locator("#solutions-menu").isVisible(), "Solar Solutions dropdown opens");
  check((await page.locator("#solutions-menu a").count()) === 3, "dropdown has 3 links");
  await page.keyboard.press("Escape");

  // strip dismissal persists for the session
  await page.getByRole("button", { name: "Hide subsidy countdown" }).click();
  check(!(await page.locator(".subsidy-strip").isVisible()), "strip hides on dismiss");
  await page.reload({ waitUntil: "networkidle" });
  check(!(await page.locator(".subsidy-strip").isVisible()), "strip stays hidden after reload");
  check(errors.length === 0, `home behaviour: no console errors${errors.length ? " → " + errors.join(" | ") : ""}`);
  await ctx.close();
}
{
  const { ctx, page, errors } = await newPage(390, 844);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const days = await page.locator(".subsidy-strip [data-countdown='days']").first();
  check(await days.isVisible(), "mobile strip shows days only");
  const swipe = (from, to) =>
    page.evaluate(
      ([from, to]) => {
        const el = document.querySelector('[aria-roledescription="carousel"]');
        const t = (x) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 300 });
        el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [t(from)], changedTouches: [t(from)] }));
        el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, touches: [], changedTouches: [t(to)] }));
        return [...document.querySelectorAll('[aria-label^="Show banner"]')].findIndex((b) => b.getAttribute("aria-current") === "true");
      },
      [from, to],
    );
  await swipe(300, 80);
  const afterLeft = await page.evaluate(() => [...document.querySelectorAll('[aria-label^="Show banner"]')].findIndex((b) => b.getAttribute("aria-current") === "true"));
  check(afterLeft === 1, `swipe left → banner 2 (${afterLeft + 1})`);
  await swipe(80, 300);
  const afterRight = await page.evaluate(() => [...document.querySelectorAll('[aria-label^="Show banner"]')].findIndex((b) => b.getAttribute("aria-current") === "true"));
  check(afterRight === 0, `swipe right → banner 1 (${afterRight + 1})`);
  const mobileSrc = await page.evaluate(() => document.querySelector('[aria-roledescription="slide"] img').currentSrc);
  check(mobileSrc.includes("banner-1-mobile"), "mobile uses the 3:2 banner");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(600);
  check(await page.locator("#mobile-menu").isVisible(), "mobile menu opens");
  await page.locator("#mobile-menu button[aria-controls='mm-locations']").click();
  await page.waitForTimeout(400);
  check((await page.locator("#mm-locations li a").count()) === 7, "mobile locations accordion lists 7 cities");
  check(errors.length === 0, "mobile: no console errors");
  await ctx.close();
}
{
  const { ctx, page, errors } = await newPage(1440);
  await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
  const all = await page.locator("[data-photo]").count();
  await page.getByRole("button", { name: /^Commercial \d/ }).click();
  await page.waitForTimeout(500);
  const com = await page.locator("[data-photo]").count();
  check(com > 0 && com < all, `filter tabs work (all ${all}, commercial ${com})`);
  await page.getByRole("button", { name: /^All \d/ }).click();
  await page.locator("[data-photo] button, button[data-photo]").first().click();
  const lb = page.locator("[data-lightbox]");
  await lb.waitFor();
  const c1 = await page.locator("[data-lightbox-counter]").textContent();
  await page.getByRole("button", { name: "Next image" }).click();
  const c2 = await page.locator("[data-lightbox-counter]").textContent();
  check(c1 !== c2, `lightbox next updates counter (${c1} → ${c2})`);
  await page.keyboard.press("ArrowRight");
  const c3 = await page.locator("[data-lightbox-counter]").textContent();
  check(c3 !== c2, `lightbox arrow key (${c3})`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check((await lb.count()) === 0 || !(await lb.isVisible()), "lightbox closes on Esc");
  const names = await page.evaluate(() => document.body.innerText.match(/TODO/g)?.length ?? 0);
  check(names === 0, "no TODO text on projects page");
  check(errors.length === 0, "projects: no console errors");
  await ctx.close();
}
{
  const { ctx, page, errors } = await newPage(1440);
  await page.goto(BASE + "/pm-surya-ghar-yojana", { waitUntil: "networkidle" });
  const s1 = await page.locator("[data-countdown='seconds']").first().textContent();
  await page.waitForTimeout(1300);
  const s2 = await page.locator("[data-countdown='seconds']").first().textContent();
  check(s1 !== s2, `big countdown ticks (${s1.trim()} → ${s2.trim()})`);
  const faq = await page.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) => s.textContent.includes('"FAQPage"')));
  check(faq, "PM page has FAQPage JSON-LD");

  await page.goto(BASE + "/calculator?units=600", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const kw = (await page.locator("[data-kw]").textContent()).replace(/\s+/g, " ");
  check(/5\.5.*6/.test(kw), `calculator 600 units → ${kw}`);
  check(errors.length === 0, "pm/calculator: no console errors");
  await ctx.close();
}

// ---------- HTTP checks ----------
console.log("\n== HTTP");
const redirects = [
  ["/services", "/solar-solutions"],
  ["/services/residential-rooftop-solar", null],
  ["/solar-panel-installation/noida", "/solar-panel-installation/delhi-ncr"],
  ["/solar-panel-installation/hisar", "/locations"],
];
for (const [from, to] of redirects) {
  const r = await fetch(BASE + from, { redirect: "manual" });
  const loc = r.headers.get("location") ?? "";
  check(r.status === 301 && (!to || loc.endsWith(to)), `${from} → ${r.status} ${loc}`);
}
const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
const cities = sitemap.match(/solar-panel-installation\/[a-z-]+/g) ?? [];
const sols = sitemap.match(/solar-solutions\/[a-z-]+/g) ?? [];
check(new Set(cities).size === 7, `sitemap has 7 cities (${new Set(cities).size})`);
check(new Set(sols).size === 3, `sitemap has 3 solutions (${new Set(sols).size})`);
check(!sitemap.includes("/services"), "sitemap has no /services");
const llms = await (await fetch(BASE + "/llms.txt")).text();
check(llms.includes("akdsolar@gmail.com") && llms.includes("493+") && llms.includes("U74999HR2017PTC069164"), "llms.txt has email, numbers, CIN");
const robots = await (await fetch(BASE + "/robots.txt")).text();
check(robots.includes("sitemap.xml"), "robots.txt links sitemap");

await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nAll checks passed");
process.exit(failures.length ? 1 : 0);
