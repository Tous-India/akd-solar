// Responsive, SEO and interaction test for the production build.
// Usage: npm run build && npx next start -p 3100   (in another terminal)
//        node scripts/responsive-test.mjs [--no-shots]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const SHOTS = !process.argv.includes("--no-shots");
const OUT = new URL("../screenshots/", import.meta.url);

const failures = [];
const log = (...a) => console.log(...a);
const fail = (msg) => {
  failures.push(msg);
  console.log("  ✗", msg);
};
const pass = (msg) => console.log("  ✓", msg);
const shotPath = (name) => fileURLToPath(new URL(name, OUT));
const isTouch = (w) => w < 1024;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Screenshot sizes requested
const SHOT_SIZES = [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];
// Every page is also checked at these widths (overflow + console)
const CHECK_SIZES = [[320, 640], ...SHOT_SIZES, [2560, 1440]];
const LANDSCAPE = [844, 390];

// Pages screenshotted at every size
const SHOT_PAGES = [
  { name: "home", path: "/" },
  { name: "service-residential", path: "/services/residential-rooftop-solar" },
  { name: "locations", path: "/locations" },
  { name: "city-sonipat", path: "/solar-panel-installation/sonipat" },
  { name: "blog-post", path: "/blog/pm-surya-ghar-subsidy-haryana" },
  { name: "about", path: "/about" },
  { name: "services", path: "/services" },
  { name: "projects", path: "/projects" },
  { name: "calculator", path: "/calculator" },
  { name: "contact", path: "/contact" },
  { name: "blog", path: "/blog" },
  { name: "404", path: "/this-page-does-not-exist" },
];

async function newPage(browser, [width, height], opts = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: isTouch(width),
    isMobile: isTouch(width),
    ...opts,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (/status of 404/.test(text)) return; // the 404 page intentionally returns 404
    errors.push(text);
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return { context, page, errors };
}

/** Scroll through the page in steps so every scroll-triggered animation plays. */
async function scrollThrough(page, stepDelay = 90) {
  // Desktop uses Lenis smooth scrolling: scroll with the mouse wheel like a real visitor
  const { width, height } = page.viewportSize();
  if (width >= 1024) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.mouse.move(width / 2, height / 2);
    for (let y = 0; y < total; y += 400) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(stepDelay + 40);
    }
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    return;
  }
  await page.evaluate(async (delay) => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, delay));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 900));
  }, stepDelay);
}

/**
 * Full-page capture without resizing the viewport. Playwright's fullPage mode resizes the browser,
 * which re-runs gsap.matchMedia and resets reveals mid-capture, so instead we scroll viewport by
 * viewport (like a visitor) and stitch the frames. Fixed UI only appears in the first frame.
 */
async function stitchedScreenshot(page, file) {
  const { default: sharp } = await import("sharp");
  const { width, height } = page.viewportSize();
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const frames = [];
  for (let y = 0, i = 0; y < total; y += height, i++) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(i === 0 ? 300 : 900);
    if (i === 1) {
      await page.addStyleTag({ content: "header, [aria-label^='Chat with AKD Solar'], .pb-safe, .fixed.top-0.z-\\[60\\] { visibility: hidden !important; }" });
    }
    const actualY = await page.evaluate(() => Math.round(window.scrollY));
    frames.push({ buf: await page.screenshot(), top: actualY });
  }
  const composites = frames.map((f) => ({ input: f.buf, left: 0, top: Math.min(f.top, total - height) }));
  await sharp({ create: { width, height: total, channels: 3, background: "#FBF8F2" } }).composite(composites).png().toFile(file);
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function overflowReport(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const sw = document.documentElement.scrollWidth;
    if (sw <= vw) return null;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0) {
        offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
        if (offenders.length > 5) break;
      }
    }
    return { sw, vw, offenders };
  });
}

