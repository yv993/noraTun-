"use client";

import { useEffect } from "react";
import { brand } from "@/lib/content";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[noratun] route error", error);
  }, [error]);

  return (
    <div className="n-stop">
      <span className="code">Error</span>
      <h1>
        SOMETHING
        <br />
        CAME LOOSE
      </h1>
      <p>The page failed to draw. Trying again usually fixes it; nothing you typed was lost.</p>
      <nav aria-label="Recover">
        <button className="n-pill" type="button" onClick={() => reset()}>
          Try again <span aria-hidden>↻</span>
        </button>
        <a href="/">The homes</a>
        <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>{brand.phone}</a>
      </nav>
      {error.digest && (
        <p style={{ fontSize: 12 }}>
          Reference <code>{error.digest}</code>
        </p>
      )}
    </div>
  );
}
