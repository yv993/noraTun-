/* TREATMENT B — "sky-hang"
   Cirrus taken the RIGHT WAY UP out of the hero photograph, recomposed so the
   fall-streaks hang downward, the weather sits left-of-centre, the upper right
   stays dark for the white nav, and the bottom third dissolves to the
   photograph's own top row so the seam is a colour match, not a mirror. */

import { createRequire } from "node:module";
import { statSync } from "node:fs";
import path from "node:path";
const sharp = createRequire("file:///C:/Users/ysaha/Desktop/arPage/package.json")("sharp");

const SRC = path.resolve("assets/photos/hero-sky.jpg");
const OUT_WEBP = path.resolve("public/flora/sky-hang.webp");

const W = 1826;
const H = 456; // 24.973vw — leaves ~90px of painted zenith clear at 1440x900

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

let seed = 20260906;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

// ---------------------------------------------------------------- 1. source
const BAND_H = 660;
const { data: src, info: si } = await sharp(SRC)
  .extract({ left: 0, top: 0, width: W, height: BAND_H })
  .raw().toBuffer({ resolveWithObject: true });
const SC = si.channels;

// ------------------------------------------- 2. 2-D clear-sky background
// A per-ROW percentile is wrong here: this sky brightens hard to the right, so
// a row-wide percentile is set by the dark left edge and the whole right half
// reads as "cloud". Estimate the background locally instead — a low percentile
// inside a moving window — so only what is brighter than ITS OWN patch of sky
// survives as cloud.
const DS = 6;
const cw = Math.ceil(W / DS), chh = Math.ceil(BAND_H / DS);
const coarse = new Float32Array(cw * chh * 3);
for (let cy = 0; cy < chh; cy++) for (let cx = 0; cx < cw; cx++) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let dy = 0; dy < DS; dy++) {
    const y = cy * DS + dy; if (y >= BAND_H) break;
    for (let dx = 0; dx < DS; dx++) {
      const x = cx * DS + dx; if (x >= W) break;
      const i = (y * W + x) * SC;
      r += src[i]; g += src[i + 1]; b += src[i + 2]; n++;
    }
  }
  const o = (cy * cw + cx) * 3;
  coarse[o] = r / n; coarse[o + 1] = g / n; coarse[o + 2] = b / n;
}
const RX = 30, RY = 10, PCT = 0.10;
const bg = new Float32Array(cw * chh * 3);
const bucket = [];
for (let cy = 0; cy < chh; cy++) for (let cx = 0; cx < cw; cx++) for (let c = 0; c < 3; c++) {
  bucket.length = 0;
  for (let y = Math.max(0, cy - RY); y <= Math.min(chh - 1, cy + RY); y += 2)
    for (let x = Math.max(0, cx - RX); x <= Math.min(cw - 1, cx + RX); x += 2)
      bucket.push(coarse[(y * cw + x) * 3 + c]);
  bucket.sort((a, b) => a - b);
  bg[(cy * cw + cx) * 3 + c] = bucket[Math.floor(bucket.length * PCT)];
}
const bgU8 = Buffer.alloc(cw * chh * 3);
for (let i = 0; i < bgU8.length; i++) bgU8[i] = clamp(Math.round(bg[i]), 0, 255);
const { data: bgFull } = await sharp(bgU8, { raw: { width: cw, height: chh, channels: 3 } })
  .resize(W, BAND_H, { kernel: "cubic" }).blur(18).raw().toBuffer({ resolveWithObject: true });

// The palm crown and the roof corner sit in the lower left of this band. The
// local-sky estimate goes to pieces around them (it reads their darkness as
// "sky", so the real sky beside them scores as a huge bright residual — that
// is where the blue blob in the first pass came from). Cut that wedge out of
// the residual entirely, with a soft edge, and never source a veil from it.
const clean = (x, y) =>
  Math.min(1 - smoothstep(370, 560, y) * (1 - smoothstep(430, 700, x)),
           1 - smoothstep(590, 655, y));

