/* ============================================================
   Roger Saumure — "The Journal"
   Vanilla JS: mobile nav toggle + auto-close, footer year.
   Abstracts use native <details> (no JS required, fully
   keyboard-operable on their own).
   ============================================================ */
(function () {
  "use strict";

  /* ---- Footer year (keeps copyright current) ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    menu.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  // Close the menu after following an in-page link (mobile).
  menu.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest("a") : null;
    if (link) setOpen(false);
  });

  // Close on Escape for keyboard users, return focus to the toggle.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset state when resizing up to desktop so the menu is never stuck hidden.
  var mq = window.matchMedia("(min-width: 861px)");
  function handleMq() {
    if (mq.matches) setOpen(false);
  }
  if (mq.addEventListener) mq.addEventListener("change", handleMq);
  else if (mq.addListener) mq.addListener(handleMq);
})();
