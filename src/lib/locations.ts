/**
 * Cities we serve. Every city page, the /locations hub, the sitemap, llms.txt and
 * the site-wide areaServed schema are generated from this list.
 *
 * To add a city: append one entry to `locations` below. Nothing else needs changing.
 * Write a genuinely local intro and FAQs (not the same text with the name swapped).
 */

export type Region = "Haryana" | "Delhi NCR";
export type CalcState = "haryana" | "delhi" | "uttar-pradesh";

export type Discom = { short: string; name: string; note?: string };

export const DISCOMS = {
  UHBVN: { short: "UHBVN", name: "Uttar Haryana Bijli Vitran Nigam (UHBVN)" },
  DHBVN: { short: "DHBVN", name: "Dakshin Haryana Bijli Vitran Nigam (DHBVN)" },
  DELHI: {
    short: "BSES / Tata Power-DDL",
    name: "BSES Rajdhani (BRPL), BSES Yamuna (BYPL) or Tata Power-DDL",
    // Verified split: BRPL = South & West Delhi, BYPL = East & Central Delhi, TPDDL = North & North-West Delhi.
    // NDMC supplies the Lutyens' (New Delhi) area.
    note: "BSES Rajdhani serves South and West Delhi, BSES Yamuna serves East and Central Delhi, and Tata Power-DDL serves North and North-West Delhi.",
  },
  PVVNL: { short: "PVVNL", name: "Paschimanchal Vidyut Vitran Nigam (PVVNL)" },
  NPCL: { short: "NPCL", name: "Noida Power Company Limited (NPCL)" },
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
  // ───────────────────────── Haryana ─────────────────────────
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
  {
    slug: "hisar",
    name: "Hisar",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "Some of Haryana's strongest sunshine falls on Hisar — make it count.",
    intro: [
      "Hisar's semi-arid climate gives it more clear-sky days than most of Haryana, which means every kW of panels here works a little harder. That makes rooftop solar especially attractive for homes in Urban Estate and the HSVP sectors.",
      "The district's farms and agri-businesses are big users of water and power, so solar pumps and ground-mounted systems are common requests. Dust is the trade-off: panels here need more regular cleaning, which our AMC plans cover.",
    ],
    sunshine: "Hisar typically sees around 4.4–4.6 units per kW per day — one of the higher yields in Haryana.",
    localities: ["Urban Estate", "Sector 13", "Sector 15", "Model Town", "Auto Market", "Industrial Area", "Hansi", "Barwala"],
    customers: ["Independent houses", "Farms and orchards", "Agri-processing units", "Schools and hostels"],
    typicalBill: 3000,
    lat: 29.1492,
    lng: 75.7217,
    faqs: [
      {
        q: "How often should solar panels be cleaned in Hisar?",
        a: "Every 2–3 weeks in the dry months. Hisar's dust can cut output by 15–25% if panels are left dirty, so a cleaning plan protects your savings.",
      },
      {
        q: "Does Hisar's heat reduce solar panel output?",
        a: "Slightly — panels lose a little efficiency in extreme heat — but Hisar's long sunny days more than make up for it. We use elevated structures that allow airflow under the panels to keep them cooler.",
      },
    ],
  },
  {
    slug: "ambala",
    name: "Ambala",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Solar for Ambala City, Ambala Cantt and the instrument-makers in between.",
    intro: [
      "Ambala is really two towns — the older Ambala City and the planned Ambala Cantonment — plus a long-standing scientific-instruments industry. Workshops making lab equipment run daytime loads that match solar generation closely.",
      "Homes in Baldev Nagar and the sectors typically need 2–4 kW systems. Monsoon here is heavier than in south Haryana, and our yearly estimates include those cloudier months so the savings we quote are realistic.",
    ],
    sunshine: "Ambala averages roughly 4.0 units per kW per day across the year, including a cloudier monsoon season.",
    localities: ["Ambala City", "Ambala Cantt", "Baldev Nagar", "Sector 7", "Sector 9", "Mullana", "Barara", "Naraingarh"],
    customers: ["Independent houses", "Scientific-instrument workshops", "Schools and colleges", "Shops and showrooms"],
    typicalBill: 3000,
    lat: 30.3782,
    lng: 76.7767,
    faqs: [
      {
        q: "Will solar still save money in Ambala during the monsoon?",
        a: "Yes, just less in those weeks. Panels generate on cloudy days too, and net-metering credits from sunnier months offset the dip. Our annual savings estimate already includes the monsoon.",
      },
      {
        q: "Can houses in Ambala Cantt install rooftop solar?",
        a: "Private residential properties generally can, subject to UHBVN approval and any local building rules. We check the requirements during the free survey.",
      },
    ],
  },
  {
    slug: "yamunanagar",
    name: "Yamunanagar",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Plywood presses and metal workshops by day — solar to match.",
    intro: [
      "Yamunanagar and twin town Jagadhri are known for plywood and metal-utensil manufacturing, industries that run presses, dryers and polishing machines through daylight hours. Rooftop solar on factory sheds can supply a significant share of that load directly.",
      "Residential demand is growing in Model Town and the newer sectors, where families often ask about hybrid systems because of occasional outages. We design both, and explain the cost difference honestly.",
    ],
    sunshine: "Yamunanagar receives about 4.0 units per kW per day on average across the year.",
    localities: ["Jagadhri", "Model Town", "Sector 17", "Bilaspur", "Radaur", "Chhachhrauli", "Industrial Area"],
    customers: ["Plywood units", "Metal and utensil workshops", "Independent houses", "Schools"],
    typicalBill: 3000,
    lat: 30.129,
    lng: 77.2674,
    faqs: [
      {
        q: "Is solar safe on a plywood factory roof?",
        a: "Yes, with the right design. We keep cable runs in metal conduit, add proper earthing and surge protection, and leave access paths for cleaning and fire safety.",
      },
      {
        q: "Should my Yamunanagar home choose hybrid or on-grid solar?",
        a: "Choose on-grid for the lowest cost and fastest payback; choose hybrid if outages regularly disrupt you. A hybrid system costs more upfront because of the batteries.",
      },
    ],
  },
  {
    slug: "kurukshetra",
    name: "Kurukshetra",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Clean power for Kurukshetra's homes, institutions and farms.",
    intro: [
      "Kurukshetra combines a university town, a busy pilgrimage centre and a large farming hinterland around Pehowa, Shahabad and Ladwa. Institutions, dharamshalas and hostels here have big daytime loads and wide roofs.",
      "For homes in Thanesar and the sectors, a 2–3 kW on-grid system is the most common choice. Farmers in the district often combine a rooftop system at home with a solar pump in the field.",
    ],
    sunshine: "Kurukshetra averages about 4.0–4.1 units per kW per day.",
    localities: ["Thanesar", "Sector 7", "Sector 13", "Pipli", "Pehowa", "Shahabad", "Ladwa"],
    customers: ["Independent houses", "Institutions and hostels", "Dharamshalas and guest houses", "Farms"],
    typicalBill: 2800,
    lat: 29.9695,
    lng: 76.8783,
    faqs: [
      {
        q: "Can institutions and hostels in Kurukshetra use solar?",
        a: "Yes. Their daytime loads — lighting, fans, water heating and pumps — suit rooftop solar well. We size systems to the building's actual bills and roof space.",
      },
      {
        q: "Can I have rooftop solar at home and a solar pump on my farm?",
        a: "Yes. They are separate systems on separate connections. Many farming families in the district install both.",
      },
    ],
  },
  {
    slug: "bhiwani",
    name: "Bhiwani",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "Bhiwani's strong sun and open roofs — a natural fit for solar.",
    intro: [
      "Bhiwani sits on the edge of Haryana's drier south-west, with long sunny days and relatively little shading from tall buildings. Most houses have open terraces, which makes installation straightforward and keeps costs down.",
      "Away from the city, farms around Tosham, Loharu and Siwani depend on groundwater, so solar pumps are a practical way to cut diesel costs. As in Hisar, dust means regular panel cleaning matters.",
    ],
    sunshine: "Bhiwani typically sees around 4.4 units per kW per day — above the Haryana average.",
    localities: ["Hansi Gate", "Dadri Gate", "Vidya Nagar", "Sector 13", "Loharu", "Tosham", "Siwani"],
    customers: ["Independent houses", "Farms and tubewells", "Shops and small businesses", "Schools"],
    typicalBill: 2500,
    lat: 28.7975,
    lng: 76.1322,
    faqs: [
      {
        q: "How much will a 3 kW system generate in Bhiwani?",
        a: "Roughly 4,600–4,900 units a year, thanks to Bhiwani's strong sunshine. That covers a typical family's consumption of around 380–400 units a month.",
      },
      {
        q: "Can a solar pump replace a diesel pump in Bhiwani district?",
        a: "In most cases, yes. A correctly sized solar pump delivers water through the day with no fuel cost. We check your borewell depth and water requirement before recommending a size.",
      },
    ],
  },
  {
    slug: "jhajjar",
    name: "Jhajjar",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Solar for Jhajjar's homes, farms and roadside businesses.",
    intro: [
      "Jhajjar district is largely agricultural, with towns like Beri and Badli surrounded by farmland. Many households combine a home connection with a tubewell, and both can benefit from solar.",
      "In Jhajjar town, independent houses usually have plenty of shadow-free roof, so families can size systems to their full consumption rather than their roof limits. We serve the district from our Sonipat office.",
    ],
    sunshine: "Jhajjar averages about 4.2 units per kW per day.",
    localities: ["Jhajjar town", "Sector 6", "Beri", "Badli", "Matanhail", "Dulhera"],
    customers: ["Independent houses", "Farms and tubewells", "Dhabas and roadside businesses", "Schools"],
    typicalBill: 2500,
    lat: 28.6063,
    lng: 76.6565,
    faqs: [
      {
        q: "Is the PM Surya Ghar subsidy available in rural Jhajjar?",
        a: "Yes. The scheme applies to residential grid connections in villages as well as towns, as long as the connection is in the applicant's name. We register you on the national portal.",
      },
      {
        q: "How far does AKD Solar travel for installations in Jhajjar district?",
        a: "We cover the whole district, including Beri, Badli and Matanhail. Surveys are scheduled on regular route days from our Sonipat office.",
      },
    ],
  },
  {
    slug: "bahadurgarh",
    name: "Bahadurgarh",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Bahadurgarh's footwear and manufacturing hub, running on its own sunshine.",
    intro: [
      "Bahadurgarh, on Delhi's western border, has grown into a major footwear and light-manufacturing cluster around the Modern Industrial Estate and HSIIDC areas. Factory roofs here are large and loads are heaviest during the day — an ideal match for rooftop solar.",
      "Residential sectors have expanded alongside the metro line, with many families moving from Delhi. Although close to the capital, Bahadurgarh is in Jhajjar district and connections here are with UHBVN, not a Delhi DISCOM.",
    ],
    sunshine: "Bahadurgarh receives around 4.1 units per kW per day.",
    localities: ["Sector 6", "Sector 9", "Modern Industrial Estate (MIE)", "HSIIDC Industrial Area", "Line Par", "Jakhoda", "Sankhol"],
    customers: ["Footwear and manufacturing units", "Warehouses", "Independent houses", "Schools"],
    typicalBill: 3000,
    lat: 28.692,
    lng: 76.924,
    faqs: [
      {
        q: "Which electricity company handles Bahadurgarh — Delhi or Haryana?",
        a: "Haryana. Bahadurgarh is in Jhajjar district, so net-metering is handled by UHBVN even though the town borders Delhi.",
      },
      {
        q: "How big a solar plant can a footwear unit in MIE install?",
        a: "Typically up to its sanctioned load, limited by roof area. As a guide, every 1,000 sq ft of shadow-free roof fits about 10 kW.",
      },
    ],
  },
  {
    slug: "rewari",
    name: "Rewari",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "From Dharuhera to Bawal — solar for Rewari's homes and auto-component belt.",
    intro: [
      "The Rewari district includes the Dharuhera and Bawal industrial areas, home to many auto-component and manufacturing units on the Delhi–Jaipur corridor. These plants run long daytime shifts and have the roof space for large solar installations.",
      "In Rewari town, Model Town and the sector areas have independent houses with high summer cooling loads. The district's dry climate gives good generation, with dust cleaning the main maintenance task.",
    ],
    sunshine: "Rewari typically sees about 4.3 units per kW per day.",
    localities: ["Model Town", "Sector 3", "Sector 4", "Dharuhera", "Dharuhera Industrial Area", "Bawal", "Kosli"],
    customers: ["Auto-component manufacturers", "Warehouses on NH-48", "Independent houses", "Schools"],
    typicalBill: 3000,
    lat: 28.199,
    lng: 76.6194,
    faqs: [
      {
        q: "Can factories in Bawal and Dharuhera claim tax benefits on solar?",
        a: "Eligible businesses can generally claim accelerated depreciation on solar assets. Confirm the current rate and eligibility with your chartered accountant; we provide the invoices and asset details they need.",
      },
      {
        q: "Which DISCOM approves solar in Rewari?",
        a: "Dakshin Haryana Bijli Vitran Nigam (DHBVN). We file the net-metering application and coordinate the inspection.",
      },
    ],
  },
  {
    slug: "jind",
    name: "Jind",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Practical solar for Jind's homes, farms and market towns.",
    intro: [
      "Jind is a farming district at the centre of Haryana, with market towns like Safidon, Narwana and Julana serving the surrounding villages. Here, solar is most often about two things: cutting the home electricity bill and running irrigation without diesel.",
      "Houses in Urban Estate and the older city usually have open terraces, and we recommend simple on-grid systems with UHBVN net-metering for the fastest payback.",
    ],
    sunshine: "Jind averages roughly 4.1–4.2 units per kW per day.",
    localities: ["Urban Estate", "Patiala Chowk", "Rohtak Road", "Safidon", "Narwana", "Julana"],
    customers: ["Independent houses", "Farms and tubewells", "Grain-market traders", "Schools"],
    typicalBill: 2500,
    lat: 29.3159,
    lng: 76.3159,
    faqs: [
      {
        q: "What size solar system does a typical home in Jind need?",
        a: "Most families need 2–3 kW. A 2 kW system suits bills up to about ₹2,000 a month; 3 kW suits higher bills or homes with air-conditioners.",
      },
      {
        q: "Do you install in Safidon and Narwana?",
        a: "Yes. We cover the whole of Jind district, including Safidon, Narwana and Julana.",
      },
    ],
  },
  {
    slug: "kaithal",
    name: "Kaithal",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.UHBVN,
    heroLine: "Solar for Kaithal's homes, rice mills and grain markets.",
    intro: [
      "Kaithal is one of Haryana's main paddy districts, and rice mills, shellers and grain-handling businesses in and around the city have big seasonal loads. Rooftop solar on their sheds reduces costs right through the year, not just at harvest.",
      "For homes in the HUDA sectors and the old city, we recommend systems sized to the family's annual consumption, so summer surplus banked with UHBVN covers the lower-sun winter months.",
    ],
    sunshine: "Kaithal averages about 4.0–4.1 units per kW per day.",
    localities: ["Sector 18", "Sector 19", "Ambala Road", "Pundri", "Cheeka", "Kalayat"],
    customers: ["Rice mills and shellers", "Independent houses", "Grain-market businesses", "Farms"],
    typicalBill: 2800,
    lat: 29.8015,
    lng: 76.3998,
    faqs: [
      {
        q: "My rice mill only runs heavily in season — is solar still worth it?",
        a: "Usually yes, if net-metering or a suitable billing arrangement lets off-season generation offset your bills. We review your 12-month consumption before recommending a size.",
      },
      {
        q: "Do you serve Cheeka and Pundri?",
        a: "Yes. We serve the whole of Kaithal district, including Cheeka, Pundri and Kalayat.",
      },
    ],
  },
  {
    slug: "sirsa",
    name: "Sirsa",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "Sirsa's long sunny days give your solar panels a head start.",
    intro: [
      "Sirsa, in Haryana's far west, has some of the strongest sunshine in the state and a farming economy built on cotton and kinnow orchards. Solar pumps and farm systems are among our most common projects here.",
      "Homes in the HUDA sectors and in towns like Ellenabad and Dabwali generate more units per kW than most of Haryana, which shortens the payback period. Regular cleaning keeps that advantage.",
    ],
    sunshine: "Sirsa often sees around 4.5–4.7 units per kW per day — among the best yields in Haryana.",
    localities: ["HUDA Sector 20", "Sirsa city", "Ellenabad", "Dabwali", "Rania", "Kalanwali"],
    customers: ["Farms and kinnow orchards", "Independent houses", "Cotton ginning units", "Schools"],
    typicalBill: 2500,
    lat: 29.5349,
    lng: 75.028,
    faqs: [
      {
        q: "How fast does solar pay back in Sirsa?",
        a: "Often faster than elsewhere in Haryana, because of the higher yield. For a typical home with the PM Surya Ghar subsidy, payback is usually around 3 years.",
      },
      {
        q: "Can a solar pump run drip irrigation in a kinnow orchard?",
        a: "Yes. Solar pumps work well with drip and sprinkler systems. We size the pump to your water head and daily requirement.",
      },
    ],
  },
  {
    slug: "palwal",
    name: "Palwal",
    region: "Haryana",
    state: "Haryana",
    calcState: "haryana",
    discom: DISCOMS.DHBVN,
    heroLine: "Solar for Palwal's growing town and farmland along the expressways.",
    intro: [
      "Palwal is changing quickly, with expressway connectivity bringing warehouses and new housing to a district that has long been agricultural. That mix means we install everything here from 2 kW home systems to commercial rooftops.",
      "In Hodal and Hathin, farm connections and solar pumps are common requests. For homes in Palwal town, on-grid systems with DHBVN net-metering offer the quickest payback.",
    ],
    sunshine: "Palwal averages about 4.2 units per kW per day.",
    localities: ["Sector 2", "Camp Colony", "Agra Chowk", "Hodal", "Hathin", "Prithla"],
    customers: ["Independent houses", "Warehouses", "Farms and tubewells", "Schools"],
    typicalBill: 2800,
    lat: 28.1487,
    lng: 77.332,
    faqs: [
      {
        q: "Do you install solar in Hodal and Hathin?",
        a: "Yes. We cover all of Palwal district, including Hodal, Hathin and Prithla.",
      },
      {
        q: "Can a new warehouse near Palwal plan solar during construction?",
        a: "Yes, and it's the cheapest time to do it. We can advise on roof design, cable routes and structure loading before the roof goes up.",
      },
    ],
  },

  // ───────────────────────── Delhi NCR ─────────────────────────
  {
    slug: "delhi",
    name: "Delhi",
    region: "Delhi NCR",
    state: "Delhi",
    calcState: "delhi",
    discom: DISCOMS.DELHI,
    heroLine: "Builder floors, bungalows and RWAs — rooftop solar across Delhi's three DISCOM areas.",
    intro: [
      "Delhi's rooftops are a patchwork of builder floors, independent bungalows and RWA-managed blocks, and each comes with its own question of who controls the terrace. We help you sort that out first, then design a system that fits the space you actually have.",
      "Which company approves your net meter depends on where you live: BSES Rajdhani in the south and west, BSES Yamuna in the east and central areas, and Tata Power-DDL in the north and north-west. We handle the paperwork with all three.",
    ],
    sunshine: "Delhi averages about 4.0–4.2 units per kW per day — roughly 1,500 units per kW each year.",
    localities: ["Dwarka", "Rohini", "Pitampura", "Janakpuri", "Vasant Kunj", "Saket", "Mayur Vihar", "Laxmi Nagar", "Okhla Industrial Area", "Narela"],
    customers: ["Builder floors and bungalows", "RWAs and group housing", "Schools and hospitals", "Industrial units in Okhla and Narela"],
    typicalBill: 4500,
    lat: 28.6139,
    lng: 77.209,
    faqs: [
      {
        q: "Can a builder floor in Delhi install rooftop solar?",
        a: "Yes, if the terrace rights are clear. Usually the top-floor owner holds them; otherwise residents can agree to share the roof. Your DISCOM will need the consent documents.",
      },
      {
        q: "Does Delhi offer anything on top of the PM Surya Ghar subsidy?",
        // TODO: verify current Delhi Solar Policy incentives before publishing specific amounts.
        a: "Delhi's state solar policy has offered additional incentives for rooftop solar. Amounts change, so we confirm the current Delhi benefits during your survey and include them in your quote.",
      },
    ],
  },
  {
    slug: "noida",
    name: "Noida",
    region: "Delhi NCR",
    state: "Uttar Pradesh",
    calcState: "uttar-pradesh",
    discom: DISCOMS.PVVNL,
    heroLine: "Solar for Noida's villas, societies and IT offices.",
    intro: [
      "Noida's planned sectors mix independent villas, high-rise group housing and a large IT and electronics industry around Sectors 62 and 63 and Phase 2. Villas suit full rooftop systems, while societies typically use solar for common-area loads.",
      "Electricity in Noida is supplied by PVVNL, which handles net-metering applications. Because Noida is in Uttar Pradesh, the state's own solar rules apply alongside the central PM Surya Ghar scheme.",
    ],
    sunshine: "Noida averages around 4.0 units per kW per day.",
    localities: ["Sector 15", "Sector 18", "Sector 50", "Sector 62", "Sector 63", "Sector 75", "Sector 137", "Sector 150", "Phase 2"],
    customers: ["Villas and independent houses", "Group housing societies", "IT offices", "Electronics manufacturers"],
    typicalBill: 4500,
    lat: 28.5355,
    lng: 77.391,
    faqs: [
      {
        q: "Can a Noida high-rise society install solar?",
        a: "Yes. Societies usually install solar on the tower roofs to run lifts, pumps and common lighting. We prepare the proposal for the AOA and file the PVVNL application.",
      },
      {
        q: "Is there an Uttar Pradesh subsidy on top of PM Surya Ghar?",
        // TODO: verify the current UP state top-up subsidy amount before quoting a figure.
        a: "Uttar Pradesh has offered an additional state subsidy for residential rooftop solar. The amount and rules change, so we confirm what currently applies during your survey.",
      },
    ],
  },
  {
    slug: "greater-noida",
    name: "Greater Noida",
    region: "Delhi NCR",
    state: "Uttar Pradesh",
    calcState: "uttar-pradesh",
    discom: DISCOMS.NPCL,
    heroLine: "Wide sectors, big roofs and a private DISCOM — solar in Greater Noida.",
    intro: [
      "Greater Noida's Greek-letter sectors — Alpha, Beta, Gamma, Delta and beyond — have more independent plots and wider roads than most of NCR, so many homes have generous terraces. The Ecotech industrial areas and Knowledge Park institutions add large commercial roofs.",
      "Unlike Noida, Greater Noida is supplied by Noida Power Company Limited (NPCL), a private distribution company with its own net-metering process. We have worked through it and handle the application for you.",
    ],
    sunshine: "Greater Noida receives about 4.0 units per kW per day.",
    localities: ["Alpha 1", "Alpha 2", "Beta 2", "Gamma 1", "Delta", "Omicron", "Pari Chowk", "Knowledge Park", "Ecotech III"],
    customers: ["Independent houses", "Institutions in Knowledge Park", "Industrial units in Ecotech", "Group housing societies"],
    typicalBill: 4000,
    lat: 28.4744,
    lng: 77.504,
    faqs: [
      {
        q: "Who approves net-metering in Greater Noida?",
        a: "Noida Power Company Limited (NPCL). It is a private DISCOM with its own application process, which we handle end to end.",
      },
      {
        q: "Can colleges in Knowledge Park install large rooftop plants?",
        a: "Yes. Campus buildings often have large flat roofs and daytime loads that suit plants of 50 kW and above. We design around academic calendars to plan installation with minimal disruption.",
      },
    ],
  },
  {
    slug: "ghaziabad",
    name: "Ghaziabad",
    region: "Delhi NCR",
    state: "Uttar Pradesh",
    calcState: "uttar-pradesh",
    discom: DISCOMS.PVVNL,
    heroLine: "Solar for Ghaziabad's homes, societies and Sahibabad's industry.",
    intro: [
      "Ghaziabad stretches from the dense residential areas of Indirapuram, Vaishali and Vasundhara to the Sahibabad industrial area and Raj Nagar Extension's newer towers. Independent houses in Kavi Nagar and Raj Nagar are well suited to full rooftop systems.",
      "Sahibabad's factories have high daytime loads and large sheds, making them strong candidates for commercial solar. PVVNL handles net-metering across the city.",
    ],
    sunshine: "Ghaziabad averages about 4.0 units per kW per day.",
    localities: ["Indirapuram", "Vaishali", "Vasundhara", "Kaushambi", "Kavi Nagar", "Raj Nagar", "Raj Nagar Extension", "Crossings Republik", "Sahibabad Industrial Area"],
    customers: ["Independent houses", "Group housing societies", "Sahibabad industrial units", "Schools"],
    typicalBill: 4000,
    lat: 28.6692,
    lng: 77.4538,
    faqs: [
      {
        q: "Can factories in Sahibabad switch to rooftop solar?",
        a: "Yes. Most Sahibabad units have the roof area and daytime load for a rooftop plant. We size it from your PVVNL bills and sanctioned load.",
      },
      {
        q: "Can I install solar on my flat in an Indirapuram society?",
        a: "Individual flats usually can't, because the roof is common property. The society can install a shared system for common areas, which lowers everyone's maintenance charges.",
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

export function isOfficeCity(loc: Location, officeSlug: string) {
  return loc.slug === officeSlug;
}

/** Full FAQ list for a city: city-specific questions + common ones built from the city's own data */
export function cityFaqs(loc: Location): FAQ[] {
  // TODO: verify the current Haryana state top-up for low-income households (PM Surya Ghar) before adding figures.
  const stateNote =
    loc.state === "Haryana"
      ? " Haryana has also announced additional support for some low-income households; we check current eligibility during your survey."
      : "";
  return [
    ...loc.faqs,
    {
      q: `Which DISCOM handles solar net-metering in ${loc.name}?`,
      a: `${loc.discom.name}. ${loc.discom.note ?? ""} We apply for net-metering on your behalf, coordinate the inspection and get the bi-directional meter installed.`.replace(/\s+/g, " "),
    },
    {
      q: `How much subsidy can I get for rooftop solar in ${loc.name}?`,
      a: `Up to ₹78,000 under PM Surya Ghar for homes: ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW. It applies to residential connections and is credited to your bank account after commissioning.${stateNote}`,
    },
    {
      q: `How long does solar installation take in ${loc.name}?`,
      a: `About 7 days on the roof once materials are dispatched. Including survey, design, subsidy registration and ${loc.discom.short} net-metering, the full process usually takes 4–6 weeks.`,
    },
  ];
}
