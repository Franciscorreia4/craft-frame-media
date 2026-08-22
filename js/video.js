const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Plays a card's background video only while it's actually in the
 * viewport, and fully releases it the moment it scrolls away — so we're
 * never holding more decode pipelines open than what's currently on
 * screen. Runs the same on mobile as on desktop (by request — loop
 * thumbnails everywhere, not just wide viewports), gated only on
 * prefers-reduced-motion.
 *
 * Videos carry their file in `data-src`, not a real `src`/`<source>`, until
 * the moment they're actually about to play, so a card that's never been
 * scrolled into view never has any video attached — only the `poster`
 * image to show. (Some mobile browsers will substitute the first video
 * frame for the poster the instant any source is attached, even with
 * preload="none" and no play() call — this sidesteps that entirely.)
 *
 * Just as important: once a card scrolls back OUT of view, its `src` is
 * removed again (not just paused). With 12 cards across the page all able
 * to autoplay now, leaving every previously-viewed video's decoder
 * allocated forever is what was silently starving later cards (mostly the
 * corporate ones, being further down the page) of the resources to ever
 * actually start playing.
 */
export function initPortfolioVideo() {
  const videos = document.querySelectorAll(".p-card__video");
  if (!videos.length) return;

  if (!("IntersectionObserver" in window)) return;

  const canAutoplay = () => !prefersReducedMotion();

  function loadVideo(video) {
    if (!video.getAttribute("src") && video.dataset.src) {
      video.setAttribute("src", video.dataset.src);
      video.load();
    }
  }

  function unloadVideo(video) {
    video.pause();
    if (video.getAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && canAutoplay()) {
          loadVideo(video);
          video.play().catch(() => {
            /* Autoplay can be rejected (rare for muted video) — poster
               frame stays visible, click-through still works either way. */
          });
        } else {
          unloadVideo(video);
        }
      });
    },
    { threshold: 0.35 }
  );

  videos.forEach((video) => observer.observe(video));
}
