import type { IconName } from "@/components/ui/Icon";
import { projectsData } from "./projects.generated";
import { site } from "./site";

export type FAQ = { q: string; a: string };

// ───────────────────────── Solar solutions ─────────────────────────

export type SolutionBlock = {
  title: string;
  /** about two lines */
  intro: string;
  bullets: string[];
  specs: { label: string; value: string }[];
  image: string;
  imageAlt: string;
};

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
  /** Image + text blocks, alternating sides. The first block's bullets are "What you get". */
  blocks: SolutionBlock[];
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
      "Free app monitoring for 25 years",
    ],
    blocks: [
      {
        title: "What you get",
        intro: "One team from the first site visit to the day your net meter is fitted. You get a system sized to your monthly units, not a one-size package.",
        bullets: [],
        specs: [
          { label: "Typical size", value: "3–10 kW" },
          { label: "Payback", value: "~5 years" },
          { label: "Monitoring", value: "25 years free" },
        ],
        image: "/images/projects/p19-1.jpg",
        imageAlt: "Residential rooftop solar installed by AKD Solar in Sonipat",
      },
      {
        title: "Sized for today and tomorrow",
        intro: "We advise, not just sell. Inverters are sized for future load like EVs and ACs, and we file every subsidy form for you.",
        bullets: [
          "On-grid or hybrid — chosen for your power cuts",
          "PM Surya Ghar up to ₹78,000, plus the Haryana top-up where eligible",
          `Solar loans at ${site.loans.residential.rate} via ${site.loans.residential.banks.join(", ")}`,
          "Net metering with DHBVN or UHBVN handled end to end",
          "AMC with scheduled cleaning and health checks",
        ],
        specs: [
          { label: "Subsidy", value: "Up to ₹78,000" },
          { label: "Loan from", value: site.loans.residential.rate },
          { label: "Install", value: `${site.numbers.installDays} days` },
        ],
        image: "/images/projects/p20-1.jpg",
        imageAlt: "Home solar panels on a raised structure, installed by AKD Solar",
      },
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
      "Free app monitoring for 25 years",
    ],
    blocks: [
      {
        title: "What you get",
        intro: "Solar for shops, offices, factories, schools and farms. Daytime power is your biggest bill, and that is exactly when panels produce.",
        bullets: [],
        specs: [
          { label: "Typical size", value: "10–500 kW" },
          { label: "Net metering", value: "Up to 500 kW" },
          { label: "Loans", value: site.loans.industrial.rate },
        ],
        image: "/images/solutions/commercial-buildings-wide.jpg",
        imageAlt: "Apartment and commercial buildings with rooftop solar panels",
      },
      {
        title: "Farms and individual sites",
        intro: "Not every site has a big roof or a steady grid. We build ground-mount and hybrid systems and solar pumps for farms.",
        bullets: [
          "Solar water pumps for tubewells and drip lines",
          "Ground-mount structures where the roof is too small",
          "Hybrid systems with batteries for long power cuts",
          "Help with Haryana MSME capital subsidy paperwork",
        ],
        specs: [
          { label: "Systems", value: "On-grid & hybrid" },
          { label: "MSME subsidy", value: "Up to 30%" },
          { label: "Monitoring", value: "25 years free" },
        ],
        image: "/images/projects/p02-1.jpg",
        imageAlt: "Commercial rooftop solar plant installed by AKD Solar",
      },
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
      "Free app monitoring for 25 years",
    ],
    blocks: [
      {
        title: "What you get",
        intro: "Solar for lifts, pumps, lighting and EV charging in common areas. We prepare everything the RWA committee needs to decide.",
        bullets: [],
        specs: [
          { label: "Subsidy", value: "₹18,000 per kW" },
          { label: "Plant size", value: "Up to 500 kW" },
          { label: "Monitoring", value: "25 years free" },
        ],
        image: "/images/projects/p12-3.jpg",
        imageAlt: "Solar panels on a housing society rooftop, installed by AKD Solar",
      },
      {
        title: "Lower maintenance charges",
        intro: "Common-area power is a large part of every society's monthly maintenance. A shared rooftop plant cuts it for every resident.",
        bullets: [
          "Runs lifts, water pumps and common lighting",
          "EV charging points for residents",
          "One net meter on the society connection",
          "Clear monthly savings reports for residents",
          "AMC with scheduled cleaning and health checks",
        ],
        specs: [
          { label: "Saves on", value: "Common-area bills" },
          { label: "Loans from", value: site.loans.residential.rate },
          { label: "Support", value: "After-sales AMC" },
        ],
        image: "/images/projects/p12-1.jpg",
        imageAlt: "Rooftop solar array on a residential tower",
      },
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

/** Scheme at a glance — pmsuryaghar.gov.in, as on 29 Oct 2026 */
export const pmStatsAsOn = "29 Oct 2026";
export const pmStats = {
  applications: 8753829,
  installations: 5477135,
  households: 6480037,
  target: 10000000,
};
export const pmStatCards = [
  { value: "87,53,829", label: "Total applications" },
  { value: "54,77,135", label: "Rooftop solar installations" },
  { value: "64,80,037", label: "Households benefitted" },
  { value: "1 crore", label: "Target households" },
  { value: "₹75,000 cr+", label: "Investment" },
  { value: "300 units", label: "Free electricity per month (up to)" },
];

/** Rooftop solar installations in India by year — MNRE (2024 as on 24 Dec 2024) */
export const installsByYear = [
  { year: "2019", value: 48295 },
  { year: "2020", value: 126021 },
  { year: "2021", value: 162466 },
  { year: "2022", value: 149491 },
  { year: "2023", value: 261432 },
  { year: "2024", value: 722168 },
];

/** AKD Solar's own subsidy results, as on 30 Oct 2026 */
export const akdSubsidyResults = { customers: 207, amount: 18063390, asOn: "30 Oct 2026" };

/** Central subsidy + Haryana top-up (announced June 2024) */
export const subsidyBreakdown = [
  { size: "1 kW", central: 30000 },
  { size: "2 kW", central: 60000 },
  { size: "3 kW+", central: 78000 },
];

/** Haryana domestic tariff 2026-27 (w.e.f. 01.04.2026), simplified */
export const haryanaTariff = [
  {
    category: "Category I",
    load: "Up to 2 kW",
    slabs: [
      { units: "0–50", rate: "₹2.20" },
      { units: "51–100", rate: "₹2.70" },
    ],
    fixed: "—",
  },
  {
    category: "Category II",
    load: "Up to 5 kW",
    slabs: [
      { units: "0–150", rate: "₹2.95" },
      { units: "151–300", rate: "₹5.25" },
      { units: "301–500", rate: "₹6.45" },
      { units: "Above 500", rate: "₹7.10" },
    ],
    fixed: "₹50/kW above 300 units",
  },
  {
    category: "Category III",
    load: "Above 5 kW",
    slabs: [
      { units: "0–500", rate: "₹6.50" },
      { units: "501–1000", rate: "₹7.15" },
      { units: "Above 1000", rate: "₹7.50" },
    ],
    fixed: "₹75/kW",
  },
];

export const pmEligibility = [
  "Indian citizen",
  "Owns a house with a roof suitable for solar panels",
  "Valid electricity connection in your own name",
  "Has not taken any other subsidy for rooftop solar",
];

export const pmDocuments = [
  "Latest electricity bill",
  "Aadhaar card",
  "Bank passbook or cancelled cheque",
  "Proof of house ownership",
  "Passport-size photo",
  "Income certificate (only for the Haryana top-up)",
];

export const pmFaqs: FAQ[] = [
  { q: "How much subsidy can I get?", a: "₹30,000 per kW for the first 2 kW and ₹18,000 for the 3rd kW. The central subsidy is capped at ₹78,000 for 3 kW and above." },
  { q: "When does the scheme close?", a: "Applications are open until 31 March 2027." },
  { q: "Is there extra subsidy in Haryana?", a: "Haryana announced an extra ₹50,000 for families earning up to ₹1.8 lakh a year and ₹20,000 for ₹1.8–3 lakh (June 2024). Confirm current status with DHBVN or UHBVN." },
  { q: "Who is eligible?", a: "Homeowners with an electricity connection in their name who have not claimed a rooftop solar subsidy before." },
  { q: "How much free electricity will I get?", a: "The scheme aims to give households up to 300 units of free electricity a month from their own rooftop system. What you save depends on the system size and your usage." },
  { q: "Which documents do I need?", a: "Your latest electricity bill, Aadhaar card, bank passbook or cancelled cheque, proof of house ownership and a photo. For the Haryana top-up you also need an income certificate." },
  { q: "Can I take a loan for the rest of the cost?", a: `Yes. We help arrange residential solar loans at about ${site.loans.residential.rate} through ${site.loans.residential.banks.join(", ")}.` },
  { q: "Who handles the paperwork?", a: "We do. AKD Solar files the portal application, installs the system and follows up with DHBVN or UHBVN for net metering until the subsidy reaches your bank account." },
];

// ───────────────────────── Home ─────────────────────────

/** "How We Work" (from the company deck) */
export const processSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Consultation", text: "We visit, check your roof and bills, and listen to what you need." },
  { icon: "pencil", title: "Design & Proposal", text: "A system sized for today and future load, with a clear quote." },
  { icon: "bolt", title: "Installation", text: `Our own crew installs it, often in as little as ${site.numbers.installDays} days.` },
  { icon: "gauge", title: "Monitoring & O&M", text: "Net metering, subsidy follow-up, app monitoring and upkeep." },
];

