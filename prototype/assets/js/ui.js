/* Mobilia Home — global chrome & interactions.
   Theme equivalents: sections/announcement-bar, sections/header (+ snippets/mega-menu),
   snippets/drawer-menu, snippets/predictive-search, snippets/cart-drawer, sections/footer. */
import {
  SITE, $, $$, esc, norm, money, pct, img, productUrl, collectionUrl, cart, wishlist, on, wa, waProduct, waCart,
  checkoutUrl, track, gaItem, markLoaded, compatible,
} from './core.js';
import { icon } from './icons.js';
import { card, priceHtml } from './card.js';

let DB;
const LOGO = 'assets/logo-mobilia.png';

/* ---------------------------------------------------------------------- */
/* Focus management for drawers & modals                                   */
/* ---------------------------------------------------------------------- */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
let openLayer = null;
function openLayerEl(el, { focus, onClose } = {}) {
  closeLayer();
  const opener = document.activeElement;
  el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('is-locked');
  const trap = e => {
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, el).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  };
  document.addEventListener('keydown', trap);
  openLayer = { el, opener, trap, onClose };
  setTimeout(() => (focus ? $(focus, el) : $$(FOCUSABLE, el)[0])?.focus({ preventScroll: true }), 60);
}
export function closeLayer() {
  if (!openLayer) return;
  const { el, opener, trap, onClose } = openLayer;
  el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('is-locked');
  document.removeEventListener('keydown', trap);
  openLayer = null; onClose?.();
  opener?.focus?.({ preventScroll: true });
}

/* ---------------------------------------------------------------------- */
/* Announcement bar                                                        */
/* ---------------------------------------------------------------------- */
function announcement() {
  const max = DB.maxDiscount('super-deals');
  const msgs = SITE.announcements
    .filter(m => !m.text.includes('{superDealsMax}') || max >= 10)
    .map(m => ({ ...m, text: m.text.replace('{superDealsMax}', max) }));
  return `<div class="announce" role="region" aria-label="Annonces">
  <div class="container announce__inner">
    <button class="announce__nav" type="button" data-ann="-1" aria-label="Annonce précédente">${icon('chev-l')}</button>
    <div class="announce__track" aria-live="polite">
      ${msgs.map((m, i) => `<p class="announce__msg${i ? '' : ' is-active'}"${i ? ' aria-hidden="true"' : ''}><a href="${m.href}"${i ? ' tabindex="-1"' : ''}>${m.text}</a></p>`).join('')}
    </div>
    <button class="announce__nav" type="button" data-ann="1" aria-label="Annonce suivante">${icon('chev-r')}</button>
    <div class="announce__side">
      <a href="index.html#magasins">Nos magasins</a>
      <a href="tel:${SITE.phone.tel}">${SITE.phone.label}</a>
    </div>
  </div>
</div>`;
}
function bindAnnouncement() {
  const msgs = $$('.announce__msg'); if (msgs.length < 2) return;
  let i = 0, timer;
  const show = n => {
    msgs[i].classList.remove('is-active'); msgs[i].setAttribute('aria-hidden', 'true'); $('a', msgs[i]).tabIndex = -1;
    i = (n + msgs.length) % msgs.length;
    msgs[i].classList.add('is-active'); msgs[i].removeAttribute('aria-hidden'); $('a', msgs[i]).tabIndex = 0;
  };
  const play = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(i + 1), 5000); };
  $$('[data-ann]').forEach(b => b.addEventListener('click', () => { show(i + +b.dataset.ann); play(); }));
  const bar = $('.announce');
  bar.addEventListener('mouseenter', () => clearInterval(timer)); bar.addEventListener('mouseleave', play);
  bar.addEventListener('focusin', () => clearInterval(timer));
  play();
}

