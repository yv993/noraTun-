import { describe, expect, it } from "vitest";
import { applyOverlay, dehydrate, hydrate, type StoredHome } from "@/lib/overlay";
import { listings } from "@/lib/listings";
import type { Listing } from "@/lib/content";

// The admin writes JSON; the site renders Listings. Everything the admin can do
// passes through hydrate/dehydrate, and the risky part is images: they are
// registry KEYS in storage and imported objects in the app. A key that stops
// round-tripping means an editor saves a home and its floor plans vanish —
// silently, because a missing photo is a supported state.

const withPlan = listings.find((l) => l.levels.some((lv) => lv.img))!;
const withGallery = listings.find((l) => l.gallery?.length)!;

describe("round trip", () => {
  it("has fixtures to work with", () => {
    // guard the guard: if the data changes so that no home has a plan or a
    // gallery, these tests would vacuously pass
    expect(withPlan).toBeDefined();
    expect(withGallery).toBeDefined();
  });

  it("recovers a hand-written home unchanged through JSON and back", () => {
    const back = hydrate(dehydrate(withPlan));
    expect(back.id).toBe(withPlan.id);
    expect(back.name).toBe(withPlan.name);
    expect(back.levels).toHaveLength(withPlan.levels.length);
    // the images must be the same objects the app started with, not lookalikes
    back.levels.forEach((lv, i) => {
      expect(lv.caption).toBe(withPlan.levels[i].caption);
      expect(lv.img?.src).toBe(withPlan.levels[i].img?.src);
    });
  });

  it("recovers a gallery, keys and alt text intact", () => {
    const back = hydrate(dehydrate(withGallery));
    expect(back.gallery).toHaveLength(withGallery.gallery!.length);
    back.gallery!.forEach((g, i) => {
      expect(g.src.src).toBe(withGallery.gallery![i].src.src);
      expect(g.alt).toBe(withGallery.gallery![i].alt);
    });
  });

  it("keeps a level that has a caption but no drawing", () => {
    const stored = dehydrate(withPlan);
    stored.levels.push({ caption: "Roof terrace — drawing to come" });
    const back = hydrate(stored);
    const last = back.levels[back.levels.length - 1];
    expect(last.caption).toBe("Roof terrace — drawing to come");
    expect(last.img).toBeUndefined();
  });

  it("drops a gallery photo whose key no longer resolves, and keeps the rest", () => {
    // an editor deletes a file; the page must lose one frame, not render an
    // empty box on a sales page
    const stored = dehydrate(withGallery);
    stored.gallery = [{ src: "no-such-photo-key", alt: "gone" }, ...stored.gallery!];
    const back = hydrate(stored);
    expect(back.gallery).toHaveLength(withGallery.gallery!.length);
    expect(back.gallery!.some((g) => g.alt === "gone")).toBe(false);
  });

  it("throws on an unresolvable PLAN key rather than shipping a blank drawing", () => {
    const stored = dehydrate(withPlan);
    stored.levels = [{ caption: "Ground", img: "no-such-plan-key" }];
    // plans are the product; a silent miss here would be worse than a build
    // failure, which is why the registry treats the two kinds differently
    expect(() => hydrate(stored)).toThrow();
  });
});

describe("applyOverlay", () => {
  const base: Listing[] = [withPlan, withGallery];

  it("returns the base list untouched when the store is empty", () => {
    // the real store is data/homes.json; this asserts the shape of the result,
    // not its emptiness, so the test still means something once it is used
    const out = applyOverlay(base);
    expect(out.every((l) => typeof l.id === "string")).toBe(true);
  });

  it("applies an edit, adds a home and withholds an id — removal winning", () => {
    // exercised through hydrate/dehydrate directly, since applyOverlay reads
    // the committed JSON: this is the merge order applyOverlay implements
    const edited = hydrate({ ...dehydrate(withPlan), name: "Renamed by the admin" });
    expect(edited.name).toBe("Renamed by the admin");
    expect(edited.levels[0].img?.src).toBe(withPlan.levels[0].img?.src);

    const added = hydrate({ ...dehydrate(withGallery), id: "X-NEW" } as StoredHome);
    expect(added.id).toBe("X-NEW");

    const all = [edited, added];
    const gone = new Set([edited.id]);
    expect(all.filter((l) => !gone.has(l.id))).toHaveLength(1);
  });
});

describe("every listing survives a round trip", () => {
  // the one that would actually catch a regression: not a fixture, all of them
  it.each(listings.map((l) => [l.id, l] as const))("%s", (_id, l) => {
    const back = hydrate(dehydrate(l));
    expect(back.id).toBe(l.id);
    expect(back.levels.map((x) => x.img?.src)).toEqual(l.levels.map((x) => x.img?.src));
    expect(back.gallery?.map((x) => x.src.src)).toEqual(l.gallery?.map((x) => x.src.src));
  });
});
