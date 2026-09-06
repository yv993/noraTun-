// NORATUN — «նոր տուն», new house. An original brand for a residential sales
// house placing homes across Armenia: apartments in Yerevan, forest houses in
// Dilijan, lake residences at Sevan, slope chalets at Tsaghkadzor.
//
// The SCROLL ARCHITECTURE is modelled on a high-end residence one-pager
// (measured section-by-section): pinned hero with a day/night switch → a brand
// arc → three numbered reasons → the location screen → the concept → a map of travel
// times → collection spec cards → an amenities reel over photography → the
// interiors chapter → the architecture chapter → the credits → a call CTA →
// footer. Every word, name and photograph below is ours.
import type { StaticImageData } from "next/image";

// Photography: licensed-free Unsplash, downloaded once into assets/photos so
// static imports give real dimensions + automatic blur placeholders.
import phHeroSky from "@/assets/photos/hero-sky.jpg";
import phHeroNight from "@/assets/photos/hero-night.jpg";
import phDilijanForest from "@/assets/photos/dilijan-forest.jpg";
import phSevanLake from "@/assets/photos/sevan-lake.jpg";
import phTsaghkadzorSlope from "@/assets/photos/tsaghkadzor-slope.jpg";
import phInteriorLiving from "@/assets/photos/interior-living.jpg";
import phInteriorKitchen from "@/assets/photos/interior-kitchen.jpg";
import phInteriorBedroom from "@/assets/photos/interior-bedroom.jpg";
import phInteriorBath from "@/assets/photos/interior-bath.jpg";
import phBalcony from "@/assets/photos/balcony.jpg";
import phCourtyard from "@/assets/photos/courtyard.jpg";
import phTailColonnade from "@/assets/photos/homes-tail-colonnade.jpg";
import phTilePergola from "@/assets/photos/homes-tile-pergola.jpg";
import phTileLiving from "@/assets/photos/homes-tile-living.jpg";
import phTileArarat from "@/assets/photos/homes-tile-ararat.jpg";
import phPool from "@/assets/photos/pool.jpg";
import phPlaceGarden from "@/assets/photos/place-garden.jpg";
import phPlaceTerrace from "@/assets/photos/place-terrace.jpg";
import phPlaceComplex from "@/assets/photos/place-complex.jpg";
import phPullVilla from "@/assets/photos/pull-villa.jpg";
import phTypeBalcony from "@/assets/photos/type-balcony.jpg";
import phTypeCourtyard from "@/assets/photos/type-courtyard.jpg";
import phTypeGarden from "@/assets/photos/type-garden.jpg";
import phAmenNight from "@/assets/photos/amenities-night.jpg";
import phViewsTerrace from "@/assets/photos/views-terrace.jpg";
import phDilijanAerial from "@/assets/photos/dilijan-aerial.jpg";
import phInterKitchen from "@/assets/photos/inter-kitchen.jpg";
import phInterDining from "@/assets/photos/inter-dining.jpg";
import phInterBedroom from "@/assets/photos/inter-bedroom.jpg";
import phFacade from "@/assets/photos/facade.jpg";
import phStair from "@/assets/photos/stair.jpg";
import phTerrace from "@/assets/photos/terrace.jpg";
import phContactMap from "@/assets/photos/contact-map.jpg";
import phContactCourt from "@/assets/photos/contact-court.jpg";
import phValley from "@/assets/photos/valley.jpg";

export const brand = {
  word1: "NORA",
  word2: "TUN",
  full: "NORATUN",
  // the script accent under the wordmark — the reference scripts its town
  script: "Hayastan",
  meaning: "«նոր տուն» — a new house",
  tagline: "Residences across Armenia",
  phone: "+374 10 24 24 24",
  email: "hello@noratun.am",
  office: "12 Saryan Street, Yerevan 0002, Armenia",
  year: "2026",
  // ⚠ PLACEHOLDERS. This list was empty on purpose — "no dead links ship" —
  // and the contact map's social rail was asked for, which is the one surface
  // that cannot render without it. These three URLs are NOT verified: they
  // are the handles NORATUN would own, not accounts anyone has checked, and
  // every one of them 404s today. Replace the hrefs with the real profiles
  // before launch, or empty this array again and the rail disappears on its
  // own — every consumer still renders it conditionally.
  social: [
    { label: "LinkedIn", icon: "in", href: "https://www.linkedin.com/company/noratun" },
    { label: "Facebook", icon: "fb", href: "https://www.facebook.com/noratun" },
    { label: "Instagram", icon: "ig", href: "https://www.instagram.com/noratun" },
  ] as Array<{ label: string; icon: string; href: string }>,
};