/* ---------------------------------------------------------------------- */
/* Header + mega menu                                                      */
/* ---------------------------------------------------------------------- */
const colCount = h => DB.cols.get(h)?.n ?? 0;
/* Clean merchandising label for a collection (nav label first, then the Shopify title) */
export function colLabel(h) {
  for (const n of DB.nav) { if (n.link === h) return n.label; for (const g of n.groups || []) for (const [hh, l] of g.items) if (hh === h) return l; }
  return DB.cols.get(h)?.t || h;
}
function megaPanel(item) {
  const groups = item.groups.map(g => `<div class="mega__group">
      <h3 class="label">${esc(g.title)}</h3>
      <ul class="mega__list" role="list">${g.items.map(([h, l]) =>
        `<li><a href="${collectionUrl(h)}">${esc(l)}<span>${colCount(h)}</span></a></li>`).join('')}</ul>
    </div>`).join('');
  const f = item.feature; const fp = DB.get(f.handle);
  const [h2, l2] = (item.groups[1] || item.groups[0]).items[item.groups[1] ? 0 : 1] || [];
  const second = h2 && DB.cols.get(h2);
  const secondImg = second && (second.img || DB.collection(h2).find(p => p.a && p.i.length)?.i[0][0]);
  const roomLink = { salon: 'collection.html?room=salon', sejour: 'collection.html?room=sejour', chambre: 'collection.html?room=chambre', rangement: collectionUrl('rangements') }[item.id];
  return `<div class="mega" id="mega-${item.id}" role="region" aria-label="${esc(item.label)}">
  <div class="container mega__inner">
    <div class="mega__groups${item.groups.length === 1 ? ' mega__groups--single' : ''}">
      ${groups}
      <div class="mega__all"><a class="link-arrow" href="${roomLink}">Tout l’univers ${esc(item.label.toLowerCase())} ${icon('arrow', 'i-arrow')}</a></div>
    </div>
    ${fp ? `<a class="mega__feature" href="${collectionUrl(f.link)}" style="grid-column: 7 / span 3">
      <div class="media">${img(fp.i[0][0], { alt: '', sizes: '22vw', max: 720 })}</div>
      <span class="label muted">${esc(f.eyebrow)}</span><span class="mega__feature-title">${esc(f.title)}</span></a>` : ''}
    ${secondImg ? `<a class="mega__feature" href="${collectionUrl(second.h)}" style="grid-column: 10 / span 3">
      <div class="media">${img(secondImg, { alt: '', sizes: '22vw', max: 720 })}</div>
      <span class="label muted">${colCount(second.h)} pièces</span><span class="mega__feature-title">${esc(l2)}</span></a>` : ''}
  </div>
</div>`;
}
function header() {
  const nav = DB.nav.map(item => item.groups
    ? `<li class="nav__item"><button class="nav__link" type="button" aria-expanded="false" aria-controls="mega-${item.id}">${esc(item.label)}</button>${megaPanel(item)}</li>`
    : `<li class="nav__item"><a class="nav__link${item.id === 'outlet' ? ' nav__link--outlet' : ''}" href="${collectionUrl(item.link)}">${esc(item.label)}</a></li>`).join('');
  return `<header class="header" data-header>
  <div class="container header__inner">
    <button class="icon-btn header__menu" type="button" data-open="mnav" aria-label="Menu" aria-controls="mnav">${icon('menu')}</button>
    <a class="header__logo" href="index.html" aria-label="Mobilia Home — accueil"><img src="${LOGO}" alt="Mobilia Home" width="600" height="236"></a>
    <nav class="header__nav" aria-label="Navigation principale"><ul class="nav" role="list">${nav}</ul></nav>
    <div class="header__utils">
      <a class="header__text-link" href="index.html#magasins">${icon('pin')}Magasins</a>
      <button class="icon-btn" type="button" data-open="search" aria-label="Rechercher" aria-controls="search">${icon('search')}</button>
      <a class="icon-btn header__util--desktop" href="${SITE.shopUrl}/account" aria-label="Mon compte">${icon('user')}</a>
      <a class="icon-btn header__util--desktop" href="collection.html?list=favoris" aria-label="Favoris">${icon('heart')}<span class="count" data-wish-count></span></a>
      <button class="icon-btn" type="button" data-open="cart" aria-label="Panier" aria-controls="cart">${icon('bag')}<span class="count" data-cart-count></span></button>
    </div>
  </div>
</header>`;
}
function bindHeader() {
  const hdr = $('[data-header]');
  let last = scrollY;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-scrolled', y > 8);
    const hide = y > 400 && y > last + 4 && !hdr.classList.contains('is-open');
    if (y < last - 4 || y < 400) { hdr.classList.remove('is-hidden'); document.body.classList.remove('header-hidden'); }
    else if (hide) { hdr.classList.add('is-hidden'); document.body.classList.add('header-hidden'); }
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const btns = $$('.nav__link[aria-controls]');
  let current = null, tOpen, tClose;
  const open = b => {
    if (current === b) return; close(false);
    current = b; b.setAttribute('aria-expanded', 'true'); $('#' + b.getAttribute('aria-controls')).classList.add('is-open');
    hdr.classList.add('is-open'); markLoaded($('#' + b.getAttribute('aria-controls')));
  };
  const close = (all = true) => {
    if (!current) return;
    current.setAttribute('aria-expanded', 'false'); $('#' + current.getAttribute('aria-controls')).classList.remove('is-open');
    current = null; if (all) hdr.classList.remove('is-open');
  };
  const fine = matchMedia('(hover: hover)');
  btns.forEach(b => {
    const li = b.parentElement;
    b.addEventListener('click', () => (current === b ? close() : open(b)));
    li.addEventListener('mouseenter', () => { if (!fine.matches) return; clearTimeout(tClose); tOpen = setTimeout(() => open(b), current ? 0 : 140); });
    li.addEventListener('mouseleave', () => { if (!fine.matches) return; clearTimeout(tOpen); tClose = setTimeout(close, 180); });
  });
  $$('.nav__item:not(:has([aria-controls]))').forEach(li => li.addEventListener('mouseenter', () => { clearTimeout(tOpen); close(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) { const b = current; close(); b.focus(); } });
  document.addEventListener('click', e => { if (current && !e.target.closest('.nav__item')) close(); });
  hdr.addEventListener('focusout', e => { if (current && !hdr.contains(e.relatedTarget)) close(); });
}

/* ---------------------------------------------------------------------- */
/* Mobile navigation drawer                                                */
/* ---------------------------------------------------------------------- */
function mobileNav() {
  const rooms = DB.nav.map(item => {
    if (!item.groups) return `<li><a class="mnav__link" href="${collectionUrl(item.link)}">${esc(item.label)}${icon('arrow', 'icon')}</a></li>`;
    const fp = DB.get(item.feature.handle);
    return `<li><button class="mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-${item.id}">${esc(item.label)}${icon('plus')}</button>
    <div class="mnav__panel" id="mnav-${item.id}" hidden>
      ${item.groups.map(g => `<h3 class="label">${esc(g.title)}</h3><ul role="list">${g.items.map(([h, l]) =>
        `<li><a href="${collectionUrl(h)}">${esc(l)}<span>${colCount(h)}</span></a></li>`).join('')}</ul>`).join('')}
      ${fp ? `<a class="mnav__feature" href="${collectionUrl(item.feature.link)}"><div class="media">${img(fp.i[0][0], { alt: '', sizes: '96px', max: 240 })}</div>
        <span><span class="label muted">${esc(item.feature.eyebrow)}</span><br><span class="h4">${esc(item.feature.title)}</span></span></a>` : ''}
    </div></li>`;
  }).join('');
  return `<div class="drawer drawer--left" id="mnav" aria-hidden="true">
  <div class="drawer__overlay" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer__head"><img src="${LOGO}" alt="Mobilia Home" width="110" height="43" style="width:110px">
      <button class="icon-btn" type="button" data-close aria-label="Fermer le menu">${icon('close')}</button></div>
    <div class="drawer__body mnav__body">
      <ul class="mnav__rooms" role="list">${rooms}</ul>
      <div class="mnav__util">
        <a href="index.html#magasins">${icon('pin')}Nos magasins</a>
        <a href="${wa('Bonjour Mobilia, j’aimerais être conseillé(e) pour mon intérieur.')}" target="_blank" rel="noopener">${icon('whatsapp')}Conseil déco sur WhatsApp</a>
        <a href="collection.html?list=favoris">${icon('heart')}Mes favoris</a>
        <a href="${SITE.shopUrl}/account">${icon('user')}Mon compte</a>
        <a href="tel:${SITE.phone.tel}">${icon('phone')}${SITE.phone.label}</a>
      </div>
    </div>
  </div>
</div>`;
}

/* ---------------------------------------------------------------------- */
/* Predictive search                                                       */
/* ---------------------------------------------------------------------- */
const POPULAR = [['salons-d-angle-sur-mesure', 'Salon d’angle'], ['table-a-manger-1', 'Table à manger'], ['lits-adulte-1', 'Lit adulte'], ['table-basse-1', 'Table basse'], ['packs', 'Packs'], ['meuble-tv-1', 'Meuble TV']];
function searchLayer() {
  return `<div class="search" id="search" aria-hidden="true">
  <div class="search__overlay" data-close></div>
  <div class="search__panel" role="dialog" aria-modal="true" aria-label="Recherche">
    <form class="container" action="collection.html" role="search" data-search-form>
      <div class="search__bar">${icon('search')}
        <label class="visually-hidden" for="q">Rechercher un meuble</label>
        <input class="search__input" id="q" name="q" type="search" placeholder="Salon, table, lit, Mona…" autocomplete="off" aria-controls="search-results" aria-describedby="search-status">
        <button class="icon-btn" type="button" data-close aria-label="Fermer la recherche">${icon('close')}</button>
      </div>
      <p class="visually-hidden" id="search-status" aria-live="polite"></p>
      <div id="search-results"></div>
    </form>
  </div>
</div>`;
}
export function searchProducts(q, pool = DB.products) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored = [];
  for (const p of pool) {
    const hay = norm(`${p.n} ${p.t} ${p.c} ${p.tl} ${p.h.replace(/-/g, ' ')}`);
    if (!terms.every(t => hay.includes(t))) continue;
    let s = 0; const n = norm(p.n), c = norm(p.c);
    terms.forEach(t => { if (n.startsWith(t)) s += 6; if (n.includes(t)) s += 3; if (c.includes(t)) s += 2; });
    if (p.a) s += 2; if (p.i.length > 1) s += .5; if (p.cl.includes('outlet-roches-noires')) s -= 4;
    scored.push([s, p]);
  }
  return scored.sort((a, b) => b[0] - a[0]).map(x => x[1]);
}
function renderSearch(q) {
  const box = $('#search-results'); const status = $('#search-status');
  const hl = (s) => { const t = norm(q).trim(); if (!t) return esc(s); const i = norm(s).indexOf(t); return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + t.length)) + '</mark>' + esc(s.slice(i + t.length)); };
  if (!q.trim()) {
    const recentP = DB.list(JSON.parse(localStorage.getItem('mobilia:recent') || '[]')).slice(0, 4);
    const sugg = recentP.length ? recentP : DB.list(SITE.selection[0].products).slice(0, 4);
    box.innerHTML = `<div class="search__results">
      <div class="search__col"><h3 class="label">Recherches populaires</h3><ul class="search__terms" role="list">${POPULAR.map(([h, l]) => `<li><a href="${collectionUrl(h)}">${l}<span>${colCount(h)}</span></a></li>`).join('')}</ul></div>
      <div class="search__col"><h3 class="label">${recentP.length ? 'Vus récemment' : 'Nos salons du moment'}</h3><div class="search__products">${sugg.map(miniProduct).join('')}</div></div>
    </div>`;
    status.textContent = ''; markLoaded(box); return;
  }
  const terms = norm(q);
  const navHandles = new Set(DB.nav.flatMap(n => [n.link, ...(n.groups || []).flatMap(g => g.items.map(i => i[0]))]).filter(Boolean));
  const cats = [...DB.cols.values()].filter(c => navHandles.has(c.h)).map(c => ({ ...c, t: colLabel(c.h) })).filter(c => c.n && (norm(c.t).includes(terms) || terms.split(' ').every(t => norm(c.t).includes(t)))).slice(0, 6);
  const res = searchProducts(q);
  status.textContent = `${res.length} produit${res.length > 1 ? 's' : ''} trouvé${res.length > 1 ? 's' : ''}`;
  if (!res.length && !cats.length) {
    box.innerHTML = `<div class="search__results"><div class="search__empty" style="grid-column:1/-1">
      <p class="h3">Aucun résultat pour « ${esc(q)} ».</p>
      <p class="muted" style="margin:.75rem 0 1.5rem">Vérifiez l’orthographe, essayez un terme plus général, ou décrivez-nous ce que vous cherchez.</p>
      <div class="empty-state__links" style="justify-content:flex-start">${POPULAR.slice(0, 4).map(([h, l]) => `<a class="chip" href="${collectionUrl(h)}">${l}</a>`).join('')}</div>
      <a class="btn btn--wa" style="margin-top:1.5rem" href="${wa(`Bonjour Mobilia, je recherche : ${q}`)}" target="_blank" rel="noopener">${icon('whatsapp', 'wa-icon')}Demander à un conseiller</a>
    </div></div>`;
    return;
  }
  box.innerHTML = `<div class="search__results">
    <div class="search__col"><h3 class="label">Catégories</h3><ul class="search__terms" role="list">${cats.map(c => `<li><a href="${collectionUrl(c.h)}"><span class="search__term">${hl(c.t)}</span><span>${c.n}</span></a></li>`).join('') || '<li class="muted small">Aucune catégorie correspondante</li>'}</ul></div>
    <div class="search__col"><h3 class="label">Produits</h3>
      <div class="search__products">${res.slice(0, 8).map(miniProduct).join('')}</div>
      ${res.length ? `<a class="btn btn--ghost search__all" href="collection.html?q=${encodeURIComponent(q)}">Voir les ${res.length} résultats ${icon('arrow', 'i-arrow')}</a>` : ''}
    </div></div>`;
  markLoaded(box);
}
const miniProduct = p => `<a class="search__product" href="${productUrl(p)}" data-handle="${esc(p.h)}">
  <div class="media">${img(p.i[0]?.[0], { alt: '', sizes: '(min-width:1024px) 15vw, 45vw', max: 540 })}</div>
  <p><span class="label muted" style="display:block;margin-bottom:.2rem">${esc(p.c)}</span>${esc(p.n)}<br><span class="price">${money(p.p)}</span></p></a>`;
