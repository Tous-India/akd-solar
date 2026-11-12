import { solutions } from "@/lib/data";
import { getLocation } from "@/lib/locations";

/** Locations menu order, as requested */
const LOCATION_MENU = ["delhi-ncr", "gurugram", "faridabad", "sonipat", "rohtak", "panipat", "karnal"];

export const menuLinks = {
  solutions: solutions.map((s) => ({ label: s.title, href: `/solar-solutions/${s.slug}` })),
  locations: LOCATION_MENU.map((slug) => getLocation(slug)).flatMap((l) => (l ? [{ label: l.name, href: `/solar-panel-installation/${l.slug}` }] : [])),
};
