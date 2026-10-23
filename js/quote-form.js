/**
 * Quote-request form (Netlify Forms) and the thank-you page tracking.
 *
 * The form posts in the background and, on success, sends the visitor to the
 * thank-you page (/thanks/ or /pl/thanks/). That page is the clean "conversion":
 * it fires one Umami event and — if the visitor accepted ad cookies — one
 * Google Ads conversion. Without JavaScript the form still works: it posts
 * normally and Netlify shows the same thank-you page.
 *
 * Nothing the visitor typed is ever sent to analytics — only the event type.
 */
import { trackConversion } from "./consent.js?v=20261023a";

const FLAG = "cfm-quote-sent";
const UTM = ["utm_source", "utm_medium", "utm_campaign"];

/** Remember campaign tags from the landing URL so they survive navigation to another page. */
function rememberCampaign() {
  try {
    const params = new URLSearchParams(location.search);
    UTM.forEach((k) => { if (params.get(k)) sessionStorage.setItem(k, params.get(k).slice(0, 100)); });
  } catch { /* storage unavailable: skip */ }
}
const campaign = (k) => { try { return sessionStorage.getItem(k) || ""; } catch { return ""; } };

function setStatus(form, kind, text) {
  const box = form.querySelector("[data-quote-status]");
  if (!box) return;
  box.textContent = text;
  box.dataset.kind = kind;
  box.hidden = !text;
}

function initForm(form) {
  const pl = document.documentElement.lang === "pl";
  const msg = pl
    ? { sending: "Wysyłanie…", error: "Nie udało się wysłać formularza. Spróbuj ponownie albo napisz na hello@craftframe-media.com.", invalid: "Uzupełnij wymagane pola." }
    : { sending: "Sending…", error: "Couldn't send the form. Please try again or email hello@craftframe-media.com.", invalid: "Please fill in the required fields." };

  const set = (name, value) => { const el = form.elements[name]; if (el) el.value = value; };
  set("page", location.pathname);
  UTM.forEach((k) => set(k, campaign(k)));

  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) { setStatus(form, "error", msg.invalid); return; }
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    setStatus(form, "info", msg.sending);
    const body = new URLSearchParams(new FormData(form)).toString();
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        try { sessionStorage.setItem(FLAG, form.elements["event-type"] ? form.elements["event-type"].value : "unknown"); } catch { /* ignore */ }
        location.href = form.dataset.thanks || "/thanks/";
      })
      .catch(() => {
        if (button) button.disabled = false;
        setStatus(form, "error", msg.error);
      });
  });
}

/** On the thank-you page: count the request once, even if the page is reloaded. */
function trackThanks() {
  if (!document.querySelector("[data-quote-thanks]")) return;
  let type = null;
  try { type = sessionStorage.getItem(FLAG); sessionStorage.removeItem(FLAG); } catch { /* ignore */ }
  if (type === null) return; // direct visit or reload: nothing to count
  if (window.umami && typeof window.umami.track === "function") window.umami.track("quote-request", { type });
  trackConversion();
}

export function initQuoteForms() {
  rememberCampaign();
  document.querySelectorAll("[data-quote-form]").forEach(initForm);
  trackThanks();
}
