# AKD Solar — website

Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · GSAP (ScrollTrigger, Flip, SplitText) via `@gsap/react` · Lenis smooth scroll.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Where things live
| What | File |
| --- | --- |
| Business name, phone, WhatsApp, email, office address, hours, socials, site URL | `src/lib/site.ts` |
| Cities (local SEO pages, /locations, footer, schema, llms.txt) | `src/lib/locations.ts` |
| Services, FAQs, projects, testimonials, team, stats | `src/lib/data.ts` |
| Blog articles | `src/lib/blog.ts` |
| Calculator tariffs, yields, costs | `src/lib/calc.ts` |
| JSON-LD builders | `src/lib/schema.ts` |
| Card corner radius (one token) | `--radius-card` in `src/app/globals.css` → `rounded-card` |

## Homepage banners
To change homepage banners: put images in public/images/banners/ (desktop 1920×600, mobile 1080×1080) and edit src/lib/banners.ts.

## Add a city
Append one entry to `locations` in `src/lib/locations.ts` (slug, name, region, DISCOM, a genuinely local intro,
localities, coordinates and 2 city-specific FAQs). The page `/solar-panel-installation/<slug>`, its OG image,
the /locations map and list, sitemap, llms.txt, schema areaServed and "nearby cities" links all update automatically.

## Add a blog post
Append a `Post` to `posts` in `src/lib/blog.ts`. Keep `metaTitle` ≤ 47 characters and `description` ≤ 155.

## Enquiries
Forms POST to `src/app/api/enquiry/route.ts`, which validates and currently only logs to the server console.
Connect email/CRM delivery at the marked spot before going live.

## Tests
```bash
npm run build && npx next start -p 3100       # terminal 1
npm run test:site                             # terminal 2 — overflow, console, slider, countdown, lightbox, redirects, screenshots
npm run test:sun                              # CTA rising-sun checks at 6 widths (frames in screenshots/cta-sun)
npm run test:lighthouse                       # mobile Lighthouse for / and /solar-panel-installation/sonipat
```

## Logo
`public/logo.png` is a transparent, trimmed version of `scripts/logo-source.png`
(regenerate with `node scripts/make-logo.mjs scripts/logo-source.png public/logo.png`).
