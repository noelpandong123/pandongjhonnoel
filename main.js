/* ════════ main.js ════════ */

/* ── CURSOR — INSTANT NO-DELAY ───────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
}, { passive: true });

(function lerpRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a, button, .project-card, .edu-card, .ach-card, .skill-card, .exp-card, .cf-block').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.classList.add('hovered');
    dot.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    ring.classList.remove('hovered');
    dot.classList.remove('hovered');
  });
});


/* ── FADE-UP ──────────────────────────────────────── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

// Stagger hero children
document.querySelectorAll('.hero-left .fade-up').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.08) + 's';
});


/* ── NAVBAR ───────────────────────────────────────── */
const nav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => secObs.observe(s));

// Close mobile nav on link click
navLinks.forEach(l => {
  l.addEventListener('click', () => {
    const m = document.getElementById('navMenu');
    if (m.classList.contains('show')) bootstrap.Collapse.getInstance(m)?.hide();
  });
});

// Hamburger animation
const toggler = document.querySelector('.navbar-toggler');
const spans   = document.querySelectorAll('.hamburger span');
toggler.addEventListener('click', () => {
  const open = !document.getElementById('navMenu').classList.contains('show');
  if (open) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});


/* ── CAROUSEL FACTORY ────────────────────────────── */
function makeCarousel({ trackId, prevId, nextId, dotsId, counterId, slidesPerView, gap = 24 }) {
  const track   = document.getElementById(trackId);
  const dotsWrap= document.getElementById(dotsId);
  const counter = document.getElementById(counterId);
  if (!track) return;

  const slides  = Array.from(track.children);
  const total   = slides.length;
  let   current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'csl-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function getPerView() {
    if (slidesPerView) return slidesPerView;
    if (window.innerWidth <= 576)  return 1;
    if (window.innerWidth <= 991)  return 2;
    return 3;
  }

  function goTo(idx) {
    const perView = getPerView();
    const max     = Math.max(0, total - perView);
    current       = Math.max(0, Math.min(idx, max));

    const slideW  = slides[0].offsetWidth + gap;
    track.style.transform = `translateX(-${current * slideW}px)`;

    // Update dots
    dotsWrap.querySelectorAll('.csl-dot').forEach((d, i) => d.classList.toggle('active', i === current));

    // Update counter
    if (counter) counter.textContent = (current + 1) + ' / ' + total;
  }

  document.getElementById(prevId)?.addEventListener('click', () => goTo(current - 1));
  document.getElementById(nextId)?.addEventListener('click', () => goTo(current + 1));

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(current), { passive: true });

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  goTo(0);
}

// Projects carousel — 3-up
makeCarousel({
  trackId:   'projectsTrack',
  prevId:    'projectsPrev',
  nextId:    'projectsNext',
  dotsId:    'projectsDots',
  counterId: 'projectsCounter',
});

// Experience carousel — 1-up (full width)
makeCarousel({
  trackId:      'expTrack',
  prevId:       'expPrev',
  nextId:       'expNext',
  dotsId:       'expDots',
  counterId:    'expCounter',
  slidesPerView: 1,
});


/* ── SKILL BARS ──────────────────────────────────── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = (bar.getAttribute('data-w') || '0') + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('#skills .row').forEach(r => skillObs.observe(r));


/* ── MAGNETIC BUTTONS ────────────────────────────── */
document.querySelectorAll('.btn-primary-custom, .btn-outline-custom').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.25;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});