/**
 * Homepage banner slider. The banners carry their own text and buttons; the slider shows the image only.
 * Desktop images: 1920×640 (3:1). Mobile images (<768px): 1200×800 (3:2), optional —
 * without one, the desktop image is shown cropped to fill.
 * `href` is optional: when set, the whole banner links there.
 */
export type Banner = {
  desktop: string;
  mobile?: string;
  alt: string;
  href?: string;
};

export const banners: Banner[] = [
  {
    desktop: "/images/banners/banner-1.jpg",
    mobile: "/images/banners/banner-1-mobile.jpg",
    alt: "493+ rooftops powered in Haryana by AKD Solar — homes, shops, factories and farms",
    href: "/projects",
  },
  {
    desktop: "/images/banners/banner-2.jpg",
    mobile: "/images/banners/banner-2-mobile.jpg",
    alt: "Rooftop solar installed in 3 days — free site visit in Sonipat and Delhi NCR",
    href: "/contact",
  },
];
