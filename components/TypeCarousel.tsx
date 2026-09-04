"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eIn, eInOut, eOut } from "@/lib/eases";
import { collections } from "@/lib/content";

// ============================================================================
// THE COLLECTIONS CAROUSEL — the reference's "apartment types" band (its rail
// 51), rebuilt for our four collections at our rail ~45. Every number below
// was measured off the live band at 1440×900, not eyeballed:
//
//   GEOMETRY   100vh lake band · content inset one 10-col column each side ·
//              slide = empty top third / 144px mid strip (data cols 2-4,
//              desc cols 7-9 of an inner 8-col grid) / big didone name at the
//              bottom · 3:4 portrait photo (396×528 at 1440) dead-centre,
//              overlapping the mid strip · pagination: prev arrow+number,
//              144×1px hairline timer, number+arrow next.
//
//   THE SWAP   one slanted blade sweeps right→left in 1.22s. Incoming image:
//              clip polygon(100u% 0, 100% 0, (100+u)% 100, 125u% 100) with
//              u 1→0 while the <img> counter-drags scale 1+0.5u and
//              translateX +0.25·width·u (their exact 99px on 396). Outgoing:
//              the mirror polygon(0 0, v% 0, 1.25v% 100, 0 100), v 100→0,
//              image dragging out the other way. The bottom edge trails the
//              top by 25% — that lag IS the look. Ease fits their in-out
//              family; we use the sampled eInOut from lib/eases.ts.
//
//   THE TEXT   every line sits in an overflow-clip mask and rides
//              translateY 110%→0 on arrival (their split-line rig — the
//              mover is the line wrapper, not the word). Outgoing lines
//              leave upward to −110%.
//
//   AUTOPLAY   6.0s per slide, timed by the hairline filling left→right;
//              the fill resets the moment the blade starts, not after.
//
// Rendered only on the MOVED layer (js + ≥861px + motion OK) — phones, PRM
// and no-JS keep the stacked spec cards, which show the same four
// collections honestly without a timer. The CSS gate and this effect's
// matchMedia are the same query, so they cannot disagree.
// ============================================================================

const MOTION = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";
const HOLD = 6; // seconds per slide, measured off their 144px timer
const WIPE = 1.22; // blade duration, measured

/** a line in a clip mask — the unit every text reveal moves by */
function L({ children }: { children: React.ReactNode }) {
  return (
    <span className="n-tycar__lm">
      <span className="n-tycar__li">{children}</span>
    </span>
  );
}

