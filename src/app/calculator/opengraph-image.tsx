import { renderOg } from "@/lib/og";

export const alt = "Solar savings & subsidy calculator — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "Solar savings & subsidy calculator", eyebrow: "Calculator" });
}
