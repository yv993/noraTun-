"use client";

import { useEffect } from "react";
import { watchPhoneClicks } from "@/lib/analytics";
import { watchWindowErrors } from "@/lib/report";

// Mounted once in the root layout; renders nothing. Two page-level listeners
// that would otherwise have to be repeated in every component that needs them:
//
//   errors  React's boundaries (app/error.tsx, app/global-error.tsx) only see
//           throws during render or in an effect. They do not see a throw
//           inside a raw DOM listener, a GSAP callback, a Lenis tick, or an
//           unawaited promise — which, on this site, is most of the code.
//
//   tel:    the enquiry that never touches a form. Delegated, so the two
//           error pages and the 404 are counted too, without anyone having to
//           remember them.
export default function Telemetry() {
  useEffect(watchWindowErrors, []);
  useEffect(watchPhoneClicks, []);
  return null;
}
