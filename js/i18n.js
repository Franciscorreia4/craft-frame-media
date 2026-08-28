/**
 * Language switching means switching pages, not swapping text in place.
 * "/" and "/pl/" are two separate, fully server-rendered pages (see
 * pl/index.html) — that's what makes Polish actually crawlable, instead of
 * only reachable through a client-side toggle no crawler would ever click.
 * This just wires the existing EN/PL buttons to navigate to the right URL,
 * and sets aria-pressed to whichever one matches the current page.
 */
export function initI18n() {
  const isPlPage = location.pathname === "/pl/" || location.pathname === "/pl";

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const lang = btn.getAttribute("data-lang-btn");
    const isActive = (lang === "pl") === isPlPage;
    btn.setAttribute("aria-pressed", String(isActive));

    btn.addEventListener("click", () => {
      if (isActive) return;
      location.href = lang === "pl" ? "/pl/" : "/";
    });
  });
}
