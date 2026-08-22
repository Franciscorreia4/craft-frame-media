const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Hero background gallery — real footage cycling behind the hero copy.
 * Each slide loops on its own (native `loop` attribute); the visitor
 * advances manually via the next-arrow or a dot. Only the active slide
 * ever has a real `src` — others carry their file in `data-src` and are
 * only wired up (and fully released again) as they're switched to/away
 * from, so the browser never has more than one decode pipeline going at
 * once regardless of how many slides exist.
 */
export function initHeroGallery() {
  const gallery = document.getElementById("hero-gallery");
  const nextBtn = document.getElementById("hero-next");
  const dots = [...document.querySelectorAll(".hero__dot")];
  if (!gallery) return;

  const slides = [...gallery.querySelectorAll(".hero__slide")];
  if (!slides.length) return;

  let current = 0;

  function loadSlide(video) {
    if (!video.getAttribute("src") && video.dataset.src) {
      video.setAttribute("src", video.dataset.src);
      video.load();
    }
  }

  function unloadSlide(video) {
    video.pause();
    if (video.dataset.src) {
      // Only slides that came in via data-src get fully released — the
      // very first slide keeps its eager src so it never has to reload
      // if the visitor cycles back around to it quickly.
      video.removeAttribute("src");
      video.load();
    }
  }

  function showSlide(index) {
    const previous = slides[current];
    current = index;

    slides.forEach((video, i) => {
      const isActive = i === index;
      video.classList.toggle("is-active", isActive);
      if (isActive) {
        loadSlide(video);
        if (!prefersReducedMotion()) {
          video.play().catch(() => {
            /* Autoplay can be rejected in rare cases — poster frame still shows. */
          });
        }
      } else if (video === previous) {
        unloadSlide(video);
      }
    });

    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  }

  nextBtn?.addEventListener("click", () => {
    showSlide((current + 1) % slides.length);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });

  // Pause the active slide while the hero is scrolled out of view.
  const heroSection = document.getElementById("top");
  if ("IntersectionObserver" in window && heroSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReducedMotion()) {
              slides[current].play().catch(() => {});
            }
          } else {
            slides[current].pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(heroSection);
  }

  showSlide(0);
}
