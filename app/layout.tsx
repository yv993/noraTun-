import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Bodoni_Moda,
  Montserrat,
  Pinyon_Script,
} from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import SmoothScroll from "@/components/SmoothScroll";
import { brand } from "@/lib/content";
import { abs, site } from "@/lib/site";

// The typographic set, exposed as CSS variables on <html>:
//   --font-bodoni      Bodoni Moda — the display didone (NORA TUN, headlines)
//   --font-pinyon      Pinyon Script — the small handwritten accents
//   --font-montserrat  Montserrat — the sans for the sky-to-estate hero
//   --font-grotesk     Archivo — the extended grotesk the rest of the site's
//                      labels and running lines were measured against
// globals.css maps these onto the site tokens (--font-display, --font-script,
// --font-sans, --font-body).
const grotesk = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-grotesk",
  display: "swap",
});
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // no italic: the 30 KB italic face was preloaded at High priority and no
  // rule in globals.css ever asks for it
  style: ["normal"],
  variable: "--font-bodoni",
  display: "swap",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: site.legalName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/opengraph-image.png"],
  },
  // The same gate app/robots.ts uses. It was hardcoded to index: true, which
  // contradicted robots.txt on every deployment that is not the configured
  // production origin: LIVE TODAY the page says `index, follow` while
  // /robots.txt says `Disallow: /`. A preview shipping "index me" in its HTML
  // is the half of that pair that can actually get a staging URL into the
  // index, since a crawler that already knows a URL may index it from the
  // meta tag alone.
  robots: site.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: site.themeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // .js before first paint gates motion-only CSS away from no-JS visitors
  const jsFlag = `document.documentElement.classList.add('js');`;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": abs("/#noratun"),
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    telephone: brand.phone,
    email: `mailto:${brand.email}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.office,
      addressLocality: site.city,
      addressCountry: site.country,
    },
    areaServed: ["Yerevan", "Dilijan", "Sevan", "Tsaghkadzor"],
  };

  return (
    <html
      lang={site.lang}
      className={`${grotesk.variable} ${bodoni.variable} ${pinyon.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body>
        <a href="#main" className="n-skip">
          Skip to content
        </a>
        <SmoothScroll />
        {/* the chrome is a banner OUTSIDE main: rendered inside it, "Skip to
            content" landed before the chrome and skipped nothing, and the page
            had no banner landmark at all */}
        <header>
          <Chrome />
        </header>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
