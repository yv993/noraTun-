import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeDetailView from "@/components/HomeDetailView";
import { brand, homesPage, listings } from "@/lib/content";
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

// a search result is cut at ~160 characters; cut at a full stop so the last
// thing a reader sees is a finished sentence, not half of one
const clip = (s: string, max = 160) => {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return stop > 70 ? cut.slice(0, stop + 1) : `${cut.replace(/\s+\S*$/, "")}…`;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = find((await params).id);
  if (!l) return { title: "Home not found" };
  const f = facts(l);
  const title = `${l.name} — ${f ? `${f}, ` : ""}${l.place}`;
  const description = clip(
    `${l.typology} in ${l.place}.${f ? ` ${f}.` : ""} ${l.description}`,
  );
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

  // Six homes to show under "Similar options", in the order a buyer looking at
  // this one would want them: the same place at the same size first, then the
  // same place, then the same size anywhere, then the rest of the list.
  const rank = (n: (typeof listings)[number]) => {
    const place = n.place === l.place;
    const beds = n.bedrooms !== null && n.bedrooms === l.bedrooms;
    return place && beds ? 0 : place ? 1 : beds ? 2 : 3;
  };
  const similar = listings
    .filter((n) => n.id !== l.id)
    .sort((a, b) => rank(a) - rank(b) || a.code.localeCompare(b.code))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: l.name,
    identifier: l.code,
    url: abs(`/homes/${l.id}`),
    description: l.description,
    // the structured data carries exactly what the sheet gives, nothing more
    ...(l.bedrooms != null
      ? { numberOfRooms: l.bedrooms, numberOfBedrooms: l.bedrooms }
      : {}),
    ...(l.area != null
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: l.area,
            unitCode: "MTK",
          },
        }
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

  // the same trail the rail down the left margin shows
  const crumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: homesPage.detail.crumbs[0], item: abs("/") },
      { name: homesPage.detail.crumbs[1], item: abs("/homes") },
      { name: l.name, item: abs(`/homes/${l.id}`) },
    ].map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.name,
      item: x.item,
    })),
  };

  return (
    <>
      <HomeDetailView listing={l} similar={similar} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
    </>
  );
}
