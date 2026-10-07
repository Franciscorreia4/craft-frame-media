import { initI18n } from "./i18n.js?v=20261007a";
import { initNav } from "./nav.js?v=20261007a";
import { initMotion } from "./motion.js?v=20261007a";
import { initPortfolioVideo } from "./video.js?v=20261007a";
import { initHeroGallery } from "./hero-gallery.js?v=20261007a";

function boot() {
  initI18n();
  initNav();
  initMotion();
  initPortfolioVideo();
  initHeroGallery();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
