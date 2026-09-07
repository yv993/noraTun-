import type { Listing } from "./content";
import { applyOverlay } from "./overlay";

// Orran A9's own photography — the only home with its own set so far;
// every other address falls back to its place's gallery.
import phA9Stair from "@/assets/photos/orran-a9-stair.jpg";
import phA9Kitchen from "@/assets/photos/orran-a9-kitchen.jpg";
import phA9Hall from "@/assets/photos/orran-a9-hall.jpg";
import phHsKitchen from "@/assets/photos/half-stone-kitchen.jpg";
import phHsBedroom from "@/assets/photos/half-stone-bedroom.jpg";
import phHsBath from "@/assets/photos/half-stone-bath.jpg";
import phC12Kitchen from "@/assets/photos/saryan-c12-kitchen.jpg";
import phC12Bedroom from "@/assets/photos/saryan-c12-bedroom.jpg";
import phC12Bath from "@/assets/photos/saryan-c12-bath.jpg";
import phP7Kitchen from "@/assets/photos/komitas-p7-kitchen.jpg";
import phP7Landing from "@/assets/photos/komitas-p7-landing.jpg";
import phP7Bath from "@/assets/photos/komitas-p7-bath.jpg";
import phT2Kitchen from "@/assets/photos/shore-t2-kitchen.jpg";
import phT2Bedroom from "@/assets/photos/shore-t2-bedroom.jpg";
import phT2Bath from "@/assets/photos/shore-t2-bathroom.jpg";
import phP3Kitchen from "@/assets/photos/pine-3-kitchen.jpg";
import phP3Bedroom from "@/assets/photos/pine-3-bedroom.jpg";
import phP3Bath from "@/assets/photos/pine-3-bathroom.jpg";
import phA4Bedroom from "@/assets/photos/orran-a4-bedroom.jpg";
import phA4Bath from "@/assets/photos/orran-a4-bath.jpg";
import phPl7Living from "@/assets/photos/pine-7-living.jpg";
import phPl7Kitchen from "@/assets/photos/pine-7-kitchen.jpg";
import phB2Kitchen from "@/assets/photos/orran-b2-kitchen.jpg";
import phB2Bedroom from "@/assets/photos/orran-b2-bedroom.jpg";
import phB2Bath from "@/assets/photos/orran-b2-bath.jpg";

// ============================================================================
// THE SEVENTEEN HOMES — one per study sheet.
//
// The client's seventeen plan sheets (assets/plans/src, cut to the drawings
// by scripts/plans.mjs) are the catalogue. Every fact on a card is READ OFF
// ITS SHEET, and nothing is estimated:
//   · bedrooms — the rooms drawn with a bed on the living floors
//   · area     — the sum of the interior rooms the sheet numbers, on the
//                living floors; garages, decks, terraces and patios are not
//                counted. Where the sheet numbers too few of its principal
//                rooms (living room or a bedroom left unnumbered), or a
//                printed figure is not credible for the room it sits in, the
//                total is null and the card shows the bedrooms alone.
//   · terrace  — the outdoor m² the sheet prints, if any
// The sheets carry a few generated labels that are not words; those never
// reach this file. Alt text names the rooms as they are actually drawn.
//
// Ids from the first catalogue are kept where a sheet matches the home's
// bedroom count, so those addresses stay live; the rest are new.
// ============================================================================

import v01g from "@/assets/plans/v01-ground.webp";
import v01l from "@/assets/plans/v01-lower.webp";
import v02g from "@/assets/plans/v02-ground.webp";
import v02l from "@/assets/plans/v02-lower.webp";
import v03g from "@/assets/plans/v03-ground.webp";
import v03l from "@/assets/plans/v03-lower.webp";
import v04g from "@/assets/plans/v04-ground.webp";
import v04l from "@/assets/plans/v04-lower.webp";
import v05g from "@/assets/plans/v05-ground.webp";
import v05l from "@/assets/plans/v05-lower.webp";
import v06g from "@/assets/plans/v06-ground.webp";
import v06l from "@/assets/plans/v06-lower.webp";
import v07g from "@/assets/plans/v07-ground.webp";
import v07l from "@/assets/plans/v07-lower.webp";
import v08g from "@/assets/plans/v08-ground.webp";
import v08l from "@/assets/plans/v08-lower.webp";
import v09g from "@/assets/plans/v09-ground.webp";
import v09l from "@/assets/plans/v09-lower.webp";
import v10g from "@/assets/plans/v10-ground.webp";
import v10l from "@/assets/plans/v10-lower.webp";
import v11g from "@/assets/plans/v11-ground.webp";
import v11l from "@/assets/plans/v11-lower.webp";
import v12g from "@/assets/plans/v12-ground.webp";
import v12l from "@/assets/plans/v12-lower.webp";
import v13g from "@/assets/plans/v13-ground.webp";
import v13l from "@/assets/plans/v13-lower.webp";
import v14g from "@/assets/plans/v14-ground.webp";
import v14l from "@/assets/plans/v14-lower.webp";
import v14x from "@/assets/plans/v14-extra.webp";
import v15g from "@/assets/plans/v15-ground.webp";
import v15l from "@/assets/plans/v15-lower.webp";
import v16g from "@/assets/plans/v16-ground.webp";
import v16l from "@/assets/plans/v16-lower.webp";
import v17g from "@/assets/plans/v17-ground.webp";
import v17l from "@/assets/plans/v17-lower.webp";

