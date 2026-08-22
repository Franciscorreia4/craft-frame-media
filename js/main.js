import { initI18n } from "./i18n.js?v=20260822c";
import { initNav } from "./nav.js?v=20260822c";
import { initMotion } from "./motion.js?v=20260822c";
import { initPortfolioVideo } from "./video.js?v=20260822c";
import { initHeroGallery } from "./hero-gallery.js?v=20260822c";

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
