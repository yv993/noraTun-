import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vitest/config";

// Static image imports are a Next.js feature, not a Vite one: `import x from
// "./a.jpg"` gives Next an object with src/width/height/blurDataURL, and Vite
// would try to parse the JPEG as a module. lib/imageRegistry.ts imports 98 of
// them, and almost everything worth testing reaches it through lib/content.
//
// So stub them — but stub them ACCURATELY. The src shape below is the real one
// Next emits, `/_next/static/media/<name>.<8 hex>.<ext>`, because lib/overlay's
// keyOf() parses exactly that string back into a registry key. A lazier stub
// (src: "test-file-stub") would make keyOf's tests pass against a format that
// never occurs in production, which is worse than not testing it.
const nextImageStub = (): Plugin => ({
  name: "next-image-stub",
  enforce: "pre",
  load(id) {
    const m = id.split("?")[0].match(/([^/\\]+)\.(jpe?g|png|webp|avif|gif|svg)$/i);
    if (!m) return null;
    return `export default ${JSON.stringify({
      src: `/_next/static/media/${m[1]}.1a2b3c4d.${m[2]}`,
      height: 1600,
      width: 2400,
      blurDataURL: "data:image/jpeg;base64,stub",
      blurWidth: 8,
      blurHeight: 5,
    })};`;
  },
});

export default defineConfig({
  plugins: [nextImageStub()],
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Each suite stubs process.env and re-imports modules that read it at load
    // time (lib/site.ts). Without isolation those stubs would leak between
    // files and the failure would look like flakiness rather than a shared env.
    isolate: true,
    restoreMocks: true,
    unstubEnvs: true,
  },
});