// The facts each sheet gives, level by level (above), and what it DRAWS
// (below). Nothing here is inferred from a photograph or a brochure — every
// item names something the drawing puts on the page.
const base: Omit<Listing, "sheet" | "parking" | "description" | "benefits">[] =
  [
    {
      // sheet v01 · "variation 17": 12 + 10 + 11 + 16 + 16 + 6 + 18 + 6 + 4 + 1.5 + 2 = 102.5
      id: "Y-A9",
      code: "001",
      name: "Orran A9",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "A1",
      floor: "0 floor",
      bedrooms: 3,
      area: 103,
      terrace: 0,
      completion: "2Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "Wrapped decks · Ararat side",
      gallery: [
        {
          src: phA9Stair,
          alt: "An open-tread walnut stair behind a glass balustrade, a glazed light well set into the floor beside it, and the master bedroom beyond with a slatted timber headboard",
        },
        {
          src: phA9Kitchen,
          alt: "A pale oak kitchen run under open shelves, the dining table beside a sliding door standing open to a gravel courtyard",
        },
        {
          src: phA9Hall,
          alt: "A hallway in oak and terrazzo, a bedroom door open to one side and the stair at its far end",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v01g,
          alt: "Ground floor plan: kitchen area, living and dining area, a second living area, two bedrooms, master bedroom with its bathroom and walk-in closet, laundry and pantry, powder room, utility closet, two front decks and a gravel path.",
        },
        {
          caption: "Basement",
          img: v01l,
          alt: "Basement plan: two-car garage with an EV charging point, large storage and workshop room, mechanical room, cold cellar, mud room and laundry, toilet.",
        },
      ],
    },
    {
      // sheet v15 · "design 3, three-story": 28 + 12 + 15 + 70 + 6 + 5 + 5 = 141; terrace 185 + porch 15
      id: "D-HS",
      code: "002",
      name: "Half-Stone House",
      place: "Dilijan",
      kind: "House",
      typology: "Garden + lower level",
      block: "P1",
      floor: "0 floor",
      bedrooms: 3,
      area: 141,
      terrace: 200,
      completion: "4Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "Tuff below, timber above",
      gallery: [
        {
          src: phHsKitchen,
          alt: "A walnut and olive-green kitchen with a veined marble island, a window seat under the far window and the garden beyond",
        },
        {
          src: phHsBedroom,
          alt: "A bedroom under exposed timber trusses, a planted green wall behind the bed, a glazed floor panel over the stair and the garden terrace open along one side",
        },
        {
          src: phHsBath,
          alt: "A bathroom tiled floor to ceiling in sea-green, with a round backlit mirror, a wall-hung basin and patterned cement floor tiles",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v15g,
          alt: "Ground floor plan: master suite with its bathroom, shared family bathroom, second bedroom, living, dining and kitchen area with an island, foyer, master bedroom, bathroom, porch and a wide terrace.",
        },
        {
          caption: "Basement",
          img: v15l,
          alt: "Basement plan: parking for four cars, laundry and utility room, pantry and dry storage, two technical and maintenance rooms.",
        },
      ],
    },
    {
      // sheet v16 · "design 2": 11 + 11 + 3.5 + 3.5 + 22 + 8.68 + 6.62 + 4.8 = 71.1; terraza 175 + porche 13
      id: "S-T2",
      code: "003",
      name: "Shore Terrace 2",
      place: "Sevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "S1",
      floor: "0 floor",
      bedrooms: 2,
      area: 71,
      terrace: 188,
      completion: "2Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "Set back from the shore road",
      gallery: [
        {
          src: phT2Kitchen,
          alt: "A white kitchen with a walnut-ended island and an integrated hob, open shelves and two ovens along the run, a walnut dining table beside doors to the garden, and the stair beyond",
        },
        {
          src: phT2Bedroom,
          alt: "A concrete bedroom with a fluted timber headboard, a corner window onto a pine and the mountains past it, and a corridor of built-in wardrobes running alongside; the architect's own dimension notes are marked on the view",
        },
        {
          src: phT2Bath,
          alt: "A concrete bathroom open to a planted courtyard through full-height glass, with a walk-in shower behind a glass screen, a stone trough basin under a lit mirror, and a wall-hung WC",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v16g,
          alt: "Ground floor plan: two bedrooms with closets, bathroom with tub, hall, living-kitchen with an island, laundry, a small toilet, porch and a large terrace.",
        },
        {
          caption: "Basement",
          img: v16l,
          alt: "Basement plan: a bedroom, a sala, three parking areas, two laundries.",
        },
      ],
    },
    {
      // sheet v02 · "variation 15": 11 + 11 + 11 + 11 + 3.3 + 1.3 + 1.5 = 50.1 (kitchen and study unnumbered)
      id: "Y-P7",
      code: "004",
      name: "Komitas Parkside 7",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "B1",
      floor: "0 floor",
      bedrooms: 3,
      area: 50,
      terrace: 0,
      completion: "1Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "Park windows in every bedroom",
      gallery: [
        {
          src: phP7Kitchen,
          alt: "A white and oak kitchen open to an eight-seat dining table, the sliding wall folded back to a timber terrace with potted figs and agaves, and the stair rail at the room's far edge",
        },
        {
          src: phP7Landing,
          alt: "A landing in polished concrete glazed on two sides, opening to a timber balcony planted with a fig and agaves, the bathroom standing open through the doorway beside it",
        },
        {
          src: phP7Bath,
          alt: "A concrete bathroom with two round stone basins on an oak vanity, a wall-hung WC and a walk-in shower behind bronzed glass, the stair passing the open door",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v02g,
          alt: "Ground floor plan: master bedroom, two further bedrooms, bathroom, central courtyard, living and dining area, kitchen area, study and pantry, laundry, consolidated storage, a bathroom by the stairs, entrance from the wood decking beside a gravel path.",
        },
        {
          caption: "Basement",
          img: v02l,
          alt: "Basement plan: home gym and parking with an EV charging point, two utility rooms, general storage, two laundry rooms, toilet.",
        },
      ],
    },
    {
      // sheet v03 · "prototype 15, cantilevered modules": bedrooms 24 + 16 + 17, but the ground floor is unnumbered — no total
      id: "D-5",
      code: "005",
      name: "Pine Lane 5",
      place: "Dilijan",
      kind: "House",
      typology: "Duplex",
      block: "P1",
      floor: "0 floor",
      bedrooms: 3,
      area: null,
      terrace: 32,
      completion: "4Q 2027",
      level: "Ground + upper floor",
      status: "reserved",
      note: "The quiet end of the lane · the bedrooms cantilever over the garden",
      // no gallery: the three renders that were here were Pine Lane 3's,
      // installed twice under two names. One house wearing another's rooms
      // is worse than no rooms; this one waits for its own.
      levels: [
        {
          caption: "Ground floor",
          img: v03g,
          alt: "Ground floor plan: kitchen and dining area with an island, central living, foyer and exterior foyer, powder room, patio garden, two-vehicle garage, technical room, storage, pantry, laundry, bicycle parking and the service modules.",
        },
        {
          caption: "Second floor",
          img: v03l,
          alt: "Second floor plan: master bedroom suite with walk-in closet and bathroom, linen closet, bedroom 2, shared bathroom, bedroom 3 with a study nook, and a cantilevered balcony along the front.",
        },
      ],
    },
    {
      // sheet v05 · "variation 12": 11 + 1.5 + 1.5 + 11 + 3.3 + 3.3 + 11 + 1.5 + 1.5 = 45.6
      id: "Y-B2",
      code: "006",
      name: "Orran B2",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "A1",
      floor: "0 floor",
      bedrooms: 2,
      area: 46,
      terrace: 0,
      completion: "2Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "Saryan district · courtyard side",
      gallery: [
        {
          src: phB2Kitchen,
          alt: "A galley kitchen along one white wall — handleless cabinets under a walnut shelf, a sink beneath the run and a dark stone island with a gas hob and four stools; a dining table by the sliding doors to a planted deck, and an open timber stair at the far end",
        },
        {
          src: phB2Bedroom,
          alt: "A bedroom on a raised timber platform, one wall in fine oak battens lit from the coving, and a corner of sliding glass onto a deck of potted olives and agaves behind a slatted timber screen",
        },
        {
          src: phB2Bath,
          alt: "A bathroom in warm limestone — an ochre stone vanity on a fretwork oak cabinet under a lit mirror, a tall window onto the hills, and a bath against a wall of blue and red patterned tile",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v05g,
          alt: "Ground floor plan: two bedrooms each with its own bathroom, kitchen and living area, utility and pantry, two laundries, powder room, a further bathroom, gravel court and wood decking.",
        },
        {
          caption: "Basement",
          img: v05l,
          alt: "Basement plan: parking for three cars with an EV charging point, bathroom, laundry, two storage rooms, pantry, storage and utility room.",
        },
      ],
    },
    {
      // sheet v13 · "variation 4": two bedrooms drawn without figures, living 28.5 — no total
      id: "D-3",
      code: "007",
      name: "Pine Lane 3",
      place: "Dilijan",
      kind: "House",
      typology: "Garden + lower level",
      block: "P1",
      floor: "0 floor",
      bedrooms: 2,
      area: null,
      terrace: 0,
      completion: "4Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "First line of the forest",
      gallery: [
        {
          src: phP3Kitchen,
          alt: "A kitchen under a concrete ceiling seen from the stair — an L-shaped run beneath a long window, an island with an induction hob and four stools, sliding doors to a timber deck with potted trees, and the dining and living rooms beyond",
        },
        {
          src: phP3Bedroom,
          alt: "A bedroom in pale plaster with a fluted timber headboard, a wall of built-in wardrobes down one side, and a sliding glass wall onto a timber deck planted with agaves and herbs",
        },
        {
          src: phP3Bath,
          alt: "A bathroom in grey stone and timber-look tile, with a wall-hung WC, a vanity under a lit mirror, and a walk-in shower with a built-in bench behind a glass screen",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v13g,
          alt: "Ground floor plan: two bedrooms, bathroom with tub, living room with an island kitchen, a small toilet, pool and deck along the side.",
        },
        {
          caption: "Basement",
          img: v13l,
          alt: "Basement plan: decked terrace, storage rooms, bathroom, stairs.",
        },
      ],
    },
    {
      // sheet v17 · "design 1, the efficiency study" (left column): 13.27 + 13.29 + 38.66 + 6.22 + 2.28 + 4.28 + 4.25 + 5.7 = 87.95; terrace 39.1
      id: "S-E1",
      code: "008",
      name: "Eco House 1",
      place: "Sevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "S2",
      floor: "0 floor",
      bedrooms: 2,
      area: 88,
      terrace: 39,
      completion: "2Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "The efficiency study · sheet one of twelve",
      levels: [
        {
          caption: "Ground floor",
          img: v17g,
          alt: "Ground floor plan: two bedrooms, bathroom, hall, living room with dining, kitchen, utility room, toilet, porch and terrace.",
        },
        {
          caption: "Basement",
          img: v17l,
          alt: "Basement plan: patio, sala, a second sala, bathroom, storage, laundry, stairs.",
        },
      ],
    },
    {
      // sheet v07 · "variation 10": dining room and the second bedroom unnumbered — no total
      id: "Y-C12",
      code: "009",
      name: "Saryan Court 12",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "A2",
      floor: "0 floor",
      bedrooms: 2,
      area: null,
      terrace: 0,
      completion: "1Q 2028",
      level: "Ground + basement",
      status: "reserved",
      note: "Corner rooms · evening sun · pool",
      gallery: [
        {
          src: phC12Kitchen,
          alt: "An olive-green kitchen with a concrete-topped island and stools, tall timber units housing the ovens, and the stair dropping to the living room beyond",
        },
        {
          src: phC12Bedroom,
          alt: "A bedroom with a linen headboard between two lamps, a picture shelf above it, a fiddle-leaf fig by the window and mirrored oak wardrobes along the far wall",
        },
        {
          src: phC12Bath,
          alt: "A bathroom with a walk-in shower behind glass against fluted timber tiles, a round backlit mirror on a concrete wall, copper pendants and a timber vanity with folded towels",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v07g,
          alt: "Ground floor plan: two bedrooms, bathroom, dining room and living area, laundry with an EV charging point, pool and wood deck.",
        },
        {
          caption: "Basement",
          img: v07l,
          alt: "Basement plan: sala, toilet, laundry, reading nook, two parking areas, storage.",
        },
      ],
    },
    {
      // sheet v04 · "prototype 13, split-level": bedroom suite 18, bathroom 11 — the living floor unnumbered, no total
      id: "D-SL1",
      code: "010",
      name: "Slope House 1",
      place: "Dilijan",
      kind: "House",
      typology: "Garden + lower level",
      block: "P2",
      floor: "0 floor",
      bedrooms: 1,
      area: null,
      terrace: 0,
      completion: "2Q 2028",
      level: "Split level",
      status: "available",
      note: "Split across the slope · the bedroom a level down",
      levels: [
        {
          caption: "Upper ground",
          img: v04g,
          alt: "Upper ground plan: kitchen, dining and living areas stepped across a split level, porch and foyer, exterior terrace, two wood-decked areas, outdoor kitchen and grill, gravel court.",
        },
        {
          caption: "Lower ground",
          img: v04l,
          alt: "Lower ground plan: bedroom suite with bathroom and closet, second bathroom, powder room, service hub, technical room, garage storage and pantry shelving, garage for two cars, laundry, mechanical module, light well garden.",
        },
      ],
    },
    {
      // sheet v09 · "eighth variation": no bed drawn; 54 + 12.33 + 17.38 + 10.3 = 94.01 across the numbered rooms; terrace 11 + patio 11
      id: "S-T1",
      code: "011",
      name: "Shore Terrace 1",
      place: "Sevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "S1",
      floor: "0 floor",
      bedrooms: null,
      area: 94,
      terrace: 22,
      completion: "2Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "One open level · rooms below",
      levels: [
        {
          caption: "Ground floor",
          img: v09g,
          alt: "Ground floor plan: one open dining and living area with the kitchen along the wall, bathroom, two further rooms, patio and terrace.",
        },
        {
          caption: "Basement",
          img: v09l,
          alt: "Basement plan: parking area for two cars, decked area, storage rooms, bathroom, stairs.",
        },
      ],
    },
    {
      // sheet v06 · "eleventh variation": bedroom 11, laundries 3.3 + 3.3, toilets 1.5 + 1.5 — the living-kitchen unnumbered, no total
      id: "Y-A4",
      code: "012",
      name: "Orran A4",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "A1",
      floor: "0 floor",
      bedrooms: 1,
      area: null,
      terrace: 0,
      completion: "2Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "Saryan district · five minutes to the park",
      gallery: [
        {
          src: phA4Bedroom,
          alt: "A bedroom under a concrete soffit — a walnut headboard against a full-height window onto a planted light well, fitted wardrobes down one wall, an open ensuite with a glazed shower beyond them, and the garage through the door on the right",
        },
        {
          src: phA4Bath,
          alt: "A bathroom in pale stone and oak — a vessel basin on a floating oak vanity under a black-framed mirror, a wall-hung WC, and a walk-in shower lit by a high window at the end",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v06g,
          alt: "Ground floor plan: living-kitchen with an island and a long table, one bedroom with wardrobe, laundry and utility room, two toilets, porch and terrace.",
        },
        {
          caption: "Basement",
          img: v06l,
          alt: "Basement plan: sala, storage, utility unit with a charging point, three parking bays, laundry, powder room, service modules.",
        },
      ],
    },
    {
      // sheet v10 · "seventh variation": 11 + 28.5 + 3.5 + 11 + 11 + 3.5 = 68.5; terrace 11
      id: "D-PL7",
      code: "013",
      name: "Pine Lane 7",
      place: "Dilijan",
      kind: "House",
      typology: "Garden + lower level",
      block: "P1",
      floor: "0 floor",
      bedrooms: 1,
      area: 69,
      terrace: 11,
      completion: "4Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "A workshop under the house",
      gallery: [
        {
          src: phPl7Living,
          alt: "An open kitchen, dining and living room — oak and white cabinetry across the back wall with a built-in oven, a concrete-look island with three stools, a long oak table with six wishbone chairs, and a sliding wall opened onto a deck with armchairs; a bedroom through the door at the far right",
        },
        {
          src: phPl7Kitchen,
          alt: "The same rooms from the kitchen end — a double sink and a hob set into the long concrete island with three stools along it, the dining table and two grey sofas beyond, and a sliding wall onto a timber deck and gravel garden with two loungers",
        },
        {
          // the same render Komitas Parkside 7 shows — the client sent it for
          // both homes, so it is imported once rather than copied twice
          src: phP7Bath,
          alt: "A bathroom under the stair in board-marked concrete — twin round basins on an oak vanity beneath a long mirror, and a walk-in shower behind bronze glass",
        },
      ],
      levels: [
        {
          caption: "Ground floor",
          img: v10g,
          alt: "Ground floor plan: kitchen area with an island, open-plan living, dining and living areas, bedroom, bathroom, laundry and service room, powder room, terrace.",
        },
        {
          caption: "Basement",
          img: v10l,
          alt: "Basement plan: two-car garage, two technical rooms, two storage rooms, pantry, laundry, two toilets, workshop.",
        },
      ],
    },
    {
      // sheet v11 · "variation 6": living-kitchen 24.5, entry 3.57, bathroom 3.27 — the bedroom unnumbered, no total; porch 11
      id: "S-T3",
      code: "014",
      name: "Shore Terrace 3",
      place: "Sevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "S1",
      floor: "0 floor",
      bedrooms: 1,
      area: null,
      terrace: 11,
      completion: "1Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "A family room below the porch",
      levels: [
        {
          caption: "Ground floor",
          img: v11g,
          alt: "Ground floor plan: living-kitchen with an island and dining table, one bedroom with closet, entry, bathroom with tub, porch.",
        },
        {
          caption: "Basement",
          img: v11l,
          alt: "Basement plan: family room, two closets, laundry and utility, two parking spaces, exterior patio.",
        },
      ],
    },
    {
      // sheet v08 · "variation 9": 11.38 + 4.01 + 4.39 + 32.6 + 4.39 = 56.77; porch 5.09 + patio 11
      id: "Y-K9",
      code: "015",
      name: "Komitas 9",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "B1",
      floor: "0 floor",
      bedrooms: 1,
      area: 57,
      terrace: 16,
      completion: "1Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "One bedroom up, two salas below",
      levels: [
        {
          caption: "Ground floor",
          img: v08g,
          alt: "Ground floor plan: bedroom with wardrobe, bathroom, entrance hall, living-kitchen with an island, two closets, a second entrance, porch and patio.",
        },
        {
          caption: "Basement",
          img: v08l,
          alt: "Basement plan: two salas, laundry, storage, hallway, bathroom, two toilets, an interior patio with a car, porch and patio.",
        },
      ],
    },
    {
      // sheet v14 · "variation 14, floor and structural plans": living-dining 28.5, bedroom 12, bathroom 4.01 — the kitchen's printed figure is not credible, no total; terrace 7.3 + porch 4
      id: "D-FG2",
      code: "016",
      name: "Forest Gate 2",
      place: "Dilijan",
      kind: "House",
      typology: "Garden + lower level",
      block: "P2",
      floor: "0 floor",
      bedrooms: 1,
      area: null,
      terrace: 11,
      completion: "2Q 2028",
      level: "Ground + basement",
      status: "available",
      note: "Timber trusses over concrete · the section is on the sheet",
      levels: [
        {
          caption: "Ground floor",
          img: v14g,
          alt: "Ground floor plan: living-dining area with an island kitchen, bedroom, bathroom, porch and terrace, the stair to the basement.",
        },
        {
          caption: "Basement",
          img: v14l,
          alt: "Basement plan: parking for two cars, two storage rooms, mechanical room, utility room.",
        },
        {
          caption: "Structure",
          img: v14x,
          alt: "Structural cross-section: timber roof trusses over insulated roof panels, reinforced concrete load-bearing walls, steel columns and glulam beams on concrete foundation footings, three storeys cut open.",
        },
      ],
    },
    {
      // sheet v12 · "variation 5": living-kitchen 28.5 + bedroom 14.3 = 42.8; the bathroom's printed figure is not credible and is left out
      id: "Y-S5",
      code: "017",
      name: "Saryan Court 5",
      place: "Yerevan",
      kind: "House",
      typology: "Garden + lower level",
      block: "A2",
      floor: "0 floor",
      bedrooms: 1,
      area: 43,
      terrace: 0,
      completion: "2Q 2027",
      level: "Ground + basement",
      status: "available",
      note: "Patio to the west",
      levels: [
        {
          caption: "Ground floor",
          img: v12g,
          alt: "Ground floor plan: living-kitchen with an island and dining table, bedroom, bathroom with tub, patio and wood decking.",
        },
        {
          caption: "Basement",
          img: v12l,
          alt: "Basement plan: garage and storage area, patio, technical room, restroom, pantry and storage, stairs.",
        },
      ],
    },
  ];

