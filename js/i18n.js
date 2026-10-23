/**
 * Language switching means switching pages, not swapping text in place.
 * Every English page has a fully server-rendered Polish twin under /pl/
 * ("/" <-> "/pl/", "/festivals/" <-> "/pl/festivals/", "/corporate/" <->
 * "/pl/corporate/") — that's what makes Polish actually crawlable, instead
 * of only reachable through a client-side toggle no crawler would ever click.
 * This just wires the EN/PL buttons to navigate to the matching URL, and sets
 * aria-pressed to whichever one matches the current page.
 */
export function initI18n() {
  const path = location.pathname.endsWith("/") ? location.pathname : location.pathname + "/";
  const isPlPage = path === "/pl/" || path.startsWith("/pl/");
  // Pages whose Polish twin has its own name (everything else is "/pl" + the English path).
  const PL_NAMES = { "/thanks/": "/pl/dziekujemy/" };
  const EN_NAMES = Object.fromEntries(Object.entries(PL_NAMES).map(([en, pl]) => [pl, en]));
  const enPath = isPlPage ? (EN_NAMES[path] || path.slice(3)) : path;
  const plPath = PL_NAMES[enPath] || "/pl" + enPath;

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const lang = btn.getAttribute("data-lang-btn");
    const isActive = (lang === "pl") === isPlPage;
    btn.setAttribute("aria-pressed", String(isActive));

    btn.addEventListener("click", () => {
      if (isActive) return;
      location.href = lang === "pl" ? plPath : enPath;
    });
  });
}
