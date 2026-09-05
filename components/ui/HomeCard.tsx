import { Fragment } from "react";
import { FloorPlan } from "@/components/ui/FloorPlan";
import { homesPage, type Listing } from "@/lib/content";

// ============================================================================
// THE CARD — one home, as the catalogue draws it and as a home's own page
// draws its neighbours. Measured off the reference's listing card: 396 x 550,
// typology header 8.1/700/0.32em, two stacked square plans, meta row, the big
// 36px didone line, the terrace note, the status.
//
// It lives here rather than in either view so the two can never disagree about
// what a home looks like — the "similar options" grid on a home's page is the
// catalogue's own card, not a copy of it.
// ============================================================================

/** The bed / area line, printed from what the sheet actually gives. A null
 *  bedroom count or area is OMITTED — never shown as 0, never invented. Shared
 *  by the catalogue card and the detail page so the two can never disagree. */
export function Facts({ l }: { l: Listing }) {
  const bits: React.ReactNode[] = [];
  if (l.bedrooms !== null)
    bits.push(<Fragment key="b">{l.bedrooms} bed</Fragment>);
  if (l.area !== null)
    bits.push(
      <Fragment key="a">
        {l.area} m<sup>2</sup>
      </Fragment>,
    );
  return (
    <>
      {bits.map((b, i) => (
        <Fragment key={i}>
          {i ? " / " : ""}
          {b}
        </Fragment>
      ))}
    </>
  );
}

export function Card({ l }: { l: Listing }) {
  const spec = [
    l.bedrooms === null
      ? null
      : `${l.bedrooms} bedroom${l.bedrooms === 1 ? "" : "s"}`,
    l.area === null ? null : `${l.area} square metres`,
    l.terrace ? `${l.terrace} square metre terrace` : null,
  ].filter(Boolean);
  const label =
    `${l.name}, ${l.typology.toLowerCase()} in ${l.place}` +
    (spec.length ? ` — ${spec.join(", ")}` : "") +
    `. ${homesPage.statusLabel[l.status]}.`;
  return (
    <a
      className="hp-card"
      href={`/homes/${l.id}`}
      data-status={l.status}
      aria-label={label}
    >
      <span className="hp-card__head">
        <span className="hp-card__typo">{l.typology}</span>
        <span className="hp-card__completion">
          {homesPage.completionLabel}: {l.completion}
        </span>
      </span>

      <span className="hp-card__plans" aria-hidden="true">
        {/* the two floors, stacked as the reference stacks them; a sheet's
            structural section (v14) belongs on the home's own page, not here */}
        {l.levels.slice(0, 2).map((lv) => (
          <FloorPlan
            key={lv.caption}
            img={lv.img}
            alt={lv.alt}
            rooms={lv.rooms}
            caption={lv.caption}
            title={l.name}
          />
        ))}
      </span>

      <span className="hp-card__meta">
        <span>№ {l.code}</span>
        <span>Block {l.block}</span>
        <span>{l.floor}</span>
      </span>
      <span className="hp-card__big">
        <Facts l={l} />
      </span>
      {l.terrace > 0 && (
        <span className="hp-card__sub">
          + {l.terrace} m<sup>2</sup> {homesPage.terraceLabel}
        </span>
      )}
      <span className="hp-card__status">{homesPage.statusLabel[l.status]}</span>
    </a>
  );
}
