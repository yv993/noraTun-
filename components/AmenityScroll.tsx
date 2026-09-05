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
//   THE SLIDES   six photographs stacked in place. Scroll wipes each one UP
//                over the last (clip-path inset from the top) while its own
//                picture settles from a 12% drift — so the deck is driven by
//                the reader's scroll, never by a timer.
//   THE LIST     top right, the six names; the one on screen at full strength.
//   THE SAY      bottom left, the active amenity's line, set large.
//   THE ORB      a round call, over the picture.
//
// The deck runs over the first 240 of the section's 340svh; the last 100 hold
// the screen still while the next band's cream dome climbs over it.
//
// MOVED LAYER ONLY. This mounts only for wide screens with motion allowed —
// everyone else gets <AmenityBand/>, the same six amenities over the same
// photograph, in flow. Every note is in this DOM too (visually hidden in the
// list) so nothing is reachable only by scrolling.
// ============================================================================

// The share of the section the six slides run over. The rest is the hold, in
// which the next band's cream dome climbs over the still-sticky screen.
//
// BUDGET (measured at 900px tall, where the section is 3060 and its trigger
// runs 2160): the type band's foot sits at viewport y857, so the cream starts
// covering it at delta 1663. The deck ends at 0.65 x 2160 = 1404, which leaves
// the sixth amenity ~490px of clear reading before anything reaches it. Raise
// this and the last slide is covered while it is still the active one.
const DECK = 0.65;
const WIPE = 0.4; // the share of a slide's window its wipe takes

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => v * v * (3 - 2 * v); // smoothstep

export default function AmenityScroll() {
  const root = useRef<HTMLElement | null>(null);
  const at = useRef(0);
  const [idx, setIdx] = useState(0);
  const items = amenities.items;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const slides = Array.from(
      el.querySelectorAll<HTMLElement>(".hd-amen__slide"),
    );
    const imgs = slides.map((s) => s.querySelector("img"));
    const n = slides.length;
    if (!n) return;

    // the last painted values, so a frame that changes nothing costs nothing
    const wasClip = new Array<number>(n).fill(-1);
    const wasY = new Array<number>(n).fill(-99);

    const paint = (i: number, e: number) => {
      const clip = Math.round((1 - e) * 1000) / 10;
      if (clip !== wasClip[i]) {
        slides[i].style.clipPath = `inset(${clip}% 0 0 0)`;
        wasClip[i] = clip;
      }
      const y = Math.round((12 - 12 * e) * 10) / 10;
      const im = imgs[i];
      if (im && y !== wasY[i]) {
        gsap.set(im, { yPercent: y });
        wasY[i] = y;
      }
    };

    const deck = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const q = Math.min(1, self.progress / DECK);
        const active = Math.min(n - 1, Math.floor(q * n));
        for (let i = 1; i < n; i++) paint(i, smooth(clamp01((q * n - i) / WIPE)));
        if (active !== at.current) {
          at.current = active;
          setIdx(active);
        }
      },
    });

    // the first picture settles as the section itself rises into view — by the
    // time the screen is holding, it is already at rest
    const first = imgs[0];
    const lead = first
      ? gsap.fromTo(
          first,
          { yPercent: 12 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
        )
      : null;

    // this mounts post-hydration and adds 340svh to the document
    const rf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(rf);
      lead?.scrollTrigger?.kill();
      lead?.kill();
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
        {items.map((a, i) => (
          <figure className="hd-amen__slide" key={a.label} data-i={i}>
            <Image
              placeholder="blur"
              quality={65}
              src={a.img}
              alt={a.alt}
              fill
              sizes="100vw"
            />
          </figure>
        ))}

        {/* All the type lives in one band at the foot of the screen, over a
            scrim strong enough to carry white at 4.5:1. MEASURED (2026-09-05):
            our amenity photographs are bright interiors — white type over the
            open picture came back at 1.0–1.9:1, so the reference's floating
            top-right list could not be kept where it puts it. */}
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
