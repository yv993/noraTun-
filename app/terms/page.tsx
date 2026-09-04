import type { Metadata } from "next";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms",
  description: "What this site is and is not.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="n-legal">
      <h1>Terms of use</h1>
      <p>
        This site presents homes that Noratun places in Armenia. Nothing on it is an offer capable of
        acceptance: areas, availability and completion seasons are indicative and are confirmed only
        in a written agreement for a specific home.
      </p>

      <h2>Accuracy</h2>
      <p>
        We keep the site current by hand. If something here and something in a signed document ever
        disagree, the signed document wins.
      </p>

      <h2>Imagery</h2>
      <p>
        Photography illustrates the standard of finish and the character of each place; individual
        homes differ. Photographs are licensed for this use.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <div className="foot">
        <span>
          {brand.full} · {brand.year}
        </span>
        <a href="/">Back to the site</a>
      </div>
    </article>
  );
}
