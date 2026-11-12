/* Холодная речка — интерактив без библиотек. Контент виден и без JS. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const body = document.body;
  const PHONE = '79281536032';
  const TG = 'Tanya_Tkachenko_0521';
  const img = (n, size) => `assets/img/${n}-${size}.webp`;
  const plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  };
  const money = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ');

  /* ================= toast ================= */
  const toastEl = $('[data-toast]');
  let toastT = 0;
  const toast = t => {
    toastEl.textContent = t; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 3200);
  };

  /* ================= header + menu ================= */
  const header = $('[data-header]'), burger = $('[data-burger]'), menu = $('[data-menu]');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
  const onScrollHeader = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScrollHeader, { passive: true }); onScrollHeader();

  // highlight the current section in the nav
  const navLinks = $$('.nav a');
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const s = $(a.getAttribute('href')); if (s) navIO.observe(s); });

  /* ================= reveal ================= */
  const revIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => revIO.observe(el));

  /* ================= videos ================= */
  const heroVideo = $('[data-hero-video]');
  if (heroVideo && (reduced || saveData)) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); heroVideo.preload = 'none'; }
  const vidIO = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.dataset.loaded) {
        $$('source[data-src]', v).forEach(s => { s.src = s.dataset.src; });
        v.load(); v.dataset.loaded = '1';
      }
      if (v.dataset.once && v.ended) return;   // the magnolia opens once and stays open
      v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  }), { rootMargin: '200px 0px' });
  if (!reduced && !saveData) $$('[data-lazy-video]').forEach(v => vidIO.observe(v));

  /* ================= lightbox ================= */
  const LB = (() => {
    const lb = $('[data-lightbox]');
    const im = $('[data-lb-img]', lb), cap = $('[data-lb-cap]', lb);
    let items = [], i = 0, last = null, onClose = null;
    const show = k => {
      i = (k + items.length) % items.length;
      const it = items[i];
      im.style.opacity = 0;
      const n = new Image(); n.src = it.src;
      n.onload = () => { im.src = n.src; im.alt = it.alt; im.style.opacity = 1; };
      cap.textContent = it.alt + ' · ' + (i + 1) + ' / ' + items.length;
    };
    const close = () => {
      lb.classList.remove('open'); body.style.overflow = ''; body.classList.remove('lb-open');
      setTimeout(() => (lb.hidden = true), 250);
      if (onClose) onClose();
      if (last) last.focus({ preventScroll: true });
    };
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', () => show(i - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(i + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'Tab') { // keep focus inside
        const f = $$('button', lb); const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    let sx = null, sy0 = null;
    lb.addEventListener('pointerdown', e => { sx = e.clientX; sy0 = e.clientY; });
    lb.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy0; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1));
      else if (dy > 90) close();
    });
    return {
      open(list, k, label, cb) {
        items = list; onClose = cb || null; last = document.activeElement;
        lb.setAttribute('aria-label', label || 'Фотографии');
        lb.hidden = false; requestAnimationFrame(() => lb.classList.add('open'));
        body.style.overflow = 'hidden'; body.classList.add('lb-open');
        show(k);
        $('[data-lb-close]', lb).focus({ preventScroll: true });
      }
    };
  })();

  /* ================= room gallery ================= */
  const SLIDES = [
    { name: 'room-1', tag: 'Номер', alt: 'Номер с двуспальной и отдельной кроватями', cap: 'Двуспальная и отдельная кровати — места для троих' },
    { name: 'room-4', tag: 'Балкон', alt: 'Номер с выходом на балкон', cap: 'Выход на балкон, кондиционер, телевизор и столик' },
    { name: 'room-2', tag: 'Шкаф и ТВ', alt: 'Шкаф, телевизор и тумба в номере', cap: 'Шкаф для одежды, телевизор и тумба с полками' },
    { name: 'bath', tag: 'Санузел', alt: 'Санузел с душем в номере', cap: 'Свой санузел с душем и феном — в номере' },
    { name: 'view', tag: 'Вид', alt: 'Вид с балкона на море и пальму', cap: 'Вид с балкона номера: море и пальма' },
  ];
  const gal = $('[data-gallery]');
  if (gal) {
    const main = $('[data-g-main]', gal), capEl = $('[data-g-cap]', gal), thumbsEl = $('[data-g-thumbs]', gal);
    const pics = SLIDES.map((s, k) => {
      const im = new Image();
      im.src = img(s.name, 'sm');
      im.srcset = `${img(s.name, 'sm')} 800w, ${img(s.name, 'lg')} 1254w`;
      im.sizes = '(max-width: 900px) 92vw, 720px';
      im.alt = s.alt; im.decoding = 'async';
      if (k) im.loading = 'lazy';
      main.append(im); return im;
    });
    const thumbs = SLIDES.map((s, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Фото ' + (k + 1) + ': ' + s.tag);
      b.innerHTML = `<img src="${img(s.name, 'sm')}" alt="" loading="lazy"><span>${s.tag}</span>`;
      b.addEventListener('click', () => go(k));
      thumbsEl.append(b); return b;
    });
    let cur = -1;
    function go(k) {
      k = (k + SLIDES.length) % SLIDES.length;
      if (k === cur) return;
      pics.forEach((p, j) => p.classList.toggle('on', j === k));
      thumbs.forEach((t, j) => { t.classList.toggle('on', j === k); t.setAttribute('aria-current', j === k ? 'true' : 'false'); });
      capEl.textContent = SLIDES[k].cap;
      cur = k;
    }
    go(0);
    const open = () => LB.open(SLIDES.map(x => ({ src: img(x.name, 'lg'), alt: x.alt })), cur, 'Фотографии номера', i => {});
    let px = null, py = null, moved = false;
    main.addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; moved = false; });
    main.addEventListener('pointerup', e => {
      if (px === null) return;
      const dx = e.clientX - px, dy = e.clientY - py; px = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { moved = true; go(cur + (dx < 0 ? 1 : -1)); }
    });
    main.addEventListener('click', () => { if (!moved) open(); moved = false; });
    main.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      if (e.key === 'ArrowRight') go(cur + 1);
      if (e.key === 'ArrowLeft') go(cur - 1);
    });
  }

  /* ================= place gallery ================= */
  // Never blocks the page: on desktop the strip drifts sideways while the page scrolls past it,
  // arrows / drag add an offset; on touch screens it is a native swipe strip. Tap opens the photo.
  const hg = $('[data-hgallery]');
  if (hg) {
    const view = $('[data-hview]', hg), track = $('[data-htrack]', hg), prog = $('[data-hprogress]', hg);
    const prev = $('[data-hprev]', hg), next = $('[data-hnext]', hg);
    const figs = $$('figure[data-full]', track);
    const items = figs.map(f => ({ src: f.dataset.full, alt: f.dataset.alt }));
    const touchMq = matchMedia('(hover: none), (max-width: 900px)');
    const touch = () => touchMq.matches;
    let dist = 0, manual = 0, cur = 0, target = 0, step = 444, raf = 0;
    const measure = () => {
      dist = touch() ? Math.max(0, view.scrollWidth - view.clientWidth) : Math.max(0, track.scrollWidth - view.clientWidth);
      const c = figs[1] || figs[0]; step = c ? c.offsetWidth + 24 : 444;
    };
    const base = () => {
      if (reduced) return 0;
      const r = hg.getBoundingClientRect();
      return clamp((innerHeight - r.top) / (innerHeight + r.height * .6), 0, 1) * dist * .85;
    };
    const setUi = pos => {
      const p = dist ? pos / dist : 0;
      prog.style.setProperty('--hp', p.toFixed(4));
      prev.disabled = p < .01; next.disabled = p > .99;
    };
    const tick = () => {
      raf = 0;
      if (touch()) return;
      const b = base();
      target = clamp(b + manual, 0, dist); manual = target - b;
      cur = reduced ? target : lerp(cur, target, .14);
      if (Math.abs(cur - target) < .5) cur = target;
      track.style.transform = `translate3d(${(-cur).toFixed(1)}px,0,0)`;
      setUi(cur);
      if (cur !== target) kick();
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const go = d => {
      if (touch()) { view.scrollBy({ left: d * step, behavior: reduced ? 'auto' : 'smooth' }); return; }
      manual += d * step; kick();
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    addEventListener('scroll', kick, { passive: true });
    view.addEventListener('scroll', () => { if (touch()) { measure(); setUi(view.scrollLeft); } }, { passive: true });
    let down = null, moved = 0;
    view.addEventListener('pointerdown', e => {
      if (touch() || e.button !== 0) return;
      down = { x: e.clientX, m: manual }; moved = 0;
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x; moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) { view.classList.add('drag'); manual = down.m - dx; kick(); }
    });
    addEventListener('pointerup', () => { if (down) { down = null; setTimeout(() => view.classList.remove('drag'), 0); } });
    figs.forEach((f, k) => {
      f.tabIndex = 0; f.setAttribute('role', 'button');
      f.setAttribute('aria-label', 'Открыть фото: ' + f.dataset.alt);
      const open = () => LB.open(items, k, 'Фотографии окрестностей');
      f.addEventListener('click', () => { if (moved > 6) { moved = 0; return; } open(); });
      f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    const reset = () => { track.style.transform = ''; manual = 0; cur = 0; measure(); setUi(touch() ? view.scrollLeft : 0); kick(); };
    if (touchMq.addEventListener) touchMq.addEventListener('change', reset);
    addEventListener('resize', () => { measure(); kick(); });
    addEventListener('load', () => { measure(); kick(); });
    measure(); setUi(0); kick();
  }

  /* ================= prices / calculator ================= */
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
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = v => { if (!v) return null; const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
  const ru = d => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const dots = d => d.toLocaleDateString('ru-RU');
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const calc = $('[data-calc]');
  if (calc) {
    const inEl = $('[data-in]', calc), outEl = $('[data-out]', calc), nameEl = $('[data-name]', calc);
    const guestsEl = $('[data-guests]', calc), totalWrap = $('[data-total-wrap]', calc);
    const sumEl = $('[data-summary]', calc), totalEl = $('[data-total]', calc), brEl = $('[data-breakdown]', calc), warnEl = $('[data-warn]', calc);
    const wa = $('[data-wa]', calc), tg = $('[data-tg]', calc);
    const seasonCards = $$('[data-season]');
    let guests = 2, msg = '', ready = false;
    inEl.min = iso(today); outEl.min = iso(new Date(+today + 864e5));

    function compute() {
      const din = parse(inEl.value), dout = parse(outEl.value);
      const rooms = Math.ceil(guests / 3);
      const name = nameEl.value.trim();
      const g = `${guests} ${plural(guests, 'гость', 'гостя', 'гостей')}`;
      const r = `${rooms} ${plural(rooms, 'номер', 'номера', 'номеров')}`;
      warnEl.hidden = true; brEl.innerHTML = ''; ready = false;
      seasonCards.forEach(c => c.classList.remove('active'));
      let total = 0;
      if (!din || !dout) {
        sumEl.textContent = 'Выберите даты заезда и выезда';
      } else if (dout <= din) {
        sumEl.textContent = 'Проверьте даты';
        warnEl.hidden = false; warnEl.textContent = 'Дата выезда должна быть позже даты заезда.';
      } else {
        const groups = new Map(), used = new Set(); let nights = 0, off = 0;
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
        ready = true;
        msg = [
          'Здравствуйте! Хочу уточнить наличие свободного номера в гостевом доме «Холодная речка».',
          `Заезд: ${dots(din)}, выезд: ${dots(dout)} — ${n}.`,
          `Гостей: ${guests} (${r}).`,
          total ? `Расчёт на сайте: ${money(total)} ₽.` : '',
          name ? `Меня зовут ${name}.` : '',
          'Есть ли свободные номера на эти даты?',
        ].filter(Boolean).join('\n');
      }
      totalWrap.hidden = !total;
      totalEl.textContent = money(total);
      wa.href = ready ? `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}` : '#calc';
      wa.setAttribute('aria-disabled', ready ? 'false' : 'true');
    }
    wa.addEventListener('click', e => {
      if (ready) return;
      e.preventDefault();
      toast('Сначала выберите даты заезда и выезда');
      (inEl.value ? outEl : inEl).focus();
      try { (inEl.value ? outEl : inEl).showPicker(); } catch (err) { /* not supported */ }
    });
    inEl.addEventListener('change', () => {
      const d = parse(inEl.value);
      if (d) {
        const o = parse(outEl.value);
        outEl.min = iso(new Date(+d + 864e5));
        if (!o || o <= d) outEl.value = iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
      }
      compute();
    });
    outEl.addEventListener('change', compute);
    nameEl.addEventListener('input', compute);
    $$('[data-step]', calc).forEach(b => b.addEventListener('click', () => {
      guests = clamp(guests + +b.dataset.step, 1, 12);
      guestsEl.textContent = guests; compute();
    }));
    tg.addEventListener('click', async () => {
      const text = ready ? msg : 'Здравствуйте! Хочу узнать о свободных номерах в гостевом доме «Холодная речка».';
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { /* no clipboard */ }
      toast(ok ? 'Текст сообщения скопирован — вставьте его в чат Telegram' : 'Напишите нам в Telegram: @' + TG);
      setTimeout(() => window.open('https://t.me/' + TG, '_blank', 'noopener'), ok ? 650 : 900);
    });
    compute();
  }

  /* ================= FAQ ================= */
  $$('.acc__item').forEach(it => {
    const q = $('.acc__q', it);
    q.addEventListener('click', () => {
      const open = !it.classList.contains('open');
      it.classList.toggle('open', open); q.setAttribute('aria-expanded', open);
    });
  });

  /* ================= phone dock ================= */
  const dock = $('[data-dock]');
  if (dock) {
    const state = { hero: true, calc: false, contacts: false, typing: false, down: false };
    const upd = () => dock.classList.toggle('show', !state.hero && !state.calc && !state.contacts && !state.typing && !state.down);
    // hide while the visitor scrolls down (reading), show again on the way up or after a pause
    let lastY = scrollY, idle = 0;
    addEventListener('scroll', () => {
      const y = scrollY, d = y - lastY; lastY = y;
      if (Math.abs(d) > 6) { state.down = d > 0; upd(); }
      clearTimeout(idle); idle = setTimeout(() => { state.down = false; upd(); }, 900);
    }, { passive: true });
    const watch = (el, key) => el && new IntersectionObserver(([e]) => { state[key] = e.isIntersecting; upd(); }).observe(el);
    watch($('[data-hero-actions]'), 'hero');
    watch($('[data-calc]'), 'calc');
    watch($('#contacts'), 'contacts');
    addEventListener('focusin', e => { if (e.target.matches('input')) { state.typing = true; upd(); } });
    addEventListener('focusout', e => { if (e.target.matches('input')) { state.typing = false; upd(); } });
  }
})();
