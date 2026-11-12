import type { NextConfig } from "next";

// Old /services/* pages → new solar solutions pages
const serviceRedirects: [string, string][] = [
  ["/services", "/solar-solutions"],
  ["/services/residential-rooftop-solar", "/solar-solutions/residential-rooftop"],
  ["/services/commercial-solar", "/solar-solutions/commercial-and-individual"],
  ["/services/solar-water-pump", "/solar-solutions/commercial-and-individual"],
  ["/services/on-grid-off-grid-hybrid-solar", "/solar-solutions/residential-rooftop"],
  ["/services/solar-amc-cleaning", "/solar-solutions"],
];

// Removed city pages: the NCR cities now live on the Delhi NCR page, the rest go to /locations
const ncrCities = ["delhi", "noida", "greater-noida", "ghaziabad"];
const removedCities = ["hisar", "ambala", "yamunanagar", "kurukshetra", "bhiwani", "jhajjar", "bahadurgarh", "rewari", "jind", "kaithal", "sirsa", "palwal"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/solar-panel-installation", destination: "/locations", statusCode: 301 },
      ...serviceRedirects.map(([source, destination]) => ({ source, destination, statusCode: 301 as const })),
      ...ncrCities.map((c) => ({ source: `/solar-panel-installation/${c}`, destination: "/solar-panel-installation/delhi-ncr", statusCode: 301 as const })),
      ...removedCities.map((c) => ({ source: `/solar-panel-installation/${c}`, destination: "/locations", statusCode: 301 as const })),
    ];
  },
};

export default nextConfig;
