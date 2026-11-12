/**
 * Homepage banner slider.
 * Desktop images: 1920×600 (16:5). Mobile images (<768px): 1080×1080 (1:1), optional —
 * without one, the desktop image is shown cropped to fill the square.
 * `href` is optional: when set, the whole banner links there.
 */
export type Banner = {
  desktop: string;
  mobile?: string;
  alt: string;
  href?: string;
};

// TODO: replace with final banners
export const banners: Banner[] = [
  {
    desktop: "/images/banners/banner-1.jpg",
    mobile: "/images/banners/banner-1-mobile.jpg",
    alt: "Up to ₹78,000 PM Surya Ghar subsidy — apply before 31 March 2027",
    href: "/pm-surya-ghar-yojana",
  },
  {
    desktop: "/images/banners/banner-2.jpg",
    mobile: "/images/banners/banner-2-mobile.jpg",
    alt: "493+ rooftops powered in Haryana by AKD Solar",
    href: "/projects",
  },
  {
    desktop: "/images/banners/banner-3.jpg",
    mobile: "/images/banners/banner-3-mobile.jpg",
    alt: "Rooftop solar installed in 3 days — free site visit in Sonipat and Delhi NCR",
    href: "/contact",
  },
];
