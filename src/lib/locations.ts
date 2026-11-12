/**
 * Cities we serve. Every city page, the /locations hub, the sitemap, llms.txt and
 * the site-wide areaServed schema are generated from this list.
 *
 * To add a city: append one entry to `locations` below (and add it to the Locations menu order in Header if wanted).
 * Write a genuinely local intro and FAQs (not the same text with the name swapped).
 */

export type Region = "Haryana" | "Delhi NCR";
export type CalcState = "haryana" | "delhi" | "uttar-pradesh";

export type Discom = { short: string; name: string; note?: string };

export const DISCOMS = {
  UHBVN: { short: "UHBVN", name: "Uttar Haryana Bijli Vitran Nigam (UHBVN)" },
  DHBVN: { short: "DHBVN", name: "Dakshin Haryana Bijli Vitran Nigam (DHBVN)" },
  NCR: {
    short: "BSES / TPDDL / PVVNL / NPCL",
    name: "BSES Rajdhani, BSES Yamuna or Tata Power-DDL (Delhi), PVVNL (Noida, Ghaziabad) or NPCL (Greater Noida)",
    note: "Your DISCOM depends on your area.",
  },
} satisfies Record<string, Discom>;

export type FAQ = { q: string; a: string };

export type Location = {
  slug: string;
  name: string;
  region: Region;
  state: "Haryana" | "Delhi" | "Uttar Pradesh";
  /** state id used by the savings calculator */
  calcState: CalcState;
  discom: Discom;
  heroLine: string;
  /** Unique local intro — 2 short paragraphs */
  intro: [string, string];
  /** Typical sunshine / generation note */
  sunshine: string;
  localities: string[];
  customers: string[];
  /** Pre-set monthly bill for the city calculator (₹) */
  typicalBill: number;
  lat: number;
  lng: number;
  /** City-specific questions; common DISCOM / subsidy / timeline questions are added automatically */
  faqs: FAQ[];
};

