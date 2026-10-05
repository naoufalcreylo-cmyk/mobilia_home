/* Mobilia Home — collection / search / wishlist listing (templates/collection.json + main-collection section).
   In Shopify, facets come from Search & Discovery filters (collection.filters) and sorting from
   collection.sort_options; this module reproduces the same UX on the exported catalogue. */
import { SITE, $, $$, esc, norm, money, pct, img, collectionUrl, wishlist, wa, observeList, markLoaded, jsonld, track, gaItem, params } from './core.js';
import { icon } from './icons.js';
import { card } from './card.js';
import { searchProducts, reveal } from './ui.js';

let DB, ctx, all = [], state, shown = 0;
const PAGE = 24;
const ROOM_LABEL = { salon: 'Salon', sejour: 'Salle à manger', chambre: 'Chambre', enfant: 'Chambre enfant', rangement: 'Rangement', jardin: 'Jardin' };
const ROOM_TEXT = {
  salon: 'Salons d’angle, salons en U, salons marocains, canapés, fauteuils et tables basses : tout pour composer un séjour confortable.',
  sejour: 'Tables à manger, chaises, buffets et consoles pour recevoir autour d’une belle table.',
  chambre: 'Lits, chevets, commodes et matelas pour une chambre apaisante.',
  enfant: 'Lits enfant et junior, bureaux et chaises pour grandir dans une chambre bien pensée.',
};
const PRICE = [[0, 2000, 'Moins de 2 000 DH'], [2000, 5000, '2 000 – 5 000 DH'], [5000, 10000, '5 000 – 10 000 DH'], [10000, 20000, '10 000 – 20 000 DH'], [20000, 1e9, 'Plus de 20 000 DH']];
const SORTS = [['featured', 'Pertinence'], ['new', 'Nouveautés'], ['price-asc', 'Prix croissant'], ['price-desc', 'Prix décroissant'], ['discount', 'Meilleures remises']];

/* --- Source resolution ------------------------------------------------- */
function resolve() {
  const q = params();
  if (q.get('q')) {
    const term = q.get('q');
    return { kind: 'search', title: `« ${term} »`, eyebrow: 'Recherche', term, products: searchProducts(term), crumbs: [['Recherche', null]] };
  }
  if (q.get('list') === 'favoris') {
    return { kind: 'wishlist', title: 'Mes favoris', eyebrow: 'Votre sélection', products: DB.list(wishlist.items()), crumbs: [['Favoris', null]] };
  }
  if (q.get('room') && ROOM_LABEL[q.get('room')]) {
    const r = q.get('room'); const navItem = DB.nav.find(n => n.id === r);
    const handles = navItem ? navItem.groups.flatMap(g => g.items.map(i => i[0])) : [];
    const products = DB.products.filter(p => p.r.includes(r));
    const room = SITE.rooms.find(x => x.href.endsWith('room=' + r));
    return { kind: 'room', id: r, title: ROOM_LABEL[r], eyebrow: 'Pièce de vie', desc: ROOM_TEXT[r], products,
      image: room && DB.get(room.image)?.i[0]?.[0], sub: handles.map(h => [h, navItem.groups.flatMap(g => g.items).find(i => i[0] === h)[1]]),
      crumbs: [[ROOM_LABEL[r], null]] };
  }
  const h = q.get('c'); const col = h && DB.cols.get(h);
  if (!col) return null;
  // Sub-navigation: siblings from the mega-menu group containing this collection
  let sub = [], parent;
  for (const n of DB.nav) for (const g of n.groups || []) if (g.items.some(i => i[0] === h)) { sub = g.items; parent = n; }
  const label = (sub.find(i => i[0] === h) || [])[1] || col.t;
  const dark = h === 'outlet-roches-noires';
  return { kind: 'collection', handle: h, title: dark ? 'Mobilia Outlet' : label, eyebrow: dark ? 'Roches Noires · Casablanca' : (parent ? parent.label : 'Collection'),
    desc: col.d || (dark ? SITE.outlet.text : ''), image: dark ? '' : col.img, products: DB.collection(h), sub, dark,
    crumbs: parent ? [[parent.label, parent.groups ? `collection.html?room=${parent.id}` : null], [label, null]] : [[col.t, null]] };
}

