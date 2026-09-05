"use client";

import { useEffect, useRef, useState } from "react";
import type { Level } from "@/lib/content";

// ============================================================================
// LEVEL STACK — the small diagram in the corner of the info panel.
//
// The reference prints two block diagrams there: which building, which floor.
// We have neither a block nor a floor to point at — these are houses, drawn on
// their own sheets — so ours draws what the sheets DO give: the levels of this
// house, stacked, with the one you are looking at filled in.
//
// No compass: the sheets do not give north, and a north arrow that points
// nowhere in particular is a decoration pretending to be information.
// ============================================================================

const W = 58;
const H = 83;
const PLATE = 50; // rhombus width
const RISE = 8; // half its vertical extent
const THICK = 5; // the slab's edge
const GAP = 20; // between slabs

export function LevelStack({
  levels,
  label,
}: {
  levels: Level[];
  label: string;
}) {
  const root = useRef<SVGSVGElement | null>(null);
  const [at, setAt] = useState<number | null>(null);

  // Which drawing is the reader actually looking at? The plans scroll past in
  // the column beside this diagram; the one nearest the middle of the screen
  // is the one the slab lights up for. Without JS none is filled, and the
  // stack is still a finished drawing of how many levels the house has.
  useEffect(() => {
    const plans = Array.from(
      document.querySelectorAll<HTMLElement>(".fp.is-lot"),
    );
    if (!plans.length) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = -1;
      let bestD = Infinity;
      plans.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setAt(best < 0 ? null : best);
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
  }, [levels.length]);

  const n = levels.length;
  const stack = RISE * 2 + THICK + GAP * (n - 1);
  const top = (H - stack) / 2 + RISE;

  return (
    <svg
      className="hd-levels"
      ref={root}
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label={`${label}: ${levels.map((l) => l.caption).join(", ")}`}
      focusable="false"
    >
      {/* drawn bottom-up so an upper slab overlaps the one below it */}
      {levels
        .map((lv, i) => ({ lv, i }))
        .reverse()
        .map(({ lv, i }) => {
          const y = top + i * GAP;
          const cx = W / 2;
          const half = PLATE / 2;
          const face = `${cx - half},${y} ${cx},${y - RISE} ${cx + half},${y} ${cx},${y + RISE}`;
          return (
            <g key={lv.caption} data-on={i === at || undefined}>
              {/* the slab's edge, so the plate reads as a floor not a diamond */}
              <path
                d={`M ${cx - half},${y} L ${cx},${y + RISE} L ${cx + half},${y} L ${cx + half},${y + THICK} L ${cx},${y + RISE + THICK} L ${cx - half},${y + THICK} Z`}
                className="hd-levels__edge"
              />
              <polygon points={face} className="hd-levels__face" />
            </g>
          );
        })}
    </svg>
  );
}
