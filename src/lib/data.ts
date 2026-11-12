import type { IconName } from "@/components/ui/Icon";
import { projectsData } from "./projects.generated";
import { site } from "./site";

export type FAQ = { q: string; a: string };

// ───────────────────────── Solar solutions ─────────────────────────

export type Solution = {
  slug: string;
  title: string;
  /** 2–6 word heading */
  heading: string;
  /** one line for cards and menus */
  short: string;
  /** max two short sentences */
  intro: string;
  icon: IconName;
  image: string;
  whatYouGet: string[];
  loans: ("residential" | "industrial")[];
  pumps?: boolean;
  msme?: boolean;
  societySubsidy?: boolean;
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
};

export const solutions: Solution[] = [
  {
    slug: "residential-rooftop",
    title: "Residential Rooftop",
    heading: "Residential rooftop solar",
    short: "Cut your home bill with up to ₹78,000 subsidy.",
    intro: "Rooftop solar sized to your monthly units. We handle the PM Surya Ghar subsidy and net metering.",
    icon: "home",
    image: "/images/projects/p19-1.jpg",
    whatYouGet: [
      "Free site visit and shadow check",
      `Panels: ${site.brands.panels.join(", ")}`,
      `Inverters: ${site.brands.inverters.join(", ")}`,
      "PM Surya Ghar registration and net metering",
      `Installation in as little as ${site.numbers.installDays} days`,
    ],
    loans: ["residential"],
    faqs: [
      { q: "What size system does my home need?", a: "Divide your monthly units by 120. A home using 600 units a month needs about 5 kW." },
      { q: "How much roof space do I need?", a: "About 80–100 sq ft of shadow-free roof per kW. A 5 kW system needs roughly 400–500 sq ft." },
    ],
    metaTitle: "Residential Rooftop Solar in Sonipat",
    metaDescription: "Home rooftop solar in Sonipat, Haryana and Delhi NCR with up to ₹78,000 PM Surya Ghar subsidy, net metering and installation in as little as 3 days.",
  },
  {
    slug: "commercial-and-individual",
    title: "Commercial & Individual",
    heading: "Commercial & individual solar",
    short: "Lower daytime power costs for shops, offices and factories.",
    intro: "Rooftop and ground-mount plants for shops, offices, factories, schools and farms. Lower daytime power costs with a fast payback.",
    icon: "factory",
    image: "/images/projects/p02-1.jpg",
    whatYouGet: [
      "Load study from your last 12 bills",
      "On-grid plants with net metering up to 500 kW",
      "Industrial-grade structures and earthing",
      "Remote generation monitoring",
      `Industrial solar loans at ${site.loans.industrial.rate}`,
    ],
    loans: ["industrial"],
    pumps: true,
    msme: true,
    faqs: [
      { q: "Can a factory get a subsidy?", a: "Haryana MSMEs can get a 30% capital subsidy, up to ₹35 lakh in Sub-prime and Prime focus areas or ₹25 lakh in Core and Intermediate areas, subject to current policy." },
      { q: "How big can a commercial plant be?", a: "Net metering is available up to 500 kW. Each kW needs about 80–100 sq ft of shadow-free roof." },
    ],
    metaTitle: "Commercial & Industrial Solar in Haryana",
    metaDescription: "Solar for shops, offices, factories and farms in Haryana: net metering up to 500 kW, MSME capital subsidy support and industrial loans at 8.50–9.25%.",
  },
  {
    slug: "housing-societies",
    title: "Housing Societies",
    heading: "Housing society solar",
    short: "Power common areas and cut maintenance bills.",
    intro: "Solar for lifts, pumps, lighting and EV charging in common areas. PM Surya Ghar support is available for RWAs and group housing societies.",
    icon: "users",
    image: "/images/projects/p12-3.jpg",
    whatYouGet: [
      "Common-area load study for the RWA",
      "Proposal and subsidy paperwork for the committee",
      "Rooftop plants on towers and common buildings",
      "Net metering on the society connection",
      "Monthly generation reports",
    ],
    loans: ["residential"],
    societySubsidy: true,
    faqs: [
      { q: "Do housing societies get the PM Surya Ghar subsidy?", a: "Yes. RWAs and group housing societies can get ₹18,000 per kW for common facilities, up to 500 kW (3 kW per house), subject to scheme rules." },
      { q: "Can a single flat owner install solar?", a: "Usually not, as the roof is common property. The society installs one shared system for common areas." },
    ],
    metaTitle: "Housing Society Solar in Sonipat & NCR",
    metaDescription: "Solar for RWAs and group housing societies: lifts, pumps, lighting and EV charging, with PM Surya Ghar support of ₹18,000 per kW for common facilities.",
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

export const systemTypes = [
  { name: "On-grid", text: "Connected to the grid with net metering. Lowest cost and subsidy-eligible." },
  { name: "Hybrid", text: "Grid plus batteries, so essential loads keep running during power cuts." },
  { name: "Off-grid", text: "Battery-only systems for sites without reliable grid supply." },
];

export const amc = {
  title: "AMC & cleaning",
  text: "Scheduled panel cleaning, inverter and earthing checks, and quick breakdown support for every system we install.",
};

export const pumps = {
  title: "Solar water pumps",
  text: "Run tubewells and drip lines in daylight, with no diesel cost and no waiting for grid supply.",
};

export const msme = {
  title: "Haryana MSME support",
  points: [
    "30% capital subsidy, up to ₹35 lakh (Sub-prime & Prime focus areas)",
    "Up to ₹25 lakh in Core & Intermediate areas",
    "Net metering up to 500 kW, valid for 5 years",
    "Applications on the state portal from 1 Nov 2026",
    `Industrial loans at ${site.loans.industrial.rate}`,
  ],
  note: "Subject to current Haryana MSME policy.",
};

// ───────────────────────── PM Surya Ghar ─────────────────────────

/** Central subsidy (capped at ₹78,000 for 3 kW and above) */
export const subsidyTable = [
  { kw: "2 kW", amount: 60000 },
  { kw: "3 kW", amount: 78000 },
  { kw: "5 kW", amount: 78000 },
  { kw: "10 kW", amount: 78000 },
];

export const haryanaTopUp = [
  { income: "Annual income up to ₹1.8 lakh", amount: 50000 },
  { income: "Annual income ₹1.8–3 lakh", amount: 20000 },
];

export const applySteps = [
  { title: "Register", text: "Sign up on pmsuryaghar.gov.in with your electricity connection." },
  { title: "Apply", text: "Submit the rooftop solar application and choose AKD Solar." },
  { title: "AKD installs", text: `We install your system, often in as little as ${site.numbers.installDays} days.` },
  { title: "Net meter", text: "DHBVN or UHBVN inspects and fits the bi-directional meter." },
  { title: "Subsidy in your bank", text: "The subsidy is credited to your bank account after commissioning." },
];

export const pmFaqs: FAQ[] = [
  { q: "How much subsidy can I get?", a: "₹30,000 per kW for the first 2 kW and ₹18,000 for the 3rd kW. The central subsidy is capped at ₹78,000 for 3 kW and above." },
  { q: "When does the scheme close?", a: "Applications are open until 31 March 2027." },
  { q: "Is there extra subsidy in Haryana?", a: "Haryana announced an extra ₹50,000 for families earning up to ₹1.8 lakh a year and ₹20,000 for ₹1.8–3 lakh (June 2024). Confirm current status with DHBVN or UHBVN." },
  { q: "Who is eligible?", a: "Homeowners with an electricity connection in their name who have not claimed a rooftop solar subsidy before." },
];

// ───────────────────────── Home ─────────────────────────

export const processSteps: { icon: IconName; title: string; text: string; time: string }[] = [
  { icon: "clipboard", title: "Free site visit", text: "We check your roof, shade and last few bills.", time: "Day 1" },
  { icon: "pencil", title: "Design & quote", text: "A clear layout and itemised quote. No hidden extras.", time: "Day 2" },
  { icon: "bolt", title: "Installation", text: "Our own crew installs panels, inverter and earthing.", time: `As little as ${site.numbers.installDays} days` },
  { icon: "gauge", title: "Net metering & subsidy", text: "We handle the DISCOM meter and PM Surya Ghar subsidy.", time: "We follow up" },
];

// ───────────────────────── Projects ─────────────────────────

export type ProjectCategory = "residential" | "commercial";

export type ProjectImage = { src: string; width: number; height: number };
export type Project = {
  id: string;
  capacity: string;
  category: ProjectCategory;
  type: string;
  location: string | null;
  images: readonly ProjectImage[];
};

export const projects: readonly Project[] = projectsData;

/** "6 kW · Residential · Sonipat" — never a customer name; location only when confirmed */
export function projectCaption(p: Project) {
  return [p.capacity, p.category === "commercial" ? "Commercial" : "Residential", p.location].filter(Boolean).join(" · ");
}

/** Six strong photos for the home page */
export const featuredProjectIds = ["p19", "p01", "p12", "p20", "p02", "p17"];

export const offgridVillages = [
  "Deepalpur", "Khanda", "Shamri", "Kakroi", "Rolad", "Nayat", "Pilana", "Madina", "Bhadana", "Khewra", "Kurad",
  "Singhpura", "Shersa", "Jaati", "Naina", "Garhi Sisana", "Nizampur Majra", "Bahu Akbarpur", "Mahra", "Atyal", "Rattangarh",
];

// ───────────────────────── About ─────────────────────────

export const certificates = [
  { src: "/images/about/certificate-1.jpg", title: "Associate Member, The Institution of Engineers (India)" },
  { src: "/images/about/certificate-2.jpg", title: "Chartered Engineer (India)" },
  { src: "/images/about/certificate-3.jpg", title: "Entrepreneurship Development Programme on Solar Energy, NIESBUD (2017)" },
  { src: "/images/about/certificate-4.jpg", title: "Solar PV Grid Connected Power Plants, National Training Centre for Solar Technology (2017)" },
  { src: "/images/about/certificate-5.jpg", title: "SolarEdge Basic Training (2019)" },
  { src: "/images/about/certificate-6.jpg", title: "TEDP in Solar Energy System, DST & TERI (2023)" },
];

export const vision = "To build a green, intelligent, efficient energy environment and healthier lives for people everywhere through sunshine — Balancing the Nature.";
