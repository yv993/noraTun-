"use client";

import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";

// The reference's side rail: a tick, the page PERCENTAGE, a hairline that
// fills, and a SCROLL arrow at the foot. The number is the site's shared
// coordinate system — "the band at 16" — for editors and visitors alike.
//
// Plain scroll listener + rAF, no GSAP: it must work under reduced motion,
// where the tweens never wire but the page still scrolls.
export default function ScrollRail() {
  const num = useRef<HTMLSpanElement | null>(null);
  const fill = useRef<HTMLSpanElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false); // near the end → the arrow turns

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
      if (pct === last) return;
      last = pct;
      if (num.current) num.current.textContent = String(pct).padStart(2, "0");
      if (fill.current) fill.current.style.transform = `scaleY(${pct / 100})`;
      if (bar.current) bar.current.setAttribute("aria-valuenow", String(pct));
      setNear(pct >= 88);
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

  // one screen forward — or, near the end, back to the top
  const go = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const target = near ? 0 : window.scrollY + window.innerHeight * 0.92;
    if (lenis) lenis.scrollTo(target, {});
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div className="n-rail" aria-hidden={undefined}>
      <span className="n-rail__tick" aria-hidden="true" />
      <div
        className="n-rail__meter"
        ref={bar}
        role="progressbar"
        aria-label="Page progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <span className="n-rail__num" ref={num}>
          00
        </span>
        <span className="n-rail__line" aria-hidden="true">
          <span className="n-rail__fill" ref={fill} />
        </span>
      </div>
      <button
        type="button"
        className="n-rail__go"
        onClick={go}
        aria-label={near ? "Back to the top" : "Scroll one screen"}
      >
        <span className="txt">{near ? "TOP" : "SCROLL"}</span>
        <svg viewBox="0 0 10 56" aria-hidden="true" data-up={near || undefined}>
          <line x1="5" y1="2" x2="5" y2="48" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1.5 44 L5 52 L8.5 44" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </div>
  );
}
