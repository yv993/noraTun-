// A hotspot pin over a photograph: a soft outer ring, a pulsing beacon and a
// solid centre dot, with a label that appears on hover and on keyboard focus.
// Positioned by percentages of the photograph's frame so it stays anchored to
// the feature it marks. Styles live in globals.css under `.n-pin`.
export function HotspotPin({ x, y, label }: { x: string; y: string; label: string }) {
  return (
    <button type="button" className="n-pin" style={{ left: x, top: y }} aria-label={label}>
      <span className="n-pin__ring" aria-hidden="true" />
      <span className="n-pin__beacon" aria-hidden="true" />
      <span className="n-pin__dot" aria-hidden="true" />
      <span className="n-pin__label" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
