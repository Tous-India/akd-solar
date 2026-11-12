import { solutions } from "./data";
import { locations } from "./locations";
import { posts } from "./blog";

/** Every public URL on the site, grouped. Used by sitemap.xml, the /sitemap page and llms.txt. */
export const staticRoutes = [
  { path: "/", name: "Home", priority: 1 },
  { path: "/about", name: "About AKD Solar", priority: 0.7 },
  { path: "/solar-solutions", name: "Solar solutions", priority: 0.8 },
  { path: "/pm-surya-ghar-yojana", name: "PM Surya Ghar Yojana", priority: 0.9 },
  { path: "/projects", name: "Projects", priority: 0.7 },
  { path: "/locations", name: "Areas we serve", priority: 0.8 },
  { path: "/calculator", name: "Solar calculator", priority: 0.8 },
  { path: "/blog", name: "Blog", priority: 0.6 },
  { path: "/contact", name: "Contact", priority: 0.7 },
  { path: "/sitemap", name: "Sitemap", priority: 0.3 },
] as const;

export const solutionRoutes = solutions.map((s) => ({ path: `/solar-solutions/${s.slug}`, name: s.title, priority: 0.8 }));
export const cityRoutes = locations.map((l) => ({ path: `/solar-panel-installation/${l.slug}`, name: `Solar panel installation in ${l.name}`, priority: 0.8 }));
export const blogRoutes = posts.map((p) => ({ path: `/blog/${p.slug}`, name: p.title, priority: 0.6, date: p.updated ?? p.date }));
