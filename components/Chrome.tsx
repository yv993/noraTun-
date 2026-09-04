"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { brand, callModal, nav, navCta } from "@/lib/content";
import type Lenis from "lenis";
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
          <span className="n-wv" key={i} style={{ "--i": n++ } as React.CSSProperties}>
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

  // Each fixed piece flips to its light-on-dark scheme when whatever is
  // actually painted beneath it is a dark surface.
  //
  // This asks the document what is under the piece rather than testing band
  // rectangles: the road chapter pans SIDEWAYS, so a cream panel and a wine
  // panel share the same vertical range and a rect test cannot tell them
  // apart. A hit test can. It is a class flip for legibility, not motion, so
  // it is deliberately not gated behind reduced-motion.
  useEffect(() => {
    const pieces = [seal.current, links.current].filter(Boolean) as HTMLElement[];
    if (!pieces.length) return;

    const under = (p: HTMLElement) => {
      const r = p.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2);
      const y = Math.round(r.top + r.height / 2);
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
      // walk the paint stack, skipping the chrome itself
      for (const el of document.elementsFromPoint(x, y)) {
        if (el.closest(".n-chrome")) continue;
        const hit = el.closest<HTMLElement>("[data-dark],[data-light]");
        if (!hit) return false;
        return hit.hasAttribute("data-dark");
      }
      return false;
    };

    let raf = 0;
    const read = () => {
      raf = 0;
      pieces.forEach((p) => p.classList.toggle("is-dark", under(p)));
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
  }, []);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "logged" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dlg = useRef<HTMLDivElement | null>(null);
  const first = useRef<HTMLInputElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const openedAt = useRef(0);

  const openCall = (trigger?: HTMLElement | null) => {
    lastFocus.current = trigger ?? (document.activeElement as HTMLElement | null);
    setState("idle");
    setErrors({});
    openedAt.current = Date.now();
    setOpen(true);
  };

  // any CTA on the page can summon the dialog without importing Chrome
  useEffect(() => {
    const h = () => openCall();
    window.addEventListener("noratun:call", h);
    return () => window.removeEventListener("noratun:call", h);
  }, []);

  useEffect(() => {
    const el = dlg.current;
    if (!open || !el) return;
    if (!lastFocus.current) lastFocus.current = document.activeElement as HTMLElement | null;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((n) => n.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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

    let ctx: gsap.Context | undefined;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".n-dlg__veil", { opacity: 0 }, { opacity: 1, duration: 0.28 })
          .fromTo(
            ".n-dlg__card",
            { yPercent: 3, opacity: 0, clipPath: "inset(46% 0% 46% 0% round 24px)" },
            { yPercent: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 0.6 },
            0.06,
          )
          .fromTo(".n-dlg__stage", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.055 }, 0.3);
      }, el);
    }
    const t = window.setTimeout(() => first.current?.focus({ preventScroll: true }), 420);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      ctx?.revert();
      lenis?.start();
      document.body.style.overflow = "";
      lastFocus.current?.focus?.({ preventScroll: true });
      lastFocus.current = null;
    };
  }, [open]);

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
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView();
  };

  return (
    <div className="n-chrome">
      <a
        href="#main"
        ref={seal}
        className="n-seal"
        aria-label={`${brand.full} — to the top`}
        onClick={(e) => {
          e.preventDefault();
          go("#main");
        }}
      >
        {/* the city ring turns; the crest inside it stays upright so the
            pomegranate keeps its place on the top petal */}
        <svg className="n-seal__ring" viewBox="0 0 100 100" aria-hidden="true">
          <path id="n-seal-arc" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
          {/* textLength = the ring's circumference (2π·38), so the words are
              spread evenly all the way round instead of clipping at the seam */}
          <text textLength="238.7" lengthAdjust="spacing">
            <textPath href="#n-seal-arc" startOffset="0%">
              NORATUN · ARMENIA · NORATUN ·
            </textPath>
          </text>
        </svg>
        <BotanicalCrestIcon className="n-seal__crest" />
      </a>

      <nav className="n-nav" aria-label="Sections" ref={links}>
        {/* the hairline lockup: two display lines split by a rule. Wide
            screens only — the phone pill below carries the plain link. */}
        {/* labelled explicitly: the two lines sit in separate boxes, so the
            name computed from them would run together as one word */}
        <a className="n-nav__cta" href={navCta.href} aria-label={navCta.lines.join(" ")}>
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
            <button key={n.href} type="button" onClick={(e) => openCall(e.currentTarget)}>
              <Roll text={n.label} />
            </button>
          ) : n.href.startsWith("#") ? (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => {
                e.preventDefault();
                go(n.href);
              }}
            >
              <Roll text={n.label} />
            </a>
          ) : (
            <a key={n.href} href={n.href} data-primary={n.href === navCta.href || undefined}>
              <Roll text={n.label} />
            </a>
          ),
        )}
        <a className="phone" href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>
          {brand.phone}
        </a>
      </nav>

      {open && (
        <div className="n-dlg" ref={dlg} role="dialog" aria-modal="true" aria-labelledby="n-dlg-title">
          <button type="button" className="n-dlg__veil" aria-label={callModal.close} onClick={() => setOpen(false)} />
          <div className="n-dlg__card">
            <button type="button" className="n-dlg__x" onClick={() => setOpen(false)} aria-label={callModal.close}>
              <span aria-hidden>✕</span>
            </button>

            <span className="n-dlg__kicker n-dlg__stage">{callModal.kicker}</span>
            <h2 id="n-dlg-title" className="n-dlg__title n-dlg__stage">
              {callModal.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>

            {state === "sent" && (
              <p className="n-dlg__ok" role="status">
                {callModal.okDelivered}
              </p>
            )}
            {(state === "logged" || state === "error") && (
              <p className="n-dlg__warn" role="alert">
                {state === "logged" ? callModal.okUndelivered : callModal.failed}{" "}
                <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>{brand.phone}</a>
              </p>
            )}
            {errors.form && (
              <p className="n-dlg__warn" role="alert">
                {errors.form}
              </p>
            )}

            <form className="n-dlg__form" onSubmit={send} noValidate>
              <div className="n-dlg__pot" aria-hidden="true">
                <label htmlFor="n-company">Company</label>
                <input id="n-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="n-dlg__field n-dlg__stage">
                <input ref={first} name="name" type="text" placeholder=" " required autoComplete="name" aria-invalid={!!errors.name} />
                <span className="lbl">{callModal.fields.name}</span>
                {errors.name && <em className="err">{errors.name}</em>}
              </label>
              <label className="n-dlg__field n-dlg__stage">
                <input name="phone" type="tel" placeholder=" " inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
                <span className="lbl">{callModal.fields.phone}</span>
                {errors.phone && <em className="err">{errors.phone}</em>}
              </label>
              <label className="n-dlg__field n-dlg__stage">
                <input name="email" type="email" placeholder=" " inputMode="email" autoComplete="email" aria-invalid={!!errors.email} />
                <span className="lbl">{callModal.fields.email}</span>
                {errors.email && <em className="err">{errors.email}</em>}
              </label>
              <label className="n-dlg__field n-dlg__stage is-area">
                <textarea name="message" rows={2} placeholder=" " aria-invalid={!!errors.message} />
                <span className="lbl">{callModal.fields.message}</span>
                {errors.message && <em className="err">{errors.message}</em>}
              </label>

              <div className="n-dlg__row n-dlg__stage">
                <label className="n-dlg__consent">
                  <input type="checkbox" name="consent" required />
                  <span>
                    {callModal.consent} —{" "}
                    <a href="/privacy" onClick={() => setOpen(false)}>
                      privacy
                    </a>
                  </span>
                </label>
                <button className="n-pill" type="submit" disabled={state === "sending"}>
                  {state === "sending" ? callModal.sending : callModal.send}{" "}
                  <span aria-hidden>{state === "sending" ? "…" : "→"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