// 1 · HERO — pinned. Two photographs of the same view, by day and by night,
// switched by a control the visitor drives.
export const hero = {
  place: "Yerevan · Dilijan · Sevan · Tsaghkadzor",
  lineA: "A HOUSE",
  lineB: "WORTH THE ROAD HOME",
  switch: { day: "By day", night: "By night" },
  images: { day: phHeroSky, night: phHeroNight },
  alt: {
    day: "A modern stone-and-timber villa beneath a wide blue sky streaked with cloud — a tall palm beside the terrace, wisteria along the balcony, guests by the fire-pit and a long pool below",
    night:
      "The same villa at night under the Milky Way — its eaves traced with light, the rooms glowing, the pool lit from below and the sea beyond the palms",
  },
  cta: "See available homes",
  scrollHint: "Scroll",
  // hotspots over the photograph — pulse pins anchored to its features, as
  // percentages of the frame; the label shows on hover and keyboard focus
  hotspots: [
    { x: "18%", y: "58%", label: "Wisteria terrace" },
    { x: "82%", y: "60%", label: "Palm garden" },
    { x: "70%", y: "76%", label: "Fire-pit lounge" },
  ],
};

// 2 · ARC — the brand arc: a label, a running line, and the section promise.
export const arc = {
  region: ["ARMENIAN", "HIGHLAND"],
  running: "A HOUSE TO LIVE IN — TO COME BACK TO, YEAR AFTER YEAR",
  promise: ["THREE REASONS", "TO CHOOSE", "NORATUN"],
  // the ring of circular text behind the promise; its word-spacing spreads
  // apart as the dome band arrives
  ring: "A NEW HOUSE · NORATUN · A NEW HOUSE · NORATUN ·",
};

// 4b · THE BLOOM — the procedural line that assembles as you scroll and lands
// on its full weight. Split per word by the component.
export const bloom = {
  line: "A HOUSE IS THE LAST SLOW PURCHASE ANYONE MAKES",
  foot: "Take the time it deserves.",
};

// 13 · THE SKY — clouds drifting across a highland view as the page returns
// to its vertical rhythm.
export const sky = {
  img: phDilijanAerial,
  alt: "Dilijan from the air in autumn — red roofs along the valley road, a lake in the wooded park, a monastery across the river and the snow line beyond",
  city: "Dilijan",
  country: "Armenia",
  note: "40°44′ N · 44°52′ E",
};

// 4 · PULL-QUOTE over photography.
// 3 · THE CONCEPT SCREEN — the reference's held screen after the dome: a bold
// title over its photograph, both changing every four seconds, with a line
// of copy beneath. The three answers to "why here" live on as the three
// slides. Kicker stays fixed.
export const place = {
  label: "The concept",
  // Two seconds, asked for directly. It was 6000 because 2000 leaves no time
  // to read the line under the frame — the copy is ~120 characters and two
  // seconds is under half a comfortable reading pass. That is a real cost and
  // it is the client's to take; the pause control below is what keeps it
  // compliant (WCAG 2.2.2), and it is reachable by touch, pointer and
  // keyboard. The transitions were re-timed to land inside the two seconds:
  // the title's lift-and-reveal runs ~1.18s on the longest title and the
  // page turn ~0.78s, so a slide comes to rest before the next begins.
  interval: 2000,
  pause: "Pause the slideshow",
  play: "Play the slideshow",
  slides: [
    {
      title: "BOUTIQUE CONCEPT",
      img: phPlaceGarden,
      alt: "A garden lounge among lavender and roses — two bouclé armchairs and a stone table set with olives and drinks",
      copy: "A small gated community of houses and apartments, designed around privacy, wellbeing and an unhurried way of living.",
    },
    {
      title: "REAL-LIFE LOCATION",
      img: phPlaceTerrace,
      alt: "A stone terrace under bougainvillea, looking out over the town to the sea",
      copy: "Between Dilijan's forests, Sevan's shore and the slopes above Tsaghkadzor, an hour from Yerevan: seclusion within easy reach of the best of Armenian life.",
    },
    {
      title: "BUILT TO STAY",
      img: phPlaceComplex,
      alt: "Terraced stone houses stepping up a hillside, their balconies hung with flowers, hot-air balloons over the old town",
      copy: "Local tuff and basalt, timber cut and dried in country, deep-set windows and walls thick enough to keep the winters out.",
    },
  ],
  kicker: ["Designed as a street,", "not a block"],
};

