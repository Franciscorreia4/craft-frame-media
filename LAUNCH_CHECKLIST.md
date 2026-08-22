# Launch checklist — items to confirm with the client

Carried over from the handoff doc's open questions. None of these were
silently changed in either direction — flagging them here instead.

- [ ] **Domain vs. email mismatch.** Domain is `craft-frame-media.com`
      (hyphens between all three words); the contact email is
      `hello@craftframe-media.com` (no hyphen between "craft" and "frame").
      Both are used as-given throughout the site. Needs a decision on which
      is correct before launch.
- [ ] **Real WhatsApp number.** The WhatsApp link currently points to
      `https://wa.me/000000000000` (placeholder). Swap the digits in
      `index.html` (search `wa.me`) once a real number is provided.
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
- [ ] **Corporate client sign-off.** Bentley Poland, Levi's Poland, Smith &
      Nephew, NEPI Rockcastle, WPP Media, D'Agence, Messalka Events are named
      publicly in the Trusted-by section — confirm no agency/NDA restriction
      before this goes live.
- [ ] **Portfolio card captions are placeholders**, written for this build
      and easy to edit (`index.html`, look for `p-card__title` /
      `p-card__caption`) — not final client-approved copy.
- [x] **SEO pass** — canonical URL, Open Graph + Twitter Card tags, a real
      1200×630 share image, apple-touch-icon, Organization structured data
      (JSON-LD), `robots.txt`, and `sitemap.xml` are all in place. These all
      point at `https://craft-frame-media.com/` — harmless as placeholders
      now, but won't actually resolve (share previews, sitemap crawling)
      until the domain/email question above is settled and the site is
      deployed there. **Not implemented**: separate URLs per language
      (`hreflang`) — the current EN/PL toggle swaps content client-side on
      one URL, so Google only ever indexes whichever language rendered
      first (English). Proper bilingual SEO needs distinct URLs (e.g.
      `/pl/`) — a real restructuring, flagging for a future pass rather
      than doing it silently here.

## Not needed for v1 (per brief)

- Dedicated `/festivals` and `/corporate` landing pages for paid traffic —
  worth planning for once ad spend starts, not required for this launch.
