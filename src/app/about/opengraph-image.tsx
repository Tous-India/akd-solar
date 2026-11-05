import { renderOg } from "@/lib/og";

export const alt = "About AKD Solar — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "About AKD Solar", eyebrow: "Our story" });
}