/* --- Filtering --------------------------------------------------------- */
const FACETS = {
  type: { label: 'Type de meuble', value: p => [p.c] },
  piece: { label: 'Pièce', value: p => p.r.map(r => ROOM_LABEL[r]).filter(Boolean) },
  price: { label: 'Prix', value: p => [PRICE.find(([a, b]) => p.p >= a && p.p < b)[2]], order: PRICE.map(x => x[2]) },
  size: { label: 'Format', value: p => (/^(Lit|Matelas|Pack|Lit enfant)$/.test(p.c) && /^\d{2,3} × \d{3} cm$/.test(p.d) ? [p.d] : []) },
  stock: { label: 'Disponibilité', value: p => (p.a ? ['En stock'] : []) },
  offer: { label: 'Offres', value: p => [...(p.cp ? ['En promotion'] : []), ...(pct(p) >= 30 ? ['Remise de 30 % et plus'] : [])] },
};
const passes = (p, except) => Object.entries(state.f).every(([k, vals]) => k === except || !vals.length || FACETS[k].value(p).some(v => vals.includes(v)));
function sortList(list) {
  const s = state.sort, l = [...list];
  if (s === 'new') l.sort((a, b) => b.ts - a.ts);
  if (s === 'price-asc') l.sort((a, b) => a.p - b.p);
  if (s === 'price-desc') l.sort((a, b) => b.p - a.p);
  if (s === 'discount') l.sort((a, b) => pct(b) - pct(a));
  if (s === 'featured' && ctx.kind !== 'search') l.sort((a, b) => b.a - a.a); // keep merchandised order, sold-out last
  return l;
}
const results = () => sortList(all.filter(p => passes(p)));

