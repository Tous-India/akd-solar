import { renderOg } from "@/lib/og";

export const alt = "Solar projects across Haryana & Delhi NCR — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "Solar projects across Haryana & Delhi NCR", eyebrow: "Our work" });
}
