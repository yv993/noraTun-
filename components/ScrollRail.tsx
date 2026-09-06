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
  const thumb = useRef<HTMLSpanElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const line = useRef<HTMLDivElement | null>(null);
  // While a finger or pointer owns the rail the scroll listener must not fight
  // it: the listener would keep writing the position the page HAS while the
  // drag is writing the position the visitor WANTS, and the thumb would judder
  // between the two. During a drag the drag is the only writer.
  const dragging = useRef(false);
  const [near, setNear] = useState(false); // near the end → the arrow turns
  // Below 701px the rail is display:none, but it still mounted and still read
  // scrollHeight on every frame of every scroll. A live matchMedia state, so a
  // rotation into tablet width brings it back rather than needing a reload.
  //
  // It starts TRUE so the server renders the rail and a wide screen never sees
  // it pop in after hydration; the effect below corrects it on the first tick,
  // which is early enough that a phone attaches no scroll work.
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 701px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // One place that moves the number, the fill and the thumb, so the readout,
  // the filled length and the grab handle can never disagree about where the
  // page is — the drag writes through here too.
  const paint = (pct: number) => {
    if (num.current) num.current.textContent = String(pct).padStart(2, "0");
    if (fill.current) fill.current.style.transform = `scaleY(${pct / 100})`;
    if (thumb.current) thumb.current.style.top = `${pct}%`;
    if (bar.current) {
      bar.current.setAttribute("aria-valuenow", String(pct));
      bar.current.setAttribute("aria-valuetext", `${pct}% through the page`);
    }
  };

  useEffect(() => {
    if (!wide) return;
    let raf = 0;
    let last = -1;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        max > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)))
          : 0;
      if (pct === last) return;
      last = pct;
      paint(pct);
      setNear(pct >= 88);
    };
    const onScroll = () => {
      if (dragging.current) return; // the drag owns the rail while it lasts
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
  }, [wide]);

  // one screen forward — or, near the end, back to the top
  const go = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const target = near ? 0 : window.scrollY + window.innerHeight * 0.92;
    if (lenis) lenis.scrollTo(target, {});
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // ---- THE RAIL AS A SCRUBBER ------------------------------------------
  // Take the rail and pull it down. The hairline was a readout; it is now the
  // control as well, which is what a visitor tries to do with it anyway.
  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  // jump the page there NOW. Lenis is smoothing every other scroll on the
  // site, and its easing is exactly wrong under a finger: the page would
  // trail the thumb by a few hundred milliseconds and the grip would feel
  // elastic. `immediate` bypasses the tween for the duration of the drag.
  const put = (pct: number, immediate: boolean) => {
    const target = (pct / 100) * maxScroll();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, immediate ? { immediate: true } : {});
    else
      window.scrollTo({
        top: target,
        behavior: immediate ? "auto" : "smooth",
      });
  };

  const pctAt = (clientY: number) => {
    const el = line.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    if (r.height <= 0) return 0;
    return Math.min(
      100,
      Math.max(0, Math.round(((clientY - r.top) / r.height) * 100)),
    );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    dragging.current = true;
    document.documentElement.classList.add("n-rail-drag");
    const pct = pctAt(e.clientY);
    paint(pct);
    put(pct, true);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const pct = pctAt(e.clientY);
    paint(pct);
    put(pct, true);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    document.documentElement.classList.remove("n-rail-drag");
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* the capture is already gone if the pointer left the window */
    }
    setNear(pctAt(e.clientY) >= 88);
  };

  // the same control from the keyboard, since a slider that only answers to a
  // pointer is not a control at all
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const now = Number(bar.current?.getAttribute("aria-valuenow") ?? 0);
    const screen = maxScroll() > 0 ? (window.innerHeight / maxScroll()) * 100 : 0;
    const map: Record<string, number | undefined> = {
      ArrowDown: now + 2,
      ArrowRight: now + 2,
      ArrowUp: now - 2,
      ArrowLeft: now - 2,
      PageDown: now + screen,
      PageUp: now - screen,
      Home: 0,
      End: 100,
    };
    const want = map[e.key];
    if (want === undefined) return;
    e.preventDefault();
    const pct = Math.min(100, Math.max(0, Math.round(want)));
    paint(pct);
    put(pct, false); // from the keyboard the site's own easing is right
    setNear(pct >= 88);
  };

  if (!wide) return null;

  return (
    <div className="n-rail" aria-hidden={undefined}>
      <span className="n-rail__tick" aria-hidden="true" />
      <div className="n-rail__meter">
        <span className="n-rail__num" ref={num} aria-hidden="true">
          00
        </span>
        {/* role="slider", not progressbar: it is no longer a readout of where
            the page is, it is the thing that decides. Same element carries the
            grab, the keyboard and the value. */}
        <div
          className="n-rail__line"
          ref={(el) => {
            line.current = el;
            bar.current = el;
          }}
          role="slider"
          tabIndex={0}
          aria-label="Page position — drag or use the arrow keys"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKey}
        >
          <span className="n-rail__fill" ref={fill} aria-hidden="true" />
          <span className="n-rail__thumb" ref={thumb} aria-hidden="true" />
        </div>
      </div>
      <button
        type="button"
        className="n-rail__go"
        onClick={go}
        aria-label={near ? "Back to the top" : "Scroll one screen"}
      >
        <span className="txt">{near ? "TOP" : "SCROLL"}</span>
        <svg viewBox="0 0 10 56" aria-hidden="true" data-up={near || undefined}>
          <line
            x1="5"
            y1="2"
            x2="5"
            y2="48"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M1.5 44 L5 52 L8.5 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>
    </div>
  );
}
