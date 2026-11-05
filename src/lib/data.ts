import type { IconName } from "@/components/ui/Icon";

export type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  /** Short name used in nav, schema and titles (<= 30 chars) */
  shortTitle: string;
  short: string;
  description: string;
  icon: IconName;
  features: string[];
  idealFor: string[];
  highlight: string;
  /** AEO "quick answer" shown at the top of the service page */
  quickAnswer: FAQ;
  faqs: FAQ[];
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "residential-rooftop-solar",
    title: "Residential Rooftop Solar",
    shortTitle: "Home Rooftop Solar",
    short: "Turn your terrace into a power station and bring your bill close to zero.",
    description:
      "A complete rooftop system sized to your family's real consumption — designed, installed and registered for the PM Surya Ghar subsidy by our own engineers. Most homes are generating within a week of approval.",
    icon: "home",
    features: [
      "Free shadow analysis and roof-load check",
      "Tier-1 ALMM-listed mono PERC & TOPCon panels",
      "Hot-dip galvanised elevated structure, wind-rated to 150 km/h",
      "PM Surya Ghar portal registration and subsidy follow-up",
      "Live generation monitoring on your phone",
    ],
    idealFor: ["Independent houses & villas", "Builder floors with terrace rights", "Monthly bills above ₹1,500"],
    highlight: "Up to ₹78,000 subsidy",
    quickAnswer: {
      q: "How much does a home rooftop solar system cost?",
      a: "A 3 kW on-grid home system typically costs about ₹1.6–1.9 lakh before subsidy. After the ₹78,000 PM Surya Ghar subsidy, most families pay roughly ₹0.9–1.1 lakh and recover it in 3–4 years.",
    },
    faqs: [
      {
        q: "What size solar system does my home need?",
        a: "Most homes need 2–5 kW. As a rule of thumb, 1 kW covers about 120–125 units a month in Haryana and Delhi NCR, so divide your monthly units by 120 to estimate the size.",
      },
      {
        q: "Will rooftop solar damage my terrace?",
        a: "No, when installed properly. We use elevated structures with chemical anchoring or ballast and seal every fixing point, so the waterproofing stays intact.",
      },
      {
        q: "What happens to my solar power at night?",
        a: "With net-metering, extra daytime power is exported to the grid as credit, and you draw it back at night. Your bill only charges the net difference.",
      },
    ],
    metaDescription:
      "Home rooftop solar in Haryana & Delhi NCR with up to ₹78,000 PM Surya Ghar subsidy, Tier-1 panels, net-metering and ~7-day installation.",
  },
  {
    slug: "commercial-solar",
    title: "Commercial & Industrial Solar",
    shortTitle: "Commercial Solar",
    short: "Cut operating costs for factories, offices, schools and hospitals.",
    description:
      "Large rooftop and ground-mount plants engineered for maximum yield and minimal downtime. We model your load profile, size the plant for the best return and give your accountant what's needed to claim depreciation benefits.",
    icon: "factory",
    features: [
      "Load-profile analysis from your last 12 bills",
      "Plants from 20 kW to 1 MW+, rooftop or ground-mount",
      "Accelerated depreciation benefits for eligible businesses",
      "SCADA-ready monitoring with string-level alerts",
      "CAPEX and RESCO / zero-investment models",
    ],
    idealFor: ["Factories & warehouses", "Schools, hospitals & hotels", "Rice mills & cold storages"],
    highlight: "Payback in 3–4 years",
    quickAnswer: {
      q: "How fast does commercial solar pay back?",
      a: "Most commercial and industrial rooftop plants in Haryana and Delhi NCR pay back in about 3–4 years, because businesses use most of the power during daylight when the panels generate.",
    },
    faqs: [
      {
        q: "How much roof does a 100 kW plant need?",
        a: "About 10,000 sq ft of shadow-free roof — roughly 100 sq ft per kW. Metal sheds and RCC roofs can both be used with the right structure.",
      },
      {
        q: "Will installation stop my production?",
        a: "No. We plan work around your shifts, and the final grid connection usually needs only a short scheduled shutdown.",
      },
      {
        q: "Is there a zero-investment option for factories?",
        a: "Yes. Under a RESCO model, an investor owns the plant and you buy its power at a fixed tariff below grid rates. We can explain both CAPEX and RESCO options.",
      },
    ],
    metaDescription:
      "Commercial & industrial solar for factories, schools and warehouses in Haryana & Delhi NCR. 20 kW–1 MW+ plants, 3–4 year payback.",
  },
  {
    slug: "on-grid-off-grid-hybrid-solar",
    title: "On-grid, Off-grid & Hybrid Solar",
    shortTitle: "On-grid, Off-grid & Hybrid",
    short: "The right system for your grid — with or without battery backup.",
    description:
      "Not every roof needs the same system. Where power cuts are frequent we add lithium batteries; where the grid is reliable, on-grid net-metering gives the fastest payback. We'll explain the trade-offs honestly before you decide.",
    icon: "bolt",
    features: [
      "On-grid systems with bi-directional net meter",
      "Off-grid systems with lithium or tubular batteries",
      "Hybrid inverters that keep lights on during outages",
      "Battery sizing based on your critical loads",
      "Upgrade path: add batteries to an on-grid system later",
    ],
    idealFor: ["Areas with frequent power cuts", "Farmhouses & remote sites", "Homes needing backup for essentials"],
    highlight: "Power through outages",
    quickAnswer: {
      q: "Should I choose on-grid, off-grid or hybrid solar?",
      a: "Choose on-grid if your grid is reliable — it is the cheapest and qualifies for subsidy. Choose hybrid if you face regular power cuts, and off-grid only where there is no grid connection.",
    },
    faqs: [
      {
        q: "Does an on-grid system work during a power cut?",
        a: "No. For safety, on-grid inverters shut down when the grid fails. If you need backup, choose a hybrid system with batteries.",
      },
      {
        q: "Is the subsidy available for hybrid systems?",
        a: "Yes, for the solar panel capacity of a grid-connected residential system. Batteries themselves are not subsidised.",
      },
      {
        q: "How long do solar batteries last?",
        a: "Lithium batteries typically last 8–10 years; tubular lead-acid batteries around 4–6 years, depending on use and maintenance.",
      },
    ],
    metaDescription:
      "On-grid, off-grid and hybrid solar systems compared — costs, backup, subsidy and payback. Honest advice for Haryana & Delhi NCR homes.",
  },
  {
    slug: "solar-water-pump",
    title: "Solar Water Pumps",
    shortTitle: "Solar Water Pumps",
    short: "Free daytime irrigation with no diesel and no waiting for grid supply.",
    description:
      "Surface and submersible solar pumps from 1 HP to 10 HP, with PM-KUSUM scheme guidance. Pump water when the sun is strongest — exactly when your crops need it — and stop paying for diesel.",
    icon: "droplet",
    features: [
      "1 HP to 10 HP AC/DC submersible and surface pumps",
      "PM-KUSUM subsidy documentation support",
      "Remote monitoring with mobile on/off control",
      "Theft-resistant mounting and pump protection",
      "Works with drip and sprinkler systems",
    ],
    idealFor: ["Farmers & orchards", "Dairy farms & nurseries", "Borewells far from the grid"],
    highlight: "Zero diesel cost",
    quickAnswer: {
      q: "What size solar pump do I need?",
      a: "It depends on your borewell depth and daily water need: most Haryana farms use 3–7.5 HP pumps. We size the pump after checking the water level and your crop's requirement.",
    },
    faqs: [
      {
        q: "Does a solar pump work on cloudy days?",
        a: "Yes, at reduced flow. On heavily overcast days output drops, so we size the system with some margin for cloudy periods.",
      },
      {
        q: "Is there a subsidy for solar pumps?",
        a: "Farmers may be eligible under the PM-KUSUM scheme through the state agency. Rules and quotas change, so we check current availability and help with the paperwork.",
      },
      {
        q: "How long does a solar pump last?",
        a: "Panels last 25 years; a quality pump and controller typically run 10 years or more with basic maintenance.",
      },
    ],
    metaDescription:
      "Solar water pumps from 1–10 HP for farms in Haryana & Delhi NCR. Cut diesel costs, run drip irrigation, with PM-KUSUM guidance.",
  },
  {
    slug: "solar-amc-cleaning",
    title: "Solar AMC & Panel Cleaning",
    shortTitle: "Solar AMC & Cleaning",
    short: "Keep your plant producing at its best for 25 years and beyond.",
    description:
      "Dust can cut generation by 15–25% in dry months. Our annual maintenance plans include scheduled cleaning, electrical health checks and fast breakdown support — for any brand, not just systems we installed.",
    icon: "wrench",
    features: [
      "Scheduled panel cleaning with soft water & brushes",
      "Thermal imaging to catch hot-spots early",
      "Inverter, earthing and SPD health checks",
      "Breakdown response within 48 hours",
      "Monthly generation report on WhatsApp",
    ],
    idealFor: ["Any existing solar system", "Dusty or industrial areas", "Plants older than 3 years"],
    highlight: "Up to 25% more output",
    quickAnswer: {
      q: "How often should solar panels be cleaned?",
      a: "Every 2–3 weeks in dry, dusty months and about once a month otherwise. Dirty panels can lose 15–25% of their output in Haryana's dry season.",
    },
    faqs: [
      {
        q: "Do you service solar systems installed by other companies?",
        a: "Yes. Our AMC covers any brand of panels and inverters.",
      },
      {
        q: "Can I clean solar panels myself?",
        a: "Yes, with plain water and a soft brush or mop, early in the morning. Avoid detergents, pressure washers and walking on the panels.",
      },
      {
        q: "What does an AMC visit include?",
        a: "Panel cleaning, a visual and electrical inspection, inverter and earthing checks, tightening of connections and a short report with any issues found.",
      },
    ],
    metaDescription:
      "Solar AMC and panel cleaning for homes and factories in Haryana & Delhi NCR. Any brand, 48-hour breakdown support, up to 25% more output.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

// TODO: replace these placeholder figures with AKD Solar's real, verifiable numbers before launch.
export const stats = [
  { value: 3200, suffix: "+", label: "kW installed", detail: "across homes, businesses and farms" },
  { value: 1800, suffix: "+", label: "Happy customers", detail: "rated 4.9/5 on Google" },
  { value: 4100, suffix: "+", label: "Tonnes of CO₂ saved", detail: "every single year" },
  { value: new Date().getFullYear() - 2016, suffix: "+", label: "Years of experience", detail: "since 2016" },
];

export const trustPoints: { icon: IconName; title: string; text: string }[] = [
  { icon: "rupee", title: "PM Surya Ghar subsidy support", text: "We file, track and follow up until the subsidy reaches your bank." },
  { icon: "badge", title: "MNRE-approved panels", text: "Only ALMM-listed, BIS-certified modules from Tier-1 makers." },
  { icon: "shield", title: "25-year panel warranty", text: "Performance warranty on panels, 5–10 years on inverters." },
  { icon: "gauge", title: "Net-metering assistance", text: "UHBVN, DHBVN, BSES, PVVNL and NPCL applications handled." },
];

export const subsidyTiers = [
  { kw: "1 kW", amount: 30000, usage: "Up to 150 units / month", bill: "Bills up to ~₹1,200", popular: false },
  { kw: "2 kW", amount: 60000, usage: "150 – 300 units / month", bill: "Bills of ₹1,200 – ₹2,500", popular: true },
  { kw: "3 kW & above", amount: 78000, usage: "300+ units / month", bill: "Bills above ₹2,500", popular: false },
];

export const processSteps: { icon: IconName; title: string; text: string; time: string }[] = [
  {
    icon: "clipboard",
    title: "Free site survey",
    text: "An engineer visits, checks shade, roof strength and your last few bills — no charge, no pressure.",
    time: "Day 1",
  },
  {
    icon: "pencil",
    title: "Custom design",
    text: "You get a 3D layout, generation estimate and a clear, itemised quote with no hidden extras.",
    time: "Day 2–3",
  },
  {
    icon: "document",
    title: "Paperwork & subsidy",
    text: "We register you on the PM Surya Ghar portal and file the DISCOM application on your behalf.",
    time: "Week 1–2",
  },
  {
    icon: "bolt",
    title: "Installation in ~7 days",
    text: "Our trained in-house crew installs the structure, panels, inverter and safety earthing.",
    time: "~7 days",
  },
  {
    icon: "gauge",
    title: "Net-metering",
    text: "We coordinate inspection and the bi-directional meter so you start earning credits.",
    time: "2–4 weeks",
  },
  {
    icon: "key",
    title: "Handover & support",
    text: "App setup, a walkthrough of your system and 25 years of a team that answers the phone.",
    time: "For 25 years",
  },
];

export type ProjectCategory = "residential" | "commercial" | "agricultural";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  capacityKw: number;
  annualSavings: number;
  year: number;
  summary: string;
};