// 4 · THE PULL — after the concept screen, the estate full-bleed, its sky
// running on from the blue above, and the architecture team's line set
// large in white over the pool, with the credit beneath.
export const pull = {
  img: phPullVilla,
  alt: "A stone villa hung with bougainvillea beside a long pool, palms and cypresses against a pale evening sky",
  quote:
    "Instead of corridors, paths connect the houses — so an address at Noratun feels closer to a small street than to a building.",
  by: "Architecture team",
  of: "Noratun",
};

// 5 · THE CONCEPT — the long statement, set big.
export const concept = {
  label: "THE APPROACH",
  lines: [
    "NORATUN PLACES HOMES IN FOUR ARMENIAN",
    "PLACES ONLY — CHOSEN FOR THEIR AIR,",
    "THEIR WATER AND THEIR QUIET, AND HELD",
    "TO THE SAME BUILDING STANDARD IN EACH.",
  ],
  side: "We are not a developer. We take a small number of addresses each year, check them the way we would check a house for our own family — title, structure, water, winter access, the neighbours — and place them with people who intend to stay. If an address does not pass, it does not reach this page.",
  img: phTerrace,
  alt: "A planted roof terrace with a long cushioned bench and timber tables",
};

// 6 · MAP — travel times from Yerevan, the reference's node line.
export const map = {
  // panel 1 — the arrival card that slides up as the chapter reaches the top
  info: {
    label: "Armenia · Southern Caucasus",
    title: ["FOUR PLACES,", "ONE COUNTRY"],
    copy: "Apartments in the capital, and houses where the country goes to breathe — forest, lake and slope.",
  },
  // panel 2 — the oversized title whose lines shear apart as the screen pans,
  // each at its own speed, with a photograph riding between them
  // three short words, one per stepped line, like the reference's NEW /
  // GOLDEN / MILE
  intro: ["THE", "ROAD", "HOME"],
  introCountry: "ARMENIA",
  introImg: phPlaceTerrace,
  introImgAlt:
    "A stone terrace under bougainvillea, looking out over the town to the sea",
  introCta: "View available homes",
  introHead: "BETWEEN THE CAPITAL AND THE LAKE",
  introCopy:
    "Ninety minutes of road covers all four places. Forest, water and slope on one side of it, and the city on the other — near enough that nobody has to choose between them.",
  // panel 3 — the route itself
  pathLabel: "The road home",
  img: phValley,
  alt: "A highland valley under afternoon light",
  nodes: [
    { place: "Yerevan", note: "the city" },
    { place: "Tsaghkadzor", note: "45 min" },
    { place: "Sevan", note: "1 h" },
    { place: "Dilijan", note: "1 h 20" },
  ],
  foot: "Every address is inside ninety minutes of Zvartnots — close enough for a Friday evening, far enough to be somewhere else.",
};

// 7 · COLLECTIONS — the reference's spec cards: bedrooms, area, one line.
export type Collection = {
  slug: string;
  place: string;
  name: string;
  bedrooms: string;
  area: string;
  copy: string;
  img: StaticImageData;
  alt: string;
  status?: "soon";
};

export const collections: Collection[] = [
  {
    slug: "yerevan-apartments",
    place: "Yerevan",
    name: "CITY APARTMENTS",
    bedrooms: "1 — 3",
    area: "48 — 140 m²",
    copy: "Kentron and Arabkir addresses in tuff-faced buildings, most with a closed balcony deep enough to eat on.",
    img: phTypeBalcony,
    alt: "A city terrace under a flowering pergola, cushioned seating and potted agaves, the rooftops and the sea beyond",
  },
  {
    slug: "dilijan-houses",
    place: "Dilijan",
    name: "FOREST HOUSES",
    bedrooms: "3 — 4",
    area: "160 — 260 m²",
    copy: "Detached houses inside the national park boundary, timber and stone, each with its own treeline and no house in view.",
    img: phTypeCourtyard,
    alt: "A walled courtyard with a young tree over a stone bench, white gravel, a rattan chair and vines spilling down the walls",
  },
  {
    slug: "sevan-residences",
    place: "Sevan",
    name: "LAKE RESIDENCES",
    bedrooms: "2 — 4",
    area: "120 — 210 m²",
    copy: "Low residences set back from the shore road, every main room turned to the water and the light coming off it.",
    img: phTypeGarden,
    alt: "A stone house with pergolas of bougainvillea over a lawn, a teak lounge and a bowl of pomegranates on the table",
  },
  {
    slug: "tsaghkadzor-chalets",
    place: "Tsaghkadzor",
    name: "SLOPE CHALETS",
    bedrooms: "2 — 5",
    area: "140 — 300 m²",
    copy: "Chalets on the lower slope, ski-out in winter and walkable to the ropeway, built for a house that is full in both seasons.",
    img: phTsaghkadzorSlope,
    alt: "A chalet under heavy snow at the treeline",
    status: "soon",
  },
];