export const locations: Location[] = [
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    region: "Delhi NCR",
    state: "Delhi",
    calcState: "delhi",
    discom: DISCOMS.NCR,
    heroLine: "Rooftop solar for homes and businesses across Delhi, Noida, Greater Noida and Ghaziabad.",
    intro: [
      "Delhi NCR rooftops range from builder floors and bungalows to society towers and industrial sheds. We check who controls the roof first, then size the system to the space and your monthly units.",
      "Your electricity company depends on where you live, and we handle net metering with each of them. Delhi NCR is served from our Sonipat offices.",
    ],
    sunshine: "Delhi NCR averages about 4.0–4.2 units per kW per day — roughly 120 units per kW each month.",
    localities: ["Dwarka", "Rohini", "Pitampura", "Janakpuri", "Noida", "Greater Noida", "Ghaziabad", "Indirapuram"],
    customers: ["Builder floors and bungalows", "RWAs and group housing", "Offices and shops", "Industrial units"],
    typicalBill: 4500,
    lat: 28.6139,
    lng: 77.209,
    faqs: [
      {
        q: "Can a builder floor in Delhi install rooftop solar?",
        a: "Yes, if the terrace rights are clear. Usually the top-floor owner holds them; otherwise residents agree to share the roof.",
      },
    ],
  },
  {
    slug: "gurugram",
    name: "Gurugram",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "High bills, flat roofs and frequent backup needs — Gurugram is made for solar.",
    intro: [
      "In Gurugram, villas and builder floors in areas like DLF phases, South City and Sushant Lok often run three or more air-conditioners, and monthly DHBVN bills of ₹6,000–₹12,000 are common. A 5–10 kW rooftop system can bring that down sharply.",
      "Builder floors raise a practical question — who owns the roof? We help residents agree on terrace sharing, and we design hybrid systems for homes that want backup during outages. Offices and warehouses in Udyog Vihar and Manesar are strong commercial candidates.",
    ],
    sunshine: "Gurugram receives roughly 4.1–4.3 units per kW per day; a 5 kW system typically produces 7,500–7,800 units a year.",
    localities: ["DLF Phase 1–5", "Sushant Lok", "South City", "Sohna Road", "Golf Course Road", "Palam Vihar", "Sector 56", "Udyog Vihar", "Manesar"],
    customers: ["Villas and builder floors", "Group housing societies (common areas)", "Offices and IT parks", "Warehouses in Manesar"],
    typicalBill: 6000,
    lat: 28.4595,
    lng: 77.0266,
    faqs: [
      {
        q: "Can I install solar on a builder floor in Gurugram?",
        a: "Yes, if the terrace rights are clear. The top-floor owner usually holds them; otherwise residents can share the roof and split generation. We help document the arrangement so DHBVN approval goes smoothly.",
      },
      {
        q: "Can a housing society in Gurugram install solar for common areas?",
        a: "Yes. Societies commonly use rooftop solar for lifts, pumps and common lighting. We prepare the proposal for the RWA and handle the DHBVN application.",
      },
    ],
  },
  {
    slug: "faridabad",
    name: "Faridabad",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "Faridabad's industrial muscle, powered from its own rooftops.",
    intro: [
      "Faridabad is one of Haryana's oldest industrial cities, and its engineering and auto-component units carry high daytime loads that solar matches well. Sector-based residential areas and Greater Faridabad's newer towers make up the other half of our work here.",
      "For homes in NIT and the older sectors, roof space can be tight, so we use elevated structures that keep the terrace usable. For factories, we look at demand charges and shift patterns before recommending a plant size.",
    ],
    sunshine: "Faridabad averages about 4.1 units per kW per day — roughly 1,500 units per kW per year.",
    localities: ["Sector 15", "Sector 21", "Sector 37", "NIT", "Old Faridabad", "Ballabgarh", "Greater Faridabad", "Surajkund"],
    customers: ["Engineering and auto-component units", "Independent houses", "Hospitals and schools", "Group housing societies"],
    typicalBill: 4000,
    lat: 28.4089,
    lng: 77.3178,
    faqs: [
      {
        q: "Can a small roof in Faridabad still fit a useful solar system?",
        a: "Often yes. Each kW needs about 100 sq ft of shadow-free roof, so even 250 sq ft can host a 2.5 kW system. Elevated structures let you keep using the terrace underneath.",
      },
      {
        q: "Does solar help factories in Faridabad reduce demand charges?",
        a: "It can reduce energy charges substantially; the effect on demand charges depends on when your peak load occurs. We analyse your bills and load pattern before promising savings.",
      },
    ],
  },
  {
    slug: "sonipat",
    name: "Sonipat",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "From Model Town rooftops to Kundli factory sheds — our home city, our fastest installations.",
    intro: [
      "Sonipat is where AKD Solar is based, so homes here get the shortest wait for a survey and the quickest service visits. The city has grown fast along the NH-44 corridor, and many newer houses in the HSVP sectors have flat, shadow-free terraces that are ideal for elevated solar structures.",
      "Beyond homes, the Kundli and Rai industrial belts run heavy daytime loads — exactly when solar produces most — and the education campuses around Rai have large roofs sitting idle. We size each system around your actual UHBVN bills rather than a standard package.",
    ],
    sunshine: "Sonipat averages around 4.1 units of generation per kW per day, so a 3 kW system typically produces roughly 4,400–4,600 units a year.",
    localities: ["Model Town", "Sector 14", "Sector 15", "Sector 23", "Kundli", "Rai", "Murthal", "Ganaur", "Gohana Road", "Kharkhoda"],
    customers: ["Independent houses", "Industrial units in Kundli & Rai", "Schools and colleges", "Dhabas and hotels on NH-44", "Farms and tubewells"],
    typicalBill: 3500,
    lat: 28.9931,
    lng: 77.0151,
    faqs: [
      {
        q: "Can factories in Kundli and Rai install rooftop solar?",
        a: "Yes. Industrial units on UHBVN connections can install rooftop solar, usually sized to cut daytime grid consumption. We check your sanctioned load, roof strength and shed orientation, then design a plant that pays back typically in 3–4 years.",
      },
      {
        q: "How quickly can AKD Solar survey my home in Sonipat?",
        a: "Usually within 24–48 hours. Our office is in Sonipat, so local surveys and service visits are scheduled faster than in other cities.",
      },
    ],
  },
  {
    slug: "rohtak",
    name: "Rohtak",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Solar for Rohtak's sector homes, IMT units and farmhouses — sized to your UHBVN bill.",
    intro: [
      "Rohtak combines older city neighbourhoods with planned HSVP sectors and the growing IMT Rohtak industrial township. Summer air-conditioning loads push many family bills well past ₹4,000 a month, which is where a 3–5 kW rooftop system makes the biggest difference.",
      "On the outskirts, farmhouses and tubewell connections along the Delhi and Jhajjar roads are good candidates for solar pumps or ground-mounted arrays. We serve Rohtak from our Sonipat office, roughly an hour away, with scheduled survey days every week.",
    ],
    sunshine: "Rohtak receives about 4.1 units per kW per day on average — a 5 kW system typically generates 7,300–7,600 units a year.",
    localities: ["Model Town", "Sector 1", "Sector 2", "Sector 14", "Subhash Nagar", "Sunaria", "IMT Rohtak", "Delhi Road"],
    customers: ["Family homes in HSVP sectors", "IMT manufacturing units", "Coaching centres and hostels", "Farmhouses and tubewells"],
    typicalBill: 3500,
    lat: 28.8955,
    lng: 76.6066,
    faqs: [
      {
        q: "Is rooftop solar worth it for a house in Rohtak with a ₹3,000 bill?",
        a: "Usually yes. A 2–3 kW system can offset most of a ₹3,000 monthly bill, and after the PM Surya Ghar subsidy the payback is typically 3–4 years with panels that last 25 years.",
      },
      {
        q: "Can units in IMT Rohtak use solar for daytime production?",
        a: "Yes. Factory roofs in IMT Rohtak are well suited to rooftop plants that run during production hours. We model your load from 12 months of bills to size the plant for the best return.",
      },
    ],
  },
  {
    slug: "panipat",
    name: "Panipat",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Panipat's textile city runs on power — let your roof produce some of it.",
    intro: [
      "Panipat's handloom and textile units run looms, dryers and lighting through the day, so a large share of their electricity can come straight from the roof. Many of these units have wide sheds that suit rows of panels on a light-weight structure.",
      "Homes in Model Town and the HSVP sectors have a different need: steady summer bills and evening use. For them, an on-grid system with UHBVN net-metering banks daytime surplus as credit for the night.",
    ],
    sunshine: "Panipat averages around 4.1 units per kW per day — about 1,500 units per kW each year.",
    localities: ["Model Town", "Sector 11", "Sector 12", "Sector 13-17", "Tehsil Camp", "Samalkha", "Israna", "Industrial Area Sector 29"],
    customers: ["Textile and handloom units", "Independent houses", "Warehouses on GT Road", "Schools"],
    typicalBill: 3500,
    lat: 29.3909,
    lng: 76.9635,
    faqs: [
      {
        q: "Will a textile unit's tin shed in Panipat hold solar panels?",
        a: "Most can. We inspect the purlins and sheet condition first and use a light-weight mounting that clamps to the roof profile. If a shed needs reinforcement, we tell you before quoting.",
      },
      {
        q: "Do I need batteries for solar in Panipat?",
        a: "Not usually. With UHBVN net-metering, daytime surplus is credited against night use. Batteries only make sense if power cuts in your area disrupt work.",
      },
    ],
  },
  {
    slug: "karnal",
    name: "Karnal",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Karnal's rice belt and growing sectors — solar for homes, mills and farms.",
    intro: [
      "Karnal sits at the heart of Haryana's paddy belt, and rice mills, cold storages and dairy farms around the city use a great deal of daytime power. Rooftop plants on mill sheds and solar pumps on farms both pay back quickly here.",
      "In the city, the HSVP sectors and Model Town have many independent houses with open terraces. We serve Karnal from our Sonipat office along NH-44, with regular survey days in the area.",
    ],
    sunshine: "Karnal receives about 4.0–4.1 units per kW per day, or roughly 1,460–1,500 units per kW each year.",
    localities: ["Sector 6", "Sector 13", "Sector 32", "Model Town", "Prem Nagar", "Kunjpura Road", "Gharaunda", "Nilokheri"],
    customers: ["Rice mills and cold storages", "Dairy farms", "Independent houses", "Farms with tubewells"],
    typicalBill: 3000,
    lat: 29.6857,
    lng: 76.9905,
    faqs: [
      {
        q: "Is solar a good fit for rice mills near Karnal?",
        a: "Yes, especially for the daytime milling and drying load. Mill sheds usually have large roofs, so even a 50–100 kW plant fits comfortably. We size it so most of the power is used on site.",
      },
      {
        q: "Can I run a tubewell on solar in Karnal?",
        a: "Yes. Solar water pumps from 3 HP to 10 HP can run your tubewell during daylight with no diesel cost. We also guide you on PM-KUSUM eligibility where applicable.",
      },
    ],
  },

];

