// The study sheets → the file a visitor can open from a home's page.
//
// The reference's home page carries a round "PDF" button beside its request
// pill. Ours carries the same button, and behind it the honest equivalent: the
// architect's study sheet the home's plans were cut from, whole — title band,
// both drawings and their captions.
//
// The sources in assets/plans/src are 2 MB photographs of A3 sheets. Serving
// those would cost more than the rest of the page put together, so each one is
// resampled to a width a reader can actually zoom into and no more.
//
//   node scripts/sheets.mjs        → writes public/sheets/vNN.jpg for all 17
//
// Progressive JPEG, chroma kept at 4:4:4 (the drawings are thin ink lines on
// cream — 4:2:0 furs them), mozjpeg trellis on. Everything is a plain photo of
// a drawing, so there is nothing to gain from webp/avif here beyond what the
// browser already caches; a .jpg opens in every viewer the visitor might have.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SRC = path.resolve("assets/plans/src");
const OUT = path.resolve("public/sheets");
const WIDTH = 1800;
const QUALITY = 68;

fs.mkdirSync(OUT, { recursive: true });

const sheets = fs
  .readdirSync(SRC)
  .filter((f) => /^v\d\d-sheet\.jpg$/i.test(f))
  .sort();

if (!sheets.length) {
  console.error(`no vNN-sheet.jpg found in ${SRC}`);
  process.exit(1);
}

let total = 0;
for (const file of sheets) {
  const id = file.slice(0, 3); // v01
  const dest = path.join(OUT, `${id}.jpg`);
  const meta = await sharp(path.join(SRC, file)).metadata();
  const info = await sharp(path.join(SRC, file))
    .resize({ width: Math.min(WIDTH, meta.width ?? WIDTH), withoutEnlargement: true })
    .jpeg({
      quality: QUALITY,
      progressive: true,
      chromaSubsampling: "4:4:4",
      mozjpeg: true,
    })
    .toFile(dest);
  total += info.size;
  console.log(
    `${id}  ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} → ` +
      `${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}  ` +
      `${(info.size / 1024).toFixed(0)} KB`,
  );
}
console.log(`\n${sheets.length} sheets, ${(total / 1024 / 1024).toFixed(2)} MB total`);