export const collectionsIntro = {
  running: "A HOUSE TO LIVE IN — TO COME BACK TO, YEAR AFTER YEAR",
  lines: [
    "HOMES RUN FROM 48 TO 300 SQUARE METRES,",
    "SO THE SAME STANDARD REACHES A FIRST FLAT",
    "AND A HOUSE MEANT FOR THREE GENERATIONS.",
  ],
};

// 8 · AMENITIES — a reel of what an address carries, over photography.
export const amenities = {
  kicker: "(Amenities)",
  title: "WHAT COMES WITH THE ADDRESS",
  // The six carry a label, a place on the photograph and one line each. No
  // picture of their own: the deck and the band both show the grounds at
  // dusk behind all of them, which is the one photograph that is actually of
  // the thing this band is about.
  items: [
    {
      label: "Closed courtyard",
      x: "24%",
      y: "57%",
      note: "Gated, planted, and a place a child can be let out into.",
    },
    {
      label: "Water that works",
      x: "50%",
      y: "80%",
      note: "Storage and pressure sized for the whole building, not the ground floor.",
    },
    {
      label: "Winter access",
      x: "58%",
      y: "62%",
      note: "Cleared road agreements in writing before we place a single home.",
    },
    {
      label: "Heat that holds",
      x: "85%",
      y: "58%",
      note: "Underfloor throughout, and insulation checked against the invoice.",
    },
    {
      label: "Parking and charging",
      x: "6%",
      y: "56%",
      note: "One space per home, conduit run for a charger whether or not you want one now.",
    },
    {
      label: "Fibre",
      x: "44%",
      y: "32%",
      note: "Two providers to the door, so working from the house is not a gamble.",
    },
  ],
  // the one photograph the desktop screen keys its list to; each item's
  // x/y above is where its label floats on this picture
  img: phAmenNight,
  alt: "The grounds at dusk — a lit pool between stone houses hung with bougainvillea, palms and cypresses against a deep blue sky, a couple on a terrace by a small pool",
  // the statement set large, bottom left
  statement:
    "What comes with the address is settled before the first family moves in: courtyard, water, road, heat, parking, fibre.",
  cta: "Book a call now",
};

// 9 · INTERIORS — the reference's "space to live in" chapter.
export const interiors = {
  title: ["THE", "ROOMS", "YOU"],
  script: "live in",
  // the chapter's statement, set staggered in the condensed didone — the
  // first line stepped in, the rest flush
  statement: [
    "EVERY DETAIL WAS CHOSEN TO MAKE",
    "HOMES THAT FEEL CALM, CLEAR AND",
    "EFFORTLESS TO LIVE IN",
  ],
  copy: "Handed over finished, not “ready for finishing”: floors laid, kitchen fitted, bathrooms tiled, doors hung. What is left for the owner is furniture and opinion.",
  standard: [
    "Underfloor heating in every room",
    "Zoned climate control",
    "Triple glazing on exposed elevations",
    "Solid oak floors, oiled not lacquered",
    "Fitted kitchen with local stone tops",
  ],
  optional: [
    "Wood-burning stove and flue",
    "Sauna or hammam",
    "Roof solar and battery",
    "Cellar shelving and racking",
  ],
  images: [
    {
      src: phInteriorKitchen,
      alt: "A marble kitchen island with a window above the sink",
    },
    {
      src: phInteriorBedroom,
      alt: "A bedroom in linen and pale wood under a pendant light",
    },
    {
      src: phInteriorBath,
      alt: "A pale stone bathroom with a freestanding bath and a lit recess",
    },
    {
      src: phBalcony,
      alt: "A planted balcony with a cushioned sofa and flowering pots",
    },
  ],
  cta: "Ask about the finishes",
  // the chapter-foot gallery (the reference's rail-73 slider) — three
  // renders of the rooms as they are handed over, and one photograph
  gallery: [
    {
      src: phInterKitchen,
      alt: "An open kitchen and dining room in pale oak and stone, the sliding doors folded back to a planted terrace",
    },
    {
      src: phInterDining,
      alt: "A dining room panelled in walnut under a double-height ceiling, opening to a terrace with low seating and olive trees",
    },
    {
      src: phInterBedroom,
      alt: "A bedroom opening to a terrace under flowering bougainvillea, the town and the water beyond",
    },
    {
      src: phInteriorLiving,
      alt: "City apartment living room with tall windows and pale walls",
    },
  ],
};

