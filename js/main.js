import { initI18n } from "./i18n.js?v=20260928a";
import { initNav } from "./nav.js?v=20260928a";
import { initMotion } from "./motion.js?v=20260928a";
import { initPortfolioVideo } from "./video.js?v=20260928a";
import { initHeroGallery } from "./hero-gallery.js?v=20260928a";

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
