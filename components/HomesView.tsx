"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloorPlan } from "@/components/ui/FloorPlan";
import { BotanicalCrestIcon } from "@/components/ui/BotanicalCrestIcon";
import { brand, footer, homesPage, listings, TYPOLOGIES, type Listing, type Typology } from "@/lib/content";

// ============================================================================
// /homes — the catalogue. Anatomy MEASURED off the reference's listing page
// at 1440x900 over CDP (2026-09-05); numbers below are what came back, not
// estimates.
//
//   PAGE GRID   outer 10 columns of 122.4px, 14.4px gutters, 43px page margin.
//               The card list occupies columns 2-10 → 1217px starting at
//               x=180. We keep the ratios: gutter 1vw, list inset one column.
//   CARD GRID   display:grid, three columns of 396px, column-gap 14.4px,
//               row-gap 14.4px. Row pitch 564px (550 card + 14.4 gap).
//   CARD        396 x 550, padding 43.2 top / 28.8 sides / 21.6 bottom.
//               The reference's card is transparent inside a technical
//               corner frame; the client screenshot puts it on white with a
//               soft radius, and that is what we build.
//   PLAN        338.4 x 338.4 square, object-fit contain (= card width less
//               the two 28.8 pads). We stack TWO of these per card.
//   TYPE        display face ambroise-francois-std → our Bodoni Moda
//               UI face  Maison Neue Extended     → our Montserrat
//               · typology header  8.1px / 700 / 2.592px tracking (0.32em) / uppercase
//               · completion+meta  8.1px / 400 / 2.592px tracking
//               · big headline    36px display / 400 / -0.288px (-0.008em) / lh 1.0
//               · sub line         9.9px / 700 / 0.4752px (0.048em) / lh 1.45
//               · H1             172.8px display / 400 / -4.1472px (-0.024em) / lh 0.87
//               Ink rgb(23,35,59). We keep NORATUN's wine ink instead.
//
//   NOT ON THE REFERENCE: the live /apartments page carries no filter bar —
//   the four controls below are built from the written brief and the client
//   screenshot, using the reference's measured 8.1px/0.32em label style.
// ============================================================================

const PLACES = ["Yerevan", "Dilijan", "Sevan"] as const;
type Place = (typeof PLACES)[number] | "all";
type Beds = "any" | "1" | "2" | "3plus";
type Sort = "relevant" | "smallest" | "largest";

function Card({ l }: { l: Listing }) {
  const label =
    `${l.name}, ${l.typology.toLowerCase()} in ${l.place} — ` +
    `${l.bedrooms} bedroom${l.bedrooms === 1 ? "" : "s"}, ${l.area} square metres` +
    (l.terrace ? `, ${l.terrace} square metre terrace` : "") +
    `. ${homesPage.statusLabel[l.status]}.`;
  return (
    <a className="hp-card" href={`/homes/${l.id}`} data-status={l.status} aria-label={label}>
      <span className="hp-card__head">
        <span className="hp-card__typo">{l.typology}</span>
        <span className="hp-card__completion">
          {homesPage.completionLabel}: {l.completion}
        </span>
      </span>

      <span className="hp-card__plans" aria-hidden="true">
        {l.levels.map((lv) => (
          <FloorPlan key={lv.caption} rooms={lv.rooms} caption={lv.caption} title={l.name} />
        ))}
      </span>

      <span className="hp-card__meta">
        <span>№ {l.code}</span>
        <span>Block {l.block}</span>
        <span>{l.floor}</span>
      </span>
      <span className="hp-card__big">
        {l.bedrooms} bed / {l.area} m<sup>2</sup>
      </span>
      {l.terrace > 0 && (
        <span className="hp-card__sub">
          + {l.terrace} m<sup>2</sup> {homesPage.terraceLabel}
        </span>
      )}
      <span className="hp-card__status">{homesPage.statusLabel[l.status]}</span>
    </a>
  );
}

