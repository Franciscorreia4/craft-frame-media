# Craft Frame Media — Website

Marketing site for Craft Frame Media (video/photography production, Warsaw &
Lisbon). Static HTML/CSS/JS — no build step, no framework, no dependencies to
install. Open `index.html` through any static file server and it runs.

## Stack & why

Plain HTML/CSS/JS with native ES modules. For a one-page bilingual marketing
site with no backend, this keeps the project at zero build tooling, zero
dependency upgrades, and deployable to literally any static host (Netlify,
Vercel, GitHub Pages, S3, or the client's own hosting) by uploading the
folder as-is. If the site grows into the `/festivals` and `/corporate`
landing pages mentioned as a v2 in the original brief, or gains a CMS, that's
the natural point to reach for a framework (Astro is a strong fit — same
static-first output, but with templating and routing).

## Project structure

```
index.html            All markup, one page, semantic sections
css/
  tokens.css           Design tokens (color, type, spacing, motion) as CSS vars
  base.css              Reset, base typography, film-grain overlay, focus states
  layout.css             Container, nav, mobile menu, footer
  components.css          Buttons, hero, cards, stats, portfolio, contact list
  responsive.css           Breakpoint overrides (640 / 768 / 1024 / 1280)
  animations.css            Page-load fade
js/
  main.js                Entry point
  i18n.js / i18n-data.js  EN/PL dictionaries + toggle logic
  nav.js                  Sticky nav, mobile menu, focus trap
  motion.js               GSAP scroll reveals, hero timecode readout
assets/
  logo/                 Wordmark PNGs (trimmed + optimized from source file)
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

Every translatable string lives in `js/i18n-data.js`. Elements are tagged
`data-i18n="key"` (plain text) or `data-i18n-html="key"` (strings containing
`<em>`/`<strong>` — these must stay on the HTML-aware path, not
`.textContent`). The toggle persists the visitor's choice in
`localStorage` and never auto-detects browser locale, per the brief.

Portfolio card titles/captions are intentionally left English-only and
outside the i18n system — the brief flags them as placeholder labels to be
replaced with real captions once real footage is in, so they weren't worth
duplicating into Polish yet.

## Known limitations (see LAUNCH_CHECKLIST.md)

Hero and portfolio video are real footage now (hero is a 6-clip gallery,
`js/hero-gallery.js`; portfolio cards use `js/video.js` for scroll-triggered
playback). WhatsApp has no real number yet, so that contact method was
removed entirely rather than shipping a placeholder — see
`LAUNCH_CHECKLIST.md` to re-add it once a number exists. There's also no
photo of Francisco on the site (removed by request). See
`LAUNCH_CHECKLIST.md` for the full list of items to confirm with the client
before this goes live.
