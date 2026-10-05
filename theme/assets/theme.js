/* Mobilia — global UI: layers (drawers/modals), header & mega menu, mobile menu, accordions, tabs,
   announcement, reveal, toast, wishlist, quick view, recently viewed, stores filter. No dependencies. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const M = window.Mobilia || {};
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  /* --- Layers: focus trap, Esc, scroll lock, focus restore ----------------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';
  let layer = null;
  function openLayer(el, focusSel) {
    closeLayer();
    const opener = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-locked');
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
      if (e.key !== 'Tab') return;
      const f = $$(FOCUSABLE, el).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    layer = { el, opener, onKey };
    setTimeout(() => ((focusSel && $(focusSel, el)) || $$(FOCUSABLE, el)[0])?.focus({ preventScroll: true }), 60);
  }
  function closeLayer() {
    if (!layer) return;
    const { el, opener, onKey } = layer;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('is-locked');
    document.removeEventListener('keydown', onKey);
    layer = null; opener?.focus?.({ preventScroll: true });
  }

  /* --- Toast ---------------------------------------------------------------- */
  let toastT;
  function toast(html) {
    const t = $('[data-toast]'); if (!t) return;
    t.innerHTML = html; t.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* --- Header: hide on scroll down, mega menu disclosure -------------------- */
  function initHeader() {
    const hdr = $('[data-header]'); if (!hdr) return;
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      hdr.classList.toggle('is-scrolled', y > 8);
      if (y < last - 4 || y < 400) { hdr.classList.remove('is-hidden'); document.body.classList.remove('header-hidden'); }
      else if (y > last + 4 && !hdr.classList.contains('is-open')) { hdr.classList.add('is-hidden'); document.body.classList.add('header-hidden'); }
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    let current = null, tOpen, tClose;
    const panel = b => document.getElementById(b.getAttribute('aria-controls'));
    const open = b => { if (current === b) return; close(false); current = b; b.setAttribute('aria-expanded', 'true'); panel(b).classList.add('is-open'); hdr.classList.add('is-open'); };
    const close = (all = true) => { if (!current) return; current.setAttribute('aria-expanded', 'false'); panel(current).classList.remove('is-open'); current = null; if (all) hdr.classList.remove('is-open'); };
    const fine = matchMedia('(hover: hover)');
    $$('.nav__link[aria-controls]').forEach(b => {
      const li = b.parentElement;
      b.addEventListener('click', () => (current === b ? close() : open(b)));
      li.addEventListener('mouseenter', () => { if (!fine.matches) return; clearTimeout(tClose); tOpen = setTimeout(() => open(b), current ? 0 : 140); });
      li.addEventListener('mouseleave', () => { if (!fine.matches) return; clearTimeout(tOpen); tClose = setTimeout(close, 180); });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) { const b = current; close(); b.focus(); } });
    document.addEventListener('click', e => { if (current && !e.target.closest('.nav__item')) close(); });
    hdr.addEventListener('focusout', e => { if (current && !hdr.contains(e.relatedTarget)) close(); });
  }

  /* --- Announcement rotation ----------------------------------------------- */
  function initAnnouncement() {
    const msgs = $$('.announce__msg'); if (msgs.length < 2) return;
    let i = 0, timer;
    const show = n => {
      msgs[i].classList.remove('is-active'); msgs[i].setAttribute('aria-hidden', 'true'); const a0 = $('a', msgs[i]); if (a0) a0.tabIndex = -1;
      i = (n + msgs.length) % msgs.length;
      msgs[i].classList.add('is-active'); msgs[i].removeAttribute('aria-hidden'); const a1 = $('a', msgs[i]); if (a1) a1.tabIndex = 0;
    };
    const play = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(i + 1), 5000); };
    $$('[data-ann]').forEach(b => b.addEventListener('click', () => { show(i + +b.dataset.ann); play(); }));
    const bar = $('.announce');
    bar.addEventListener('mouseenter', () => clearInterval(timer)); bar.addEventListener('mouseleave', play); bar.addEventListener('focusin', () => clearInterval(timer));
    play();
  }

  /* --- Tabs (selection, looks): roving tabindex + arrow keys ---------------- */
  function initTabs(root = document) {
    $$('[role="tablist"]', root).forEach(list => {
      const tabs = $$('[role="tab"]', list);
      const select = t => tabs.forEach(x => {
        const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(t));
        t.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); });
      });
    });
    $$('.look__spot', root).forEach(s => s.addEventListener('click', () => {
      const on = s.getAttribute('aria-expanded') !== 'true'; s.setAttribute('aria-expanded', on);
      document.getElementById(s.getAttribute('aria-controls'))?.classList.toggle('is-open', on);
    }));
  }

  /* --- Reveal-on-scroll (CSS disables motion when reduced) ------------------ */
  function initReveal(root = document) {
    const els = $$('.reveal:not(.is-in)', root);
    if (!('IntersectionObserver' in window)) return els.forEach(el => el.classList.add('is-in'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  /* --- Images fade in once decoded ----------------------------------------- */
  document.addEventListener('load', e => { if (e.target.tagName === 'IMG') e.target.classList.add('is-loaded'); }, true);
  const markLoaded = (root = document) => $$('img', root).forEach(i => { if (i.complete && i.naturalWidth) i.classList.add('is-loaded'); });

  /* --- Wishlist (per device) ------------------------------------------------ */
  const wish = {
    items: () => store.get('mobilia:wish', []),
    toggle(h) { const s = new Set(this.items()); s.has(h) ? s.delete(h) : s.add(h); store.set('mobilia:wish', [...s]); return s.has(h); },
  };
  function syncWish() {
    const items = wish.items();
    $$('[data-wish]').forEach(b => b.setAttribute('aria-pressed', items.includes(b.dataset.wish)));
    $$('[data-wish-count]').forEach(c => { c.textContent = items.length || ''; c.dataset.count = items.length; });
  }
  const fetchCard = h => fetch(`${M.routes.root}products/${encodeURIComponent(h)}?section_id=card-render`).then(r => (r.ok ? r.text() : '')).catch(() => '');
  async function renderHandles(grid, handles) {
    const html = await Promise.all(handles.map(fetchCard));
    grid.innerHTML = html.join('');
    syncWish(); markLoaded(grid); window.MobiliaAnalytics?.observeLists(grid.parentElement);
    return html.filter(Boolean).length;
  }
  async function initWishlistPage() {
    const grid = $('[data-wishlist-grid]'); if (!grid) return;
    const items = wish.items();
    const n = items.length ? await renderHandles(grid, items.slice(0, 24)) : 0;
    $('[data-wishlist-empty]').hidden = n > 0;
    const share = $('[data-wishlist-share]');
    if (share && n) {
      const a = $('a', share);
      a.href = `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(a.dataset.intro + '\n' + items.map(h => `${M.shopUrl}/products/${h}`).join('\n'))}`;
      share.hidden = false;
    }
  }

  /* --- Recently viewed ------------------------------------------------------ */
  async function initRecent() {
    const handle = $('[data-product]')?.dataset.handle;
    if (handle) store.set('mobilia:recent', [handle, ...store.get('mobilia:recent', []).filter(h => h !== handle)].slice(0, 12));
    const sec = $('[data-recently-viewed]'); if (!sec) return;
    const list = store.get('mobilia:recent', []).filter(h => h !== sec.dataset.exclude).slice(0, 4);
    if (!list.length) return;
    if (await renderHandles($('[data-recent-grid]', sec), list)) sec.hidden = false;
  }

  /* --- Quick view ------------------------------------------------------------ */
  async function openQuick(h) {
    const modal = $('[data-quick-modal]'); if (!modal) return;
    const slot = $('[data-qv]', modal);
    slot.innerHTML = '<div class="qv__media media skeleton"></div><div class="qv__info"><div class="sk-line"></div></div>';
    openLayer(modal, '[data-close].icon-btn');
    const res = await fetch(`${M.routes.root}products/${encodeURIComponent(h)}?section_id=quick-view`);
    if (!res.ok) { closeLayer(); location.href = `${M.routes.root}products/${h}`; return; }
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    slot.innerHTML = doc.querySelector('.shopify-section')?.innerHTML || '';
    markLoaded(slot);
  }

  /* --- Help button: after first screen, hidden near footer ------------------ */
  function initHelp() {
    const fab = $('[data-help-fab]'); const footer = $('.footer'); if (!fab) return;
    let near = false;
    const update = () => fab.classList.toggle('is-hidden', scrollY < innerHeight * 0.8 || near);
    if (footer) new IntersectionObserver(([e]) => { near = e.isIntersecting; update(); }).observe(footer);
    addEventListener('scroll', update, { passive: true }); update();
  }

  /* --- Global delegation ---------------------------------------------------- */
  document.addEventListener('click', e => {
    const t = e.target;
    const opener = t.closest('[data-open]');
    if (opener) {
      const id = opener.dataset.open;
      if (id === 'cart' && window.MobiliaCart) { e.preventDefault(); return window.MobiliaCart.open(); }
      if (id === 'search') { e.preventDefault(); return openLayer($('#search'), '#q'); }
      if (id === 'mnav') { e.preventDefault(); return openLayer($('#mnav'), '[data-close].icon-btn'); }
    }
    if (t.closest('[data-close]')) { closeLayer(); return; }
    const w = t.closest('[data-wish]');
    if (w) {
      e.preventDefault(); const on = wish.toggle(w.dataset.wish); syncWish();
      toast(`<svg aria-hidden="true"><use href="#i-heart"/></svg> ${on ? M.strings.addedToWishlist : M.strings.removedFromWishlist}`);
      if (on) window.dataLayer.push({ event: 'add_to_wishlist', item_handle: w.dataset.wish });
      return;
    }
    const q = t.closest('[data-quick]'); if (q) { e.preventDefault(); openQuick(q.dataset.quick); return; }
    const mt = t.closest('.mnav__toggle');
    if (mt) { const on = mt.getAttribute('aria-expanded') !== 'true'; mt.setAttribute('aria-expanded', on); document.getElementById(mt.getAttribute('aria-controls')).hidden = !on; return; }
    const acc = t.closest('.acc__btn');
    if (acc) { const item = acc.closest('.acc__item'); const on = acc.getAttribute('aria-expanded') !== 'true'; acc.setAttribute('aria-expanded', on); item.classList.toggle('is-open', on); $('.acc__panel', item).inert = !on; return; }
    const city = t.closest('[data-stores] button[data-city]');
    if (city) {
      $$('[data-stores] button[data-city]').forEach(b => b.setAttribute('aria-pressed', b === city));
      $$('[data-stores] .store').forEach(s => { s.hidden = !!city.dataset.city && s.dataset.city !== city.dataset.city; });
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initHeader(); initAnnouncement(); initTabs(); initReveal(); initHelp(); syncWish(); markLoaded();
    initWishlistPage(); initRecent();
    const msg = $('[data-newsletter-msg]');
    if (msg && /customer_posted=true/.test(location.search)) { msg.textContent = msg.dataset.success; window.dataLayer.push({ event: 'newsletter_signup' }); }
  });

  window.MobiliaUI = { openLayer, closeLayer, toast, markLoaded, initReveal, initTabs, syncWish };
})();