/* --- Rendering --------------------------------------------------------- */
function headHtml() {
  const c = ctx; const n = all.length;
  const sub = c.sub?.length ? `<nav class="subnav" aria-label="Sous-catégories"><div class="scroller">
    ${c.kind === 'room' ? `<a class="chip is-active" aria-current="page" href="">Tout</a>` : ''}
    ${c.sub.map(([h, l]) => `<a class="chip${h === c.handle ? ' is-active' : ''}" href="${collectionUrl(h)}"${h === c.handle ? ' aria-current="page"' : ''}>${esc(l)} <span class="muted small">${DB.cols.get(h)?.n ?? ''}</span></a>`).join('')}
  </div></nav>` : '';
  return `<header class="plp-head${c.dark ? ' plp-head--dark on-dark' : ''}${c.image ? '' : ' plp-head--noimg'}"><div class="container">
    <ol class="crumbs" role="list" aria-label="Fil d’Ariane"><li><a href="index.html">Accueil</a></li>${c.crumbs.map(([l, href]) => `<li>${href ? `<a href="${href}">${esc(l)}</a>` : `<span aria-current="page">${esc(l)}</span>`}</li>`).join('')}</ol>
    <div class="plp-head__grid">
      <div class="plp-head__copy">
        <p class="label" style="color:${c.dark ? 'var(--saffron)' : 'var(--taupe)'};margin-bottom:1rem">${esc(c.eyebrow)}</p>
        <h1 class="h1 plp-head__title">${esc(c.title)}<sup>${n}</sup></h1>
        ${c.desc ? `<p class="plp-head__desc body-l">${esc(c.desc)}</p>` : ''}
      </div>
      ${c.image ? `<div class="plp-head__media media">${img(c.image, { alt: '', sizes: '33vw', max: 960, eager: true })}</div>` : ''}
    </div>
    ${sub}
  </div></header>`;
}
function filtersHtml(list) {
  const groups = Object.entries(FACETS).map(([k, f]) => {
    const counts = new Map();
    all.filter(p => passes(p, k)).forEach(p => f.value(p).forEach(v => counts.set(v, (counts.get(v) || 0) + 1)));
    const universe = new Map(); all.forEach(p => f.value(p).forEach(v => universe.set(v, 1)));
    let vals = [...universe.keys()];
    if (vals.length < 2 && !state.f[k].length) return '';
    vals = f.order ? f.order.filter(v => universe.has(v)) : vals.sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0) || a.localeCompare(b, 'fr'));
    return `<details class="fgroup" open><summary class="acc__btn">${f.label}<span class="plus" aria-hidden="true"></span></summary>
      <div class="fgroup__body">${vals.slice(0, 14).map(v => {
        const n = counts.get(v) || 0; const on = state.f[k].includes(v);
        return `<label class="fopt${n || on ? '' : ' is-empty'}"><input type="checkbox" data-f="${k}" value="${esc(v)}"${on ? ' checked' : ''}${n || on ? '' : ' disabled'}><span>${esc(v)}</span><small>${n}</small></label>`;
      }).join('')}</div></details>`;
  }).join('');
  return `<div class="filters__head"><h2 class="drawer__title">Filtrer</h2><button class="icon-btn" type="button" data-filters-close aria-label="Fermer les filtres">${icon('close')}</button></div>
    <div class="filters__body">${groups}</div>
    <div class="filters__foot"><button class="btn btn--ghost" type="button" data-clear>Effacer</button><button class="btn" type="button" data-filters-close>Voir ${list.length} produit${list.length > 1 ? 's' : ''}</button></div>`;
}
const activeCount = () => Object.values(state.f).reduce((n, v) => n + v.length, 0);
function chipsHtml() {
  const chips = Object.entries(state.f).flatMap(([k, vals]) => vals.map(v => `<button class="chip" type="button" data-rm="${k}" data-v="${esc(v)}" aria-label="Retirer le filtre ${esc(v)}">${esc(v)} ${icon('close')}</button>`));
  return chips.length ? chips.join('') + `<button class="clear" type="button" data-clear>Tout effacer</button>` : '';
}
function editorialTile() {
  return `<aside class="grid-tile on-dark"><div><span class="label">Besoin d’aide pour choisir ?</span>
    <p class="h2">Un conseiller vous répond sur WhatsApp.</p>
    <p>Dimensions, coloris, sur-mesure, délais : envoyez-nous votre question ou la photo de votre pièce.</p></div>
    <a class="btn btn--light" href="${wa(`Bonjour Mobilia, j’hésite dans la catégorie « ${ctx.title} ». Pouvez-vous me conseiller ?`)}" target="_blank" rel="noopener" data-wa-context="plp_tile">${icon('whatsapp')}Demander conseil</a></aside>`;
}
function emptyHtml() {
  if (ctx.kind === 'wishlist' && !all.length) return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-state__mark">${icon('heart')}</div><p class="h3">Aucun favori pour l’instant.</p>
    <p>Touchez le cœur sur une pièce pour la retrouver ici, et la partager avec vos proches.</p>
    <div class="empty-state__links">${SITE.rooms.slice(0, 4).map(r => `<a class="chip" href="${r.href}">${esc(r.title)}</a>`).join('')}</div></div>`;
  if (ctx.kind === 'search' && !all.length) return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-state__mark">${icon('search')}</div><p class="h3">Aucun résultat pour ${esc(ctx.title)}.</p>
    <p>Essayez un terme plus général (salon, lit, table…) ou décrivez-nous la pièce que vous cherchez.</p>
    <div class="empty-state__links">${SITE.rooms.slice(0, 4).map(r => `<a class="chip" href="${r.href}">${esc(r.title)}</a>`).join('')}</div>
    <a class="btn btn--wa" href="${wa(`Bonjour Mobilia, je recherche : ${ctx.term}`)}" target="_blank" rel="noopener">${icon('whatsapp', 'wa-icon')}Demander à un conseiller</a></div>`;
  return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-state__mark">${icon('filter')}</div><p class="h3">Aucune pièce ne correspond à ces filtres.</p>
    <p>Retirez un filtre ou élargissez la fourchette de prix pour voir plus de résultats.</p>
    <button class="btn" type="button" data-clear>Effacer les filtres</button></div>`;
}
function renderGrid(reset = true) {
  const list = results(); const grid = $('#plp-grid');
  if (reset) shown = Math.min(PAGE, list.length);
  if (!list.length) grid.innerHTML = emptyHtml();
  else {
    const items = list.slice(0, shown).map((p, i) => card(p, { eager: i < 4, list: ctx.title, sizes: '(min-width:1280px) 22vw, (min-width:1024px) 28vw, (min-width:768px) 33vw, 50vw' }));
    if (list.length >= 12 && ctx.kind !== 'wishlist') items.splice(8, 0, editorialTile());
    grid.innerHTML = items.join('');
  }
  $('[data-count]').textContent = `${list.length} produit${list.length > 1 ? 's' : ''}`;
  $('#active-filters').innerHTML = chipsHtml();
  const ac = activeCount(); const badge = $('[data-filter-count]'); badge.textContent = ac || ''; badge.dataset.count = ac;
  $('#filters').innerHTML = filtersHtml(list);
  const more = $('#plp-more');
  more.hidden = shown >= list.length;
  if (!more.hidden) {
    $('[data-more-text]').textContent = `${shown} sur ${list.length} produits`;
    $('.plp-more__meter span').style.width = (shown / list.length * 100) + '%';
  }
  markLoaded(grid);
}
function syncUrl() {
  const q = params();
  Object.keys(FACETS).forEach(k => q.delete(k));
  Object.entries(state.f).forEach(([k, v]) => v.length && q.set(k, v.join('|')));
  state.sort === 'featured' ? q.delete('sort') : q.set('sort', state.sort);
  history.replaceState(null, '', '?' + q.toString());
}

/* --- Mount --------------------------------------------------------------*/
export function mountCollection(db) {
  DB = db; ctx = resolve();
  if (!ctx) {
    document.title = 'Page introuvable — Mobilia Home';
    $('#main').innerHTML = `<div class="error-state"><div><p class="display">404</p><h1 class="h2">Cette collection est introuvable.</h1>
      <p>Elle a peut-être été renommée. Retrouvez toutes nos pièces par univers.</p>
      <div class="empty-state__links">${SITE.rooms.map(r => `<a class="chip" href="${r.href}">${esc(r.title)}</a>`).join('')}</div></div></div>`;
    return;
  }
  all = ctx.products;
  const q = params(); const type = q.get('type');
  state = { sort: q.get('sort') || 'featured', f: Object.fromEntries(Object.keys(FACETS).map(k => [k, q.get(k) ? q.get(k).split('|') : []])) };
  if (type) state.f.type = [type];
  document.title = `${ctx.title} — Mobilia Home`;

  $('#main').innerHTML = headHtml() + `
  <div class="toolbar"><div class="container toolbar__inner">
    <button class="toolbar__filter" type="button" data-filters-toggle aria-controls="filters" aria-expanded="false">${icon('filter')}<span data-filter-label>Filtrer</span><span class="count" data-filter-count></span></button>
    <span class="toolbar__count" data-count aria-live="polite"></span>
    <div class="toolbar__sort"><label for="sort">Trier par</label><select id="sort">${SORTS.map(([v, l]) => `<option value="${v}"${state.sort === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
    <div class="toolbar__density" role="group" aria-label="Affichage de la grille">
      <button type="button" data-density="2" aria-pressed="false" aria-label="Grandes vignettes">${icon('grid2')}</button>
      <button type="button" data-density="4" aria-pressed="true" aria-label="Vignettes standard">${icon('grid4')}</button>
    </div>
  </div></div>
  <div class="container">
    <div class="active-filters" id="active-filters"></div>
    <div class="plp" data-density="4">
      <aside class="filters" id="filters" aria-label="Filtres"></aside>
      <div>
        <h2 class="visually-hidden">Produits</h2>
        <div class="product-grid" id="plp-grid" data-list="${esc(ctx.title)}"></div>
        <div class="plp-more" id="plp-more" hidden><div class="plp-more__meter"><span></span></div><p data-more-text></p>
          <button class="btn btn--ghost" type="button" data-more>Voir plus de produits</button></div>
      </div>
    </div>
  </div>`;
  renderGrid();
  if (!all.length) $('.toolbar').hidden = true;
  observeList($('#plp-grid'));
  if (ctx.kind === 'search') track('view_search_results', { search_term: ctx.term, items: all.slice(0, 12).map((p, i) => gaItem(p, { index: i })) });

  const plp = $('.plp'); const filters = $('#filters'); const toggle = $('[data-filters-toggle]');
  const isDrawer = () => matchMedia('(max-width: 1023px)').matches;
  const setLabel = () => { $('[data-filter-label]').textContent = isDrawer() ? 'Filtrer' : (plp.classList.contains('filters-collapsed') ? 'Afficher les filtres' : 'Masquer les filtres'); };
  setLabel(); addEventListener('resize', setLabel);
  const closeDrawer = () => { filters.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); document.documentElement.classList.remove('is-locked'); toggle.focus(); };
  toggle.addEventListener('click', () => {
    if (isDrawer()) { filters.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); document.documentElement.classList.add('is-locked'); setTimeout(() => $('summary', filters)?.focus(), 50); }
    else { plp.classList.toggle('filters-collapsed'); toggle.setAttribute('aria-expanded', !plp.classList.contains('filters-collapsed')); setLabel(); }
  });
  toggle.setAttribute('aria-expanded', String(!isDrawer()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filters.classList.contains('is-open')) closeDrawer(); });

  $('#main').addEventListener('change', e => {
    if (e.target.matches('[data-f]')) {
      const { f } = e.target.dataset; const v = e.target.value;
      state.f[f] = e.target.checked ? [...state.f[f], v] : state.f[f].filter(x => x !== v);
      const focusKey = `[data-f="${f}"][value="${CSS.escape(v)}"]`;
      renderGrid(); syncUrl();
      $(focusKey)?.focus(); // keep keyboard position after re-render
      window.dataLayer.push({ event: 'filter_apply', filter_type: f, filter_value: v });
    }
    if (e.target.id === 'sort') { state.sort = e.target.value; renderGrid(); syncUrl(); }
  });
  $('#main').addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-filters-close]')) closeDrawer();
    if (t.closest('[data-clear]')) { Object.keys(state.f).forEach(k => (state.f[k] = [])); renderGrid(); syncUrl(); }
    const rm = t.closest('[data-rm]'); if (rm) { state.f[rm.dataset.rm] = state.f[rm.dataset.rm].filter(v => v !== rm.dataset.v); renderGrid(); syncUrl(); }
    if (t.closest('[data-more]')) {
      const before = shown; shown = Math.min(shown + PAGE, results().length); renderGrid(false);
      $$('#plp-grid .card')[before]?.querySelector('a.card__title, .card__title a')?.focus({ preventScroll: true });
    }
    const d = t.closest('[data-density]');
    if (d) { plp.dataset.density = d.dataset.density; $$('[data-density]').forEach(b => b.setAttribute('aria-pressed', b === d)); }
  });

  jsonld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Accueil', SITE.shopUrl], ...ctx.crumbs.map(([l]) => [l, location.href])].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
  reveal();
}
