import { initI18n } from "./i18n.js?v=20261022a";
import { initNav } from "./nav.js?v=20261022a";
import { initMotion } from "./motion.js?v=20261022a";
import { initPortfolioVideo } from "./video.js?v=20261022a";
import { initHeroGallery } from "./hero-gallery.js?v=20261022a";
import { initConsent } from "./consent.js?v=20261022a";
import { initQuoteForms } from "./quote-form.js?v=20261022a";

function boot() {
  initI18n();
  initNav();
  initMotion();
  initPortfolioVideo();
  initHeroGallery();
  initConsent();
  initQuoteForms();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
