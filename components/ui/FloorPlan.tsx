import type { Room } from "@/lib/content";

// ============================================================================
// FLOOR PLAN — an ORIGINAL drawing, rendered from the listing's own room
// rectangles. Nothing here is traced, downloaded or embedded; the geometry
// lives in lib/content.ts and this file is only the drafting language.
//
// The language, matched to the reference's plans (measured 1440x900: the plan
// sits in a 338.4 x 338.4 square, object-fit contain, so the drawing must be
// square-safe and read at ~340px):
//   · heavy envelope stroke around the built rooms, lighter partition walls
//   · room name and its m² printed inside each room
//   · garden and terrace tinted, their walls dashed — they read as outdoor
//   · thin dimension ticks with end serifs along the top and left edges
// ============================================================================

const PAD = 9; // drawing margin, in the plan's own units — room for the ticks

export function FloorPlan({
  rooms,
  caption,
  title,
  className,
}: {
  rooms: Room[];
  caption: string;
  title: string;
  className?: string;
}) {
  if (!rooms.length) return null;

  const built = rooms.filter((r) => !r.out);
  const box = (rs: Room[]) => ({
    x: Math.min(...rs.map((r) => r.x)),
    y: Math.min(...rs.map((r) => r.y)),
    r: Math.max(...rs.map((r) => r.x + r.w)),
    b: Math.max(...rs.map((r) => r.y + r.h)),
  });
  const all = box(rooms);
  const env = built.length ? box(built) : all;
  const vb = `${all.x - PAD} ${all.y - PAD} ${all.r - all.x + PAD * 2} ${all.b - all.y + PAD * 2}`;

  // a dimension run: a thin line with a serif at each end
  const Tick = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
    const vertical = x1 === x2;
    const s = 1.7; // serif half-length
    return (
      <g className="fp-tick">
        <line x1={x1} y1={y1} x2={x2} y2={y2} />
        <line x1={vertical ? x1 - s : x1} y1={vertical ? y1 : y1 - s} x2={vertical ? x1 + s : x1} y2={vertical ? y1 : y1 + s} />
        <line x1={vertical ? x2 - s : x2} y1={vertical ? y2 : y2 - s} x2={vertical ? x2 + s : x2} y2={vertical ? y2 : y2 + s} />
      </g>
    );
  };

  const spoken = rooms
    .map((r) => [r.label, r.area ? `${r.area} square metres` : null].filter(Boolean).join(", "))
    .filter(Boolean)
    .join("; ");

  return (
    <figure className={`fp${className ? " " + className : ""}`}>
      <svg viewBox={vb} role="img" aria-label={`${caption} of ${title}. ${spoken}.`} focusable="false">
        {/* outdoor first, so built walls always draw over the tint */}
        {rooms
          .filter((r) => r.out)
          .map((r, i) => (
            <rect key={`o${i}`} className="fp-out" x={r.x} y={r.y} width={r.w} height={r.h} />
          ))}
        {built.map((r, i) => (
          <rect key={`b${i}`} className="fp-room" x={r.x} y={r.y} width={r.w} height={r.h} />
        ))}
        {/* the envelope: one heavy line around everything built */}
        <rect className="fp-env" x={env.x} y={env.y} width={env.r - env.x} height={env.b - env.y} />

        {rooms.map((r, i) =>
          r.label ? (
            <g key={`t${i}`} className={r.out ? "fp-label is-out" : "fp-label"}>
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 - (r.area ? 1.6 : 0)} textAnchor="middle" dominantBaseline="central">
                {r.label.toUpperCase()}
              </text>
              {r.area ? (
                <text className="fp-area" x={r.x + r.w / 2} y={r.y + r.h / 2 + 3.4} textAnchor="middle" dominantBaseline="central">
                  {r.area} m²
                </text>
              ) : null}
            </g>
          ) : null,
        )}

        <Tick x1={all.x} y1={all.y - PAD * 0.55} x2={all.r} y2={all.y - PAD * 0.55} />
        <Tick x1={all.x - PAD * 0.55} y1={all.y} x2={all.x - PAD * 0.55} y2={all.b} />
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
