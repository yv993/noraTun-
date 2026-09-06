"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, contact } from "@/lib/content";
import SiteFooter from "@/components/ui/SiteFooter";

// ============================================================================
// CONTACT — the reference's contact screen, measured at 1440.
//
//   THE GROUND   its own pale-blue band, not the site's cream. The reference
//                uses rgb(181,206,219); this uses --lake (#afc8ce), which is
//                the same colour's place in THIS palette and already carries
//                wine ink in the call dialog.
//   THE TITLE    one word pair, centred, at 172.8/400/-0.024em/lh .87 — the
//                same setting as the home page's close, not a second scale.
//   THE COLUMNS  three of label-over-value. Labels 9.9/400/.048em, values the
//                same size at 700 — the weight IS the hierarchy, which is why
//                nothing here needs to get bigger to be read first.
//   THE MAP      full-bleed beneath, with one 8.1/700/.32em label on it.
//
// The address, phone and email are brand's own, so this page and the footer
// that repeats them cannot drift apart.
// ============================================================================

// The rail's three marks, drawn rather than fetched — an icon font or an SVG
// sprite for three glyphs would cost a request the page does not need.
function Glyph({ name }: { name: string }) {
  const p =
    name === "in"
      ? "M4.6 6.3H2.1V14h2.5V6.3ZM3.35 2A1.45 1.45 0 1 0 3.35 4.9 1.45 1.45 0 0 0 3.35 2ZM14 9.9c0-2.3-1.2-3.4-2.9-3.4-1.3 0-1.9.7-2.2 1.2V6.3H6.4c0 .7 0 7.7 0 7.7h2.5V9.7c0-.2 0-.4.1-.6.2-.4.6-.9 1.2-.9.9 0 1.3.7 1.3 1.7V14H14V9.9Z"
      : name === "fb"
        ? "M9.6 14V8.6h1.8l.3-2.1H9.6V5.2c0-.6.2-1 1-1h1.1V2.3A15 15 0 0 0 10.2 2C8.6 2 7.4 3 7.4 4.9v1.6H5.5v2.1h1.9V14h2.2Z"
        : "M8 3.4c1.5 0 1.7 0 2.3 0 .6 0 .9.1 1.1.2.3.1.5.3.7.5.2.2.3.4.5.7.1.2.2.5.2 1.1 0 .6 0 .8 0 2.3s0 1.7 0 2.3c0 .6-.1.9-.2 1.1-.1.3-.3.5-.5.7-.2.2-.4.3-.7.5-.2.1-.5.2-1.1.2-.6 0-.8 0-2.3 0s-1.7 0-2.3 0c-.6 0-.9-.1-1.1-.2-.3-.1-.5-.3-.7-.5-.2-.2-.3-.4-.5-.7-.1-.2-.2-.5-.2-1.1 0-.6 0-.8 0-2.3s0-1.7 0-2.3c0-.6.1-.9.2-1.1.1-.3.3-.5.5-.7.2-.2.4-.3.7-.5.2-.1.5-.2 1.1-.2.6 0 .8 0 2.3 0Zm0 3a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm0 4.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Zm3.3-4.4a.6.6 0 1 1-1.2 0 .6.6 0 0 1 1.2 0Z";
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d={p} fill="currentColor" />
    </svg>
  );
}

// the brand's four-point mark, at the size the reference sets its own seal on
// the plate
function Seal() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <path d="M20 4c2.6 6.6 4.4 10.2 8.4 12.6C24.4 19 22.6 22.6 20 29.2 17.4 22.6 15.6 19 11.6 16.6 15.6 14.2 17.4 10.6 20 4Z" />
        <path d="M20 36c-2.6-6.6-4.4-10.2-8.4-12.6C15.6 21 17.4 17.4 20 10.8c2.6 6.6 4.4 10.2 8.4 12.6C24.4 25.8 22.6 29.4 20 36Z" />
      </g>
    </svg>
  );
}