function bindSearch() {
  const input = $('#q'); let t, lastQ = '';
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      renderSearch(input.value);
      if (input.value.trim().length > 2 && input.value !== lastQ) { lastQ = input.value; track('search', { search_term: input.value.trim() }); }
    }, 140);
  });
  $('[data-search-form]').addEventListener('submit', e => { if (!input.value.trim()) e.preventDefault(); });
}

/* ---------------------------------------------------------------------- */
/* Cart drawer                                                             */
/* ---------------------------------------------------------------------- */
function cartLayer() {
  return `<div class="drawer" id="cart" aria-hidden="true">
  <div class="drawer__overlay" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <div class="drawer__head"><h2 class="drawer__title" id="cart-title">Panier<sup data-cart-count-inline></sup></h2>
      <button class="icon-btn" type="button" data-close aria-label="Fermer le panier">${icon('close')}</button></div>
    <div class="drawer__body" data-cart-body></div>
    <div class="drawer__foot" data-cart-foot></div>
  </div>
</div>`;
}
const cartLines = () => cart.items().map(l => ({ p: DB.get(l.h), q: l.q })).filter(l => l.p);
function renderCart() {
  const lines = cartLines();
  const body = $('[data-cart-body]'), foot = $('[data-cart-foot]');
  const count = lines.reduce((n, l) => n + l.q, 0);
  $('[data-cart-count-inline]').textContent = count ? `(${count})` : '';
  if (!lines.length) {
    body.innerHTML = `<div class="empty-state">
      <div class="empty-state__mark">${icon('bag')}</div>
      <p class="h3">Votre panier attend sa première pièce.</p>
      <p>Commencez par une pièce de vie, ou laissez-nous vous conseiller.</p>
      <div class="empty-state__links">${SITE.rooms.slice(0, 4).map(r => `<a class="chip" href="${r.href}">${esc(r.title)}</a>`).join('')}</div>
    </div>`;
    foot.innerHTML = `<a class="btn btn--wa btn--block" href="${wa('Bonjour Mobilia, j’aimerais être conseillé(e).')}" target="_blank" rel="noopener">${icon('whatsapp', 'wa-icon')}Parler à un conseiller</a>`;
    return;
  }
  const total = lines.reduce((s, l) => s + l.p.p * l.q, 0);
  const saved = lines.reduce((s, l) => s + (l.p.cp ? (l.p.cp - l.p.p) * l.q : 0), 0);
  const th = SITE.freeShipping.threshold, left = Math.max(0, th - total);
  body.innerHTML = `<div class="cart-progress">
      ${left ? `Plus que <strong>${money(left)}</strong> pour la livraison offerte.` : `${icon('check', 'icon')} <strong>Livraison offerte</strong> dans un rayon de 25 km.`}
      <div class="cart-progress__bar" aria-hidden="true"><span style="width:${Math.min(100, total / th * 100)}%"></span></div>
      <small>${SITE.freeShipping.note}</small>
    </div>
    <ul role="list" style="list-style:none;margin:0;padding:0">${lines.map(({ p, q }) => `<li class="cart-line" data-handle="${esc(p.h)}">
      <a class="media" href="${productUrl(p)}">${img(p.i[0]?.[0], { alt: '', sizes: '96px', max: 240 })}</a>
      <div>
        <div class="cart-line__top"><div><p class="label muted" style="font-size:.625rem">${esc(p.c)}</p><a class="cart-line__name" href="${productUrl(p)}">${esc(p.n)}</a>${p.d ? `<p class="cart-line__meta">${esc(p.d)}</p>` : ''}</div>
          <div class="cart-line__price"><span class="price">${money(p.p * q)}</span>${p.cp ? `<s class="price price--compare small">${money(p.cp * q)}</s>` : ''}</div></div>
        <div class="cart-line__bottom">
          <div class="qty qty--sm"><button type="button" data-qty="-1" aria-label="Diminuer la quantité de ${esc(p.n)}">${icon('minus', 'icon')}</button><input type="number" min="0" max="99" value="${q}" aria-label="Quantité ${esc(p.n)}" data-qty-input><button type="button" data-qty="1" aria-label="Augmenter la quantité de ${esc(p.n)}">${icon('plus', 'icon')}</button></div>
          <button class="cart-line__remove" type="button" data-remove>Supprimer</button>
        </div>
      </div></li>`).join('')}</ul>
    ${upsell(lines)}`;
  foot.innerHTML = `<div class="cart-sum"><span>Sous-total</span><span class="price">${money(total)}</span></div>
    ${saved ? `<p class="cart-save">Vous économisez ${money(saved)}</p>` : ''}
    <p class="cart-note">Livraison et montage calculés à la validation. Paiement sécurisé, virement ou en magasin.</p>
    <div class="cart-actions">
      <a class="btn btn--block" href="${checkoutUrl(lines)}" data-checkout>Finaliser la commande ${icon('arrow', 'i-arrow')}</a>
      <a class="btn btn--wa btn--block" href="${waCart(lines)}" target="_blank" rel="noopener">${icon('whatsapp', 'wa-icon')}Commander sur WhatsApp</a>
    </div>`;
  markLoaded(body);
}
/* One discreet complementary suggestion, based on the first line's category rules */
function upsell(lines) {
  const first = lines[0].p; const rule = SITE.complements[first.c]; if (!rule) return '';
  const inCart = new Set(lines.map(l => l.p.h));
  const pick = DB.collection(rule[0]).find(p => p.a && !inCart.has(p.h) && p.p <= first.p && compatible(first, p, rule[0]));
  if (!pick) return '';
  return `<div class="cart-upsell"><h3 class="label">Pour compléter</h3>
    <div class="cart-upsell__item"><a class="media" href="${productUrl(pick)}">${img(pick.i[0]?.[0], { alt: '', sizes: '64px', max: 240 })}</a>
    <p><span class="label muted" style="font-size:.625rem">${esc(pick.c)}</span><br>${esc(pick.n)}<br><span class="price">${money(pick.p)}</span></p>
    <button class="icon-btn" type="button" data-add="${esc(pick.h)}" data-list="cart_upsell" aria-label="Ajouter ${esc(pick.n)} au panier">${icon('plus')}</button></div></div>`;
}
function bindCart() {
  const body = $('[data-cart-body]');
  body.addEventListener('click', e => {
    const line = e.target.closest('.cart-line'); if (!line) return;
    const h = line.dataset.handle; const cur = cart.items().find(l => l.h === h)?.q || 0;
    if (e.target.closest('[data-qty]')) cart.set(h, cur + +e.target.closest('[data-qty]').dataset.qty);
    if (e.target.closest('[data-remove]')) { const p = DB.get(h); track('remove_from_cart', { value: p.p * cur, items: [gaItem(p, { quantity: cur })] }); cart.set(h, 0); }
  });
  body.addEventListener('change', e => { if (e.target.matches('[data-qty-input]')) cart.set(e.target.closest('.cart-line').dataset.handle, +e.target.value || 0); });
  $('[data-cart-foot]').addEventListener('click', e => {
    if (!e.target.closest('[data-checkout]')) return;
    const lines = cartLines();
    track('begin_checkout', { value: lines.reduce((s, l) => s + l.p.p * l.q, 0), items: lines.map(({ p, q }) => gaItem(p, { quantity: q })) });
  });
}
export function openCart() {
  renderCart();
  openLayerEl($('#cart'), { focus: '[data-close].icon-btn' });
  const lines = cartLines();
  if (lines.length) track('view_cart', { value: lines.reduce((s, l) => s + l.p.p * l.q, 0), items: lines.map(({ p, q }) => gaItem(p, { quantity: q })) });
}

