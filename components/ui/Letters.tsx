"use client";

import gsap from "gsap";

// ============================================================================
// LETTERS — the reference's split-char display type, as markup.
//
// Every character sits in its own clip box (overflow-y clip, overflow-x
// visible so Bodoni's serifs and the "." of "No." survive), with the glyph in
// an inner span that a tween can lift out of the box on its own. The word box
// carries the scaleX condensation the reference's ambroise cut has built in.
//
// The letters are ALWAYS AT REST in CSS. `riseLetters` parks and releases them
// at effect time, so a reader with reduced motion, or with no JS at all, sees
// the finished word and never an empty box.
//
// The class names are the catalogue head's (.hp-title__word / __ch), so the
// two pages share one set of rules and one arrival.
// ============================================================================

export function Letters({ text }: { text: string }) {
  return (
    <span className="hp-title__word" aria-hidden="true">
      {text.split("").map((ch, i) =>
        // a space has nothing to reveal, and inside a clip box it would
        // collapse — it stays a plain span and keeps the word's rhythm
        ch === " " ? (
          <span key={i}> </span>
        ) : (
          <span className="hp-title__ch" key={i}>
            <span>{ch}</span>
          </span>
        ),
      )}
    </span>
  );
}

/** The arrival: each glyph rises out of its own box, one after the next.
 *  Call inside a gsap.matchMedia/context so it reverts with everything else. */
export function riseLetters(root: Element | null, delay = 0.1) {
  if (!root) return;
  const chars = root.querySelectorAll<HTMLElement>(".hp-title__ch > span");
  if (!chars.length) return;
  gsap.set(chars, { yPercent: 112 });
  gsap.to(chars, {
    yPercent: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.05,
    delay,
  });
}
