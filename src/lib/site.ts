/**
 * Single source of truth for business & contact details.
 * Change these values and every page, the footer, JSON-LD, llms.txt and WhatsApp links update automatically.
 */
export const site = {
  name: "AKD Solar",
  legalName: "AKD Solar Power Pvt. Ltd.",
  cin: "U74999HR2017PTC069164",
  gstin: "06AAPCA6118D1ZU",
  tagline: "Balancing The Nature",
  /** Live domain — used for canonical URLs, sitemap, robots and structured data */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.akdsolar.com").replace(/\/$/, ""),
  description:
    "AKD Solar Power Pvt. Ltd. installs rooftop solar for homes, businesses and housing societies in Sonipat, Haryana and Delhi NCR. Authorised Havells dealer since 2018.",
  foundedYear: 2017,
  havellsDealerSince: 2018,

  /** Display format; tel: links are generated from it. The first number is also the WhatsApp number. */
  phones: ["+91 82228 60046", "+91 82228 70046"],
  phone: "+91 82228 60046",
  /** Country code + number, digits only (used by wa.me) */
  whatsapp: "918222860046",
  whatsappMessage: "Hello AKD Solar! I'd like a free solar site visit.",
  email: "akdsolar@gmail.com",

  offices: [
    {
      label: "Head office",
      line1: "Shop No. 46, Main Market",
      line2: "Sector 14",
      city: "Sonipat",
      state: "Haryana",
      pincode: "131001",
      mapsQuery: "Shop No. 46, Main Market, Sector 14, Sonipat, Haryana 131001",
    },
    {
      label: "Branch office",
      line1: "Shop No. 8, Garh Shahjahanpur Bypass",
      line2: "Sector 10",
      city: "Sonipat",
      state: "Haryana",
      pincode: "",
      mapsQuery: "Garh Shahjahanpur Bypass, Sector 10, Sonipat, Haryana",
    },
  ],
  /** Head office (used by schema, footer and city pages) */
  address: {
    line1: "Shop No. 46, Main Market",
    line2: "Sector 14",
    city: "Sonipat",
    citySlug: "sonipat",
    state: "Haryana",
    pincode: "131001",
    country: "IN",
  },
  // City-level coordinates for Sonipat (no exact pin given)
  geo: { lat: 28.9931, lng: 77.0151 },

  // TODO: confirm office hours (not provided with the business details)
  hours: [
    { days: "Monday – Saturday", time: "9:30 AM – 7:00 PM" },
    { days: "Sunday", time: "Site visits by appointment" },
  ],

  numbers: {
    years: "9+",
    installations: "493+",
    customers: "1,100+",
    subsidyCustomers: "207",
    installDays: 3,
  },

  founder: {
    name: "Dr. Ankush Dahiya",
    role: "Founder & Director",
    qualifications: [
      "B.E. Electrical (2009)",
      "MBA, Production & Operations",
      "Chartered Engineer (India)",
      "M.Tech, Power Systems",
      "Honorary Doctorate in Technology (2026)",
    ],
    experience: "16+ years of industrial and teaching experience",
  },

  brands: {
    panels: ["TATA", "Havells", "Waaree", "Vikram"],
    inverters: ["Havells", "SolarEdge", "Delta", "Solax"],
  },

  loans: {
    residential: { rate: "5.75%", banks: ["PNB", "SBI", "Canara Bank"] },
    industrial: { rate: "8.50–9.25%" },
  },

  /** PM Surya Ghar subsidy deadline shown in the countdowns */
  subsidyDeadline: "2027-03-31T23:59:59+05:30",
  pmSuryaGharPortal: "https://pmsuryaghar.gov.in",
} as const;

export const telHref = (phone: string = site.phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const mailHref = `mailto:${site.email}`;
export const officeLabel = `${site.address.city}, ${site.address.state}`;
export const formatOffice = (o: (typeof site.offices)[number]) => [o.line1, o.line2, `${o.city}, ${o.state}${o.pincode ? ` ${o.pincode}` : ""}`].join(", ");
export const fullAddress = formatOffice(site.offices[0]);
export const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export function whatsappHref(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}

export type NavItem = { label: string; href: string; menu?: "solutions" | "locations"; highlight?: boolean };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solar Solutions", href: "/solar-solutions", menu: "solutions" },
  { label: "PM Surya Ghar Yojana", href: "/pm-surya-ghar-yojana", highlight: true },
  { label: "Projects", href: "/projects" },
  { label: "Locations", href: "/locations", menu: "locations" },
  { label: "Calculator", href: "/calculator" },
  { label: "Contact", href: "/contact" },
];
