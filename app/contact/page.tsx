import type { Metadata } from "next";
import ContactView from "@/components/ContactView";
import { brand, contact, footer } from "@/lib/content";
import { abs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${site.name}: ${brand.phone}, ${brand.email}, or the sales office at ${brand.office}.`,
  alternates: { canonical: abs("/contact") },
  openGraph: {
    title: `Contact — ${brand.full}`,
    description: contact.lead,
    url: abs("/contact"),
  },
};

export default function ContactPage() {
  // Only what the page itself states. No opening hours in the schema that the
  // page does not print, and no geo the site has never measured.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: brand.full,
    url: abs("/contact"),
    telephone: brand.phone,
    email: brand.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: footer.office[0],
      addressLocality: "Yerevan",
      addressCountry: "AM",
    },
    areaServed: ["Yerevan", "Dilijan", "Sevan", "Tsaghkadzor"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactView />
    </>
  );
}