// 10 · ARCHITECTURE — the credits chapter, giant word behind photography.
export const architecture = {
  word: "ARCHITECTURE",
  // the sequence's single photograph: its two frames each window their own
  // slice of it, so closing the gap between them makes the picture whole
  frame: {
    src: phPlaceComplex,
    alt: "Terraced stone houses stepping up a hillside, balconies hung with wisteria and bougainvillea over planted gardens and water",
  },
  copy: "Each address is drawn by an Armenian practice we have worked with before, to a brief we write with the buyers already on the list. Contemporary lines, local stone, and a roofline that does not argue with the ridge behind it.",
  images: [
    { src: phStair, alt: "A cream plaster stair rising into soft light" },
    {
      src: phFacade,
      alt: "Angular glazed balconies stacked across a pale facade",
    },
  ],
  // the credits screen: each line opens one line of fact beneath it
  credits: [
    { label: "Developer", info: "Noratun LLC, registered in Yerevan." },
    {
      label: "Sales & placement",
      info: "Handled in house, never through a third-party agency.",
    },
    {
      label: "Licence obtained",
      info: "Registered with the state cadastre of Armenia.",
    },
    {
      label: "2026",
      info: "The current release. The next one opens each spring.",
    },
  ],
};

// 10c · VIEWS — the picture fills the screen while the type climbs over it at
// its own rate; then the picture pulls back into a frame and the wine field
// opens on all four sides, carrying on into the call and the footer.
export const views = {
  title: ["PERFECT", "LAKE VIEWS"],
  sub: "From every terrace",
  cta: "View available homes",
  img: phViewsTerrace,
  alt: "A terrace under a bougainvillea pergola — a laid table and low seating, the town and the water beyond",
};

// 11 · CTA — book a call.
export const cta = {
  lines: ["A CALL IS ENOUGH", "TO KNOW WHICH"],
  script: "of the four",
  tail: "SUITS YOU",
  copy: "Fifteen minutes on the phone settles more than a week of listings: which of the four places fits how you actually live, what a realistic budget reaches there, and what is genuinely available this season.",
  button: "Book a call",
  img: phTerrace,
  alt: "A roof terrace with a long bench and low timber tables",
};

// 11b · CONTACT — its own page, the reference's contact screen.
//
// Three columns of label-over-value on a pale blue ground, under a title set
// at the same 172.8/400/0.87 as the home page's close, then the site plan
// full-bleed beneath with one label on it. Nothing here is new information:
// the address, the phone and the email are brand's own, so the page cannot
// drift out of step with the footer that repeats them.
export const contact = {
  title: "CONTACT US",
  lead: "A short conversation is enough to settle which of the addresses fits how you actually live — a first home, a second one for the summer, or somewhere to put the winters.",
  columns: [
    {
      label: "Write us",
      items: [{ text: brand.email, href: `mailto:${brand.email}` }],
    },
    {
      label: "Sales office",
      items: [{ text: brand.office }],
      second: {
        label: "Where the homes are",
        items: [{ text: "Yerevan · Dilijan · Sevan · Tsaghkadzor" }],
      },
    },
    {
      label: "Talk to us",
      items: [
        { text: brand.phone, href: `tel:${brand.phone.replace(/[^\d+]/g, "")}` },
        { text: "Book a call", call: true },
      ],
    },
  ],
  hours: "Daily 09:00 – 19:00",
  map: {
    img: phContactMap,
    alt: "A site plan of the estate and the town around it — the houses stepping down their own hillside, the roads and the roundabouts that reach them, and the water along the foot of the drawing",
    label: "Sales office",
    // The plate that sits over the drawing, with the seal on its right and a
    // pointer under it aimed at the office's own block.
    plate: { label: "Sales office", hours: "Daily 09:00 – 21:00" },
    orb: { label: ["Book a call", "now"] },
    // The reference pins local landmarks on its plan. Pinning OUR OWN
    // collections instead says something the visitor can act on — which part
    // of the estate each name refers to — and invents no third-party places.
    // x/y are percentages of the map band, not of the plate.
    // Positions are chosen against the drawing AND against the plate: Pine
    // lane began at 47/46, directly under the plate, and was invisible.
    pins: [
      { label: ["Orran", "court"], x: 21, y: 21 },
      { label: ["Pine", "lane"], x: 44, y: 62 },
      { label: ["Saryan", "court"], x: 16, y: 66 },
      { label: ["Shore", "terrace"], x: 71, y: 72 },
    ],
  },
  // The courtyard, after the plan: the drawing says where, this says what it
  // is like to be there. It carries the same arrival and drift as every other
  // photograph on the site, then the footer runs on underneath.
  court: {
    img: phContactCourt,
    alt: "A walled courtyard in pale stone — a low built-in sofa under bougainvillea spilling over the parapet, a young tree in white gravel, a brass lantern on the wall and a stone water basin beside a cane chair",
    caption: "The courtyard at 12 Saryan Street",
  },
};

