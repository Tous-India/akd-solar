/**
 * JSON-LD builders. All facts come from site.ts / locations.ts / data.ts / blog.ts so
 * structured data always matches what the page says. No ratings are emitted (no review data).
 */
import { site, absoluteUrl, fullAddress } from "./site";
import { locations, type Location } from "./locations";
import { solutions, type FAQ, type Solution } from "./data";
import type { Post } from "./blog";

export const ORG_ID = `${site.url}/#organization`;
export const BUSINESS_ID = `${site.url}/#business`;
export const WEBSITE_ID = `${site.url}/#website`;
export const FOUNDER_ID = `${site.url}/#founder`;

type Crumb = { name: string; path: string };

const cityNode = (l: Location) => ({
  "@type": l.slug === "delhi-ncr" ? "AdministrativeArea" : "City",
  name: l.name,
  containedInPlace: { "@type": "State", name: l.state },
});

const postalAddress = (o: (typeof site.offices)[number]) => ({
  "@type": "PostalAddress",
  streetAddress: `${o.line1}, ${o.line2}`,
  addressLocality: o.city,
  addressRegion: o.state,
  ...(o.pincode ? { postalCode: o.pincode } : {}),
  addressCountry: "IN",
});

/** Site-wide graph: Organization + local business (head office, branch) + founder + WebSite */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        legalName: site.legalName,
        slogan: site.tagline,
        url: site.url,
        logo: absoluteUrl("/logo.png"),
        email: site.email,
        telephone: site.phone,
        foundingDate: String(site.foundedYear),
        foundingLocation: { "@type": "Place", name: "Sonipat, Haryana" },
        founder: { "@id": FOUNDER_ID },
        taxID: site.gstin,
        identifier: [
          { "@type": "PropertyValue", propertyID: "CIN", value: site.cin },
          { "@type": "PropertyValue", propertyID: "GSTIN", value: site.gstin },
        ],
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: site.founder.name,
        jobTitle: site.founder.role,
        worksFor: { "@id": ORG_ID },
      },
      {
        "@type": "ElectricalContractor",
        additionalType: "https://en.wikipedia.org/wiki/Solar_power",
        "@id": BUSINESS_ID,
        name: site.name,
        legalName: site.legalName,
        description: site.description,
        url: site.url,
        image: absoluteUrl("/logo.png"),
        telephone: site.phones,
        email: site.email,
        parentOrganization: { "@id": ORG_ID },
        address: postalAddress(site.offices[0]),
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        department: site.offices.slice(1).map((o) => ({
          "@type": "ElectricalContractor",
          name: `${site.name} — ${o.label}`,
          address: postalAddress(o),
          telephone: site.phones,
        })),
        areaServed: locations.map(cityNode),
        knowsAbout: ["Rooftop solar", "PM Surya Ghar Muft Bijli Yojana", "Net metering", "Solar water pumps", "Havells solar"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Solar solutions",
          itemListElement: solutions.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/solar-solutions/${s.slug}`) },
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

export function solutionSchema(s: Solution) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.heading,
    description: s.intro,
    url: absoluteUrl(`/solar-solutions/${s.slug}`),
    provider: { "@id": BUSINESS_ID },
    areaServed: locations.map(cityNode),
  };
}

/** City page: solar installation service offered in one city (served from the Sonipat offices) */
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
