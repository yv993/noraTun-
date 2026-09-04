"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { eOut } from "@/lib/eases";
import { amenities } from "@/lib/content";

// ============================================================================
// AMENITIES — the reference's screen (its rail 58), rebuilt as one picture
// with a key.
//
//   THE PICTURE   the grounds at dusk, full bleed, untinted.
//   THE KEY       top right, the amenities stacked in the condensed didone,
//                 the active one solid and the rest faded, a hairline beside
//                 the active one that slides as the choice changes; under
//                 the list, the active amenity's one-line note.
//   THE LABEL     on the photograph, a dot at each amenity's place; the
//                 active one carries its name, so the list reads as a key to
//                 the picture rather than a set of slides.
//   THE LINE      bottom left, the statement set large in the same didone,
//                 its first line hung in.
//   THE CALL      a round hairline call-to-action over the pool.
//
// Tabs, the dots and the arrow keys change the active amenity. MOVED layer
// only — phones, PRM and no-JS keep the static band above, which lists the
// same six amenities over the same photograph.
// ============================================================================

const MOTION = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";

export default function AmenitySlider() {
  const root = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);
  const [idx, setIdx] = useState(0);
  const items = amenities.items;

  useEffect(() => {
    const mq = window.matchMedia(MOTION);
    const upd = () => setLive(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  // the hairline sits beside the active tab and slides to the next
  useEffect(() => {
    if (!live) return;
    const tab = tabsRef.current?.querySelectorAll<HTMLElement>(".n-amsl__tab")[idx];
    const line = lineRef.current;
    if (!tab || !line) return;
    gsap.to(line, { top: tab.offsetTop, height: tab.offsetHeight, duration: 0.5, ease: eOut });
  }, [idx, live]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const n = e.key === "ArrowDown" ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
    setIdx(n);
    tabsRef.current?.querySelectorAll<HTMLElement>(".n-amsl__tab")[n]?.focus();
  };
  const call = () => window.dispatchEvent(new Event("noratun:call"));

  if (!live) return null;

  return (
    <section className="n-amsl" ref={root} aria-label={amenities.title} data-dark>
      {/* the screen holds for a second viewport of scroll while the next
          band's cream crown rises over it */}
      <div className="n-amsl__screen">
      <figure className="n-amsl__bg">
        <Image placeholder="blur" src={amenities.img} alt={amenities.alt} fill sizes="(max-width: 860px) 1px, 100vw" />
        {items.map((a, i) => (
          <button
            type="button"
            className="n-amsl__pin"
            key={a.label}
            style={{ left: a.x, top: a.y }}
            data-on={i === idx || undefined}
            onClick={() => setIdx(i)}
            aria-label={a.label}
            tabIndex={-1}
          >
            <i aria-hidden="true" />
            <span aria-hidden="true">{a.label}</span>
          </button>
        ))}
      </figure>

      <div
        className="n-amsl__tabs"
        role="tablist"
        aria-orientation="vertical"
        aria-label={amenities.title}
        ref={tabsRef}
        onKeyDown={onKey}
      >
        <span className="n-amsl__line" aria-hidden="true" ref={lineRef} />
        {items.map((a, i) => (
          <button
            type="button"
            role="tab"
            className="n-amsl__tab"
            key={a.label}
            aria-selected={i === idx}
            tabIndex={i === idx ? 0 : -1}
            onClick={() => setIdx(i)}
          >
            {a.label}
          </button>
        ))}
        <p className="n-amsl__note" key={idx} aria-live="polite">
          {items[idx].note}
        </p>
      </div>

      <p className="n-amsl__say">{amenities.statement}</p>

      <button type="button" className="n-amsl__orb" onClick={call}>
        {amenities.cta}
      </button>
      </div>
    </section>
  );
}
