import type { Metadata } from "next";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="n-stop">
      <span className="code">404</span>
      <h1>
        NO HOUSE
        <br />
        AT THIS ADDRESS
      </h1>
      <p>The page has moved or never existed. The homes, the approach and our phone number are all one click away.</p>
      <nav aria-label="Where to go instead">
        <a className="n-pill" href="/">
          The homes <span aria-hidden>→</span>
        </a>
        <a href="/#approach">The approach</a>
        <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>{brand.phone}</a>
      </nav>
    </div>
  );
}
