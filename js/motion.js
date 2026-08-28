const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll reveals, driven entirely by GSAP. Markup/CSS render every element in
 * its final, visible state by default — gsap.from() only *sets* a hidden
 * starting point right before animating in. If the GSAP CDN fails to load,
 * this function simply never runs and nothing is ever hidden.
 */
function initScrollReveals() {
  if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion()) return;

  gsap.registerPlugin(ScrollTrigger);

  const revealGroups = [
    ".section__head",
    ".about__grid",
    ".hero__stats .stat",
    ".service-col",
    ".portfolio-grid .p-card",
    ".trusted__grid > div",
    ".contact-list li",
  ];

  revealGroups.forEach((selector) => {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;

    // Group elements by nearest section so each section triggers its own
    // reveal once, instead of one ScrollTrigger per element.
    const bySection = new Map();
    els.forEach((el) => {
      const section = el.closest("section") || document.body;
      if (!bySection.has(section)) bySection.set(section, []);
      bySection.get(section).push(el);
    });

    bySection.forEach((group) => {
      gsap.from(group, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: Math.min(0.08, 0.5 / group.length),
        scrollTrigger: {
          trigger: group[0],
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });
  });
}

/**
 * Cinematic timecode readout in the hero corner — a small nod to the "Frame"
 * in the brand name. Purely decorative/ambient, so it's skipped entirely
 * under reduced motion (the counter freezes at 00:00:00:00).
 */
function initTimecode() {
  const el = document.getElementById("timecode");
  if (!el || prefersReducedMotion()) return;

  const fps = 25;
  const start = performance.now();
  let raf = null;
  // Two independent gates — the loop only runs while both are true. Tab
  // visibility was the original gate; hero-in-viewport is added so the rAF
  // loop also stops the instant this purely-decorative readout scrolls off
  // screen, instead of ticking away in the background for the rest of the
  // page (portfolio grid, contact, etc.) where it's never seen.
  let tabVisible = !document.hidden;
  let heroVisible = true;

  const pad = (n) => String(n).padStart(2, "0");

  const tick = (now) => {
    const elapsedMs = now - start;
    const totalFrames = Math.floor((elapsedMs / 1000) * fps);
    const hh = Math.floor(totalFrames / (fps * 3600));
    const mm = Math.floor((totalFrames / (fps * 60)) % 60);
    const ss = Math.floor((totalFrames / fps) % 60);
    const ff = totalFrames % fps;
    el.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
    raf = requestAnimationFrame(tick);
  };

  const sync = () => {
    const shouldRun = tabVisible && heroVisible;
    if (shouldRun && raf === null) {
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };

  sync();

  document.addEventListener("visibilitychange", () => {
    tabVisible = !document.hidden;
    sync();
  });

  const heroSection = document.getElementById("top");
  if (heroSection && "IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        heroVisible = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { threshold: 0 }
    ).observe(heroSection);
  }
}

function initLoadedFade() {
  const mark = () => document.documentElement.classList.add("is-loaded");
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(mark).catch(mark);
    // Safety net in case font loading stalls.
    setTimeout(mark, 800);
  } else {
    mark();
  }
}

export function initMotion() {
  initLoadedFade();
  initTimecode();
  initScrollReveals();
}
