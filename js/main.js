import { initI18n } from "./i18n.js?v=20261023b";
import { initNav } from "./nav.js?v=20261023b";
import { initMotion } from "./motion.js?v=20261023b";
import { initPortfolioVideo } from "./video.js?v=20261023b";
import { initHeroGallery } from "./hero-gallery.js?v=20261023b";
import { initConsent } from "./consent.js?v=20261023b";
import { initQuoteForms } from "./quote-form.js?v=20261023b";

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
