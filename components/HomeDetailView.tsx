"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloorPlan } from "@/components/ui/FloorPlan";
import { BotanicalCrestIcon } from "@/components/ui/BotanicalCrestIcon";
import { Facts } from "@/components/HomesView";
import {
  brand,
  footer,
  homeGallery,
  homesPage,
  type Listing,
} from "@/lib/content";

// ============================================================================
// /homes/[id] — one home. The plans large, the full schedule, the finish, the
// neighbouring homes and a single call. Same drafting language as the card,
// drawn from the same room model, just given room to breathe.
// ============================================================================

export default function HomeDetailView({
  listing: l,
  nearby,
}: {
  listing: Listing;
  nearby: Listing[];
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const D = homesPage.detail;
  const gallery = homeGallery[l.place];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

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
        el.querySelectorAll<HTMLElement>(".hd-gal figure img").forEach((im) => {
          gsap.fromTo(
            im,
            { yPercent: -12 },
            {
              yPercent: 12,
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
      },
    );

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
    });

    // mounts post-hydration and changes the document height
    const rf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(rf);
      mm.revert();
    };
  }, [l.id]);

  const spec: Array<[string, string]> = [
    [D.spec.code, `№ ${l.code}`],
    [D.spec.typology, l.typology],
    [D.spec.place, l.place],
    [D.spec.block, l.block],
    [D.spec.floor, l.floor],
    [D.spec.bedrooms, l.bedrooms != null ? String(l.bedrooms) : D.spec.undrawn],
    [D.spec.area, l.area != null ? `${l.area} m²` : D.spec.unnumbered],
    ...(l.terrace
      ? ([[D.spec.terrace, `${l.terrace} m²`]] as Array<[string, string]>)
      : []),
    [D.spec.completion, l.completion],
    [D.spec.status, homesPage.statusLabel[l.status]],
  ];

  return (
    <div className="hd" ref={root}>
      <section className="hd-head" aria-label={l.name}>
        <a className="hd-back" href="/homes">
          ← {D.back}
        </a>
        <span className="hd-typo" data-rise>
          {l.typology}
        </span>
        <h1 className="hd-title" data-rise>
          {l.name}
        </h1>
        <p className="hd-meta" data-rise>
          <span>№ {l.code}</span>
          <span>Block {l.block}</span>
          <span>{l.floor}</span>
          <span>{l.place}</span>
        </p>
        <p className="hd-big" data-rise>
          <Facts l={l} />
          {l.terrace > 0 && (
            <em>
              + {l.terrace} m<sup>2</sup> {homesPage.terraceLabel.toLowerCase()}
            </em>
          )}
        </p>
        <p className="hd-note" data-rise>
          {l.note}
        </p>
      </section>

      <section className="hd-plans" aria-label={D.plansLabel}>
        <h2 className="hd-h2" data-rise>
          {D.plansLabel}
        </h2>
        <div className="hd-plans__grid">
          {l.levels.map((lv, i) => (
            <FloorPlan
              key={lv.caption}
              img={lv.img}
              alt={lv.alt}
              rooms={lv.rooms}
              caption={lv.caption}
              title={l.name}
              className="is-large"
              sizes="(max-width: 860px) calc(100vw - 40px), min(100vw - 120px, 1100px)"
              priority={i === 0}
            />
          ))}
        </div>
        <p className="hp-legend">{homesPage.legend}</p>
      </section>

      <section className="hd-spec" aria-label={D.specLabel}>
        <h2 className="hd-h2" data-rise>
          {D.specLabel}
        </h2>
        <dl className="hd-spec__list" data-rise>
          {spec.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="hd-gal" aria-label={D.galleryLabel}>
        <h2 className="hd-h2" data-rise>
          {D.galleryLabel}
        </h2>
        <div className="hd-gal__grid">
          {gallery.map((g) => (
            <figure key={g.alt} className="n-media">
              <Image
                placeholder="blur"
                quality={65}
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 860px) 92vw, 32vw"
              />
            </figure>
          ))}
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="hd-near" aria-label={D.nearbyLabel}>
          <h2 className="hd-h2" data-rise>
            {D.nearbyLabel}
          </h2>
          <ul className="hd-near__list">
            {nearby.map((n) => (
              <li key={n.id}>
                <a href={`/homes/${n.id}`}>
                  <span className="hd-near__plan" aria-hidden="true">
                    <FloorPlan
                      img={n.levels[0].img}
                      alt={n.levels[0].alt}
                      rooms={n.levels[0].rooms}
                      caption={n.levels[0].caption}
                      title={n.name}
                      sizes="(max-width: 860px) 90vw, 30vw"
                    />
                  </span>
                  <span className="hd-near__name">{n.name}</span>
                  <span className="hd-near__spec">
                    <Facts l={n} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="n-arch hd-cta" data-dark>
        <h2 data-rise>{D.callLabel}</h2>
        <p data-rise>{D.callCopy}</p>
        <button
          type="button"
          className="n-pill is-light"
          data-rise
          onClick={() => window.dispatchEvent(new Event("noratun:call"))}
        >
          {homesPage.panel.call} <span aria-hidden>→</span>
        </button>
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
