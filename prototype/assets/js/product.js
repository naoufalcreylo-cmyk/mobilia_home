/* Mobilia Home — product page (templates/product.json + main-product section). */
import { SITE, $, $$, esc, money, pct, img, imgUrl, productUrl, collectionUrl, liveProductUrl, wishlist, recent, wa, waProduct, loadDescriptions, observeList, compatible, markLoaded, jsonld, track, gaItem, params } from './core.js';
import { icon } from './icons.js';
import { card, badges } from './card.js';
import { accordion, addToCart, reveal } from './ui.js';

let DB, P;
const CUSTOM_RE = /sur[\s-]mesure|personnalis/i;

function breadcrumbs(p) {
  for (const n of DB.nav) for (const g of n.groups || []) for (const [h, l] of g.items) {
    if (p.cl.includes(h)) return [[n.label, n.groups ? `collection.html?room=${n.id}` : collectionUrl(n.link)], [l, collectionUrl(h)]];
  }
  const nav = DB.nav.find(n => n.link && p.cl.includes(n.link));
  return nav ? [[nav.label, collectionUrl(nav.link)]] : [];
}

function gallery(p) {
  const imgs = p.i.length ? p.i : [];
  return `<div class="gallery${imgs.length < 2 ? ' gallery--single' : ''}" data-gallery tabindex="0" aria-label="Galerie photos, ${imgs.length} image${imgs.length > 1 ? 's' : ''}">
    ${imgs.map(([src, w, h], i) => `<figure class="gallery__item media" data-index="${i}">
      ${img(src, { alt: i ? `${p.c} ${p.n}, vue ${i + 1}` : `${p.c} ${p.n}`, sizes: i ? '(min-width:1024px) 29vw, 100vw' : '(min-width:1024px) 58vw, 100vw', eager: i === 0, max: 2000, w0: w, h0: h })}
      ${i === 0 ? `<button class="gallery__zoom" type="button" data-zoom="0" aria-label="Agrandir les photos">${icon('zoom')}</button>` : ''}
    </figure>`).join('')}
  </div>
  ${imgs.length > 1 ? `<div class="gallery__dots" aria-hidden="true">${imgs.map((_, i) => `<span${i ? '' : ' class="is-active"'}></span>`).join('')}</div>` : ''}`;
}

function perks(custom) {
  const items = [
    custom
      ? ['truck', 'Livraison partout au Maroc', 'Délai de fabrication confirmé par votre conseiller · livraison gratuite dans un rayon de 25 km dès 2 500 DH']
      : ['truck', 'Livraison express sous 48h', 'Partout au Maroc · gratuite dans un rayon de 25 km dès 2 500 DH'],
    ['tool', 'Montage offert', 'Par nos techniciens menuisiers'],
    ['shield', 'Paiement sécurisé', 'En ligne, par virement ou en magasin'],
    ['store', 'Voir en showroom', '<a href="index.html#magasins">Casablanca & Rabat</a> · 4 adresses'],
  ];
  return `<ul class="pdp__perks" role="list">${items.map(([i, t, d]) => `<li>${icon(i)}<div><strong>${t}</strong><span>${d}</span></div></li>`).join('')}</ul>`;
}

