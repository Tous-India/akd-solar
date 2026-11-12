import type { FAQ } from "./data";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "note"; text: string };

export type Post = {
  slug: string;
  title: string;
  /** <= 47 chars so "<title> | AKD Solar" stays under 60 */
  metaTitle: string;
  /** <= 155 chars */
  description: string;
  excerpt: string;
  date: string; // ISO
  updated?: string;
  author: { name: string; role: string };
  category: string;
  quickAnswer: FAQ;
  blocks: Block[];
  faqs: FAQ[];
  /** internal links shown at the end */
  related: { label: string; href: string }[];
};

const team = { name: "AKD Solar Engineering Team", role: "Solar design & installation" };

export const posts: Post[] = [
  {
    slug: "pm-surya-ghar-subsidy-haryana",
    title: "PM Surya Ghar subsidy in Haryana, explained",
    metaTitle: "PM Surya Ghar Subsidy in Haryana Explained",
    description:
      "How much PM Surya Ghar subsidy you get in Haryana, who is eligible, how to apply through UHBVN or DHBVN, and when the money reaches your bank.",
    excerpt: "Up to ₹78,000 for a 3 kW home system. Here is exactly who qualifies, how to apply and how long the money takes.",
    date: "2026-09-12",
    author: team,
    category: "Subsidy",
    quickAnswer: {
      q: "How much subsidy for a 3 kW solar system in Haryana?",
      a: "₹78,000 under PM Surya Ghar: ₹30,000 per kW for the first 2 kW plus ₹18,000 for the third kW. Systems larger than 3 kW still receive the ₹78,000 maximum.",
    },
    blocks: [
      { type: "p", text: "PM Surya Ghar: Muft Bijli Yojana is the central government scheme that pays part of the cost of a residential rooftop solar system. In Haryana it works through the two state distribution companies — UHBVN in the north and DHBVN in the south — and the subsidy is paid directly into your bank account after your system is commissioned." },
      { type: "h2", text: "How much is the subsidy?" },
      { type: "p", text: "The central subsidy is calculated on the solar capacity you install, up to a cap:" },
      {
        type: "table",
        caption: "PM Surya Ghar central subsidy for homes",
        head: ["System size", "Subsidy", "Suits monthly use of"],
        rows: [
          ["1 kW", "₹30,000", "Up to 150 units"],
          ["2 kW", "₹60,000", "150–300 units"],
          ["3 kW or more", "₹78,000 (maximum)", "300+ units"],
        ],
      },
      { type: "note", text: "Amounts follow current MNRE guidelines and can change. We confirm the figures that apply on the day you register." },
      { type: "h2", text: "Who is eligible in Haryana?" },
      {
        type: "ul",
        items: [
          "You own the house and have a suitable roof.",
          "The electricity connection is in your name with UHBVN or DHBVN.",
          "You have not received a rooftop solar subsidy before.",
          "The system is installed by a vendor registered on the national portal using approved (ALMM-listed) panels.",
        ],
      },
      { type: "h2", text: "Which DISCOM is mine — UHBVN or DHBVN?" },
      { type: "p", text: "Your bill shows it. As a guide, UHBVN serves northern districts such as Sonipat, Rohtak, Panipat, Karnal, Ambala, Yamunanagar, Kurukshetra, Kaithal, Jind and Jhajjar (including Bahadurgarh). DHBVN serves southern and western districts including Gurugram, Faridabad, Palwal, Rewari, Hisar, Bhiwani and Sirsa." },
      { type: "h2", text: "How do you apply?" },
      {
        type: "ol",
        items: [
          "Register on the PM Surya Ghar national portal with your state, DISCOM and consumer number.",
          "Apply for rooftop solar; your DISCOM checks technical feasibility.",
          "Once approved, a registered vendor installs the system.",
          "Submit the installation details and apply for net-metering.",
          "The DISCOM inspects the system and installs the net meter; a commissioning certificate is generated.",
          "Submit your bank details. The subsidy is released to your account.",
        ],
      },
      { type: "p", text: "AKD Solar handles every step of this for our customers, including follow-ups with UHBVN or DHBVN." },
      { type: "h2", text: "How long until the money arrives?" },
      { type: "p", text: "The subsidy is released after commissioning, typically within about 30 days of submitting your bank details, though timelines depend on portal processing." },
      { type: "h2", text: "Is there any extra Haryana state subsidy?" },
      { type: "p", text: "In June 2024 the Haryana Government announced an extra ₹50,000 for families with an annual income up to ₹1.8 lakh, and ₹20,000 for ₹1.8–3 lakh, on top of PM Surya Ghar. Confirm the current status with DHBVN or UHBVN — we check it for you during the site visit." },
    ],
    faqs: [
      { q: "Can I get the subsidy for a 5 kW system?", a: "Yes, but the subsidy stays at the ₹78,000 maximum. The extra capacity is paid for by you." },
      { q: "Is the subsidy available for commercial buildings?", a: "No. PM Surya Ghar is for residential connections, including group housing societies for common areas under the scheme's rules." },
      { q: "Can I get a loan for the rest of the cost?", a: "Yes. Banks offer collateral-free solar loans under the scheme; many families find the EMI is lower than the bill it replaces." },
    ],
    related: [
      { label: "PM Surya Ghar Yojana", href: "/pm-surya-ghar-yojana" },
      { label: "Net-metering with UHBVN and DHBVN", href: "/blog/net-metering-process-uhbvn-dhbvn" },
      { label: "Residential rooftop solar", href: "/solar-solutions/residential-rooftop" },
    ],
  },
  {
    slug: "3kw-solar-system-cost-delhi-ncr",
    title: "How much does a 3 kW solar system cost in Delhi NCR?",
    metaTitle: "3kW Solar System Cost in Delhi NCR (2026)",
    description:
      "A 3 kW on-grid solar system in Delhi NCR costs about ₹1.6–1.9 lakh before subsidy and roughly ₹0.9–1.1 lakh after. See the full cost breakdown and payback.",
    excerpt: "Price before and after subsidy, what's included, how much it generates and how quickly it pays for itself.",
    date: "2026-09-26",
    author: team,
    category: "Costs",
    quickAnswer: {
      q: "How much does a 3 kW solar system cost in Delhi NCR?",
      a: "About ₹1.6–1.9 lakh for a good-quality on-grid system before subsidy. After the ₹78,000 PM Surya Ghar subsidy, you typically pay ₹0.9–1.1 lakh.",
    },
    blocks: [
      { type: "p", text: "3 kW is the most popular home system size in Delhi NCR because it unlocks the full PM Surya Ghar subsidy and covers a typical family's consumption of around 350–400 units a month. Here is what it really costs, what you get for the money and when you get it back." },
      { type: "h2", text: "What's the price before and after subsidy?" },
      {
        type: "table",
        caption: "Indicative 3 kW on-grid system pricing (2026)",
        head: ["Item", "Typical amount"],
        rows: [
          ["System price (installed)", "₹1.6–1.9 lakh"],
          ["PM Surya Ghar subsidy", "– ₹78,000"],
          ["Your net cost", "≈ ₹0.9–1.1 lakh"],
        ],
      },
      { type: "note", text: "Prices vary with panel brand and technology (mono PERC vs TOPCon), inverter brand, structure height and roof type. Hybrid systems with batteries cost more." },
      { type: "h2", text: "What's included in the price?" },
      {
        type: "ul",
        items: [
          "Solar panels (usually 5–6 modules of 540–600 W)",
          "On-grid inverter with Wi-Fi monitoring",
          "Galvanised mounting structure",
          "DC and AC cables, junction boxes, surge protection and earthing",
          "Installation, net-meter application and subsidy paperwork",
        ],
      },
      { type: "h2", text: "How much electricity does it generate?" },
      { type: "p", text: "In Delhi NCR a 3 kW system produces roughly 4,300–4,600 units a year — about 360–380 units a month on average, more in summer and less in winter and monsoon." },
      { type: "h2", text: "How fast does it pay back?" },
      { type: "p", text: "At an average tariff of about ₹7 per unit, 4,400 units saves around ₹30,000 a year. With a net cost of roughly ₹1 lakh, payback is usually 3–4 years, and the panels keep producing for 25 years." },
      { type: "h2", text: "Is solar worth it in Delhi if my bill is already low?" },
      { type: "p", text: "Delhi households with low consumption already receive subsidised or free electricity under the state's scheme, so solar saves them less. Solar pays back fastest for homes regularly using 300+ units a month. Noida, Greater Noida and Ghaziabad follow Uttar Pradesh tariffs, and Gurugram and Faridabad follow Haryana tariffs." },
    ],
    faqs: [
      { q: "How much roof does a 3 kW system need?", a: "About 300 sq ft of shadow-free roof." },
      { q: "Can I pay in EMIs?", a: "Yes. Collateral-free bank loans are available for residential systems under PM Surya Ghar." },
      { q: "Is a cheaper system a good deal?", a: "Not always. Very low prices often mean thinner structures, unbranded cables or non-ALMM panels that don't qualify for subsidy. Ask for an itemised quote." },
    ],
    related: [
      { label: "Calculate your exact cost", href: "/calculator" },
      { label: "Solar in Delhi NCR", href: "/solar-panel-installation/delhi-ncr" },
      { label: "Solar in Gurugram", href: "/solar-panel-installation/gurugram" },
    ],
  },
  {
    slug: "on-grid-vs-off-grid-vs-hybrid-solar",
    title: "On-grid vs off-grid vs hybrid solar: which should you choose?",
    metaTitle: "On-grid vs Off-grid vs Hybrid Solar",
    description:
      "On-grid, off-grid and hybrid solar compared on cost, backup, subsidy and payback — with a simple guide to which suits your home or farm.",
    excerpt: "Three system types, one simple question: how reliable is your grid? A plain-English comparison.",
    date: "2026-10-08",
    author: team,
    category: "Guides",
    quickAnswer: {
      q: "Which is better: on-grid, off-grid or hybrid solar?",
      a: "On-grid is best for most homes with reliable power: it is cheapest and qualifies for subsidy. Hybrid is best if you face regular power cuts. Off-grid suits only sites with no grid connection.",
    },
    blocks: [
      { type: "p", text: "The three system types use the same panels. What changes is whether the system connects to the grid and whether it stores energy in batteries. That decides cost, backup and whether you can claim the PM Surya Ghar subsidy." },
      {
        type: "table",
        caption: "On-grid vs off-grid vs hybrid at a glance",
        head: ["", "On-grid", "Off-grid", "Hybrid"],
        rows: [
          ["Grid connection", "Yes", "No", "Yes"],
          ["Batteries", "No", "Yes", "Yes"],
          ["Works in a power cut", "No", "Yes", "Yes"],
          ["Net-metering", "Yes", "No", "Yes"],
          ["PM Surya Ghar subsidy", "Yes", "No", "Yes (panels only)"],
          ["Typical 3 kW cost", "₹1.6–1.9 L", "₹2.3–2.8 L", "₹2.4–3.0 L"],
          ["Payback", "3–5 years", "6–8 years", "5–7 years"],
        ],
      },
      { type: "h2", text: "What is an on-grid system?" },
      { type: "p", text: "An on-grid system feeds your home first and exports any surplus to the grid through a net meter. At night you draw power back. It has no batteries, so it is the cheapest option — but it switches off during a power cut for the safety of line workers." },
      { type: "h2", text: "What is an off-grid system?" },
      { type: "p", text: "An off-grid system stores energy in batteries and is not connected to the grid. It suits farmhouses or remote sites without a reliable connection, but batteries add cost and need replacing every several years." },
      { type: "h2", text: "What is a hybrid system?" },
      { type: "p", text: "A hybrid system connects to the grid and has batteries. You get net-metering and backup during outages. It costs more than on-grid, but for homes with frequent cuts it replaces a separate inverter-battery setup." },
      { type: "h2", text: "How do I choose?" },
      {
        type: "ul",
        items: [
          "Reliable grid, want the lowest bill → on-grid.",
          "Regular outages, need lights, fans and Wi-Fi to stay on → hybrid.",
          "No grid connection at the site → off-grid.",
          "Not sure? Start on-grid and add batteries later with a hybrid-ready inverter.",
        ],
      },
    ],
    faqs: [
      { q: "Can I convert on-grid to hybrid later?", a: "Yes, by adding a hybrid inverter and batteries. Choosing a hybrid-ready setup at the start makes this cheaper." },
      { q: "Do batteries get the subsidy?", a: "No. PM Surya Ghar subsidises solar panel capacity, not batteries." },
    ],
    related: [
      { label: "Residential rooftop solar", href: "/solar-solutions/residential-rooftop" },
      { label: "3 kW system cost in Delhi NCR", href: "/blog/3kw-solar-system-cost-delhi-ncr" },
      { label: "Savings calculator", href: "/calculator" },
    ],
  },
  {
    slug: "net-metering-process-uhbvn-dhbvn",
    title: "The net-metering process with UHBVN and DHBVN, step by step",
    metaTitle: "Net Metering with UHBVN & DHBVN: Step by Step",
    description:
      "How rooftop solar net-metering works in Haryana with UHBVN and DHBVN: application, documents, inspection, net meter installation and timelines.",
    excerpt: "From application to the new bi-directional meter — what happens, what you need and how long it takes in Haryana.",
    date: "2026-10-20",
    author: team,
    category: "Guides",
    quickAnswer: {
      q: "How long does net-metering take in Haryana?",
      a: "Usually 2–4 weeks after installation for UHBVN or DHBVN to inspect the system and fit the net meter, although timelines vary by sub-division and workload.",
    },
    blocks: [
      { type: "p", text: "Net-metering is what makes rooftop solar pay off: surplus daytime power goes to the grid as credit, and you use that credit at night. In Haryana, residential net-metering is applied for through the PM Surya Ghar portal and completed by your DISCOM — UHBVN in the north or DHBVN in the south." },
      { type: "h2", text: "What documents do I need?" },
      {
        type: "ul",
        items: [
          "Latest electricity bill (connection in the applicant's name)",
          "Aadhaar or other identity proof",
          "Proof of ownership of the property",
          "Bank account details and a cancelled cheque (for the subsidy)",
          "Photos of the installed system (we provide these)",
        ],
      },
      { type: "h2", text: "What are the steps?" },
      {
        type: "ol",
        items: [
          "Register on the PM Surya Ghar portal and select UHBVN or DHBVN.",
          "Submit the rooftop solar application; the DISCOM grants technical feasibility.",
          "Your registered vendor installs the system.",
          "Upload installation details and apply for the net meter.",
          "The DISCOM inspects the system and installs a bi-directional net meter.",
          "A commissioning certificate is issued; your credits start from the next billing cycle.",
        ],
      },
      { type: "h2", text: "How is my bill calculated after net-metering?" },
      { type: "p", text: "Your meter records units imported from the grid and units exported by your panels. You pay only for the net units, plus fixed charges and duties. Surplus credit is carried forward under the state's net-metering rules." },
      { type: "h2", text: "What commonly delays net-metering?" },
      {
        type: "ul",
        items: [
          "Name mismatch between the bill and ownership documents",
          "Sanctioned load lower than the proposed solar capacity",
          "Pending dues on the electricity account",
          "Missing earthing or safety equipment flagged during inspection",
        ],
      },
      { type: "p", text: "We check all of these before applying, which is the single biggest reason our customers' approvals move faster." },
    ],
    faqs: [
      { q: "Is there a fee for the net meter?", a: "DISCOMs may charge for the meter and testing. We tell you the applicable charges upfront in your quote." },
      { q: "Can I install solar before net-metering approval?", a: "You should wait for technical feasibility from the DISCOM before installing, so the system qualifies for subsidy." },
    ],
    related: [
      { label: "PM Surya Ghar subsidy in Haryana", href: "/blog/pm-surya-ghar-subsidy-haryana" },
      { label: "Solar in Sonipat (UHBVN)", href: "/solar-panel-installation/sonipat" },
      { label: "Solar in Gurugram (DHBVN)", href: "/solar-panel-installation/gurugram" },
    ],
  },
  {
    slug: "solar-for-factories-haryana",
    title: "Solar for factories in Haryana: costs, savings and how to get started",
    metaTitle: "Solar for Factories in Haryana: A Guide",
    description:
      "How Haryana factories cut power costs with rooftop solar: sizing, costs, payback, CAPEX vs RESCO models and a checklist before you start.",
    excerpt: "Daytime loads, big roofs and rising tariffs make solar one of the best investments a Haryana factory can make.",
    date: "2026-10-30",
    author: team,
    category: "Commercial",
    quickAnswer: {
      q: "Is rooftop solar worth it for factories in Haryana?",
      a: "Usually yes. Factories use most of their power in daylight, so a correctly sized rooftop plant typically pays back in about 3–4 years and keeps saving for 25 years.",
    },
    blocks: [
      { type: "p", text: "From the textile units of Panipat to the auto-component plants of Bawal and the footwear makers of Bahadurgarh, Haryana's factories share three things that suit solar: large roofs, daytime loads and commercial tariffs that are higher than residential ones." },
      { type: "h2", text: "How much does a factory solar plant cost?" },
      { type: "p", text: "Commercial rooftop plants typically cost around ₹42,000–₹48,000 per kW installed, depending on size, structure and components. Larger plants cost less per kW." },
      {
        type: "table",
        caption: "Indicative factory rooftop plants",
        head: ["Plant size", "Roof needed", "Units per year", "Indicative cost"],
        rows: [
          ["50 kW", "~5,000 sq ft", "~75,000", "₹22–24 lakh"],
          ["100 kW", "~10,000 sq ft", "~1,50,000", "₹42–46 lakh"],
          ["250 kW", "~25,000 sq ft", "~3,75,000", "₹1.0–1.1 crore"],
        ],
      },
      { type: "note", text: "Figures are indicative. Your quote depends on roof type, load profile, component choice and site conditions." },
      { type: "h2", text: "CAPEX or RESCO — which model is right?" },
      {
        type: "ul",
        items: [
          "CAPEX: you buy the plant, keep all the savings and may claim depreciation benefits. Best return over 25 years.",
          "RESCO: an investor owns the plant and sells you its power at a fixed rate below grid tariff. No upfront cost, smaller savings.",
        ],
      },
      { type: "h2", text: "What should you check before starting?" },
      {
        type: "ol",
        items: [
          "Collect 12 months of electricity bills to understand your load.",
          "Get a structural check of the roof — especially older metal sheds.",
          "Confirm your sanctioned load and the net-metering limits that apply.",
          "Plan fire-safety access paths and cable routing.",
          "Insist on string-level monitoring so faults are caught early.",
        ],
      },
      { type: "h2", text: "What about tax benefits?" },
      { type: "p", text: "Eligible businesses can generally claim accelerated depreciation on solar assets, which improves the return further. Confirm the current rate and your eligibility with your chartered accountant." },
    ],
    faqs: [
      { q: "Will solar stop working when the grid fails?", a: "A grid-tied plant shuts down during outages for safety. Factories that need backup can integrate solar with their DG set using the right controller." },
      { q: "How long does a 100 kW installation take?", a: "Typically 3–4 weeks on site, planned around your production shifts." },
    ],
    related: [
      { label: "Commercial & individual solar", href: "/solar-solutions/commercial-and-individual" },
      { label: "Solar in Panipat", href: "/solar-panel-installation/panipat" },
      { label: "PM Surya Ghar Yojana", href: "/pm-surya-ghar-yojana" },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function readingMinutes(post: Post) {
  const text = post.blocks
    .map((b) => {
      if (b.type === "ul" || b.type === "ol") return b.items.join(" ");
      if (b.type === "table") return [...b.head, ...b.rows.flat()].join(" ");
      return b.text;
    })
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
