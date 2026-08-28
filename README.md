# Craft Frame Media — Website

Marketing site for Craft Frame Media (video/photography production, Warsaw &
Lisbon). Static HTML/CSS/JS — no build step, no framework, no dependencies to
install. Open `index.html` through any static file server and it runs.

## Stack & why

Plain HTML/CSS/JS with native ES modules. For a small bilingual marketing
site with no backend, this keeps the project at zero build tooling, zero
dependency upgrades, and deployable to literally any static host (Netlify,
Vercel, GitHub Pages, S3, or the client's own hosting) by uploading the
folder as-is. If the site keeps growing — more dedicated landing pages, a
CMS, PL versions of `/festivals` and `/corporate` — that's the natural point
to reach for a framework (Astro is a strong fit — same static-first output,
but with templating and routing, which would remove the manual-duplication
trade-off described below).

## Project structure

```
index.html            Homepage — English (default language)
pl/index.html          Homepage — Polish (separate static page, see below)
festivals/index.html    Dedicated Festivals & Electronic Music landing page
corporate/index.html     Dedicated Corporate & Brand landing page
privacy.html               Privacy policy
css/
  tokens.css           Design tokens (color, type, spacing, motion) as CSS vars
  base.css              Reset, base typography, film-grain overlay, focus states
  layout.css             Container, nav, mobile menu, footer
  components.css          Buttons, hero, cards, stats, portfolio, contact list
  responsive.css           Breakpoint overrides (640 / 768 / 1024 / 1280)
  animations.css            Page-load fade
js/
  main.js                Entry point (used by index.html and pl/index.html;
                          festivals/corporate load a smaller inline subset —
                          just nav + portfolio video, no hero gallery/motion)
  i18n.js / i18n-data.js  EN/PL language-switch button + translation reference
                          (see "Bilingual content" below — no longer a live
                          in-page toggle)
  nav.js                  Sticky nav, mobile menu, focus trap
  video.js                 Portfolio card lazy-load + scroll-triggered playback
  hero-gallery.js           Hero background clip cycling (homepage only)
  motion.js               GSAP scroll reveals, hero timecode readout (homepage only)
assets/
  logo/                 Wordmark PNGs + square logomark (schema/favicon use)
  icons/favicon.svg     Favicon (viewfinder-mark motif)
```

## Running it locally

Any static file server works. From this folder:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`. (Opening `index.html` directly via
`file://` will break the language toggle and motion — ES modules require
`http(s)://`.)

## Deploying

No build step — drag-and-drop this folder onto Netlify or Vercel, or push it
to a GitHub repo and enable Pages. Point `craft-frame-media.com` at whichever
host is chosen.

## Design system

- **Palette:** deep obsidian background, warm off-white text, one accent red
  used only as a spot color (CTAs, links, highlight words) — never a fill.
- **Type:** Bricolage Grotesque (display/headlines), Inter (body), JetBrains
  Mono (eyebrows, stats, index numbers, the hero timecode) — loaded from
  Google Fonts, both Latin and Latin-Extended (Polish diacritics included).
- **Signature motif:** viewfinder corner-brackets (`.frame-marks`) and a
  live REC/timecode readout in the hero — a nod to "Frame" in the brand name
  and the client's video-production world. Corners appear quietly at rest,
  light up in accent red on hover/focus.
- **Motion:** GSAP + ScrollTrigger for one-time scroll reveals and the hero
  ambient glow pulse, loaded from cdnjs. Everything is visible-by-default in
  markup — JS only sets a hidden starting point right before animating in —
  so if the CDN is blocked, content still renders normally. All motion
  (including the timecode ticker) is skipped under `prefers-reduced-motion`.

## Bilingual content (EN/PL)

As of the Phase 4 SEO pass, English and Polish are **two separate static
pages** — `index.html` and `pl/index.html` — not one page toggled client-side.
That's a deliberate fix: the old approach (one page, `localStorage`-driven
text-swap via JS) meant Google's crawler only ever saw whichever language was
already stored — in practice, always English, since Polish was never the
default and crawlers don't click toggle buttons. Now each language has its
own URL with the correct text already in the raw HTML, and the two pages
carry reciprocal `hreflang` tags (`en` → `/`, `pl` → `/pl/`, plus
`x-default` → `/`) so Google knows they're translations of each other.

**Trade-off**: with no build step, keeping two full static homepages in sync
by hand is real ongoing work. `js/i18n-data.js` is kept as the translation
reference (not imported anywhere at runtime anymore) — when homepage copy
changes, update the English text in `index.html`, update the matching `"pl"`
entry in `i18n-data.js`, then carry that same change into `pl/index.html`.
If this becomes a maintenance burden, it's the strongest argument for moving
to a static-site generator (see "Stack & why" above).

The EN/PL buttons in the nav (`js/i18n.js`) now just navigate between `/`
and `/pl/` — they no longer swap text in place. `/festivals` and `/corporate`
are English-only for now (matches the existing convention below); Polish
versions of those two are a natural next step once this lands.

Portfolio card titles/captions are intentionally left English-only on every
page, including `pl/index.html` — they're real proper nouns (event/artist/
client names) plus short format labels, not worth duplicating into Polish.

## Known limitations (see LAUNCH_CHECKLIST.md)

Hero and portfolio video are real footage now (hero is a 6-clip gallery,
`js/hero-gallery.js`; portfolio cards use `js/video.js` for scroll-triggered
playback). WhatsApp has no real number yet, so that contact method was
removed entirely rather than shipping a placeholder — see
`LAUNCH_CHECKLIST.md` to re-add it once a number exists. There's also no
photo of Francisco on the site (removed by request). See
`LAUNCH_CHECKLIST.md` for the full list of items to confirm with the client
before this goes live.
