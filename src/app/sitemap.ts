import type { MetadataRoute } from "next";
import { blogRoutes, cityRoutes, solutionRoutes, staticRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticRoutes.map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: now,
      changeFrequency: (r.path === "/" || r.path === "/blog" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: r.priority,
    })),
    ...solutionRoutes.map((r) => ({ url: absoluteUrl(r.path), lastModified: now, changeFrequency: "monthly" as const, priority: r.priority })),
    ...cityRoutes.map((r) => ({ url: absoluteUrl(r.path), lastModified: now, changeFrequency: "monthly" as const, priority: r.priority })),
    ...blogRoutes.map((r) => ({ url: absoluteUrl(r.path), lastModified: new Date(r.date), changeFrequency: "yearly" as const, priority: r.priority })),
  ];
}
