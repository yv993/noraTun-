"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/report";

// The last net. app/error.tsx catches a crash inside a route, but it renders
// INSIDE the root layout — so it cannot help when the root layout itself is
// what threw. Without this file that case falls through to Next's own
// unstyled default page, on a site whose whole argument is that it was made
// with care.
//
// It replaces <html> entirely, so nothing from the layout is available:
// no fonts, no globals.css, no chrome. Everything here is inline and
// self-contained on purpose, and it says only what is true — the page could
// not be drawn, and here is the phone number, which works regardless.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[noratun] global error", error);
    // a root-layout crash is the most serious failure this site has and the
    // one least likely to be reported by a visitor — report it ourselves
    reportError(error, "global");
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeContent: "center",
          gap: 20,
          padding: "0 24px",
          background: "#f4f2ea",
          color: "#33121f",
          fontFamily: "Georgia, 'Times New Roman', serif",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          NORATUN
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(38px, 9vw, 86px)",
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          THE PAGE
          <br />
          DID NOT DRAW
        </h1>
        <p
          style={{
            margin: "0 auto",
            maxWidth: "42ch",
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Something failed before the site could load. Trying again usually
          fixes it — and the phone works either way.
        </p>
        <p style={{ margin: 0, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              minHeight: 44,
              padding: "0 26px",
              border: "1px solid #33121f",
              borderRadius: 999,
              background: "none",
              color: "inherit",
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Try again
          </button>
          <a
            href="tel:+37410242424"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
              padding: "0 26px",
              border: "1px solid rgba(51,18,31,0.35)",
              borderRadius: 999,
              color: "inherit",
              textDecoration: "none",
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            +374 10 24 24 24
          </a>
        </p>
      </body>
    </html>
  );
}