// 12 · FOOTER
export const footer = {
  toTop: "To top",
  officeLabel: "Sales office",
  // set on two lines, as the reference sets its own address
  office: ["12 Saryan Street, 0002", "Yerevan, Armenia"],
  rights: "All rights reserved",
  contactLabel: "Contact",
  legal: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of use", href: "/terms" },
  ],
};

// The contact dialog — same honesty rules as every other build here: with no
// delivery configured the endpoint says so and the dialog offers the phone.
export const callModal = {
  // The reference's dialog opens with ONE line, set in the script face, and
  // nothing above it — no kicker, no headline. The promise underneath is the
  // same one the delivered state makes, so the dialog cannot say one thing
  // before you send and another after.
  script: "Book a call",
  lead: "Leave your details and we will call you back within one working day.",
  fields: {
    name: "Name",
    phone: "Phone",
    email: "Email",
    message: "Message",
  },
  send: "Request the call",
  sending: "Sending",
  // No tick-box: the reference asks for none, and the box was never sent to
  // the endpoint or checked there — it only stood between a typed form and
  // the send. Submitting IS the agreement, and the policy is one tap away.
  agree: "By submitting, you agree to our",
  privacy: "Privacy policy",
  okDelivered: "Thank you — we have it. We call back within one working day.",
  // The delivered state takes over the whole window rather than adding a line
  // above the form: the same lake ground, the same script face, the same seal
  // — only the right-hand column changes, from the four fields to this.
  ok: {
    script: "Thank you",
    lead: "We have your request.",
    when: "We call back within one working day.",
    aboutLabel: "Your message was about",
    done: "Close",
  },
  okUndelivered:
    "Saved, but call-back delivery isn't switched on for this build yet — please reach us directly so nothing is lost:",
  failed: "That didn't send. Please reach us directly:",
  fix: "Some details still need attention:",
  close: "Close",
};

// 13 · /HOMES — the catalog page. Anatomy from the reference's listing page:
// a giant didone title over a flower stamp, a working filter row, a 3-across
// grid of "blueprint cards" (technical frame, square contain plan, spec rows)
// with photo tiles mixed in, a vertical place rail fixed at the left, then a
// closing chapter and the footer. Every listing below is our own invention;
// the plans are original room diagrams drawn as SVG geometry.
// A room rectangle in the plan's own 100 x 70 drafting grid. `label` and
// `area` are printed inside the room; `out` marks garden and terrace, which
// draw tinted and never count toward the interior area.
export type Room = {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  area?: number;
  out?: true;
};
// Every home draws TWO plans, upper level first. Where a home is single
// storey the second is its outdoor level, which is the honest drawing.
// A level is drawn one of two ways: from the architect's own sheet — `img`
// is the panel cut out of it, `alt` says what that drawing shows — or, for a
// home with no sheet yet, from a room schedule the FloorPlan component draws.
export type Level = {
  caption: string;
  img?: StaticImageData;
  alt?: string;
  rooms?: Room[];
};

export type Listing = {
  id: string;
  code: string; // the № on the card
  name: string;
  place: "Yerevan" | "Dilijan" | "Sevan";
  kind: string;
  typology: Typology;
  block: string;
  floor: string;
  // Both are read off the sheet and NEVER estimated: bedrooms is the count of
  // rooms drawn with a bed; area is the sum of the interior rooms the sheet
  // numbers. A sheet that draws no bed, or numbers too few of its rooms,
  // leaves the value null and the card simply omits it.
  bedrooms: number | null;
  area: number | null; // m², the rooms as numbered on the sheet
  terrace: number; // m² outdoor, quoted separately as the reference does
  completion: string; // "2Q 2027"
  level: string; // "Floor 4" | "Plot 5.5 a"
  status: "available" | "reserved";
  // The study sheet these plans were cut from ("v15"), served whole at
  // public/sheets/v15.jpg — the reference's "PDF", ours being the drawing
  // the facts above were actually read off.
  sheet: string;
  // Cars the sheet draws bays for. Null where it draws none, or draws them
  // without making the count legible — never a guess.
  parking: number | null;
  // A home's OWN photography, where it has any. homeGallery below is shared
  // by every address in a place; this overrides it for one home only.
  gallery?: Array<{ src: StaticImageData; alt: string }>;
  // One or two sentences naming ONLY rooms the sheet draws.
  description: string;
  // Six to eight things the sheet draws. No brands, no ratings, no claims
  // about a building nobody has photographed yet.
  benefits: string[];
  note: string;
  levels: Level[];
};

