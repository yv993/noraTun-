// The plan sheets → the catalogue's plan images.
//
// Each of the seventeen study sheets in assets/plans/src carries its title
// band, one or two plan drawings with their own caption rows, and on a few
// sheets a key strip or a note. The card and the home page want only the
// drawings, so this script finds them and cuts them out.
//
//   node scripts/plans.mjs analyze   → proposes crop boxes from the pixels,
//                                       writes assets/plans/src/boxes.json and
//                                       a contact sheet of every crop to LOOK at
//   node scripts/plans.mjs export    → reads boxes.json (hand-corrected where
//                                       the proposal was wrong) and writes the
//                                       1400px webp panels to assets/plans/
//
// Detection: a plan is the only thing on a sheet that is neither cream paper
// nor black ink — its grey floor fill, wood decking, gravel, garden and pool
// tints. Rows and columns are scored by the share of such "plan" pixels; the
// contiguous bands are the drawings, and the two tallest are the two floors.
// Titles, captions and notes are pure ink on paper and score zero, so they
// fall away without any text recognition at all.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SRC = path.resolve("assets/plans/src");
const OUT = path.resolve("assets/plans");
const BOXES = path.join(SRC, "boxes.json");
const mode = process.argv[2] || "analyze";

// per-sheet hints: where the plans live on sheets that are not one column,
// and what each panel is called
const SHEETS = {
  v01: { captions: ["Ground floor", "Basement"] },
  v02: { captions: ["Ground floor", "Basement"] },
  v03: { captions: ["Ground floor", "Second floor"] },
  v04: { captions: ["Upper ground", "Lower ground"] },
  v05: { captions: ["Ground floor", "Basement"] },
  v06: { captions: ["Ground floor", "Basement"] },
  v07: { captions: ["Ground floor", "Basement"] },
  v08: { captions: ["Ground floor", "Basement"] },
  v09: { captions: ["Ground floor", "Basement"] },
  v10: { captions: ["Ground floor", "Basement"] },
  v11: { captions: ["Ground floor", "Basement"] },
  v12: { captions: ["Ground floor", "Basement"] },
  v13: { captions: ["Ground floor", "Basement"] },
  // plans on the left half, the structural section on the right
  v14: { captions: ["Ground floor", "Basement", "Structure"], xMax: 0.5, extra: "right" },
  v15: { captions: ["Ground floor", "Basement"] },
  v16: { captions: ["Ground floor", "Basement"] },
  // a 2x2 sheet of two variants: the left column is the design
  v17: { captions: ["Ground floor", "Basement"], xMax: 0.5 },
};

// v03 has a note between its floors and a key strip; v13 wears an ornamental
// frame the profile reads as drawing; v14 puts its plans beside a structural
// section; v17 is a 2x2 sheet whose left column is the design. Boxes are
// [x, y, w, h] in source pixels, checked on the contact sheet.
// The others listed here are profile results trimmed by hand where a drawn
// caption sat inside the deck or terrace that runs to the plan's foot.
const MANUAL = {
  v03: [[185, 205, 2265, 635], [160, 945, 2290, 625]],
  v04: [[130, 208, 2212, 660], [134, 976, 2164, 600]],
  v06: [[158, 184, 2184, 670], [422, 976, 1876, 600]],
  v07: [[330, 192, 1916, 600], [342, 900, 1724, 692]],
  v12: [[314, 232, 1820, 645], [514, 1028, 1616, 560]],
  v13: [[579, 179, 1331, 622], [579, 949, 1331, 591]],
  v14: [[85, 225, 1323, 575], [85, 860, 1323, 580], [1422, 275, 1380, 1236]],
  v15: [[406, 156, 1536, 680], [578, 948, 1380, 584]],
  v16: [[410, 160, 1532, 660], [590, 948, 1368, 568]],
  v17: [[74, 203, 1158, 536], [148, 838, 1084, 505]],
};

const isPlanPx = (r, g, b) => {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum < 70) return false; // ink
  if (r > 222 && g > 212 && b > 190 && Math.abs(r - g) < 22) return false; // cream paper
  return true; // floor greys, decking, gravel, garden, pool
};

