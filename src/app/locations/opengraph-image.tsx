import { renderOg } from "@/lib/og";

export const alt = "Areas we serve in Haryana & Delhi NCR — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "Areas we serve in Haryana & Delhi NCR", eyebrow: "Locations" });
}
