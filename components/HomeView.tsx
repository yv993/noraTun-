"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BotanicalCrestIcon } from "@/components/ui/BotanicalCrestIcon";
import SiteFooter from "@/components/ui/SiteFooter";
import { HotspotPin } from "@/components/ui/HotspotPin";
import PlaceCarousel from "@/components/PlaceCarousel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eEase, eHor, eIn, eInOut, eOut } from "@/lib/eases";
import TypeCarousel from "@/components/TypeCarousel";
import AmenitySlider from "@/components/AmenitySlider";
import AmenityBand from "@/components/AmenityBand";
import InterGallery from "@/components/InterGallery";
import {
  amenities,
  architecture,
  arc,
  bloom,
  brand,
  collections,
  collectionsIntro,
  concept,
  footer,
  hero,
  interiors,
  map,
  place,
  pull,
  views,
  sky,
} from "@/lib/content";

// ============================================================================
// The one-pager, choreographed against the side rail's percentage readout.
// Rail points are the shared coordinate system with the client:
//
//   1– 9  HERO      sticky screen; a camera descends one seamless world —
//                   CSS sky above, the photograph below with its top dissolved
//                   into that sky — while the lockup fades and floats away;
//                   then the frame holds while the dome band climbs over it
//  10–12  ARC       the dome band climbs in from below; the promise's words
//                   push apart from each other as it arrives
//  13–21  PLACE     one held screen: a bold title over its photograph, both
//                   changing every four seconds — the title lifting away
//                   letter by letter, the next revealing from its first
//  16–21  PLACE     one held screen: a marquee title the scroll draws across,
//                   a 16:10 carousel of the grounds, three lines and a kicker
//  22–25  BLOOM     bougainvillea in two corners; the line assembles word by
//                   word and lands on full weight exactly at 25
//  25–42  ROAD      the page turns sideways: concept panel (27–28), the
//                   three-line title (29–33), the route and its cities (34–40)
//  42–    SKY       vertical again — clouds drift right→left over the valley
//
// Everything after SKY is the existing vertical stack. Pins and pans are
// desktop-only and reduced-motion-gated; below 861px and under PRM every
// chapter collapses to a plain scrolling column.
//
// Values marked "measured" were read off the reference site directly rather
// than eyeballed — see lib/eases.ts for its five easing curves.
// ============================================================================

/** Licensed CC0 bougainvillea cut-out; `lite` is the lifted copy for dark bands. */
function Bloom({
  cls,
  lite,
  flip,
}: {
  cls: string;
  lite?: boolean;
  flip?: boolean;
}) {
  return (
    <img
      className={`n-bloom__vine ${cls}`}
      src={lite ? "/flora/flora-lite-1400.webp" : "/flora/flora-1400.webp"}
      /* the cut-out was 1021px wide for slots needing 630-780 device px and
         carried no srcset at all; the `w` values are the files' real intrinsic
         widths, not their (height-derived) names */
      srcSet={
        lite
          ? "/flora/flora-lite-780.webp 780w, /flora/flora-lite-1400.webp 1021w"
          : "/flora/flora-780.webp 780w, /flora/flora-1400.webp 1021w"
      }
      sizes="(max-width: 860px) 52vw, clamp(240px, 22vw, 420px)"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={1021}
      height={1400}
      data-flip={flip || undefined}
    />
  );
}

/** Splits a string into word spans so each can be animated on its own. */
function Words({ text, cls }: { text: string; cls?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className={cls} key={w + i}>
          {w}
        </span>
      ))}
    </>
  );
}

