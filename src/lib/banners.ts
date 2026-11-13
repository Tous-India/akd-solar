/**
 * Homepage banner slider. The banners carry their own text and buttons; the slider shows the image only.
 * Desktop images: 1920×640 (3:1). Mobile images (<768px): 1200×800 (3:2), optional —
 * without one, the desktop image is shown cropped to fill.
 * `href` is optional: when set, the whole banner links there.
 * `fit: "contain"` (desktop only): show the whole image uncropped and centred in the 3:1 slot, with a soft sky-blue
 * gradient filling the sides. On mobile the image fills the 3:2 slot as usual.
 */
export type Banner = {
  desktop: string;
  mobile?: string;
  alt: string;
  href?: string;
  fit?: "cover" | "contain";
};

export const banners: Banner[] = [
  // TODO: replace with a 1920×640 desktop version (without PM photo/emblem) when ready
  {
    desktop: "/images/banners/banner-3-mobile.jpg",
    mobile: "/images/banners/banner-3-mobile.jpg",
    alt: "PM Surya Ghar Yojana — up to ₹78,000 subsidy for home rooftop solar: 2 kW ₹60,000, 3 kW, 5 kW and 10 kW ₹78,000. Apply by 31 March 2027",
    href: "/pm-surya-ghar-yojana",
    fit: "contain",
  },
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
