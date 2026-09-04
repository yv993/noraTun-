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
  // EMPTY UNTIL REAL. Every consumer renders this conditionally, so one real
  // profile added here is the only edit needed — no dead links ship.
  social: [] as Array<{ label: string; href: string }>,
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
    night: "The same villa at night under the Milky Way — its eaves traced with light, the rooms glowing, the pool lit from below and the sea beyond the palms",
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
  interval: 2000,
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
  quote: "Instead of corridors, paths connect the houses — so an address at Noratun feels closer to a small street than to a building.",
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
  introImgAlt: "A stone terrace under bougainvillea, looking out over the town to the sea",
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
  // Each item carries its own photograph — the desktop band swaps them by
  // tab, the reference's device. Alt text describes what each frame
  // actually shows, reused verbatim from where these photos already appear.
  items: [
    {
      label: "Closed courtyard",
      x: "24%",
      y: "57%",
      note: "Gated, planted, and a place a child can be let out into.",
      img: phCourtyard,
      alt: "Terraced planting and clipped hedges climbing beside a residential block",
    },
    {
      label: "Water that works",
      x: "50%",
      y: "80%",
      note: "Storage and pressure sized for the whole building, not the ground floor.",
      img: phInteriorBath,
      alt: "A pale stone bathroom with a freestanding bath and a lit recess",
    },
    {
      label: "Winter access",
      x: "58%",
      y: "62%",
      note: "Cleared road agreements in writing before we place a single home.",
      img: phTsaghkadzorSlope,
      alt: "A chalet under heavy snow at the treeline",
    },
    {
      label: "Heat that holds",
      x: "85%",
      y: "58%",
      note: "Underfloor throughout, and insulation checked against the invoice.",
      img: phInteriorLiving,
      alt: "City apartment living room with tall windows and pale walls",
    },
    {
      label: "Parking and charging",
      x: "6%",
      y: "56%",
      note: "One space per home, conduit run for a charger whether or not you want one now.",
      img: phFacade,
      alt: "Angular glazed balconies stacked across a pale facade",
    },
    {
      label: "Fibre",
      x: "44%",
      y: "32%",
      note: "Two providers to the door, so working from the house is not a gamble.",
      img: phInteriorBedroom,
      alt: "A bedroom in linen and pale wood under a pendant light",
    },
  ],
  // the one photograph the desktop screen keys its list to; each item's
  // x/y above is where its label floats on this picture
  img: phAmenNight,
  alt: "The grounds at dusk — a lit pool between stone houses hung with bougainvillea, palms and cypresses against a deep blue sky, a couple on a terrace by a small pool",
  // the statement set large, bottom left
  statement: "What comes with the address is settled before the first family moves in: courtyard, water, road, heat, parking, fibre.",
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
    { src: phInteriorKitchen, alt: "A marble kitchen island with a window above the sink" },
    { src: phInteriorBedroom, alt: "A bedroom in linen and pale wood under a pendant light" },
    { src: phInteriorBath, alt: "A pale stone bathroom with a freestanding bath and a lit recess" },
    { src: phBalcony, alt: "A planted balcony with a cushioned sofa and flowering pots" },
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
    { src: phInteriorLiving, alt: "City apartment living room with tall windows and pale walls" },
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
    { src: phFacade, alt: "Angular glazed balconies stacked across a pale facade" },
  ],
  // the credits screen: each line opens one line of fact beneath it
  credits: [
    { label: "Developer", info: "Noratun LLC, registered in Yerevan." },
    { label: "Sales & placement", info: "Handled in house, never through a third-party agency." },
    { label: "Licence obtained", info: "Registered with the state cadastre of Armenia." },
    { label: "2026", info: "The current release. The next one opens each spring." },
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
  kicker: "(Book a call)",
  title: ["TELL US WHERE", "YOU WANT TO WAKE UP"],
  fields: {
    name: "Name",
    phone: "Phone",
    email: "Email",
    message: "Which place interests you, and roughly when?",
  },
  send: "Request the call",
  sending: "Sending",
  consent: "I've read how Noratun handles this message",
  okDelivered: "Thank you — we have it. We call back within one working day.",
  okUndelivered:
    "Saved, but call-back delivery isn't switched on for this build yet — please reach us directly so nothing is lost:",
  failed: "That didn't send. Please reach us directly:",
  close: "Close",
};

