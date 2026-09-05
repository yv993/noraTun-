import Image from "next/image";
import { amenities } from "@/lib/content";

// ============================================================================
// AMENITIES, the static band — one photograph with the six amenities listed
// over it. This is the layer EVERY visitor can have: phones, reduced motion,
// no JS. The scroll deck (AmenityScroll) and the tab slider (AmenitySlider)
// are presentations of these same six items for readers who can take them.
//
// Lifted out of HomeView so the one-pager and a home's own page show the same
// band from one source. The class names are unchanged, so the one-pager's
// existing scrub (zoom + veil) still binds to it.
// ============================================================================

export default function AmenityBand({ id }: { id?: string }) {
  return (
    <section className="n-amen" id={id} aria-label={amenities.title} data-dark>
      <figure className="n-amen__bg">
        <Image
          placeholder="blur"
          quality={65}
          src={amenities.img}
          alt={amenities.alt}
          fill
          sizes="100vw"
        />
      </figure>
      <div className="n-amen__intro">
        <span className="n-label">{amenities.kicker}</span>
        <h2>{amenities.title}</h2>
      </div>
      <div className="n-amen__list">
        {amenities.items.map((a) => (
          <div className="n-amen__item" key={a.label}>
            <h3>{a.label}</h3>
            <p>{a.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