// ============================================================================
// WHAT EACH SHEET DRAWS — the home page's description, its benefit list, the
// parking count and the sheet the panels were cut from.
//
// Every sentence and every item below is READ OFF THE DRAWING, the same way
// the areas above were: if the sheet does not draw it, it is not here. A
// parking count is null unless the sheet draws bays and makes the count
// legible — "parking with a charging point" gives no number, so it gets none.
// Nothing describes a finish, a view, a material or a service, because the
// sheets do not show those and nobody has photographed these houses.
// ============================================================================
type Detail = Pick<Listing, "sheet" | "parking" | "description" | "benefits">;

const DETAIL: Record<string, Detail> = {
  "Y-A9": {
    sheet: "v01",
    parking: 2,
    description:
      "Three bedrooms on one level — the master with its own bathroom and walk-in closet — a living and dining room, a second living area, and two front decks. Below, a two-car garage with an EV charging point, a workshop, a cold cellar and a mud room.",
    benefits: [
      "Two-car garage",
      "EV charging point",
      "Walk-in closet",
      "Cold cellar",
      "Storage and workshop",
      "Two front decks",
      "Mechanical room",
      "Mud room",
    ],
  },
  "D-HS": {
    sheet: "v15",
    parking: 4,
    description:
      "Three bedrooms, one of them a suite with its own bathroom, an island kitchen open to the living and dining room, and a wide terrace off the porch. Below, parking for four cars, a laundry and utility room, a pantry with dry storage and two technical rooms.",
    benefits: [
      "Parking for four cars",
      "Master suite",
      "Island kitchen",
      "Wide terrace",
      "Porch",
      "Pantry and dry storage",
      "Two technical rooms",
      "Laundry and utility room",
    ],
  },
  "S-T2": {
    sheet: "v16",
    parking: 3,
    description:
      "Two bedrooms with closets, a bathroom with a tub, and an island kitchen open to the living room, with a porch and a large terrace beyond. Below, a further room, a sala, three parking areas and two laundries.",
    benefits: [
      "Three parking areas",
      "Large terrace",
      "Island kitchen",
      "Porch",
      "Bath with tub",
      "Sala below",
      "Two laundries",
      "A closet to each bedroom",
    ],
  },
  "Y-P7": {
    sheet: "v02",
    parking: null,
    description:
      "Three bedrooms around a central courtyard, a living and dining room, a kitchen with a study and pantry beside it, and the entrance from the wood decking. Below, a home gym and parking with an EV charging point, two utility rooms and consolidated storage.",
    benefits: [
      "Central courtyard",
      "Home gym",
      "EV charging point",
      "Study",
      "Wood decking",
      "Two utility rooms",
      "Consolidated storage",
      "Two laundry rooms",
    ],
  },
  "D-5": {
    sheet: "v03",
    parking: 2,
    description:
      "An island kitchen and dining room, a central living room and a patio garden on the ground floor, with a two-vehicle garage and bicycle parking. Upstairs, a master suite with a walk-in closet, two further bedrooms — one with a study nook — and a balcony cantilevered along the front.",
    benefits: [
      "Two-vehicle garage",
      "Bicycle parking",
      "Patio garden",
      "Master suite",
      "Walk-in closet",
      "Study nook",
      "Cantilevered balcony",
      "Linen closet",
    ],
  },
  "Y-B2": {
    sheet: "v05",
    parking: 3,
    description:
      "Two bedrooms, each with its own bathroom, a kitchen and living area, and a gravel court with wood decking. Below, parking for three cars with an EV charging point, two storage rooms and a pantry.",
    benefits: [
      "Parking for three cars",
      "EV charging point",
      "A bathroom to each bedroom",
      "Gravel court",
      "Wood decking",
      "Two storage rooms",
      "Utility and pantry",
      "Powder room",
    ],
  },
  "D-3": {
    sheet: "v13",
    parking: null,
    description:
      "Two bedrooms, a bathroom with a tub, and a living room with an island kitchen, with a pool and a deck along the side of the house. Below, a decked terrace, storage rooms and a bathroom.",
    benefits: [
      "Pool",
      "Deck along the side",
      "Island kitchen",
      "Bath with tub",
      "Decked terrace below",
      "Storage rooms",
    ],
  },
  "S-E1": {
    sheet: "v17",
    parking: null,
    description:
      "Two bedrooms, a living room with dining, a separate kitchen and a utility room, with a porch and a terrace. Below, two salas, a patio, a bathroom, storage and a laundry.",
    benefits: [
      "Two salas below",
      "Patio",
      "Terrace",
      "Porch",
      "Separate kitchen",
      "Utility room",
      "Storage",
      "Laundry",
    ],
  },
  "Y-C12": {
    sheet: "v07",
    parking: 2,
    description:
      "Two bedrooms, a dining room and living area, and a pool with a wood deck. Below, a sala, a reading nook, two parking areas and storage.",
    benefits: [
      "Pool",
      "Wood deck",
      "EV charging point",
      "Two parking areas",
      "Reading nook",
      "Sala below",
      "Storage",
      "Laundry",
    ],
  },
  "D-SL1": {
    sheet: "v04",
    parking: 2,
    description:
      "Kitchen, dining and living rooms stepped across a split level, with an exterior terrace, two decked areas and an outdoor kitchen with a grill. A level down, the bedroom suite with its bathroom and closet, a garage for two cars and a light-well garden.",
    benefits: [
      "Garage for two cars",
      "Outdoor kitchen and grill",
      "Light-well garden",
      "Bedroom suite",
      "Two decked areas",
      "Exterior terrace",
      "Gravel court",
      "Pantry shelving",
    ],
  },
  "S-T1": {
    sheet: "v09",
    parking: 2,
    description:
      "One open dining and living room with the kitchen along its wall, two further rooms and a bathroom, opening to a patio and a terrace. Below, parking for two cars, a decked area, storage rooms and a bathroom.",
    benefits: [
      "Parking for two cars",
      "Patio",
      "Terrace",
      "Decked area below",
      "One open living level",
      "Storage rooms",
      "Two bathrooms",
    ],
  },
  "Y-A4": {
    sheet: "v06",
    parking: 3,
    description:
      "A living-kitchen with an island and a long table, one bedroom with a wardrobe, a laundry and utility room, a porch and a terrace. Below, a sala, three parking bays and a utility unit with a charging point.",
    benefits: [
      "Three parking bays",
      "Charging point",
      "Island kitchen",
      "Terrace",
      "Porch",
      "Sala below",
      "Wardrobe",
      "Storage",
    ],
  },
  "D-PL7": {
    sheet: "v10",
    parking: 2,
    description:
      "An island kitchen open to the living and dining areas, one bedroom and bathroom, a laundry and service room, and a terrace. Below, a two-car garage, a workshop, two storage rooms and a pantry.",
    benefits: [
      "Two-car garage",
      "Workshop",
      "Two storage rooms",
      "Pantry",
      "Island kitchen",
      "Terrace",
      "Two technical rooms",
      "Service room",
    ],
  },
  "S-T3": {
    sheet: "v11",
    parking: 2,
    description:
      "A living-kitchen with an island and a dining table, one bedroom with a closet, a bathroom with a tub, and a porch. Below, a family room, two parking spaces and an exterior patio.",
    benefits: [
      "Family room below",
      "Two parking spaces",
      "Exterior patio",
      "Porch",
      "Bath with tub",
      "Island kitchen",
      "Two closets",
      "Laundry and utility",
    ],
  },
  "Y-K9": {
    sheet: "v08",
    // the sheet draws a car in the interior patio but numbers no bay
    parking: null,
    description:
      "One bedroom with a wardrobe, a living-kitchen with an island, an entrance hall and a second entrance, with a porch and a patio. Below, two salas, an interior patio with room for a car, a bathroom and storage.",
    benefits: [
      "Two salas below",
      "Interior patio",
      "Room for a car",
      "Second entrance",
      "Porch",
      "Patio",
      "Two closets",
      "Storage",
    ],
  },
  "D-FG2": {
    sheet: "v14",
    parking: 2,
    description:
      "A living-dining room with an island kitchen, one bedroom and bathroom, a porch and a terrace. Below, parking for two cars, two storage rooms and a mechanical room. The sheet draws the structure as well: timber trusses over insulated roof panels, on concrete walls with steel columns and glulam beams.",
    benefits: [
      "Parking for two cars",
      "Timber roof trusses",
      "Insulated roof panels",
      "Reinforced concrete walls",
      "Glulam beams",
      "Two storage rooms",
      "Terrace",
      "Porch",
    ],
  },
  "Y-S5": {
    sheet: "v12",
    // "garage and storage area" — drawn, but with no bay count on it
    parking: null,
    description:
      "A living-kitchen with an island and a dining table, one bedroom, a bathroom with a tub, and a patio with wood decking. Below, a garage and storage area, a second patio, a technical room and a pantry.",
    benefits: [
      "Garage",
      "Two patios",
      "Wood decking",
      "Bath with tub",
      "Island kitchen",
      "Pantry and storage",
      "Technical room",
      "Restroom",
    ],
  },
};

// One home per sheet, and a missing DETAIL row is a build error rather than a
// page that quietly renders without its description.
const authored: Listing[] = base.map((l) => {
  const detail = DETAIL[l.id];
  if (!detail) throw new Error(`lib/listings.ts: no DETAIL row for ${l.id}`);
  return { ...l, ...detail };
});

// …then whatever /admin has changed on top. The overlay is a separate JSON
// file (data/homes.json) rather than edits to the rows above: the authored
// numbers keep the drawing they were read off sitting next to them, and an
// admin mistake is one file to revert. With an empty overlay this is exactly
// `authored`, which is the state the site ships in today.
export const listings: Listing[] = applyOverlay(authored);
