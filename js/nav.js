export function initNav() {
  const nav = document.getElementById("site-nav");
  const menu = document.getElementById("mobile-menu");
  const openBtn = document.getElementById("burger-open");
  const closeBtn = document.getElementById("burger-close");

  // Sticky nav hairline + solid background once scrolled past the hero top.
  if (nav) {
    const onScroll = () => {
      nav.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (!menu || !openBtn || !closeBtn) return;

  let lastFocused = null;

  const openMenu = () => {
    lastFocused = document.activeElement;
    menu.setAttribute("data-open", "true");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  };

  const closeMenu = () => {
    menu.setAttribute("data-open", "false");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = menu.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
}
