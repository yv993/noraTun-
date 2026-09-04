"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import gsap from "gsap";

type Slide = { title: string; img: StaticImageData; alt: string; copy: string };

// The concept screen: a bold title over its photograph, both changing every
// few seconds. The outgoing title lifts away letter by letter from its first
// letter; the next reveals the same way from below, while the photograph
// crossfades and the copy beneath follows. The row under the frame — arrows,
// the current numeral, a scrubber, the total — also drives it, as do a drag
// on the frame and the arrow keys. The clock pauses while the pointer or
// focus is inside, while the screen is out of view, and under reduced
// motion, where changes are immediate.
export default function PlaceCarousel({
  slides,
  interval,
  label,
  kicker,
}: {
  slides: Slide[];
  interval: number;
  label: string;
  kicker: string[];
}) {
  const [idx, setIdx] = useState(0);
  const n = slides.length;
  const root = useRef<HTMLDivElement | null>(null);
  const line = useRef<HTMLSpanElement | null>(null);
  const copyEl = useRef<HTMLParagraphElement | null>(null);
  const idxRef = useRef(0);
  const busy = useRef(false);
  const revealed = useRef(false);
  const still = useRef(false);
  const restart = useRef<() => void>(() => {});
  const drag = useRef<number | null>(null);

  const letters = () => (line.current ? Array.from(line.current.querySelectorAll<HTMLElement>(".l")) : []);

  // reveal the current title from its first letter, and the copy after it
  const reveal = () => {
    gsap.fromTo(
      letters(),
      { yPercent: 110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.035, onComplete: () => (busy.current = false) },
    );
    if (copyEl.current) gsap.fromTo(copyEl.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.25 });
  };

  // change slides: lift the title away from its first letter, then swap;
  // the swap's render triggers the reveal below
  const go = (to: number) => {
    const next = ((to % n) + n) % n;
    if (next === idxRef.current || busy.current) return;
    if (still.current || !revealed.current) {
      idxRef.current = next;
      setIdx(next);
      return;
    }
    busy.current = true;
    gsap.to(letters(), {
      yPercent: -110,
      autoAlpha: 0,
      duration: 0.42,
      ease: "power2.in",
      stagger: 0.022,
      onComplete: () => {
        idxRef.current = next;
        setIdx(next);
      },
    });
    if (copyEl.current) gsap.to(copyEl.current, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" });
  };
  const pickAndRestart = (to: number) => {
    go(to);
    restart.current();
  };

  // hide the title before first sight (motion only), so the first reveal
  // can play when the screen comes into view
  useLayoutEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) return;
    gsap.set(letters(), { yPercent: 110, autoAlpha: 0 });
    if (copyEl.current) gsap.set(copyEl.current, { autoAlpha: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // after each swap, the fresh letters reveal
  useLayoutEffect(() => {
    if (!revealed.current || still.current) return;
    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // the clock: runs while on screen and unattended
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    let timer = 0;
    let onScreen = false;
    let paused = false;
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = 0;
    };
    const start = () => {
      stop();
      if (still.current || paused || !onScreen) return;
      timer = window.setInterval(() => go(idxRef.current + 1), interval);
    };
    restart.current = start;
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (e.isIntersecting) {
          if (!revealed.current) {
            revealed.current = true;
            if (!still.current) reveal();
          }
          start();
        } else stop();
      },
      { threshold: 0.4 },
    );
    io.observe(host);
    const pause = () => {
      paused = true;
      stop();
    };
    const resume = () => {
      paused = false;
      start();
    };
    host.addEventListener("pointerenter", pause);
    host.addEventListener("pointerleave", resume);
    host.addEventListener("focusin", pause);
    host.addEventListener("focusout", resume);
    return () => {
      io.disconnect();
      stop();
      host.removeEventListener("pointerenter", pause);
      host.removeEventListener("pointerleave", resume);
      host.removeEventListener("focusin", pause);
      host.removeEventListener("focusout", resume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    drag.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (dx > 40) pickAndRestart(idx - 1);
    else if (dx < -40) pickAndRestart(idx + 1);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") pickAndRestart(idx + 1);
    if (e.key === "ArrowLeft") pickAndRestart(idx - 1);
  };

  const s = slides[idx];
  return (
    <div className="n-place__unit" ref={root} role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKey}>
      <h2 className="n-place__title" id="n-place-title" aria-label={s.title}>
        {/* each word is a no-wrap box of letter boxes, with plain spaces
            between the words: the letters animate one by one, and where the
            line must wrap (phones) it wraps only at a word space */}
        <span className="n-place__line" ref={line} aria-hidden="true">
          {s.title.split(" ").map((word, wi) => (
            <Fragment key={`${idx}-${wi}`}>
              {wi ? " " : ""}
              <span className="w">
                {word.split("").map((ch, i) => (
                  <span className="l" key={i}>
                    {ch}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </span>
      </h2>

      <div className="n-place__card">
        <figure
          className="n-place__frame"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
        >
          {slides.map((sl, i) => (
            <Image
              key={sl.alt}
              placeholder="blur"
              src={sl.img}
              alt={sl.alt}
              fill
              sizes="(max-width: 860px) 92vw, 36vw"
              data-on={i === idx || undefined}
              aria-hidden={i !== idx}
              draggable={false}
            />
          ))}
        </figure>
        <div className="n-place__ctl">
          <button type="button" onClick={() => pickAndRestart(idx - 1)} aria-label="Previous">
            ‹
          </button>
          <span className="n-place__num" aria-hidden="true">
            {idx + 1}
          </span>
          <span className="n-place__track" aria-hidden="true">
            <i style={{ width: `${100 / n}%`, transform: `translateX(${idx * 100}%)` }} />
          </span>
          <span className="n-place__num n-place__num--total" aria-hidden="true">
            {n}
          </span>
          <button type="button" onClick={() => pickAndRestart(idx + 1)} aria-label="Next">
            ›
          </button>
        </div>
      </div>

      <div className="n-place__deck">
        <p className="n-place__copy" ref={copyEl}>
          {s.copy}
        </p>
        <p className="n-place__kicker">
          {kicker.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
      </div>

      <p className="n-sr" aria-live="polite">
        {`${idx + 1} of ${n}: ${s.title}`}
      </p>
    </div>
  );
}
