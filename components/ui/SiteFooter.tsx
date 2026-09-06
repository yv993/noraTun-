"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { BotanicalCrestIcon } from "@/components/ui/BotanicalCrestIcon";
import { brand, footer } from "@/lib/content";

// ============================================================================
// THE FOOTER — one component for all three pages.
//
// It was three copies of the same markup, and they had already drifted: only
// the one-pager's arrived letter by letter and only its links carried real
// accessible names. /homes and /homes/[id] rendered the same words as flat
// text. This is the single source, so the next change lands everywhere.
//
// THE ARRIVAL. Each character sits in its own box and lifts into place in
// reading order when the band first comes into view. Three rules hold:
//   · an IntersectionObserver, not a ScrollTrigger — the trigger would be
//     built while the page is still short, measure its start line against
//     that, and fire the whole reveal during load, long before anyone has
//     reached the footer.
//   · opacity, never autoAlpha: autoAlpha parks visibility:hidden, which
//     takes all five footer links out of the accessibility tree until the
//     band reveals.
//   · the letters are decoration. Every link carries its own aria-label, so
//     a screen reader and Voice Control read "Privacy policy" rather than
//     "P R I V A C Y   P O L I C Y", and the split spans are aria-hidden.
// Under reduced motion, and with no JavaScript at all, the words are simply
// already there — nothing is ever parked in CSS.
// ============================================================================

/** A string as per-letter boxes, each word kept whole so a line can only
 *  break at a space. */
function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, wi) => (
        <Fragment key={`${w}-${wi}`}>
          {wi ? " " : ""}
          <span className="n-w">
            {w.split("").map((ch, i) => (
              <span className="n-l" key={i}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function SiteFooter({ id }: { id?: string }) {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = el.querySelectorAll<HTMLElement>(".n-l");
    if (!letters.length) return;

    const ctx = gsap.context(() => {
      gsap.set(letters, { opacity: 0, yPercent: 65 });
    }, el);

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        gsap.to(letters, {
          opacity: 1,
          yPercent: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.011,
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    // role, not element: a <footer> inside <main> is a generic element, so
    // without this the page has no contentinfo landmark at all
    <footer className="n-foot" id={id} role="contentinfo" data-dark ref={root}>
      <div className="n-foot__in">
        <a className="n-foot__top" href="#main" aria-label={footer.toTop}>
          <span aria-hidden="true">
            <Letters text={`${footer.toTop} ↑`} />
          </span>
        </a>
        <BotanicalCrestIcon className="n-foot__mark" />
        <a
          className="n-foot__phone"
          href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
          aria-label={brand.phone}
        >
          <span aria-hidden="true">
            <Letters text={brand.phone} />
          </span>
        </a>
        <p className="n-foot__office">
          <span className="lbl">
            <Letters text={footer.officeLabel} />
          </span>
          {footer.office.map((l) => (
            <span className="ln" key={l}>
              <Letters text={l} />
            </span>
          ))}
        </p>
        <div className="n-foot__row">
          <div className="n-foot__col">
            <span className="strong">
              <Letters text={`${brand.full}.`} />
            </span>
            <span>
              <Letters text={`© ${brand.year} ${footer.rights}`} />
            </span>
            <span className="links">
              {footer.legal.map((l) => (
                <a key={l.href} href={l.href} aria-label={l.label}>
                  <span aria-hidden="true">
                    <Letters text={l.label} />
                  </span>
                </a>
              ))}
            </span>
          </div>
          <div className="n-foot__col is-r">
            <span>
              <Letters text={footer.contactLabel} />
            </span>
            <a
              className="strong"
              href={`mailto:${brand.email}`}
              aria-label={brand.email}
            >
              <span aria-hidden="true">
                <Letters text={brand.email} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
