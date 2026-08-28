import { dictionaries } from "./i18n-data.js?v=20260828a";

const STORAGE_KEY = "cfm-lang";
const DEFAULT_LANG = "en";

function getStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "pl" ? stored : null;
  } catch (err) {
    return null;
  }
}

function storeLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (err) {
    /* ignore (private browsing / storage disabled) */
  }
}

function applyLang(lang) {
  const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] == null) return;
    if (el.tagName === "META") {
      el.setAttribute("content", dict[key]);
    } else if (el.tagName === "TITLE") {
      el.textContent = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] == null) return;
    el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang-btn") === lang;
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

export function initI18n() {
  const lang = getStoredLang() || DEFAULT_LANG;
  applyLang(lang);

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-lang-btn");
      applyLang(next);
      storeLang(next);
    });
  });
}
