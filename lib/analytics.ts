// Measurement, env-gated the same way contact delivery is.
//
// The site had none. Without it S1 (Pareto — spend on the 20% that carries the
// traffic) is not a principle, it is a guess: there was no way to answer "which
// of the seventeen homes do people actually open" or "does anyone reach the
// booking dialog". Three providers are supported because the choice belongs to
// whoever runs the site, not to this file:
//
//   NEXT_PUBLIC_PLAUSIBLE_DOMAIN   noratun.am        privacy-first, no banner
//   NEXT_PUBLIC_UMAMI_ID           <uuid>            self-hostable
//   NEXT_PUBLIC_GA_ID              G-XXXXXXXXXX      GA4
//
// With none set, `<Analytics />` renders nothing and `track()` is a no-op that
// still returns — call sites never need to check. Zero dependencies: each
// provider is a script tag and a global, so the bundle cost when analytics is
// off is this file and nothing else.
//
// Plausible and Umami need no cookie banner (no cookies, no cross-site ids).
// GA4 does. That is a legal fact about the provider, not about this code — see
// PRIVACY note in app/privacy/page.tsx if GA4 is ever switched on.

export const analytics = {
  plausible: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() || "",
  umami: process.env.NEXT_PUBLIC_UMAMI_ID?.trim() || "",
  umamiSrc:
    process.env.NEXT_PUBLIC_UMAMI_SRC?.trim() || "https://cloud.umami.is/script.js",
  ga: process.env.NEXT_PUBLIC_GA_ID?.trim() || "",
};

export const analyticsOn = Boolean(
  analytics.plausible || analytics.umami || analytics.ga,
);

// GA4 is the only one of the three that sets cookies and therefore the only one
// that makes a consent notice legally necessary in the EU/EEA.
export const analyticsNeedsConsent = Boolean(analytics.ga);

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void;
    umami?: { track: (event: string, data?: Props) => void };
    gtag?: (command: string, event: string, params?: Props) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Record a named event. Safe to call anywhere, at any time: on the server, before
 * the provider script has loaded, or with no provider configured at all — it
 * never throws and never blocks the interaction it is measuring.
 *
 * Event names are snake_case and stable; renaming one silently breaks a funnel
 * that has already collected history, so treat them as an interface.
 */
export function track(event: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, Object.keys(props).length ? { props } : undefined);
    window.umami?.track(event, props);
    window.gtag?.("event", event, props);
  } catch {
    // measurement must never break the thing it measures
  }
}

/**
 * Count uses of a tel: link, wherever it appears.
 *
 * Delegated rather than an onClick per link, because tel: links are rendered in
 * five places — the chrome, the footer, and all three stop pages — and the two
 * that matter most are the error pages, which is exactly where nobody remembers
 * to add tracking. Capture phase, so it still records if a handler below calls
 * stopPropagation.
 *
 * This is the enquiry that never touches the form, and on a phone it is
 * probably the most common one. Counting only form submissions would have made
 * the site look far worse at converting than it is.
 */
export function watchPhoneClicks(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (ev: Event) => {
    const el = (ev.target as Element | null)?.closest?.('a[href^="tel:"]');
    if (el) track(EV.phoneClick, { from: window.location.pathname });
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

/** The events this site actually records. Keeping them in one place stops the
 *  same moment being logged under two spellings from two components. */
export const EV = {
  /** a listing detail page was opened — the number that ranks the seventeen */
  homeView: "home_view",
  /** the catalogue filter was changed, with the facet that changed */
  filterUse: "filter_use",
  /** the call-back dialog was opened — top of the enquiry funnel */
  askOpen: "ask_open",
  /** the enquiry form was submitted and the server accepted it */
  askSent: "ask_sent",
  /** the enquiry form was submitted but nothing was configured to deliver it */
  askUndelivered: "ask_undelivered",
  /** a tel: link was used — an enquiry that never touches the form */
  phoneClick: "phone_click",
} as const;