// 13 · /HOMES — the catalog page. Anatomy from the reference's listing page:
// a giant didone title over a flower stamp, a working filter row, a 3-across
// grid of "blueprint cards" (technical frame, square contain plan, spec rows)
// with photo tiles mixed in, a vertical place rail fixed at the left, then a
// closing chapter and the footer. Every listing below is our own invention;
// the plans are original room diagrams drawn as SVG geometry.
export type Room = { x: number; y: number; w: number; h: number; t?: string };
export type Listing = {
  id: string;
  name: string;
  place: "Yerevan" | "Dilijan" | "Sevan";
  kind: string;
  bedrooms: number;
  area: number; // m²
  level: string; // "Floor 4" | "Plot 5.5 a"
  status: "available" | "reserved";
  note: string;
  plan: Room[];
};

export const listings: Listing[] = [
  {
    id: "Y-A4", name: "Orran A4", place: "Yerevan", kind: "Apartment", bedrooms: 1, area: 52,
    level: "Floor 4", status: "available", note: "Saryan district · five minutes to the park",
    plan: [
      { x: 8, y: 14, w: 50, h: 44, t: "L" }, { x: 8, y: 58, w: 50, h: 28, t: "K" },
      { x: 58, y: 14, w: 34, h: 38, t: "B" }, { x: 58, y: 52, w: 34, h: 16, t: "W" },
      { x: 58, y: 68, w: 34, h: 18, t: "T" },
    ],
  },
  {
    id: "Y-B2", name: "Orran B2", place: "Yerevan", kind: "Apartment", bedrooms: 2, area: 78,
    level: "Floor 2", status: "available", note: "Saryan district · courtyard side",
    plan: [
      { x: 8, y: 14, w: 44, h: 46, t: "L" }, { x: 8, y: 60, w: 26, h: 26, t: "K" },
      { x: 34, y: 60, w: 18, h: 26, t: "W" }, { x: 52, y: 14, w: 40, h: 30, t: "B" },
      { x: 52, y: 44, w: 40, h: 28, t: "B" }, { x: 52, y: 72, w: 40, h: 14, t: "T" },
    ],
  },
  {
    id: "Y-C12", name: "Saryan Court 12", place: "Yerevan", kind: "Apartment", bedrooms: 2, area: 84,
    level: "Floor 5", status: "reserved", note: "Corner rooms · evening sun",
    plan: [
      { x: 8, y: 14, w: 40, h: 18, t: "T" }, { x: 8, y: 32, w: 40, h: 40, t: "L" },
      { x: 8, y: 72, w: 40, h: 14, t: "K" }, { x: 48, y: 14, w: 44, h: 34, t: "B" },
      { x: 48, y: 48, w: 44, h: 24, t: "B" }, { x: 48, y: 72, w: 44, h: 14, t: "W" },
    ],
  },
  {
    id: "Y-P7", name: "Komitas Parkside 7", place: "Yerevan", kind: "Apartment", bedrooms: 3, area: 112,
    level: "Floor 6", status: "available", note: "Park windows in every bedroom",
    plan: [
      { x: 8, y: 14, w: 50, h: 36, t: "L" }, { x: 8, y: 50, w: 24, h: 36, t: "K" },
      { x: 32, y: 50, w: 26, h: 18, t: "W" }, { x: 32, y: 68, w: 26, h: 18, t: "H" },
      { x: 58, y: 14, w: 34, h: 26, t: "B" }, { x: 58, y: 40, w: 34, h: 24, t: "B" },
      { x: 58, y: 64, w: 34, h: 22, t: "B" },
    ],
  },
  {
    id: "Y-A9", name: "Orran Penthouse A9", place: "Yerevan", kind: "Apartment", bedrooms: 3, area: 138,
    level: "Floor 9", status: "available", note: "Wrapped terrace · Ararat side",
    plan: [
      { x: 8, y: 14, w: 46, h: 42, t: "L" }, { x: 8, y: 56, w: 22, h: 30, t: "K" },
      { x: 30, y: 56, w: 24, h: 14, t: "W" }, { x: 30, y: 70, w: 24, h: 16, t: "H" },
      { x: 54, y: 14, w: 38, h: 24, t: "B" }, { x: 54, y: 38, w: 38, h: 24, t: "B" },
      { x: 54, y: 62, w: 38, h: 28, t: "T" },
    ],
  },
  {
    id: "D-3", name: "Pine Lane 3", place: "Dilijan", kind: "House", bedrooms: 2, area: 96,
    level: "Plot 4.0 a", status: "available", note: "First line of the forest",
    plan: [
      { x: 8, y: 14, w: 52, h: 44, t: "L" }, { x: 8, y: 58, w: 30, h: 28, t: "K" },
      { x: 38, y: 58, w: 22, h: 28, t: "W" }, { x: 60, y: 14, w: 32, h: 36, t: "B" },
      { x: 60, y: 50, w: 32, h: 36, t: "B" },
    ],
  },
  {
    id: "D-5", name: "Pine Lane 5", place: "Dilijan", kind: "House", bedrooms: 3, area: 128,
    level: "Plot 5.5 a", status: "reserved", note: "The quiet end of the lane",
    plan: [
      { x: 8, y: 14, w: 48, h: 40, t: "L" }, { x: 8, y: 54, w: 24, h: 32, t: "K" },
      { x: 32, y: 54, w: 24, h: 16, t: "W" }, { x: 32, y: 70, w: 24, h: 16, t: "H" },
      { x: 56, y: 14, w: 36, h: 26, t: "B" }, { x: 56, y: 40, w: 36, h: 24, t: "B" },
      { x: 56, y: 64, w: 36, h: 22, t: "B" },
    ],
  },
  {
    id: "D-HS", name: "Half-Stone House", place: "Dilijan", kind: "House", bedrooms: 3, area: 142,
    level: "Plot 6.2 a", status: "available", note: "Stone below, timber above",
    plan: [
      { x: 8, y: 14, w: 56, h: 40, t: "L" }, { x: 8, y: 54, w: 28, h: 32, t: "K" },
      { x: 36, y: 54, w: 28, h: 16, t: "W" }, { x: 36, y: 70, w: 28, h: 16, t: "H" },
      { x: 64, y: 14, w: 28, h: 28, t: "B" }, { x: 64, y: 42, w: 28, h: 26, t: "B" },
      { x: 64, y: 68, w: 28, h: 18, t: "B" },
    ],
  },
  {
    id: "D-FG1", name: "Forest Gate 1", place: "Dilijan", kind: "House", bedrooms: 4, area: 168,
    level: "Plot 8.0 a", status: "available", note: "The largest plot of the lane",
    plan: [
      { x: 8, y: 14, w: 44, h: 36, t: "L" }, { x: 8, y: 50, w: 22, h: 36, t: "K" },
      { x: 30, y: 50, w: 22, h: 18, t: "W" }, { x: 30, y: 68, w: 22, h: 18, t: "H" },
      { x: 52, y: 14, w: 40, h: 20, t: "B" }, { x: 52, y: 34, w: 40, h: 18, t: "B" },
      { x: 52, y: 52, w: 40, h: 18, t: "B" }, { x: 52, y: 70, w: 40, h: 16, t: "B" },
    ],
  },
  {
    id: "S-T2", name: "Shore Terrace 2", place: "Sevan", kind: "Lake house", bedrooms: 2, area: 88,
    level: "Plot 3.6 a", status: "available", note: "Terrace faces the water",
    plan: [
      { x: 8, y: 14, w: 84, h: 16, t: "T" }, { x: 8, y: 30, w: 50, h: 38, t: "L" },
      { x: 8, y: 68, w: 26, h: 18, t: "K" }, { x: 34, y: 68, w: 24, h: 18, t: "W" },
      { x: 58, y: 30, w: 34, h: 28, t: "B" }, { x: 58, y: 58, w: 34, h: 28, t: "B" },
    ],
  },
  {
    id: "S-T4", name: "Shore Terrace 4", place: "Sevan", kind: "Lake house", bedrooms: 3, area: 121,
    level: "Plot 4.4 a", status: "available", note: "Morning light across the lake",
    plan: [
      { x: 8, y: 14, w: 84, h: 14, t: "T" }, { x: 8, y: 28, w: 46, h: 40, t: "L" },
      { x: 8, y: 68, w: 24, h: 18, t: "K" }, { x: 32, y: 68, w: 22, h: 18, t: "W" },
      { x: 54, y: 28, w: 38, h: 22, t: "B" }, { x: 54, y: 50, w: 38, h: 20, t: "B" },
      { x: 54, y: 70, w: 38, h: 16, t: "B" },
    ],
  },
  {
    id: "S-L1", name: "Lighthouse Row 1", place: "Sevan", kind: "Lake house", bedrooms: 3, area: 134,
    level: "Plot 5.0 a", status: "reserved", note: "End of the row · open horizon",
    plan: [
      { x: 8, y: 14, w: 84, h: 16, t: "T" }, { x: 8, y: 30, w: 52, h: 36, t: "L" },
      { x: 8, y: 66, w: 28, h: 20, t: "K" }, { x: 36, y: 66, w: 24, h: 20, t: "W" },
      { x: 60, y: 30, w: 32, h: 24, t: "B" }, { x: 60, y: 54, w: 32, h: 18, t: "B" },
      { x: 60, y: 72, w: 32, h: 14, t: "B" },
    ],
  },
];