export const regions: Region[] = ["Haryana", "Delhi NCR"];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}

export function locationsByRegion(region: Region) {
  return locations.filter((l) => l.region === region);
}

/** Nearest other cities by straight-line distance (for internal links) */
export function nearbyLocations(loc: Location, count = 4) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dist = (a: Location, b: Location) => {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  };
  return locations
    .filter((l) => l.slug !== loc.slug)
    .map((l) => ({ ...l, km: Math.round(dist(loc, l)) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count);
}

/** Full FAQ list for a city: city-specific questions + common ones built from the city's own data */
export function cityFaqs(loc: Location): FAQ[] {
  const stateNote =
    loc.state === "Haryana"
      ? " Haryana announced an extra ₹50,000 (income up to ₹1.8 lakh) or ₹20,000 (₹1.8–3 lakh) in June 2024 — confirm current status with DHBVN/UHBVN."
      : "";
  return [
    ...loc.faqs,
    {
      q: `Which DISCOM handles solar net-metering in ${loc.name}?`,
      a: `${loc.discom.name}. ${loc.discom.note ?? ""} We apply for net-metering on your behalf, coordinate the inspection and get the bi-directional meter installed.`.replace(/\s+/g, " "),
    },
    {
      q: `How much subsidy can I get for rooftop solar in ${loc.name}?`,
      a: `Up to ₹78,000 under PM Surya Ghar for homes: ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW. The central subsidy is capped at ₹78,000 for 3 kW and above.${stateNote}`,
    },
    {
      q: `How long does solar installation take in ${loc.name}?`,
      a: `Installation takes as little as 3 days. Net metering with ${loc.discom.short} and the subsidy follow after that.`,
    },
  ];
}
