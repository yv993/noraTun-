"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EV, track } from "@/lib/analytics";
import { brand, callModal, chapters, nav, navCta } from "@/lib/content";
import type Lenis from "lenis";
import { under } from "@/lib/under";
import { BotanicalCrestIcon } from "@/components/ui/BotanicalCrestIcon";

/** Letters in their own boxes, each carrying its position, so a hover can
 *  run a wave through them and leave them exactly where they started. */
function Wave({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i}> </span>
        ) : (
          <span
            className="n-wv"
            key={i}
            style={{ "--i": n++ } as React.CSSProperties}
          >
            {ch}
          </span>
        ),
      )}
    </>
  );
}

/** Two stacked copies of a label in a one-line clip: a hover rolls the pair
 *  up so the twin takes the first one's place and the label reads unchanged. */
function Roll({ text }: { text: string }) {
  return (
    <span className="n-roll">
      <span>
        <span>{text}</span>
        <span aria-hidden="true">{text}</span>
      </span>
    </span>
  );
}

// Fixed chrome: the round seal top-left, section links + phone top-right, and
// the book-a-call dialog. The dialog keeps the full contract proven on the KAR
// build: labelled, focus-trapped, Escape/veil close, focus returned to the
// exact trigger, staged arrival, and HONEST outcome states from the endpoint.
export default function Chrome() {
  const seal = useRef<HTMLAnchorElement | null>(null);
  const links = useRef<HTMLElement | null>(null);
  const here = usePathname();

  // Each fixed piece flips to its light-on-dark scheme when whatever is
  // actually painted beneath it is a dark surface.
  //
  // This asks the document what is under the piece rather than testing band
  // rectangles: the road chapter pans SIDEWAYS, so a cream panel and a wine
  // panel share the same vertical range and a rect test cannot tell them
  // apart. A hit test can. It is a class flip for legibility, not motion, so
  // it is deliberately not gated behind reduced-motion.
  useEffect(() => {
    const pieces = [seal.current, links.current].filter(
      Boolean,
    ) as HTMLElement[];
    if (!pieces.length) return;

    // Scroll direction drives `.is-away`. On a phone the chrome is fixed over
    // the content and was measured covering live CTAs at a third of all scroll
    // stops; getting out of the way while the visitor reads downward is the
    // only thing that frees the whole page. The class is toggled at every
    // width — only the ≤860 block gives it a translate, so desktop is inert.
    let raf = 0;
    let lastY = 0;
    const NUDGE = 14; // ignore sub-pixel and rubber-band jitter
    const read = () => {
      raf = 0;
      pieces.forEach((p) => p.classList.toggle("is-dark", under(p)));
      const y = window.scrollY;
      // the pill's top edge doubles as the page's progress hairline: the phone
      // has no .n-rail and the document is 23.7 viewports long, so without it
      // there is no instrument at all telling a visitor where they are
      const span = document.documentElement.scrollHeight - window.innerHeight;
      links.current?.style.setProperty(
        "--prog",
        span > 0 ? String(Math.min(1, y / span)) : "0",
      );
      const d = y - lastY;
      if (Math.abs(d) > NUDGE) {
        // never hide at the very top, and never hide while a dialog is open
        // the dialog is the one thing that locks body overflow; while it is
        // open the chrome must not move underneath it
        const away =
          d > 0 && y > 220 && document.body.style.overflow !== "hidden";
        pieces.forEach((p) => p.classList.toggle("is-away", away));
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    lastY = window.scrollY;
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The pill wraps to two or three rows depending on how much width the
  // labels need, so the lane the page reserves for it is MEASURED rather than
  // guessed. Read from offsetHeight and the resolved `bottom` (which carries
  // env(safe-area-inset-bottom)) so the .is-away translate never feeds back.
  useEffect(() => {
    const el = links.current;
    if (!el) return;
    const root = document.documentElement;
    const set = () => {
      const cs = getComputedStyle(el);
      if (cs.bottom === "auto") {
        root.style.removeProperty("--chrome-b"); // wide screens: pill is at the top
        return;
      }
      const lane = Math.round(
        el.offsetHeight + (parseFloat(cs.bottom) || 0) + 10,
      );
      if (root.style.getPropertyValue("--chrome-b") === `${lane}px`) return;
      root.style.setProperty("--chrome-b", `${lane}px`);
      // the reserved lane changes the document's height
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
      root.style.removeProperty("--chrome-b");
    };
  }, []);

  // Chapter marks: which of the pill's three destinations the visitor is
  // actually standing in. An observer, not a scroll calculation — the bands
  // are pinned and scrubbed, so their scroll ranges are not their positions.
  useEffect(() => {
    const bands = ["approach", "collections", "call"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const el = links.current;
    if (!el || !bands.length) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (rows) => {
        rows.forEach((r) =>
          r.isIntersecting ? seen.add(r.target.id) : seen.delete(r.target.id),
        );
        // the last one in document order wins when two bands share the screen
        const at = ["call", "collections", "approach"].find((id) =>
          seen.has(id),
        );
        if (at) el.dataset.at = at;
        else delete el.dataset.at;
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    bands.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, [here]);

  // The chapter sheet. The page runs 23.7 phone viewports and .n-rail — the
  // instrument that carries the site's shared coordinate — is hidden below
  // 861px, so a phone visitor could only reach a band by scrolling to it.
  const [idx, setIdx] = useState(false);
  const sheet = useRef<HTMLDivElement | null>(null);
  const idxFrom = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sheet.current;
    if (!idx || !el) return;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((n) => n.offsetParent !== null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIdx(false);
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const a = document.activeElement;
      if (e.shiftKey && (a === f[0] || !el.contains(a))) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && a === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // the first focusable is the veil; land on the first chapter instead
    const t = window.setTimeout(
      () =>
        el
          .querySelector<HTMLElement>(".n-sheet__list a")
          ?.focus({ preventScroll: true }),
      60,
    );
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      idxFrom.current?.focus?.({ preventScroll: true });
      idxFrom.current = null;
    };
  }, [idx]);

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<
    "idle" | "sending" | "sent" | "logged" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dlg = useRef<HTMLDivElement | null>(null);
  const first = useRef<HTMLInputElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const openedAt = useRef(0);

  // A home's page asks about THAT home: the pill hands over its name, and
  // the message field opens with it already written. Everything else on the
  // site opens the dialog with a blank message, exactly as before.
  const [about, setAbout] = useState("");
  // "sent" and "logged" both mean the request is away — the window turns over
  // to its answer. "error" stays on the form so it can be sent again.
  const doneBtn = useRef<HTMLButtonElement | null>(null);
  // ---- THE PARABOLA -----------------------------------------------------
  // The window comes in from the top and leaves at the bottom, and it does
  // not travel in a straight line: it swings. One progress value t drives the
  // whole journey — t = -1 is out above, 0 is at rest, +1 is out below — and
  // the card's place is
  //     x = SWING · t²      y = DROP · t      tilt = BANK · t
  // which is a parabola with its vertex at rest, opening to the side: the
  // card arrives from the upper right, sweeps left and down into place, and
  // on close sweeps right and down out of the frame along the same curve.
  // The tilt is the bank a thing takes on a curve, and it is what reads as
  // motion rather than as a slide.
  const parabola = (t: number) => {
    const vw = window.innerWidth;
    const swing = Math.min(180, Math.max(64, vw * 0.11));
    const drop = window.innerHeight * 1.12;
    return { x: swing * t * t, y: drop * t, rotate: 4 * t };
  };
  const paintCard = (t: number) => {
    const card = dlg.current?.querySelector<HTMLElement>(".n-dlg__card");
    if (!card) return;
    const p = parabola(t);
    gsap.set(card, { x: p.x, y: p.y, rotate: p.rotate });
  };
  // Closing is no longer "unmount now": the card has to travel out first.
  // Every close path — Escape, the veil, the ×, the done-state button — comes
  // through here, and while the exit is playing a second request is ignored
  // rather than restarted.
  const closing = useRef(false);
  const requestClose = () => {
    const el = dlg.current;
    if (!el || closing.current) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      setOpen(false);
      return;
    }
    closing.current = true;
    el.setAttribute("data-closing", "");
    const prog = { t: 0 };
    gsap.timeline({
      onComplete: () => {
        closing.current = false;
        setOpen(false);
      },
    })
      .to(".n-dlg__stage", { y: -10, opacity: 0, duration: 0.22, ease: "power2.in", stagger: 0.02 }, 0)
      // the fall accelerates, as a fall does
      .to(prog, { t: 1, duration: 0.62, ease: "power2.in", onUpdate: () => paintCard(prog.t) }, 0.06)
      .to(".n-dlg__veil", { opacity: 0, duration: 0.34, ease: "power2.in" }, 0.3);
  };

  const openCall = (trigger?: HTMLElement | null, subject = "") => {
    setAbout(subject);
    lastFocus.current =
      trigger ?? (document.activeElement as HTMLElement | null);
    setState("idle");
    setErrors({});
    openedAt.current = Date.now();
    setOpen(true);
    // top of the enquiry funnel. `about` names which home summoned it, so the
    // seventeen can be ranked by intent, not just by page views.
    track(EV.askOpen, { about: subject || "general" });
  };

  // any CTA on the page can summon the dialog without importing Chrome
  useEffect(() => {
    const h = (e: Event) =>
      openCall(
        null,
        (e as CustomEvent<{ about?: string }>).detail?.about ?? "",
      );
    window.addEventListener("noratun:call", h);
    return () => window.removeEventListener("noratun:call", h);
  }, []);

  useEffect(() => {
    const el = dlg.current;
    if (!open || !el) return;
    if (!lastFocus.current)
      lastFocus.current = document.activeElement as HTMLElement | null;
    // NOT lenis.stop(): it preventDefaults every vertical touchmove, which in
    // landscape made the card's own 598px of content unscrollable to the
    // submit button. SmoothScroll's `prevent` keeps Lenis out of .n-dlg and
    // body overflow:hidden holds the page behind it.
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((n) => n.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose(); // out along the curve, not an instant unmount
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const firstEl = f[0];
      const lastEl = f[f.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === firstEl || !el.contains(active))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    closing.current = false;
    el.removeAttribute("data-closing");

    let ctx: gsap.Context | undefined;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      ctx = gsap.context(() => {
        // The arrival: the card starts out above the frame (t = -1) and comes
        // down the parabola to rest (t = 0). Decelerating, because it is
        // being CAUGHT at the vertex — the close, which is a fall, accelerates.
        // The card is parked out of frame BEFORE the veil starts so the first
        // painted frame never shows it standing at rest.
        const prog = { t: -1 };
        paintCard(-1);
        const tl = gsap.timeline();
        tl.fromTo(
          ".n-dlg__veil",
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          0,
        )
          .to(
            prog,
            {
              t: 0,
              duration: 0.82,
              ease: "power3.out",
              onUpdate: () => paintCard(prog.t),
            },
            0.04,
          )
          .fromTo(
            ".n-dlg__stage",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.055, ease: "power3.out" },
            0.42,
          );
      }, el);
    }
    const t = window.setTimeout(
      () => first.current?.focus({ preventScroll: true }),
      420,
    );

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      ctx?.revert();
      document.body.style.overflow = "";
      lastFocus.current?.focus?.({ preventScroll: true });
      lastFocus.current = null;
    };
  }, [open]);

  const done = state === "sent" || state === "logged";
  // the form it replaced held the focus; move it on rather than dropping it
  useEffect(() => {
    if (done) doneBtn.current?.focus({ preventScroll: true });
  }, [done]);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    setState("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          phone: get("phone"),
          email: get("email"),
          message: get("message"),
          company: get("company"),
          elapsed: Date.now() - openedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        delivered?: boolean;
        errors?: Record<string, string>;
        error?: string;
      };
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setState("idle");
        const firstKey = Object.keys(data.errors)[0];
        form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
        return;
      }
      if (!res.ok || !data.ok) {
        setErrors(data.error ? { form: data.error } : {});
        setState("error");
        return;
      }
      setState(data.delivered ? "sent" : "logged");
      // two separate events on purpose. `ask_undelivered` firing at all means
      // leads are only reaching the server log — it is the alarm for "the
      // delivery env vars were never set", which is otherwise invisible.
      track(data.delivered ? EV.askSent : EV.askUndelivered, { about: about || "general" });
      form.reset();
    } catch {
      setState("error");
    }
  };

  const go = (href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    // on a subpage the one-pager's anchors don't exist — navigate home to them
    if (!target) {
      window.location.href = "/" + href;
      return;
    }
    // Land the band clear of the fixed chrome rather than under it. Read the
    // RESOLVED scroll-padding-top rather than --chrome-top: the variable holds
    // a calc(… env(…)) token that getPropertyValue hands back unevaluated.
    // Desktop never sets scroll-padding, so this resolves to 0 there and the
    // desktop landing is untouched.
    const sp = parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    const offset = Number.isFinite(sp) ? -sp : 0;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { offset });
    else target.scrollIntoView();
  };

  // /admin is a tool, not a page of the brochure. The seal, the nav and the
  // phone number all belong to the sales surface, and on the admin they were
  // both confusing — links straight out of the editor — and wrong-looking,
  // wine serif chrome over a plain grey utility. Every hook above has already
  // run, so this early return does not change their order.
  if (here?.startsWith("/admin")) return null;

  return (
    <div className="n-chrome">
      {/* The seal is the site's home link. It used to point at #main, which
          exists on EVERY page (layout renders <main id="main">), so on /homes
          and a home's own page it only scrolled that page to its top and there
          was no way back to the one-pager from the logo. On the one-pager it
          still scrolls to the top; anywhere else it navigates home. */}
      <a
        href={here === "/" ? "#main" : "/"}
        ref={seal}
        className="n-seal"
        aria-label={here === "/" ? `${brand.full} — to the top` : brand.full}
        onClick={(e) => {
          if (here !== "/") return; // a real navigation; let the browser go
          e.preventDefault();
          go("#main");
        }}
      >
        {/* the city ring turns; the crest inside it stays upright so the
            pomegranate keeps its place on the top petal.
            The spin lives on this DIV, not on the <svg>: animating transform
            on an SVG element makes the compositor re-raster it, which cost a
            measured 765 Paint + 765 Layout per 10 idle seconds. On a wrapper
            div it is a pure compositor transform — 0 paints. */}
        <div className="n-seal__ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path
              id="n-seal-arc"
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
              fill="none"
            />
            {/* textLength = the ring's circumference (2π·38), so the words are
                spread evenly all the way round instead of clipping at the seam */}
            <text textLength="238.7" lengthAdjust="spacing">
              <textPath href="#n-seal-arc" startOffset="0%">
                NORATUN · ARMENIA · NORATUN ·
              </textPath>
            </text>
          </svg>
        </div>
        <BotanicalCrestIcon className="n-seal__crest" />
      </a>

      <nav className="n-nav" aria-label="Primary" ref={links}>
        {/* the hairline lockup: two display lines split by a rule. Wide
            screens only — the phone pill below carries the plain link. */}
        {/* labelled explicitly: the two lines sit in separate boxes, so the
            name computed from them would run together as one word */}
        <a
          className="n-nav__cta"
          href={navCta.href}
          aria-label={navCta.lines.join(" ")}
        >
          <span>
            <Wave text={navCta.lines[0]} />
          </span>
          <i aria-hidden="true" />
          <span>
            <Wave text={navCta.lines[1]} />
          </span>
        </a>
        {nav.map((n) =>
          n.href === "#call" ? (
            <button
              key={n.href}
              type="button"
              data-band="call"
              onClick={(e) => openCall(e.currentTarget)}
            >
              <Roll text={n.label} />
            </button>
          ) : n.href.startsWith("#") ? (
            <a
              key={n.href}
              href={n.href}
              data-band={n.href.slice(1)}
              onClick={(e) => {
                e.preventDefault();
                go(n.href);
              }}
            >
              <Roll text={n.label} />
            </a>
          ) : (
            <a
              key={n.href}
              href={n.href}
              aria-current={here === n.href ? "page" : undefined}
              data-primary={n.href === navCta.href || undefined}
            >
              <Roll text={n.label} />
            </a>
          ),
        )}
        {/* the chapter index — phone widths only (CSS hides it above 860, where
            the side rail already carries the page's coordinate) */}
        <button
          type="button"
          className="n-nav__idx"
          aria-label={`${chapters.length} chapters`}
          aria-expanded={idx}
          aria-haspopup="dialog"
          onClick={(e) => {
            idxFrom.current = e.currentTarget;
            setIdx(true);
          }}
        >
          <span aria-hidden="true" />
        </button>
        {/* the only tel: link on the site otherwise sits at 98% of a 20,000px
            page; on a phone it caps the pill as a glyph, labelled with the
            number itself so the AX name stays the thing you are dialling */}
        <a
          className="phone"
          href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}
          aria-label={brand.phone}
        >
          <svg
            className="phone__ico"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6.6 3.5h3l1.5 3.7-1.9 1.2a11.5 11.5 0 0 0 5.4 5.4l1.2-1.9 3.7 1.5v3a1.6 1.6 0 0 1-1.7 1.6A15.6 15.6 0 0 1 5 5.2 1.6 1.6 0 0 1 6.6 3.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="phone__txt">{brand.phone}</span>
        </a>
      </nav>

      {idx && (
        <div
          className="n-sheet"
          ref={sheet}
          role="dialog"
          aria-modal="true"
          aria-label={`${chapters.length} chapters`}
        >
          <button
            type="button"
            className="n-sheet__veil"
            aria-label={callModal.close}
            onClick={() => setIdx(false)}
          />
          <div className="n-sheet__card">
            <ol className="n-sheet__list">
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIdx(false);
                      // let the scroll lock lift before Lenis measures
                      requestAnimationFrame(() => go(`#${c.id}`));
                    }}
                  >
                    <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
                    {/* the labels are the bands' own strings; one ends in a
                        full stop that reads wrong as a menu row */}
                    <span>{c.label.replace(/\.$/, "")}</span>
                  </a>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="n-sheet__x"
              onClick={() => setIdx(false)}
            >
              {callModal.close}
            </button>
          </div>
        </div>
      )}

      {open && (
        <div
          className="n-dlg"
          ref={dlg}
          role="dialog"
          aria-modal="true"
          aria-labelledby="n-dlg-title"
        >
          <button
            type="button"
            className="n-dlg__veil"
            aria-label={callModal.close}
            onClick={requestClose}
          />
          <div className="n-dlg__card">
            <button
              type="button"
              className="n-dlg__x"
              onClick={requestClose}
              aria-label={callModal.close}
            >
              <span aria-hidden>✕</span>
            </button>

            {/* LEFT — the script line at the top, the promise at the foot */}
            <div className="n-dlg__left">
              <h2 id="n-dlg-title" className="n-dlg__title n-dlg__stage">
                {done ? callModal.ok.script : callModal.script}
              </h2>
              <p className="n-dlg__lead n-dlg__stage">
                {done ? callModal.ok.when : callModal.lead}
              </p>
            </div>

            {/* the hairline down the middle, and the seal that breaks it */}
            <i className="n-dlg__rule" aria-hidden="true" />
            <span className="n-dlg__seal" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <path
                  id="n-dlg-arc"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                  fill="none"
                />
                {/* textLength = the ring's circumference (2π·38), so the words
                    spread evenly instead of clipping at the seam */}
                <text textLength="238.7" lengthAdjust="spacing">
                  <textPath href="#n-dlg-arc" startOffset="0%">
                    NORATUN · ARMENIA · NORATUN ·
                  </textPath>
                </text>
              </svg>
              <BotanicalCrestIcon className="n-dlg__crest" />
            </span>

            {/* RIGHT — the four fields, or, once it is away, the answer */}
            {done ? (
              <div className="n-dlg__done" role="status">
                <p className="n-dlg__done-lead">{callModal.ok.lead}</p>
                {about && (
                  <p className="n-dlg__done-about">
                    {callModal.ok.aboutLabel} <em>{about}</em>
                  </p>
                )}
                {/* HONEST: "logged" means the endpoint stored it but call-back
                    delivery is not switched on for this build, so the visitor
                    is told, and given the number rather than a promise. */}
                {state === "logged" && (
                  <p className="n-dlg__warn">
                    {callModal.okUndelivered}{" "}
                    <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>
                      {brand.phone}
                    </a>
                  </p>
                )}
                <button
                  type="button"
                  className="n-pill"
                  ref={doneBtn}
                  onClick={requestClose}
                >
                  {callModal.ok.done}
                </button>
              </div>
            ) : (
              <form className="n-dlg__form" onSubmit={send} noValidate>
                {state === "error" && (
                  <p className="n-dlg__warn" role="alert">
                    {callModal.failed}{" "}
                    <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>
                      {brand.phone}
                    </a>
                  </p>
                )}
                {errors.form && (
                  <p className="n-dlg__warn" role="alert">
                    {errors.form}
                  </p>
                )}
                {/* a summary that MOUNTS when the field errors arrive — a live
                  region already on the page announces nothing when it is
                  rendered with its text already in place */}
                {!errors.form && Object.keys(errors).length > 0 && (
                  <p className="n-dlg__warn" role="alert">
                    {callModal.fix}{" "}
                    {Object.keys(errors)
                      .map(
                        (k) =>
                          callModal.fields[k as keyof typeof callModal.fields],
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                <div className="n-dlg__pot" aria-hidden="true">
                  <label htmlFor="n-company">Company</label>
                  <input
                    id="n-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <label className="n-dlg__field n-dlg__stage">
                  <input
                    ref={first}
                    name="name"
                    type="text"
                    placeholder=" "
                    required
                    autoComplete="name"
                    aria-label={callModal.fields.name}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "n-err-name" : undefined}
                  />
                  <span className="lbl">{callModal.fields.name}</span>
                  {errors.name && (
                    <em className="err" id="n-err-name">
                      {errors.name}
                    </em>
                  )}
                </label>
                <label className="n-dlg__field n-dlg__stage">
                  <input
                    name="email"
                    type="email"
                    placeholder=" "
                    inputMode="email"
                    autoComplete="email"
                    aria-label={callModal.fields.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "n-err-email" : undefined}
                  />
                  <span className="lbl">{callModal.fields.email}</span>
                  {errors.email && (
                    <em className="err" id="n-err-email">
                      {errors.email}
                    </em>
                  )}
                </label>
                <label className="n-dlg__field n-dlg__stage">
                  <input
                    name="phone"
                    type="tel"
                    placeholder=" "
                    inputMode="tel"
                    autoComplete="tel"
                    aria-label={callModal.fields.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "n-err-phone" : undefined}
                  />
                  <span className="lbl">{callModal.fields.phone}</span>
                  {errors.phone && (
                    <em className="err" id="n-err-phone">
                      {errors.phone}
                    </em>
                  )}
                </label>
                <label className="n-dlg__field n-dlg__stage is-area">
                  <textarea
                    name="message"
                    defaultValue={about ? `About ${about}.` : undefined}
                    rows={3}
                    placeholder=" "
                    aria-label={callModal.fields.message}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "n-err-message" : undefined
                    }
                  />
                  <span className="lbl">{callModal.fields.message}</span>
                  {errors.message && (
                    <em className="err" id="n-err-message">
                      {errors.message}
                    </em>
                  )}
                </label>

                <div className="n-dlg__foot n-dlg__stage">
                  <p className="n-dlg__agree">
                    {callModal.agree}{" "}
                    <a href="/privacy" target="_blank" rel="noopener">
                      {callModal.privacy}
                    </a>
                  </p>
                  <button
                    className="n-dlg__send"
                    type="submit"
                    disabled={state === "sending"}
                  >
                    {state === "sending" ? callModal.sending : callModal.send}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