export default function HomeView() {
  const root = useRef<HTMLDivElement | null>(null);
  const [night, setNight] = useState(false);
  // A CSS-hidden next/Image still downloads: the night photograph cost every
  // visitor 145 KB at opacity 0. It mounts on the first tap of BY NIGHT and
  // stays mounted after, so the toggle only pays once.
  const [wasNight, setWasNight] = useState(false);

  // the phone architecture pair closes its gap once, on entry
  useEffect(() => {
    const pair = root.current?.querySelector<HTMLElement>(".n-archi__pair");
    if (!pair) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pair.dataset.joined = "";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        pair.dataset.joined = "";
      },
      { threshold: 0.35 },
    );
    io.observe(pair);
    // this content mounts after hydration and adds height to the document
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      io.disconnect();
      cancelAnimationFrame(r);
    };
  }, []);

  // which collection the phone rail is showing — an observer on the cards,
  // not a scroll calculation, so it is right whether the rail was swiped,
  // flung, or reached by keyboard
  const cards = useRef<HTMLDivElement | null>(null);
  const [card, setCard] = useState(0);
  useEffect(() => {
    const el = cards.current;
    if (!el) return;
    const kids = Array.from(el.children);
    const io = new IntersectionObserver(
      (rows) => {
        const hit = rows
          .filter((r) => r.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setCard(kids.indexOf(hit.target));
      },
      { root: el, threshold: [0.5, 0.75] },
    );
    kids.forEach((k) => io.observe(k));
    return () => io.disconnect();
  }, []);

  // the credits screen: any number of lines may stand open at once
  const [creds, setCreds] = useState<number[]>([]);
  const toggleCred = (i: number) =>
    setCreds((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  // ---- scroll choreography -------------------------------------------------
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const q = <T extends HTMLElement>(s: string) => el.querySelector<T>(s);

    mm.add(
      "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
      () => {
        // ---- 1–9 · HERO ------------------------------------------------------
        // The sky-to-estate camera. The stage holds one tall "world": a CSS sky
        // in its upper part and the photograph parked below the fold, its top
        // edge dissolved into the sky by a mask. Scrolling pans the whole world
        // up as one plane until the photograph's top meets the viewport's top.
        const hd = q(".n-hero");
        const estate = q(".n-hero__bg");
        if (hd && estate) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: hd,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          // 1 · the descent: sky and photograph travel together, no seam. The
          //     camera travels the whole picture — sky, palm and roofs, the
          //     terrace, down to the pool and the fronds at its foot — and comes
          //     to rest with the photograph's bottom edge on the viewport's.
          //     Only after that does the hero let go and the dome band follow.
          //     The pin is 220svh of travel; the descent takes the first 120svh
          //     (t 0→0.545). For the remaining 100svh the frame holds still and
          //     the dome band climbs over it until it fills the screen.
          tl.to(
            ".n-hero__world",
            {
              y: () =>
                -(estate.offsetTop + estate.offsetHeight - window.innerHeight),
              ease: "power1.inOut",
              duration: 0.545,
            },
            0,
          )
            // 2 · the lockup dissolves and floats up before the palm crown,
            //     the first of the estate to rise, reaches it (≈ t 0.21)
            .to(
              ".n-hero__fore",
              {
                autoAlpha: 0,
                y: -60,
                scale: 0.94,
                ease: "power1.out",
                duration: 0.18,
              },
              0.03,
            )
            .to(
              ".n-hero__hint",
              { opacity: 0, duration: 0.06, ease: "none" },
              0.02,
            )
            // 3 · the bottom rail (anchors + switch) holds through the descent,
            //     then fades just before the dome band starts rising over the
            //     held frame at t≈0.545, so nothing of it shows through the
            //     band's open corners
            .to(
              [".n-hero__meta", ".n-hero__switch"],
              { autoAlpha: 0, ease: "none", duration: 0.07 },
              0.46,
            )
            // 4 · a silent hold to the end of the pin. The scrub stretches the
            //     timeline's TOTAL length over the scroll range, so without this
            //     the 0.545 descent would itself be stretched over everything;
            //     with it, the descent ends at 0.545 and the frame holds while
            //     the dome band climbs over it.
            .to({}, { duration: 0.455 }, 0.545);
        }

        // ---- 10–12 · ARC climbs in, and its words push apart -----------------
        el.querySelectorAll<HTMLElement>(".n-arch").forEach((band) => {
          gsap.fromTo(
            band,
            { "--dome": "50% 12vh" },
            {
              "--dome": "0% 0vh",
              ease: "none",
              scrollTrigger: {
                trigger: band,
                start: "top 96%",
                end: "top 22%",
                scrub: 1,
              },
            },
          );
        });
        const arcBand = q(".n-arc");
        if (arcBand) {
          // the band itself rides up into place
          gsap.fromTo(
            ".n-arc__in",
            { yPercent: 14 },
            {
              yPercent: 0,
              ease: eEase,
              scrollTrigger: {
                trigger: arcBand,
                start: "top bottom",
                end: "top 30%",
                scrub: 0.6,
              },
            },
          );
          // the crest's words drift apart with the scroll. Each word after the
          // first gets the same extra advance (dx) along the arc; because the
          // line is anchored at its middle, that reads as every word sliding
          // away from the centre — the left half leftward, the right half
          // rightward, the outer words fastest — so the line spreads as the
          // page scrolls down and gathers again as it scrolls up.
          const crestWords = el.querySelectorAll<SVGTSpanElement>(
            ".n-arc__promise tspan",
          );
          if (crestWords.length > 1) {
            const SPREAD = 30; // extra advance per gap at full spread, in the SVG's units
            const state = { q: 0 };
            const layout = () =>
              crestWords.forEach((w, i) =>
                w.setAttribute("dx", i ? String(SPREAD * state.q) : "0"),
              );
            gsap.to(state, {
              q: 1,
              ease: "none",
              onUpdate: layout,
              scrollTrigger: {
                trigger: arcBand,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            });
          }
        }

        // (13–20 · PLACE runs on its own clock — see PlaceCarousel)

        // ---- 21 · the photograph drifts; its line outruns it ------------------
        const pullBand = q(".n-pull");
        if (pullBand) {
          gsap.fromTo(
            ".n-pull__bg",
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: pullBand,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
          gsap.fromTo(
            ".n-pull__say",
            { yPercent: 28 },
            {
              yPercent: -28,
              ease: "none",
              scrollTrigger: {
                trigger: pullBand,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.25,
              },
            },
          );
        }

        // ---- 22–25 · the line assembles and lands on full weight -------------
        const bloomBand = q(".n-bloom");
        if (bloomBand) {
          gsap.fromTo(
            ".n-bloom__line span",
            { autoAlpha: 0, yPercent: 60, filter: "blur(9px)" },
            {
              autoAlpha: 1,
              yPercent: 0,
              filter: "blur(0px)",
              ease: "power2.out",
              stagger: 0.05,
              scrollTrigger: {
                trigger: bloomBand,
                start: "top 72%",
                end: "center 42%",
                scrub: 0.8,
              },
            },
          );
          // NO weight journey (client 2026-08-11: "it must not change look of
          // text, only appearance") — the scrubbed 300→700 wght left the line
          // thin and wide-tracked exactly while it was centred and readable.
          // The line now RESTS at its full designed weight in CSS; motion only
          // controls how the words arrive.
          gsap.fromTo(
            ".n-bloom__vine",
            { autoAlpha: 0, scale: 1.12 },
            {
              autoAlpha: 1,
              scale: 1,
              ease: "power2.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: bloomBand,
                start: "top 88%",
                end: "top 34%",
                scrub: 0.8,
              },
            },
          );
        }

        // ---- 25–42 · the page turns sideways ---------------------------------
        const loc = q(".n-loc");
        const track = q(".n-loc__track");
        if (loc && track) {
          const dist = () => {
            const last = track.lastElementChild as HTMLElement | null;
            if (!last) return 0;
            const pad = parseFloat(getComputedStyle(track).paddingRight) || 0;
            return Math.max(
              0,
              last.offsetLeft + last.offsetWidth + pad - window.innerWidth,
            );
          };
          const pan = gsap.to(track, {
            x: () => -dist(),
            ease: eHor, // the reference's own "horScroll" curve, sampled
            scrollTrigger: {
              trigger: loc,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
            // the fixed chrome re-tests what lies under it on scroll events;
            // the scrubbed pan keeps moving after the last one, so tell it
            onUpdate: () => window.dispatchEvent(new Event("scroll")),
          });

          // 27–28 · the concept panel sharpens as it arrives
          gsap.fromTo(
            ".n-loc__concept .n-loc__card",
            { autoAlpha: 0, scale: 0.86 },
            {
              autoAlpha: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: loc,
                start: "top 34%",
                end: "top top",
                scrub: 0.5,
              },
            },
          );

          // 29–33 · three lines, three speeds. Measured off the reference:
          //   line 1  -5 → +5     line 2  +25 → -25 (runs backwards)
          //   line 3  -15 → +25
          const LINES: Array<[number, number]> = [
            [-5, 5],
            [25, -25],
            [-15, 25],
          ];
          el.querySelectorAll<HTMLElement>(".n-loc__lines span").forEach(
            (s, i) => {
              const [from, to] = LINES[i % LINES.length];
              gsap.fromTo(
                s,
                { xPercent: from },
                {
                  xPercent: to,
                  ease: "none",
                  scrollTrigger: {
                    trigger: loc,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.25,
                  },
                },
              );
            },
          );

          // the vines drift through the chapter at their own rates
          gsap.to(".n-loc__concept .n-bloom__vine", {
            xPercent: -25,
            ease: "none",
            scrollTrigger: {
              trigger: loc,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.25,
            },
          });
          gsap.to(".n-loc__path .n-bloom__vine", {
            yPercent: 25,
            ease: "none",
            scrollTrigger: {
              trigger: loc,
              start: "bottom bottom",
              end: "bottom top",
              scrub: 0.25,
            },
          });

          // 34–40 · the route wipes in as it enters from the right
          const routeWrap = q(".n-loc__routeWrap");
          if (routeWrap) {
            gsap.fromTo(
              routeWrap,
              { clipPath: "inset(0% 100% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 2.4,
                ease: eInOut,
                scrollTrigger: {
                  trigger: routeWrap,
                  containerAnimation: pan,
                  start: "left 80%",
                  once: true,
                },
              },
            );
            gsap.from(".n-loc__route li", {
              y: 26,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: routeWrap,
                containerAnimation: pan,
                start: "left 70%",
                once: true,
              },
            });
          }
        }

        // ---- 42 · the valley arrives under the drifting cloud ----------------
        // the photograph moves slowly; the cloud layer above it travels about
        // four times as far over the same scroll, so the sky outruns the land
        gsap.fromTo(
          ".n-sky__fig img",
          { scale: 1.16, yPercent: -5 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: ".n-sky",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          ".n-sky__clouds",
          { yPercent: -20 },
          {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: ".n-sky",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.35,
            },
          },
        );

        // ---- the later chapters (unchanged) ----------------------------------
        gsap.fromTo(
          ".n-flower.f-cols",
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: ".n-cols",
              start: "top 125%",
              end: "bottom -25%",
              scrub: 0.5,
            },
          },
        );

        const am = q(".n-amen");
        if (am) {
          gsap.to(".n-amen__bg img", {
            scale: 2,
            transformOrigin: "50% 50%",
            ease: eIn,
            scrollTrigger: {
              trigger: am,
              start: "top top",
              end: () =>
                "+=" +
                Math.max(1, (am.offsetHeight - window.innerHeight) * 0.7),
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          gsap.to(".n-amen__intro", {
            autoAlpha: 0,
            ease: eIn,
            scrollTrigger: {
              trigger: am,
              start: "top top",
              end: () =>
                "+=" +
                Math.max(1, (am.offsetHeight - window.innerHeight) * 0.55),
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          el.querySelectorAll<HTMLElement>(".n-amen__item").forEach((it) => {
            gsap.fromTo(
              it,
              { opacity: 0.28 },
              {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: it,
                  start: "top 72%",
                  end: "top 40%",
                  scrub: 1,
                },
              },
            );
          });
        }

        // era's rail-73 counter-drift, measured: whole COLUMNS ride ±10
        // yPercent at scrub 0.5 (left down, right up), the flower opposite
        gsap.fromTo(
          ".n-inter__col.is-l",
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: ".n-inter__field",
              start: "top 125%",
              end: "bottom -25%",
              scrub: 0.5,
            },
          },
        );
        gsap.fromTo(
          ".n-inter__col.is-r",
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: ".n-inter__field",
              start: "top 125%",
              end: "bottom -25%",
              scrub: 0.5,
            },
          },
        );
        gsap.fromTo(
          ".n-flower.f-inter",
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: ".n-inter",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );

        // ---- 10 · the architecture sequence: converge → join → grow → the word
        const seq = q(".n-archseq");
        const pair = q(".n-archseq__pair");
        if (seq && pair) {
          const letters = seq.querySelectorAll<HTMLElement>(".n-archseq__li");
          // the scale that makes the joined frame cover the screen. offsetWidth
          // is the layout size, unaffected by the transform, so this stays
          // right even while the tween is running.
          const fill = () =>
            Math.max(
              window.innerWidth / pair.offsetWidth,
              window.innerHeight / pair.offsetHeight,
            );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: seq,
              start: "top top",
              end: () => "+=" + window.innerHeight * 3,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          tl
            // A · the two frames converge — the left rises, the right settles,
            //     until they stand equal
            .fromTo(
              ".n-archseq__panel.is-l",
              { yPercent: 10, scale: 0.93 },
              { yPercent: 0, scale: 1, duration: 0.3, ease: eInOut },
              0,
            )
            .fromTo(
              ".n-archseq__panel.is-r",
              { yPercent: -10, scale: 0.93 },
              { yPercent: 0, scale: 1, duration: 0.3, ease: eInOut },
              0,
            )
            // B · they join: the gap between them closes
            .to(pair, { "--gap": "0vw", duration: 0.14, ease: eInOut }, 0.32)
            // C · the joined frame grows until it covers the screen
            .to(pair, { scale: fill, duration: 0.34, ease: eInOut }, 0.46)
            // D · the word arrives over it, letter by letter
            .fromTo(
              letters,
              { yPercent: 115 },
              { yPercent: 0, duration: 0.18, ease: eOut, stagger: 0.022 },
              0.8,
            );
        }

        // ---- 10c · the views screen: type over picture, then the frame closes
        const vw = q(".n-views");
        if (vw) {
          const vtl = gsap.timeline({
            scrollTrigger: {
              trigger: vw,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          vtl
            // the type climbs faster than the picture beneath it
            .fromTo(
              ".n-views__fore",
              { yPercent: 10 },
              { yPercent: -32, ease: "none", duration: 1 },
              0,
            )
            // The picture pulls back AND drifts, so it moves against the type
            // rather than only shrinking under it. It lands at 1.08 rather
            // than 1 for a reason: object-fit: cover leaves no spare picture
            // at scale 1, and a yPercent drift there would walk the frame's
            // own edge into view. 8% over the box is 4% of slack top and
            // bottom, and the drift asks for 2.2% x 1.08 = 2.4%.
            .fromTo(
              ".n-views__bg img",
              { scale: 1.14, yPercent: -2.2 },
              { scale: 1.08, yPercent: 2.2, ease: "none", duration: 1 },
              0,
            )
            // the picture pulls back into a frame; the wine opens on all four sides
            .fromTo(
              ".n-views__bg",
              { clipPath: "inset(0svh 0vw 0svh 0vw)" },
              {
                clipPath: "inset(11svh 15vw 11svh 15vw)",
                ease: eInOut,
                duration: 0.4,
              },
              0.55,
            )
            .to(
              ".n-views__orb",
              { autoAlpha: 0, ease: "none", duration: 0.12 },
              0.5,
            )
            // the type clears away as the frame closes, so the framed picture
            // stands alone on the wine
            .to(
              ".n-views__fore",
              { autoAlpha: 0, ease: "none", duration: 0.16 },
              0.6,
            );

          // THE PICTURE'S ARRIVAL. Every other photograph on this page wipes
          // in behind the same slanted blade; this one had nothing — it was
          // simply already there when you reached it, which is why the band
          // read as flat wine with type on it for the split second before the
          // photograph decoded.
          //
          // The blade goes on the IMG, not on the figure. The figure's
          // clip-path is already spoken for by the frame close above, and one
          // element cannot carry two of them.
          //
          // And it parks ONLY if the section is still below the reveal line at
          // effect time. A parked clip whose trigger never fires leaves a
          // full-screen photograph clipped to a sliver — invisible, exactly
          // the failure this section was just reported for — so the safe state
          // is "unparked", and the reveal opts in rather than out.
          const vimg = q<HTMLElement>(".n-views__bg img");
          if (vimg && vw.getBoundingClientRect().top > window.innerHeight * 0.82) {
            const blade = { u: 1 };
            const paint = () => {
              const u = blade.u;
              vimg.style.clipPath = `polygon(${(100 * u).toFixed(3)}% 0%, 100% 0%, ${(100 + u).toFixed(3)}% 100%, ${(125 * u).toFixed(3)}% 100%)`;
            };
            paint();
            gsap.to(blade, {
              u: 0,
              duration: 1.4,
              ease: eInOut,
              scrollTrigger: { trigger: vw, start: "top 82%", once: true },
              onUpdate: paint,
              onComplete: () => {
                vimg.style.clipPath = "none";
              },
            });
          }
        }
      },
    );

    // ---- all widths with motion ------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---- ARRIVAL REVEALS — the reference's language, measured live
      // 2026-08-11. TEXT rides out of an overflow-clip mask: parked at
      // exactly 110% of its own height, ~0.9s out-ease, 0.1s per line.
      // PHOTOS wipe in behind the same slanted blade as the collections
      // carousel — clip polygon(100u% 0, 100% 0, (100+u)% 100, 125u% 100)
      // with the print counter-dragging scale 1+0.5u, x +0.25·width·u —
      // measured a touch slower on content photos (~1.4s) than in the
      // carousel (1.22s). Everything is parked HERE, at effect time, never
      // in CSS: a no-JS visitor must get the whole page standing still.
      el.querySelectorAll<HTMLElement>("[data-rise]").forEach((n) => {
        // line groups (the big stacked headings) carry one mask per line
        // in the markup; the script accent fades instead — a clip mask
        // would cut its swashes
        if (n.dataset.lines !== undefined) {
          const movers = n.querySelectorAll<HTMLElement>(".n-li");
          const fades = n.querySelectorAll<HTMLElement>(".n-fade");
          gsap.set(movers, { yPercent: 110 });
          if (fades.length) gsap.set(fades, { autoAlpha: 0, y: 18 });
          ScrollTrigger.create({
            trigger: n,
            start: "top 86%",
            once: true,
            onEnter: () => {
              gsap.to(movers, {
                yPercent: 0,
                duration: 0.9,
                ease: eOut,
                stagger: 0.1,
                delay: 0.15,
              });
              if (fades.length)
                gsap.to(fades, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9,
                  ease: eOut,
                  delay: 0.45,
                });
            },
          });
          return;
        }
        // simple text blocks get one mask, built once, post-hydration —
        // these subtrees are static, React never re-renders them. Buttons
        // and containers (dl, lists, grids) keep the plain rise: a block
        // wrapper would break their layout or semantics.
        if (/^(H1|H2|H3|H4|P|SPAN|EM|STRONG)$/.test(n.tagName)) {
          if (!n.querySelector(":scope > .n-li")) {
            const inner = document.createElement("span");
            inner.className = "n-li";
            while (n.firstChild) inner.appendChild(n.firstChild);
            n.appendChild(inner);
            n.classList.add("n-lm");
          }
          const mover = n.querySelector<HTMLElement>(":scope > .n-li");
          if (mover) {
            gsap.set(mover, { yPercent: 110 });
            gsap.to(mover, {
              yPercent: 0,
              duration: 0.9,
              ease: eOut,
              delay: 0.15,
              scrollTrigger: { trigger: n, start: "top 86%", once: true },
            });
          }
          return;
        }
        gsap.from(n, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: n,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      });
      el.querySelectorAll<HTMLElement>(".n-media").forEach((f) => {
        // full-bleed scrub bands keep their own mechanics; the road's
        // figures live inside a containerAnimation and cannot take a
        // plain trigger; the carousel wipes itself
        if (
          f.closest(".n-pull") ||
          f.closest(".n-place") ||
          f.closest(".n-hero") ||
          f.closest(".n-warea") ||
          f.closest(".n-sky") ||
          f.closest(".n-amen") ||
          f.closest(".n-loc") ||
          f.closest(".n-tycar")
        )
          return;
        const im = f.querySelector("img");
        if (!im) return;
        gsap.fromTo(
          im,
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: f,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
        // the blade (scale/x merge with the parallax's yPercent — GSAP
        // tracks the components independently)
        const bw = f.getBoundingClientRect().width || 400;
        const blade = { u: 1 };
        gsap.set(f, {
          clipPath: "polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)",
        });
        gsap.set(im, { scale: 1.5, x: 0.25 * bw });
        gsap.to(blade, {
          u: 0,
          duration: 1.4,
          ease: eInOut,
          scrollTrigger: { trigger: f, start: "top 82%", once: true },
          onUpdate: () => {
            const u = blade.u;
            f.style.clipPath = `polygon(${(100 * u).toFixed(3)}% 0%, 100% 0%, ${(100 + u).toFixed(3)}% 100%, ${(125 * u).toFixed(3)}% 100%)`;
            gsap.set(im, { scale: 1 + 0.5 * u, x: 0.25 * bw * u });
          },
          onComplete: () => {
            f.style.clipPath = "none";
            gsap.set(im, { scale: 1, x: 0 });
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  const toggle = (toNight: boolean) => {
    // first tap: mount the photograph in its own commit, then flip the state
    // a frame later, so the 700ms crossfade still has an opacity:0 to run from
    if (toNight && !wasNight) {
      setWasNight(true);
      requestAnimationFrame(() => setNight(true));
      return;
    }
    setNight(toNight);
  };

  return (
    <div className="nv" ref={root}>
      {/* ═══ 1–9 · HERO ═══════════════════════════════════════════════════ */}
      <section className="n-hero" data-dark>
        <div className="n-hero__stage">
          {/* the world: one plane the camera pans — the CSS sky on top, the
              photograph parked below the fold with its top edge dissolved into
              that sky, so the two read as a single continuous picture */}
          <div className="n-hero__world" data-night={night || undefined}>
            {/* the CSS sky carries its own high cloud, so the photograph's
                clouds are not the first ones on screen — the plate is the
                photograph's own cirrus taken the right way up and recomposed
                to the left, away from the nav (scripts/hero-sky.mjs) */}
            <div className="n-hero__sky" aria-hidden="true">
              <span className="n-hero__above" />
            </div>
            <div className="n-hero__bg">
              <div className="n-hero__media n-media">
                {/* `priority` preloads but does NOT emit fetchpriority in this
                  Next version (verified: the attribute was absent) — the LCP
                  image asks for the high lane explicitly */}
                <Image
                  placeholder="blur"
                  quality={65}
                  src={hero.images.day}
                  alt={hero.alt.day}
                  fill
                  sizes="100vw"
                  priority
                  fetchPriority="high"
                  className="day"
                />
                {wasNight ? (
                  <Image
                    placeholder="blur"
                    quality={65}
                    src={hero.images.night}
                    alt={hero.alt.night}
                    fill
                    sizes="100vw"
                    loading="eager"
                    className="night"
                  />
                ) : null}
              </div>
              {/* hotspots: pulse pins anchored to the photograph's features */}
              {hero.hotspots.map((h) => (
                <HotspotPin key={h.label} x={h.x} y={h.y} label={h.label} />
              ))}
            </div>
          </div>

          <div className="n-hero__fore">
            <p className="n-hero__place">{hero.place}</p>
            <div className="n-hero__mark">
              <span className="w1">{brand.word1}</span>
              <span className="w2">{brand.word2}</span>
              <span className="script">{brand.script}</span>
            </div>
          </div>

          {/* the bottom rail lives outside the rising layer: the anchors and
              the switch stay on the bottom margin while the title lifts away */}
          <div className="n-hero__meta" aria-hidden="true">
            <span className="n-hero__titleA">{hero.lineA}</span>
            <span className="n-hero__titleB">{hero.lineB}</span>
          </div>
          <div className="n-hero__switch" role="group" aria-label="Time of day">
            <button
              type="button"
              aria-pressed={!night}
              className={night ? "" : "on"}
              onClick={() => toggle(false)}
            >
              {hero.switch.day}
            </button>
            <i aria-hidden="true" />
            <button
              type="button"
              aria-pressed={night}
              className={night ? "on" : ""}
              onClick={() => toggle(true)}
            >
              {hero.switch.night}
            </button>
          </div>

          {/* one string, not five expressions: JSX's whitespace handling
              between adjacent expressions is what ran the two title halves
              together as "A HOUSEWORTH THE ROAD HOME" */}
          <h1 className="n-sr">{`${hero.lineA} ${hero.lineB} — ${brand.full}, ${brand.tagline}`}</h1>
          <span className="n-hero__hint">{hero.scrollHint}</span>
        </div>
      </section>

      {/* ═══ 10–12 · ARC ══════════════════════════════════════════════════ */}
      {/* the reference, measured 2026-08-11: the band's top corners carry a
          radius equal to its FULL HEIGHT (their 720px on a 1425×720 section)
          — a true circular crest rising over the hero photo. The headline is
          one centred string on a concentric arc just inside the dome's edge,
          spanning the crest rather than the whole rim; the dome's middle is
          left open, and the place lockup with its rule sits at the foot. */}
      <section className="n-arch n-arc" id="approach" data-light>
        <h2 className="n-arc__promise" aria-label={arc.promise.join(" ")}>
          <svg
            viewBox="0 0 1440 720"
            preserveAspectRatio="xMidYMin meet"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {/* concentric with the dome, 60 units inside its edge */}
              <path
                id="n-arc-crest"
                d="M 120,700 A 600,600 0 0 1 1320,700"
                fill="none"
              />
            </defs>
            <text>
              <textPath
                href="#n-arc-crest"
                startOffset="50%"
                textAnchor="middle"
              >
                {/* one tspan per word, so each can slide along the arc on its own */}
                {arc.promise
                  .join(" ")
                  .split(" ")
                  .map((w, i) => (
                    <tspan key={`${w}-${i}`}>
                      {i ? " " : ""}
                      {w}
                    </tspan>
                  ))}
              </textPath>
            </text>
          </svg>
        </h2>
        <div className="n-arc__in">
          <div className="n-arc__region">
            <span>{arc.region[0]}</span>
            <BotanicalCrestIcon className="n-arc__mark" />
            <span>{arc.region[1]}</span>
          </div>
          {/* a hairline dropping straight down from the lockup to the band's foot */}
          <span className="n-arc__rule" aria-hidden="true" />
        </div>
      </section>

      {/* ═══ 13–21 · PLACE ════════════════════════════════════════════════ */}
      {/* the reference's concept screen: one held viewport — a bold condensed
          title over a rigid 16:10 photograph, a control row, a line of copy
          and the two-line kicker. Title, photograph and copy change every
          four seconds: the title lifts away letter by letter and the next
          reveals from its first letter. See PlaceCarousel. */}
      {/* no aria-label here: the carousel inside is already a named region,
          and n-place-title is the CURRENT SLIDE's title — a landmark whose
          name changed every few seconds */}
      <section className="n-place" id="concept" data-light>
        <PlaceCarousel
          slides={place.slides}
          interval={place.interval}
          label={place.label}
          kicker={place.kicker}
          pauseLabel={place.pause}
          playLabel={place.play}
        />
      </section>

      {/* ═══ 21 · PULL ════════════════════════════════════════════════════ */}
      {/* the reference's pull quote: the estate full-bleed, its sky running
          on from the blue above through a dissolve, and the architecture
          team's line set large in white over the pool — quote mark above,
          credit beneath. The photograph drifts on scroll; the line outruns it. */}
      <section className="n-pull" id="voice" data-dark>
        <figure className="n-pull__bg n-media">
          <Image
            placeholder="blur"
            quality={65}
            src={pull.img}
            alt={pull.alt}
            fill
            sizes="100vw"
          />
        </figure>
        <blockquote className="n-pull__say">
          <span className="n-pull__mark" aria-hidden="true">
            “
          </span>
          <p>{pull.quote}</p>
          <footer className="n-pull__by">
            <strong>{pull.by}</strong>
            <span>{pull.of}</span>
          </footer>
        </blockquote>
      </section>

      {/* ═══ 22–25 · BLOOM ════════════════════════════════════════════════ */}
      <section className="n-bloom" id="slow" data-light>
        <Bloom cls="tl" />
        <Bloom cls="br" flip />
        <p className="n-bloom__line" aria-hidden="true">
          <Words text={bloom.line} />
        </p>
        <p className="n-bloom__foot">{bloom.foot}</p>
      </section>

      {/* ═══ 25–42 · THE ROAD, SIDEWAYS ═══════════════════════════════════ */}
      {/* the panels carry their own surface flag — the track pans sideways, so
          a cream panel and a wine panel occupy the same vertical range */}
      <section className="n-loc" id="where" aria-label="Where the homes are">
        <div className="n-loc__screen">
          <div className="n-loc__track">
            {/* 27–28 · the concept panel */}
            <div className="n-loc__panel n-loc__concept" data-light>
              <Bloom cls="p-tl" lite />
              <Bloom cls="p-br" lite flip />
              <div className="n-loc__card">
                <span className="n-label">{concept.label}</span>
                <h2 className="n-loc__statement">
                  {concept.lines.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </h2>
                <p className="n-loc__side">{concept.side}</p>
                <svg
                  className="n-loc__orn"
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                >
                  <path
                    d="M20 2 L26 14 L38 20 L26 26 L20 38 L14 26 L2 20 L14 14 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <circle cx="20" cy="20" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* 29–33 · three words, three speeds — the reference's NEW GOLDEN
                MILE panel: cream ground, the heavy condensed title stepping
                down the left and overlapping the photograph's edge, the
                photograph the panel's full height, the subtitle and paragraph
                plain at the lower right, the bougainvillea cut in the lower-
                left corner, and the round call-to-action peeking in at the
                right edge as the pan carries on */}
            <div className="n-loc__panel n-loc__intro" data-light>
              <Bloom cls="i-bl" lite />
              <h3 className="n-loc__lines" aria-label={map.intro.join(" ")}>
                {map.intro.map((l) => (
                  <span key={l} aria-hidden="true">
                    <i>{l}</i>
                  </span>
                ))}
              </h3>
              <figure className="n-loc__shot n-media">
                <Image
                  placeholder="blur"
                  quality={65}
                  src={map.introImg}
                  alt={map.introImgAlt}
                  fill
                  sizes="(max-width: 860px) 80vw, 40vw"
                />
              </figure>
              <div className="n-loc__note">
                <h4>{map.introHead}</h4>
                <p>{map.introCopy}</p>
              </div>
              <a className="n-loc__orb" href="/homes">
                {map.introCta}
              </a>
            </div>

            {/* 34–40 · the route and its cities */}
            <div className="n-loc__panel n-loc__path" data-light>
              {/* the panel is cream now: the plain cut, not the lifted one */}
              <Bloom cls="r-tr" flip />
              <span className="n-label">{map.pathLabel}</span>
              <div className="n-loc__routeWrap">
                <div className="n-loc__route">
                  <svg
                    viewBox="0 0 1000 120"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M20,80 C180,20 320,110 500,60 C680,10 820,95 980,45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                  <ol>
                    {map.nodes.map((n) => (
                      <li key={n.place}>
                        <i />
                        <strong>{n.place}</strong>
                        <em>{n.note}</em>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <p className="n-loc__foot">{map.foot}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 42 · SKY ═════════════════════════════════════════════════════ */}
      <section className="n-sky" id="sky" data-dark>
        <figure className="n-sky__fig">
          <Image
            placeholder="blur"
            quality={65}
            src={sky.img}
            alt={sky.alt}
            fill
            sizes="100vw"
          />
        </figure>
        {/* three depth layers, the reference's count — smaller and slower
            reads as farther away */}
        <div className="n-sky__clouds" aria-hidden="true">
          <span className="n-sky__drift" />
          <span className="n-sky__drift d2" />
          <span className="n-sky__drift d3" />
        </div>
        <div className="n-sky__place">
          <strong>{sky.city}</strong>
          <em>{sky.country}</em>
          <i>{sky.note}</i>
        </div>
      </section>

      {/* ═══ the later chapters, unchanged ════════════════════════════════ */}
      <section className="n-arch n-cols" id="collections" data-light>
        <div className="n-flower f-cols" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <g className="spin">
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="96"
                ry="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="34"
                ry="96"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <circle cx="100" cy="100" r="8" fill="currentColor" />
            </g>
          </svg>
        </div>
        <p className="n-running" data-rise>
          {collectionsIntro.running}
        </p>
        <h2 className="n-cols__lines" data-rise data-lines>
          {collectionsIntro.lines.map((l) => (
            <span key={l}>
              <i className="n-li">{l}</i>
            </span>
          ))}
        </h2>
        {/* On a phone the four collections stacked into 3,285px — 3.9
            viewports of near-identical blocks where a wide screen gets one
            pinned screen. Below 861px the CSS turns this into a snapped
            horizontal rail; the readout under it says where you are. */}
        <div className="n-cards" ref={cards}>
          {collections.map((c) => (
            <article className="n-card" key={c.slug}>
              <div className="n-card__spec">
                <div className="cell">
                  <span className="k">Bedrooms</span>
                  <span className="v">{c.bedrooms}</span>
                </div>
                <div className="cell">
                  <span className="k">Area</span>
                  <span className="v">{c.area}</span>
                </div>
              </div>
              <figure className="n-card__fig n-media">
                <Image
                  placeholder="blur"
                  quality={65}
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 860px) 92vw, 40vw"
                />
              </figure>
              <div className="n-card__body">
                <p>{c.copy}</p>
                {c.status === "soon" ? (
                  <span className="n-pill is-static">Coming soon</span>
                ) : (
                  <button
                    type="button"
                    className="n-pill"
                    onClick={() =>
                      window.dispatchEvent(new Event("noratun:call"))
                    }
                  >
                    Ask about {c.place} <span aria-hidden>→</span>
                  </button>
                )}
              </div>
              <h3 className="n-card__name">
                {c.name} <span className="place">{c.place}</span>
              </h3>
            </article>
          ))}
        </div>
        <p className="n-cards__at" aria-hidden="true">
          <span className="n">{String(card + 1).padStart(2, "0")}</span>
          <span className="bar">
            <i
              style={{
                transform: `scaleX(${(card + 1) / collections.length})`,
              }}
            />
          </span>
          <span className="t">
            {String(collections.length).padStart(2, "0")}
          </span>
        </p>
      </section>

      {/* the reference's type carousel (its rail 51) — MOVED layer only; the
          stacked cards above are the same four collections for phones/PRM/no-JS */}
      <TypeCarousel />

      <AmenityBand id="amenities" />

      {/* the reference's tab-driven amenity slider — MOVED layer only; the
          static band above is the same six amenities for phones/PRM/no-JS */}
      <AmenitySlider />

      {/* the reference's rail-73 anatomy, measured 2026-08-11: two columns
          counter-drifting ±10 yPercent (scrub 0.5) — the left seated a
          spacer lower with its portrait bleeding past the edge, captions,
          lead, lists and the call button riding INSIDE the columns — then
          an 83%-wide 8:5 gallery carousel running the same blade rig. */}
      <section className="n-arch n-inter" id="interiors" data-light>
        {/* the ground in two pieces: the crown, a great circle clipped so
            that outside it the band is not there at all (hit tests fall
            through to the photograph beneath), and the solid cream from the
            circle's centre down */}
        <div className="n-inter__crown" aria-hidden="true" />
        <div className="n-inter__ground" aria-hidden="true" />
        <div className="n-flower f-inter" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <g className="spin">
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="96"
                ry="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="34"
                ry="96"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
            </g>
          </svg>
        </div>
        <h2 className="n-inter__stack" data-rise data-lines>
          {interiors.title.map((l) => (
            <span key={l}>
              <i className="n-li">{l}</i>
            </span>
          ))}
          <em className="script n-fade">{interiors.script}</em>
        </h2>
        {/* the statement, staggered: the first line stepped in, the rest flush */}
        <h3 className="n-inter__statement" data-rise data-lines>
          {interiors.statement.map((l) => (
            <span key={l}>
              <i className="n-li">{l}</i>
            </span>
          ))}
        </h3>
        <div className="n-inter__field">
          <div className="n-inter__col is-l">
            <figure className="n-media n-inter__imgL">
              <Image
                placeholder="blur"
                quality={65}
                src={interiors.images[2].src}
                alt={interiors.images[2].alt}
                fill
                sizes="(max-width: 860px) 92vw, 40vw"
              />
            </figure>
            <p className="n-inter__cap">{interiors.images[2].alt}</p>
          </div>
          <div className="n-inter__col is-r">
            <figure className="n-media n-inter__imgR">
              <Image
                placeholder="blur"
                quality={65}
                src={interiors.images[0].src}
                alt={interiors.images[0].alt}
                fill
                sizes="(max-width: 860px) 92vw, 40vw"
              />
            </figure>
            <p className="n-inter__copy" data-rise>
              {interiors.copy}
            </p>
            <div className="n-inter__lists" data-rise>
              <div>
                <h3>Every home</h3>
                <ul>
                  {interiors.standard.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>On request</h3>
                <ul>
                  {interiors.optional.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              className="n-inter__orb"
              onClick={() => window.dispatchEvent(new Event("noratun:call"))}
            >
              {interiors.cta}
            </button>
          </div>
        </div>
        <InterGallery />
      </section>

      <div className="n-warea" data-light>
        {/* two frames stand offset, converge until they are equal, join edge
            to edge, then the joined frame grows until it covers the screen
            and ARCHITECTURE arrives letter by letter */}
        <div className="n-archseq">
          {/* flagged dark: once the frame has grown over the screen the fixed
              chrome sits on photography and must read white — while the
              frames are still small the point falls on the cream behind */}
          <div className="n-archseq__pair" aria-hidden="true" data-dark>
            {/* one photograph, two windows onto it: each frame holds the
                picture at the pair's full width and offsets it by its own
                position, so when the gap closes the halves fall into
                register and read as a single picture */}
            {/* backgrounds, not next/Image: the sequence is display:none below
                861px but a hidden lazy <Image> still FETCHES (measured), so
                every phone was paying for two copies of a photograph it never
                saw. A background declared inside the desktop media query is
                only fetched where that query applies. GSAP animates the
                panels and the pair, never these, so nothing else changes. */}
            <figure className="n-archseq__panel is-l">
              <div className="n-archseq__slide" />
            </figure>
            <figure className="n-archseq__panel is-r">
              <div className="n-archseq__slide" />
            </figure>
          </div>
          <h2 className="n-archseq__word" aria-label={architecture.word}>
            {architecture.word.split("").map((ch, i) => (
              <span className="n-archseq__lm" key={i} aria-hidden="true">
                <span className="n-archseq__li">{ch}</span>
              </span>
            ))}
          </h2>
        </div>
        <div className="n-archscreen">
          <section className="n-archi" id="architecture">
            <h2 className="n-archi__word">{architecture.word}</h2>
            {/* The chapter was 212px of one word on cream below 861px — the
                sequence that carries its photograph is desktop-only. This is
                the same device at phone scale: one photograph through two
                windows, the gap closing once on entry.

                The picture is a CSS BACKGROUND, not a next/Image. Both
                standing rules apply here and only this satisfies both: a
                JS-off phone must still see the photograph (so it cannot be
                gated on matchMedia), and a wide screen must not pay for it
                (measured: a display:none lazy next/Image DOES fetch — the
                desktop build made four place-complex requests). A background
                declared inside the phone media query is never fetched at a
                width where the rule does not apply. */}
            <div className="n-archi__pair" aria-hidden="true">
              <figure className="n-archseq__panel is-l">
                <div className="n-archseq__slide" />
              </figure>
              <figure className="n-archseq__panel is-r">
                <div className="n-archseq__slide" />
              </figure>
            </div>
            <p className="n-archi__copy">{architecture.copy}</p>
          </section>
        </div>
      </div>

      {/* ═══ CREDITS ══════════════════════════════════════════════════════ */}
      {/* the reference's closing screen: the four credits set as lines in the
          condensed didone, each carrying a + that opens one line of fact
          beneath it */}
      <section className="n-creds" id="credits" data-light>
        <Bloom cls="c-tr" flip />
        <dl className="n-creds__list">
          {architecture.credits.map((c, i) => {
            const open = creds.includes(i);
            return (
              <div
                className="n-creds__row"
                key={c.label}
                data-open={open || undefined}
              >
                <dt>
                  <button
                    type="button"
                    className="n-creds__btn"
                    aria-expanded={open}
                    aria-controls={`n-cred-${i}`}
                    onClick={() => toggleCred(i)}
                  >
                    {c.label}
                    <i aria-hidden="true">+</i>
                  </button>
                </dt>
                <dd className="n-creds__info" id={`n-cred-${i}`}>
                  <span>{c.info}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* ═══ VIEWS ════════════════════════════════════════════════════════ */}
      {/* the picture fills the screen and the type climbs over it at its own
          rate; then the picture pulls back into a frame and the wine opens on
          all four sides, carrying on unbroken into the call and the footer */}
      <section
        className="n-views"
        id="views"
        data-dark
        aria-labelledby="n-views-title"
      >
        <div className="n-views__screen">
          <figure className="n-views__bg">
            <Image
              placeholder="blur"
              quality={65}
              src={views.img}
              alt={views.alt}
              fill
              sizes="100vw"
            />
          </figure>
          <div className="n-views__fore">
            <h2 className="n-views__title" id="n-views-title">
              {views.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
            <p className="n-views__sub">{views.sub}</p>
          </div>
          <a className="n-views__orb" href="/homes">
            {views.cta}
          </a>
        </div>
      </section>
      <div className="n-views__note" data-dark>
        <p>{architecture.copy}</p>
      </div>

      <SiteFooter id="call" />
    </div>
  );
}