export default function HomesView() {
  const root = useRef<HTMLDivElement | null>(null);
  const [place, setPlace] = useState<Place>("all");
  const [typology, setTypology] = useState<Typology | "all">("all");
  const [beds, setBeds] = useState<Beds>("any");
  const [sort, setSort] = useState<Sort>("relevant");

  const dirty = place !== "all" || typology !== "all" || beds !== "any" || sort !== "relevant";
  const reset = () => {
    setPlace("all");
    setTypology("all");
    setBeds("any");
    setSort("relevant");
  };

  const shown = useMemo(() => {
    const out = listings.filter(
      (l) =>
        (place === "all" || l.place === place) &&
        (typology === "all" || l.typology === typology) &&
        (beds === "any" || (beds === "3plus" ? l.bedrooms >= 3 : l.bedrooms === Number(beds))),
    );
    // "relevant" keeps the curated order; the other two sort by interior area
    if (sort === "smallest") return [...out].sort((a, b) => a.area - b.area);
    if (sort === "largest") return [...out].sort((a, b) => b.area - a.area);
    return out;
  }, [place, typology, beds, sort]);

  // photo tiles take grid slots after the 4th and 9th card
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

    // The place rail and the side panel stand down over the wine chapter —
    // legibility, not motion, so never PRM-gated. Read with a plain rect
    // check: immune to refresh order and to scroll restoration.
    const rail = el.querySelector<HTMLElement>(".hp-rail");
    const panel = el.querySelector<HTMLElement>(".hp-panel");
    const tail = el.querySelector<HTMLElement>(".hp-tail");
    let railRaf = 0;
    const railCheck = () => {
      railRaf = 0;
      if (!tail) return;
      const r = tail.getBoundingClientRect();
      const over = r.top < window.innerHeight * 0.7 && r.bottom > 0;
      rail?.toggleAttribute("data-off", over);
      panel?.toggleAttribute("data-off", over);
    };
    const onRailScroll = () => {
      if (!railRaf) railRaf = requestAnimationFrame(railCheck);
    };
    railCheck();
    window.addEventListener("scroll", onRailScroll, { passive: true });
    window.addEventListener("resize", onRailScroll, { passive: true });

    // ---- wide + motion only: the scrubbed, position-dependent work ---------
    mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>(".n-arch").forEach((band) => {
        gsap.fromTo(
          band,
          { "--dome": "50% 12vh" },
          { "--dome": "0% 0vh", ease: "none", scrollTrigger: { trigger: band, start: "top 96%", end: "top 22%", scrub: 1 } },
        );
      });
      // photo tiles + the tail photo drift ±15% (the reference's rate)
      el.querySelectorAll<HTMLElement>(".hp-tilewrap img, .hp-tail__fig img").forEach((im) => {
        gsap.fromTo(
          im,
          { yPercent: -15 },
          { yPercent: 15, ease: "none", scrollTrigger: { trigger: im.closest("figure"), start: "top bottom", end: "bottom top", scrub: 0.5 } },
        );
      });
      gsap.fromTo(".hp-flower", { yPercent: -10 }, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".hp-flower", start: "top 125%", end: "bottom -25%", scrub: 0.5 },
      });
    });

    // ---- all widths, motion allowed: in-flow arrivals ---------------------
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

    // this view mounts post-hydration and the filters change the page height,
    // which leaves every trigger below the grid measuring a stale document
    const rf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rf);
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

      {/* the list and the sticky panel share a two-column body, so the fixed
          place rail on the left keeps a lane of its own and the panel sticks
          beside the grid instead of floating over the opening copy */}
      <div className="hp-body">
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

        {/* three intro blocks, the reference's own device */}
        <div className="hp-intro" data-rise>
          {homesPage.intro.map((b) => (
            <div key={b.title}>
              <h2>{b.title}</h2>
              <p>{b.copy}</p>
            </div>
          ))}
        </div>

        <div className="hp-filter" data-rise>
          <div className="hp-filter__set" role="group" aria-labelledby="hp-typo-label">
            <span className="hp-filter__label" id="hp-typo-label">
              {homesPage.typologyLabel}
            </span>
            <div className="hp-filter__opts">
              <button type="button" className={typology === "all" ? "on" : ""} aria-pressed={typology === "all"} onClick={() => setTypology("all")}>
                {homesPage.allLabel}
              </button>
              {TYPOLOGIES.map((t) => (
                <button key={t} type="button" className={typology === t ? "on" : ""} aria-pressed={typology === t} onClick={() => setTypology(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="hp-filter__set" role="group" aria-labelledby="hp-beds-label">
            <span className="hp-filter__label" id="hp-beds-label">
              {homesPage.bedsLabel}
            </span>
            <div className="hp-filter__opts">
              {bedChoices.map((b) => (
                <button key={b.v} type="button" className={beds === b.v ? "on" : ""} aria-pressed={beds === b.v} onClick={() => setBeds(b.v)}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hp-filter__set" role="group" aria-labelledby="hp-sort-label">
            <span className="hp-filter__label" id="hp-sort-label">
              {homesPage.sortLabel}
            </span>
            <div className="hp-filter__opts">
              {homesPage.sortOptions.map((s) => (
                <button key={s.v} type="button" className={sort === s.v ? "on" : ""} aria-pressed={sort === s.v} onClick={() => setSort(s.v)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="hp-filter__reset" onClick={reset} disabled={!dirty}>
            {homesPage.resetLabel}
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
                    <Image placeholder="blur" src={homesPage.tiles[c.i].img} alt="" fill sizes="(max-width: 860px) 92vw, 28vw" />
                  </figure>
                </li>
              ),
            )}
          </ol>
        ) : (
          <p className="hp-empty">{homesPage.empty}</p>
        )}
      </section>

      <aside className="hp-panel" aria-label="Enquire">
        <p className="hp-panel__title">
          {homesPage.panel.title.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
        <button type="button" className="hp-panel__act" onClick={() => window.dispatchEvent(new Event("noratun:call"))}>
          {homesPage.panel.call}
        </button>
        <a className="hp-panel__act" href={`mailto:${brand.email}`}>
          {homesPage.panel.contact}
        </a>
      </aside>
      </div>

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

      {/* footer — the one-pager's anatomy */}
      <footer className="n-foot" data-dark>
        <div className="n-foot__in">
          <a className="n-foot__top" href="#main">
            {footer.toTop} ↑
          </a>
          <BotanicalCrestIcon className="n-foot__mark" />
          <a className="n-foot__phone" href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>
            {brand.phone}
          </a>
          <p className="n-foot__office">
            <span className="lbl">{footer.officeLabel}</span>
            {footer.office.map((l) => (
              <span className="ln" key={l}>
                {l}
              </span>
            ))}
          </p>
          <div className="n-foot__row">
            <div className="n-foot__col">
              <span className="strong">{brand.full}.</span>
              <span>
                © {brand.year} {footer.rights}
              </span>
              <span className="links">
                {footer.legal.map((l) => (
                  <a key={l.href} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </span>
            </div>
            <div className="n-foot__col is-r">
              <span>{footer.contactLabel}</span>
              <a className="strong" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
