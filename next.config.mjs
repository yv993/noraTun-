/** @type {import('next').NextConfig} */
const nextConfig = {
  // Photography is self-hosted from the start (assets/photos, static imports):
  // real dimensions, automatic blur placeholders, no third-party image host.
  images: { formats: ["image/avif", "image/webp"] },
  // the round "N" badge in the bottom-left corner is Next's own dev-tools
  // indicator, not site chrome; it never ships in a build. Kept out of the
  // dev view too so screenshots match production.
  devIndicators: false,
};
export default nextConfig;