// TODO: PLACEHOLDER PROJECTS — replace with real AKD Solar installations (names, places, capacities, savings).
export const projects: Project[] = [
  {
    id: "sharma-residence",
    title: "Sharma Residence",
    category: "residential",
    location: "Model Town, Sonipat",
    capacityKw: 5,
    annualSavings: 62000,
    year: 2025,
    summary: "Monthly bill dropped from ₹5,800 to under ₹300 in the first summer.",
  },
  {
    id: "panipat-textiles",
    title: "Textile Unit",
    category: "commercial",
    location: "Sector 29, Panipat",
    capacityKw: 150,
    annualSavings: 1860000,
    year: 2024,
    summary: "Rooftop plant across two sheds, paying back in just over three years.",
  },
  {
    id: "gharaunda-farm",
    title: "Farm Solar Pump",
    category: "agricultural",
    location: "Gharaunda, Karnal",
    capacityKw: 7.5,
    annualSavings: 85000,
    year: 2024,
    summary: "7.5 HP submersible solar pump replacing a diesel genset for paddy irrigation.",
  },
  {
    id: "gurugram-society",
    title: "Group Housing Society",
    category: "residential",
    location: "Sector 56, Gurugram",
    capacityKw: 40,
    annualSavings: 490000,
    year: 2025,
    summary: "Society common-area load — lifts, pumps and lighting — now runs on sunshine.",
  },
  {
    id: "rohtak-school",
    title: "Senior Secondary School",
    category: "commercial",
    location: "Sector 14, Rohtak",
    capacityKw: 60,
    annualSavings: 740000,
    year: 2023,
    summary: "Daytime load matched almost perfectly to school hours for maximum savings.",
  },
  {
    id: "sirsa-orchard",
    title: "Kinnow Orchard",
    category: "agricultural",
    location: "Ellenabad, Sirsa",
    capacityKw: 10,
    annualSavings: 110000,
    year: 2025,
    summary: "Drip irrigation for a kinnow orchard with remote pump control from the farmer's phone.",
  },
  {
    id: "faridabad-villa",
    title: "Verma Villa",
    category: "residential",
    location: "Sector 15, Faridabad",
    capacityKw: 3,
    annualSavings: 38000,
    year: 2024,
    summary: "Full ₹78,000 PM Surya Ghar subsidy credited after commissioning.",
  },
  {
    id: "kaithal-rice-mill",
    title: "Rice Mill",
    category: "commercial",
    location: "Cheeka, Kaithal",
    capacityKw: 80,
    annualSavings: 1020000,
    year: 2023,
    summary: "Milling and drying load offset during daytime hours across the year.",
  },
  {
    id: "dwarka-home",
    title: "Builder-floor Home",
    category: "residential",
    location: "Dwarka, Delhi",
    capacityKw: 4,
    annualSavings: 48000,
    year: 2025,
    summary: "Hybrid system with lithium backup — the work-from-home office never goes dark.",
  },
  {
    id: "jind-dairy",
    title: "Dairy Farm",
    category: "agricultural",
    location: "Safidon, Jind",
    capacityKw: 25,
    annualSavings: 310000,
    year: 2024,
    summary: "Powers milking machines, chillers and borewell pumps on one ground-mount array.",
  },
];