// KNEE. A 10th-percentile background still sits a few levels below ordinary
// clear sky, so clear sky scores a small positive "cloud". Left alone that DC
// floor paints every veil's whole rectangle a shade paler than its surroundings
// and the rectangle shows.
// The gate MUST be one scalar applied to all three channels: thresholding R, G
// and B independently makes them cross at different pixels and the cirrus comes
// out speckled green and magenta. Gate on a blurred mean instead, so the
// decision is spatially smooth and the hue is never touched.
const raw3 = Buffer.alloc(W * BAND_H * 3);
const scal = Buffer.alloc(W * BAND_H);
for (let i = 0; i < W * BAND_H; i++) {
  const s = i * SC, d = i * 3;
  let acc = 0;
  for (let c = 0; c < 3; c++) {
    const v = clamp(src[s + c] - bgFull[d + c], 0, 255);
    raw3[d + c] = v; acc += v;
  }
  scal[i] = Math.round(acc / 3);
}
// NOTE: sharp hands a 1-channel raw buffer back as THREE channels. Take the
// stride from info rather than assuming it — assuming 1 shifts every lookup and
// the gate silently comes back as noise.
const { data: gateRaw, info: gi } = await sharp(scal, { raw: { width: W, height: BAND_H, channels: 1 } })
  .blur(2.0).raw().toBuffer({ resolveWithObject: true });
const GS = gi.channels;
const gate = new Uint8Array(W * BAND_H);
for (let i = 0; i < gate.length; i++) gate[i] = gateRaw[i * GS];
// measure the clear-sky floor from the file, not by eye
const probe = [];
for (let y = 90; y < 300; y += 2) for (let x = 200; x < 620; x += 2) probe.push(gate[y * W + x]);
probe.sort((a, b) => a - b);
console.log("clear-sky residual floor — p50", probe[probe.length >> 1],
  " p90", probe[Math.floor(probe.length * 0.9)], " p99", probe[Math.floor(probe.length * 0.99)]);

// Pedestal, not threshold. Clear sky measures ~11 here, and real thin cirrus
// starts only a little above that, so a hard gate at the floor throws the wisps
// away with it. Subtract the floor instead and let everything above it through
// at full strength — expressed as one multiplier off the blurred scalar so all
// three channels scale together and the hue survives.
const FLOOR = 11;
const resid = Buffer.alloc(W * BAND_H * 3);
for (let y = 0; y < BAND_H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x, d = i * 3, g = gate[i];
  const k = clean(x, y) * (g > FLOOR ? (g - FLOOR) / g : 0);
  for (let c = 0; c < 3; c++) resid[d + c] = clamp(Math.round(raw3[d + c] * k), 0, 255);
}

await sharp(resid, { raw: { width: W, height: BAND_H, channels: 3 } })


// ---------------------------------------------------------------- 3. veils
// No veil is ever flipped vertically, so every fall-streak still hangs the way
// gravity and wind shear left it. Horizontal mirroring is fair game — shear has
// no handedness — and it stops the reused cluster reading as a repeat.
// Vertical scale stays near 1:1; the horizontal stretch never exceeds ~1.3,
// which reads as wind, not as distortion.
const residSharp = sharp(resid, { raw: { width: W, height: BAND_H, channels: 3 } });

function feather(w, h, fl, fr, ft, fb) {
  const m = new Float32Array(w * h);
  const px = (n, f) => Math.max(1, Math.round(n * f));
  const L = px(w, fl), R = px(w, fr), T = px(h, ft), B = px(h, fb);
  for (let y = 0; y < h; y++) {
    const vy = Math.min(smoothstep(0, T, y), smoothstep(0, B, h - 1 - y));
    for (let x = 0; x < w; x++)
      m[y * w + x] = Math.min(smoothstep(0, L, x), smoothstep(0, R, w - 1 - x)) * vy;
  }
  return m;
}

