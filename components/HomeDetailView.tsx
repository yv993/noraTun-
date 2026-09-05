"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloorPlan } from "@/components/ui/FloorPlan";
import { BotanicalCrestIcon } from "@/components/ui/BotanicalCrestIcon";
import { LevelStack } from "@/components/ui/LevelStack";
import { Letters, riseLetters } from "@/components/ui/Letters";
import { Card } from "@/components/ui/HomeCard";
import AmenityBand from "@/components/AmenityBand";
import AmenityScroll from "@/components/AmenityScroll";
import { under } from "@/lib/under";
import {
  brand,
  footer,
  homeGallery,
  homesPage,
  placeClose,
  type Listing,
} from "@/lib/content";

// ============================================================================
// /homes/[id] — one home.
//
// The anatomy is the reference's own apartment page, measured at 1440x900 and
// 390x844 (2026-09-05). Its five bands, in its order:
//
//   THE LOT       a sticky info panel beside a media column that scrolls
//                 through it: the code set huge, the plans, the schedule, the
//                 photographs on the left; the figures, the Info/Benefits
//                 tabs, the request pill and the sheet button on the right.
//                 Once the head has scrolled away the panel takes it up again.
//   THE AMENITIES a held screen the scroll drives through six pictures.
//   SIMILAR       the display heading over six of the catalogue's own cards.
//   THE CLOSE     a wine band over one photograph, drifting as it passes.
//   THE FOOTER    the site's, unchanged.
//
// Nothing is pinned — the reference pins nothing either; it is sticky CSS and
// scrubbed transforms, which leaves the page's own scrollbar honest.
//
// EVERY FACT COMES FROM THE SHEET. A home whose sheet draws no bed shows no
// bedroom figure; one whose sheet numbers too few rooms shows no area. The
// closing band is picked by place, so a town house never closes on a lake.
// ============================================================================

const DECK = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";
const TABS = ["info", "benefits"] as const;
type Tab = (typeof TABS)[number];

