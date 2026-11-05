import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { locations, locationsByRegion, regions } from "@/lib/locations";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Areas We Serve — Haryana & Delhi NCR",
  description: `AKD Solar installs rooftop solar in ${locations.length} cities across Haryana and Delhi NCR, from Sonipat, Rohtak and Gurugram to Delhi, Noida and Ghaziabad.`,
  path: "/locations",
});

// Simple equirectangular projection of the cities' lat/lng into the SVG
const BOUNDS = { minLng: 74.8, maxLng: 78.1, minLat: 27.95, maxLat: 30.55 };
const W = 980;
const H = 760;
const project = (lat: number, lng: number) => ({
  x: ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W,
  y: ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H,
});

// Labels that would collide go to the left of their dot
const LEFT_LABELS = new Set(["bahadurgarh", "jhajjar", "delhi", "gurugram", "kurukshetra", "rewari"]);
// Small vertical nudges for the crowded NCR cluster
const LABEL_DY: Record<string, number> = { faridabad: 16, "greater-noida": -6, bahadurgarh: -8, jhajjar: 10 };

export default function LocationsPage() {
  const office = project(site.geo.lat, site.geo.lng);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Areas served by AKD Solar",
    itemListElement: locations.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Solar panel installation in ${l.name}`,
      url: absoluteUrl(`/solar-panel-installation/${l.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <PageHero
        crumbs={[{ name: "Areas We Serve", path: "/locations" }]}
        eyebrow="Areas we serve"
        title={
          <>
            Rooftop solar across <span className="text-sun-deep">Haryana</span> and Delhi NCR.
          </>
        }
        subtitle={`${locations.length} cities, one standard of work — all served from our ${site.address.city} office by our own installation crew.`}
      />

      <section aria-label="Quick answer" className="pb-14">
        <Container>
          <QuickAnswer
            className="max-w-3xl"
            q="Which areas does AKD Solar serve?"
            a={`AKD Solar installs rooftop solar in ${locationsByRegion("Haryana").length} cities across Haryana and ${locationsByRegion("Delhi NCR").length} in Delhi NCR (Delhi, Noida, Greater Noida and Ghaziabad), working from our office in ${site.address.city}, ${site.address.state}.`}
          />
        </Container>
      </section>

      <section aria-labelledby="map-title" className="pb-20 sm:pb-28">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
          <Reveal variant="clip" className="relative overflow-hidden rounded-card border border-line bg-white">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
              <title id="map-title">Map of cities served by AKD Solar</title>
              <desc id="map-desc">Dots mark each city in Haryana (orange) and Delhi NCR (blue); the star marks our {site.address.city} office.</desc>
              <defs>
                <pattern id="map-grid" width="45" height="38" patternUnits="userSpaceOnUse">
                  <path d="M45 0H0V38" fill="none" stroke="#1E4FB0" strokeOpacity="0.07" />
                </pattern>
                <radialGradient id="map-glow">
                  <stop offset="0" stopColor="#FFC93C" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width={W} height={H} fill="#FBF8F2" />
              <rect width={W} height={H} fill="url(#map-grid)" />
              <circle cx={office.x} cy={office.y} r="260" fill="url(#map-glow)" />
              {/* Delhi NCR cluster outline */}
              <ellipse cx={project(28.58, 77.33).x} cy={project(28.58, 77.33).y} rx="105" ry="70" fill="#2BA8E8" fillOpacity="0.07" stroke="#2BA8E8" strokeOpacity="0.4" strokeDasharray="6 6" />
              {/* connection lines from office */}
              {locations.map((l) => {
                const p = project(l.lat, l.lng);
                return <line key={`ln-${l.slug}`} x1={office.x} y1={office.y} x2={p.x} y2={p.y} stroke="#F7931E" strokeOpacity="0.18" strokeWidth="1.5" />;
              })}
              {locations.map((l) => {
                const p = project(l.lat, l.lng);
                const ncr = l.region === "Delhi NCR";
                const left = LEFT_LABELS.has(l.slug);
                return (
                  <a key={l.slug} href={`/solar-panel-installation/${l.slug}`} aria-label={`Solar panel installation in ${l.name}`}>
                    <circle cx={p.x} cy={p.y} r="16" fill={ncr ? "#2BA8E8" : "#F7931E"} fillOpacity="0.18" />
                    <circle cx={p.x} cy={p.y} r="7" fill={ncr ? "#1E4FB0" : "#F7931E"} stroke="#fff" strokeWidth="2.5" />
                    <text
                      x={left ? p.x - 14 : p.x + 14}
                      y={p.y + 5 + (LABEL_DY[l.slug] ?? 0)}
                      textAnchor={left ? "end" : "start"}
                      className="fill-ink font-sans text-[17px] font-semibold max-sm:hidden"
                      style={{ paintOrder: "stroke", stroke: "#FBF8F2", strokeWidth: 5 }}
                    >
                      {l.name}
                    </text>
                  </a>
                );
              })}
              <g transform={`translate(${office.x} ${office.y - 34})`}>
                <path d="M0-13 3.8-4.2 13-4 5.8 2 8 11.5 0 6.4-8 11.5-5.8 2-13-4-3.8-4.2z" fill="#D7141A" stroke="#fff" strokeWidth="2" />
              </g>
            </svg>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-5 py-4 text-sm text-muted">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-sun" /> Haryana
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-panel" /> Delhi NCR
              </span>
              <span className="flex items-center gap-2">
                <span className="text-akd">★</span> Our {site.address.city} office
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col gap-10">
            {regions.map((region) => {
              const list = locationsByRegion(region);
              return (
                <div key={region}>
                  <h2 className="flex items-baseline justify-between gap-3 font-display text-h3 font-bold">
                    {region}
                    <span className="text-sm font-medium text-muted">{list.length} cities</span>
                  </h2>
                  <Reveal as="ul" stagger={0.03} className="mt-5 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
                    {list.map((l) => (
                      <li key={l.slug}>
                        <Link
                          href={`/solar-panel-installation/${l.slug}`}
                          className="group flex min-h-14 items-center justify-between gap-3 rounded-card border border-line bg-white/80 px-4 py-2.5 transition-colors hover:border-sun"
                        >
                          <span>
                            <span className="block font-semibold text-ink">{l.name}</span>
                            <span className="block text-xs text-muted">{l.discom.short}</span>
                          </span>
                          <Icon name="arrowRight" className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                        </Link>
                      </li>
                    ))}
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section aria-labelledby="discoms-title" className="bg-sand py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Electricity companies"
            title={<span id="discoms-title">Which DISCOM handles my net-metering?</span>}
            subtitle="It depends on your city. We file and follow up the application with every DISCOM below."
          />
          <Reveal className="mt-10 overflow-x-auto rounded-card border border-line bg-white">
            <table className="w-full min-w-[560px] text-left">
              <caption className="sr-only">DISCOM by area</caption>
              <thead>
                <tr className="border-b border-line text-sm text-muted">
                  <th scope="col" className="p-4 font-semibold sm:p-5">
                    DISCOM
                  </th>
                  <th scope="col" className="p-4 font-semibold sm:p-5">
                    Cities we serve
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Map(locations.map((l) => [l.discom.short, l.discom])).values()).map((d) => (
                  <tr key={d.short} className="border-b border-line last:border-0 align-top">
                    <th scope="row" className="p-4 font-semibold sm:p-5">
                      {d.name}
                    </th>
                    <td className="p-4 text-muted sm:p-5">
                      {locations
                        .filter((l) => l.discom.short === d.short)
                        .map((l) => l.name)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </section>

      <CtaBand title="Don't see your town?" text="We regularly install in villages and towns around every city listed here. Call or WhatsApp us and we'll confirm within the hour." />
    </>
  );
}
