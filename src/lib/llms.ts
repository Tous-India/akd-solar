import { faqs, services, subsidyTiers } from "./data";
import { cityFaqs, locations, locationsByRegion, regions } from "./locations";
import { posts } from "./blog";
import { absoluteUrl, fullAddress, site } from "./site";
import { formatINR } from "./format";

/** /llms.txt — a concise, factual Markdown summary for AI assistants. */
export function llmsTxt() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Key facts",
    `- Business: ${site.name} ("${site.tagline}"), rooftop solar design and installation company`,
    `- Office: ${fullAddress}`,
    `- Phone / WhatsApp: ${site.phone}`,
    `- Email: ${site.email}`,
    `- Website: ${site.url}`,
    `- Hours: ${site.hours.map((h) => `${h.days} ${h.time}`).join("; ")}`,
    `- Service area: ${locations.length} cities in ${regions.join(" and ")}`,
    `- Subsidy: PM Surya Ghar central subsidy for homes — ${subsidyTiers.map((t) => `${t.kw}: ${formatINR(t.amount)}`).join(", ")} (maximum ₹78,000)`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${s.short}`),
    "",
    "## Areas served",
    ...regions.map((r) => `- ${r}: ${locationsByRegion(r).map((l) => `[${l.name}](${absoluteUrl(`/solar-panel-installation/${l.slug}`)})`).join(", ")}`),
    "",
    "## Key pages",
    `- [Solar savings & subsidy calculator](${absoluteUrl("/calculator")})`,
    `- [Areas we serve](${absoluteUrl("/locations")})`,
    `- [About AKD Solar](${absoluteUrl("/about")})`,
    `- [Contact / free site survey](${absoluteUrl("/contact")})`,
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

/** /llms-full.txt — the same facts plus FAQs, per-city details and article answers. */
export function llmsFullTxt() {
  const out: string[] = [llmsTxt(), "", "---", "", "## Frequently asked questions", ""];
  for (const f of faqs) out.push(`### ${f.q}`, f.a, "");
  out.push("## Services in detail", "");
  for (const s of services) {
    out.push(`### ${s.title}`, `URL: ${absoluteUrl(`/services/${s.slug}`)}`, s.description, "", ...s.features.map((f) => `- ${f}`), "");
    for (const f of [s.quickAnswer, ...s.faqs]) out.push(`**${f.q}** ${f.a}`, "");
  }
  out.push("## Cities", "");
  for (const l of locations) {
    out.push(
      `### ${l.name} (${l.region})`,
      `URL: ${absoluteUrl(`/solar-panel-installation/${l.slug}`)}`,
      `- DISCOM: ${l.discom.name}`,
      `- Served from: ${l.slug === site.address.citySlug ? "our office in this city" : `our ${site.address.city} office`}`,
      `- Localities: ${l.localities.join(", ")}`,
      `- Generation: ${l.sunshine}`,
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
