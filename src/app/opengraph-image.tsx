import { renderOg } from "@/lib/og";

export const alt = "Rooftop solar for Haryana & Delhi NCR — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "Rooftop solar in Sonipat & Delhi NCR", eyebrow: "AKD Solar · Since 2017" });
}