// ───────────────────────── 1. Crawl files ─────────────────────────
async function crawlFiles() {
  log("\nCrawl files");
  const get = async (p) => {
    const r = await fetch(BASE + p);
    return { status: r.status, type: r.headers.get("content-type"), text: await r.text() };
  };
  const sm = await get("/sitemap.xml");
  const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
  const count = (prefix) => urls.filter((u) => u.startsWith(prefix)).length;
  const cities = urls.filter((u) => u.startsWith("/solar-panel-installation/"));
  const svc = urls.filter((u) => u.startsWith("/services/"));
  const blog = urls.filter((u) => u.startsWith("/blog/"));
  sm.status === 200 ? pass(`sitemap.xml: ${urls.length} URLs (${cities.length} cities, ${svc.length} services, ${blog.length} posts)`) : fail("sitemap.xml missing");
  if (cities.length !== 22) fail(`sitemap has ${cities.length} city URLs, expected 22`);
  if (svc.length !== 5) fail(`sitemap has ${svc.length} service URLs, expected 5`);
  if (blog.length !== 5) fail(`sitemap has ${blog.length} blog URLs, expected 5`);
  for (const p of ["/", "/about", "/services", "/locations", "/projects", "/calculator", "/blog", "/contact", "/sitemap"]) {
    if (!urls.includes(p)) fail(`sitemap missing ${p}`);
  }
  const prio = (path) => sm.text.match(new RegExp(`<loc>[^<]*${path.replace(/[/]/g, "\\/")}</loc>[\\s\\S]*?<priority>([\\d.]+)</priority>`))?.[1];
  prio("/solar-panel-installation/sonipat") === "0.8" && prio("/blog/pm-surya-ghar-subsidy-haryana") === "0.6"
    ? pass("sitemap priorities: cities 0.8, blog 0.6")
    : fail("sitemap priorities unexpected");

  const robots = await get("/robots.txt");
  const bots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
  robots.text.includes("Sitemap: https://www.akdsolar.in/sitemap.xml") && bots.every((b) => robots.text.includes(`User-Agent: ${b}`))
    ? pass(`robots.txt points to sitemap and allows ${bots.join(", ")}`)
    : fail(`robots.txt incomplete:\n${robots.text}`);

  for (const file of ["/llms.txt", "/llms-full.txt"]) {
    const llms = await get(file);
    const missing = [...cities, ...svc, ...blog].filter((u) => !llms.text.includes(`https://www.akdsolar.in${u}`));
    llms.status === 200 && missing.length === 0 && llms.text.startsWith("# AKD Solar")
      ? pass(`${file} lists every city, service and post (${llms.text.length.toLocaleString()} chars, ${llms.type})`)
      : fail(`${file} missing: ${missing.join(", ")}`);
  }
  return urls;
}

// ───────────────────────── 2. SEO per page ─────────────────────────
async function seoChecks(browser, urls) {
  log("\nSEO checks (every page)");
  const { context, page } = await newPage(browser, [1440, 900]);
  const titles = new Map();
  const descs = new Map();
  for (const path of urls) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    const info = await page.evaluate(() => {
      const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
      return {
        title: document.title,
        desc: meta('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogImage: meta('meta[property="og:image"]'),
        ogTitle: meta('meta[property="og:title"]'),
        twitter: meta('meta[name="twitter:card"]'),
        h1: document.querySelectorAll("h1").length,
        imgsNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
        ld,
      };
    });
    const problems = [];
    if (!info.title || info.title.length > 60) problems.push(`title ${info.title?.length} chars`);
    if (!info.desc || info.desc.length > 155) problems.push(`description ${info.desc?.length} chars`);
    if (!info.canonical) problems.push("no canonical");
    if (!info.ogImage || !info.ogTitle || info.twitter !== "summary_large_image") problems.push("OG/Twitter incomplete");
    if (info.h1 !== 1) problems.push(`${info.h1} h1`);
    if (info.imgsNoAlt) problems.push(`${info.imgsNoAlt} img without alt`);
    for (const raw of info.ld) {
      try {
        const j = JSON.parse(raw);
        if (!j["@context"]) problems.push("JSON-LD without @context");
        if (raw.includes("aggregateRating")) problems.push("aggregateRating present");
      } catch (e) {
        problems.push(`invalid JSON-LD: ${e.message}`);
      }
    }
    if (titles.has(info.title)) problems.push(`duplicate title with ${titles.get(info.title)}`);
    if (descs.has(info.desc)) problems.push(`duplicate description with ${descs.get(info.desc)}`);
    titles.set(info.title, path);
    descs.set(info.desc, path);
    problems.length ? fail(`${path}: ${problems.join("; ")}`) : null;
  }
  if (!failures.some((f) => f.startsWith("/"))) pass(`${urls.length} pages: unique titles ≤60, descriptions ≤155, 1 H1, canonical, OG/Twitter, valid JSON-LD`);

  // OG image actually renders
  const og = await fetch(`${BASE}/solar-panel-installation/sonipat/opengraph-image`);
  og.status === 200 && og.headers.get("content-type") === "image/png" ? pass("city OG image renders (image/png)") : fail(`city OG image ${og.status}`);
  await context.close();
}

