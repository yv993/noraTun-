import type { Listing, Room } from "@/lib/content";
import { plan, photo } from "@/lib/imageRegistry";
import store from "@/data/homes.json";

// THE ADMIN'S OVERLAY.
//
// The seventeen homes stay where they are — hand-written in lib/listings.ts,
// each field read off a drawing. This file is what the admin at /admin can
// change on top of them, and it is deliberately a thin layer:
//
//   edits    field-level changes to an existing home, keyed by id
//   added    whole new homes, written as JSON
//   removed  ids to withhold from the site
//
// Kept separate rather than rewriting listings.ts for three reasons. The
// original stays readable and reviewable in git; an admin mistake is one JSON
// file to revert rather than a diff through 1000 lines of TypeScript; and the
// provenance of every hand-checked number remains visible next to the number.
//
// IMAGES ARE KEYS, not paths — see lib/imageRegistry.ts. A plan key that does
// not resolve throws at build; a photo key that does not resolve leaves the
// home on its place's photography, which is a supported state.

// Level.img and Level.alt are BOTH optional on the authored type — a level
// can be a caption with no drawing yet — and `rooms` carries the hotspot
// rectangles, not strings. The stored shape mirrors that exactly rather than
// tightening it, or a hand-written home would fail to round-trip through the
// admin.
export type StoredLevel = { caption: string; img?: string; alt?: string; rooms?: Room[] };
export type StoredGallery = { src: string; alt: string };

/** A home as the admin stores it: the Listing, with images as registry keys. */
export type StoredHome = Omit<Listing, "levels" | "gallery"> & {
  levels: StoredLevel[];
  gallery?: StoredGallery[];
};

export type Store = {
  version: number;
  edits: Record<string, Partial<StoredHome>>;
  added: StoredHome[];
  removed: string[];
};

export const emptyStore: Store = { version: 1, edits: {}, added: [], removed: [] };

/** JSON → Listing. The two image fields are the only parts that change shape. */
export function hydrate(h: StoredHome): Listing {
  return {
    ...h,
    levels: h.levels.map((l) => ({
      caption: l.caption,
      ...(l.img ? { img: plan(l.img) } : {}),
      ...(l.alt ? { alt: l.alt } : {}),
      ...(l.rooms ? { rooms: l.rooms } : {}),
    })),
    ...(h.gallery
      ? {
          gallery: h.gallery
            .map((g) => ({ src: photo(g.src), alt: g.alt }))
            // a photo key that no longer resolves drops out rather than
            // rendering an empty frame on a sales page
            .filter((g): g is { src: NonNullable<typeof g.src>; alt: string } => !!g.src),
        }
      : {}),
  } as Listing;
}

/** Listing → JSON, so the admin can round-trip a hand-written home. The
 *  registry is keyed by filename without its extension, which is exactly what
 *  next/image leaves in `src` after the build hashes it, so the key is
 *  recovered from the path rather than guessed. */
const keyOf = (src: { src: string }): string => {
  const m = decodeURIComponent(src.src).match(/([^/]+?)(?:\.[0-9a-f]{8})?\.[a-z0-9]+$/i);
  return m ? m[1] : "";
};

export function dehydrate(l: Listing): StoredHome {
  return {
    ...l,
    levels: l.levels.map((lv) => ({
      caption: lv.caption,
      ...(lv.img ? { img: keyOf(lv.img) } : {}),
      ...(lv.alt ? { alt: lv.alt } : {}),
      ...(lv.rooms ? { rooms: lv.rooms } : {}),
    })),
    ...(l.gallery ? { gallery: l.gallery.map((g) => ({ src: keyOf(g.src), alt: g.alt })) } : {}),
  } as StoredHome;
}

export const readStore = (): Store => ({ ...emptyStore, ...(store as Partial<Store>) });

/** Apply the overlay to the hand-written list. Order is deliberate: removals
 *  last, so an id can be edited and withheld in the same save without the
 *  edit silently resurrecting it. */
export function applyOverlay(base: Listing[]): Listing[] {
  const s = readStore();
  const edited = base.map((l) => {
    const e = s.edits[l.id];
    if (!e) return l;
    const merged = { ...dehydrate(l), ...e } as StoredHome;
    return hydrate(merged);
  });
  const added = s.added.map(hydrate);
  const all = [...edited, ...added];
  const gone = new Set(s.removed);
  return all.filter((l) => !gone.has(l.id));
}
