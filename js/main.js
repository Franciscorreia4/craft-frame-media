import { initI18n } from "./i18n.js?v=20260828d";
import { initNav } from "./nav.js?v=20260828d";
import { initMotion } from "./motion.js?v=20260828d";
import { initPortfolioVideo } from "./video.js?v=20260828d";
import { initHeroGallery } from "./hero-gallery.js?v=20260828d";

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
