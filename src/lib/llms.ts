import { haryanaTopUp, msme, pmFaqs, solutions, subsidyTable } from "./data";
import { cityFaqs, locations } from "./locations";
import { posts } from "./blog";
import { absoluteUrl, formatOffice, site } from "./site";
import { formatINR } from "./format";

/** /llms.txt — a concise, factual Markdown summary for AI assistants. */
export function llmsTxt() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Key facts",
    `- Legal name: ${site.legalName} (CIN ${site.cin}, GSTIN ${site.gstin})`,
    `- Founded: ${site.foundedYear}, Sonipat, Haryana. Authorised Havells dealer since ${site.havellsDealerSince}.`,
    `- Founder: ${site.founder.name} — ${site.founder.qualifications.join("; ")}; ${site.founder.experience}`,
    ...site.offices.map((o) => `- ${o.label}: ${formatOffice(o)}`),
    `- Phone / WhatsApp: ${site.phones.join(", ")}`,
    `- Email: ${site.email}`,
    `- Website: ${site.url}`,
    `- Track record: ${site.numbers.years} years, ${site.numbers.installations} on-grid installations, ${site.numbers.customers} solar customers; installation in as little as ${site.numbers.installDays} days`,
    `- Panels installed: ${site.brands.panels.join(", ")}. Inverters: ${site.brands.inverters.join(", ")}.`,
    `- Solar loans: residential ${site.loans.residential.rate} via ${site.loans.residential.banks.join(", ")}; industrial ${site.loans.industrial.rate}`,
    `- Areas served: ${locations.map((l) => l.name).join(", ")}`,
    "",
    "## PM Surya Ghar subsidy",
    ...subsidyTable.map((t) => `- ${t.kw}: ${formatINR(t.amount)} (central subsidy, capped at ₹78,000 for 3 kW and above)`),
    ...haryanaTopUp.map((t) => `- Haryana top-up, ${t.income}: ${formatINR(t.amount)} (announced June 2024; confirm current status with DHBVN/UHBVN)`),
    `- Scheme closes 31 March 2027. Portal: ${site.pmSuryaGharPortal}`,
    `- Details: ${absoluteUrl("/pm-surya-ghar-yojana")}`,
    "",
    "## Solar solutions",
    ...solutions.map((s) => `- [${s.title}](${absoluteUrl(`/solar-solutions/${s.slug}`)}): ${s.short}`),
    "",
    "## Areas served",
    ...locations.map((l) => `- [${l.name}](${absoluteUrl(`/solar-panel-installation/${l.slug}`)})`),
    "",
    "## Key pages",
    `- [Projects](${absoluteUrl("/projects")})`,
    `- [Solar calculator](${absoluteUrl("/calculator")})`,
    `- [About](${absoluteUrl("/about")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    "",
    "## Guides",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.quickAnswer.a}`),
    "",
    "## Optional",
    `- [Full content for LLMs](${absoluteUrl("/llms-full.txt")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ];
  return lines.join("\n");
}

/** /llms-full.txt — the same facts plus FAQs, solution and city details, and article answers. */
export function llmsFullTxt() {
  const out: string[] = [llmsTxt(), "", "---", "", "## PM Surya Ghar FAQ", ""];
  for (const f of pmFaqs) out.push(`### ${f.q}`, f.a, "");
  out.push("## Solar solutions in detail", "");
  for (const s of solutions) {
    out.push(`### ${s.title}`, `URL: ${absoluteUrl(`/solar-solutions/${s.slug}`)}`, s.intro, "", ...s.whatYouGet.map((w) => `- ${w}`), "");
    if (s.msme) out.push(`${msme.title}:`, ...msme.points.map((m) => `- ${m}`), msme.note, "");
    for (const f of s.faqs) out.push(`**${f.q}** ${f.a}`, "");
  }
  out.push("## Cities", "");
  for (const l of locations) {
    out.push(
      `### ${l.name}`,
      `URL: ${absoluteUrl(`/solar-panel-installation/${l.slug}`)}`,
      `- DISCOM: ${l.discom.name}`,
      `- Served from: our Sonipat offices`,
      `- Localities: ${l.localities.join(", ")}`,
      "",
      l.intro.join(" "),
      "",
    );
    for (const f of cityFaqs(l)) out.push(`**${f.q}** ${f.a}`, "");
  }
  out.push("## Guides", "");
  for (const p of posts) {
    out.push(`### ${p.title}`, `URL: ${absoluteUrl(`/blog/${p.slug}`)} — published ${p.date}`, "", `**${p.quickAnswer.q}** ${p.quickAnswer.a}`, "");
    for (const f of p.faqs) out.push(`**${f.q}** ${f.a}`, "");
  }
  return out.join("\n");
}
