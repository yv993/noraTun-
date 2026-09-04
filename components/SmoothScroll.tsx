"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Site-wide smooth scroll. Exposed as window.__lenis so section wiring and the
// dialog can stop/start or jump it. Never runs under reduced motion — native
// scrolling is the reduced-motion experience, not a slower tween.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("lenis");
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("lenis");
    };
  }, []);
  return null;
}
