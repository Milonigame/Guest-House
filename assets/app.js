/* Холодная речка — интерактив без библиотек. Контент виден и без JS. Один скрипт для русской и английской страниц. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const PHONE = '79281536032';
  const TG = 'Tanya_Tkachenko_0521';
  const EN = document.documentElement.lang === 'en';
  const L = (ru, en) => (EN ? en : ru);
  const BASE = EN ? '../' : '';
  const img = (n, size) => `${BASE}assets/img/${n}-${size}.webp`;
  const plural = (n, one, few, many, en1, enN) => {
    if (EN) return n === 1 ? en1 : enN;
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  };
  const money = n => Math.round(n).toLocaleString(EN ? 'en-US' : 'ru-RU').replace(/\s/g, ' ');

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
  // The sea, the balcony view and the magnolia are calm loops the owners want every visitor to see,
  // so they play even with "reduce motion" or data saving switched on; the hero keeps its pause button.
  // Phones in power-saving mode refuse to start videos by themselves: then the first tap or key press starts them.
  const heroVideo = $('[data-hero-video]');
  const start = v => { const p = v.play(); if (p) p.catch(() => {}); };
  const inView = new Set();
  let heroStopped = false;   // the visitor paused the hero with its button
  const vidIO = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      inView.add(v);
      if (!v.dataset.loaded) {
        $$('source[data-src]', v).forEach(s => { s.src = s.dataset.src; });
        v.load(); v.dataset.loaded = '1';
      }
      if (v.dataset.once && v.ended) return;   // the magnolia opens once and stays open
      start(v);
    } else { inView.delete(v); if (!v.paused) v.pause(); }
  }), { rootMargin: '200px 0px' });
  $$('[data-lazy-video]').forEach(v => vidIO.observe(v));
  const nudge = e => {
    if (e.target.closest && e.target.closest('[data-hero-pause]')) return;   // the button handles itself
    if (heroVideo && heroVideo.paused && !heroStopped) start(heroVideo);
    inView.forEach(v => { if (v.paused && !(v.dataset.once && v.ended)) start(v); });
  };
  ['pointerup', 'touchend', 'keydown'].forEach(t => addEventListener(t, nudge, { passive: true }));

  // pause / play button on the hero video
  const heroPause = $('[data-hero-pause]');
  if (heroVideo && heroPause) {
    const sync = () => {
      const p = heroVideo.paused;
      heroPause.classList.toggle('paused', p);
      heroPause.setAttribute('aria-label', p ? L('Запустить видео', 'Play video') : L('Остановить видео', 'Pause video'));
    };
    heroPause.addEventListener('click', () => {
      heroStopped = !heroVideo.paused;
      if (heroVideo.paused) start(heroVideo); else heroVideo.pause();
    });
    heroVideo.addEventListener('play', sync); heroVideo.addEventListener('pause', sync); sync();
  }

  // "See the view" starts the balcony video even when autoplay is off
  const viewVideo = $('[data-view-video]');
  $$('[data-play-view]').forEach(a => a.addEventListener('click', () => {
    if (!viewVideo) return;
    if (!viewVideo.dataset.loaded) { $$('source[data-src]', viewVideo).forEach(x => { x.src = x.dataset.src; }); viewVideo.load(); viewVideo.dataset.loaded = '1'; }
    viewVideo.play().catch(() => {});
  }));

  // the four perks sit in the hero on wide screens and under the dates card on phones
  const perks = $('[data-perks]'), perksSlot = $('[data-perks-slot]');
  if (perks && perksSlot) {
    const perksHome = perks.parentNode, mq = matchMedia('(max-width: 900px)');
    const place = () => { const to = mq.matches ? perksSlot : perksHome; if (perks.parentNode !== to) to.append(perks); };
    if (mq.addEventListener) mq.addEventListener('change', place); else mq.addListener(place);
    place();
  }

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
        lb.setAttribute('aria-label', label || L('Фотографии', 'Photos'));
        lb.hidden = false; requestAnimationFrame(() => lb.classList.add('open'));
        body.style.overflow = 'hidden'; body.classList.add('lb-open');
        show(k);
        $('[data-lb-close]', lb).focus({ preventScroll: true });
      }
    };
  })();

  /* ================= room gallery ================= */
  const SLIDES = [
    { name: 'room-1', tag: L('Номер', 'Room'), alt: L('Номер с двуспальной и отдельной кроватями', 'Room with a double and a single bed'), cap: L('Двуспальная и отдельная кровати — места для троих', 'A double and a single bed: room for three') },
    { name: 'room-4', tag: L('Балкон', 'Balcony'), alt: L('Номер с выходом на балкон', 'Room with a door to the balcony'), cap: L('Выход на балкон, кондиционер, телевизор и столик', 'Balcony door, air conditioning, TV and a table') },
    { name: 'room-2', tag: L('Шкаф и ТВ', 'Wardrobe & TV'), alt: L('Шкаф, телевизор и тумба в номере', 'Wardrobe, TV and a cabinet in the room'), cap: L('Шкаф для одежды, телевизор и тумба с полками', 'Wardrobe, TV and a cabinet with shelves') },
    { name: 'bath', tag: L('Санузел', 'Bathroom'), alt: L('Санузел с душем в номере', 'Private bathroom with a shower'), cap: L('Свой санузел с душем и феном — в номере', 'Private bathroom with a shower and a hair dryer') },
    { name: 'view', tag: L('Вид', 'View'), alt: L('Вид с балкона на море и пальму', 'View from the balcony: the sea and a palm tree'), cap: L('Вид с балкона номера: море и пальма', 'View from the room balcony: the sea and a palm tree') },
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
      b.setAttribute('aria-label', L('Фото ', 'Photo ') + (k + 1) + ': ' + s.tag);
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
    const open = () => LB.open(SLIDES.map(x => ({ src: img(x.name, 'lg'), alt: x.alt })), cur, L('Фотографии номера', 'Room photos'), i => {});
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
  // A plain horizontal strip: native scroll / swipe, big side arrows glide one photo, tap opens the photo.
  // The page wheel always scrolls the page.
  const hg = $('[data-hgallery]');
  if (hg) {
    const view = $('[data-hview]', hg), prog = $('[data-hprogress]', hg);
    const prev = $('[data-hprev]', hg), next = $('[data-hnext]', hg);
    const figs = $$('figure[data-full]', hg);
    const items = figs.map(f => ({ src: f.dataset.full, alt: f.dataset.alt }));
    const ui = () => {
      const dist = Math.max(0, view.scrollWidth - view.clientWidth), x = view.scrollLeft;
      prog.style.setProperty('--hp', dist ? (x / dist).toFixed(4) : 0);
      prev.disabled = x < 8; next.disabled = x > dist - 8;
    };
    const go = d => {
      const x = view.scrollLeft, pad = parseFloat(getComputedStyle(view).scrollPaddingLeft) || 0;
      const lefts = figs.map(f => f.offsetLeft - pad);
      let t = d > 0 ? lefts.find(l => l > x + 8) : [...lefts].reverse().find(l => l < x - 8);
      if (t === undefined) t = d > 0 ? view.scrollWidth : 0;
      view.scrollTo({ left: t, behavior: reduced ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    view.addEventListener('scroll', ui, { passive: true });
    addEventListener('resize', ui); addEventListener('load', ui); ui();
    figs.forEach((f, k) => {
      f.tabIndex = 0; f.setAttribute('role', 'button');
      f.setAttribute('aria-label', L('Открыть фото: ', 'Open photo: ') + f.dataset.alt);
      const open = () => LB.open(items, k, L('Фотографии окрестностей', 'Photos of the area'));
      f.addEventListener('click', e => { if (e.target.closest('a')) return; open(); });
      f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
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
  const ru = d => d.toLocaleDateString(EN ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long' });
  const dots = d => d.toLocaleDateString(EN ? 'en-GB' : 'ru-RU');
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
      const g = `${guests} ${plural(guests, 'гость', 'гостя', 'гостей', 'guest', 'guests')}`;
      const r = `${rooms} ${plural(rooms, 'номер', 'номера', 'номеров', 'room', 'rooms')}`;
      warnEl.hidden = true; brEl.innerHTML = ''; ready = false;
      seasonCards.forEach(c => c.classList.remove('active'));
      let total = 0;
      if (!din || !dout) {
        sumEl.textContent = L('Выберите даты — посчитаем стоимость.', 'Choose your dates to calculate the cost.');
      } else if (dout <= din) {
        sumEl.textContent = L('Проверьте даты', 'Check the dates');
        warnEl.hidden = false; warnEl.textContent = L('Дата выезда должна быть позже даты заезда.', 'Check-out must be after check-in.');
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
        const n = `${nights} ${plural(nights, 'ночь', 'ночи', 'ночей', 'night', 'nights')}`;
        sumEl.textContent = `${ru(din)} — ${ru(dout)} · ${n} · ${g}` + (rooms > 1 ? ` · ${r}` : '');
        [...groups.entries()].sort((a, b) => a[0] - b[0]).forEach(([p, c]) => {
          const li = document.createElement('li');
          li.textContent = `${c} ${plural(c, 'ночь', 'ночи', 'ночей', 'night', 'nights')} × ${money(p)} ₽` + (rooms > 1 ? ` × ${r}` : '');
          brEl.append(li);
        });
        if (off) {
          warnEl.hidden = false;
          warnEl.textContent = `${off} ${plural(off, 'ночь', 'ночи', 'ночей', 'night', 'nights')} ` + L('вне сезона (мы принимаем гостей с 1 мая по 31 октября) — их не посчитали. Напишите нам, уточним.', 'fall outside the season (we host guests from 1 May to 31 October) and are not counted. Message us and we will help.');
        }
        ready = true;
        msg = [
          L('Здравствуйте! Хочу уточнить наличие свободного номера в гостевом доме «Холодная речка».', 'Hello! I would like to check availability at the Kholodnaya Rechka guest house.'),
          L(`Заезд: ${dots(din)}, выезд: ${dots(dout)} — ${n}.`, `Check-in: ${dots(din)}, check-out: ${dots(dout)} — ${n}.`),
          L(`Гостей: ${guests} (${r}).`, `Guests: ${guests} (${r}).`),
          total ? L(`Расчёт на сайте: ${money(total)} ₽.`, `Price from the website: ${money(total)} RUB.`) : '',
          name ? L(`Меня зовут ${name}.`, `My name is ${name}.`) : '',
          L('Есть ли свободные номера на эти даты?', 'Is a room available for these dates?'),
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
      toast(L('Сначала выберите даты заезда и выезда', 'Please choose check-in and check-out dates first'));
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
      const text = ready ? msg : L('Здравствуйте! Хочу узнать о свободных номерах в гостевом доме «Холодная речка».', 'Hello! I would like to ask about free rooms at the Kholodnaya Rechka guest house.');
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { /* no clipboard */ }
      toast(ok ? L('Текст сообщения скопирован — вставьте его в чат Telegram', 'Message copied — paste it into the Telegram chat') : L('Напишите нам в Telegram: @', 'Message us on Telegram: @') + TG);
      setTimeout(() => window.open('https://t.me/' + TG, '_blank', 'noopener'), ok ? 650 : 900);
    });
    compute();

    // quick dates card under the hero: fills the calculator and jumps to the result
    const quick = $('[data-quick]');
    if (quick) {
      const qIn = $('[data-q-in]', quick), qOut = $('[data-q-out]', quick), qG = $('[data-q-guests]', quick);
      qIn.min = iso(today); qOut.min = iso(new Date(+today + 864e5));
      qIn.addEventListener('change', () => {
        const d = parse(qIn.value);
        if (!d) return;
        const o = parse(qOut.value);
        qOut.min = iso(new Date(+d + 864e5));
        if (!o || o <= d) qOut.value = iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
      });
      quick.addEventListener('submit', e => {
        e.preventDefault();
        if (!qIn.value || !qOut.value) {
          const f = qIn.value ? qOut : qIn;
          toast(L('Выберите даты заезда и выезда', 'Please choose check-in and check-out dates'));
          f.focus();
          try { f.showPicker(); } catch (err) { /* not supported */ }
          return;
        }
        inEl.value = qIn.value; outEl.value = qOut.value; outEl.min = qOut.min;
        guests = clamp(+qG.value || 2, 1, 12); guestsEl.textContent = guests;
        compute();
        $('.calc__result', calc).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      });
    }
  }

  /* ================= FAQ ================= */
  $$('.acc__item').forEach(it => {
    const q = $('.acc__q', it);
    q.addEventListener('click', () => {
      const open = !it.classList.contains('open');
      it.classList.toggle('open', open); q.setAttribute('aria-expanded', open);
    });
  });

})();
