import { renderOg } from "@/lib/og";
import { getService, services } from "@/lib/data";

export const alt = "AKD Solar service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOg({ title: service?.title ?? "Solar services", eyebrow: "Haryana & Delhi NCR" });
}
