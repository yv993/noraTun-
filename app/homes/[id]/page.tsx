import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Chrome from "@/components/Chrome";
import HomeDetailView from "@/components/HomeDetailView";
import { brand, listings } from "@/lib/content";
import { abs } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

// every listing is known at build time — the twelve are prerendered and an
// unknown id falls through to the real 404, not to an empty page
export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}
export const dynamicParams = false;

const find = (id: string) => listings.find((l) => l.id === decodeURIComponent(id));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = find((await params).id);
  if (!l) return { title: "Home not found" };
  const title = `${l.name} — ${l.bedrooms} bed, ${l.area} m², ${l.place}`;
  const description = `${l.typology} in ${l.place}. ${l.bedrooms} bedroom${l.bedrooms === 1 ? "" : "s"}, ${l.area} m² interior${
    l.terrace ? `, ${l.terrace} m² terrace` : ""
  }. ${l.note}.`;
  return {
    title,
    description,
    alternates: { canonical: abs(`/homes/${l.id}`) },
    openGraph: { title: `${title} — ${brand.full}`, description, url: abs(`/homes/${l.id}`) },
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
    numberOfRooms: l.bedrooms,
    floorSize: { "@type": "QuantitativeValue", value: l.area, unitCode: "MTK" },
    address: { "@type": "PostalAddress", addressLocality: l.place, addressCountry: "AM" },
    accommodationCategory: l.typology,
    numberOfBedrooms: l.bedrooms,
    provider: { "@type": "RealEstateAgent", name: brand.full, telephone: brand.phone, url: abs("/") },
  };

  return (
    <>
      <Chrome />
      <HomeDetailView listing={l} nearby={nearby} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