async function analyze() {
  const boxes = {};
  const files = fs.readdirSync(SRC).filter((f) => /^v\d\d-sheet\.jpg$/.test(f)).sort();
  for (const f of files) {
    const v = f.slice(0, 3);
    const hint = SHEETS[v] || { captions: ["Ground floor", "Basement"] };
    const img = sharp(path.join(SRC, f));
    const meta = await img.metadata();
    const W = meta.width, H = meta.height;
    const S = 4; // analyse at quarter size
    const w = Math.floor(W / S), h = Math.floor(H / S);
    const { data } = await img.resize(w, h, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
    const xMax = Math.floor(w * (hint.xMax || 1));
    // row scores over the allowed columns
    const row = new Float32Array(h);
    for (let y = 0; y < h; y++) {
      let n = 0;
      for (let x = 0; x < xMax; x++) { const i = (y * w + x) * 3; if (isPlanPx(data[i], data[i + 1], data[i + 2])) n++; }
      row[y] = n / xMax;
    }
    // A drawing is a DENSE core of plan rows (the floor fill), fringed by the
    // sparse rows of its dimension ticks and labels, which sit within a few
    // pixels of the walls. A drawn caption ("GROUND FLOOR PLAN") is sparse
    // too, but it stands 25px+ clear of the drawing — so the core is found
    // first and then grown outward only across gaps of a few pixels, which
    // takes the ticks and leaves the caption behind.
    const core = 0.08, low = 0.008, maxGap = Math.round(14 / S), minH = Math.round(150 / S);
    const bands = [];
    let y = 0;
    while (y < h) {
      if (row[y] > core) {
        let y0 = y, y1 = y;
        while (y < h && row[y] > core) { y1 = y; y++; }
        // the core may be split by a thin corridor of pure ink; rejoin cores closer than the gap
        bands.push({ y0, y1 });
      } else y++;
    }
    // merge cores separated by less than 24px (an internal wall line or a dimension row)
    const merged = [];
    for (const b of bands) {
      const last = merged[merged.length - 1];
      if (last && b.y0 - last.y1 <= Math.round(24 / S)) last.y1 = b.y1; else merged.push({ ...b });
    }
    // grow each band across short sparse fringes — but never further than the
    // dimension ticks can be (52px), and never into the neighbouring core,
    // or a caption between two floors would weld them into one box
    const maxGrow = Math.round(52 / S);
    for (let i = 0; i < merged.length; i++) {
      const b = merged[i];
      const top = i > 0 ? merged[i - 1].y1 + 1 : 0;
      const bot = i < merged.length - 1 ? merged[i + 1].y0 - 1 : h - 1;
      const c0 = b.y0, c1 = b.y1;
      let gap = 0, yy = c0 - 1;
      while (yy >= top && c0 - yy <= maxGrow) { if (row[yy] > low) { b.y0 = yy; gap = 0; } else if (++gap > maxGap) break; yy--; }
      gap = 0; yy = c1 + 1;
      while (yy <= bot && yy - c1 <= maxGrow) { if (row[yy] > low) { b.y1 = yy; gap = 0; } else if (++gap > maxGap) break; yy++; }
      b.hgt = b.y1 - b.y0 + 1;
    }
    const tall = merged.filter((b) => b.hgt >= minH);
    // the two tallest bands, in page order
    const main = tall.sort((a, b) => b.hgt - a.hgt).slice(0, 2).sort((a, b) => a.y0 - b.y0);
    const panels = [];
    for (const bd of main) {
      // columns inside this band
      const col = new Float32Array(xMax);
      for (let x = 0; x < xMax; x++) {
        let n = 0;
        for (let yy = bd.y0; yy <= bd.y1; yy++) { const i = (yy * w + x) * 3; if (isPlanPx(data[i], data[i + 1], data[i + 2])) n++; }
        col[x] = n / bd.hgt;
      }
      const cthr = 0.03;
      let x0 = 0; while (x0 < xMax && col[x0] <= cthr) x0++;
      let x1 = xMax - 1; while (x1 > 0 && col[x1] <= cthr) x1--;
      // full-res, with a margin for dimension ticks and labels just outside the fill
      const mx = Math.round(W * 0.012), my = Math.round(H * 0.012);
      panels.push({
        x: Math.max(0, x0 * S - mx), y: Math.max(0, bd.y0 * S - my),
        w: Math.min(W, x1 * S + mx) - Math.max(0, x0 * S - mx),
        h: Math.min(H, bd.y1 * S + my) - Math.max(0, bd.y0 * S - my),
      });
    }
    // sheets whose layout defeats a row profile are boxed by hand, in source
    // pixels, from looking at the sheet
    const manual = MANUAL[v];
    const finalPanels = manual ? manual.map(([x, y, w, h]) => ({ x, y, w, h })) : panels;
    boxes[v] = { file: f, W, H, captions: hint.captions, panels: finalPanels, bandsFound: tall.length, manual: !!manual };
    console.log(v, `${W}x${H}`, manual ? "MANUAL" : `cores ${tall.length}`, "→", finalPanels.map((p) => `[${p.x},${p.y} ${p.w}x${p.h}]`).join(" "));
  }
  fs.writeFileSync(BOXES, JSON.stringify(boxes, null, 1));
  await contactSheet(boxes);
}

async function contactSheet(boxes) {
  const TW = 360, COLS = 6, LBL = 18, GAP = 6;
  const cells = [];
  for (const [v, b] of Object.entries(boxes)) {
    b.panels.forEach((p, i) => cells.push({ v, i, b, p, cap: b.captions[i] || `panel ${i + 1}` }));
  }
  const th = [];
  for (const c of cells) {
    const buf = await sharp(path.join(SRC, c.b.file)).extract({ left: c.p.x, top: c.p.y, width: c.p.w, height: c.p.h }).resize({ width: TW }).toBuffer();
    const m = await sharp(buf).metadata();
    th.push({ ...c, buf, h: m.height });
  }
  const rowH = Math.max(...th.map((t) => t.h)) + LBL + GAP;
  const rows = Math.ceil(th.length / COLS);
  const comps = [];
  th.forEach((t, i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    const left = GAP + col * (TW + GAP), top = GAP + row * rowH;
    comps.push({ input: t.buf, left, top });
    comps.push({ input: Buffer.from(`<svg width="${TW}" height="${LBL}"><rect width="100%" height="100%" fill="#1d1d1d"/><text x="4" y="13" font-family="Arial" font-size="11" fill="#fff">${t.v} · ${t.cap} · ${t.p.w}x${t.p.h}</text></svg>`), left, top: top + t.h });
  });
  await sharp({ create: { width: GAP + COLS * (TW + GAP), height: GAP + rows * rowH, channels: 3, background: "#d9d9d9" } }).composite(comps).png().toFile(path.join(SRC, "crops-sheet.png"));
  console.log("contact sheet:", path.join(SRC, "crops-sheet.png"), th.length, "crops");
}

async function exportPanels() {
  const boxes = JSON.parse(fs.readFileSync(BOXES, "utf8"));
  fs.mkdirSync(OUT, { recursive: true });
  const names = ["ground", "lower", "extra"];
  let total = 0;
  for (const [v, b] of Object.entries(boxes)) {
    for (let i = 0; i < b.panels.length; i++) {
      const p = b.panels[i];
      const out = path.join(OUT, `${v}-${names[i]}.webp`);
      await sharp(path.join(SRC, b.file)).extract({ left: p.x, top: p.y, width: p.w, height: p.h }).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
      const kb = Math.round(fs.statSync(out).size / 1024); total += kb;
      console.log(path.basename(out), kb + "KB");
    }
  }
  console.log("total", total, "KB");
}

if (mode === "analyze") await analyze();
else if (mode === "export") await exportPanels();
else if (mode === "sheet") await contactSheet(JSON.parse(fs.readFileSync(BOXES, "utf8")));
else console.error("mode: analyze | export | sheet");
