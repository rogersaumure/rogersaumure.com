// nav border on scroll
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 24) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// reveal-on-scroll for everything below the hero
const revealTargets = [
  ...document.querySelectorAll('.section .section-head'),
  ...document.querySelectorAll('.section-about .prose'),
  ...document.querySelectorAll('.section-about .topics'),
  ...document.querySelectorAll('.pub'),
  ...document.querySelectorAll('.pub-group-title'),
  ...document.querySelectorAll('.progress-item'),
  ...document.querySelectorAll('.cv-block'),
  ...document.querySelectorAll('.cv-cta'),
  ...document.querySelectorAll('.contact-text'),
  ...document.querySelectorAll('.contact-card'),
];
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => io.observe(el));

// year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// subtle parallax on the portrait
const portrait = document.querySelector('.portrait-frame');
if (portrait && window.matchMedia('(hover: hover)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    portrait.style.transform = `rotate(${-1.5 + x * 2}deg) translate(${x * 6}px, ${y * 6}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    portrait.style.transform = '';
  });
}
