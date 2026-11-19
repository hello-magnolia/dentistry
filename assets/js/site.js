/* Tracy Center for Dentistry: small, dependency-free behaviours. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  /* Header, hero drift and scroll-linked motion */
  const header = $('[data-header]');
  const hero = $('.hero');
  const bust = $('[data-bust]');
  const drifters = $$('[data-drift]');
  const dock = $('[data-dock]');
  let ticking = false;

  function onFrame() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    header.classList.toggle('is-solid', y > 24);
    if (dock) dock.classList.toggle('is-shown', y > 420 && !document.body.classList.contains('is-locked'));

    if (!reduceMotion) {
      if (bust && y < hero.offsetHeight) {
        bust.style.setProperty('--p', clamp(y / hero.offsetHeight, 0, 1).toFixed(4));
      }
      drifters.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        el.style.setProperty('--p', (p * 2 - 1).toFixed(4));
      });
      shiftTourFrames();
    }
  }
  function requestFrame() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onFrame);
    }
  }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);

  /* Mobile menu */
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    requestFrame();
  }
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  /* Reveal on scroll */
  const revealables = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  /* Open-now status, in the office's own time zone */
  // day: [opens, closes, phonesOnly]
  const HOURS = { 1: [10, 19, true], 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19], 6: [10, 15] };
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hourLabel = (h) => (h > 12 ? `${h - 12} pm` : h === 12 ? '12 pm' : `${h} am`);

  function officeNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    return { day: DAY_NAMES.indexOf(get('weekday')), time: Number(get('hour')) + Number(get('minute')) / 60 };
  }

  function describeStatus({ day, time }) {
    const today = HOURS[day];
    if (today && time >= today[0] && time < today[1]) {
      return today[2]
        ? { open: true, text: `Phones are open until ${hourLabel(today[1])}. Appointments Tuesday to Saturday.` }
        : { open: true, text: `Open now until ${hourLabel(today[1])}` };
    }
    if (today && time < today[0]) {
      return { open: false, text: `${today[2] ? 'Phones open' : 'Opens'} today at ${hourLabel(today[0])}` };
    }
    for (let i = 1; i <= 7; i += 1) {
      const next = (day + i) % 7;
      if (HOURS[next]) {
        const when = i === 1 ? 'tomorrow' : DAY_NAMES[next];
        return { open: false, text: `Closed now. ${HOURS[next][2] ? 'Phones open' : 'Opens'} ${when} at ${hourLabel(HOURS[next][0])}.` };
      }
    }
    return null;
  }

  function updateStatus() {
    let now;
    try { now = officeNow(); } catch (err) { return; }
    const status = describeStatus(now);
    const el = $('[data-status]');
    if (status && el) {
      $('[data-status-text]', el).textContent = status.text;
      el.classList.toggle('is-open', status.open);
    }
    $$('.hours tr').forEach((row) => row.classList.toggle('is-today', Number(row.dataset.day) === now.day));
  }
  updateStatus();
  window.setInterval(updateStatus, 60 * 1000);

  /* Office tour: buttons, counter, drag to scroll, and a slight inner shift */
  const track = $('[data-tour]');
  const tourItems = track ? $$('.tour__item', track) : [];
  const tourControls = $('[data-tour-controls]');

  function shiftTourFrames() {
    if (!track) return;
    const mid = window.innerWidth / 2;
    tourItems.forEach((item) => {
      const r = item.getBoundingClientRect();
      if (r.right < -200 || r.left > window.innerWidth + 200) return;
      const offset = clamp((r.left + r.width / 2 - mid) / window.innerWidth, -1, 1);
      item.style.setProperty('--shift', `${(offset * -3.4).toFixed(2)}%`);
    });
  }

  if (track && tourControls) {
    const prev = $('[data-tour-prev]');
    const next = $('[data-tour-next]');
    const current = $('[data-tour-current]');
    $('[data-tour-total]').textContent = String(tourItems.length);
    tourControls.hidden = false;

    const step = () => tourItems[1].offsetLeft - tourItems[0].offsetLeft;
    const indexNow = () => clamp(Math.round(track.scrollLeft / step()), 0, tourItems.length - 1);
    const goTo = (i) => track.scrollTo({ left: clamp(i, 0, tourItems.length - 1) * step(), behavior: reduceMotion ? 'auto' : 'smooth' });

    const sync = () => {
      const i = indexNow();
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
      current.textContent = String(atEnd ? tourItems.length : i + 1);
      prev.disabled = track.scrollLeft < 4;
      next.disabled = atEnd;
      if (!reduceMotion) shiftTourFrames();
    };
    prev.addEventListener('click', () => goTo(indexNow() - 1));
    next.addEventListener('click', () => goTo(indexNow() + 1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(sync), { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(indexNow() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(indexNow() - 1); }
    });

    // Mouse drag. Touch and trackpads already scroll natively.
    let drag = null;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        track.classList.add('is-dragging');
      }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (moved) {
        const target = indexNow();
        track.classList.remove('is-dragging');
        goTo(target);
      }
    });
    track.style.cursor = 'grab';
    sync();
  }

  /* Review shelf */
  const shelf = $('[data-reviews]');
  const shelfNav = $('[data-reviews-nav]');
  if (shelf && shelfNav) {
    const cols = $$('.reviews__col', shelf);
    const prev = $('[data-reviews-prev]');
    const next = $('[data-reviews-next]');
    const step = () => (cols.length > 1 ? cols[1].offsetLeft - cols[0].offsetLeft : shelf.clientWidth);
    const move = (dir) => shelf.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    const sync = () => {
      const atEnd = shelf.scrollLeft >= shelf.scrollWidth - shelf.clientWidth - 4;
      prev.disabled = shelf.scrollLeft < 4;
      next.disabled = atEnd;
      shelf.classList.toggle('is-end', atEnd);
      shelfNav.hidden = shelf.scrollWidth <= shelf.clientWidth + 4;
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    shelf.addEventListener('scroll', () => window.requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync);
    shelf.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    });

    // Mouse drag. Touch and trackpads already scroll natively.
    let pull = null;
    shelf.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pull = { x: e.clientX, left: shelf.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', (e) => {
      if (!pull) return;
      const dx = e.clientX - pull.x;
      if (!pull.moved && Math.abs(dx) > 4) {
        pull.moved = true;
        shelf.classList.add('is-dragging');
      }
      if (pull.moved) shelf.scrollLeft = pull.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!pull) return;
      const moved = pull.moved;
      pull = null;
      if (moved) window.setTimeout(() => shelf.classList.remove('is-dragging'), 0);
    });
    sync();
  }

  /* Highlight the section you are in */
  const navLinks = $$('.nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (link && entry.isIntersecting) {
          navLinks.forEach((a) => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    const top = document.getElementById('top');
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) navLinks.forEach((a) => a.removeAttribute('aria-current'));
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(top);
  }

  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  onFrame();
})();
