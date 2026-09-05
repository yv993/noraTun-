import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeDetailView from "@/components/HomeDetailView";
import { brand, listings } from "@/lib/content";
import { abs } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

// every listing is known at build time — all seventeen are prerendered and an
// unknown id falls through to the real 404, not to an empty page
export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}
export const dynamicParams = false;

const find = (id: string) =>
  listings.find((l) => l.id === decodeURIComponent(id));

// only the facts the sheet gives — a home whose sheet draws no bed, or numbers
// too few rooms, is described without that figure, never with a made-up one
const facts = (l: (typeof listings)[number]) =>
  [
    l.bedrooms != null ? `${l.bedrooms} bed` : null,
    l.area != null ? `${l.area} m²` : null,
    l.terrace ? `${l.terrace} m² terrace` : null,
  ]
    .filter(Boolean)
    .join(", ");

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = find((await params).id);
  if (!l) return { title: "Home not found" };
  const f = facts(l);
  const title = `${l.name} — ${f ? `${f}, ` : ""}${l.place}`;
  const description = `${l.typology} in ${l.place}.${f ? ` ${f}.` : ""} ${l.note}.`;
  return {
    title,
    description,
    alternates: { canonical: abs(`/homes/${l.id}`) },
    openGraph: {
      title: `${title} — ${brand.full}`,
      description,
      url: abs(`/homes/${l.id}`),
    },
  };
}

export default async function HomePage({ params }: Params) {
  const l = find((await params).id);
  if (!l) notFound();

  // other homes in the same place, then anywhere, capped at three
  const nearby = [
    ...listings.filter((n) => n.id !== l.id && n.place === l.place),
    ...listings.filter((n) => n.id !== l.id && n.place !== l.place),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: l.name,
    identifier: l.code,
    url: abs(`/homes/${l.id}`),
    description: l.note,
    // the structured data carries exactly what the sheet gives, nothing more
    ...(l.bedrooms != null
      ? { numberOfRooms: l.bedrooms, numberOfBedrooms: l.bedrooms }
      : {}),
    ...(l.area != null
      ? { floorSize: { "@type": "QuantitativeValue", value: l.area, unitCode: "MTK" } }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: l.place,
      addressCountry: "AM",
    },
    accommodationCategory: l.typology,
    provider: {
      "@type": "RealEstateAgent",
      name: brand.full,
      telephone: brand.phone,
      url: abs("/"),
    },
  };

  return (
    <>
      <HomeDetailView listing={l} nearby={nearby} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
