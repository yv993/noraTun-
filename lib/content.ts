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
// A room rectangle in the plan's own 100 x 70 drafting grid. `label` and
// `area` are printed inside the room; `out` marks garden and terrace, which
// draw tinted and never count toward the interior area.
export type Room = { x: number; y: number; w: number; h: number; label?: string; area?: number; out?: true };
// Every home draws TWO plans, upper level first. Where a home is single
// storey the second is its outdoor level, which is the honest drawing.
export type Level = { caption: string; rooms: Room[] };

export type Listing = {
  id: string;
  code: string; // the № on the card
  name: string;
  place: "Yerevan" | "Dilijan" | "Sevan";
  kind: string;
  typology: Typology;
  block: string;
  floor: string;
  bedrooms: number;
  area: number; // m² interior
  terrace: number; // m² outdoor, quoted separately as the reference does
  completion: string; // "2Q 2027"
  level: string; // "Floor 4" | "Plot 5.5 a"
  status: "available" | "reserved";
  note: string;
  levels: Level[];
};

// NORATUN's equivalents of the reference's four typologies
export const TYPOLOGIES = ["Garden + lower level", "Garden level", "Penthouse", "Duplex"] as const;
export type Typology = (typeof TYPOLOGIES)[number];

// The gallery on a home's own page, by place. Alts describe what each
// photograph actually shows — they are reused verbatim from where the same
// photograph already appears on the site.
export const homeGallery: Record<Listing["place"], Array<{ src: StaticImageData; alt: string }>> = {
  Yerevan: [
    { src: phInteriorLiving, alt: "City apartment living room with tall windows and pale walls" },
    { src: phInteriorKitchen, alt: "A marble kitchen island with a window above the sink" },
    { src: phBalcony, alt: "A planted balcony with a cushioned sofa and flowering pots" },
  ],
  Dilijan: [
    { src: phDilijanForest, alt: "Pine forest climbing a ridge at sundown" },
    { src: phStair, alt: "A cream plaster stair rising into soft light" },
    { src: phCourtyard, alt: "Terraced planting and clipped hedges climbing beside a residential block" },
  ],
  Sevan: [
    { src: phSevanLake, alt: "A wooden jetty reaching into a still lake" },
    { src: phTerrace, alt: "A planted roof terrace with a long cushioned bench and timber tables" },
    { src: phInteriorBath, alt: "A pale stone bathroom with a freestanding bath and a lit recess" },
  ],
};