export const homesPage = {
  kicker: "(Available now)",
  title: "HOMES",
  sub: "Twelve homes across three places — apartments in Yerevan, houses in Dilijan, lake houses at Sevan. Tsaghkadzor joins for the winter season.",
  legend: "L living · K kitchen · B bedroom · W wash · T terrace · H hall — indicative plans",
  bedsLabel: "Bedrooms",
  bedsAny: "Any",
  beds3plus: "3+",
  onlyAvailable: "Only available",
  placeAll: "All places",
  soon: "Tsaghkadzor — soon",
  shown: (n: number, total: number) => `${n} of ${total} homes shown`,
  empty: "Nothing matches that mix — loosen a filter, or call us: the list moves weekly.",
  ask: "Ask about",
  statusLabel: { available: "Available", reserved: "Reserved" },
  tiles: [
    { img: phBalcony, alt: "A planted balcony with a cushioned sofa and flowering pots" },
    { img: phStair, alt: "A cream plaster stair rising into soft light" },
  ],
  tail: {
    running: "THE LIST MOVES WEEKLY — RESERVED HOMES RETURN, NEW ONES ARRIVE",
    lines: ["IF THE RIGHT ONE", "IS NOT HERE TODAY,"],
    script: "it may be",
    tailWord: "HERE FRIDAY.",
    copy: "Fifteen minutes on the phone settles which of the places fits how you live — and what is genuinely coming to the list next.",
    button: "Book a call",
    back: "The four collections",
    img: phCourtyard,
    alt: "Terraced planting and clipped hedges beside a residential block",
  },
};

export const nav = [
  { label: "Homes", href: "/homes" },
  { label: "The approach", href: "#approach" },
  { label: "Book a call", href: "#call" },
];
// the nav's hairline lockup: two stacked display lines split by a rule (the
// reference's SELECT / AN APARTMENT). It points where the homes are, so on
// wide screens it stands in for the plain "Homes" link above.
export const navCta = { lines: ["Select", "a home"], href: "/homes" };
