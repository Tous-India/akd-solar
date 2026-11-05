/**
 * Single source of truth for business & contact details.
 * Change these values and every page, the footer, JSON-LD, llms.txt and WhatsApp links update automatically.
 */
export const site = {
  name: "AKD Solar",
  legalName: "AKD Solar",
  tagline: "Balancing The Nature",
  /** Live domain — used for canonical URLs, sitemap, robots and structured data */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.akdsolar.in").replace(/\/$/, ""),
  description:
    "AKD Solar designs and installs rooftop solar for homes, businesses and farms across Haryana and Delhi NCR — with PM Surya Ghar subsidy support, MNRE-approved panels and net-metering handled end to end.",
  // TODO: confirm the real founding year
  foundedYear: 2016,

  /** Display format; links are generated from it */
  // TODO: replace placeholder phone / WhatsApp / email with the real ones
  phone: "+91 98765 43210",
  /** Country code + number, digits only (used by wa.me) */
  whatsapp: "919876543210",
  whatsappMessage: "Hello AKD Solar! I'd like to book a free solar site survey for my home.",
  email: "hello@akdsolar.in",

  /**
   * The ONLY physical office shown on the site. City pages for other cities say
   * "serving <city> from our Sonipat office" instead of inventing addresses.
   * TODO: replace line1/line2/pincode/geo with the real office address.
   */
  address: {
    line1: "", // TODO: street / building

    line2: "",
    city: "Sonipat",
    citySlug: "sonipat",
    state: "Haryana",
    pincode: "131001",
    country: "IN",
  },
  geo: { lat: 28.9931, lng: 77.0151 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sonipat+Haryana",

  hours: [
    { days: "Monday – Saturday", time: "9:30 AM – 7:00 PM" },
    { days: "Sunday", time: "Site visits by appointment" },
  ],

  // TODO: replace with the real social profile URLs (or remove the ones you don't use)
  socials: [
    { name: "Facebook", href: "https://www.facebook.com/akdsolar", icon: "facebook" },
    { name: "Instagram", href: "https://www.instagram.com/akdsolar", icon: "instagram" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/akdsolar", icon: "linkedin" },
    { name: "YouTube", href: "https://www.youtube.com/@akdsolar", icon: "youtube" },
  ],
} as const;

export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
export const mailHref = `mailto:${site.email}`;
export const officeLabel = `${site.address.city}, ${site.address.state}`;
export const fullAddress = [site.address.line1, site.address.line2, `${site.address.city}, ${site.address.state} ${site.address.pincode}`]
  .filter(Boolean)
  .join(", ");

export function whatsappHref(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}

export type NavItem = { label: string; href: string; menu?: "services" | "locations"; mobileOnly?: boolean };

export const nav: NavItem[] = [
  { label: "Home", href: "/", mobileOnly: true },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", menu: "services" },
  { label: "Locations", href: "/locations", menu: "locations" },
  { label: "Projects", href: "/projects" },
  { label: "Calculator", href: "/calculator" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