export const listings: Listing[] = [
  {
    id: "Y-A4", code: "011", name: "Orran A4", place: "Yerevan", kind: "Apartment",
    typology: "Garden level", block: "A1", floor: "4 floor", bedrooms: 1, area: 52, terrace: 9,
    completion: "2Q 2027", level: "Floor 4", status: "available",
    note: "Saryan district · five minutes to the park",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 48, h: 32, label: "Living", area: 20 },
        { x: 6, y: 38, w: 28, h: 26, label: "Kitchen", area: 9 },
        { x: 34, y: 38, w: 20, h: 26, label: "Hall", area: 4 },
        { x: 54, y: 6, w: 40, h: 34, label: "Bedroom", area: 14 },
        { x: 54, y: 40, w: 40, h: 24, label: "Bath", area: 5 },
      ] },
      { caption: "Terrace", rooms: [
        { x: 6, y: 10, w: 62, h: 46, label: "Terrace", area: 9, out: true },
        { x: 68, y: 10, w: 26, h: 20, label: "Store", area: 2, out: true },
      ] },
    ],
  },
  {
    id: "Y-B2", code: "012", name: "Orran B2", place: "Yerevan", kind: "Apartment",
    typology: "Garden level", block: "A1", floor: "2 floor", bedrooms: 2, area: 78, terrace: 12,
    completion: "2Q 2027", level: "Floor 2", status: "available",
    note: "Saryan district · courtyard side",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 46, h: 34, label: "Living", area: 26 },
        { x: 6, y: 40, w: 26, h: 24, label: "Kitchen", area: 11 },
        { x: 32, y: 40, w: 20, h: 24, label: "Hall", area: 6 },
        { x: 52, y: 6, w: 42, h: 26, label: "Bedroom", area: 15 },
        { x: 52, y: 32, w: 42, h: 20, label: "Bedroom", area: 13 },
        { x: 52, y: 52, w: 42, h: 12, label: "Bath", area: 7 },
      ] },
      { caption: "Terrace", rooms: [
        { x: 6, y: 12, w: 88, h: 42, label: "Terrace", area: 12, out: true },
      ] },
    ],
  },
  {
    id: "Y-C12", code: "013", name: "Saryan Court 12", place: "Yerevan", kind: "Apartment",
    typology: "Garden level", block: "A2", floor: "5 floor", bedrooms: 2, area: 84, terrace: 10,
    completion: "4Q 2027", level: "Floor 5", status: "reserved",
    note: "Corner rooms · evening sun",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 44, h: 36, label: "Living", area: 28 },
        { x: 6, y: 42, w: 26, h: 22, label: "Kitchen", area: 12 },
        { x: 32, y: 42, w: 18, h: 22, label: "Wash", area: 5 },
        { x: 50, y: 6, w: 44, h: 28, label: "Bedroom", area: 17 },
        { x: 50, y: 34, w: 44, h: 20, label: "Bedroom", area: 14 },
        { x: 50, y: 54, w: 44, h: 10, label: "Bath", area: 8 },
      ] },
      { caption: "Terrace", rooms: [
        { x: 10, y: 10, w: 80, h: 44, label: "Corner terrace", area: 10, out: true },
      ] },
    ],
  },
  {
    id: "Y-P7", code: "021", name: "Komitas Parkside 7", place: "Yerevan", kind: "Apartment",
    typology: "Duplex", block: "B1", floor: "6 floor", bedrooms: 3, area: 112, terrace: 14,
    completion: "1Q 2028", level: "Floor 6", status: "available",
    note: "Park windows in every bedroom",
    levels: [
      { caption: "Upper level", rooms: [
        { x: 6, y: 6, w: 50, h: 36, label: "Living", area: 30 },
        { x: 6, y: 42, w: 30, h: 22, label: "Kitchen", area: 13 },
        { x: 36, y: 42, w: 20, h: 22, label: "Hall", area: 7 },
        { x: 56, y: 6, w: 38, h: 30, label: "Dining", area: 12 },
        { x: 56, y: 36, w: 38, h: 28, label: "Wash", area: 6 },
      ] },
      { caption: "Lower level", rooms: [
        { x: 6, y: 6, w: 42, h: 30, label: "Bedroom", area: 16 },
        { x: 6, y: 36, w: 42, h: 28, label: "Bedroom", area: 14 },
        { x: 48, y: 6, w: 46, h: 32, label: "Bedroom", area: 14 },
        { x: 48, y: 38, w: 46, h: 26, label: "Bath", area: 6 },
      ] },
    ],
  },
  {
    id: "Y-A9", code: "022", name: "Orran Penthouse A9", place: "Yerevan", kind: "Apartment",
    typology: "Penthouse", block: "A1", floor: "9 floor", bedrooms: 3, area: 138, terrace: 34,
    completion: "1Q 2028", level: "Floor 9", status: "available",
    note: "Wrapped terrace · Ararat side",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 52, h: 38, label: "Living", area: 38 },
        { x: 6, y: 44, w: 30, h: 20, label: "Kitchen", area: 15 },
        { x: 36, y: 44, w: 22, h: 20, label: "Hall", area: 8 },
        { x: 58, y: 6, w: 36, h: 30, label: "Bedroom", area: 20 },
        { x: 58, y: 36, w: 36, h: 28, label: "Bath", area: 9 },
      ] },
      { caption: "Terrace level", rooms: [
        { x: 6, y: 6, w: 40, h: 28, label: "Bedroom", area: 26 },
        { x: 6, y: 34, w: 40, h: 30, label: "Bedroom", area: 22 },
        { x: 46, y: 6, w: 48, h: 58, label: "Roof terrace", area: 34, out: true },
      ] },
    ],
  },
  {
    id: "D-3", code: "031", name: "Pine Lane 3", place: "Dilijan", kind: "House",
    typology: "Garden level", block: "P1", floor: "0 floor", bedrooms: 2, area: 96, terrace: 26,
    completion: "3Q 2027", level: "Plot 4.0 a", status: "available",
    note: "First line of the forest",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 52, h: 36, label: "Living", area: 34 },
        { x: 6, y: 42, w: 30, h: 22, label: "Kitchen", area: 16 },
        { x: 36, y: 42, w: 22, h: 22, label: "Hall", area: 8 },
        { x: 58, y: 6, w: 36, h: 30, label: "Bedroom", area: 18 },
        { x: 58, y: 36, w: 36, h: 28, label: "Bedroom", area: 20 },
      ] },
      { caption: "Garden level", rooms: [
        { x: 6, y: 6, w: 34, h: 24, label: "Bath", area: 8 },
        { x: 6, y: 30, w: 34, h: 34, label: "Store", area: 6 },
        { x: 40, y: 6, w: 54, h: 58, label: "Garden", area: 26, out: true },
      ] },
    ],
  },
  {
    id: "D-5", code: "032", name: "Pine Lane 5", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P1", floor: "0 floor", bedrooms: 3, area: 128, terrace: 30,
    completion: "3Q 2027", level: "Plot 5.5 a", status: "reserved",
    note: "The quiet end of the lane",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 50, h: 34, label: "Living", area: 32 },
        { x: 6, y: 40, w: 28, h: 24, label: "Kitchen", area: 16 },
        { x: 34, y: 40, w: 22, h: 24, label: "Dining", area: 12 },
        { x: 56, y: 6, w: 38, h: 32, label: "Bedroom", area: 18 },
        { x: 56, y: 38, w: 38, h: 26, label: "Bath", area: 8 },
      ] },
      { caption: "Lower level", rooms: [
        { x: 6, y: 6, w: 40, h: 30, label: "Bedroom", area: 20 },
        { x: 6, y: 36, w: 40, h: 28, label: "Bedroom", area: 16 },
        { x: 46, y: 6, w: 26, h: 26, label: "Wash", area: 6 },
        { x: 46, y: 32, w: 26, h: 32, label: "Store", area: 0 },
        { x: 72, y: 6, w: 22, h: 58, label: "Garden", area: 30, out: true },
      ] },
    ],
  },
  {
    id: "D-HS", code: "033", name: "Half-Stone House", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P2", floor: "0 floor", bedrooms: 3, area: 142, terrace: 28,
    completion: "1Q 2028", level: "Plot 6.0 a", status: "available",
    note: "Tuff below, timber above",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 54, h: 36, label: "Living", area: 40 },
        { x: 6, y: 42, w: 32, h: 22, label: "Kitchen", area: 18 },
        { x: 38, y: 42, w: 22, h: 22, label: "Hall", area: 9 },
        { x: 60, y: 6, w: 34, h: 32, label: "Study", area: 12 },
        { x: 60, y: 38, w: 34, h: 26, label: "Wash", area: 6 },
      ] },
      { caption: "Lower level", rooms: [
        { x: 6, y: 6, w: 42, h: 30, label: "Bedroom", area: 22 },
        { x: 6, y: 36, w: 42, h: 28, label: "Bedroom", area: 18 },
        { x: 48, y: 6, w: 24, h: 32, label: "Bedroom", area: 17 },
        { x: 48, y: 38, w: 24, h: 26, label: "Bath", area: 0 },
        { x: 72, y: 6, w: 22, h: 58, label: "Garden", area: 28, out: true },
      ] },
    ],
  },
  {
    id: "D-FG1", code: "034", name: "Forest Gate 1", place: "Dilijan", kind: "House",
    typology: "Duplex", block: "P2", floor: "0 floor", bedrooms: 4, area: 168, terrace: 36,
    completion: "2Q 2028", level: "Plot 7.5 a", status: "available",
    note: "Gate on the lane, treeline at the back",
    levels: [
      { caption: "Upper level", rooms: [
        { x: 6, y: 6, w: 52, h: 38, label: "Living", area: 44 },
        { x: 6, y: 44, w: 30, h: 20, label: "Kitchen", area: 20 },
        { x: 36, y: 44, w: 22, h: 20, label: "Dining", area: 16 },
        { x: 58, y: 6, w: 36, h: 32, label: "Bedroom", area: 20 },
        { x: 58, y: 38, w: 36, h: 26, label: "Bath", area: 8 },
      ] },
      { caption: "Lower level", rooms: [
        { x: 6, y: 6, w: 38, h: 30, label: "Bedroom", area: 22 },
        { x: 6, y: 36, w: 38, h: 28, label: "Bedroom", area: 18 },
        { x: 44, y: 6, w: 28, h: 30, label: "Bedroom", area: 14 },
        { x: 44, y: 36, w: 28, h: 28, label: "Wash", area: 6 },
        { x: 72, y: 6, w: 22, h: 58, label: "Garden", area: 36, out: true },
      ] },
    ],
  },
  {
    id: "S-T2", code: "041", name: "Shore Terrace 2", place: "Sevan", kind: "Lake house",
    typology: "Garden level", block: "S1", floor: "0 floor", bedrooms: 2, area: 88, terrace: 22,
    completion: "3Q 2027", level: "Plot 3.5 a", status: "available",
    note: "Set back from the shore road",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 50, h: 36, label: "Living", area: 32 },
        { x: 6, y: 42, w: 28, h: 22, label: "Kitchen", area: 14 },
        { x: 34, y: 42, w: 22, h: 22, label: "Hall", area: 7 },
        { x: 56, y: 6, w: 38, h: 30, label: "Bedroom", area: 18 },
        { x: 56, y: 36, w: 38, h: 28, label: "Bedroom", area: 17 },
      ] },
      { caption: "Terrace", rooms: [
        { x: 6, y: 6, w: 30, h: 26, label: "Bath", area: 0 },
        { x: 6, y: 32, w: 30, h: 32, label: "Store", area: 0 },
        { x: 36, y: 6, w: 58, h: 58, label: "Lake terrace", area: 22, out: true },
      ] },
    ],
  },
  {
    id: "S-T4", code: "042", name: "Shore Terrace 4", place: "Sevan", kind: "Lake house",
    typology: "Duplex", block: "S1", floor: "0 floor", bedrooms: 3, area: 121, terrace: 24,
    completion: "4Q 2027", level: "Plot 4.2 a", status: "reserved",
    note: "Every main room turned to the water",
    levels: [
      { caption: "Upper level", rooms: [
        { x: 6, y: 6, w: 52, h: 34, label: "Living", area: 34 },
        { x: 6, y: 40, w: 30, h: 24, label: "Kitchen", area: 16 },
        { x: 36, y: 40, w: 22, h: 24, label: "Dining", area: 12 },
        { x: 58, y: 6, w: 36, h: 30, label: "Bedroom", area: 18 },
        { x: 58, y: 36, w: 36, h: 28, label: "Wash", area: 5 },
      ] },
      { caption: "Lower level", rooms: [
        { x: 6, y: 6, w: 40, h: 30, label: "Bedroom", area: 20 },
        { x: 6, y: 36, w: 40, h: 28, label: "Bedroom", area: 16 },
        { x: 46, y: 6, w: 26, h: 58, label: "Bath", area: 0 },
        { x: 72, y: 6, w: 22, h: 58, label: "Lake terrace", area: 24, out: true },
      ] },
    ],
  },
  {
    id: "S-L1", code: "043", name: "Lighthouse Row 1", place: "Sevan", kind: "Lake house",
    typology: "Garden + lower level", block: "S2", floor: "0 floor", bedrooms: 3, area: 134, terrace: 31,
    completion: "2Q 2028", level: "Plot 5.0 a", status: "available",
    note: "The last house before the point",
    levels: [
      { caption: "Main level", rooms: [
        { x: 6, y: 6, w: 54, h: 36, label: "Living", area: 38 },
        { x: 6, y: 42, w: 30, h: 22, label: "Kitchen", area: 17 },
        { x: 36, y: 42, w: 24, h: 22, label: "Hall", area: 9 },
        { x: 60, y: 6, w: 34, h: 32, label: "Bedroom", area: 20 },
        { x: 60, y: 38, w: 34, h: 26, label: "Bath", area: 6 },
      ] },
      { caption: "Lower level", rooms: [
        { x: 6, y: 6, w: 40, h: 32, label: "Bedroom", area: 24 },
        { x: 6, y: 38, w: 40, h: 26, label: "Bedroom", area: 20 },
        { x: 46, y: 6, w: 26, h: 58, label: "Store", area: 0 },
        { x: 72, y: 6, w: 22, h: 58, label: "Shore garden", area: 31, out: true },
      ] },
    ],
  },
];

