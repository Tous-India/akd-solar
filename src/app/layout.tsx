import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SubsidyStrip } from "@/components/subsidy/SubsidyStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/schema";
import { site } from "@/lib/site";

// Google Fonts, self-hosted and preloaded by next/font (no layout shift, no extra connection)
// Headings fall back to "Sora Tuned Fallback" (globals.css), width-matched per weight so the font swap causes no reflow
const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Sora Tuned Fallback", "system-ui", "sans-serif"],
});
const dmSans = DM_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Rooftop Solar in Sonipat & Delhi NCR`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "rooftop solar",
    "solar panel installation",
    "PM Surya Ghar subsidy",
    "solar company Sonipat",
    "Havells solar dealer Sonipat",
    "solar installation Haryana",
    "solar panels Delhi NCR",
    "housing society solar",
    "net metering UHBVN DHBVN",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.tagline}`, description: site.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FBF8F2",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${sora.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so intro elements can wait for GSAP (see globals.css) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM-friendly summary" />
      </head>
      <body className="min-h-dvh bg-cream font-sans text-ink antialiased">
        <JsonLd data={siteGraph()} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-navy px-5 py-3 font-semibold text-cream transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <SubsidyStrip />
        <Header />
        {/* Reserves the strip's height so the fixed strip never covers content */}
        <div aria-hidden className="h-[var(--strip-h)]" />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingActions />
        <SmoothScroll />
        <MotionProvider />
      </body>
    </html>
  );
}
