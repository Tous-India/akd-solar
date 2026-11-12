import { solutions } from "@/lib/data";

const city = (slug: string) => `/solar-panel-installation/${slug}`;

/** Locations dropdown: two parallel groups (Delhi links to the Delhi NCR page) */
export const locationGroups = [
  {
    title: "Haryana",
    tone: "sun" as const,
    links: [
      { label: "Sonipat", href: city("sonipat") },
      { label: "Rohtak", href: city("rohtak") },
      { label: "Panipat", href: city("panipat") },
      { label: "Karnal", href: city("karnal") },
    ],
  },
  {
    title: "Delhi NCR",
    tone: "panel" as const,
    links: [
      { label: "Delhi", href: city("delhi-ncr") },
      { label: "Gurugram", href: city("gurugram") },
      { label: "Faridabad", href: city("faridabad") },
    ],
  },
];

export const menuLinks = {
  solutions: solutions.map((s) => ({ label: s.title, href: `/solar-solutions/${s.slug}` })),
  locations: locationGroups.flatMap((g) => g.links),
};