// ───────────────────────── 3. JSON-LD detail ─────────────────────────
async function schemaChecks(browser) {
  log("\nStructured data");
  const { context, page } = await newPage(browser, [1440, 900]);
  for (const [path, expected] of [
    ["/", ["Organization", "ElectricalContractor", "WebSite", "FAQPage"]],
    ["/solar-panel-installation/sonipat", ["Service", "FAQPage", "BreadcrumbList", "ElectricalContractor"]],
    ["/services/commercial-solar", ["Service", "FAQPage", "BreadcrumbList"]],
    ["/blog/net-metering-process-uhbvn-dhbvn", ["BlogPosting", "FAQPage", "BreadcrumbList"]],
  ]) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    const blocks = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent)));
    const types = blocks.flatMap((b) => (b["@graph"] ? b["@graph"] : [b])).flatMap((n) => [].concat(n["@type"]));
    const missing = expected.filter((t) => !types.includes(t));
    const city = blocks.find((b) => b["@type"] === "Service" && b.areaServed?.geo);
    const extra = path.includes("sonipat") ? (city?.areaServed?.name === "Sonipat" && city.areaServed.geo.latitude ? "" : " (city areaServed/geo missing)") : "";
    missing.length || extra ? fail(`${path}: missing ${missing.join(", ")}${extra}`) : pass(`${path}: ${[...new Set(types)].join(", ")}`);
  }
  await context.close();
}

// ───────────────────────── 4. Responsive ─────────────────────────
async function quickChecks(browser, urls) {
  log("\nOverflow + console on every page × width");
  for (const size of CHECK_SIZES) {
    const { context, page, errors } = await newPage(browser, size);
    let bad = 0;
    for (const path of urls) {
      errors.length = 0;
      try {
        await page.goto(BASE + path, { waitUntil: "load" });
        await page.evaluate(async () => {
          window.scrollTo(0, document.documentElement.scrollHeight / 2);
          await new Promise((r) => setTimeout(r, 250));
          window.scrollTo(0, document.documentElement.scrollHeight);
          await new Promise((r) => setTimeout(r, 250));
        });
        const over = await overflowReport(page);
        if (over) {
          bad++;
          fail(`${path} @${size[0]}: overflow ${over.sw}>${over.vw} — ${over.offenders.join(" | ")}`);
        }
        if (errors.length) {
          bad++;
          fail(`${path} @${size[0]}: console — ${errors.slice(0, 2).join(" | ")}`);
        }
      } catch (e) {
        bad++;
        fail(`${path} @${size[0]}: ${e.message}`);
      }
    }
    if (!bad) pass(`${urls.length} pages @ ${size[0]}x${size[1]}: no overflow, no console errors`);
    await context.close();
    await wait(300);
  }
}

