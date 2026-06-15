/* =========================================================
   Roger Saumure — "Midnight" (polished)
   Vanilla JS:
   - sticky nav state change on scroll (over dark hero vs. light)
   - mobile nav toggle + auto-close + focus management
   - scroll-reveal via IntersectionObserver (gated by reduced-motion)
   - footer year kept current
   ========================================================= */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var hero = document.querySelector(".hero");

  var reducedMQ = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  function prefersReduced() { return !!(reducedMQ && reducedMQ.matches); }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Sticky nav: switch style when past the hero ---------- */
  function updateNavState() {
    if (!nav) { return; }
    var threshold = hero ? hero.offsetHeight - 90 : 120;
    var scrolled = window.scrollY > threshold;
    nav.setAttribute("data-state", scrolled ? "scrolled" : "top");
  }

  /* throttle scroll with rAF */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateNavState();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateNavState);
  updateNavState();

  /* ---------- Mobile nav toggle ---------- */
  function closeMenu(restoreFocus) {
    if (!menu || !toggle) { return; }
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    if (restoreFocus) { toggle.focus(); }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });

    /* close on link click (single-page anchors) */
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { closeMenu(false); }
    });

    /* close on Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    /* close when resizing up to desktop so a hidden-but-open menu can't trap state */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720 && menu.classList.contains("is-open")) {
        closeMenu(false);
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced() || !("IntersectionObserver" in window)) {
    /* show everything immediately */
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    });

    Array.prototype.forEach.call(revealEls, function (el) {
      observer.observe(el);
    });
  }
})();