// TODO: PLACEHOLDER TESTIMONIALS — replace with real, consented customer reviews before launch.
export const testimonials = [
  {
    quote:
      "Three different companies came to survey our house. AKD was the only one that told us we needed a smaller system than we asked for. Our bill is now ₹240, and the subsidy came through exactly when they said it would.",
    name: "Rakesh Sharma",
    role: "5 kW rooftop, Sonipat",
    initials: "RS",
  },
  {
    quote:
      "Power cuts were wrecking my work-from-home days. The hybrid system has run the router, fans and laptop through every outage this summer. Installation was clean — not a single scratch on our terrace waterproofing.",
    name: "Priya Malhotra",
    role: "4 kW hybrid, Delhi",
    initials: "PM",
  },
  {
    quote:
      "We used to burn diesel worth ₹7,000 a month to run the borewell. The solar pump runs the drip lines all day for free. Their team even sat with my father and explained the mobile app in Haryanvi.",
    name: "Harpreet Singh",
    role: "Farm solar pump, Sirsa",
    initials: "HS",
  },
  {
    quote:
      "For a factory, downtime is the real fear. AKD planned the installation around our shifts and finished in nine working days. The plant is tracking 4% above their generation estimate.",
    name: "Anjali Goyal",
    role: "150 kW plant, Panipat",
    initials: "AG",
  },
  {
    quote:
      "What I value most is after-sales. One string stopped producing after a storm; I got a WhatsApp alert and their technician was on our roof the next morning. That's rare.",
    name: "Dr. Vivek Joshi",
    role: "60 kW school plant, Rohtak",
    initials: "VJ",
  },
];