// NORATUN's equivalents of the reference's four typologies
export const TYPOLOGIES = [
  "Garden + lower level",
  "Garden level",
  "Penthouse",
  "Duplex",
] as const;
export type Typology = (typeof TYPOLOGIES)[number];

// The gallery on a home's own page, by place. Alts describe what each
// photograph actually shows — they are reused verbatim from where the same
// photograph already appears on the site.
export const homeGallery: Record<
  Listing["place"],
  Array<{ src: StaticImageData; alt: string }>
> = {
  Yerevan: [
    {
      src: phInteriorLiving,
      alt: "City apartment living room with tall windows and pale walls",
    },
    {
      src: phInteriorKitchen,
      alt: "A marble kitchen island with a window above the sink",
    },
    {
      src: phBalcony,
      alt: "A planted balcony with a cushioned sofa and flowering pots",
    },
  ],
  Dilijan: [
    { src: phDilijanForest, alt: "Pine forest climbing a ridge at sundown" },
    { src: phStair, alt: "A cream plaster stair rising into soft light" },
    {
      src: phCourtyard,
      alt: "Terraced planting and clipped hedges climbing beside a residential block",
    },
  ],
  Sevan: [
    { src: phSevanLake, alt: "A wooden jetty reaching into a still lake" },
    {
      src: phTerrace,
      alt: "A planted roof terrace with a long cushioned bench and timber tables",
    },
    {
      src: phInteriorBath,
      alt: "A pale stone bathroom with a freestanding bath and a lit recess",
    },
  ],
};

// The closing band's photograph on a home's own page. One per place, so a
// town house never closes on a lake. Alts are verbatim from where each of
// these photographs already appears on the site.
export const placeClose: Record<
  Listing["place"],
  { src: StaticImageData; alt: string }
> = {
  Yerevan: {
    src: phTerrace,
    alt: "A roof terrace with a long bench and low timber tables",
  },
  Dilijan: {
    src: phDilijanForest,
    alt: "Pine forest climbing a ridge at sundown",
  },
  Sevan: { src: phSevanLake, alt: "A wooden jetty reaching into a still lake" },
};

// the seventeen homes live in lib/listings.ts, one entry per plan sheet
export { listings } from "./listings";

