import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import ClickSpark from "@/components/bits/ClickSpark";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import { Intro } from "@/components/motion/Intro";
import { MotionController } from "@/components/motion/MotionController";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#0e151d",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": `${site.url}/#business`,
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image.jpg`,
  logo: `${site.url}/icon.png`,
  telephone: site.phones[0].tel,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.landmark}`,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  contactPoint: site.phones.map((p) => ({
    "@type": "ContactPoint",
    telephone: p.tel,
    contactType: "customer service",
  })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: site.hours.days,
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [site.social.instagram.url, site.social.telegram.url],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: site.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.note ? `${s.title} (${s.note})` : s.title, url: `${site.url}/services/${s.slug}` },
    })),
  },
};

// Runs before first paint: opts into motion (unless reduced motion) so hidden
// initial states apply without a flash. If the app bundle never boots, the
// failsafe drops the class and the page shows statically.
const motionBoot = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!window.__lpcMotion){d.classList.remove('motion')}},6000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${barlow.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <div id="top" />
        <a
          href="#main"
          className="sr-only z-[200] rounded-card bg-copper-fill px-4 py-3 font-display uppercase tracking-[0.08em] text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ClickSpark
          sparkColor={["#fff1dc", "#ffb46a", "#ff8a2b", "#c38e6c"]}
          shape="streak"
          sparkCount={11}
          sparkRadius={38}
          sparkSize={12}
          sparkWidth={2}
          duration={560}
          gravity={0.7}
          glow={0.7}
          randomness={0.5}
        >
          <Intro />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ClickSpark>
        <MobileCallBar />
        <PageTransition />
        <LightboxProvider />
        <SmoothScroll />
        <MotionController />
      </body>
    </html>
  );
}
