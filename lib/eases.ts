// The reference site's five registered scroll eases, sampled numerically from
// its live GSAP registry (21 points each) and replayed as piecewise-linear
// ease functions. GSAP accepts a plain function as `ease`, so no plugin.
const poly = (pts: number[]) => {
  const n = pts.length - 1;
  return (t: number) => {
    const x = (t <= 0 ? 0 : t >= 1 ? 1 : t) * n;
    const i = x >= n ? n - 1 : Math.floor(x);
    return pts[i] + (pts[i + 1] - pts[i]) * (x - i);
  };
};

/** fast-out glide — the hero's two-speed rise */
export const eEase = poly([
  0, 0.0331, 0.095, 0.1857, 0.2953, 0.4084, 0.513, 0.6047, 0.6824, 0.7478, 0.8023,
  0.8476, 0.8851, 0.9159, 0.9407, 0.9604, 0.9755, 0.9866, 0.9943, 0.9985, 1,
]);

/** deep late ramp (~power4.in) — the photo zooms */
export const eIn = poly([
  0, 0.0001, 0.0004, 0.0014, 0.003, 0.0062, 0.0112, 0.0188, 0.0297, 0.0451, 0.066,
  0.0938, 0.1302, 0.1772, 0.2368, 0.3116, 0.4041, 0.5171, 0.6529, 0.8134, 1,
]);

/** fast start, long settle — wipes and triggered reveals */
export const eOut = poly([
  0, 0.1866, 0.3471, 0.4829, 0.5959, 0.6884, 0.7632, 0.8228, 0.8698, 0.9062, 0.934,
  0.9549, 0.9703, 0.9812, 0.9888, 0.9938, 0.997, 0.9986, 0.9996, 0.9999, 1,
]);

/** steep middle (~power4.inOut) — the window zoom-through */
export const eInOut = poly([
  0, 0.0018, 0.0069, 0.0165, 0.0317, 0.0543, 0.0873, 0.1351, 0.2071, 0.3218, 0.5,
  0.6782, 0.7929, 0.8649, 0.9127, 0.9457, 0.9683, 0.9835, 0.9931, 0.9982, 1,
]);

/** gentle S, near-linear — the horizontal chapter's pan */
export const eHor = poly([
  0, 0.0115, 0.0399, 0.0799, 0.1281, 0.1826, 0.2413, 0.3034, 0.368, 0.4336, 0.5,
  0.5664, 0.632, 0.6966, 0.7587, 0.8174, 0.8719, 0.9201, 0.9601, 0.9885, 1,
]);
