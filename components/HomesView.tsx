"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, footer, homesPage, listings, type Listing, type Room } from "@/lib/content";

// ============================================================================
// /homes — the catalog. Anatomy measured from the reference's listing page:
// giant didone title over a rotating stamp → working filter row → a 3-across
// grid of BLUEPRINT CARDS (technical corner-tick frame, square contain plan,
// spec rows with dot dividers, a big "M² · BD" line) with photo tiles mixed
// into the slots (±15% parallax, the reference's exact rate) → a closing wine
// chapter → footer. A vertical place rail sits fixed at the left (the
// reference's side index) — here it actually FILTERS by place.
// ============================================================================

const PLACES = ["Yerevan", "Dilijan", "Sevan"] as const;
type Place = (typeof PLACES)[number] | "all";
type Beds = "any" | "1" | "2" | "3plus";

// original indicative floor-plan, drawn from the listing's room rectangles
function Plan({ rooms, name }: { rooms: Room[]; name: string }) {
  const minX = Math.min(...rooms.map((r) => r.x));
  const minY = Math.min(...rooms.map((r) => r.y));
  const maxX = Math.max(...rooms.map((r) => r.x + r.w));
  const maxY = Math.max(...rooms.map((r) => r.y + r.h));
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Indicative plan of ${name}`}>
      {rooms.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="currentColor" strokeWidth="0.7" />
          {r.t && (
            <text x={r.x + r.w / 2} y={r.y + r.h / 2} fontSize="5.4" textAnchor="middle" dominantBaseline="central">
              {r.t}
            </text>
          )}
        </g>
      ))}
      <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

// the technical frame: corner ticks drawn on top of the hairline border
function Frame() {
  return (
    <span className="hp-frame" aria-hidden="true">
      <i className="c lt" />
      <i className="c rt" />
      <i className="c rb" />
      <i className="c lb" />
    </span>
  );
}

function Card({ l }: { l: Listing }) {
  const ask = () => window.dispatchEvent(new Event("noratun:call"));
  return (
    <button
      type="button"
      className="hp-card"
      data-status={l.status}
      onClick={ask}
      aria-label={`${homesPage.ask} ${l.name} — ${l.kind.toLowerCase()}, ${l.bedrooms} bedrooms, ${l.area} m², ${l.place}`}
    >
      <Frame />
      <span className="hp-card__kick">
        {l.name} · {l.place}
      </span>
      <span className="hp-card__status">{homesPage.statusLabel[l.status]}</span>
      <span className="hp-plan">
        <Plan rooms={l.plan} name={l.name} />
      </span>
      <span className="hp-card__specs">
        <span>{l.kind}</span>
        <i className="sep" />
        <span>{l.level}</span>
        <i className="sep" />
        <span>{l.id}</span>
      </span>
      <span className="hp-card__big">
        {l.area} m² · {l.bedrooms} bd
      </span>
      <span className="hp-card__note">{l.note}</span>
    </button>
  );
}

export default function HomesView() {
  const root = useRef<HTMLDivElement | null>(null);
  const [place, setPlace] = useState<Place>("all");
  const [beds, setBeds] = useState<Beds>("any");
  const [onlyAvail, setOnlyAvail] = useState(false);

  const shown = useMemo(
    () =>
      listings.filter(
        (l) =>
          (place === "all" || l.place === place) &&
          (beds === "any" || (beds === "3plus" ? l.bedrooms >= 3 : l.bedrooms === Number(beds))) &&
          (!onlyAvail || l.status === "available"),
      ),
    [place, beds, onlyAvail],
  );

  // photo tiles occupy card slots after the 4th and 9th shown card
  const cells = useMemo(() => {
    const out: Array<{ kind: "card"; l: Listing } | { kind: "tile"; i: number }> = shown.map((l) => ({ kind: "card", l }));
    if (out.length > 8) out.splice(8, 0, { kind: "tile", i: 1 });
    if (out.length > 4) out.splice(4, 0, { kind: "tile", i: 0 });
    return out;
  }, [shown]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // the place rail stands down once the wine chapter arrives — a class
    // flip for legibility, not motion, so it is not PRM-gated. A plain rect
    // check (not a trigger): immune to refresh order and scroll restoration.
    const rail = el.querySelector<HTMLElement>(".hp-rail");
    const tail = el.querySelector<HTMLElement>(".hp-tail");
    let railRaf = 0;
    const railCheck = () => {
      railRaf = 0;
      if (!rail || !tail) return;
      const r = tail.getBoundingClientRect();
      rail.toggleAttribute("data-off", r.top < window.innerHeight * 0.7 && r.bottom > 0);
    };
    const onRailScroll = () => {
      if (!railRaf) railRaf = requestAnimationFrame(railCheck);
    };
    railCheck();
    window.addEventListener("scroll", onRailScroll, { passive: true });
    window.addEventListener("resize", onRailScroll, { passive: true });

    mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
      // dome edges flatten as bands arrive (site signature)
      el.querySelectorAll<HTMLElement>(".n-arch").forEach((band) => {
        gsap.fromTo(
          band,
          { "--dome": "50% 12vh" },
          { "--dome": "0% 0vh", ease: "none", scrollTrigger: { trigger: band, start: "top 96%", end: "top 22%", scrub: 1 } },
        );
      });
      // photo tiles + tail photo drift ±15% (the reference's exact rate)
      el.querySelectorAll<HTMLElement>(".hp-tilewrap img, .hp-tail__fig img").forEach((im) => {
        gsap.fromTo(
          im,
          { yPercent: -15 },
          { yPercent: 15, ease: "none", scrollTrigger: { trigger: im.closest("figure"), start: "top bottom", end: "bottom top", scrub: 0.5 } },
        );
      });
      // the stamp behind the title drifts against the scroll
      gsap.fromTo(".hp-flower", { yPercent: -10 }, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".hp-flower", start: "top 125%", end: "bottom -25%", scrub: 0.5 },
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>(".hp-grid > li").forEach((n, i) => {
        gsap.from(n, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          delay: (i % 3) * 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 92%", toggleActions: "play none none none" },
        });
      });
      el.querySelectorAll<HTMLElement>("[data-rise]").forEach((n) => {
        gsap.from(n, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 86%", toggleActions: "play none none none" },
        });
      });
    });

    return () => {
      window.removeEventListener("scroll", onRailScroll);
      window.removeEventListener("resize", onRailScroll);
      if (railRaf) cancelAnimationFrame(railRaf);
      mm.revert();
    };
  }, [cells]);

  const bedChoices: Array<{ v: Beds; label: string }> = [
    { v: "any", label: homesPage.bedsAny },
    { v: "1", label: "1" },
    { v: "2", label: "2" },
    { v: "3plus", label: homesPage.beds3plus },
  ];

  return (
    <div className="hp" ref={root}>
      {/* the reference's fixed side index — here it filters by place */}
      <nav className="hp-rail" aria-label="Places">
        <button type="button" className={place === "all" ? "on" : ""} onClick={() => setPlace("all")}>
          {homesPage.placeAll}
        </button>
        {PLACES.map((p) => (
          <button key={p} type="button" className={place === p ? "on" : ""} onClick={() => setPlace(p)}>
            {p}
          </button>
        ))}
        <i className="hp-rail__rule" aria-hidden="true" />
        <span className="hp-rail__soon">{homesPage.soon}</span>
      </nav>

      <section className="hp-list" aria-label="Available homes">
        <div className="hp-flower n-flower is-page" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <g className="spin">
              <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.9" />
              <ellipse cx="100" cy="100" rx="96" ry="34" fill="none" stroke="currentColor" strokeWidth="0.9" />
              <ellipse cx="100" cy="100" rx="34" ry="96" fill="none" stroke="currentColor" strokeWidth="0.9" />
              <circle cx="100" cy="100" r="8" fill="currentColor" />
            </g>
          </svg>
        </div>

        <span className="n-label" data-rise>
          {homesPage.kicker}
        </span>
        <h1 className="hp-title" data-rise>
          {homesPage.title}
        </h1>
        <p className="hp-sub" data-rise>
          {homesPage.sub}
        </p>

        <div className="hp-filter" data-rise>
          <span className="hp-filter__label" id="hp-beds-label">
            {homesPage.bedsLabel}
          </span>
          <div className="hp-filter__group" role="group" aria-labelledby="hp-beds-label">
            {bedChoices.map((b) => (
              <button key={b.v} type="button" className={beds === b.v ? "on" : ""} aria-pressed={beds === b.v} onClick={() => setBeds(b.v)}>
                {b.label}
              </button>
            ))}
          </div>
          <i className="hp-filter__rule" aria-hidden="true" />
          <button type="button" className={onlyAvail ? "on" : ""} aria-pressed={onlyAvail} onClick={() => setOnlyAvail((v) => !v)}>
            {homesPage.onlyAvailable}
          </button>
        </div>
        <p className="hp-count" role="status">
          {homesPage.shown(shown.length, listings.length)}
        </p>
        <p className="hp-legend">{homesPage.legend}</p>

        {shown.length > 0 ? (
          <ol className="hp-grid">
            {cells.map((c) =>
              c.kind === "card" ? (
                <li key={c.l.id}>
                  <Card l={c.l} />
                </li>
              ) : (
                <li key={`tile-${c.i}`} className="hp-tilecell" aria-hidden="true">
                  <figure className="hp-tilewrap">
                    <Image
                      placeholder="blur"
                      src={homesPage.tiles[c.i].img}
                      alt=""
                      fill
                      sizes="(max-width: 860px) 92vw, 30vw"
                    />
                  </figure>
                </li>
              ),
            )}
          </ol>
        ) : (
          <p className="hp-empty">{homesPage.empty}</p>
        )}
      </section>

      {/* closing chapter */}
      <section className="n-arch hp-tail" data-dark>
        <p className="n-running" data-rise>
          {homesPage.tail.running}
        </p>
        <h2 data-rise>
          {homesPage.tail.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
          <em className="script">{homesPage.tail.script}</em>
          <span>{homesPage.tail.tailWord}</span>
        </h2>
        <p className="hp-tail__copy" data-rise>
          {homesPage.tail.copy}
        </p>
        <div className="hp-tail__row" data-rise>
          <button type="button" className="n-pill is-light" onClick={() => window.dispatchEvent(new Event("noratun:call"))}>
            {homesPage.tail.button} <span aria-hidden>→</span>
          </button>
          <a className="hp-tail__back" href="/#collections">
            {homesPage.tail.back} <span aria-hidden>→</span>
          </a>
        </div>
        <figure className="hp-tail__fig n-media" data-rise>
          <Image placeholder="blur" src={homesPage.tail.img} alt={homesPage.tail.alt} fill sizes="(max-width: 860px) 92vw, 76vw" />
        </figure>
      </section>

      {/* footer — same anatomy as the one-pager's */}
      <footer className="n-foot" data-dark>
        <div className="n-foot__in">
          <a className="n-foot__top" href="#main">
            {footer.toTop} ↑
          </a>
          <a className="n-foot__phone" href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>
            {brand.phone}
          </a>
          <p className="n-foot__office">
            <span>{footer.officeLabel}</span>
            {brand.office}
          </p>
          <div className="n-foot__row">
            <span>
              {brand.full} · {brand.year}. {brand.meaning}.
            </span>
            <span className="links">
              {footer.legal.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
