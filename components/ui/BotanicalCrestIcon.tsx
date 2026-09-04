// Botanical crest emblem: a symmetrical four-petal lotus crest with an almond
// cutout inside each petal and a small enamelled pomegranate seal resting on
// the apex of the top petal. Strokes take `currentColor` so the same emblem
// reads as wine ink over cream and as white over a photograph — the caller
// sets the color. Stroke width is in screen pixels (non-scaling) so the line
// stays crisp whether the crest renders at 60px or 120px.
export function BotanicalCrestIcon({ className = "" }: { className?: string }) {
  const stroke = { vectorEffect: "non-scaling-stroke" as const };
  return (
    <div className={`n-crest ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <g transform="translate(100 100) scale(0.9)" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" fill="none">
          {/* top petal */}
          <path d="M 0,-62 C -24,-34 -18,-8 0,0 C 18,-8 24,-34 0,-62 Z" {...stroke} />
          <path d="M 0,-38 C -5,-26 -3,-14 0,-8 C 3,-14 5,-26 0,-38 Z" fill="currentColor" fillOpacity="0.15" {...stroke} />

          {/* bottom petal */}
          <path d="M 0,62 C -24,34 -18,8 0,0 C 18,8 24,34 0,62 Z" {...stroke} />
          <path d="M 0,38 C -5,26 -3,14 0,8 C 3,14 5,26 0,38 Z" fill="currentColor" fillOpacity="0.15" {...stroke} />

          {/* left petal */}
          <path d="M -62,0 C -34,-24 -8,-18 0,0 C -8,18 -34,24 -62,0 Z" {...stroke} />
          <path d="M -38,0 C -26,-5 -14,-3 -8,0 C -14,3 -26,5 -38,0 Z" fill="currentColor" fillOpacity="0.15" {...stroke} />

          {/* right petal */}
          <path d="M 62,0 C 34,-24 8,-18 0,0 C 8,18 34,24 62,0 Z" {...stroke} />
          <path d="M 38,0 C 26,-5 14,-3 8,0 C 14,3 26,5 38,0 Z" fill="currentColor" fillOpacity="0.15" {...stroke} />

          {/* pomegranate seal on the top apex — enamel red, brand-fixed */}
          <circle cx="0" cy="-62" r="6" fill="#8b1e28" stroke="currentColor" strokeWidth={1.2} {...stroke} />
        </g>
      </svg>
    </div>
  );
}