async function screenshots(browser) {
  log("\nScreenshots (full scroll-through)");
  for (const pg of SHOT_PAGES) {
    for (const size of SHOT_SIZES) {
      const { context, page, errors } = await newPage(browser, size);
      const label = `${pg.name} @ ${size[0]}x${size[1]}`;
      try {
        await page.goto(BASE + pg.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await scrollThrough(page);
        const over = await overflowReport(page);
        if (over) fail(`${label}: overflow ${over.sw} > ${over.vw} — ${over.offenders.join(" | ")}`);
        if (errors.length) fail(`${label}: console errors — ${errors.slice(0, 3).join(" | ")}`);
        if (SHOTS) await stitchedScreenshot(page, shotPath(`${pg.name}-${size[0]}x${size[1]}.png`));
        if (!over && !errors.length) pass(label);
      } catch (e) {
        fail(`${label}: ${e.message}`);
      } finally {
        await context.close();
      }
    }
  }
  const { context, page } = await newPage(browser, LANDSCAPE, { isMobile: true, hasTouch: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await scrollThrough(page);
  const over = await overflowReport(page);
  over ? fail("home landscape overflow") : pass("home @ 844x390 landscape");
  if (SHOTS) await stitchedScreenshot(page, shotPath("home-844x390.png"));
  await context.close();
}

// ───────────────────────── 5. Motion ─────────────────────────
async function motionChecks(browser) {
  log("\nAnimations");
  // Desktop: pins, Lenis, release
  {
    const { context, page, errors } = await newPage(browser, [1440, 900]);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const lenis = await page.evaluate(() => document.documentElement.classList.contains("lenis"));
    lenis ? pass("Lenis smooth scroll active on desktop") : fail("Lenis not active on desktop");
    await scrollThrough(page, 60);
    const pins = await page.evaluate(() => document.querySelectorAll(".pin-spacer").length);
    pins >= 2 ? pass(`desktop: ${pins} pinned sections (bill story + projects)`) : fail(`desktop: expected 2 pins, found ${pins}`);

    // Scroll past each pin and make sure the following section sits below it (pin released, no overlap)
    const release = await page.evaluate(async () => {
      const out = [];
      for (const spacer of document.querySelectorAll(".pin-spacer")) {
        const end = spacer.offsetTop + spacer.offsetHeight;
        window.scrollTo(0, end + 200);
        await new Promise((r) => setTimeout(r, 1600));
        const pinned = spacer.firstElementChild;
        const next = spacer.nextElementSibling;
        const pr = pinned.getBoundingClientRect();
        const nr = next?.getBoundingClientRect();
        out.push({
          id: pinned.getAttribute("aria-labelledby"),
          fixed: getComputedStyle(pinned).position === "fixed",
          overlap: nr ? pr.bottom - nr.top > 2 : false,
        });
      }
      return out;
    });
    for (const r of release) r.fixed || r.overlap ? fail(`pin ${r.id} did not release cleanly`) : pass(`pin ${r.id} releases cleanly`);

    // Hero exit + sun journey
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1500);
    const exit = await page.evaluate(() => ({
      headingOpacity: Number(getComputedStyle(document.querySelector("h1")).opacity),
      headingY: new DOMMatrix(getComputedStyle(document.querySelector("[data-hero-heading]")).transform).m42,
      glow: Number(document.querySelector("[data-panel-glow]:last-of-type")?.getAttribute("opacity") ?? getComputedStyle(document.querySelector("[data-panel-glow]")).opacity),
      progress: document.querySelector('[class*="origin-left"][class*="from-sun"]')?.style.transform,
    }));
    exit.headingOpacity === 1 && exit.headingY < 0 ? pass(`hero heading stays at full opacity with parallax (y ${exit.headingY.toFixed(0)}px)`) : fail(`hero scroll: opacity ${exit.headingOpacity}, y ${exit.headingY}`);
    exit.progress?.includes("scale") ? pass("sun-journey progress bar tracks scroll") : fail("progress bar not updating");
    const words = await page.evaluate(() => document.querySelectorAll("h2 span[style*='opacity']").length);
    words > 10 ? pass(`section headings split into ${words} scrubbed words`) : fail("heading word scrub not applied");
    errors.length ? fail(`desktop motion console errors: ${errors.join(" | ")}`) : pass("no console errors during desktop scroll-through");
    await context.close();
  }
  // Mobile: no pins, no Lenis
  {
    const { context, page, errors } = await newPage(browser, [390, 844]);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await scrollThrough(page, 60);
    const state = await page.evaluate(() => ({ pins: document.querySelectorAll(".pin-spacer").length, lenis: document.documentElement.classList.contains("lenis") }));
    state.pins === 0 && !state.lenis ? pass("mobile: pinning and Lenis disabled") : fail(`mobile: pins=${state.pins} lenis=${state.lenis}`);
    errors.length ? fail(`mobile motion console errors: ${errors.join(" | ")}`) : pass("no console errors during mobile scroll-through");
    await context.close();
  }
  // Reduced motion: content visible immediately, no pins
  {
    const { context, page } = await newPage(browser, [1440, 900], { reducedMotion: "reduce" });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const st = await page.evaluate(() => ({
      pins: document.querySelectorAll(".pin-spacer").length,
      hidden: [...document.querySelectorAll("h1, h2")].filter((h) => getComputedStyle(h).visibility === "hidden" || Number(getComputedStyle(h).opacity) < 0.5).length,
    }));
    st.pins === 0 && st.hidden === 0 ? pass("reduced motion: no pins, all headings visible") : fail(`reduced motion: pins=${st.pins} hidden headings=${st.hidden}`);
    await context.close();
  }
}

// ───────────────────────── 6. Interactions ─────────────────────────
async function interactions(browser) {
  log("\nInteractions");

  {
    const { context, page, errors } = await newPage(browser, [390, 844]);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.click('button[aria-controls="mobile-menu"]');
    const menu = page.locator("#mobile-menu");
    await menu.waitFor({ state: "visible" });
    await page.waitForTimeout(900);
    (await page.evaluate(() => document.documentElement.style.overflow === "hidden")) ? pass("mobile menu opens and locks body scroll") : fail("mobile menu did not lock scroll");
    const loc = page.locator('#mobile-menu button[aria-controls="mm-locations"]');
    await loc.click();
    await page.waitForTimeout(600);
    const cityLinks = await page.locator('#mm-locations a[href^="/solar-panel-installation/"]').count();
    cityLinks === 22 ? pass("mobile Locations accordion lists 22 cities") : fail(`mobile Locations accordion shows ${cityLinks} cities`);
    if (SHOTS) await page.screenshot({ path: shotPath("interaction-mobile-menu-390.png") });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(900);
    (await menu.isHidden()) ? pass("Escape closes the mobile menu") : fail("mobile menu still visible after Escape");
    if (errors.length) fail(`mobile menu console errors: ${errors.join(" | ")}`);
    await context.close();
  }

  {
    const { context, page } = await newPage(browser, [1440, 900]);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    for (const kind of ["services", "locations"]) {
      await page.click(`button[aria-controls="${kind}-menu"]`);
      const mega = page.locator(`#${kind}-menu`);
      await mega.waitFor({ state: "visible" });
      await page.waitForTimeout(500);
      const links = await mega.locator("a").count();
      links >= (kind === "locations" ? 23 : 6) ? pass(`${kind} mega menu opens with ${links} links`) : fail(`${kind} mega menu has ${links} links`);
      if (SHOTS) await page.screenshot({ path: shotPath(`interaction-${kind}-menu-1440.png`) });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      (await mega.count()) === 0 ? pass(`Escape closes ${kind} menu`) : fail(`${kind} menu still open`);
    }
    await context.close();
  }

  {
    const { context, page, errors } = await newPage(browser, [1440, 900]);
    await page.goto(BASE + "/solar-panel-installation/delhi", { waitUntil: "networkidle" });
    const state = await page.locator("select").first().inputValue();
    state === "delhi" ? pass("city calculator pre-set to the city's state (Delhi)") : fail(`city calculator state = ${state}`);
    const city = await page.locator("#city").inputValue();
    city === "Delhi" ? pass("city quote form pre-fills the city") : fail(`city field = ${city}`);
    const kw = page.locator("section[aria-live] p.font-display").first();
    const before = (await kw.textContent())?.trim();
    await page.locator('input[type="range"]').first().fill("15000");
    await page.waitForTimeout(1000);
    const after = (await kw.textContent())?.trim();
    before !== after ? pass(`calculator slider updates result (${before} → ${after})`) : fail("calculator result unchanged");
    if (errors.length) fail(`calculator console errors: ${errors.join(" | ")}`);
    await context.close();
  }

  {
    const { context, page } = await newPage(browser, [1440, 900]);
    await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Commercial/ }).click();
    await page.waitForTimeout(1200);
    const visible = await page.locator("li[data-project]:not(.hidden)").count();
    visible === 3 ? pass("projects filter shows 3 commercial projects") : fail(`projects filter shows ${visible}`);
    await context.close();
  }

  {
    const { context, page, errors } = await newPage(browser, [390, 844]);
    await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Request free survey" }).click();
    const errCount = await page.locator('[aria-invalid="true"]').count();
    errCount >= 3 ? pass(`empty submit shows ${errCount} field errors`) : fail(`expected ≥3 errors, got ${errCount}`);
    await page.fill("#name", "Rakesh Sharma");
    await page.fill("#phone", "98765 43210");
    await page.fill("#city", "Sonipat");
    await page.getByRole("button", { name: "Request free survey" }).click();
    await page.getByText("Your request is in").waitFor({ timeout: 5000 });
    pass("valid submit shows success state");
    if (errors.length) fail(`contact console errors: ${errors.join(" | ")}`);
    await context.close();
  }
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });
log(`Testing ${BASE}`);

const urls = await crawlFiles();
await seoChecks(browser, urls);
await schemaChecks(browser);
await motionChecks(browser);
await interactions(browser);
await quickChecks(browser, [...urls, "/this-page-does-not-exist"]);
await screenshots(browser);
await browser.close();

log(`\n${failures.length ? `${failures.length} FAILURE(S)` : "ALL CHECKS PASSED"}`);
process.exit(failures.length ? 1 : 0);