/** Home-page FAQs — each answer leads with a direct 1–2 sentence answer (AEO) */
export const faqs: FAQ[] = [
  {
    q: "Am I eligible for the PM Surya Ghar subsidy?",
    a: "Most homeowners are: you need to own the house, have an electricity connection in your name and not have claimed a rooftop solar subsidy before. The subsidy is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW — up to ₹78,000. We check eligibility for free and handle the portal registration.",
  },
  {
    q: "How much roof space do I need?",
    a: "About 100 sq ft of shadow-free roof per kW, so a 3 kW system needs roughly 300 sq ft. Elevated structures let you keep using the terrace underneath for drying clothes, plants or parking.",
  },
  {
    q: "How long does installation take?",
    a: "About 7 days on the roof for most homes. Including survey, design, subsidy registration and net-metering, the whole journey is usually 4–6 weeks, depending on your DISCOM.",
  },
  {
    q: "What is net-metering and do I need it?",
    a: "Net-metering lets you export extra daytime solar power to the grid as credit and use it at night, so you only pay for the net difference. It is required for the PM Surya Ghar subsidy, and we handle the whole application.",
  },
  {
    q: "Will solar work during monsoon or cloudy days?",
    a: "Yes — panels still generate on cloudy days, just less. Our generation estimates already include monsoon months, so the annual savings we quote are realistic.",
  },
  {
    q: "Do I need batteries?",
    a: "Not if your grid is reliable: on-grid systems give the fastest payback. If you face frequent power cuts, a hybrid system with lithium batteries keeps essential loads running.",
  },
  {
    q: "Can I pay in EMIs?",
    a: "Yes. Banks offer collateral-free solar loans for homes under the PM Surya Ghar scheme, and many families find the EMI is lower than the bill it replaces.",
  },
  {
    q: "What maintenance does a solar system need?",
    a: "Very little: clean the panels every 2–3 weeks in dusty months and have an annual electrical check. Our AMC plans cover both.",
  },
];

