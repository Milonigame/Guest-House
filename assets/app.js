/* Холодная речка — интерактив без библиотек */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const root = document.documentElement;
  const body = document.body;
  const PHONE = '79281536032';
  const TG = 'Tanya_Tkachenko_0521';
  let vw = innerWidth, vh = innerHeight, sy = scrollY;

  const plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  };
  const money = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');

  /* ================= preloader ================= */
  const pre = $('.preloader');
  const countEl = pre && $('[data-count]', pre);
  let loaded = false;
  const t0 = performance.now();
  if (pre) {
    let seen = false;
    try { seen = sessionStorage.getItem('hr-seen') === '1'; sessionStorage.setItem('hr-seen', '1'); } catch (e) { /* storage blocked */ }
    if (reduced || seen) { pre.remove(); root.classList.add('ready'); }
    else {
      body.classList.add('is-loading');
      const poster = new Image();
      poster.src = 'assets/video/hero-poster.webp';
      Promise.race([
        Promise.all([
          new Promise(r => (poster.complete ? r() : (poster.onload = poster.onerror = r))),
          document.fonts ? document.fonts.ready : Promise.resolve(),
        ]),
        new Promise(r => setTimeout(r, 2200)),
      ]).then(() => (loaded = true));
      const tick = () => {
        const el = performance.now() - t0;
        const target = loaded ? 100 : Math.min(94, el / 14);
        const cur = +countEl.textContent;
        const next = Math.min(100, Math.ceil(lerp(cur, target, loaded ? .3 : .12)));
        countEl.textContent = next;
        if (next >= 100 && el > 800) {
          pre.classList.add('done');
          body.classList.remove('is-loading');
          setTimeout(() => root.classList.add('ready'), 280);
          setTimeout(() => pre.remove(), 1400);
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ================= hero title split ================= */
  const title = $('[data-split]');
  if (title) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part;
            s.style.setProperty('--d', (.12 + i++ * .09).toFixed(2) + 's');
            w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(title);
  }
  $$('[data-hero-in]').forEach((el, k) => el.style.setProperty('--d', (.55 + k * .12).toFixed(2) + 's'));

  /* ================= header, menu ================= */
  const header = $('[data-header]');
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  const setMenu = open => {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });

  /* ================= day clock ================= */
  const timed = $$('[data-time]').map(el => {
    const [h, m] = el.dataset.time.split(':').map(Number);
    return { el, min: h * 60 + m };
  });
  const clockEl = $('[data-clock]');
  const sunEl = $('[data-sun]');
  const dayclock = $('.dayclock');
  const navLinks = $$('.nav a');
  let lastClock = '';
  function updateClock() {
    const y = sy + vh * .45;
    let idx = 0;
    for (let k = 0; k < timed.length; k++) if (timed[k].top <= y) idx = k;
    const cur = timed[idx], nxt = timed[idx + 1];
    const p = clamp((y - cur.top) / Math.max(1, cur.h), 0, 1);
    const mins = lerp(cur.min, nxt ? nxt.min : cur.min + 90, p);
    const rounded = Math.round(mins / 5) * 5;
    const hh = String(Math.floor(rounded / 60) % 24).padStart(2, '0');
    const mm = String(rounded % 60).padStart(2, '0');
    const label = hh + ':' + mm;
    if (label !== lastClock) {
      lastClock = label; clockEl.textContent = label;
      const h = mins / 60;
      const moon = h >= 19.5;
      dayclock.classList.toggle('moon', moon);
      const t = moon ? clamp((h - 19.5) / 5, 0, 1) * .5 + .1 : clamp((h - 6) / 13.5, 0, 1);
      sunEl.setAttribute('cx', (24 - 21 * Math.cos(Math.PI * t)).toFixed(1));
      sunEl.setAttribute('cy', (23 - 21 * Math.sin(Math.PI * t)).toFixed(1));
    }
    const id = cur.el.id;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  }

  /* ================= reveal ================= */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ================= videos ================= */
  const heroVideo = $('[data-hero-video]');
  if (heroVideo && (reduced || saveData)) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); heroVideo.preload = 'none'; }
  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (reduced || saveData) return;
        if (!v.dataset.loaded) {
          $$('source[data-src]', v).forEach(s => (s.src = s.dataset.src));
          v.dataset.loaded = 1; v.load();
        }
        if (v.dataset.once && v.ended) return;
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, { rootMargin: '250px 0px' });
  $$('[data-lazy-video]').forEach(v => vio.observe(v));
  if (heroVideo && !reduced && !saveData) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); } else heroVideo.pause();
    }).observe(heroVideo);
  }

  /* ================= count-up ================= */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.countup;
      if (reduced) { el.textContent = to; return; }
      const start = performance.now(), dur = 1400 + to * 25;
      const step = now => {
        const t = clamp((now - start) / dur, 0, 1);
        el.textContent = Math.round(to * (1 - Math.pow(2, -10 * t)));
        if (t < 1) requestAnimationFrame(step); else el.textContent = to;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .6 });
  $$('[data-countup]').forEach(el => cio.observe(el));

  /* ================= rooms gallery ================= */
  const SLIDES = [
    { name: 'room-1', tag: 'Номер', alt: 'Номер с двуспальной и односпальной кроватями', cap: 'Двуспальная и отдельная кровати — места для троих', spots: [
      { x: 38, y: 72, t: 'Двуспальная кровать', d: 'Для двоих — с запасом места' },
      { x: 62, y: 44, t: 'Отдельная кровать', d: 'У третьего гостя — своё место' } ] },
    { name: 'room-4', tag: 'Балкон', alt: 'Светлый номер с выходом на балкон', cap: 'Номер с выходом на балкон: кондиционер, телевизор, столик', spots: [
      { x: 40, y: 34, t: 'Балкон', d: 'Выход на свой балкон с видом на море' },
      { x: 7, y: 19, t: 'Телевизор', d: 'Есть в каждом номере', c: 'right below' },
      { x: 88, y: 7, t: 'Кондиционер', d: 'Прохладно даже в разгар лета', c: 'left below' },
      { x: 74, y: 76, t: 'Полотенца', d: 'Чистое бельё и полотенца к заезду', c: 'left' } ] },
    { name: 'room-2', tag: 'Шкаф и ТВ', alt: 'Шкаф, телевизор и тумба в номере', cap: 'Шкаф для одежды, телевизор и тумба с полками', spots: [
      { x: 43, y: 14, t: 'Телевизор', d: 'На стене, видно с кровати', c: 'below' },
      { x: 56, y: 42, t: 'Шкаф', d: 'Вместительный шкаф для одежды', c: 'left' },
      { x: 32, y: 68, t: 'Тумба с полками', d: 'Для мелочей и зарядок', c: 'right' } ] },
    { name: 'bath', tag: 'Санузел', alt: 'Санузел с душем в номере', cap: 'Свой санузел с душем и феном — в номере', spots: [
      { x: 57, y: 42, t: 'Душ', d: 'Санузел с душем и феном — в номере', c: 'below' },
      { x: 84, y: 72, t: 'Свой санузел', d: 'Не нужно делить с соседями', c: 'left' } ] },
    { name: 'view', tag: 'Вид', alt: 'Вид с балкона на море и пальму', cap: 'Вид с балкона номера: море и пальма', spots: [
      { x: 37, y: 40, t: 'Это вид с балкона', d: 'Море, пальма и горизонт — с утра до заката' } ] },
  ];
  const gal = $('[data-gallery]');
  if (gal) {
    const slidesEl = $('[data-slides]', gal), spotsEl = $('[data-spots]', gal), thumbsEl = $('[data-thumbs]', gal);
    const curEl = $('[data-g-cur]', gal);
    const capEl = $('[data-g-cap]');
    $('[data-g-total]', gal).textContent = String(SLIDES.length).padStart(2, '0');
    const src = (n, w) => `assets/img/${n}-${w}.webp`;
    const imgs = SLIDES.map((s, k) => {
      const im = new Image();
      im.src = src(s.name, 720);
      im.srcset = `${src(s.name, 720)} 720w, ${src(s.name, 1184)} 1184w`;
      im.sizes = '(max-width: 980px) 92vw, 52vw';
      im.alt = s.alt; im.decoding = 'async';
      if (k) im.loading = 'lazy';
      slidesEl.append(im); return im;
    });
    const thumbs = SLIDES.map((s, k) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Фото ' + (k + 1) + ': ' + s.alt);
      b.innerHTML = `<img src="${src(s.name, 720)}" alt="" loading="lazy"><span>${s.tag}</span>`;
      b.addEventListener('click', () => { go(k); restart(); });
      thumbsEl.append(b); return b;
    });
    let cur = -1, timer = 0, hover = false, inView = false;
    const DUR = 6500;
    thumbsEl.style.setProperty('--dur', DUR + 'ms');
    function renderSpots(s) {
      spotsEl.innerHTML = '';
      s.spots.forEach((p, k) => {
        const b = document.createElement('button');
        b.className = 'spot ' + (p.c || '');
        b.style.setProperty('--x', p.x + '%'); b.style.setProperty('--y', p.y + '%');
        b.style.setProperty('--sd', (.35 + k * .12) + 's');
        b.setAttribute('aria-label', p.t);
        b.innerHTML = `<span class="spot__tip"><b>${p.t}</b>${p.d}</span>`;
        b.addEventListener('click', e => {
          e.stopPropagation();
          const was = b.classList.contains('open');
          $$('.spot', spotsEl).forEach(x => x.classList.remove('open'));
          if (!was) b.classList.add('open');
          clearTimeout(timer);
        });
        spotsEl.append(b);
        requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('show')));
      });
    }
    function go(k) {
      k = (k + SLIDES.length) % SLIDES.length;
      if (k === cur) return;
      imgs.forEach((im, j) => im.classList.toggle('on', j === k));
      const im = imgs[k];
      im.classList.remove('kb');
      requestAnimationFrame(() => requestAnimationFrame(() => im.classList.add('kb')));
      thumbs.forEach((t, j) => { t.classList.remove('on'); if (j === k) { void t.offsetWidth; t.classList.add('on'); } });
      curEl.textContent = String(k + 1).padStart(2, '0');
      cur = k; renderSpots(SLIDES[k]);
      if (capEl) capEl.innerHTML = '<b>' + String(k + 1).padStart(2, '0') + '</b>' + SLIDES[k].cap;
    }
    function restart() {
      clearTimeout(timer);
      if (!inView || hover || reduced) return;
      timer = setTimeout(() => { go(cur + 1); restart(); }, DUR);
    }
    go(0);
    $('[data-g-prev]', gal).addEventListener('click', e => { e.stopPropagation(); go(cur - 1); restart(); });
    $('[data-g-next]', gal).addEventListener('click', e => { e.stopPropagation(); go(cur + 1); restart(); });
    const frame = $('.gallery__frame', gal);
    frame.addEventListener('mouseenter', () => { hover = true; clearTimeout(timer); thumbs[cur].style.animationPlayState = 'paused'; });
    frame.addEventListener('mouseleave', () => { hover = false; restart(); });
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; restart(); }, { threshold: .4 }).observe(frame);
    // swipe
    let x0 = null, y0 = 0, moved = false;
    frame.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; moved = false; });
    frame.addEventListener('pointermove', e => { if (x0 !== null && Math.abs(e.clientX - x0) > 8) moved = true; });
    frame.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { go(cur + (dx < 0 ? 1 : -1)); restart(); }
    });
    frame.addEventListener('click', e => {
      if (moved || e.target.closest('button')) return;
      openLightbox(cur);
    });

    /* lightbox */
    const lb = $('[data-lightbox]'), lbImg = $('[data-lb-img]'), lbCap = $('[data-lb-cap]');
    let li = 0, lastFocus = null;
    const show = k => {
      li = (k + SLIDES.length) % SLIDES.length;
      lbImg.style.opacity = 0;
      const n = new Image(); n.src = src(SLIDES[li].name, 1184);
      n.onload = () => { lbImg.src = n.src; lbImg.alt = SLIDES[li].alt; lbImg.style.opacity = 1; };
      lbCap.textContent = SLIDES[li].alt + ' · ' + (li + 1) + ' / ' + SLIDES.length;
    };
    function openLightbox(k) {
      lastFocus = document.activeElement;
      lb.hidden = false; requestAnimationFrame(() => lb.classList.add('open'));
      body.style.overflow = 'hidden'; show(k); clearTimeout(timer);
      $('[data-lb-close]', lb).focus();
    }
    const closeLb = () => {
      lb.classList.remove('open'); body.style.overflow = '';
      setTimeout(() => (lb.hidden = true), 300); restart();
      if (lastFocus) lastFocus.focus();
    };
    $('[data-lb-close]', lb).addEventListener('click', closeLb);
    $('[data-lb-prev]', lb).addEventListener('click', () => show(li - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(li + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(li - 1);
      if (e.key === 'ArrowRight') show(li + 1);
    });
    let lx = null;
    lb.addEventListener('pointerdown', e => (lx = e.clientX));
    lb.addEventListener('pointerup', e => { if (lx === null) return; const d = e.clientX - lx; lx = null; if (Math.abs(d) > 50) show(li + (d < 0 ? 1 : -1)); });
  }

  /* ================= tilt + magnetic + cursor ================= */
  if (fine && !reduced) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .15s ease-out, box-shadow .4s';
        el.style.transform = `perspective(1000px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), box-shadow .4s'; el.style.transform = ''; });
    });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${dx * .22}px, ${dy * .3}px)`;
      });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
    // cursor
    const cur = $('[data-cursor-el]'), lab = $('[data-cursor-label]');
    root.classList.add('has-cursor');
    let moved = false;
    let cx = vw / 2, cy = vh / 2, tx = cx, ty = cy;
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!moved) { moved = true; cx = tx; cy = ty; }
      const t = e.target;
      const labelEl = t.closest && t.closest('[data-cursor]');
      const onSpot = t.closest && t.closest('.spot, .gallery__nav, .gallery__thumbs');
      if (labelEl && !onSpot) { cur.className = 'cursor label'; lab.textContent = labelEl.dataset.cursor; }
      else if (t.closest && t.closest('a, button, [data-tilt]')) { cur.className = 'cursor link'; }
      else if (t.closest && t.closest('input, textarea, iframe')) { cur.className = 'cursor hidden'; }
      else cur.className = 'cursor';
    }, { passive: true });
    cur.className = 'cursor idle';
    document.addEventListener('pointerleave', () => (cur.className = 'cursor hidden'));
    const loop = () => {
      cx = lerp(cx, tx, .2); cy = lerp(cy, ty, .2);
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }
  // glow position for every button
  $$('.btn').forEach(b => b.addEventListener('pointermove', e => {
    const r = b.getBoundingClientRect();
    b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    b.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ================= scroll scenes ================= */
  const heroMedia = $('[data-hero-media]');
  const heroContent = $('.hero__content');
  const curtain = $('[data-curtain]');
  const hg = $('[data-hgallery]'), htrack = $('[data-htrack]'), hprog = $('[data-hprogress]');
  const route = $('[data-route]'), mapEl = $('[data-map]');
  const decos = $$('[data-parallax]');
  const dock = $('[data-dock]');
  const pricesSec = $('#prices'), contactsSec = $('#contacts'), faqSec = $('#faq');
  const marquee = $('[data-marquee]');
  let layout = {};
  let lastSy = sy, hdrDir = 0;

  if (route) {
    const len = Math.ceil(route.getTotalLength());
    route.style.setProperty('--len', len);
  }

  function measure() {
    vw = innerWidth; vh = innerHeight;
    const top = el => el.getBoundingClientRect().top + scrollY;
    timed.forEach(t => { t.top = top(t.el); t.h = t.el.offsetHeight; });
    if (curtain) layout.curtain = { top: top(curtain), h: curtain.offsetHeight };
    if (hg && htrack) {
      if (vw > 900 && !reduced) {
        const dist = Math.max(0, htrack.scrollWidth - vw);
        hg.style.height = (dist + vh) + 'px';
        layout.hg = { top: top(hg), dist };
      } else { hg.style.height = ''; htrack.style.transform = ''; layout.hg = null; }
    }
    if (pricesSec) layout.prices = { top: top(pricesSec), h: pricesSec.offsetHeight };
    if (contactsSec) layout.contacts = { top: top(contactsSec) };
    if (faqSec) layout.faq = { top: top(faqSec) };
    layout.decos = decos.map(d => ({ el: d, speed: +d.dataset.parallax, top: top(d.parentElement), h: d.parentElement.offsetHeight }));
    if (mapEl) layout.map = { top: top(mapEl), h: mapEl.offsetHeight };
    dirty = true;
  }

  let dirty = true;
  function scene() {
    // header
    header.classList.toggle('scrolled', sy > 40);
    const dark = layout.faq && sy + 40 > layout.faq.top + vh * .25;
    header.classList.toggle('night', !!dark);
    const delta = sy - lastSy;
    if (Math.abs(delta) > 4) hdrDir = delta > 0 ? 1 : -1;
    header.classList.toggle('hide', hdrDir > 0 && sy > vh * 1.2 && !root.classList.contains('menu-open'));
    lastSy = sy;

    // hero parallax
    if (heroMedia && sy < vh * 1.2 && !reduced) {
      const p = clamp(sy / vh, 0, 1);
      heroMedia.style.transform = `translate3d(0, ${(p * vh * .28).toFixed(1)}px, 0) scale(${(1 + p * .12).toFixed(4)})`;
      heroContent.style.transform = `translate3d(0, ${(-p * 80).toFixed(1)}px, 0)`;
      heroContent.style.opacity = (1 - p * 1.3).toFixed(3);
    }

    // curtains
    if (layout.curtain && !reduced) {
      const c = layout.curtain;
      const p = clamp((sy - c.top) / Math.max(1, c.h - vh), 0, 1);
      const open = easeInOut(clamp((p - .03) / .5, 0, 1));
      const win = easeOut(clamp(p / .62, 0, 1));
      const small = vw < 700;
      curtain.style.setProperty('--open', open.toFixed(4));
      curtain.style.setProperty('--inset', lerp(small ? 4 : 8, 0, win).toFixed(3) + '%');
      curtain.style.setProperty('--rad', lerp(28, 0, win).toFixed(2) + 'px');
      curtain.style.setProperty('--zoom', lerp(1.18, 1, p).toFixed(4));
      curtain.style.setProperty('--textop', clamp((p - .5) / .2, 0, 1).toFixed(3));
      curtain.style.setProperty('--rodop', (1 - open).toFixed(3));
    }

    // horizontal gallery
    if (layout.hg) {
      const g = layout.hg;
      const p = clamp((sy - g.top) / Math.max(1, g.dist), 0, 1);
      htrack.style.transform = `translate3d(${(-p * g.dist).toFixed(1)}px, 0, 0)`;
      hprog.style.setProperty('--hp', p.toFixed(4));
      htrack.style.setProperty('--px', ((p - .5) * -7).toFixed(2) + '%');
    }

    // route draw
    if (layout.map && route) {
      const m = layout.map;
      const p = clamp((sy + vh - m.top - m.h * .25) / (vh * .55), 0, 1);
      route.style.setProperty('--draw', easeOut(p).toFixed(4));
    }

    // decorations parallax
    if (!reduced) layout.decos.forEach(d => {
      const c = d.top + d.h / 2 - (sy + vh / 2);
      if (Math.abs(c) < vh * 1.5 + d.h) d.el.style.translate = `0 ${(c * d.speed).toFixed(1)}px`;
    });

    // mobile dock
    if (dock && layout.prices) {
      const inPrices = sy + vh > layout.prices.top + 200 && sy < layout.prices.top + layout.prices.h - 200;
      const atEnd = layout.contacts && sy + vh > layout.contacts.top + 100;
      dock.classList.toggle('show', sy > vh * .8 && !inPrices && !atEnd);
    }

    updateClock();
  }

  // marquee — always running, faster while scrolling
  let mx = 0, vel = 0, prevSy = sy;
  function frame() {
    if (dirty) { scene(); dirty = false; }
    if (marquee && !reduced) {
      vel = lerp(vel, Math.abs(sy - prevSy), .1); prevSy = sy;
      mx -= .55 + Math.min(vel, 60) * .12;
      const half = marquee.scrollWidth / 2;
      if (-mx >= half) mx += half;
      marquee.style.transform = `translate3d(${mx.toFixed(2)}px, 0, 0)`;
    }
    requestAnimationFrame(frame);
  }
  addEventListener('scroll', () => { sy = scrollY; dirty = true; }, { passive: true });
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { measure(); sizeSky(); }, 120); });
  addEventListener('load', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
  requestAnimationFrame(frame);

  /* ================= prices / calculator ================= */
  const SEASON_DAYS = 184; // 1 May — 31 Oct
  const priceFor = d => {
    const md = (d.getMonth() + 1) * 100 + d.getDate();
    if (md >= 501 && md <= 615) return 3500;
    if (md >= 616 && md <= 915) return 4000;
    if (md >= 916 && md <= 1031) return 3500;
    return null;
  };
  const seasonIdx = d => {
    const md = (d.getMonth() + 1) * 100 + d.getDate();
    if (md >= 501 && md <= 615) return 0;
    if (md >= 616 && md <= 915) return 1;
    if (md >= 916 && md <= 1031) return 2;
    return -1;
  };
  const dayOfSeason = d => (d - new Date(d.getFullYear(), 4, 1)) / 864e5;
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = v => { if (!v) return null; const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
  const ru = d => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const dots = d => d.toLocaleDateString('ru-RU');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const inSeasonNow = priceFor(today) !== null;
  const seasonYear = (today.getMonth() > 9) ? today.getFullYear() + 1 : today.getFullYear();
  const nextOpen = new Date(seasonYear, 4, 1);
  const daysToSeason = Math.ceil((nextOpen - today) / 864e5);

  const tlNote = $('[data-tl-note]'), tlToday = $('[data-tl-today]'), tlRange = $('[data-tl-range]');
  const seasonChip = $('[data-season-chip]');
  if (inSeasonNow) {
    tlToday.hidden = false; tlToday.style.left = (dayOfSeason(today) / SEASON_DAYS * 100) + '%';
    tlNote.innerHTML = 'Сезон открыт — до 31 октября. <b>Свободные даты разбирают быстро.</b>';
    seasonChip.textContent = 'Сезон открыт · до 31 октября';
  } else {
    tlNote.innerHTML = `До открытия сезона — <b>${daysToSeason} ${plural(daysToSeason, 'день', 'дня', 'дней')}</b>. Лучшие даты бронируют заранее.`;
    seasonChip.textContent = `Сезон с 1 мая · через ${daysToSeason} ${plural(daysToSeason, 'день', 'дня', 'дней')}`;
  }

  const calc = $('[data-calc]');
  if (calc) {
    const inEl = $('[data-in]', calc), outEl = $('[data-out]', calc), nameEl = $('[data-name]', calc);
    const guestsEl = $('[data-guests]', calc);
    const totalWrap = $('[data-total-wrap]', calc);
    const sumEl = $('[data-summary]', calc), totalEl = $('[data-total]', calc), brEl = $('[data-breakdown]', calc), warnEl = $('[data-warn]', calc);
    const wa = $('[data-wa]', calc), tg = $('[data-tg]', calc);
    const seasonCards = $$('[data-season]');
    let guests = 2, shown = 0, msg = '';
    inEl.min = iso(today); outEl.min = iso(new Date(+today + 864e5));

    const tweenTotal = to => {
      const from = shown, start = performance.now();
      const step = now => {
        const t = clamp((now - start) / 700, 0, 1);
        shown = lerp(from, to, easeOut(t));
        totalEl.textContent = money(shown);
        if (t < 1) requestAnimationFrame(step); else { shown = to; totalEl.textContent = money(to); }
      };
      requestAnimationFrame(step);
    };

    function compute() {
      const din = parse(inEl.value), dout = parse(outEl.value);
      const rooms = Math.ceil(guests / 3);
      const name = nameEl.value.trim();
      const g = `${guests} ${plural(guests, 'гость', 'гостя', 'гостей')}`;
      const r = `${rooms} ${plural(rooms, 'номер', 'номера', 'номеров')}`;
      warnEl.hidden = true; brEl.innerHTML = ''; tlRange.hidden = true;
      seasonCards.forEach(c => c.classList.remove('active'));
      let total = 0;
      if (!din || !dout) {
        sumEl.textContent = 'Выберите даты — покажем стоимость';
        msg = `Здравствуйте! Хочу узнать о свободных номерах в гостевом доме «Холодная речка». Нас ${g}.` + (name ? ` Меня зовут ${name}.` : '');
      } else if (dout <= din) {
        sumEl.textContent = 'Проверьте даты';
        warnEl.hidden = false; warnEl.textContent = 'Дата выезда должна быть позже даты заезда.';
        msg = `Здравствуйте! Хочу узнать о свободных номерах в гостевом доме «Холодная речка». Нас ${g}.`;
      } else {
        const groups = new Map(); let nights = 0, off = 0;
        const used = new Set();
        for (let d = new Date(din); d < dout; d.setDate(d.getDate() + 1)) {
          nights++;
          const p = priceFor(d);
          if (p === null) { off++; continue; }
          used.add(seasonIdx(d));
          groups.set(p, (groups.get(p) || 0) + 1);
          total += p * rooms;
        }
        used.forEach(k => seasonCards[k] && seasonCards[k].classList.add('active'));
        const n = `${nights} ${plural(nights, 'ночь', 'ночи', 'ночей')}`;
        sumEl.textContent = `${ru(din)} — ${ru(dout)} · ${n} · ${g}` + (rooms > 1 ? ` · ${r}` : '');
        [...groups.entries()].sort((a, b) => a[0] - b[0]).forEach(([p, c]) => {
          const li = document.createElement('li');
          li.textContent = `${c} ${plural(c, 'ночь', 'ночи', 'ночей')} × ${money(p)} ₽` + (rooms > 1 ? ` × ${r}` : '');
          brEl.append(li);
        });
        if (off) {
          warnEl.hidden = false;
          warnEl.textContent = `${off} ${plural(off, 'ночь', 'ночи', 'ночей')} вне сезона (мы принимаем гостей с 1 мая по 31 октября) — их не посчитали. Напишите нам, уточним.`;
        }
        // timeline highlight
        const a = clamp(dayOfSeason(din), 0, SEASON_DAYS), b = clamp(dayOfSeason(dout), 0, SEASON_DAYS);
        if (din.getFullYear() === dout.getFullYear() && b > a) {
          tlRange.hidden = false;
          tlRange.style.left = (a / SEASON_DAYS * 100) + '%';
          tlRange.style.width = Math.max(1.2, (b - a) / SEASON_DAYS * 100) + '%';
        }
        msg = [
          'Здравствуйте! Хочу забронировать номер в гостевом доме «Холодная речка».',
          `Заезд: ${dots(din)}, выезд: ${dots(dout)} — ${n}.`,
          `Гостей: ${guests} (${r}).`,
          total ? `Предварительный расчёт на сайте: ${money(total)} ₽.` : '',
          name ? `Меня зовут ${name}.` : '',
          'Есть ли свободные номера на эти даты?',
        ].filter(Boolean).join('\n');
      }
      totalWrap.hidden = !total;
      tweenTotal(total);
      wa.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
    }

    inEl.addEventListener('change', () => {
      const d = parse(inEl.value);
      if (d) {
        const o = parse(outEl.value);
        outEl.min = iso(new Date(+d + 864e5));
        if (!o || o <= d) outEl.value = iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
      }
      $$('[data-q]').forEach(b => b.classList.remove('on'));
      compute();
    });
    outEl.addEventListener('change', () => { $$('[data-q]').forEach(b => b.classList.remove('on')); compute(); });
    nameEl.addEventListener('input', compute);
    $$('[data-step]', calc).forEach(b => b.addEventListener('click', () => {
      guests = clamp(guests + +b.dataset.step, 1, 12);
      guestsEl.textContent = guests; compute();
    }));
    $$('[data-q]', calc).forEach(b => b.addEventListener('click', () => {
      const [a, z] = b.dataset.q.split(':');
      const [am, ad] = a.split('-').map(Number), [zm, zd] = z.split('-').map(Number);
      let y = seasonYear;
      if (new Date(y, am - 1, ad) < today) y++;
      inEl.value = iso(new Date(y, am - 1, ad)); outEl.value = iso(new Date(y, zm - 1, zd));
      $$('[data-q]', calc).forEach(x => x.classList.toggle('on', x === b));
      compute();
    }));
    tg.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(msg); ok = true; } catch (e) { /* no clipboard */ }
      toast(ok ? 'Текст заявки скопирован — вставьте его в чат Telegram' : 'Напишите нам в Telegram: @' + TG);
      setTimeout(() => window.open('https://t.me/' + TG, '_blank', 'noopener'), ok ? 650 : 900);
    });
    compute();
  }

  /* ================= FAQ ================= */
  $$('[data-acc] .acc__q').forEach(q => q.addEventListener('click', () => {
    const open = q.getAttribute('aria-expanded') === 'true';
    $$('[data-acc] .acc__q').forEach(x => x.setAttribute('aria-expanded', 'false'));
    q.setAttribute('aria-expanded', String(!open));
  }));

  /* ================= map ================= */
  const mapBtn = $('[data-map-load]');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://yandex.ru/map-widget/v1/?um=constructor%3A4797ed7a1e0a8c85d76318c64fe9108c1502723730c366cc40352f549155dfad&source=constructor';
    f.title = 'Гостевой дом «Холодная речка» на Яндекс Картах';
    f.loading = 'lazy'; f.allowFullscreen = true;
    mapBtn.replaceWith(f);
  });

  /* ================= toast ================= */
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(text) {
    toastEl.textContent = text; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  /* ================= weather & local time ================= */
  const wChip = $('[data-weather]');
  const tFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' });
  const setTime = () => { const el = $('[data-w-time]'); if (el) el.textContent = tFmt.format(new Date()); };
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  const sign = t => (t > 0 ? '+' : '') + Math.round(t) + '°';
  const wIcon = c => (c === 0 ? '☀' : c <= 2 ? '🌤' : c === 3 ? '☁' : c <= 48 ? '🌫' : c <= 67 || (c >= 80 && c <= 82) ? '🌦' : c <= 77 ? '❄' : '⛈');
  Promise.all([
    withTimeout(fetch('https://api.open-meteo.com/v1/forecast?latitude=43.36&longitude=40.12&current=temperature_2m,weather_code&timezone=Europe%2FMoscow').then(r => r.json()), 7000),
    withTimeout(fetch('https://marine-api.open-meteo.com/v1/marine?latitude=43.33&longitude=40.1&current=sea_surface_temperature').then(r => r.json()), 7000).catch(() => null),
  ]).then(([w, m]) => {
    const air = w && w.current && w.current.temperature_2m;
    if (typeof air !== 'number') return;
    $('[data-w-air]').textContent = `${wIcon(w.current.weather_code)} ${sign(air)}`;
    const sea = m && m.current && m.current.sea_surface_temperature;
    const seaEl = $('[data-w-sea]');
    if (typeof sea === 'number') seaEl.textContent = sign(sea);
    else { seaEl.parentElement.previousElementSibling.remove(); seaEl.parentElement.remove(); }
    setTime(); setInterval(setTime, 20000);
    wChip.hidden = false;
  }).catch(() => {});

  /* ================= sea sound ================= */
  const soundBtn = $('[data-sound]'), soundLabel = $('[data-sound-label]');
  let actx, gain, srcNode, buffer, soundOn = false, loading = false;
  if (soundBtn) soundBtn.addEventListener('click', async () => {
    if (loading) return;
    try {
      if (!actx) {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        gain = actx.createGain(); gain.gain.value = 0; gain.connect(actx.destination);
      }
      if (actx.state === 'suspended') await actx.resume();
      soundOn = !soundOn;
      soundBtn.classList.toggle('on', soundOn);
      soundBtn.setAttribute('aria-pressed', soundOn);
      if (soundOn) {
        if (!buffer) {
          loading = true; soundLabel.textContent = 'Загружаем…';
          const ab = await (await fetch('assets/audio/sea.mp3')).arrayBuffer();
          buffer = await actx.decodeAudioData(ab);
          loading = false;
        }
        if (!srcNode) { srcNode = actx.createBufferSource(); srcNode.buffer = buffer; srcNode.loop = true; srcNode.loopStart = .06; srcNode.loopEnd = buffer.duration - .06; srcNode.connect(gain); srcNode.start(); }
        gain.gain.cancelScheduledValues(actx.currentTime);
        gain.gain.setTargetAtTime(.85, actx.currentTime, .7);
        soundLabel.textContent = 'Выключить звук';
      } else {
        gain.gain.cancelScheduledValues(actx.currentTime);
        gain.gain.setTargetAtTime(0, actx.currentTime, .35);
        soundLabel.textContent = 'Звук моря';
      }
    } catch (e) {
      loading = false; soundOn = false; soundBtn.classList.remove('on');
      soundLabel.textContent = 'Звук моря';
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!actx) return;
    if (document.hidden) actx.suspend(); else if (soundOn) actx.resume();
  });

  /* ================= night sky: stars, shooting stars, fireflies ================= */
  const sky = $('[data-sky]');
  let sctx, stars = [], flies = [], skyOn = false, shoot = null, nextShoot = 0, skyW = 0, skyH = 0;
  function sizeSky() {
    if (!sky) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    skyW = sky.offsetWidth; skyH = sky.offsetHeight;
    sky.width = skyW * dpr; sky.height = skyH * dpr;
    sctx = sky.getContext('2d'); sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(clamp(skyW * skyH / 5200, 70, 260));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * skyW, y: Math.pow(Math.random(), 1.4) * skyH * .72,
      r: Math.random() * 1.3 + .3, p: Math.random() * Math.PI * 2, s: .6 + Math.random() * 1.8,
    }));
    flies = Array.from({ length: skyW < 700 ? 9 : 16 }, () => ({
      x: Math.random() * skyW, y: skyH * (.55 + Math.random() * .4),
      a: Math.random() * Math.PI * 2, v: .25 + Math.random() * .45, p: Math.random() * 6,
    }));
  }
  function drawSky(now) {
    if (!skyOn) return;
    const t = now / 1000;
    sctx.clearRect(0, 0, skyW, skyH);
    for (const s of stars) {
      const a = .35 + .65 * (.5 + .5 * Math.sin(t * s.s + s.p));
      sctx.globalAlpha = a; sctx.fillStyle = '#fffbe8';
      sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, 6.283); sctx.fill();
    }
    // shooting star
    if (!shoot && t > nextShoot) {
      shoot = { x: Math.random() * skyW * .7 + skyW * .1, y: Math.random() * skyH * .25, vx: 9 + Math.random() * 5, vy: 3.5 + Math.random() * 2, life: 0 };
      nextShoot = t + 4 + Math.random() * 6;
    }
    if (shoot) {
      shoot.life += 1; shoot.x += shoot.vx; shoot.y += shoot.vy;
      const g = sctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 12, shoot.y - shoot.vy * 12);
      g.addColorStop(0, 'rgba(255,255,240,.95)'); g.addColorStop(1, 'rgba(255,255,240,0)');
      sctx.globalAlpha = clamp(1 - shoot.life / 60, 0, 1);
      sctx.strokeStyle = g; sctx.lineWidth = 2;
      sctx.beginPath(); sctx.moveTo(shoot.x, shoot.y); sctx.lineTo(shoot.x - shoot.vx * 12, shoot.y - shoot.vy * 12); sctx.stroke();
      if (shoot.life > 60) shoot = null;
    }
    // fireflies
    for (const f of flies) {
      f.a += (Math.random() - .5) * .25; f.x += Math.cos(f.a) * f.v; f.y += Math.sin(f.a) * f.v * .6;
      if (f.x < -20) f.x = skyW + 20; if (f.x > skyW + 20) f.x = -20;
      if (f.y < skyH * .5) f.a = Math.PI / 2; if (f.y > skyH) f.a = -Math.PI / 2;
      const glow = .25 + .75 * Math.max(0, Math.sin(t * 1.6 + f.p));
      const rg = sctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 14);
      rg.addColorStop(0, `rgba(230,255,140,${.9 * glow})`); rg.addColorStop(1, 'rgba(230,255,140,0)');
      sctx.globalAlpha = 1; sctx.fillStyle = rg;
      sctx.beginPath(); sctx.arc(f.x, f.y, 14, 0, 6.283); sctx.fill();
    }
    sctx.globalAlpha = 1;
    requestAnimationFrame(drawSky);
  }
  if (sky) {
    sizeSky();
    new IntersectionObserver(([e]) => {
      const was = skyOn; skyOn = e.isIntersecting && !reduced;
      if (skyOn && !was) requestAnimationFrame(drawSky);
      if (reduced && e.isIntersecting) { skyOn = true; drawSky(0); skyOn = false; }
    }).observe(sky);
  }

  /* ================= mandarin burst ================= */
  const bc = $('[data-burst-canvas]');
  const bctx = bc.getContext('2d');
  const mandarin = new Image();
  addEventListener('load', () => { mandarin.src = 'assets/art/mandarin.webp'; });
  let parts = [], bursting = false;
  function sizeBurst() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    bc.width = innerWidth * dpr; bc.height = innerHeight * dpr;
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function burst(x, y) {
    if (reduced) return;
    sizeBurst();
    for (let k = 0; k < 34; k++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * 2.2, sp = 7 + Math.random() * 10;
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3,
        s: k % 3 === 0 ? 16 + Math.random() * 10 : 24 + Math.random() * 22, leaf: k % 3 === 0, life: 0,
      });
    }
    if (!bursting) { bursting = true; requestAnimationFrame(drawBurst); }
  }
  function drawBurst() {
    bctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(p => {
      p.life++; p.vy += .42; p.vx *= .985; p.vy *= .992; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      bctx.save(); bctx.translate(p.x, p.y); bctx.rotate(p.r);
      bctx.globalAlpha = clamp(1.6 - p.life / 70, 0, 1);
      if (p.leaf) {
        bctx.fillStyle = '#3f8a4f';
        bctx.beginPath(); bctx.ellipse(0, 0, p.s * .55, p.s * .22, 0, 0, 6.283); bctx.fill();
        bctx.strokeStyle = 'rgba(255,255,255,.4)'; bctx.lineWidth = 1;
        bctx.beginPath(); bctx.moveTo(-p.s * .5, 0); bctx.lineTo(p.s * .5, 0); bctx.stroke();
      } else if (mandarin.complete && mandarin.naturalWidth) {
        bctx.drawImage(mandarin, -p.s / 2, -p.s / 2, p.s, p.s * mandarin.naturalHeight / mandarin.naturalWidth);
      } else {
        bctx.fillStyle = '#f2852a'; bctx.beginPath(); bctx.arc(0, 0, p.s / 2.4, 0, 6.283); bctx.fill();
      }
      bctx.restore();
    });
    parts = parts.filter(p => p.life < 120 && p.y < innerHeight + 80);
    if (parts.length) requestAnimationFrame(drawBurst);
    else { bursting = false; bctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  $$('[data-burst]').forEach(el => el.addEventListener('click', e => {
    const r = el.getBoundingClientRect();
    burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
  }));
})();
