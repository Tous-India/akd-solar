import { renderOg } from "@/lib/og";

export const alt = "PM Surya Ghar Yojana — AKD Solar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({ title: "PM Surya Ghar subsidy for home solar", eyebrow: "Apply by 31 March 2027" });
}
