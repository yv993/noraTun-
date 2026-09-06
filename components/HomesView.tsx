"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/HomeCard";
import SiteFooter from "@/components/ui/SiteFooter";
import { eInOut } from "@/lib/eases";
import {
  brand,
  homesPage,
  listings,
  TYPOLOGIES,
  type Listing,
  type Typology,
} from "@/lib/content";

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

export default function HomesView() {
  const root = useRef<HTMLDivElement | null>(null);
  const [place, setPlace] = useState<Place>("all");
  const [typology, setTypology] = useState<Typology | "all">("all");
  const [beds, setBeds] = useState<Beds>("any");
  const [sort, setSort] = useState<Sort>("relevant");

  const dirty =
    place !== "all" ||
    typology !== "all" ||
    beds !== "any" ||
    sort !== "relevant";
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
        (beds === "any" ||
          (beds === "3plus"
            ? (l.bedrooms ?? 0) >= 3
            : l.bedrooms === Number(beds))),
    );
    // "relevant" keeps the curated order; the other two sort by interior area.
    // A sheet that numbers too few rooms leaves area null — those sort last in
    // both directions rather than pretending to be 0 m².
    if (sort === "smallest")
      return [...out].sort(
        (a, b) => (a.area ?? Infinity) - (b.area ?? Infinity),
      );
    if (sort === "largest")
      return [...out].sort(
        (a, b) => (b.area ?? -Infinity) - (a.area ?? -Infinity),
      );
    return out;
  }, [place, typology, beds, sort]);

  // Per-chip counts, each computed against the OTHER axes. 38 of the 80
  // filter combinations returned nothing with no warning before this; a chip
  // that would empty the grid now says so and cannot be tapped.
  const countWith = (o: {
    place?: Place;
    typology?: Typology | "all";
    beds?: Beds;
  }) => {
    const P = o.place ?? place;
    const T = o.typology ?? typology;
    const B = o.beds ?? beds;
    return listings.filter(
      (l) =>
        (P === "all" || l.place === P) &&
        (T === "all" || l.typology === T) &&
        (B === "any" ||
          (B === "3plus" ? (l.bedrooms ?? 0) >= 3 : l.bedrooms === Number(B))),
    ).length;
  };

  // photo tiles take grid slots after the 4th, 9th and 14th card. Spliced
  // from the BACK so each index still refers to the unshifted array.
  const cells = useMemo(() => {
    const out: Array<
      { kind: "card"; l: Listing } | { kind: "tile"; i: number }
    > = shown.map((l) => ({ kind: "card", l }));
    if (out.length > 12) out.splice(12, 0, { kind: "tile", i: 2 });
    if (out.length > 8) out.splice(8, 0, { kind: "tile", i: 1 });
    if (out.length > 4) out.splice(4, 0, { kind: "tile", i: 0 });
    return out;
  }, [shown]);

  // A filter tap collapses the document (measured 12,975 -> 5,671px). The
  // browser clamps scrollY to the new height and the visitor lands in the
  // FOOTER with no cards on screen. After every filter commit, if they were
  // below the grid's top, put them back on the first card.
  const firstFilterRun = useRef(true);
  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    const grid = root.current?.querySelector<HTMLElement>(".hp-grid");
    if (!grid) return;
    const top = window.scrollY + grid.getBoundingClientRect().top - 76;
    if (window.scrollY > top) {
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (t: number, o?: object) => void };
        }
      ).__lenis;
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo(0, top);
    }
    // the grid's height just changed under every trigger below it
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(r);
  }, [place, typology, beds, sort]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // The place rail and the side panel stand down over the wine chapter —
    // legibility, not motion, so never PRM-gated. Read with a plain rect
    // check: immune to refresh order and to scroll restoration.
    const rail = el.querySelector<HTMLElement>(".hp-rail");
    // The row must open on ALL PLACES. Measured on the running page: the
    // container comes up already scrolled — 76px with none of the phone rules
    // applied, 245px (its maximum) with them, and the same with JS disabled,
    // so it is the browser's own initial scroll position, not our code. It is
    // also re-triggered when the display face swaps and the chips resize, so
    // this runs again on fonts.ready.
    const railHome = () => {
      if (rail && rail.scrollLeft !== 0) rail.scrollLeft = 0;
    };
    railHome();
    document.fonts?.ready.then(railHome).catch(() => {});
    const panel = el.querySelector<HTMLElement>(".hp-panel");
    const tail = el.querySelector<HTMLElement>(".hp-tail");
    let railRaf = 0;
    const grid = el.querySelector<HTMLElement>(".hp-grid");
    const railCheck = () => {
      railRaf = 0;
      // stand down over the wine tail, AND whenever the grid the rail filters
      // is not on screen at all — a place rail floating over the opening copy
      // or the footer only steals taps
      let over = false;
      if (tail) {
        const r = tail.getBoundingClientRect();
        over = r.top < window.innerHeight * 0.7 && r.bottom > 0;
      }
      if (!over && grid) {
        const g = grid.getBoundingClientRect();
        over = g.bottom < 40 || g.top > window.innerHeight - 40;
      }
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
    mm.add(
      "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
      () => {
        el.querySelectorAll<HTMLElement>(".n-arch").forEach((band) => {
          gsap.fromTo(
            band,
            { "--dome": "50% 12vh" },
            {
              "--dome": "0% 0vh",
              ease: "none",
              scrollTrigger: {
                trigger: band,
                start: "top 96%",
                end: "top 22%",
                scrub: 1,
              },
            },
          );
        });
        // photo tiles + the tail photo drift ±15% (the reference's rate)
        el.querySelectorAll<HTMLElement>(".hp-tilewrap img").forEach((im) => {
          gsap.fromTo(
            im,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: im.closest("figure"),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });
        gsap.fromTo(
          ".hp-flower",
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: ".hp-flower",
              start: "top 125%",
              end: "bottom -25%",
              scrub: 0.5,
            },
          },
        );

        // ---- the closing screen — the main page's rail 93, beat for beat:
        // the type climbs faster than the picture beneath it; then the
        // picture pulls back into a frame and the wine opens on all four
        // sides, and the type and the orb stand down so the wine carries on
        // alone into the footer.
        const hold = el.querySelector<HTMLElement>(".hp-tail__hold");
        if (hold) {
          const ttl = gsap.timeline({
            scrollTrigger: {
              trigger: hold,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          ttl
            .fromTo(
              ".hp-tail__fore",
              { yPercent: 10 },
              { yPercent: -32, ease: "none", duration: 1 },
              0,
            )
            .fromTo(
              ".hp-tail__bg img",
              { scale: 1.14 },
              { scale: 1, ease: "none", duration: 1 },
              0,
            )
            .fromTo(
              ".hp-tail__bg",
              { clipPath: "inset(0svh 0vw 0svh 0vw)" },
              {
                clipPath: "inset(11svh 15vw 11svh 15vw)",
                ease: eInOut,
                duration: 0.4,
              },
              0.55,
            )
            .to(
              ".hp-tail__orb",
              { autoAlpha: 0, ease: "none", duration: 0.12 },
              0.5,
            )
            .to(
              ".hp-tail__fore",
              { autoAlpha: 0, ease: "none", duration: 0.16 },
              0.6,
            )
            // the scrim is there for the type; it leaves with it, so the
            // framed picture is shown exactly as it was made
            .fromTo(
              ".hp-tail__screen",
              { "--scrim": 1 },
              { "--scrim": 0, ease: "none", duration: 0.2 },
              0.6,
            );
        }
      },
    );

    // ---- all widths, motion allowed: in-flow arrivals ---------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>(".hp-grid > li").forEach((n, i) => {
        gsap.from(n, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          delay: (i % 3) * 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: n,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
      el.querySelectorAll<HTMLElement>("[data-rise]").forEach((n) => {
        gsap.from(n, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: n,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      });

      // the title's letters — and the count's digits after them — rise one by
      // one out of their own clip boxes: the reference's split-char arrival.
      // Parked here at effect time, never in CSS, so a reader without motion
      // (or without JS) sees the word standing at rest.
      const chars = el.querySelectorAll<HTMLElement>(".hp-title__ch > span");
      if (chars.length) {
        gsap.set(chars, { yPercent: 112 });
        gsap.to(chars, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.1,
        });
      }
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
        {(
          [
            ["all", homesPage.placeAll],
            ...PLACES.map((p) => [p, p] as const),
          ] as ReadonlyArray<readonly [Place, string]>
        ).map(([v, lab]) => {
          const c = countWith({ place: v });
          return (
            <button
              key={v}
              type="button"
              className={place === v ? "on" : ""}
              aria-pressed={place === v}
              disabled={c === 0 && place !== v}
              onClick={() => setPlace(v)}
            >
              {lab}
              <i aria-hidden="true">{c}</i>
            </button>
          );
        })}
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
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <ellipse
                  cx="100"
                  cy="100"
                  rx="96"
                  ry="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <ellipse
                  cx="100"
                  cy="100"
                  rx="34"
                  ry="96"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <circle cx="100" cy="100" r="8" fill="currentColor" />
              </g>
            </svg>
          </div>

          {/* THE HEAD, THE REFERENCE'S WAY (client, 2026-09-05): the word alone,
              tall and light, the count of homes at the far right in the same
              face, and the filter row straight beneath — nothing in between.
              Each letter sits in its own clip box so the arrival below can
              lift it in on its own; the h1 keeps the whole word as its name,
              so a reader hears "Homes", not five letters. */}
          <div className="hp-head">
            <h1 className="hp-title" aria-label={homesPage.title}>
              <span className="hp-title__word" aria-hidden="true">
                {homesPage.title.split("").map((ch, i) => (
                  <span className="hp-title__ch" key={i}>
                    <span>{ch}</span>
                  </span>
                ))}
              </span>
            </h1>
            <p
              className="hp-title__count"
              aria-label={`${listings.length} ${homesPage.title.toLowerCase()}`}
            >
              <span aria-hidden="true">
                {String(listings.length)
                  .split("")
                  .map((ch, i) => (
                    <span className="hp-title__ch" key={i}>
                      <span>{ch}</span>
                    </span>
                  ))}
              </span>
            </p>
          </div>

          <div className="hp-filter" data-rise>
            <div
              className="hp-filter__set"
              role="group"
              aria-labelledby="hp-typo-label"
            >
              <span className="hp-filter__label" id="hp-typo-label">
                {homesPage.typologyLabel}
              </span>
              <div className="hp-filter__opts">
                {(
                  ["all", ...TYPOLOGIES] as ReadonlyArray<Typology | "all">
                ).map((t) => {
                  const c = countWith({ typology: t });
                  return (
                    <button
                      key={t}
                      type="button"
                      className={typology === t ? "on" : ""}
                      aria-pressed={typology === t}
                      disabled={c === 0 && typology !== t}
                      onClick={() => setTypology(t)}
                    >
                      {t === "all" ? homesPage.allLabel : t}
                      <i aria-hidden="true">{c}</i>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="hp-filter__set"
              role="group"
              aria-labelledby="hp-beds-label"
            >
              <span className="hp-filter__label" id="hp-beds-label">
                {homesPage.bedsLabel}
              </span>
              <div className="hp-filter__opts">
                {bedChoices.map((b) => {
                  const c = countWith({ beds: b.v });
                  return (
                    <button
                      key={b.v}
                      type="button"
                      className={beds === b.v ? "on" : ""}
                      aria-pressed={beds === b.v}
                      disabled={c === 0 && beds !== b.v}
                      onClick={() => setBeds(b.v)}
                    >
                      {b.label}
                      <i aria-hidden="true">{c}</i>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="hp-filter__set"
              role="group"
              aria-labelledby="hp-sort-label"
            >
              <span className="hp-filter__label" id="hp-sort-label">
                {homesPage.sortLabel}
              </span>
              <div className="hp-filter__opts">
                {homesPage.sortOptions.map((s) => (
                  <button
                    key={s.v}
                    type="button"
                    className={sort === s.v ? "on" : ""}
                    aria-pressed={sort === s.v}
                    onClick={() => setSort(s.v)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="hp-filter__reset"
              onClick={reset}
              disabled={!dirty}
            >
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
                  <li
                    key={`tile-${c.i}`}
                    className="hp-tilecell"
                    aria-hidden="true"
                  >
                    <figure className="hp-tilewrap">
                      <Image
                        placeholder="blur"
                        quality={65}
                        src={homesPage.tiles[c.i].img}
                        alt=""
                        fill
                        sizes="(max-width: 860px) 92vw, 28vw"
                      />
                    </figure>
                  </li>
                ),
              )}
            </ol>
          ) : (
            <p className="hp-empty">{homesPage.empty}</p>
          )}

          {/* the pitch and the three intro blocks: the reference keeps its
              head to the word and the count, so these follow the list */}
          <div className="hp-about">
            <p className="hp-sub" data-rise>
              {homesPage.sub}
            </p>
            <div className="hp-intro" data-rise>
              {homesPage.intro.map((b) => (
                <div key={b.title}>
                  <h2>{b.title}</h2>
                  <p>{b.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="hp-panel" aria-label="Enquire">
          <p className="hp-panel__title">
            {homesPage.panel.title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <button
            type="button"
            className="hp-panel__act"
            onClick={() => window.dispatchEvent(new Event("noratun:call"))}
          >
            {homesPage.panel.call}
          </button>
          <a className="hp-panel__act" href={`mailto:${brand.email}`}>
            {homesPage.panel.contact}
          </a>
        </aside>
      </div>

      {/* closing chapter */}
      {/* The closing band carries the same device as the main page's rail 93:
          the photograph fills the screen and the type climbs over it at its
          own rate, then the picture pulls back into a frame and the wine
          opens on all four sides, running on unbroken into the footer. */}
      <section className="n-arch hp-tail" data-dark>
        {/* the sticky screen needs travel to stick through: this holder is
            the two screens of scroll the frame closes across */}
        <div className="hp-tail__hold">
          <div className="hp-tail__screen">
            <figure className="hp-tail__bg">
              <Image
                placeholder="blur"
                quality={65}
                src={homesPage.tail.img}
                alt={homesPage.tail.alt}
                fill
                sizes="100vw"
              />
            </figure>
            <div className="hp-tail__fore">
              {/* the running line rides over the photograph with the rest of
                  the type — the band opens on the picture, with no wine
                  above it */}
              <p className="n-running">{homesPage.tail.running}</p>
              <h2>
                {homesPage.tail.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
                <em className="script">{homesPage.tail.script}</em>
                <span>{homesPage.tail.tailWord}</span>
              </h2>
              <p className="hp-tail__copy">{homesPage.tail.copy}</p>
            </div>
            <button
              type="button"
              className="hp-tail__orb"
              onClick={() => window.dispatchEvent(new Event("noratun:call"))}
            >
              {homesPage.tail.button}
            </button>
          </div>
        </div>
        <div className="hp-tail__row">
          <a className="hp-tail__back" href="/#collections">
            {homesPage.tail.back} <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
