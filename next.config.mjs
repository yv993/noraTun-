/** @type {import('next').NextConfig} */
const nextConfig = {
  // Photography is self-hosted from the start (assets/photos, static imports):
  // real dimensions, automatic blur placeholders, no third-party image host.
  images: {
    formats: ["image/avif", "image/webp"],
    // The default ladder has nothing between 1200 and 1920, so on a 430px
    // phone (DPR 3 → 1290 needed) six full-bleed photographs jumped straight
    // to w=1920 and cost a measured +506 KB. 1290 is the rung that was
    // missing.
    // 1440 for the same reason at the other end: a laptop at 1440 CSS px and
    // DPR 1 needs 1440 and was being served 1920 — 78% more pixels than the
    // screen can show. Measured on /homes/[id], which carries seven
    // full-bleed photographs: 1607 KB → 1201 KB.
    deviceSizes: [640, 750, 828, 1080, 1200, 1290, 1440, 1920, 2048, 3840],
    // q=75 measured 28% heavier than q=65 with no visible difference on this
    // photography; both are allowed so a band that bands can stay at 75.
    qualities: [65, 75],
  },
  async headers() {
    return [
      {
        // MEASURED on the live deployment: the only security header present
        // was Vercel's own HSTS. These four are the ones a brochure site can
        // set without knowing anything about its own scripts.
        //
        // No Content-Security-Policy here on purpose. Next injects inline
        // bootstrap scripts, so a real policy needs a per-request nonce and
        // middleware; a `unsafe-inline` policy is theatre and a strict one
        // added blind would white-screen the site. It is worth doing properly,
        // as its own change, with the deployed pages checked afterwards.
        source: "/:path*",
        headers: [
          // the pages embed no third-party frames and should not be framed:
          // clickjacking cover for the booking dialog
          { key: "X-Frame-Options", value: "DENY" },
          // no MIME sniffing — the photographs and sheets are served as-is
          { key: "X-Content-Type-Options", value: "nosniff" },
          // send the origin to other sites, the full path only to ourselves
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // nothing here asks for a camera, a microphone or a location, so
          // nothing embedded in it may either
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // the flora cut-outs are content-hashed by name and never change
        source: "/flora/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // the study sheets a home's page links to. One file per sheet, written
        // once by scripts/sheets.mjs and never edited in place — a new drawing
        // would be a new sheet with a new name.
        source: "/sheets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  // the round "N" badge in the bottom-left corner is Next's own dev-tools
  // indicator, not site chrome; it never ships in a build. Kept out of the
  // dev view too so screenshots match production.
  devIndicators: false,
};
export default nextConfig;
