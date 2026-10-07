/**
 * Click-to-play YouTube facades for the "Full films" sections.
 *
 * Each film is a plain link to the YouTube watch page wrapping a self-hosted
 * thumbnail, so it works (and is crawlable) without JavaScript. With JS, a
 * click swaps the link for the real player — loaded from youtube-nocookie.com
 * only at that moment, so a page visit never pays for (or sends any request
 * to) YouTube. Modified clicks (new tab, etc.) keep their normal behaviour.
 */
export function initFilmFacades() {
  document.querySelectorAll("[data-yt-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();

      const id = link.dataset.ytId;
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
      frame.title = link.dataset.ytTitle || "Video";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.referrerPolicy = "strict-origin-when-cross-origin";

      const player = document.createElement("div");
      player.className = "film__player film__player--live";
      player.appendChild(frame);
      link.replaceWith(player);
      frame.focus();

      if (window.umami && typeof window.umami.track === "function") {
        window.umami.track("video-play", { video: link.dataset.ytSlug || id });
      }
    });
  });
}