export default function TypeCarousel() {
  const root = useRef<HTMLElement>(null);

  // Rendered at all only on the MOVED layer. CSS could hide the band on
  // phones, but a hidden <Image> still downloads — measured: three w=750
  // fetches of the same photo on a 375px viewport. Rendering null keeps the
  // phone DOM (and its network) exactly as if the band did not exist; the
  // stacked cards already show these four photos there.
  const [live, setLive] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOTION);
    const upd = () => setLive(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const slides = gsap.utils.toArray<HTMLElement>(".n-tycar__slide", el);
      const fill = el.querySelector<HTMLElement>(".n-tycar__fill");
      const pag = el.querySelector<HTMLElement>(".n-tycar__pag");
      const numPrev = el.querySelector<HTMLElement>(".n-tycar__nav.prev .n");
      const numNext = el.querySelector<HTMLElement>(".n-tycar__nav.next .n");
      if (slides.length < 2 || !fill || !pag) return;

      let idx = 0;
      let busy = false;
      let started = false;
      let inView = false; // kept ahead of the arrival trigger — onEnter can fire synchronously on create when the page restores scroll past the band

      const clipOf = (s: HTMLElement) => s.querySelector<HTMLElement>(".n-tycar__clip");
      const imgOf = (s: HTMLElement) => s.querySelector<HTMLElement>(".n-tycar__clip img");
      // the spec and copy lines, and the title's letters, move on their own clocks
      const linesOf = (s: HTMLElement) => s.querySelectorAll<HTMLElement>(".n-tycar__mid .n-tycar__li");
      const lettersOf = (s: HTMLElement) => s.querySelectorAll<HTMLElement>(".n-tycar__name .n-tycar__li");

      /** a slide leaves the accessibility tree and tab order when it leaves the stage */
      const setLive = (s: HTMLElement, live: boolean) => {
        s.setAttribute("aria-hidden", live ? "false" : "true");
        s.querySelectorAll<HTMLElement>("button, a").forEach((b) => {
          b.tabIndex = live ? 0 : -1;
        });
      };

      // park everything: closed clips, masked lines, hidden pagination
      slides.forEach((s, i) => {
        gsap.set(s, { visibility: "hidden", zIndex: 0 });
        const c = clipOf(s);
        if (c) gsap.set(c, { clipPath: "polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)" });
        gsap.set(linesOf(s), { yPercent: 110 });
        gsap.set(lettersOf(s), { yPercent: 110 });
        setLive(s, false);
        void i;
      });
      gsap.set(fill, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(pag, { autoAlpha: 0, y: 12 });

      let timer: gsap.core.Tween | null = null;
      const arm = () => {
        timer?.kill();
        timer = gsap.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, duration: HOLD, ease: "none", onComplete: () => go((idx + 1) % slides.length) },
        );
        if (!inView || document.hidden) timer.pause();
      };

      /** the blade: reveal `to`, and sweep `from` out with the same edge */
      const go = (to: number, from: number | null = idx) => {
        if (busy || to === from) return;
        busy = true;

        const inc = slides[to];
        const out = from == null ? null : slides[from];
        const incClip = clipOf(inc);
        const incImg = imgOf(inc);
        const w = incClip ? incClip.getBoundingClientRect().width : 396;

        gsap.set(inc, { visibility: "visible", zIndex: 2 });
        if (out) gsap.set(out, { zIndex: 1 });
        setLive(inc, true);
        if (out) setLive(out, false);

        // numbers read (current, coming) — measured: at slide 1 they show 1 / 2
        if (numPrev) numPrev.textContent = String(to + 1);
        if (numNext) numNext.textContent = String(((to + 1) % slides.length) + 1);

        arm(); // their fill resets as the blade starts, not after

        const blade = { u: 1 };
        const outClip = out ? clipOf(out) : null;
        const outImg = out ? imgOf(out) : null;
        gsap.to(blade, {
          u: 0,
          duration: WIPE,
          ease: eInOut,
          onUpdate: () => {
            const u = blade.u;
            if (incClip)
              incClip.style.clipPath = `polygon(${(100 * u).toFixed(3)}% 0%, 100% 0%, ${(100 + u).toFixed(3)}% 100%, ${(125 * u).toFixed(3)}% 100%)`;
            if (incImg) incImg.style.transform = `translateX(${(0.25 * w * u).toFixed(2)}px) scale(${(1 + 0.5 * u).toFixed(4)})`;
            if (outClip) {
              const v = 100 * u;
              outClip.style.clipPath = `polygon(0% 0%, ${v.toFixed(3)}% 0%, ${(1.25 * v).toFixed(3)}% 100%, 0% 100%)`;
            }
            if (outImg) outImg.style.transform = `translateX(${(-0.25 * w * (1 - u)).toFixed(2)}px) scale(${(1 + 0.5 * (1 - u)).toFixed(4)})`;
          },
          onComplete: () => {
            if (out) {
              gsap.set(out, { visibility: "hidden", zIndex: 0 });
              gsap.set(linesOf(out), { yPercent: 110 });
              gsap.set(lettersOf(out), { yPercent: 110 });
              if (outImg) outImg.style.transform = "";
            }
            idx = to;
            busy = false;
          },
        });

        if (out) gsap.to(linesOf(out), { yPercent: -110, duration: 0.5, ease: eIn, stagger: 0.03 });
        gsap.fromTo(
          linesOf(inc),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: eOut, stagger: 0.07, delay: 0.25 },
        );
        // the title, letter by letter from its first: the old one lifts away,
        // the new one rises into place
        if (out) gsap.to(lettersOf(out), { yPercent: -110, duration: 0.45, ease: eIn, stagger: 0.02 });
        gsap.fromTo(
          lettersOf(inc),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: eOut, stagger: 0.035, delay: 0.3 },
        );
      };

      // ---- arrival: first slide wipes in, pagination surfaces, timer starts
      const arrive = ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          started = true;
          go(0, null);
          gsap.to(pag, { autoAlpha: 1, y: 0, duration: 0.8, ease: eOut, delay: 0.3 });
        },
      });

      // ---- the timer only runs while the band is on screen
      const io = new IntersectionObserver(
        ([e]) => {
          inView = e.isIntersecting;
          if (!timer) return;
          if (inView && !document.hidden) timer.play();
          else timer.pause();
        },
        { threshold: 0.15 },
      );
      io.observe(el);
      const onVis = () => {
        if (!timer) return;
        if (document.hidden) timer.pause();
        else if (inView) timer.play();
      };
      document.addEventListener("visibilitychange", onVis);

      const prev = () => started && go((idx - 1 + slides.length) % slides.length);
      const next = () => started && go((idx + 1) % slides.length);
      const bPrev = el.querySelector<HTMLElement>(".n-tycar__nav.prev");
      const bNext = el.querySelector<HTMLElement>(".n-tycar__nav.next");
      bPrev?.addEventListener("click", prev);
      bNext?.addEventListener("click", next);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      };
      el.addEventListener("keydown", onKey);

      // this component mounts POST-hydration and changes the page's height
      // (it also hides .n-cards) — triggers computed before it need new
      // positions
      const rf = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(rf);
        arrive.kill();
        timer?.kill();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        bPrev?.removeEventListener("click", prev);
        bNext?.removeEventListener("click", next);
        el.removeEventListener("keydown", onKey);
      };
    });

    return () => mm.revert();
  }, [live]);

  const call = () => window.dispatchEvent(new Event("noratun:call"));

  if (!live) return null;

  // the carousel shows the collections that are open; the one still to come
  // stays on the stacked cards
  const shown = collections.filter((c) => c.status !== "soon");

  return (
    <section className="n-tycar" ref={root} aria-roledescription="carousel" aria-label="The collections">
      <div className="n-tycar__in">
        <div className="n-tycar__stage">
          {shown.map((c, i) => (
            <article
              className="n-tycar__slide"
              key={c.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${shown.length} — ${c.place}`}
            >
              <div className="n-tycar__mid">
                <div className="n-tycar__data">
                  <L>
                    <span className="k">Bedrooms</span>
                  </L>
                  <L>
                    <strong className="v">{c.bedrooms}</strong>
                  </L>
                  <L>
                    <span className="k">Area</span>
                  </L>
                  <L>
                    <strong className="v">{c.area}</strong>
                  </L>
                </div>
                <div className="n-tycar__desc">
                  <L>
                    <p>{c.copy}</p>
                  </L>
                  <L>
                    <button type="button" className="n-tycar__pill" onClick={call}>
                      Ask about {c.place}
                    </button>
                  </L>
                </div>
              </div>
              <figure className="n-tycar__fig">
                <div className="n-tycar__clip">
                  <Image placeholder="blur" src={c.img} alt={c.alt} fill sizes="(max-width: 860px) 1px, 36vw" />
                </div>
                {/* the title rides the photograph's bottom edge — baseline on
                    the edge, letters over the picture — each letter in its
                    own mask so it rises and lifts on its own */}
                <h3 className="n-tycar__name">
                  {c.name.split(" ").map((w, wi) => (
                    <span className="n-tycar__word" key={`${w}-${wi}`}>
                      {w.split("").map((ch, i) => (
                        <span className="n-tycar__lm" key={i}>
                          <span className="n-tycar__li">{ch}</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </h3>
              </figure>
            </article>
          ))}
        </div>
        <div className="n-tycar__pag">
          <button type="button" className="n-tycar__nav prev" aria-label="Previous collection">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10.5 2.5 5 8l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="n" aria-hidden="true">
              1
            </span>
          </button>
          <span className="n-tycar__track" aria-hidden="true">
            <span className="n-tycar__fill" />
          </span>
          <button type="button" className="n-tycar__nav next" aria-label="Next collection">
            <span className="n" aria-hidden="true">
              2
            </span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5.5 2.5 11 8l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
