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
npm test        # vitest, 59 tests — run before every push
npm run test:watch
```

CI (`.github/workflows/ci.yml`) runs typecheck, tests and a build on every push
and pull request to `main`, with an advisory (non-blocking) dependency audit
alongside. Mark **verify** as a required check on the branch so a red build
cannot reach Vercel.

The tests cover the paths that fail silently: the enquiry route's two bot traps
and its rate limit, the delivery flag the dialog reads before it promises a call
back, the origin/indexing gate that once shipped `index: true` alongside
`Disallow: /`, and a round trip of every listing through the admin's JSON so an
edit cannot quietly drop a floor plan.

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

Everything optional is **off until an env var turns it on, and off means absent
rather than disabled** — an unconfigured site ships no analytics script, no
third-party request and no extra bytes:

| Set | Gives you |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_UMAMI_ID` / `NEXT_PUBLIC_GA_ID` | Page views plus six named events: `home_view`, `filter_use`, `ask_open`, `ask_sent`, `ask_undelivered`, `phone_click` |
| `ERROR_WEBHOOK_URL` | Client and server crashes pushed to Slack/Discord/Zapier |
| `ADMIN_PASSWORD` | `/admin`. Unset means closed, not open |
| `RESEND_API_KEY` + `CONTACT_TO`, or `CONTACT_WEBHOOK_URL` | Enquiries actually delivered |

Crashes are **always** written to the runtime log as `[noratun/error] {…}`
whether or not a webhook is set — that string is what to alert on in Vercel.
`ask_undelivered` firing at all means leads are only reaching that log, which is
the one failure that is otherwise invisible from the outside.

Plausible and Umami are cookieless and need no consent banner. GA4 sets cookies
and does — switching it on is a legal change, not just a config one.