function info(p, desc) {
  const off = pct(p);
  const custom = p.cl.includes('salons-d-angle-sur-mesure') || desc.some(s => CUSTOM_RE.test(s.t) || /devis personnalisé/i.test(s.h));
  const crumbs = breadcrumbs(p);
  return `<div class="pdp__sticky">
    <div class="pdp__crumbs"><ol class="crumbs" role="list" aria-label="Fil d’Ariane"><li><a href="index.html">Accueil</a></li>${crumbs.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ol>
      <div class="card__badges" style="position:static">${badges(p)}</div></div>
    <div>
      <p class="label pdp__cat">${esc(p.c)}</p>
      <h1 class="h1 pdp__title">${esc(p.n)}</h1>
      ${p.tl ? `<p class="pdp__tl">${esc(p.tl)}</p>` : ''}
      ${p.d ? `<p class="pdp__dims">${icon('dims')}<span><span class="visually-hidden">Dimensions : </span>${esc(p.d)}</span></p>` : ''}
    </div>
    <div>
      <div class="pdp__price"><span class="price">${money(p.p)}</span>${p.cp ? `<s class="price price--compare"><span class="visually-hidden">Prix initial </span>${money(p.cp)}</s>` : ''}</div>
      ${p.cp ? `<p class="pdp__save"><span>Vous économisez <b>${money(p.cp - p.p)}</b></span><span class="badge badge--sale">−${off}&nbsp;%</span></p>` : ''}
      <p class="pdp__credit">Crédit gratuit ou classique possible · <a href="${wa(`Bonjour Mobilia, je souhaite des informations sur le crédit pour : ${p.t}\n${liveProductUrl(p)}`)}" target="_blank" rel="noopener" data-wa-context="credit">se renseigner</a></p>
    </div>
    <p class="pdp__stock">${p.a ? '<span class="dot"></span>Disponible — commande en ligne ou en showroom' : '<span class="dot dot--off"></span>Indisponible en ligne — contactez-nous pour un réassort'}</p>
    ${custom ? `<div class="pdp__custom">${icon('ruler')}<div><strong>Personnalisable sur mesure</strong>Dimensions, angle, coloris et tissus anti-taches.
      <a href="${wa(`Bonjour Mobilia, je souhaite un devis sur mesure pour : ${p.t}\nMes dimensions : …\n${liveProductUrl(p)}`)}" target="_blank" rel="noopener" data-wa-context="custom_quote">Demander un devis</a></div></div>` : ''}
    <div class="pdp__buy" data-buy>
      ${p.a ? `<div class="qty"><button type="button" data-step="-1" aria-label="Diminuer la quantité">${icon('minus', 'icon')}</button><input type="number" id="qty" min="1" max="99" value="1" aria-label="Quantité"><button type="button" data-step="1" aria-label="Augmenter la quantité">${icon('plus', 'icon')}</button></div>
      <button class="btn btn--block" type="button" data-add-main>Ajouter au panier</button>` : `<button class="btn btn--block" type="button" disabled style="grid-column:1/-1">Indisponible</button>`}
      <a class="btn btn--wa" href="${waProduct(p)}" target="_blank" rel="noopener" data-wa-product="${esc(p.h)}" data-wa-main>${icon('whatsapp', 'wa-icon')}${p.a ? 'Commander sur WhatsApp' : 'Être prévenu sur WhatsApp'}</a>
    </div>
    <button class="pdp__wish" type="button" data-wish="${esc(p.h)}" aria-pressed="${wishlist.has(p.h)}">${icon('heart')}Ajouter à mes favoris</button>
    ${perks(custom)}
    <div class="pdp__details">${accordion(details(p, desc), { open: 0, level: 2 })}</div>
  </div>`;
}

/* Accordion content: only sections that exist in Mobilia's own description, plus site-wide verified service info */
function details(p, desc) {
  const out = desc.map(s => ({ title: esc(s.t.replace(/\s*\(.*?\)\s*$/, '')), html: s.h }));
  if (!desc.length && p.d) out.push({ title: 'Dimensions', html: `<p>${esc(p.d)}</p>` });
  if (!desc.some(s => /livraison/i.test(s.t))) out.push({ title: 'Livraison & montage', html: `<p>Livraison express sous 48h, partout au Maroc. Livraison gratuite dans un rayon de 25 km dès 2 500 DH d’achat.</p><p>Montage gratuit par notre équipe de techniciens menuisiers.</p>` });
  out.push({ title: 'Service client & réclamations', html: `<p>Inspectez votre commande à la réception et contactez-nous immédiatement en cas de défaut. Notre service client est à votre écoute au <a href="tel:${SITE.phone.tel}">${SITE.phone.label}</a> et sur <a href="${wa(`Bonjour Mobilia (service réclamation) — ${p.t}`)}" target="_blank" rel="noopener">WhatsApp</a>.</p>` });
  return out;
}

/* "Complétez votre intérieur": rule-based complements (metafield mobilia.complements in Shopify) */
function complete(p) {
  const rule = SITE.complements[p.c]; if (!rule) return '';
  const labelOf = h => { for (const n of DB.nav) for (const g of n.groups || []) for (const [hh, l] of g.items) if (hh === h) return l; return DB.cols.get(h)?.t || h; };
  const seen = new Set([p.h]);
  const groups = rule.slice(0, 3).map(h => {
    const pick = DB.collection(h).filter(x => x.a && !seen.has(x.h) && x.i.length && compatible(p, x, h))
      .sort((a, b) => Math.abs(a.p - p.p * .35) - Math.abs(b.p - p.p * .35))[0]; // harmonious price point for the piece
    if (!pick) return '';
    seen.add(pick.h);
    return `<div class="complete__group"><span class="label">${esc(labelOf(h))}</span>${card(pick, { compact: true, list: 'complete_the_room', sizes: '(min-width:1024px) 20vw, 66vw' })}
      <a class="link-arrow" href="${collectionUrl(h)}">Tous les modèles ${icon('arrow')}</a></div>`;
  }).join('');
  if (!groups) return '';
  return `<section class="section section--linen" aria-labelledby="complete-title"><div class="container complete__grid">
    <div class="complete__intro"><span class="label">Conseil de nos stylistes</span><h2 class="h2" id="complete-title">Complétez votre <em>intérieur</em>.</h2>
      <p>Des pièces choisies pour accompagner ${esc(p.c.toLowerCase())} ${esc(p.n)} et composer une pièce cohérente.</p>
      <a class="btn btn--wa" style="margin-top:1.5rem" href="${wa(`Bonjour Mobilia, je m’intéresse à ${p.t}. Pouvez-vous m’aider à composer la pièce ?\n${liveProductUrl(p)}`)}" target="_blank" rel="noopener" data-wa-context="complete_room">${icon('whatsapp', 'wa-icon')}Composer avec un conseiller</a></div>
    <div class="complete__list" data-list="complete_the_room">${groups}</div>
  </div></section>`;
}

