import Image from "next/image";
import type { ProjectImage } from "@/lib/data";

type Props = { image: ProjectImage; caption: string; sizes: string; className?: string; aspect?: string };

/** A real project photo with a short caption ("6 kW · Residential · Sonipat") */
export function ProjectPhoto({ image, caption, sizes, className = "", aspect = "aspect-[4/3]" }: Props) {
  return (
    <figure className={`overflow-hidden rounded-card border border-line bg-white ${className}`}>
      <div className={`relative overflow-hidden ${aspect}`}>
        <Image src={image.src} alt={`Solar installation: ${caption}`} width={image.width} height={image.height} sizes={sizes} className="h-full w-full object-cover" />
      </div>
      <figcaption className="px-4 py-3 text-sm font-medium text-ink">{caption}</figcaption>
    </figure>
  );
}
