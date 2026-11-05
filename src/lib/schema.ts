/**
 * JSON-LD builders. All facts come from site.ts / locations.ts / data.ts / blog.ts so
 * structured data always matches what the page says. No ratings are emitted (no real review data yet).
 */
import { site, absoluteUrl, fullAddress } from "./site";
import { locations, type Location } from "./locations";
import { services, type FAQ, type Service } from "./data";
import type { Post } from "./blog";

export const ORG_ID = `${site.url}/#organization`;
export const BUSINESS_ID = `${site.url}/#business`;
export const WEBSITE_ID = `${site.url}/#website`;

type Crumb = { name: string; path: string };

const cityNode = (l: Location) => ({
  "@type": "City",
  name: l.name,
  containedInPlace: { "@type": "State", name: l.state },
});

/** Site-wide graph: Organization + local business + WebSite */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        slogan: site.tagline,
        url: site.url,
        logo: absoluteUrl("/logo.png"),
        email: site.email,
        telephone: site.phone,
        foundingDate: String(site.foundedYear),
        sameAs: site.socials.map((s) => s.href),
      },
      {
        "@type": "ElectricalContractor",
        additionalType: "https://en.wikipedia.org/wiki/Solar_power",
        "@id": BUSINESS_ID,
        name: site.name,
        description: site.description,
        url: site.url,
        image: absoluteUrl("/logo.png"),
        telephone: site.phone,
        email: site.email,
        parentOrganization: { "@id": ORG_ID },
        address: {
          "@type": "PostalAddress",
          ...(site.address.line1 ? { streetAddress: [site.address.line1, site.address.line2].filter(Boolean).join(", ") } : {}),
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.pincode,
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        areaServed: locations.map(cityNode),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:30",
            closes: "19:00",
          },
        ],
        knowsAbout: ["Rooftop solar", "PM Surya Ghar Muft Bijli Yojana", "Net metering", "Solar water pumps", "Hybrid solar systems"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Solar services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: site.name,
        url: site.url,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": BUSINESS_ID },
    areaServed: locations.map(cityNode),
  };
}

/** City page: solar installation service offered in one city (no invented local address) */
export function cityServiceSchema(loc: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Solar panel installation in ${loc.name}`,
    serviceType: "Rooftop solar installation",
    url: absoluteUrl(`/solar-panel-installation/${loc.slug}`),
    description: loc.intro[0],
    provider: { "@id": BUSINESS_ID, name: site.name, telephone: site.phone, address: fullAddress },
    areaServed: {
      ...cityNode(loc),
      geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Solar services in ${loc.name}`,
      itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })),
    },
  };
}

export function articleSchema(post: Post) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Organization", name: post.author.name, url: site.url },
    publisher: { "@id": ORG_ID, "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: `${url}/opengraph-image`,
    inLanguage: "en-IN",
    articleSection: post.category,
  };
}