/* ---------------------------------------------------------------------- */
/* Quick view                                                              */
/* ---------------------------------------------------------------------- */
function quickLayer() {
  return `<div class="modal" id="quick" aria-hidden="true"><div class="modal__overlay" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="qv-title"><button class="icon-btn modal__close" type="button" data-close aria-label="Fermer">${icon('close')}</button><div data-qv style="display:contents"></div></div></div>`;
}
function openQuick(h) {
  const p = DB.get(h); if (!p) return;
  const off = pct(p);
  $('[data-qv]').innerHTML = `<div class="media qv__media">${img(p.i[0]?.[0], { alt: `${p.c} ${p.n}`, sizes: '(min-width:768px) 50vw, 100vw', max: 1200 })}</div>
  <div class="qv__info">
    <p class="label" style="color:var(--taupe)">${esc(p.c)}</p>
    <h2 class="h2" id="qv-title">${esc(p.n)}</h2>
    ${p.tl ? `<p class="muted">${esc(p.tl)}</p>` : ''}
    ${p.d ? `<p class="pdp__dims">${icon('dims')}${esc(p.d)}</p>` : ''}
    <div class="pdp__price">${priceHtml(p, { showOff: false })}</div>
    ${p.cp ? `<p class="pdp__save">Vous économisez <b>${money(p.cp - p.p)}</b> (−${off} %)</p>` : ''}
    <div class="cart-actions" style="margin-top:.5rem">
      <button class="btn btn--block" type="button" data-add="${esc(p.h)}" data-list="quick_view">Ajouter au panier</button>
      <a class="btn btn--wa btn--block" href="${waProduct(p)}" target="_blank" rel="noopener" data-wa-product="${esc(p.h)}">${icon('whatsapp', 'wa-icon')}Commander sur WhatsApp</a>
    </div>
    <a class="link-arrow" href="${productUrl(p)}">Voir tous les détails ${icon('arrow', 'i-arrow')}</a>
  </div>`;
  openLayerEl($('#quick'));
  markLoaded($('#quick'));
  track('view_item', { value: p.p, items: [gaItem(p, { item_list_name: 'quick_view' })] });
}

