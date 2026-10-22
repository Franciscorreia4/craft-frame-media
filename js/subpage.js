/**
 * Boot script for the sub-pages (/festivals/, /corporate/, their /pl/ twins,
 * and the privacy page). Lives in a file rather than an inline <script> so the
 * Content-Security-Policy in _headers (script-src 'self' + two fixed hashes)
 * allows it — an inline module here was being blocked, which silently broke
 * the mobile menu and the portfolio video playback on these pages.
 */
import { initNav } from "./nav.js?v=20261022a";
import { initI18n } from "./i18n.js?v=20261022a";
import { initPortfolioVideo } from "./video.js?v=20261022a";
import { initFilmFacades } from "./yt-facade.js?v=20261022a";
import { initConsent } from "./consent.js?v=20261022a";
import { initQuoteForms } from "./quote-form.js?v=20261022a";

initNav();
initI18n();
initPortfolioVideo();
initFilmFacades();
initConsent();
initQuoteForms();
