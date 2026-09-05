"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Site-wide smooth scroll. Exposed as window.__lenis so section wiring and the
// dialog can stop/start or jump it. Never runs under reduced motion — native
// scrolling is the reduced-motion experience, not a slower tween.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A touch device scrolls itself; Lenis was running a permanent rAF loop
    // there without driving anything. Every consumer already optional-chains
    // window.__lenis, so its absence is a supported state.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // `prevent` keeps Lenis's hands off anything inside the dialog and the
    // chapter sheet. Without it lenis.stop() was the only lock available, and
    // stop() preventDefaults every vertical touchmove — so in landscape the
    // dialog's own 598px-tall card could not be finger-scrolled to its submit
    // button at all. Body overflow:hidden holds the page on its own.
    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      prevent: (node) => !!(node as HTMLElement).closest?.(".n-dlg, .n-sheet"),
    });
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