/* ---------------------------------------------------------------------- */
/* Footer                                                                  */
/* ---------------------------------------------------------------------- */
function footer() {
  const c = ([h, l]) => `<li><a class="link-u" href="${collectionUrl(h)}">${l}</a></li>`;
  return `<footer class="footer on-dark" id="contact">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand"><img src="${LOGO}" alt="Mobilia Home" width="600" height="236" loading="lazy">
        <p>Depuis 30 ans, Mobilia Home meuble les intérieurs marocains : salons, salles à manger, chambres et rangements, au prix d’usine, livrés et montés chez vous.</p></div>
      <div class="footer__news">
        <h2 class="h3">Rejoignez la famille Mobilia.</h2>
        <p>Promotions, nouveaux produits et soldes, directement dans votre boîte de réception.</p>
        <form class="footer__form" data-newsletter novalidate>
          <label class="visually-hidden" for="nl-email">Adresse e-mail</label>
          <input class="input" id="nl-email" type="email" name="email" placeholder="Votre adresse e-mail" autocomplete="email" required>
          <button class="btn btn--light" type="submit">S’inscrire</button>
        </form>
        <p class="footer__form-msg" role="status" data-newsletter-msg></p>
      </div>
    </div>
    <div class="footer__cols">
      <div><h3 class="label">Collections</h3><ul role="list">${[['salons-d-angle-sur-mesure', 'Salons'], ['table-a-manger-1', 'Salle à manger'], ['lits-adulte-1', 'Chambre'], ['lits-enfants', 'Chambre enfant'], ['rangements', 'Rangement'], ['espace-dexterieur', 'Jardin'], ['packs', 'Packs'], ['outlet-roches-noires', 'Outlet']].map(c).join('')}</ul></div>
      <div><h3 class="label">Mobilia</h3><ul role="list">
        <li><a class="link-u" href="index.html#magasins">Nos magasins</a></li>
        <li><a class="link-u" href="${SITE.shopUrl}/blogs/news">Blog</a></li>
        <li><a class="link-u" href="${SITE.shopUrl}/pages/mobilia-pro-votre-partenaire-pour-l-amenagement-de-bureaux-et-de-maisons">Mobilia Pro</a></li>
        <li><a class="link-u" href="${collectionUrl('fauteuil-et-chaise-de-bureau')}">Mobilia Office</a></li></ul></div>
      <div><h3 class="label">Services</h3><ul role="list">
        <li><a class="link-u" href="index.html#services">Livraison express</a></li>
        <li><a class="link-u" href="index.html#services">Montage gratuit</a></li>
        <li><a class="link-u" href="index.html#services">Home Décor</a></li>
        <li><a class="link-u" href="index.html#services">Crédit gratuit</a></li>
        <li><a class="link-u" href="index.html#services">My Wishlist</a></li></ul></div>
      <div><h3 class="label">Aide</h3><ul role="list">
        <li><a class="link-u" href="${SITE.shopUrl}/pages/contact">Contact</a></li>
        <li><a class="link-u" href="index.html#faq">Questions fréquentes</a></li>
        <li><a class="link-u" href="${SITE.shopUrl}/pages/refund-policy">Retours & remboursements</a></li>
        <li><a class="link-u" href="${SITE.shopUrl}/pages/terms-of-service">Conditions d’utilisation</a></li>
        <li><a class="link-u" href="${wa('Bonjour Mobilia (service réclamation)')}" target="_blank" rel="noopener">Service réclamation</a></li></ul></div>
      <div class="footer__contact"><h3 class="label">Nous contacter</h3><ul role="list">
        <li><span>Service client</span><a href="tel:${SITE.phone.tel}">${SITE.phone.label}</a></li>
        <li><span>WhatsApp</span><a href="${wa('Bonjour Mobilia')}" target="_blank" rel="noopener">+212 661 05 47 42</a></li>
        <li><span>E-mail</span><a href="mailto:${SITE.email}">${SITE.email}</a></li></ul>
        <div class="footer__social">${SITE.social.map(s => `<a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(s.id)}</a>`).join('')}</div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© ${new Date().getFullYear()} Mobilia Home. Tous droits réservés.</p>
      <div class="footer__legal"><a href="${SITE.shopUrl}/pages/privacy-policies">Confidentialité</a><a href="${SITE.shopUrl}/pages/terms-of-service">Conditions</a><a href="${SITE.shopUrl}/pages/refund-policy">Remboursement</a></div>
      <div class="footer__pay" aria-label="Moyens de paiement"><span>${icon('shield', 'icon')}&nbsp;Paiement sécurisé</span><span>Virement</span><span>En magasin</span></div>
    </div>
  </div>
  <div class="footer__wordmark" aria-hidden="true" data-text="Mobilia Home"></div>
</footer>`;
}

