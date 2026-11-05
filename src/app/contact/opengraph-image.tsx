import { renderOg } from "@/lib/og";

export const alt = "Book a free solar site survey — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "Book a free solar site survey", eyebrow: "Contact" });
}