export const values: { icon: IconName; title: string; text: string }[] = [
  { icon: "handshake", title: "Honest advice", text: "We size systems for your bill, not our margin — even when that means a smaller order." },
  { icon: "target", title: "Engineering first", text: "Every design is load-checked, shadow-mapped and signed off by a qualified engineer." },
  { icon: "heart", title: "Care that lasts", text: "25 years is a long relationship. We pick up the phone in year 12 just like in week 1." },
  { icon: "leaf", title: "Nature in balance", text: "Clean energy, responsible recycling and zero-waste installations — our tagline, in practice." },
];

// TODO: PLACEHOLDER TEAM — replace names, roles and bios with the real team (or remove the section).
export const team = [
  { name: "Rohit Agarwal", role: "Founder & Managing Director", initials: "RA", bio: "Electrical engineer with 15 years in power distribution." },
  { name: "Neha Bansal", role: "Head of Operations", initials: "NB", bio: "Keeps every installation on time and on budget." },
  { name: "Imran Qureshi", role: "Lead Design Engineer", initials: "IQ", bio: "Designs rooftop and C&I systems across Haryana and NCR." },
  { name: "Kavita Rathore", role: "Customer Success Lead", initials: "KR", bio: "Your go-to for subsidy, net-metering and service." },
];

