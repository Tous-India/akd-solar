// End-to-end checks + stitched screenshots for the minimal redesign.
// Usage: npm run build && npx next start -p 3100, then: node scripts/site-test.mjs
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = fileURLToPath(new URL("../screenshots/site/", import.meta.url));
const WIDTHS = [360, 768, 1024, 1440];
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
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
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

  // slider
  const current = () => page.evaluate(() => [...document.querySelectorAll('[aria-label^="Show slide"]')].findIndex((b) => b.getAttribute("aria-current") === "true"));
  check((await current()) === 0, "slider starts on slide 1");
  await page.waitForTimeout(6800);
  check((await current()) === 1, "slider autoplays to slide 2 after 6s");
  await page.getByRole("button", { name: "Next slide" }).click();
  check((await current()) === 2, "next arrow → slide 3");
  await page.getByRole("button", { name: "Show slide 1" }).click();
  check((await current()) === 0, "dot → slide 1");
  await page.getByRole("button", { name: "Show slide 1" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(100);
  check((await current()) === 1, "keyboard ArrowRight → slide 2");
  await page.waitForTimeout(1000);
  const visible = await page.evaluate(() => [...document.querySelectorAll("[data-slide]")].map((s) => getComputedStyle(s).visibility));
  check(visible.filter((v) => v === "visible").length === 1 && visible[1] === "visible", `only slide 2 visible (${visible.join(",")})`);
  const heights = await page.evaluate(() => [...document.querySelectorAll("[data-slide]")].map((s) => Math.round(s.getBoundingClientRect().height)));
  check(new Set(heights).size === 1, `slides share one height (${heights.join(",")})`);

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