function recentlyViewed(p) {
  const list = DB.list(recent.items().filter(h => h !== p.h)).slice(0, 4);
  if (!list.length) return '';
  return `<section class="section" aria-labelledby="recent-title"><div class="container">
    <div class="section-head"><div><span class="label">Votre parcours</span><h2 class="h2" id="recent-title">Vus <em>récemment</em>.</h2></div></div>
    <div class="product-grid" data-list="recently_viewed">${list.map(x => card(x, { compact: true, list: 'recently_viewed' })).join('')}</div>
  </div></section>`;
}

function buybar(p) {
  return `<div class="buybar" data-buybar aria-hidden="true">
    <div class="buybar__info"><p>${esc(p.n)}</p><span class="price">${money(p.p)}</span></div>
    <a class="icon-btn" href="${waProduct(p)}" target="_blank" rel="noopener" aria-label="Commander sur WhatsApp" data-wa-product="${esc(p.h)}" tabindex="-1">${icon('whatsapp', 'wa-icon')}</a>
    ${p.a ? `<button class="btn" type="button" data-add-main tabindex="-1">Ajouter au panier</button>` : ''}
  </div>`;
}

/* --- Lightbox ---------------------------------------------------------- */
function lightbox(p) {
  return `<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photos ${esc(p.n)}" aria-hidden="true">
    <div class="lightbox__bar"><span data-lb-count></span><button class="icon-btn" type="button" data-lb-close aria-label="Fermer">${icon('close')}</button></div>
    <div class="lightbox__stage" data-lb-stage><img alt="" data-lb-img>
      ${p.i.length > 1 ? `<button class="icon-btn lightbox__nav lightbox__nav--prev" type="button" data-lb="-1" aria-label="Photo précédente">${icon('arrow-l')}</button>
      <button class="icon-btn lightbox__nav lightbox__nav--next" type="button" data-lb="1" aria-label="Photo suivante">${icon('arrow')}</button>` : ''}</div>
    ${p.i.length > 1 ? `<div class="lightbox__thumbs">${p.i.map(([s], i) => `<button type="button" data-lb-go="${i}" aria-label="Photo ${i + 1}"><img src="${imgUrl(s, 160)}" alt=""></button>`).join('')}</div>` : '<div></div>'}
  </div>`;
}
function bindLightbox(p) {
  const lb = $('#lightbox'); const stage = $('[data-lb-stage]'); const im = $('[data-lb-img]');
  let idx = 0, opener;
  const show = i => {
    idx = (i + p.i.length) % p.i.length; stage.classList.remove('is-zoomed');
    im.src = imgUrl(p.i[idx][0], 2000); im.alt = `${p.c} ${p.n}, photo ${idx + 1}`;
    $('[data-lb-count]').textContent = `${idx + 1} / ${p.i.length}`;
    $$('[data-lb-go]').forEach((b, k) => b.setAttribute('aria-current', k === idx));
  };
  const open = i => { opener = document.activeElement; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('is-locked'); $('[data-lb-close]').focus(); };
  const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('is-locked'); opener?.focus(); };
  $$('.gallery__item').forEach(f => f.addEventListener('click', () => open(+f.dataset.index)));
  lb.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-lb-close]')) return close();
    if (t.closest('[data-lb]')) return show(idx + +t.closest('[data-lb]').dataset.lb);
    if (t.closest('[data-lb-go]')) return show(+t.closest('[data-lb-go]').dataset.lbGo);
    if (t === im) {
      const r = im.getBoundingClientRect();
      im.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100) + '%'); im.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100) + '%');
      stage.classList.toggle('is-zoomed');
    }
  });
  stage.addEventListener('mousemove', e => {
    if (!stage.classList.contains('is-zoomed')) return;
    const r = stage.getBoundingClientRect();
    im.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100) + '%'); im.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100) + '%');
  });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'Tab') { const f = $$('button', lb).filter(b => b.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
  // touch swipe inside the lightbox
  let x0 = null;
  stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => { if (x0 == null || stage.classList.contains('is-zoomed')) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
}

export async function mountProduct(db) {
  DB = db;
  P = DB.get(params().get('p'));
  if (!P) {
    document.title = 'Produit introuvable — Mobilia Home';
    $('#main').innerHTML = `<div class="error-state"><div><p class="display">404</p><h1 class="h2">Ce produit n’est plus disponible.</h1>
      <p>Il a peut-être été retiré de la collection. Découvrez des pièces similaires dans nos univers.</p>
      <div class="empty-state__links">${SITE.rooms.map(r => `<a class="chip" href="${r.href}">${esc(r.title)}</a>`).join('')}</div></div></div>`;
    return;
  }
  const p = P;
  const desc = (await loadDescriptions())[p.h] || [];
  document.title = `${p.c} ${p.n}${p.d ? ' ' + p.d : ''} — Mobilia Home`;
  $('meta[name="description"]').content = `${p.t} à ${money(p.p)} chez Mobilia Home. Livraison partout au Maroc, montage offert.`;

  $('#main').innerHTML = `<div class="pdp container">
    <div class="pdp__grid">
      <div class="pdp__gallery">${gallery(p)}</div>
      <div class="pdp__info">${info(p, desc)}</div>
    </div>
  </div>
  <div style="height:clamp(3rem, 2rem + 4vw, 6rem)"></div>
  ${complete(p)}
  ${recentlyViewed(p)}
  ${lightbox(p)}`;
  document.body.insertAdjacentHTML('beforeend', buybar(p));
  document.body.classList.add('has-buybar');
  $('.help-fab')?.remove();

  recent.push(p.h);
  track('view_item', { value: p.p, items: [gaItem(p)] });
  $$('[data-list]').forEach(observeList);

  // Quantity & primary actions
  const qty = $('#qty');
  const syncWa = () => $$('[data-wa-product]').forEach(a => (a.href = waProduct(p, +(qty?.value || 1))));
  $('#main').addEventListener('click', e => {
    const s = e.target.closest('[data-step]');
    if (s && qty) { qty.value = Math.max(1, Math.min(99, +qty.value + +s.dataset.step)); syncWa(); }
  });
  qty?.addEventListener('change', () => { qty.value = Math.max(1, Math.min(99, +qty.value || 1)); syncWa(); });
  document.addEventListener('click', e => { if (e.target.closest('[data-add-main]')) addToCart(p.h, +(qty?.value || 1), 'product_page'); });

  // Mobile gallery dots
  const g = $('[data-gallery]'); const dots = $$('.gallery__dots span');
  if (dots.length) g.addEventListener('scroll', () => { const i = Math.round(g.scrollLeft / g.clientWidth); dots.forEach((d, k) => d.classList.toggle('is-active', k === i)); }, { passive: true });

  // Sticky buy bar appears once the main CTA leaves the viewport (mobile/tablet)
  const bar = $('[data-buybar]');
  new IntersectionObserver(([en]) => {
    const on = !en.isIntersecting && en.boundingClientRect.top < 0;
    bar.classList.toggle('is-on', on); bar.setAttribute('aria-hidden', !on);
    $$('a,button', bar).forEach(el => (el.tabIndex = on ? 0 : -1));
  }).observe($('[data-buy]'));

  bindLightbox(p);
  markLoaded(); reveal();

  jsonld({
    '@context': 'https://schema.org', '@type': 'Product', name: p.t, sku: String(p.vid), brand: { '@type': 'Brand', name: 'Mobilia Home' },
    image: p.i.map(([s]) => 'https:' + s.replace(/^https:/, '')), category: p.c, url: liveProductUrl(p),
    description: (desc[0]?.h || p.t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500),
    offers: { '@type': 'Offer', price: p.p, priceCurrency: 'MAD', availability: p.a ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: liveProductUrl(p), seller: { '@type': 'Organization', name: 'Mobilia Home' } },
  });
  jsonld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Accueil', SITE.shopUrl], ...breadcrumbs(p).map(([l]) => [l, SITE.shopUrl]), [p.n, liveProductUrl(p)]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
}