// TODO: confirm each certification/registration is real before launch; remove any that don't apply.
export const certifications: { icon: IconName; title: string; text: string }[] = [
  { icon: "badge", title: "MNRE-registered vendor", text: "Approved vendor on the PM Surya Ghar national portal." },
  { icon: "shield", title: "ISO 9001:2015", text: "Certified quality management for design and installation." },
  { icon: "sun", title: "ALMM-listed modules", text: "Only modules on MNRE's Approved List of Models & Manufacturers." },
  { icon: "bolt", title: "Licensed electrical contractor", text: "State electrical licence and DISCOM-empanelled installer." },
];

export const whyUs: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "In-house installation crew", text: "No sub-contracting. The people who survey your roof are the people who install it." },
  { icon: "rupee", title: "Transparent, itemised quotes", text: "Panel brand, inverter model, structure and cable specs — all in writing, before you pay." },
  { icon: "clock", title: "Installed in ~7 days", text: "Material is stocked locally, so we don't keep you waiting for weeks after approval." },
  { icon: "eye", title: "Live monitoring", text: "Watch your generation and savings on your phone, with alerts if anything drops." },
  { icon: "wrench", title: "48-hour service promise", text: "If something needs attention, a technician is on site within two working days." },
  { icon: "leaf", title: "Responsible to the end", text: "Packaging recycled, roofs left spotless, and end-of-life panel take-back." },
];

export const comparison = {
  columns: ["On-grid", "Off-grid", "Hybrid"] as const,
  rows: [
    { label: "Connected to the grid", values: ["Yes", "No", "Yes"] },
    { label: "Battery backup", values: ["No", "Yes", "Yes"] },
    { label: "Works during power cuts", values: ["No", "Yes", "Yes"] },
    { label: "Net-metering credits", values: ["Yes", "No", "Yes"] },
    { label: "PM Surya Ghar subsidy", values: ["Eligible", "Not eligible", "Eligible*"] },
    { label: "Typical cost (3 kW)", values: ["₹1.6–1.9 L", "₹2.3–2.8 L", "₹2.4–3.0 L"] },
    { label: "Payback period", values: ["3–5 years", "6–8 years", "5–7 years"] },
    { label: "Maintenance", values: ["Very low", "Battery care", "Low"] },
    { label: "Best for", values: ["Reliable grid, lowest bills", "Remote sites, farms", "Frequent outages"] },
  ],
  note: "*Subsidy applies to the solar panel capacity; batteries are not subsidised.",
};