/** Home "About" block: right-hand feature icons */
export const aboutFeatures: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Safe Energy", text: "Earthing, surge protection and quality panels on every site." },
  { icon: "factory", title: "Industrial Solutions", text: "Rooftop plants for shops, factories and MSMEs." },
  { icon: "wrench", title: "Easy Installation", text: "One team from design to net metering." },
];

/** "AKD SOLAR stands for" — from the company deck (text used exactly) */
export type StandsForItem = { letter: string; word: string; text: string; tone: "sun" | "green" | "blue" | "red" };
export const akdStandsFor: StandsForItem[] = [
  { letter: "A", word: "Advisor", tone: "sun", text: "We don't sell solar, we advise. Each project is designed around your needs. Payback in about 5 years for homes; larger inverters to cover future load like EVs." },
  { letter: "K", word: "Knowledge", tone: "green", text: "Qualified engineers in sales and operations, and the latest technology in every project." },
  { letter: "D", word: "Discipline", tone: "blue", text: "Best price without compromising quality, and timely delivery — we keep our word." },
  { letter: "S", word: "Service", tone: "red", text: "After-sales support systems for peace of mind." },
  { letter: "O", word: "Operations", tone: "sun", text: "Low-maintenance systems; our target is complaint-free sites." },
  { letter: "L", word: "Loan Facility", tone: "green", text: "Solar loans for residential, commercial and industrial connections, plus help with MSME grants and subsidy." },
  { letter: "A", word: "Accountable", tone: "blue", text: "Full transparency — references from our installed customers on request. Authorised Havells dealer since 2018." },
  { letter: "R", word: "Real Time", tone: "red", text: "Free real-time monitoring on your phone app for 25 years." },
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