export default function ContactView() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // the title arrives letter by letter, the site's own arrival
      const letters = el.querySelectorAll<HTMLElement>(".n-ct__ch");
      if (letters.length)
        gsap.from(letters, {
          yPercent: 112,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
        });

      gsap.from(el.querySelectorAll<HTMLElement>(".n-ct__col"), {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.35,
      });

      // ---- THE MAP AND WHAT SITS ON IT ---------------------------------
      // Two rates, and the difference between them is the whole effect. The
      // drawing travels the full distance; the plate, the rail and the orb
      // travel a third of it, so they read as sitting ABOVE the map rather
      // than printed on it. Same trigger and same scrub for all of them, so
      // they cannot drift out of step — only the distance differs.
      //
      // The map is scaled over its box to begin with because a translate on
      // an object-fit: cover image otherwise walks its own edge into frame.
      const band = ".n-ct__map";
      const track = {
        trigger: band,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      } as const;

      // PIXELS, not yPercent. yPercent is a share of each element's OWN
      // height, so the same number moved the 760px map by 27px and the 46px
      // rail by 1.7px — MEASURED 6% of the map's travel where a third was
      // intended. Rates are only comparable in the same unit.
      const FAR = 28; // the drawing
      const NEAR = 9; // what sits over it: a third as far

      const map = el.querySelector<HTMLElement>(".n-ct__map img");
      if (map)
        gsap.fromTo(
          map,
          { scale: 1.1, y: -FAR },
          { scale: 1.02, y: FAR, ease: "none", scrollTrigger: track },
        );

      const slow = el.querySelectorAll<HTMLElement>("[data-slow]");
      if (slow.length)
        gsap.fromTo(
          slow,
          { y: -NEAR },
          { y: NEAR, ease: "none", scrollTrigger: track },
        );

      // the pins ride at the drawing's rate, because they label the drawing.
      // They cannot track it perfectly — the map scales as well as moves, and
      // scaling the labels with it would grow the type — so this matches the
      // translate and accepts a few pixels of drift from the scale.
      const pins = el.querySelectorAll<HTMLElement>(".n-ct__pinlbl");
      if (pins.length)
        gsap.fromTo(
          pins,
          { y: -FAR },
          { y: FAR, ease: "none", scrollTrigger: track },
        );

      // ---- THE COURTYARD -------------------------------------------------
      // the site's own photograph treatment: the slanted blade on arrival,
      // then a slow drift. Parked only if it is still below the reveal line,
      // so a trigger that never fires cannot leave it clipped to a sliver.
      const court = el.querySelector<HTMLElement>(".n-ct__court");
      const cimg = court?.querySelector<HTMLElement>("img");
      if (court && cimg) {
        gsap.fromTo(
          cimg,
          { scale: 1.12, yPercent: -2 },
          {
            scale: 1.04,
            yPercent: 2,
            ease: "none",
            scrollTrigger: {
              trigger: court,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
        if (court.getBoundingClientRect().top > window.innerHeight * 0.82) {
          const blade = { u: 1 };
          const paint = () => {
            const u = blade.u;
            cimg.style.clipPath = `polygon(${(100 * u).toFixed(3)}% 0%, 100% 0%, ${(100 + u).toFixed(3)}% 100%, ${(125 * u).toFixed(3)}% 100%)`;
          };
          paint();
          gsap.to(blade, {
            u: 0,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: court, start: "top 82%", once: true },
            onUpdate: paint,
            onComplete: () => {
              cimg.style.clipPath = "none";
            },
          });
        }
      }
    }, el);
    return () => ctx.revert();
  }, []);

  const call = () => window.dispatchEvent(new Event("noratun:call"));

  return (
    <div className="n-ct" ref={root}>
      <section className="n-ct__head" data-light>
        <p className="n-ct__crumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contact</span>
        </p>

        <h1 className="n-ct__title">
          {/* per-letter boxes so the title can rise out of its own clip, the
              same construction the home page's close uses */}
          <span className="n-ct__line" aria-hidden="true">
            {/* The word space has to sit OUTSIDE the word span. Put it inside
                and it renders as CONTACTUS: .n-ct__word is an inline-block,
                and a leading space inside one is trimmed. Same construction as
                the concept carousel's title, for the same reason. */}
            {contact.title.split(" ").map((word, wi) => (
              <Fragment key={word}>
                {wi ? " " : ""}
                <span className="n-ct__word">
                  {word.split("").map((ch, i) => (
                    <span className="n-ct__chbox" key={i}>
                      <span className="n-ct__ch">{ch}</span>
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
          <span className="n-sr">{contact.title}</span>
        </h1>

        <p className="n-ct__lead">{contact.lead}</p>

        <div className="n-ct__cols">
          {contact.columns.map((c) => (
            <div className="n-ct__col" key={c.label}>
              <h2 className="n-ct__lbl">{c.label}</h2>
              <ul className="n-ct__vals">
                {c.items.map((it) => (
                  <li key={it.text}>
                    {"href" in it && it.href ? (
                      <a href={it.href}>{it.text}</a>
                    ) : "call" in it && it.call ? (
                      <button type="button" onClick={call}>
                        {it.text}
                      </button>
                    ) : (
                      <span>{it.text}</span>
                    )}
                  </li>
                ))}
              </ul>
              {c.second ? (
                <>
                  <h2 className="n-ct__lbl n-ct__lbl--2">{c.second.label}</h2>
                  <ul className="n-ct__vals">
                    {c.second.items.map((it) => (
                      <li key={it.text}>
                        <span>{it.text}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ))}
        </div>

        <p className="n-ct__hours">{contact.hours}</p>
      </section>

      {/* The rail and the orb sit OUTSIDE the figure. The figure is a fixed
          aspect ratio with overflow: clip, so a child that goes static on a
          phone would be clipped by it rather than falling below it. This
          wrapper is what they are positioned against, and what they drop into
          when the plan gets too narrow to carry three things at once. */}
      <div className="n-ct__plan">
        <figure className="n-ct__map" data-light>
          {/* quality 75, not 72: next.config's images.qualities allowlist is
              [65, 75] and an unlisted value throws rather than rounding down.
              The map is line work on flat tint, so it wants the higher of the
              two — 65 stipples the hairline roads. */}
          <Image
            placeholder="blur"
            quality={75}
            src={contact.map.img}
            alt={contact.map.alt}
            fill
            sizes="100vw"
            priority
          />
          {/* the drawing's own labels — these ride WITH the map, because they
              name parts of it */}
          {contact.map.pins.map((p) => (
            <span
              className="n-ct__pinlbl"
              key={p.label.join(" ")}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-hidden="true"
            >
              <i />
              <b>
                {p.label.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </b>
            </span>
          ))}

          <figcaption className="n-ct__plate" data-slow>
            <span className="n-ct__plate__t">
              <b>{contact.map.plate.label}</b>
              <em>{contact.map.plate.hours}</em>
              <span className="n-sr">{brand.office}</span>
            </span>
            <Seal />
          </figcaption>
        </figure>

        {/* the two that move below the drawing on a phone */}
        <div className="n-ct__railwrap">
          {brand.social.length ? (
            <nav className="n-ct__rail" data-slow aria-label="NORATUN elsewhere">
              {brand.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Glyph name={s.icon} />
                </a>
              ))}
            </nav>
          ) : null}

          <button type="button" className="n-ct__orb" data-slow onClick={call}>
            {contact.map.orb.label.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </button>
        </div>
      </div>

      <figure className="n-ct__court" data-light>
        <Image
          placeholder="blur"
          quality={65}
          src={contact.court.img}
          alt={contact.court.alt}
          fill
          sizes="100vw"
        />
        <figcaption>{contact.court.caption}</figcaption>
      </figure>

      <SiteFooter id="call" />
    </div>
  );
}
