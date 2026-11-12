import { renderOg } from "@/lib/og";
import { getSolution, solutions } from "@/lib/data";

export const alt = "AKD Solar solution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  return renderOg({ title: s?.heading ?? "Solar solutions", eyebrow: "Sonipat & Delhi NCR" });
}
