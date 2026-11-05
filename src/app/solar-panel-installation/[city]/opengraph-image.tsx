import { renderOg } from "@/lib/og";
import { getLocation, locations } from "@/lib/locations";

export const alt = "Solar panel installation by AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = getLocation(city);
  return renderOg({ title: `Solar Panel Installation in ${loc?.name ?? "your city"}`, eyebrow: loc ? `${loc.region} · ${loc.discom.short}` : "AKD Solar" });
}
