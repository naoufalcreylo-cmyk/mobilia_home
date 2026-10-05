/* Mobilia Home — core: utilities, data access, persistent stores, analytics.
   In the Shopify theme, the data layer is replaced by Liquid-rendered markup + the
   Ajax Cart / Predictive Search APIs; the store and analytics modules are reused as-is. */

export const SITE = window.MOBILIA_SITE;
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").toLowerCase();
export const money = n => Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ') + ' DH';
export const pct = p => (p.cp ? Math.round((1 - p.p / p.cp) * 100) : 0);
export const params = () => new URLSearchParams(location.search);

/* --- Images ------------------------------------------------------------ */
const WIDTHS = [240, 360, 540, 720, 960, 1200, 1600, 2000];
export function imgUrl(src, w) {
  if (!src) return '';
  const u = src.startsWith('//') ? 'https:' + src : src;
  return u + (u.includes('?') ? '&' : '?') + 'width=' + w;
}
/** Responsive <img>. `sizes` must describe the rendered width so the browser picks the right file. */
export function img(src, { alt = '', sizes = '100vw', eager = false, max = 1600, w0 = 0, h0 = 0, cls = '' } = {}) {
  if (!src) return '';
  const ws = WIDTHS.filter(w => w <= max && (!w0 || w <= w0 * 1.05));
  if (!ws.length) ws.push(Math.min(max, w0 || max));
  const srcset = ws.map(w => `${imgUrl(src, w)} ${w}w`).join(', ');
  const dim = w0 && h0 ? ` width="${w0}" height="${h0}"` : '';
  return `<img src="${imgUrl(src, ws[Math.min(2, ws.length - 1)])}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}"${dim}` +
    `${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''}>`;
}
// Fade images in once decoded (prevents half-painted images; no layout shift since frames are ratio-locked)
document.addEventListener('load', e => { if (e.target.tagName === 'IMG') e.target.classList.add('is-loaded'); }, true);
export function markLoaded(root = document) { $$('img', root).forEach(i => { if (i.complete && i.naturalWidth) i.classList.add('is-loaded'); }); }

/* --- Data -------------------------------------------------------------- */
let DB;
export async function loadData() {
  if (DB) return DB;
  const res = await fetch('data/catalog.json');
  if (!res.ok) throw new Error('catalog ' + res.status);
  const raw = await res.json();
  const byHandle = new Map(raw.products.map(p => [p.h, p]));
  const cols = new Map(raw.collections.map(c => [c.h, c]));
  for (const [h, i] of Object.entries(SITE.imageOverrides || {})) {
    const p = byHandle.get(h);
    if (p && p.i[i]) p.i = [p.i[i], ...p.i.filter((_, k) => k !== i)];
  }
  DB = {
    nav: raw.nav, products: raw.products, byHandle, cols,
    get: h => byHandle.get(h),
    list: hs => hs.map(h => byHandle.get(h)).filter(Boolean),
    collection: h => (cols.get(h)?.ps || []).map(x => byHandle.get(x)).filter(Boolean),
    maxDiscount: h => Math.max(0, ...(cols.get(h)?.ps || []).map(x => byHandle.get(x)).filter(p => p && p.a).map(pct)),
  };
  return DB;
}
let DESC;
export async function loadDescriptions() {
  if (!DESC) DESC = fetch('data/descriptions.json').then(r => r.json()).catch(() => ({}));
  return DESC;
}

export const productUrl = p => `product.html?p=${encodeURIComponent(p.h)}`;
export const collectionUrl = h => `collection.html?c=${encodeURIComponent(h)}`;
export const liveProductUrl = p => `${SITE.shopUrl}/products/${p.h}`;

/* --- Persistent stores (localStorage, failure-tolerant) --------------- */
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const bus = new EventTarget();
export const on = (ev, fn) => bus.addEventListener(ev, e => fn(e.detail));
const emit = (ev, detail) => bus.dispatchEvent(new CustomEvent(ev, { detail }));

