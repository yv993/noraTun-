# NORATUN

Residences across Armenia — a one-page site for apartments in Yerevan and
houses in Dilijan, Sevan and Tsaghkadzor, plus a `/homes` catalogue.

## Stack

- **Next.js 15** (App Router) and **React 19**, TypeScript throughout
- **GSAP** with ScrollTrigger for the scroll choreography
- **Lenis** for site-wide smooth scrolling
- Plain CSS in `app/globals.css` — no utility framework
- Photography self-hosted from `assets/photos` as static imports, so every
  image ships with real dimensions and an automatic blur placeholder

## Running it

```bash
npm install
npm run dev     # http://localhost:3800
```

```bash
npm run build   # production build
npm start       # serve the build on :3800
npm run typecheck
```

## Layout

| Path | What lives there |
| --- | --- |
| `app/` | routes, metadata, global stylesheet, the contact endpoint |
| `components/` | the page views and the interactive bands |
| `components/ui/` | the botanical crest and the map hotspot |
| `lib/content.ts` | every string and photograph on the site, in one file |
| `lib/eases.ts` | the five scroll easing curves, sampled numerically |
| `assets/photos/` | source photography (imported, optimised at build) |
| `public/` | icons, manifest, the cloud strip and the flora cut-outs |

Editing copy or swapping a photograph is almost always a change to
`lib/content.ts` alone.

## Motion

The scroll work is gated to wide screens with motion enabled. Phones, visitors
with reduced motion, and anyone without JavaScript get a static composition of
the same content — the animated layers are never the only way to reach a fact.

## Configuration

Copy `.env.example` to `.env.local`. Until `NEXT_PUBLIC_SITE_URL` is a real
https origin, `robots.txt` blocks indexing. The call-back form works with
either a Resend key or a webhook; with neither it validates, logs server-side
and offers the phone number instead of silently failing.
