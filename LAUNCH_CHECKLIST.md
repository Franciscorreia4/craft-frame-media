# Launch checklist — items to confirm with the client

Carried over from the handoff doc's open questions. None of these were
silently changed in either direction — flagging them here instead.

- [x] **Domain vs. email mismatch.** Domain is `craft-frame-media.com`
      (hyphens between all three words); the contact email is
      `hello@craftframe-media.com` (no hyphen between "craft" and "frame").
      Confirmed intentional — both are correct as-is, no change needed.
- [x] **WhatsApp.** No real number was available, so the WhatsApp contact-list
      item was removed entirely (`index.html` + both i18n dictionaries) rather
      than shipping the `wa.me/000000000000` placeholder. Re-add it (`Contact`
      section, next to the Email list item) once a real number exists.
- [x] **Portfolio video** — all 12 cards (6 festivals + 6 corporate) now play
      real muted looping footage, only while scrolled into view, with poster
      frames as the mobile/reduced-motion fallback. Source clips are full-length
      exports (32–85s each); if you'd rather each card loop a tighter highlight
      than the full piece, tell me the in/out timestamps you want per card and
      I'll re-cut them.
- [x] **Hero background** — now a 6-clip gallery cycling through real footage
      (Upperground, WPP Media, Our Affairs, D'Agence, Stephan Bodzin, Smith &
      Nephew), muted/looping per slide, manual next-arrow + dots to advance.
      Same full-length-clip note as above applies — happy to trim any of these
      to a tighter loop if you'd rather not use the whole piece.
- [x] **Portfolio cover images** — replaced the auto-extracted video frames
      with your own uploaded cover photos on all 12 cards.
- [x] **About section photo** — removed per your request; no personal photo
      on the site for now. About is a single-column text section.
- [ ] **Hosting/deployment target** for `craft-frame-media.com` — not yet
      decided. The site is a static folder, deployable anywhere (see
      README.md).
- [x] **Corporate client sign-off.** Bentley Poland, Levi's Poland, Smith &
      Nephew, NEPI Rockcastle, WPP Media, D'Agence, Messalka Events named
      publicly in the Trusted-by section — all confirmed, no NDA restriction.
- [x] **Portfolio card captions** rewritten with real per-clip dates (and city,
      where confirmed) as visible text on every card, not just `aria-label` —
      e.g. "Aftermovie — Warsaw — Jan 2026". No two cards share identical copy.
- [x] **SEO pass** — canonical URL, Open Graph + Twitter Card tags, a real
      1200×630 share image, apple-touch-icon, Organization/Service/VideoObject
      structured data (JSON-LD), `robots.txt`, and `sitemap.xml` are all in
      place and live on `https://craft-frame-media.com/`. Security headers
      (`_headers`), a privacy policy, and reciprocal `hreflang` between `/`
      and `/pl/` are also in place.
- [x] **Dedicated `/festivals` and `/corporate` landing pages** — built as
      real, independently-indexable pages (not homepage anchors), each with
      its own title/description/canonical/`Service` schema and full portfolio
      grid. English-only for now — see README.md's "Bilingual content"
      section for the `/pl/` scope decision and the manual-sync trade-off
      that comes with keeping two static homepages (`index.html` +
      `pl/index.html`) without a build step.
- [ ] **Client testimonials** — Services section lists "Corporate interviews
      & testimonials" as a deliverable, but no real testimonials are on the
      site yet. Add 2–3 once you have them (name + role + company).
- [ ] **Business registration on the privacy page** — legal name and VAT ID
      are listed; the street address was deliberately left off at your
      request. Revisit if a registered address is ever required (e.g. some
      jurisdictions' terms/impressum requirements).
