import { initI18n } from "./i18n.js?v=20260828e";
import { initNav } from "./nav.js?v=20260828e";
import { initMotion } from "./motion.js?v=20260828e";
import { initPortfolioVideo } from "./video.js?v=20260828e";
import { initHeroGallery } from "./hero-gallery.js?v=20260828e";

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
