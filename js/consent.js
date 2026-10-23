/**
 * Cookie consent + Google Ads tag loader.
 *
 * Site analytics (Umami) is cookie-free and needs no consent. This module only
 * matters for Google Ads measurement, which sets cookies/identifiers and so
 * needs an opt-in in the EU.
 *
 * Design (Google "Consent Mode", basic variant):
 *  - Nothing from Google is requested until the visitor presses Accept.
 *  - "Accept" and "Reject" are equally easy and equally prominent.
 *  - The choice is kept in localStorage; a "Cookie settings" link in the footer
 *    re-opens the banner so consent can be withdrawn as easily as it was given.
 *
 * With GOOGLE_ADS_ID empty it stays dormant (no banner, no Google code).
 * Consent Mode v2: ad_storage, ad_user_data, ad_personalization and
 * analytics_storage are declared "denied" by default and "granted" on Accept.
 * The tag is only ever loaded after Accept, and for returning visitors who
 * already accepted it waits for the page's load event so it can't compete
 * with the hero video for LCP.
 *
 * Preview the banner at any time with ?cookie-preview=1 (loads nothing).
 */
const GOOGLE_ADS_ID = "AW-18532663261";
const CONVERSION_LABEL = "C9okCIfI-qYdEN3_h4VF"; // "Quote request" conversion action

const STORAGE_KEY = "cfm-consent-v1";
const preview = () => new URLSearchParams(location.search).has("cookie-preview");
const active = () => Boolean(GOOGLE_ADS_ID);

const TEXT = {
  en: {
    title: "Cookies for ad measurement",
    body: "This site's own analytics is cookie-free. If you accept, we'll also load Google Ads measurement so we can see whether our ads lead to quote requests. Nothing from Google loads unless you accept.",
    accept: "Accept",
    reject: "Reject",
    more: "Privacy Policy",
    href: "/privacy.html",
    settings: "Cookie settings",
  },
  pl: {
    title: "Pliki cookie do pomiaru reklam",
    body: "Analityka tej strony nie używa plików cookie. Jeśli się zgodzisz, załadujemy też pomiar Google Ads, aby sprawdzać, czy nasze reklamy prowadzą do zapytań o wycenę. Bez Twojej zgody nic od Google się nie ładuje.",
    accept: "Akceptuję",
    reject: "Odrzucam",
    more: "Polityka prywatności",
    href: "/privacy.html",
    settings: "Ustawienia cookie",
  },
};
const lang = () => (document.documentElement.lang === "pl" ? "pl" : "en");

const readChoice = () => {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
};
const saveChoice = (v) => {
  try { localStorage.setItem(STORAGE_KEY, v); } catch { /* private mode: choice lasts for this page only */ }
};

let tagLoaded = false;

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

function loadGoogleTag() {
  if (tagLoaded || !active()) return;
  tagLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied",
  });
  gtag("consent", "update", {
    ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted",
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", GOOGLE_ADS_ID);
}

function clearGoogleCookies() {
  // Best effort: remove the first-party cookies Google's tag may have set.
  const host = location.hostname.split(".").slice(-2).join(".");
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (/^(_gcl_|_gac_|_ga|_gid|IDE|test_cookie)/.test(name)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${host}`;
    }
  });
}

let pendingConversion = false;

function fireConversion() {
  if (!CONVERSION_LABEL) return;
  loadGoogleTag(); // no-op if already loaded; events queue in dataLayer until gtag.js arrives
  gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABEL}` });
}

/**
 * Called once by the thank-you page for a real form submission.
 * Accepted → fire now. No choice yet → hold it and fire if the visitor accepts
 * on this page. Rejected → nothing goes to Google.
 */
export function trackConversion() {
  if (!active()) return;
  const choice = readChoice();
  if (choice === "granted") fireConversion();
  else if (choice === null) pendingConversion = true;
}

function buildBanner() {
  const t = TEXT[lang()];
  const el = document.createElement("div");
  el.className = "consent";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-labelledby", "consent-title");
  el.innerHTML = `
    <div class="consent__text">
      <p class="consent__title" id="consent-title">${t.title}</p>
      <p class="consent__body">${t.body} <a href="${t.href}">${t.more}</a></p>
    </div>
    <div class="consent__actions">
      <button type="button" class="btn btn--outline btn--sm" data-consent="denied">${t.reject}</button>
      <button type="button" class="btn btn--outline btn--sm" data-consent="granted">${t.accept}</button>
    </div>`;
  return el;
}

function showBanner() {
  if (document.querySelector(".consent")) return;
  const banner = buildBanner();
  document.body.appendChild(banner);
  banner.querySelectorAll("[data-consent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = btn.getAttribute("data-consent");
      const before = readChoice();
      banner.remove();
      if (preview() && !active()) return; // preview mode stores nothing
      saveChoice(choice);
      if (choice === "granted") {
        loadGoogleTag();
        if (pendingConversion) { pendingConversion = false; fireConversion(); }
      } else if (before === "granted") {
        clearGoogleCookies();
        location.reload(); // unloads the tag
      }
    });
  });
  banner.querySelector("[data-consent]").focus({ preventScroll: true });
}

function addFooterLink() {
  if (!active()) return;
  const row = document.querySelector(".footer__row:last-child");
  if (!row || row.querySelector("[data-cookie-settings]")) return;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "footer__meta footer__linkbtn";
  b.setAttribute("data-cookie-settings", "");
  b.textContent = TEXT[lang()].settings;
  b.addEventListener("click", showBanner);
  row.insertBefore(b, row.lastElementChild);
}

export function initConsent() {
  if (!active() && !preview()) return;
  if (active()) {
    addFooterLink();
    const choice = readChoice();
    if (choice === "granted") {
      // Already accepted on an earlier visit: load after the page has finished
      // loading so the tag never competes with the page's own content.
      if (document.readyState === "complete") loadGoogleTag();
      else window.addEventListener("load", loadGoogleTag, { once: true });
    } else if (choice !== "denied") showBanner();
  } else {
    showBanner(); // ?cookie-preview=1 — look only, nothing is stored or loaded
  }
}