export const homesPage = {
  kicker: "(Available now)",
  title: "HOMES",
  sub: "Seventeen houses across three places — town houses in Yerevan, forest houses in Dilijan, lake houses at Sevan. Tsaghkadzor joins for the winter season.",
  // the reference opens its listing page with three intro blocks; these are ours
  intro: [
    {
      title: "Boutique by count",
      copy: "Every address we take on is under thirty homes. The list you are reading is the whole of it — not a selection from a larger stock.",
    },
    {
      title: "Built to stay",
      copy: "Local tuff and basalt, timber cut and dried in country, deep-set windows. Nothing is finished in a material that looks tired in five winters.",
    },
    {
      title: "Handed over finished",
      copy: "Floors laid, kitchen fitted, bathrooms tiled, doors hung. What is left for the owner is furniture and opinion.",
    },
  ],
  legend:
    "The plans are the architect's study sheets, cut to the drawing. An area is the sum of the rooms numbered on that sheet, garages and terraces aside — where a sheet numbers too few of its rooms, no total is shown.",
  typologyLabel: "Typology",
  bedsLabel: "Bedrooms",
  sortLabel: "Sort by",
  resetLabel: "Reset",
  allLabel: "All",
  bedsAny: "All",
  beds3plus: "3+",
  sortOptions: [
    { v: "relevant", label: "Relevant" },
    { v: "smallest", label: "Smallest area" },
    { v: "largest", label: "Largest area" },
  ] as const,
  onlyAvailable: "Only available",
  placeAll: "All places",
  soon: "Tsaghkadzor — soon",
  shown: (n: number, total: number) => `${n} of ${total} homes shown`,
  empty:
    "Nothing matches that mix — loosen a filter, or call us: the list moves weekly.",
  ask: "Ask about",
  statusLabel: { available: "Available", reserved: "Reserved" },
  // the sticky side panel
  panel: {
    title: ["SELECT", "A HOME"],
    call: "Book a call",
    contact: "Contact",
  },
  completionLabel: "Completion",
  terraceLabel: "Terrace",
  // /homes/[id]
  detail: {
    back: "All homes",
    code: (c: string) => `No. ${c}`,
    completion: "Completion",
    tabs: { info: "Info", benefits: "Benefits" },
    request: "Submit a request",
    // the round button beside the request pill. The reference's says PDF and
    // opens a brochure; ours opens the study sheet itself.
    sheet: "Sheet",
    sheetTitle: (name: string) => `Open the study sheet for ${name} (JPEG)`,
    similar: "Similar options",
    similarSub: ["Other homes", "that might suit you"],
    viewAll: "View all",
    // the closing band. The one-pager closes on the lake; a home's page
    // closes on the list, which is true wherever the home is.
    closeTitle: ["THE WHOLE", "LIST"],
    closeSub: "Yerevan · Dilijan · Sevan",
    closeCta: "See every home",
    crumbs: ["Home", "Select a home"],
    levels: "Levels",
    specLabel: "The schedule",
    galleryLabel: "The finish",
    callLabel: "Ask about this home",
    callCopy:
      "Fifteen minutes on the phone settles whether this one fits how you actually live — and what else is coming to the list.",
    spec: {
      code: "Reference",
      typology: "Typology",
      place: "Place",
      block: "Block",
      floor: "Level",
      bedrooms: "Bedrooms",
      area: "Rooms as numbered",
      terrace: "Terrace",
      completion: "Completion",
      status: "Status",
      // what the schedule says when the sheet does not give the figure
      unnumbered: "Not numbered on the sheet",
      undrawn: "No bed drawn on the sheet",
      parking: "Parking spaces",
    },
  },
  // Three photo tiles now, spaced through the grid — one after the fourth
  // card, one after the ninth, one after the fourteenth.
  tiles: [
    {
      img: phTilePergola,
      alt: "A stone house behind a pergola thick with bougainvillea, its sliding doors open to a shaded seating area, with a table laid under the vine and lavender along the path",
    },
    {
      img: phTileLiving,
      alt: "A double-height living room in concrete and oak, curtains drawn back from a full-height window onto a planted terrace with the wooded slope beyond",
    },
    {
      img: phTileArarat,
      alt:
        "A terrace under a bougainvillea pergola at sundown, a table laid beside the olives, and Ararat with the monastery on its foothill through the open sliding doors",
    },
  ],
  tail: {
    running: "THE LIST MOVES WEEKLY — RESERVED HOMES RETURN, NEW ONES ARRIVE",
    lines: ["IF THE RIGHT ONE", "IS NOT HERE TODAY,"],
    script: "it may be",
    tailWord: "HERE FRIDAY.",
    copy: "Fifteen minutes on the phone settles which of the places fits how you live — and what is genuinely coming to the list next.",
    button: "Book a call",
    back: "The four collections",
    img: phTailColonnade,
    alt: "A stone colonnade of arches and columns hung with bougainvillea, lavender in the beds beneath and the sea beyond the trees",
  },
};

export const nav = [
  { label: "Homes", href: "/homes" },
  // was "The approach" -> #approach. The reference's third link is CONTACT and
  // it leads to a page; the approach section is untouched and still reachable
  // from the phone menu's chapter list below.
  { label: "Contact", href: "/contact" },
  { label: "Book a call", href: "#call" },
];
// the nav's hairline lockup: two stacked display lines split by a rule (the
// reference's SELECT / AN APARTMENT). It points where the homes are, so on
// wide screens it stands in for the plain "Homes" link above.
export const navCta = { lines: ["Select", "a home"], href: "/homes" };

// The chapter index the phone pill opens. The page is 23.7 phone viewports
// and the desktop rail — which carries the site's shared coordinate — is
// hidden there, so without this a visitor can only reach a band by scrolling
// to it. Every label below is an EXISTING string from this file or a
// section's own accessible name; nothing new is written for the menu.
export const chapters: Array<{ id: string; label: string }> = [
  { id: "main", label: brand.full },
  { id: "approach", label: concept.label },
  { id: "concept", label: place.label },
  { id: "voice", label: pull.by },
  { id: "slow", label: bloom.foot },
  { id: "where", label: map.info.title.join(" ") },
  { id: "sky", label: `${sky.city}, ${sky.country}` },
  { id: "collections", label: navCta.lines.join(" ") },
  { id: "amenities", label: amenities.title },
  {
    id: "interiors",
    label: `${interiors.title.join(" ")} ${interiors.script}`,
  },
  { id: "architecture", label: architecture.word },
  { id: "credits", label: "Credits" },
  { id: "views", label: views.title.join(" ") },
  { id: "call", label: cta.button },
];