const veils = [
  { // A — THE SUBJECT. The photograph's richest tuft-and-streak cluster, lifted
    //     out of the right third and set down over the left and centre.
    name: "A/main", src: { left: 830, top: 175, width: 540, height: 300 },
    dest: { x: 34, y: 16, w: 700, h: 300 }, flop: false, gain: 1.42,
    feather: [0.24, 0.30, 0.22, 0.34],
  },
  { // B — the companion, mirrored so it does not echo A, hung higher and
    //     overlapping A's right shoulder so the two read as one sky, not as two
    //     clumps with a gap between them.
    name: "B/centre", src: { left: 1235, top: 245, width: 500, height: 290 },
    dest: { x: 430, y: 4, w: 660, h: 282 }, flop: true, gain: 1.24,
    feather: [0.34, 0.32, 0.16, 0.38],
  },
  { // E — a second altitude over the left shoulder, so the weather is not one
    //     flat band at one height.
    name: "E/left-high", src: { left: 1410, top: 70, width: 310, height: 195 },
    dest: { x: 0, y: 34, w: 400, h: 204 }, flop: true, gain: 0.88,
    feather: [0.30, 0.34, 0.28, 0.42],
  },
  { // C — the tail. Runs out to the right so the weather THINS rather than
    //     stopping; the horizontal weight below takes it nearly to nothing long
    //     before it can reach the nav.
    name: "C/tail", src: { left: 870, top: 290, width: 570, height: 205 },
    dest: { x: 980, y: 116, w: 720, h: 200 }, flop: false, gain: 0.80,
    feather: [0.30, 0.34, 0.28, 0.42],
  },
  { // D — the high wash: a wide, near-flat veil so the zenith is not empty. It
    //     has to reach past the CSS mask's fade to register at all.
    name: "D/high", src: { left: 946, top: 20, width: 880, height: 160 },
    dest: { x: 0, y: 0, w: 1320, h: 196 }, flop: true, gain: 0.62,
    feather: [0.08, 0.34, 0.02, 0.58],
  },
];

const cloud = new Float32Array(W * H * 3);
for (const v of veils) {
  let pipe = residSharp.clone().extract(v.src);
  if (v.flop) pipe = pipe.flop();
  const { data: vd } = await pipe
    .resize(v.dest.w, v.dest.h, { kernel: "lanczos3", fit: "fill" })
    .raw().toBuffer({ resolveWithObject: true });
  const m = feather(v.dest.w, v.dest.h, ...v.feather);
  for (let y = 0; y < v.dest.h; y++) {
    const dy = v.dest.y + y; if (dy < 0 || dy >= H) continue;
    for (let x = 0; x < v.dest.w; x++) {
      const dx = v.dest.x + x; if (dx < 0 || dx >= W) continue;
      const a = m[y * v.dest.w + x] * v.gain; if (a <= 0) continue;
      const s = (y * v.dest.w + x) * 3, d = (dy * W + dx) * 3;
      cloud[d] += vd[s] * a; cloud[d + 1] += vd[s + 1] * a; cloud[d + 2] += vd[s + 2] * a;
    }
  }
}

// ------------------------------------------- 3b. organic density field
// Two octaves of smooth noise thin and thicken the accumulated cloud. Real
// cirrus is never uniform, and it also means the last trace of any veil's
// rectangle is broken up rather than running straight.
async function octave(gw, gh, blur) {
  const g = Buffer.alloc(gw * gh);
  for (let i = 0; i < g.length; i++) g[i] = Math.round(rnd() * 255);
  const { data, info } = await sharp(g, { raw: { width: gw, height: gh, channels: 1 } })
    .resize(W, H, { kernel: "cubic" }).blur(blur).raw().toBuffer({ resolveWithObject: true });
  const s = info.channels;                 // same 1 -> 3 promotion as above
  const o = new Uint8Array(W * H);
  for (let i = 0; i < o.length; i++) o[i] = data[i * s];
  return o;
}
const n1 = await octave(22, 7, 26);
const n2 = await octave(58, 17, 10);
const field = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) {
  const n = 0.62 * (n1[i] / 255) + 0.38 * (n2[i] / 255);
  field[i] = clamp(0.44 + 1.18 * n, 0.30, 1.30);
}

