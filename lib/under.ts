/** Is a DARK surface painted under this fixed piece?
 *
 *  This asks the document what is beneath the element rather than testing band
 *  rectangles: the road chapter pans SIDEWAYS, so a cream panel and a wine
 *  panel share the same vertical range and a rect test cannot tell them apart.
 *  A hit test can.
 *
 *  `skip` names the piece's own fixed layer, so it never reads itself.
 *  Returns false when the element is off screen — nothing is painted there.
 *
 *  It is a class flip for LEGIBILITY, not motion, so callers must not gate it
 *  behind prefers-reduced-motion.
 */
export function under(p: HTMLElement, skip = ".n-chrome"): boolean {
  const r = p.getBoundingClientRect();
  const x = Math.round(r.left + r.width / 2);
  const y = Math.round(r.top + r.height / 2);
  if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight)
    return false;
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest(skip)) continue;
    const hit = el.closest<HTMLElement>("[data-dark],[data-light]");
    if (!hit) return false;
    return hit.hasAttribute("data-dark");
  }
  return false;
}
