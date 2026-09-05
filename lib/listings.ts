import type { Listing } from "./content";

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

export const listings: Listing[] = [
  {
    // sheet v01 · "variation 17": 12 + 10 + 11 + 16 + 16 + 6 + 18 + 6 + 4 + 1.5 + 2 = 102.5
    id: "Y-A9", code: "001", name: "Orran A9", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "A1", floor: "0 floor", bedrooms: 3, area: 103, terrace: 0,
    completion: "2Q 2027", level: "Ground + basement", status: "available",
    note: "Wrapped decks · Ararat side",
    levels: [
      { caption: "Ground floor", img: v01g, alt: "Ground floor plan: kitchen area, living and dining area, a second living area, two bedrooms, master bedroom with its bathroom and walk-in closet, laundry and pantry, powder room, utility closet, two front decks and a gravel path." },
      { caption: "Basement", img: v01l, alt: "Basement plan: two-car garage with an EV charging point, large storage and workshop room, mechanical room, cold cellar, mud room and laundry, toilet." },
    ],
  },
  {
    // sheet v15 · "design 3, three-story": 28 + 12 + 15 + 70 + 6 + 5 + 5 = 141; terrace 185 + porch 15
    id: "D-HS", code: "002", name: "Half-Stone House", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P1", floor: "0 floor", bedrooms: 3, area: 141, terrace: 200,
    completion: "4Q 2027", level: "Ground + basement", status: "available",
    note: "Tuff below, timber above",
    levels: [
      { caption: "Ground floor", img: v15g, alt: "Ground floor plan: master suite with its bathroom, shared family bathroom, second bedroom, living, dining and kitchen area with an island, foyer, master bedroom, bathroom, porch and a wide terrace." },
      { caption: "Basement", img: v15l, alt: "Basement plan: parking for four cars, laundry and utility room, pantry and dry storage, two technical and maintenance rooms." },
    ],
  },
  {
    // sheet v16 · "design 2": 11 + 11 + 3.5 + 3.5 + 22 + 8.68 + 6.62 + 4.8 = 71.1; terraza 175 + porche 13
    id: "S-T2", code: "003", name: "Shore Terrace 2", place: "Sevan", kind: "House",
    typology: "Garden + lower level", block: "S1", floor: "0 floor", bedrooms: 2, area: 71, terrace: 188,
    completion: "2Q 2028", level: "Ground + basement", status: "available",
    note: "Set back from the shore road",
    levels: [
      { caption: "Ground floor", img: v16g, alt: "Ground floor plan: two bedrooms with closets, bathroom with tub, hall, living-kitchen with an island, laundry, a small toilet, porch and a large terrace." },
      { caption: "Basement", img: v16l, alt: "Basement plan: a bedroom, a sala, three parking areas, two laundries." },
    ],
  },
  {
    // sheet v02 · "variation 15": 11 + 11 + 11 + 11 + 3.3 + 1.3 + 1.5 = 50.1 (kitchen and study unnumbered)
    id: "Y-P7", code: "004", name: "Komitas Parkside 7", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "B1", floor: "0 floor", bedrooms: 3, area: 50, terrace: 0,
    completion: "1Q 2028", level: "Ground + basement", status: "available",
    note: "Park windows in every bedroom",
    levels: [
      { caption: "Ground floor", img: v02g, alt: "Ground floor plan: master bedroom, two further bedrooms, bathroom, central courtyard, living and dining area, kitchen area, study and pantry, laundry, consolidated storage, a bathroom by the stairs, entrance from the wood decking beside a gravel path." },
      { caption: "Basement", img: v02l, alt: "Basement plan: home gym and parking with an EV charging point, two utility rooms, general storage, two laundry rooms, toilet." },
    ],
  },
  {
    // sheet v03 · "prototype 15, cantilevered modules": bedrooms 24 + 16 + 17, but the ground floor is unnumbered — no total
    id: "D-5", code: "005", name: "Pine Lane 5", place: "Dilijan", kind: "House",
    typology: "Duplex", block: "P1", floor: "0 floor", bedrooms: 3, area: null, terrace: 32,
    completion: "4Q 2027", level: "Ground + upper floor", status: "reserved",
    note: "The quiet end of the lane · the bedrooms cantilever over the garden",
    levels: [
      { caption: "Ground floor", img: v03g, alt: "Ground floor plan: kitchen and dining area with an island, central living, foyer and exterior foyer, powder room, patio garden, two-vehicle garage, technical room, storage, pantry, laundry, bicycle parking and the service modules." },
      { caption: "Second floor", img: v03l, alt: "Second floor plan: master bedroom suite with walk-in closet and bathroom, linen closet, bedroom 2, shared bathroom, bedroom 3 with a study nook, and a cantilevered balcony along the front." },
    ],
  },
  {
    // sheet v05 · "variation 12": 11 + 1.5 + 1.5 + 11 + 3.3 + 3.3 + 11 + 1.5 + 1.5 = 45.6
    id: "Y-B2", code: "006", name: "Orran B2", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "A1", floor: "0 floor", bedrooms: 2, area: 46, terrace: 0,
    completion: "2Q 2027", level: "Ground + basement", status: "available",
    note: "Saryan district · courtyard side",
    levels: [
      { caption: "Ground floor", img: v05g, alt: "Ground floor plan: two bedrooms each with its own bathroom, kitchen and living area, utility and pantry, two laundries, powder room, a further bathroom, gravel court and wood decking." },
      { caption: "Basement", img: v05l, alt: "Basement plan: parking for three cars with an EV charging point, bathroom, laundry, two storage rooms, pantry, storage and utility room." },
    ],
  },
  {
    // sheet v13 · "variation 4": two bedrooms drawn without figures, living 28.5 — no total
    id: "D-3", code: "007", name: "Pine Lane 3", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P1", floor: "0 floor", bedrooms: 2, area: null, terrace: 0,
    completion: "4Q 2027", level: "Ground + basement", status: "available",
    note: "First line of the forest",
    levels: [
      { caption: "Ground floor", img: v13g, alt: "Ground floor plan: two bedrooms, bathroom with tub, living room with an island kitchen, a small toilet, pool and deck along the side." },
      { caption: "Basement", img: v13l, alt: "Basement plan: decked terrace, storage rooms, bathroom, stairs." },
    ],
  },
  {
    // sheet v17 · "design 1, the efficiency study" (left column): 13.27 + 13.29 + 38.66 + 6.22 + 2.28 + 4.28 + 4.25 + 5.7 = 87.95; terrace 39.1
    id: "S-E1", code: "008", name: "Eco House 1", place: "Sevan", kind: "House",
    typology: "Garden + lower level", block: "S2", floor: "0 floor", bedrooms: 2, area: 88, terrace: 39,
    completion: "2Q 2028", level: "Ground + basement", status: "available",
    note: "The efficiency study · sheet one of twelve",
    levels: [
      { caption: "Ground floor", img: v17g, alt: "Ground floor plan: two bedrooms, bathroom, hall, living room with dining, kitchen, utility room, toilet, porch and terrace." },
      { caption: "Basement", img: v17l, alt: "Basement plan: patio, sala, a second sala, bathroom, storage, laundry, stairs." },
    ],
  },
  {
    // sheet v07 · "variation 10": dining room and the second bedroom unnumbered — no total
    id: "Y-C12", code: "009", name: "Saryan Court 12", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "A2", floor: "0 floor", bedrooms: 2, area: null, terrace: 0,
    completion: "1Q 2028", level: "Ground + basement", status: "reserved",
    note: "Corner rooms · evening sun · pool",
    levels: [
      { caption: "Ground floor", img: v07g, alt: "Ground floor plan: two bedrooms, bathroom, dining room and living area, laundry with an EV charging point, pool and wood deck." },
      { caption: "Basement", img: v07l, alt: "Basement plan: sala, toilet, laundry, reading nook, two parking areas, storage." },
    ],
  },
  {
    // sheet v04 · "prototype 13, split-level": bedroom suite 18, bathroom 11 — the living floor unnumbered, no total
    id: "D-SL1", code: "010", name: "Slope House 1", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P2", floor: "0 floor", bedrooms: 1, area: null, terrace: 0,
    completion: "2Q 2028", level: "Split level", status: "available",
    note: "Split across the slope · the bedroom a level down",
    levels: [
      { caption: "Upper ground", img: v04g, alt: "Upper ground plan: kitchen, dining and living areas stepped across a split level, porch and foyer, exterior terrace, two wood-decked areas, outdoor kitchen and grill, gravel court." },
      { caption: "Lower ground", img: v04l, alt: "Lower ground plan: bedroom suite with bathroom and closet, second bathroom, powder room, service hub, technical room, garage storage and pantry shelving, garage for two cars, laundry, mechanical module, light well garden." },
    ],
  },
  {
    // sheet v09 · "eighth variation": no bed drawn; 54 + 12.33 + 17.38 + 10.3 = 94.01 across the numbered rooms; terrace 11 + patio 11
    id: "S-T1", code: "011", name: "Shore Terrace 1", place: "Sevan", kind: "House",
    typology: "Garden + lower level", block: "S1", floor: "0 floor", bedrooms: null, area: 94, terrace: 22,
    completion: "2Q 2028", level: "Ground + basement", status: "available",
    note: "One open level · rooms below",
    levels: [
      { caption: "Ground floor", img: v09g, alt: "Ground floor plan: one open dining and living area with the kitchen along the wall, bathroom, two further rooms, patio and terrace." },
      { caption: "Basement", img: v09l, alt: "Basement plan: parking area for two cars, decked area, storage rooms, bathroom, stairs." },
    ],
  },
  {
    // sheet v06 · "eleventh variation": bedroom 11, laundries 3.3 + 3.3, toilets 1.5 + 1.5 — the living-kitchen unnumbered, no total
    id: "Y-A4", code: "012", name: "Orran A4", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "A1", floor: "0 floor", bedrooms: 1, area: null, terrace: 0,
    completion: "2Q 2027", level: "Ground + basement", status: "available",
    note: "Saryan district · five minutes to the park",
    levels: [
      { caption: "Ground floor", img: v06g, alt: "Ground floor plan: living-kitchen with an island and a long table, one bedroom with wardrobe, laundry and utility room, two toilets, porch and terrace." },
      { caption: "Basement", img: v06l, alt: "Basement plan: sala, storage, utility unit with a charging point, three parking bays, laundry, powder room, service modules." },
    ],
  },
  {
    // sheet v10 · "seventh variation": 11 + 28.5 + 3.5 + 11 + 11 + 3.5 = 68.5; terrace 11
    id: "D-PL7", code: "013", name: "Pine Lane 7", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P1", floor: "0 floor", bedrooms: 1, area: 69, terrace: 11,
    completion: "4Q 2027", level: "Ground + basement", status: "available",
    note: "A workshop under the house",
    levels: [
      { caption: "Ground floor", img: v10g, alt: "Ground floor plan: kitchen area with an island, open-plan living, dining and living areas, bedroom, bathroom, laundry and service room, powder room, terrace." },
      { caption: "Basement", img: v10l, alt: "Basement plan: two-car garage, two technical rooms, two storage rooms, pantry, laundry, two toilets, workshop." },
    ],
  },
  {
    // sheet v11 · "variation 6": living-kitchen 24.5, entry 3.57, bathroom 3.27 — the bedroom unnumbered, no total; porch 11
    id: "S-T3", code: "014", name: "Shore Terrace 3", place: "Sevan", kind: "House",
    typology: "Garden + lower level", block: "S1", floor: "0 floor", bedrooms: 1, area: null, terrace: 11,
    completion: "1Q 2028", level: "Ground + basement", status: "available",
    note: "A family room below the porch",
    levels: [
      { caption: "Ground floor", img: v11g, alt: "Ground floor plan: living-kitchen with an island and dining table, one bedroom with closet, entry, bathroom with tub, porch." },
      { caption: "Basement", img: v11l, alt: "Basement plan: family room, two closets, laundry and utility, two parking spaces, exterior patio." },
    ],
  },
  {
    // sheet v08 · "variation 9": 11.38 + 4.01 + 4.39 + 32.6 + 4.39 = 56.77; porch 5.09 + patio 11
    id: "Y-K9", code: "015", name: "Komitas 9", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "B1", floor: "0 floor", bedrooms: 1, area: 57, terrace: 16,
    completion: "1Q 2028", level: "Ground + basement", status: "available",
    note: "One bedroom up, two salas below",
    levels: [
      { caption: "Ground floor", img: v08g, alt: "Ground floor plan: bedroom with wardrobe, bathroom, entrance hall, living-kitchen with an island, two closets, a second entrance, porch and patio." },
      { caption: "Basement", img: v08l, alt: "Basement plan: two salas, laundry, storage, hallway, bathroom, two toilets, an interior patio with a car, porch and patio." },
    ],
  },
  {
    // sheet v14 · "variation 14, floor and structural plans": living-dining 28.5, bedroom 12, bathroom 4.01 — the kitchen's printed figure is not credible, no total; terrace 7.3 + porch 4
    id: "D-FG2", code: "016", name: "Forest Gate 2", place: "Dilijan", kind: "House",
    typology: "Garden + lower level", block: "P2", floor: "0 floor", bedrooms: 1, area: null, terrace: 11,
    completion: "2Q 2028", level: "Ground + basement", status: "available",
    note: "Timber trusses over concrete · the section is on the sheet",
    levels: [
      { caption: "Ground floor", img: v14g, alt: "Ground floor plan: living-dining area with an island kitchen, bedroom, bathroom, porch and terrace, the stair to the basement." },
      { caption: "Basement", img: v14l, alt: "Basement plan: parking for two cars, two storage rooms, mechanical room, utility room." },
      { caption: "Structure", img: v14x, alt: "Structural cross-section: timber roof trusses over insulated roof panels, reinforced concrete load-bearing walls, steel columns and glulam beams on concrete foundation footings, three storeys cut open." },
    ],
  },
  {
    // sheet v12 · "variation 5": living-kitchen 28.5 + bedroom 14.3 = 42.8; the bathroom's printed figure is not credible and is left out
    id: "Y-S5", code: "017", name: "Saryan Court 5", place: "Yerevan", kind: "House",
    typology: "Garden + lower level", block: "A2", floor: "0 floor", bedrooms: 1, area: 43, terrace: 0,
    completion: "2Q 2027", level: "Ground + basement", status: "available",
    note: "Patio to the west",
    levels: [
      { caption: "Ground floor", img: v12g, alt: "Ground floor plan: living-kitchen with an island and dining table, bedroom, bathroom with tub, patio and wood decking." },
      { caption: "Basement", img: v12l, alt: "Basement plan: garage and storage area, patio, technical room, restroom, pantry and storage, stairs." },
    ],
  },
];