// ------------------------------------------- 4. the two governing weights
// HORIZONTAL — the answer to "every cloud is in the right half". Full weight
// across the left and centre, thinning to a whisper before the right edge.
const hWeight = (u) =>
  smoothstep(0, 0.06, u) * (0.12 + 0.88 * (1 - smoothstep(0.55, 0.92, u)));
// VERTICAL — weather high; nothing at all through the bottom third, so the
// dissolve to the photograph's top row happens over clean sky.
const vWeight = (t) => smoothstep(0.01, 0.14, t) * (1 - smoothstep(0.46, 0.72, t));
// A deck that starts and stops at one height across 1826px reads as a ruled
// band. Walk the whole vertical weight up and down with the column so both the
// deck's ceiling and its floor undulate.
const wob = new Float32Array(W);
for (let x = 0; x < W; x++) {
  const u = 2 * Math.PI * x / W;
  wob[x] = 0.034 * Math.sin(1.7 * u + 0.9) + 0.022 * Math.sin(3.3 * u + 2.7)
    + 0.014 * Math.sin(6.1 * u + 5.1);
}
// and an explicit guard over the nav: the top-right corner keeps nothing at all.
const navGuard = (u, t) => 1 - 0.85 * smoothstep(0.70, 0.86, u) * (1 - smoothstep(0.05, 0.26, t));

// ---------------------------------------------------------------- 5. base sky
const { data: topRows } = await sharp(SRC)
  .extract({ left: 0, top: 0, width: W, height: 3 }).raw().toBuffer({ resolveWithObject: true });
const row0 = new Float32Array(W * 3);
for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++)
  row0[x * 3 + c] = (topRows[x * 3 + c] + topRows[(W + x) * 3 + c] + topRows[(2 * W + x) * 3 + c]) / 3;

const seam = new Float32Array(W * 3);
const SR = 14;
for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) {
  let s = 0;
  for (let k = -SR; k <= SR; k++) s += row0[clamp(x + k, 0, W - 1) * 3 + c];
  seam[x * 3 + c] = s / (2 * SR + 1);
}
const seamMean = [0, 0, 0];
for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) seamMean[c] += seam[x * 3 + c] / W;

// ------------------------------------------- 5b. the photograph's own grain
// A synthesised sky is perfectly smooth, and WebP flattens a synthetic dither
// away, which leaves 1-level terraces every ~10 rows across a 39-level ramp —
// visible banding. Lift the real grain out of a clean patch of THIS sky instead
// (patch minus its own lowpass), and mirror-tile it over the plate. Two wins:
// it survives the encoder, and the plate now meets the photograph in texture as
// well as in colour.
const GT = { x: 180, y: 70, w: 620, h: 340 };
const { data: gp } = await sharp(SRC)
  .extract({ left: GT.x, top: GT.y, width: GT.w, height: GT.h })
  .raw().toBuffer({ resolveWithObject: true });
const { data: gpLow } = await sharp(SRC)
  .extract({ left: GT.x, top: GT.y, width: GT.w, height: GT.h })
  .blur(2.4).raw().toBuffer({ resolveWithObject: true });
const grainTile = new Float32Array(GT.w * GT.h * 3);
const gsd = [0, 0, 0];
for (let i = 0; i < GT.w * GT.h; i++) for (let c = 0; c < 3; c++) {
  const v = gp[i * 3 + c] - gpLow[i * 3 + c];
  grainTile[i * 3 + c] = v; gsd[c] += v * v;
}
console.log("photograph grain sigma R/G/B:",
  gsd.map((s) => Math.sqrt(s / (GT.w * GT.h)).toFixed(2)).join(" / "));
const pingpong = (v, n) => { const m = v % (2 * n); return m < n ? m : 2 * n - 1 - m; };

const TOP = [21, 76, 138];                        // on the painted curve, ~22svh
const eV = (t) => 0.22 * t + 0.78 * (t * t * (3 - 2 * t));
const eH = (t) => t * t * t * (t * (t * 6 - 15) + 10); // flat slope at both ends
const WARM = [1.06, 1.0, 0.95];                   // cirrus reads warm-white, not blue-grey

