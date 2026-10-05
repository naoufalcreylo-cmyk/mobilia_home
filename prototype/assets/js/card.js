/* Product card — mirrors snippets/product-card.liquid in the theme. */
import { esc, img, money, pct, productUrl, wishlist } from './core.js';
import { icon } from './icons.js';

const NEW = 'nouvelle-collection-1';
const CUSTOM = 'salons-d-angle-sur-mesure';

export function badges(p) {
  const b = [];
  if (!p.a) b.push('<span class="badge badge--muted">Indisponible en ligne</span>');
  else if (p.cl.includes(NEW)) b.push('<span class="badge badge--dot">Nouveau</span>');
  else if (p.cl.includes(CUSTOM)) b.push('<span class="badge">Sur mesure</span>');
  return b.join('');
}

export function priceHtml(p, { showOff = true } = {}) {
  const off = pct(p);
  return `<span class="price">${money(p.p)}</span>` +
    (p.cp ? `<s class="price price--compare"><span class="visually-hidden">Prix initial </span>${money(p.cp)}</s>` : '') +
    (showOff && off >= 5 ? `<span class="card__off">−${off}&nbsp;%</span>` : '');
}

/**
 * @param p product
 * @param o.sizes   rendered width hint for srcset
 * @param o.eager   above-the-fold image
 * @param o.compact smaller title (secondary lists)
 * @param o.list    analytics list name (select_item)
 */
export function card(p, o = {}) {
  if (!p) return '';
  const sizes = o.sizes || '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';
  const [a, b] = p.i;
  const alt = `${p.c} ${p.n}`;
  const wished = wishlist.has(p.h);
  return `<article class="card${p.a ? '' : ' card--soldout'}${o.compact ? ' card--compact' : ''}${o.reveal ? ' reveal' : ''}" data-handle="${esc(p.h)}"${o.list ? ` data-list-name="${esc(o.list)}"` : ''}>
  <div class="card__mediawrap">
    <a class="card__media media" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">
      ${img(a?.[0], { alt, sizes, eager: o.eager, max: 1200, w0: a?.[1], h0: a?.[2] })}
      ${b ? img(b[0], { alt: '', sizes, max: 1200, w0: b[1], h0: b[2], cls: 'card__alt' }) : ''}
    </a>
    <div class="card__badges">${badges(p)}</div>
    <button class="icon-btn card__wish" type="button" data-wish="${esc(p.h)}" aria-pressed="${wished}" aria-label="${wished ? 'Retirer des' : 'Ajouter aux'} favoris : ${esc(p.n)}">${icon('heart')}</button>
    ${p.a ? `<button class="card__quick" type="button" data-quick="${esc(p.h)}">${icon('eye')}Aperçu rapide</button>` : ''}
  </div>
  <div class="card__body">
    <p class="card__cat label">${esc(p.c)}</p>
    <h3 class="card__title"><a href="${productUrl(p)}">${esc(p.n)}</a></h3>
    ${p.tl && !o.compact ? `<p class="card__tl">${esc(p.tl)}</p>` : ''}
    ${p.d ? `<p class="card__dims">${esc(p.d)}</p>` : ''}
    <p class="card__price">${priceHtml(p)}</p>
  </div>
</article>`;
}

export function skeletons(n) {
  return Array.from({ length: n }, () =>
    '<div class="card skeleton" aria-hidden="true"><div class="card__media media"></div><div class="sk-line"></div><div class="sk-line"></div></div>').join('');
}