/* ---------------------------------------------------------------------- */
/* Toast, counts, global delegation                                        */
/* ---------------------------------------------------------------------- */
let toastT;
export function toast(html) {
  let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.innerHTML = html; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
}
function counts(bump) {
  const c = cart.count(), w = wishlist.items().length;
  $$('[data-cart-count]').forEach(el => { el.textContent = c || ''; el.dataset.count = c; if (bump === 'cart') { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
  $$('[data-wish-count]').forEach(el => { el.textContent = w || ''; el.dataset.count = w; });
}
export function addToCart(h, q = 1, list) {
  const p = DB.get(h); if (!p || !p.a) return;
  cart.add(h, q);
  track('add_to_cart', { value: p.p * q, items: [gaItem(p, { quantity: q, item_list_name: list })] });
  closeLayer(); openCart();
}

function bindGlobal() {
  document.addEventListener('click', e => {
    const t = e.target;
    const opener = t.closest('[data-open]');
    if (opener) {
      e.preventDefault(); const id = opener.dataset.open;
      if (id === 'cart') return openCart();
      if (id === 'search') { renderSearch($('#q').value); return openLayerEl($('#search'), { focus: '#q' }); }
      if (id === 'mnav') return openLayerEl($('#mnav'), { focus: '[data-close].icon-btn' });
    }
    if (t.closest('[data-close]')) { closeLayer(); return; }
    const add = t.closest('[data-add]'); if (add) { e.preventDefault(); addToCart(add.dataset.add, +(add.dataset.qty || 1), add.dataset.list); return; }
    const wish = t.closest('[data-wish]');
    if (wish) {
      e.preventDefault(); const h = wish.dataset.wish; const onState = wishlist.toggle(h); const p = DB.get(h);
      $$(`[data-wish="${CSS.escape(h)}"]`).forEach(b => { b.setAttribute('aria-pressed', onState); if (b.classList.contains('card__wish')) b.setAttribute('aria-label', `${onState ? 'Retirer des' : 'Ajouter aux'} favoris : ${p.n}`); });
      toast(`${icon('heart')} ${onState ? 'Ajouté à vos favoris' : 'Retiré de vos favoris'}`);
      if (onState) track('add_to_wishlist', { value: p.p, items: [gaItem(p)] });
      return;
    }
    const quick = t.closest('[data-quick]'); if (quick) { e.preventDefault(); openQuick(quick.dataset.quick); return; }
    const mt = t.closest('.mnav__toggle');
    if (mt) { const open = mt.getAttribute('aria-expanded') !== 'true'; mt.setAttribute('aria-expanded', open); $('#' + mt.getAttribute('aria-controls')).hidden = !open; if (open) markLoaded($('#' + mt.getAttribute('aria-controls'))); return; }
    const acc = t.closest('.acc__btn');
    if (acc) { const open = acc.getAttribute('aria-expanded') !== 'true'; acc.setAttribute('aria-expanded', open); const item = acc.closest('.acc__item'); item.classList.toggle('is-open', open); $('.acc__panel', item).inert = !open; return; }
    // select_item when a product card link is followed
    const cardLink = t.closest('.card a[href*="product.html"], .search__product, .look__row a');
    if (cardLink) {
      const el = cardLink.closest('[data-handle]'); const p = el && DB.get(el.dataset.handle);
      const list = cardLink.closest('[data-list]')?.dataset.list || 'search';
      if (p) track('select_item', { item_list_name: list, items: [gaItem(p, { item_list_name: list })] });
    }
    const waLink = t.closest('a[href^="https://wa.me"]');
    if (waLink) window.dataLayer.push({ event: 'whatsapp_click', whatsapp_context: waLink.dataset.waContext || (waLink.dataset.waProduct ? 'product' : 'general') });
  });
  on('cart', d => { counts(d.action === 'add' ? 'cart' : ''); if ($('#cart').classList.contains('is-open')) renderCart(); });
  on('wish', () => counts());
  counts();

  const nl = $('[data-newsletter]');
  nl?.addEventListener('submit', e => {
    e.preventDefault(); const input = $('input', nl); const msg = $('[data-newsletter-msg]');
    if (!input.checkValidity()) { msg.textContent = 'Merci de saisir une adresse e-mail valide.'; input.focus(); return; }
    msg.textContent = 'Merci ! Votre inscription est bien enregistrée.'; input.value = '';
    window.dataLayer.push({ event: 'newsletter_signup' });
  });
}

/* Reveal-on-scroll for editorial sections (disabled with reduced motion via CSS) */
export function reveal(root = document) {
  if (!('IntersectionObserver' in window)) { $$('.reveal', root).forEach(el => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal:not(.is-in)', root).forEach(el => io.observe(el));
}

/* Single contextual help button (hidden on PDP where the buy bar carries WhatsApp) */
function helpFab() {
  return `<aside aria-label="Aide"><a class="help-fab" aria-label="Besoin d’aide ? Écrire sur WhatsApp" href="${wa('Bonjour Mobilia, j’ai besoin d’aide.')}" target="_blank" rel="noopener" data-wa-context="help">${icon('whatsapp', 'wa-icon')}<span>Besoin d’aide ?</span></a></aside>`;
}
function bindFab() {
  const fab = $('.help-fab'); if (!fab) return;
  // Appears once the visitor has engaged (scrolled past the first screen); steps aside for the footer
  let nearFooter = false;
  const update = () => fab.classList.toggle('is-hidden', scrollY < innerHeight * .8 || nearFooter);
  new IntersectionObserver(([e]) => { nearFooter = e.isIntersecting; update(); }).observe($('.footer'));
  addEventListener('scroll', update, { passive: true }); update();
}

/** Accessible accordion (button + region). Closed panels are `inert` so hidden links aren't tabbable. */
let accId = 0;
export function accordion(items, { lg = false, open = -1, level = 3 } = {}) {
  return `<div class="acc${lg ? ' acc--lg' : ''}">${items.map((it, i) => {
    const id = 'acc-' + (++accId); const isOpen = i === open;
    return `<div class="acc__item${isOpen ? ' is-open' : ''}"><h${level} style="margin:0"><button class="acc__btn" type="button" aria-expanded="${isOpen}" aria-controls="${id}" id="${id}-b">${it.title}<span class="plus" aria-hidden="true"></span></button></h${level}>
    <div class="acc__panel" id="${id}" role="region" aria-labelledby="${id}-b"${isOpen ? '' : ' inert'}><div><div class="acc__content prose">${it.html}</div></div></div></div>`;
  }).join('')}</div>`;
}

export function mountChrome(db) {
  DB = db;
  $('#site-header').innerHTML = announcement() + header();
  $('#site-footer').innerHTML = footer();
  document.body.insertAdjacentHTML('beforeend', mobileNav() + searchLayer() + cartLayer() + quickLayer() + helpFab());
  bindAnnouncement(); bindHeader(); bindSearch(); bindCart(); bindGlobal(); bindFab();
  document.body.classList.add('has-header');
}