// ---------------------------------------------------------------- 6. paint
const out = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const ev = eV(t), eh = eH(t);
  const cg = lerp(0.86, 1.0, smoothstep(0, 0.6, t));
  // This sky is clean — its own grain measures sigma 0.79, too fine to survive
  // WebP. Run it at ~2x so it lands near sigma 1.5: still reads as film grain,
  // but enough to break the 1-level terraces out of a 39-level ramp.
  const gs = lerp(1.75, 2.15, t);
  const gy = pingpong(y, GT.h);
  for (let x = 0; x < W; x++) {
    const u = x / (W - 1), d = (y * W + x) * 3;
    const a = vWeight(t + wob[x]) * hWeight(u) * navGuard(u, t) * cg * field[y * W + x];
    const gi2 = (gy * GT.w + pingpong(x, GT.w)) * 3;
    for (let c = 0; c < 3; c++) {
      const base = lerp(TOP[c], seamMean[c], ev) + (seam[x * 3 + c] - seamMean[c]) * eh;
      const n = grainTile[gi2 + c] * gs + (rnd() - 0.5) * 0.5;
      out[d + c] = clamp(Math.round(base + cloud[d + c] * a * WARM[c] + n), 0, 255);
    }
  }
}
// The base curve is built so that eV(1) = eH(1) = 1 exactly, which makes the
// last row's base the photograph's own first row per column, with nothing left
// to force. Do NOT overwrite it with a grain-free copy: that leaves one smooth
// row against a grainy photograph and the texture steps where the colour does
// not. Measure the arrival instead.
let err = 0, emax = 0;
for (let x = 0; x < W; x++) {
  const base = [0, 1, 2].map((c) => lerp(TOP[c], seamMean[c], eV(1)) + (seam[x * 3 + c] - seamMean[c]) * eH(1));
  for (let c = 0; c < 3; c++) {
    const e = Math.abs(base[c] - seam[x * 3 + c]);
    err += e / (W * 3); if (e > emax) emax = e;
  }
}
console.log("last row vs photograph's first row — mean error", err.toFixed(4),
  "levels, worst", emax.toFixed(4), "(before grain)");

// ---- measurements ------------------------------------------------------
const px = (x, y) => { const i = (y * W + x) * 3; return [out[i], out[i + 1], out[i + 2]]; };
const lum = (p) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]); };
let worst = 99, wat = null;
for (let y = 0; y < Math.round(H * 0.34); y++) for (let x = Math.round(W * 0.60); x < W; x++) {
  const p = px(x, y), c = 1.05 / (lum(p) + 0.05);
  if (c < worst) { worst = c; wat = [x, y, p]; }
}
console.log("UPPER-RIGHT QUADRANT (x>60%, top 34%): worst white contrast",
  worst.toFixed(2) + ":1", "on", wat[2], "at", wat[0] + "," + wat[1]);
console.log("plate last row  L/M/R:", px(2, H - 1), px(913, H - 1), px(W - 3, H - 1));
console.log("photo first row L/M/R:", [0, 1, 2].map((c) => Math.round(row0[6 + c])),
  [0, 1, 2].map((c) => Math.round(row0[913 * 3 + c])), [0, 1, 2].map((c) => Math.round(row0[(W - 3) * 3 + c])));
console.log("plate top row   L/M/R:", px(2, 0), px(913, 0), px(W - 3, 0));
let el = 0, er = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const u = x / (W - 1), t = y / (H - 1);
  const e = cloud[(y * W + x) * 3] * vWeight(t) * hWeight(u) * navGuard(u, t);
  if (x < W / 2) el += e; else er += e;
}
console.log("cloud energy — left half", (100 * el / (el + er)).toFixed(1) + "%,",
  "right half", (100 * er / (el + er)).toFixed(1) + "%");

const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
await img.clone().webp({ quality: 86, effort: 6 }).toFile(OUT_WEBP);

const meta = await sharp(OUT_WEBP).metadata();
console.log("WROTE", OUT_WEBP, meta.width + "x" + meta.height,
  statSync(OUT_WEBP).size + " bytes", "cssHeight " + (100 * H / W).toFixed(3) + "vw");
