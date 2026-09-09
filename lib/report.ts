// Client-side error reporting. Pairs with app/api/report/route.ts.
//
// sendBeacon first, fetch second. A page that has just thrown is often about to
// be closed or reloaded by the visitor, and an in-flight fetch dies with it —
// beacon is the one transport the browser promises to finish after unload. It
// takes a Blob rather than a string so the Content-Type survives; sent as a
// bare string it arrives as text/plain and request.json() rejects it.

const ENDPOINT = "/api/report";

export function reportError(
  error: unknown,
  kind: "route" | "global" | "window" | "promise" = "route",
): void {
  if (typeof window === "undefined") return;
  try {
    const e = error as { message?: string; stack?: string; digest?: string } | undefined;
    const payload = JSON.stringify({
      kind,
      message: String(e?.message ?? error ?? "").slice(0, 500),
      stack: String(e?.stack ?? "").slice(0, 4000),
      digest: String(e?.digest ?? ""),
      url: window.location.href,
    });

    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return;

    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // reporting a failure must never itself fail loudly
  }
}

/**
 * Catch the errors React's boundaries do not see — a throw inside a raw event
 * listener, a rejected promise nobody awaited, a GSAP callback. Returns its own
 * cleanup so a component can register it in an effect.
 *
 * Mounted once, from Chrome, so every route is covered by one pair of listeners.
 */
export function watchWindowErrors(): () => void {
  if (typeof window === "undefined") return () => {};

  const onError = (ev: ErrorEvent) => reportError(ev.error ?? ev.message, "window");
  const onRejection = (ev: PromiseRejectionEvent) => reportError(ev.reason, "promise");

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
