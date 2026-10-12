import { initI18n } from "./i18n.js?v=20261012b";
import { initNav } from "./nav.js?v=20261012b";
import { initMotion } from "./motion.js?v=20261012b";
import { initPortfolioVideo } from "./video.js?v=20261012b";
import { initHeroGallery } from "./hero-gallery.js?v=20261012b";

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
