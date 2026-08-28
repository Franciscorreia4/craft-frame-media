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
 *
 * Poster images carry their file in `data-poster` the same way, rather
 * than an eager `poster` attribute — with 12+ cards across the page that
 * was ~600-900KB of images fetched immediately on load regardless of
 * scroll depth. They're loaded by a separate, much-earlier-firing observer
 * (rootMargin: 600px) than the one that starts actual video playback, so a
 * poster is already in place well before a card's leading edge reaches the
 * viewport — a visitor scrolling at a normal pace should never see an
 * empty card. reduced-motion visitors, who never get a video loaded at
 * all, still get this same poster as their permanent fallback image.
 */
export function initPortfolioVideo() {
  const videos = document.querySelectorAll(".p-card__video");
  if (!videos.length) return;

  if (!("IntersectionObserver" in window)) return;

  const canAutoplay = () => !prefersReducedMotion();

  function loadPoster(video) {
    if (!video.getAttribute("poster") && video.dataset.poster) {
      video.setAttribute("poster", video.dataset.poster);
    }
  }

  function loadVideo(video) {
    loadPoster(video);
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

  const posterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadPoster(entry.target);
          posterObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "600px 0px" }
  );

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

  videos.forEach((video) => {
    posterObserver.observe(video);
    observer.observe(video);
  });
}