export default function HomeDetailView({
  listing: l,
  similar,
}: {
  listing: Listing;
  similar: Listing[];
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const rail = useRef<HTMLElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [deck, setDeck] = useState(false);
  const [tab, setTab] = useState<Tab>("info");

  const D = homesPage.detail;
  const gallery = homeGallery[l.place];
  const close = placeClose[l.place];
  const code = D.code(l.code);

  // The scroll deck is a MOVED LAYER: wide screens with motion allowed get it,
  // everyone else gets the static band. Rendering it (rather than hiding it)
  // is the only way a phone does not download six full-screen photographs.
  useEffect(() => {
    const mq = window.matchMedia(DECK);
    const upd = () => setDeck(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  // The breadcrumb rail is ink on cream down the whole lot section and white
  // once the amenities screen is under it. Legibility, not motion, so it is
  // deliberately not gated behind reduced-motion.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      el.classList.toggle("is-dark", under(el, ".hd-crumbs"));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [deck]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(DECK, () => {
      // the arch bands' dome opens as they arrive — the site's own signature
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

      // the panel takes up the head once the real one has scrolled away
      ScrollTrigger.create({
        trigger: ".hd-lot",
        start: "top -100px",
        end: "bottom bottom",
        toggleClass: { targets: ".hd-lot__late", className: "is-late" },
      });

      // the closing photograph drifts behind its type
      const bg = el.querySelector<HTMLElement>(".hd-close__bg img");
      if (bg)
        gsap.fromTo(
          bg,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".hd-close",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-rise]").forEach((n) => {
        gsap.from(n, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: n,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      // the code arrives letter by letter, as the catalogue's title does
      riseLetters(el.querySelector(".hd-code"), 0.1);
      // the two display headings below the fold wait for their own band
      (
        [
          [".hd-sim__title", "top 80%"],
          [".hd-close__title", "top 70%"],
        ] as const
      ).forEach(([sel, start]) => {
        const h = el.querySelector<HTMLElement>(sel);
        if (!h) return;
        ScrollTrigger.create({
          trigger: h,
          start,
          once: true,
          onEnter: () => riseLetters(h, 0),
        });
      });
    });

    // the deck mounts post-hydration and changes the document's height
    const rf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(rf);
      mm.revert();
    };
  }, [l.id, deck]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const i = TABS.indexOf(tab);
    const n =
      e.key === "ArrowRight"
        ? (i + 1) % TABS.length
        : e.key === "ArrowLeft"
          ? (i - 1 + TABS.length) % TABS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? TABS.length - 1
              : -1;
    if (n < 0) return;
    e.preventDefault();
    setTab(TABS[n]);
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [n]?.focus();
  };

  const ask = () =>
    window.dispatchEvent(
      new CustomEvent("noratun:call", {
        detail: { about: `${code} — ${l.name}` },
      }),
    );

  // the figures the sheet actually gives — one to four of them, never a zero
  // standing in for a fact nobody drew
  const cells: Array<[string, React.ReactNode]> = [
    ...(l.bedrooms !== null
      ? ([[D.spec.bedrooms, l.bedrooms]] as Array<[string, React.ReactNode]>)
      : []),
    ...(l.area !== null
      ? ([
          [
            D.spec.area,
            <>
              {l.area} m<sup>2</sup>
            </>,
          ],
        ] as Array<[string, React.ReactNode]>)
      : []),
    ...(l.terrace > 0
      ? ([
          [
            D.spec.terrace,
            <>
              {l.terrace} m<sup>2</sup>
            </>,
          ],
        ] as Array<[string, React.ReactNode]>)
      : []),
    ...(l.parking !== null
      ? ([[D.spec.parking, l.parking]] as Array<[string, React.ReactNode]>)
      : []),
  ];

  // the full schedule, under the drawings it describes. This is where a
  // missing figure SAYS why it is missing, rather than being left out.
  const schedule: Array<[string, string]> = [
    [D.spec.code, `№ ${l.code}`],
    [D.spec.typology, l.typology],
    [D.spec.place, l.place],
    [D.spec.block, l.block],
    [D.spec.floor, l.floor],
    [D.spec.bedrooms, l.bedrooms !== null ? String(l.bedrooms) : D.spec.undrawn],
    [D.spec.area, l.area !== null ? `${l.area} m²` : D.spec.unnumbered],
    ...(l.terrace > 0
      ? ([[D.spec.terrace, `${l.terrace} m²`]] as Array<[string, string]>)
      : []),
    ...(l.parking !== null
      ? ([[D.spec.parking, String(l.parking)]] as Array<[string, string]>)
      : []),
    [D.spec.completion, l.completion],
    [D.spec.status, homesPage.statusLabel[l.status]],
  ];

  const head = (late?: boolean) => (
    <header
      className={late ? "hd-lot__late" : "hd-lot__head"}
      aria-hidden={late || undefined}
    >
      {late ? (
        <p className="hd-code">{code}</p>
      ) : (
        <h1
          className="hd-code"
          id="hd-h1"
          aria-label={`${l.name}, number ${l.code}`}
        >
          <Letters text={code} />
        </h1>
      )}
      <p className="hd-name">{l.name}</p>
      {/* the panel's copy carries the identity only: it sits in a 57px lane
          under the fixed nav, and the typology line does not fit there */}
      {!late && (
        <p className="hd-line">
          <span>{l.typology}</span>
          <span>{l.place}</span>
          <span>
            {D.completion}: {l.completion}
          </span>
        </p>
      )}
    </header>
  );

  return (
    <div className="hd" ref={root} data-deck={deck || undefined}>
      {/* the reference's vertical crumb rail, down the left margin */}
      <nav className="hd-crumbs" aria-label="Breadcrumb" ref={rail}>
        <ol>
          <li>
            <a href="/">{D.crumbs[0]}</a>
          </li>
          <li>
            <a href="/homes">{D.crumbs[1]}</a>
          </li>
          <li aria-current="page">{l.code}</li>
        </ol>
      </nav>

      <section className="hd-lot" aria-labelledby="hd-h1">
        {/* the head is the section's own child, not the media column's: on a
            phone the column stacks UNDER the figures, and the identity has to
            come before them — nobody should meet "3 / 141 m²" without knowing
            whose they are */}
        {head()}

        <div className="hd-lot__media">
          {l.levels.map((lv, i) => (
            <FloorPlan
              key={lv.caption}
              img={lv.img}
              alt={lv.alt}
              rooms={lv.rooms}
              caption={lv.caption}
              title={l.name}
              className="is-lot"
              sizes="(max-width: 860px) calc(100vw - 2 * clamp(20px, 4vw, 64px)), min(48vw, 691px)"
              priority={i === 0}
            />
          ))}

          <div className="hd-sched">
            <h2 className="hd-lbl">{D.specLabel}</h2>
            <dl>
              {schedule.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="hp-legend">{homesPage.legend}</p>
          </div>

          <div className="hd-lot__gal">
            <h2 className="hd-lbl">{D.galleryLabel}</h2>
            <ul className="hd-lot__photos">
              {gallery.map((g) => (
                <li key={g.alt}>
                  <Image
                    placeholder="blur"
                    quality={65}
                    src={g.src}
                    alt={g.alt}
                    sizes="(max-width: 860px) 312px, min(53vw, 770px)"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="hd-lot__info">
          {head(true)}

          {cells.length > 0 && (
            <dl className="hd-cells" data-rise>
              {cells.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div
            className="hd-tabs"
            role="tablist"
            aria-label={l.name}
            ref={tabsRef}
            onKeyDown={onTabKey}
          >
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                id={`hd-tab-${t}`}
                aria-selected={tab === t}
                aria-controls={`hd-panel-${t}`}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
              >
                {D.tabs[t]}
              </button>
            ))}
          </div>

          <div className="hd-panels">
            <div
              className="hd-panel"
              id="hd-panel-info"
              role="tabpanel"
              aria-labelledby="hd-tab-info"
              hidden={tab !== "info"}
            >
              {/* with no JS the tabs cannot switch, so both panels show and
                  each says what it is; with JS the tab above is the label */}
              <h2 className="hd-panel__h">{D.tabs.info}</h2>
              <p className="hd-info">{l.description}</p>
            </div>
            <div
              className="hd-panel"
              id="hd-panel-benefits"
              role="tabpanel"
              aria-labelledby="hd-tab-benefits"
              hidden={tab !== "benefits"}
            >
              <h2 className="hd-panel__h">{D.tabs.benefits}</h2>
              <ul className="hd-benefits">
                {l.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <LevelStack levels={l.levels} label={D.levels} />

          <div className="hd-lot__actions" data-rise>
            <button type="button" className="hd-pill" onClick={ask}>
              {D.request}
            </button>
            {/* the reference's round PDF button. Ours opens the study sheet
                these plans were cut from — the drawing, not a brochure. */}
            <a
              className="hd-round"
              href={`/sheets/${l.sheet}.jpg`}
              target="_blank"
              rel="noopener"
              aria-label={D.sheetTitle(l.name)}
            >
              {D.sheet}
            </a>
          </div>
        </aside>
      </section>

      {deck ? <AmenityScroll /> : <AmenityBand />}

      <section className="n-arch hd-sim" aria-labelledby="hd-sim-h">
        <div className="hd-sim__head">
          <h2 className="hd-sim__title" id="hd-sim-h" aria-label={D.similar}>
            <Letters text={D.similar} />
          </h2>
          <i className="hd-sim__rule" aria-hidden="true" />
          <p className="hd-sim__sub">
            {D.similarSub.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        </div>
        <ul className="hd-sim__grid">
          {similar.map((s) => (
            <li key={s.id}>
              <Card l={s} />
            </li>
          ))}
        </ul>
        <a className="hd-pill is-centre" href="/homes">
          {D.viewAll}
        </a>
      </section>

      <section className="hd-close" aria-labelledby="hd-close-h" data-dark>
        <figure className="hd-close__bg">
          <Image
            placeholder="blur"
            quality={65}
            src={close.src}
            alt={close.alt}
            fill
            sizes="100vw"
          />
        </figure>
        <p className="hd-close__lead" data-rise>
          {homesPage.tail.running}
        </p>
        <h2
          className="hd-close__title"
          id="hd-close-h"
          aria-label={D.closeTitle.join(" ")}
        >
          {D.closeTitle.map((line) => (
            <span className="line" key={line}>
              <Letters text={line} />
            </span>
          ))}
        </h2>
        <p className="hd-close__sub" data-rise>
          {D.closeSub}
        </p>
        <a className="n-views__orb is-187" href="/homes">
          {D.closeCta}
        </a>
      </section>

      <footer className="n-foot" data-dark>
        <div className="n-foot__in">
          <a className="n-foot__top" href="#main">
            {footer.toTop} ↑
          </a>
          <BotanicalCrestIcon className="n-foot__mark" />
          <a
            className="n-foot__phone"
            href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
          >
            {brand.phone}
          </a>
          <p className="n-foot__office">
            <span className="lbl">{footer.officeLabel}</span>
            {footer.office.map((x) => (
              <span className="ln" key={x}>
                {x}
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
                {footer.legal.map((x) => (
                  <a key={x.href} href={x.href}>
                    {x.label}
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
