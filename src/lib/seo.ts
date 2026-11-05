import type { Metadata } from "next";
import { site } from "./site";

/**
 * Per-page metadata. Keep `title` <= 47 chars (the layout appends " | AKD Solar")
 * and `description` <= 155 chars. OG/Twitter images come from each route's opengraph-image.tsx.
 */
export function pageMeta({ title, description, path, absoluteTitle }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
