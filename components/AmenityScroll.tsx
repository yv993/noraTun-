"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { amenities } from "@/lib/content";

// ============================================================================
// AMENITIES, the scroll deck — the reference's second band on a home's page.
//
//   THE SCREEN   holds for the whole section: sticky, one viewport, dark.
//   THE PICTURE  ONE photograph — the grounds at dusk — drifting slowly across
//                the hold. It used to be six, one per amenity, but those were
//                bright interiors that had nothing to do with the line they
//                sat behind, and white type could not clear 4.5:1 over them.
//   THE LIST     the six names, the one on screen at full strength.
//   THE SAY      the active amenity's line, set large.
//   THE ORB      a round call, over the picture.
//
// The six advance over the first 65% of the section; the rest holds the screen
// still while the next band's cream dome climbs over it.
//
// MOVED LAYER ONLY. This mounts only for wide screens with motion allowed —
// everyone else gets <AmenityBand/>, the same six amenities over the same
// photograph, in flow. Every note is in this DOM too (visually hidden in the
// list) so nothing is reachable only by scrolling.
// ============================================================================

// The share of the section the six run over. The rest is the hold.
//
// BUDGET (measured at 900px tall, where the section is 3060 and its trigger
// runs 2160): the type band's foot sits at viewport y857, so the cream starts
// covering it at delta 1663. The deck ends at 0.65 x 2160 = 1404, which leaves
// the sixth amenity ~490px of clear reading before anything reaches it.
const DECK = 0.65;

export default function AmenityScroll() {
  const root = useRef<HTMLElement | null>(null);
  const at = useRef(0);
  const [idx, setIdx] = useState(0);
  const items = amenities.items;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const n = items.length;

    // which amenity is on screen
    const deck = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const q = Math.min(1, self.progress / DECK);
        const active = Math.min(n - 1, Math.floor(q * n));
        if (active !== at.current) {
          at.current = active;
          setIdx(active);
        }
      },
    });

    // the picture drifts across the whole hold, so a screen that does not
    // change its image is still visibly alive under the type
    const img = el.querySelector<HTMLElement>(".hd-amen__bg img");
    const drift = img
      ? gsap.fromTo(
          img,
          { scale: 1.08, yPercent: -1.5 },
          {
            scale: 1,
            yPercent: 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        )
      : null;

    // this mounts post-hydration and adds 340svh to the document
    const rf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(rf);
      drift?.scrollTrigger?.kill();
      drift?.kill();
      deck.kill();
    };
  }, [items.length]);

  const call = () => window.dispatchEvent(new Event("noratun:call"));

  return (
    <section
      className="hd-amen"
      ref={root}
      aria-label={amenities.title}
      data-dark
    >
      <div className="hd-amen__screen">
        <figure className="hd-amen__bg">
          <Image
            placeholder="blur"
            quality={65}
            src={amenities.img}
            alt={amenities.alt}
            fill
            sizes="100vw"
            priority={false}
          />
        </figure>

        {/* All the type lives in one band at the foot of the screen, over a
            scrim strong enough to carry white at 4.5:1. */}
        <div className="hd-amen__foot">
          <div className="hd-amen__say">
            <span className="lbl" aria-hidden="true">
              {items[idx].label}
            </span>
            <p key={idx} aria-hidden="true">
              {items[idx].note}
            </p>
          </div>

          <ol className="hd-amen__list">
            {items.map((a, i) => (
              <li key={a.label} data-on={i === idx || undefined}>
                {a.label}
                {/* every note is in the page for a reader who is not watching
                    the picture; the big line to the left repeats the active
                    one, and is hidden from the reading order because of it */}
                <span className="hd-sr">. {a.note}</span>
              </li>
            ))}
          </ol>

          <button type="button" className="n-amsl__orb is-187" onClick={call}>
            {amenities.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
