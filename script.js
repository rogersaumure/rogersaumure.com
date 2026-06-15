/* =========================================================
   Roger Saumure — interaction layer
   Vanilla JS. All motion is progressive enhancement and
   is disabled when the user prefers reduced motion.
   ========================================================= */
(function () {
  "use strict";

  var reduceQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  var prefersReduced = reduceQuery ? reduceQuery.matches : false;

  /* ---- Footer year (keeps copyright current) ------------------------- */
  function setupYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---- Scroll reveal -------------------------------------------------- */
  function setupReveal() {
    var targets = document.querySelectorAll(
      ".hero-left, .hero-right, .section-aside, .section-body"
    );
    if (!targets.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Active section in nav ----------------------------------------- */
  function setupActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.site-nav a[href^="#"]')
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (id) map[id] = a;
    });

    var sections = Object.keys(map)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "page");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Boot ----------------------------------------------------------- */
  function init() {
    setupYear();
    setupReveal();
    setupActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
