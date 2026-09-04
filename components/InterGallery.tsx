"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eInOut, eOut } from "@/lib/eases";
import { interiors } from "@/lib/content";

// ============================================================================
// THE INTERIOR GALLERY — the reference's rail-73 slider, measured live
// 2026-08-11: an 83%-wide, 1111×694 (8:5) photo carousel at the foot of the
// interiors chapter running the SAME rig as the type carousel — 6s autoplay
// timed by the hairline, the identical slanted blade (incoming
// polygon(100u% 0, 100% 0, (100+u)% 100, 125u% 100) with the print
// counter-dragging scale 1+0.5u / x +0.25·w·u, outgoing the mirror), and
// prev/next numbered (current, coming).
//
// MOVED layer only. Everywhere else — phones, PRM, no-JS — the same four
// photos render as a plain stacked strip: nothing hidden, nothing timed.
// ============================================================================

const MOTION = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";
const HOLD = 6;
const WIPE = 1.22;

export default function InterGallery() {
  const root = useRef<HTMLDivElement>(null);

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
      const slides = gsap.utils.toArray<HTMLElement>(".n-igal__slide", el);
      const fill = el.querySelector<HTMLElement>(".n-tycar__fill");
      const pag = el.querySelector<HTMLElement>(".n-igal__pag");
      const numPrev = el.querySelector<HTMLElement>(".n-tycar__nav.prev .n");
      const numNext = el.querySelector<HTMLElement>(".n-tycar__nav.next .n");
      if (slides.length < 2 || !fill || !pag) return;

      let idx = 0;
      let busy = false;
      let started = false;
      let inView = false; // ahead of the arrival trigger — it can fire on create

      const clipOf = (s: HTMLElement) => s.querySelector<HTMLElement>(".n-igal__clip");
      const imgOf = (s: HTMLElement) => s.querySelector<HTMLElement>(".n-igal__clip img");

      slides.forEach((s) => {
        gsap.set(s, { visibility: "hidden", zIndex: 0 });
        s.setAttribute("aria-hidden", "true");
        const c = clipOf(s);
        if (c) gsap.set(c, { clipPath: "polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)" });
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

      const go = (to: number, from: number | null = idx) => {
        if (busy || to === from) return;
        busy = true;
        const inc = slides[to];
        const out = from == null ? null : slides[from];
        const incClip = clipOf(inc);
        const incImg = imgOf(inc);
        const outClip = out ? clipOf(out) : null;
        const outImg = out ? imgOf(out) : null;
        const w = incClip ? incClip.getBoundingClientRect().width : 1000;

        gsap.set(inc, { visibility: "visible", zIndex: 2 });
        inc.setAttribute("aria-hidden", "false");
        if (out) {
          gsap.set(out, { zIndex: 1 });
          out.setAttribute("aria-hidden", "true");
        }
        if (numPrev) numPrev.textContent = String(to + 1);
        if (numNext) numNext.textContent = String(((to + 1) % slides.length) + 1);
        arm();

        const blade = { u: 1 };
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
              if (outImg) outImg.style.transform = "";
              if (outClip) gsap.set(outClip, { clipPath: "polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)" });
            }
            idx = to;
            busy = false;
          },
        });
      };

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

      // hidden slides never lazy-load — pre-warm as the gallery approaches
      const warm = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          el.querySelectorAll<HTMLImageElement>(".n-igal__clip img").forEach((im) => {
            im.loading = "eager";
          });
          warm.disconnect();
        },
        { rootMargin: "100% 0px" },
      );
      warm.observe(el);

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

      // this component mounts POST-hydration and changes the page's height —
      // every trigger computed before it needs new positions
      const rf = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(rf);
        arrive.kill();
        timer?.kill();
        warm.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        bPrev?.removeEventListener("click", prev);
        bNext?.removeEventListener("click", next);
        el.removeEventListener("keydown", onKey);
      };
    });

    return () => mm.revert();
  }, [live]);

  if (!live) {
    return (
      <div className="n-igal-plain">
        {interiors.gallery.map((g) => (
          <figure key={g.alt}>
            <Image placeholder="blur" src={g.src} alt={g.alt} fill sizes="(max-width: 860px) 92vw, 60vw" />
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="n-igal" ref={root} aria-roledescription="carousel" aria-label="Inside the homes">
      <div className="n-igal__stage">
        {interiors.gallery.map((g, i) => (
          <figure
            className="n-igal__slide"
            key={g.alt}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${interiors.gallery.length}`}
          >
            <div className="n-igal__clip">
              <Image placeholder="blur" src={g.src} alt={g.alt} fill sizes="60vw" />
            </div>
          </figure>
        ))}
      </div>
      {/* the pag row reuses the carousel's styled primitives */}
      <div className="n-igal__pag">
        <button type="button" className="n-tycar__nav prev" aria-label="Previous photo">
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
        <button type="button" className="n-tycar__nav next" aria-label="Next photo">
          <span className="n" aria-hidden="true">
            2
          </span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5.5 2.5 11 8l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
