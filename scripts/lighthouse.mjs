// Lighthouse (mobile) for key pages. Usage: npx next start -p 3100 & node scripts/lighthouse.mjs
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/solar-panel-installation/sonipat"];

await mkdir(new URL("../screenshots/lighthouse/", import.meta.url), { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });

let worst = 100;
for (const path of PAGES) {
  const result = await lighthouse(BASE + path, {
    port: chrome.port,
    output: "html",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    throttlingMethod: "simulate",
  });
  const cats = result.lhr.categories;
  const scores = Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, Math.round(v.score * 100)]));
  worst = Math.min(worst, ...Object.values(scores));
  console.log(path, scores);
  const failed = Object.values(result.lhr.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual")
    .map((a) => `   - ${a.id}: ${a.displayValue ?? ""} ${a.title}`);
  if (failed.length) console.log(failed.join("\n"));
  const m = result.lhr.audits;
  console.log(`   LCP ${m["largest-contentful-paint"].displayValue} · TBT ${m["total-blocking-time"].displayValue} · CLS ${m["cumulative-layout-shift"].displayValue} · FCP ${m["first-contentful-paint"].displayValue}`);
  const name = path === "/" ? "home" : path.split("/").filter(Boolean).join("-");
  await writeFile(new URL(`../screenshots/lighthouse/${name}.html`, import.meta.url), result.report);
}
await chrome.kill();
process.exit(worst >= 90 ? 0 : 1);
