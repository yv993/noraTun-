// Shown while a route's payload is in flight. See the .n-load block in
// globals.css for why this is a rule and a word rather than a spinner.
//
// `aria-live="polite"` and not "assertive": a route change is expected, so it
// should be announced when the screen reader next pauses, not cut across what
// it is currently saying. role="status" carries the polite default anyway; it
// is written out because the pair is what makes the announcement reliable
// across NVDA and VoiceOver.
export default function Loading() {
  return (
    <div className="n-load" role="status" aria-live="polite">
      <span className="n-load__word">One moment</span>
      <span className="n-load__rule" aria-hidden />
      <span className="n-sr">Loading the page</span>
    </div>
  );
}
