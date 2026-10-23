import { initI18n } from "./i18n.js?v=20261023a";
import { initNav } from "./nav.js?v=20261023a";
import { initMotion } from "./motion.js?v=20261023a";
import { initPortfolioVideo } from "./video.js?v=20261023a";
import { initHeroGallery } from "./hero-gallery.js?v=20261023a";
import { initConsent } from "./consent.js?v=20261023a";
import { initQuoteForms } from "./quote-form.js?v=20261023a";

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
