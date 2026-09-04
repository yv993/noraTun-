import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import HomesView from "@/components/HomesView";
import { brand, listings } from "@/lib/content";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Available homes",
  description:
    "The current NORATUN list: apartments in Yerevan, houses in Dilijan, lake houses at Sevan — bedrooms, areas and indicative plans, updated weekly.",
  alternates: { canonical: abs("/homes") },
  openGraph: {
    title: `Available homes — ${brand.full}`,
    description: "Apartments in Yerevan, houses in Dilijan, lake houses at Sevan — the list moves weekly.",
    url: abs("/homes"),
  },
};

export default function HomesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Available homes — ${brand.full}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${l.name} — ${l.kind}, ${l.place}`,
    })),
  };
  return (
    <>
      <Chrome />
      <HomesView />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