export const homesPage = {
  kicker: "(Available now)",
  title: "HOMES",
  sub: "Twelve homes across three places — apartments in Yerevan, houses in Dilijan, lake houses at Sevan. Tsaghkadzor joins for the winter season.",
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
  legend: "Plans are indicative and drawn to the room schedule — areas are measured to the inside face of the wall.",
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
  empty: "Nothing matches that mix — loosen a filter, or call us: the list moves weekly.",
  ask: "Ask about",
  statusLabel: { available: "Available", reserved: "Reserved" },
  // the sticky side panel
  panel: { title: ["SELECT", "A HOME"], call: "Book a call", contact: "Contact" },
  completionLabel: "Completion",
  terraceLabel: "Terrace",
  // /homes/[id]
  detail: {
    back: "All homes",
    plansLabel: "The plans",
    specLabel: "The schedule",
    galleryLabel: "The finish",
    nearbyLabel: "Other homes here",
    callLabel: "Ask about this home",
    callCopy: "Fifteen minutes on the phone settles whether this one fits how you actually live — and what else is coming to the list.",
    spec: {
      code: "Reference",
      typology: "Typology",
      place: "Place",
      block: "Block",
      floor: "Level",
      bedrooms: "Bedrooms",
      area: "Interior area",
      terrace: "Terrace",
      completion: "Completion",
      status: "Status",
    },
  },
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