export const cart = {
  items: () => read('mobilia:cart', []),
  count() { return this.items().reduce((n, l) => n + l.q, 0); },
  add(h, q = 1) {
    const items = this.items(); const line = items.find(l => l.h === h);
    line ? (line.q = Math.min(99, line.q + q)) : items.push({ h, q });
    write('mobilia:cart', items); emit('cart', { action: 'add', h, q });
  },
  set(h, q) {
    let items = this.items();
    items = q <= 0 ? items.filter(l => l.h !== h) : items.map(l => (l.h === h ? { ...l, q: Math.min(99, q) } : l));
    write('mobilia:cart', items); emit('cart', { action: 'set', h, q });
  },
};
export const wishlist = {
  items: () => read('mobilia:wish', []),
  has(h) { return this.items().includes(h); },
  toggle(h) {
    const s = new Set(this.items()); s.has(h) ? s.delete(h) : s.add(h);
    write('mobilia:wish', [...s]); emit('wish', { h, on: s.has(h) }); return s.has(h);
  },
};
export const recent = {
  items: () => read('mobilia:recent', []),
  push(h) { write('mobilia:recent', [h, ...this.items().filter(x => x !== h)].slice(0, 12)); },
};

/* --- WhatsApp ---------------------------------------------------------- */
export const wa = text => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
export const waProduct = (p, q = 1) =>
  wa(`Bonjour Mobilia, je souhaite commander :\n• ${p.t}\n• Quantité : ${q}\n• Prix : ${money(p.p)}\n${liveProductUrl(p)}`);
export const waCart = lines =>
  wa('Bonjour Mobilia, je souhaite commander :\n' +
    lines.map(({ p, q }) => `• ${p.t} × ${q} — ${money(p.p * q)}\n  ${liveProductUrl(p)}`).join('\n') +
    `\nTotal : ${money(lines.reduce((s, { p, q }) => s + p.p * q, 0))}`);

/* --- Checkout: Shopify cart permalink on the live store ---------------- */
export const checkoutUrl = lines => `${SITE.shopUrl}/cart/${lines.map(({ p, q }) => `${p.vid}:${q}`).join(',')}`;

/* --- Analytics (GA4 ecommerce schema via dataLayer; GTM fans out to Meta/TikTok/Ads) */
window.dataLayer = window.dataLayer || [];
export const gaItem = (p, extra = {}) => ({
  item_id: String(p.vid), item_name: p.t, item_brand: 'Mobilia Home', item_category: p.c,
  price: p.p, discount: p.cp ? p.cp - p.p : 0, quantity: 1, ...extra,
});
export function track(event, ecommerce) {
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce: { currency: 'MAD', ...ecommerce } });
}
/* view_item_list fires once per list when it enters the viewport */
const seenLists = new WeakSet();
const listIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting || seenLists.has(e.target)) continue;
    seenLists.add(e.target); listIO.unobserve(e.target);
    const name = e.target.dataset.list;
    const items = $$('[data-handle]', e.target).map((el, i) => DB?.get(el.dataset.handle)).filter(Boolean)
      .map((p, i) => gaItem(p, { index: i, item_list_name: name }));
    if (items.length) track('view_item_list', { item_list_name: name, items });
  }
}, { threshold: .25 }) : null;
export const observeList = el => { if (listIO && el) listIO.observe(el); };

/* --- JSON-LD ----------------------------------------------------------- */
export function jsonld(obj) {
  const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
}

/* --- Complement compatibility ----------------------------------------- */
// A mattress suggested for a bed (or vice versa) must share the sleeping format, e.g. "160 × 200".
const sizeKey = d => ((d || '').match(/(\d{2,3}) × (\d{3})/) || []).slice(1).join('x');
export function compatible(base, cand, collectionHandle) {
  const sized = ['matelas', 'lits-adulte-1'];
  if (!sized.includes(collectionHandle) || !/^(Lit|Pack|Matelas)$/.test(base.c)) return true;
  const a = sizeKey(base.d);
  return !!a && a === sizeKey(cand.d);
}
