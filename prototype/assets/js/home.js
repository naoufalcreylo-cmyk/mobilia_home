/* Mobilia Home — homepage. Each function mirrors one Shopify section (sections/*.liquid). */
import { SITE, $, $$, esc, money, pct, img, productUrl, collectionUrl, wa, observeList, markLoaded, jsonld } from './core.js';
import { icon } from './icons.js';
import { card, priceHtml } from './card.js';
import { accordion, reveal } from './ui.js';

let DB;
const head = (eyebrow, title, aside = '', id = '') => `<div class="section-head">
  <div><span class="label">${eyebrow}</span><h2 class="h2 section-head__title"${id ? ` id="${id}"` : ''}>${title}</h2></div>
  ${aside ? `<div class="section-head__aside">${aside}</div>` : ''}</div>`;

/* 03 Hero — shoppable editorial composition */
function hero() {
  const h = SITE.hero; const p = DB.get(h.product);
  const rooms = SITE.rooms.slice(0, 6);
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="label hero__eyebrow">${esc(h.eyebrow)}</p>
      <h1 class="display hero__title" id="hero-title">${h.title}</h1>
      <p class="body-l hero__text">${esc(h.text)}</p>
      <div class="hero__ctas">
        <a class="btn" href="${h.primary.href}">${esc(h.primary.label)} ${icon('arrow', 'i-arrow')}</a>
        <a class="link-arrow" href="${h.secondary.href}">${esc(h.secondary.label)} ${icon('arrow')}</a>
      </div>
      <ol class="hero__index" role="list" aria-label="Pièces de vie">${rooms.map((r, i) => `<li><a href="${r.href}"><span>0${i + 1}</span>${esc(r.title)}</a></li>`).join('')}</ol>
    </div>
    <div class="hero__media">
      <div class="media">${img(p.i[0][0], { alt: `${p.c} ${p.n} dans un salon lumineux`, sizes: '(min-width:1024px) 58vw, 100vw', eager: true, max: 2000, w0: p.i[0][1], h0: p.i[0][2] })}</div>
      <span class="hero__hotspot" style="left:${h.hotspot.x}%;top:${h.hotspot.y}%" aria-hidden="true"></span>
      <a class="hero__tag" href="${productUrl(p)}" data-handle="${esc(p.h)}">
        <span class="pin" aria-hidden="true"></span>
        <p><span class="label muted" style="font-size:.625rem">${esc(p.c)}</span><strong>${esc(p.n)}</strong>${money(p.p)}${p.cp ? ` <s class="muted">${money(p.cp)}</s>` : ''}</p>
        ${icon('arrow')}
      </a>
    </div>
  </div>
</section>`;
}

/* 04 Trust */
const trust = () => `<section class="trust" aria-label="Nos engagements"><div class="container">
  <ul class="trust__list" role="list">${SITE.trust.map(t => `<li class="trust__item"><span class="trust__k">${t.k}</span><span class="trust__v">${esc(t.v)}</span></li>`).join('')}</ul>
</div></section>`;

/* 05 Shop by room — asymmetric editorial grid with real piece counts */
function rooms() {
  const cls = ['a', 'b', 'c', 'd', 'e', 'f'];
  const tiles = SITE.rooms.map((r, i) => {
    const p = DB.get(r.image); const n = new Set(r.collections.flatMap(h => DB.cols.get(h)?.ps || [])).size;
    const sizes = i === 0 ? '(min-width:1024px) 58vw, 100vw' : '(min-width:1024px) 40vw, 50vw';
    return `<a class="room room--${cls[i]} reveal" href="${r.href}">
      <div class="media">${img(p?.i[0][0], { alt: '', sizes, max: i === 0 ? 1600 : 1200 })}</div>
      <span class="room__label"><span><span class="room__title">${esc(r.title)}</span><span class="room__meta" style="display:block">${n} pièces</span></span><span class="room__go">${icon('arrow')}</span></span>
    </a>`;
  }).join('');
  return `<section class="section" aria-labelledby="rooms-title"><div class="container">
  ${head('Par pièce de vie', 'Aménagez chaque <em>espace</em>.', 'Pensez votre intérieur pièce par pièce : salons, salles à manger, chambres et rangements, réunis au même endroit.', 'rooms-title')}
  <div class="rooms__grid">${tiles}</div>
</div></section>`;
}

/* 06 Campaign — discount ceiling computed from live prices, never hard-coded */
function campaign() {
  const c = SITE.campaign;
  const ps = DB.list(c.products).filter(p => p.a).slice(0, 3);
  const max = Math.max(0, ...ps.map(pct)); // ceiling of what is actually shown
  return `<section class="section section--linen" aria-labelledby="camp-title"><div class="container campaign__grid">
  <div class="campaign__panel reveal">
    <div><span class="label">${esc(c.eyebrow)}</span><h2 class="campaign__title" id="camp-title">${c.title}</h2>
      ${max >= 10 ? `<p class="campaign__upto"><span>jusqu’à</span><strong>−${max}&nbsp;%</strong></p>` : ''}</div>
    <div><p class="campaign__text">${esc(c.text)}</p>
      <a class="btn" style="margin-top:1.75rem" href="${c.cta.href}">${esc(c.cta.label)} ${icon('arrow', 'i-arrow')}</a></div>
  </div>
  <div class="campaign__products" data-list="super_deals">${ps.map(p => card(p, { compact: true, sizes: '(min-width:1024px) 18vw, 60vw', list: 'super_deals' })).join('')}</div>
</div></section>`;
}

/* 07 Selection — one grid, four merchandising angles */
function selection() {
  const tabs = SITE.selection;
  return `<section class="section" aria-labelledby="sel-title"><div class="container">
  <div class="section-head">
    <div><span class="label">La sélection du moment</span><h2 class="h2 section-head__title" id="sel-title">Nos pièces <em>favorites</em>.</h2></div>
    <div class="tabs" role="tablist" aria-label="Sélection">${tabs.map((t, i) => `<button class="chip" type="button" role="tab" id="tab-${t.id}" aria-selected="${!i}" aria-controls="sel-panel" data-tab="${t.id}"${i ? ' tabindex="-1"' : ''}>${esc(t.label)}</button>`).join('')}</div>
  </div>
  <div class="selection__panel" id="sel-panel" role="tabpanel" aria-labelledby="tab-${tabs[0].id}" data-list="selection_${tabs[0].id}">${selGrid(tabs[0])}</div>
  <div class="selection__foot"><a class="btn btn--ghost" data-sel-all href="${collectionUrl(tabs[0].collection)}">Voir toute la collection ${icon('arrow', 'i-arrow')}</a></div>
</div></section>`;
}
const selGrid = t => `<div class="product-grid">${DB.list(t.products).slice(0, 8).map(p => card(p, { list: 'selection_' + t.id })).join('')}</div>`;
function bindSelection() {
  const tabs = $$('[data-tab]'); const panel = $('#sel-panel');
  const select = btn => {
    const t = SITE.selection.find(x => x.id === btn.dataset.tab);
    tabs.forEach(b => { const on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    panel.classList.add('is-loading');
    setTimeout(() => {
      panel.innerHTML = selGrid(t); panel.setAttribute('aria-labelledby', btn.id); panel.dataset.list = 'selection_' + t.id;
      $('[data-sel-all]').href = collectionUrl(t.collection); markLoaded(panel); panel.classList.remove('is-loading');
    }, 180);
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n);
    });
  });
}

/* 08 Brand story */
function story() {
  const s = SITE.story; const [a, b] = DB.list(s.images);
  return `<section class="section section--linen" aria-labelledby="story-title"><div class="container story__grid">
  <div class="story__media reveal">
    <div class="media">${img(a.i[0][0], { alt: `${a.c} ${a.n}`, sizes: '(min-width:1024px) 55vw, 82vw', max: 1600 })}</div>
    <div class="media">${img(b.i[0][0], { alt: `${b.c} ${b.n}`, sizes: '(min-width:1024px) 20vw, 32vw', max: 720 })}</div>
  </div>
  <div class="story__copy reveal">
    <span class="label">${esc(s.eyebrow)}</span>
    <h2 class="h2" id="story-title">${s.title}</h2>
    <p class="body-l">${esc(s.text)}</p>
    <ol class="story__pillars" role="list">${s.pillars.map((p, i) => `<li><b>0${i + 1}</b><div><strong>${esc(p.t)}</strong><span>${esc(p.d)}</span></div></li>`).join('')}</ol>
    <a class="link-arrow" href="${s.cta.href}">${esc(s.cta.label)} ${icon('arrow')}</a>
  </div>
</div></section>`;
}

/* 09 Shop the look */
function looks() {
  const L = SITE.looks;
  return `<section class="section" aria-labelledby="looks-title"><div class="container">
  ${head('Inspirations achetables', 'Composez la pièce, <em>pas seulement</em> le meuble.', 'Chaque scène réunit une pièce maîtresse et les meubles de notre catalogue qui l’accompagnent. Ajoutez-les directement au panier.', 'looks-title')}
  <div class="tabs looks__tabs" role="tablist" aria-label="Scènes">${L.map((l, i) => `<button class="chip" type="button" role="tab" aria-selected="${!i}" aria-controls="look-${l.id}" id="look-tab-${l.id}" data-look="${l.id}"${i ? ' tabindex="-1"' : ''}>${esc(l.label)}</button>`).join('')}</div>
  ${L.map((l, i) => look(l, i)).join('')}
</div></section>`;
}
function look(l, i) {
  const hero = DB.get(l.hero); const pair = DB.list(l.pair).filter(p => p.a).slice(0, 4);
  if (!hero) return '';
  const total = [hero, ...pair].reduce((s, p) => s + p.p, 0);
  const row = (p, main) => `<li class="look__row${main ? ' is-hl' : ''}" data-handle="${esc(p.h)}">
    <div class="media">${img(p.i[0][0], { alt: '', sizes: '76px', max: 240 })}</div>
    <div><span class="look__tag">${main ? 'Dans la scène' : 'À associer'} · ${esc(p.c)}</span><a href="${productUrl(p)}"><strong>${esc(p.n)}</strong></a><span class="price">${money(p.p)}</span></div>
    <button class="icon-btn" type="button" data-add="${esc(p.h)}" data-list="shop_the_look" aria-label="Ajouter ${esc(p.n)} au panier">${icon('plus')}</button></li>`;
  return `<div class="look" id="look-${l.id}" role="tabpanel" aria-labelledby="look-tab-${l.id}" data-list="look_${l.id}"${i ? ' hidden' : ''}>
  <div class="look__scene">
    <div class="media">${img(hero.i[0][0], { alt: `${l.label} : ${hero.c} ${hero.n}`, sizes: '(min-width:1024px) 62vw, 100vw', max: 1600 })}</div>
    <button class="look__spot" type="button" style="left:${l.spot.x}%;top:${l.spot.y}%" aria-expanded="false" aria-controls="pop-${l.id}" aria-label="Voir ${esc(hero.n)}"></button>
    <a class="look__pop" id="pop-${l.id}" href="${productUrl(hero)}" style="left:min(calc(${l.spot.x}% + 28px), calc(100% - 270px));top:calc(${l.spot.y}% - 50px)">
      <div class="media">${img(hero.i[0][0], { alt: '', sizes: '72px', max: 240 })}</div>
      <p><span class="label muted" style="font-size:.625rem">${esc(hero.c)}</span><strong>${esc(hero.n)}</strong>${money(hero.p)}</p></a>
  </div>
  <div class="look__side">
    <div><h3 class="h3">${esc(l.title)}</h3><p class="look__intro">${esc(l.intro)}</p></div>
    <ul class="look__list" role="list">${row(hero, true)}${pair.map(p => row(p)).join('')}</ul>
    <div class="look__total"><span class="small muted">L’ensemble, ${pair.length + 1} pièces</span><span class="price">${money(total)}</span></div>
    <button class="btn btn--block" type="button" data-add-look="${l.id}">Ajouter l’ensemble au panier</button>
  </div>
</div>`;
}
function bindLooks() {
  const tabs = $$('[data-look]');
  tabs.forEach((b, i) => {
    const sel = () => {
      tabs.forEach(t => { const on = t === b; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; $('#look-' + t.dataset.look).hidden = !on; });
      markLoaded($('#look-' + b.dataset.look));
    };
    b.addEventListener('click', sel);
    b.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click(); });
  });
  $$('.look__spot').forEach(s => s.addEventListener('click', () => {
    const open = s.getAttribute('aria-expanded') !== 'true'; s.setAttribute('aria-expanded', open);
    $('#' + s.getAttribute('aria-controls')).classList.toggle('is-open', open);
    $$('.look__row.is-hl', s.closest('.look')).forEach(r => r.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }));
  }));
  $$('[data-add-look]').forEach(b => b.addEventListener('click', async () => {
    const l = SITE.looks.find(x => x.id === b.dataset.addLook);
    const { cart } = await import('./core.js'); const { addToCart } = await import('./ui.js');
    const hs = [l.hero, ...DB.list(l.pair).filter(p => p.a).slice(0, 4).map(p => p.h)];
    hs.slice(1).forEach(h => cart.add(h, 1));
    addToCart(hs[0], 1, 'shop_the_look');
  }));
}

/* 10 Packs — composition + savings as the hero information */
function packs() {
  const P = SITE.packs.map(x => ({ ...x, p: DB.get(x.handle) })).filter(x => x.p);
  const tile = ({ p, name, items, badge }, i) => {
    const save = p.cp ? p.cp - p.p : 0;
    return `<article class="pack ${i ? 'pack--sm' : 'pack--hero'} reveal" data-handle="${esc(p.h)}">
      <div class="media">${img(p.i[0][0], { alt: `${name}`, sizes: i ? '(min-width:1024px) 20vw, 120px' : '(min-width:1024px) 48vw, 100vw', max: i ? 720 : 1600 })}
        <span class="badge pack__count">${esc(badge)}</span></div>
      <div style="display:grid;gap:.75rem">
        <h3 class="pack__name"><a href="${productUrl(p)}">${esc(name)}</a></h3>
        <ul class="pack__items" role="list">${items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <p class="pack__price">${priceHtml(p, { showOff: false })}</p>
        ${save ? `<p class="pack__save">Vous économisez ${money(save)}</p>` : ''}
      </div></article>`;
  };
  return `<section class="section section--linen" aria-labelledby="packs-title"><div class="container">
  ${head('Packs Mobilia', 'Des packs pour aménager <em>plus simplement</em>.', 'Des ensembles coordonnés, pensés par pièce, avec un prix d’ensemble plus doux que l’achat séparé.', 'packs-title')}
  <div class="packs__grid" data-list="packs">${P.map(tile).join('')}</div>
  <div class="selection__foot"><a class="btn btn--ghost" href="${collectionUrl('packs')}">Tous les packs ${icon('arrow', 'i-arrow')}</a></div>
</div></section>`;
}

/* 11 Interior project (Home Décor) */
const project = () => {
  const s = SITE.project;
  return `<section class="section project on-dark" aria-labelledby="proj-title"><div class="container project__grid">
  <div class="project__copy">
    <span class="label">${esc(s.eyebrow)}</span>
    <h2 class="h1" id="proj-title">${esc(s.title)}</h2>
    <p class="body-l">${esc(s.text)}</p>
    <div class="project__ctas">
      <a class="btn btn--light" href="${wa(s.message)}" target="_blank" rel="noopener" data-wa-context="project">${icon('whatsapp')}Parler à un conseiller déco</a>
      <a class="btn btn--outline-light" href="#magasins">Venir en showroom</a>
    </div>
  </div>
  <ol class="project__steps" role="list">${s.steps.map((st, i) => `<li class="project__step reveal"><b>0${i + 1}</b><div><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p></div></li>`).join('')}</ol>
</div></section>`;
};

/* 12 Outlet — isolated dark section so markdowns never define the brand */
function outlet() {
  const o = SITE.outlet; const max = DB.maxDiscount(o.collection);
  const store = SITE.stores.find(s => s.tag === 'Outlet');
  const groups = {};
  DB.collection(o.collection).filter(p => p.a && p.c !== 'Autres pièces').forEach(p => { const g = groups[p.c] ||= { n: 0, min: Infinity }; g.n++; g.min = Math.min(g.min, p.p); });
  const rows = Object.entries(groups).sort((a, b) => b[1].n - a[1].n).slice(0, 6);
  return `<section class="section section--night outlet on-dark" aria-labelledby="outlet-title">
  <div class="outlet__word" aria-hidden="true">Outlet</div>
  <div class="container outlet__grid">
    <div class="outlet__copy">
      <span class="label">Mobilia Outlet${max >= 10 ? ` · jusqu’à −${max} %` : ''}</span>
      <h2 class="h1" id="outlet-title">${o.title}</h2>
      <p>${esc(o.text)}</p>
      ${store ? `<p class="outlet__addr">${icon('pin')}<span>${esc(store.address)}, ${esc(store.city)}<br><a href="tel:${store.phones[0].replace(/\s/g, '')}">${esc(store.phones[0])}</a></span></p>` : ''}
      <a class="btn btn--saffron" href="${collectionUrl(o.collection)}">Découvrir l’Outlet ${icon('arrow', 'i-arrow')}</a>
    </div>
    <ul class="outlet__index" role="list">${rows.map(([c, g]) => `<li><a href="${collectionUrl(o.collection)}&type=${encodeURIComponent(c)}">
        <span class="outlet__cat">${esc(c)}</span><span class="outlet__n">${g.n} pièce${g.n > 1 ? 's' : ''}</span><span class="outlet__from">dès <b>${money(g.min)}</b></span>${icon('arrow')}</a></li>`).join('')}</ul>
  </div>
</section>`;
}

/* 13 Services */
const services = () => `<section class="section" id="services" aria-labelledby="serv-title"><div class="container">
  ${head('Nos services', 'Bien plus qu’un <em>meuble</em>.', 'De la livraison express au conseil en décoration, nous vous accompagnons jusqu’à l’installation.', 'serv-title')}
  <div class="services__grid">${SITE.services.map(s => `<div class="service${s.feature ? ' service--feature' : ''}">
    ${icon(s.icon)}<h3>${esc(s.t)}</h3><p>${esc(s.d)}</p>
    ${s.feature ? `<a class="link-arrow" href="${wa('Bonjour Mobilia, je souhaite bénéficier du service Home Décor.')}" target="_blank" rel="noopener" data-wa-context="home_decor">Prendre conseil ${icon('arrow')}</a>` : ''}</div>`).join('')}</div>
</div></section>`;

/* 14 Stores — city filter, tap-to-call, directions, WhatsApp */
const maps = s => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mobilia ${s.address}, ${s.city}, Maroc`)}`;
function storeHtml(s) {
  return `<article class="store" data-city="${esc(s.city)}">
    <div class="store__name"><h3>${esc(s.name)}</h3><span class="badge ${s.tag === 'Outlet' ? 'badge--dark' : 'badge--muted'}">${esc(s.city)} · ${esc(s.tag)}</span></div>
    <p class="store__addr">${esc(s.address)}, ${esc(s.city)}</p>
    <p class="store__phones">${s.phones.map(t => `<a href="tel:+212${t.replace(/\s/g, '').replace(/^0/, '')}">${esc(t)}</a>`).join('')}</p>
    ${s.hours ? `<p class="store__hours">${esc(s.hours)}</p>` : ''}
    <div class="store__actions">
      <a class="btn btn--ghost btn--sm" href="${maps(s)}" target="_blank" rel="noopener">${icon('map')}Itinéraire</a>
      <a class="btn btn--wa btn--sm" href="${wa(`Bonjour Mobilia, je souhaite passer au showroom ${s.name} (${s.city}).`)}" target="_blank" rel="noopener" data-wa-context="store">${icon('whatsapp', 'wa-icon')}Prévenir de ma visite</a>
    </div></article>`;
}
function stores() {
  const cities = [...new Set(SITE.stores.map(s => s.city))];
  const p = DB.get('salon-angle-calypso-260x340-confort-lounge-maroc');
  return `<section class="section section--linen" id="magasins" aria-labelledby="stores-title"><div class="container">
  ${head('Nos showrooms', 'Découvrez Mobilia <em>près de chez vous</em>.', 'Venez voir, toucher et essayer nos salons avant de choisir. Nos conseillers vous accueillent à Casablanca et à Rabat.', 'stores-title')}
  <div class="stores__grid">
    <div class="stores__media"><div class="media">${img(p.i[0][0], { alt: '', sizes: '(min-width:1024px) 48vw, 100vw', max: 1600 })}</div></div>
    <div class="stores__list">
      <div class="tabs" role="group" aria-label="Filtrer par ville">
        <button class="chip" type="button" aria-pressed="true" data-city="">Toutes</button>
        ${cities.map(c => `<button class="chip" type="button" aria-pressed="false" data-city="${esc(c)}">${esc(c)} <span class="muted">${SITE.stores.filter(s => s.city === c).length}</span></button>`).join('')}
      </div>
      <div aria-live="polite">${SITE.stores.map(storeHtml).join('')}</div>
    </div>
  </div>
</div></section>`;
}
function bindStores() {
  $$('[data-city]').filter(b => b.tagName === 'BUTTON').forEach(b => b.addEventListener('click', () => {
    $$('button[data-city]').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.store').forEach(s => { s.hidden = b.dataset.city && s.dataset.city !== b.dataset.city; });
  }));
}

/* 15 Journal */
function journal() {
  const J = SITE.journal;
  const fmt = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<section class="section" aria-labelledby="journal-title"><div class="container">
  ${head('Inspirations & conseils', 'Le journal <em>Mobilia</em>.', '<a class="link-arrow" href="https://mobilia.ma/blogs/news">Tous les articles ' + icon('arrow') + '</a>', 'journal-title')}
  <div class="journal__grid">${J.map((a, i) => `<article class="post${i ? '' : ' post--lead'} reveal">
    <div class="media">${img(a.img, { alt: '', sizes: i ? '(min-width:1024px) 22vw, 120px' : '(min-width:1024px) 48vw, 100vw', max: i ? 720 : 1200 })}</div>
    <div><p class="label post__meta">${esc(a.tag)} · <time datetime="${a.date}">${fmt(a.date)}</time></p>
      <h3 class="post__title"><a href="${a.href}">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p></div>
  </article>`).join('')}</div>
</div></section>`;
}

/* 16 FAQ */
const faq = () => `<section class="section section--flush-top" id="faq" aria-labelledby="faq-title"><div class="container faq__grid">
  <div class="faq__head"><span class="label">Questions fréquentes</span><h2 class="h2" id="faq-title">Tout savoir avant de <em>commander</em>.</h2>
    <p>Livraison, montage, paiement, sur-mesure : les réponses de notre service client.</p>
    <a class="btn btn--wa" href="${wa('Bonjour Mobilia, j’ai une question.')}" target="_blank" rel="noopener" data-wa-context="faq">${icon('whatsapp', 'wa-icon')}Poser une autre question</a></div>
  <div class="faq__list">${accordion(SITE.faq.map(f => ({ title: esc(f.q), html: `<p>${esc(f.a)}</p>` })), { lg: true, open: 0 })}</div>
</div></section>`;

/* 17 Final CTA */
function finalCta() {
  const p = DB.get('salon-angle-lumia-400x220-panoramique-bois-massif');
  return `<section class="final on-dark" aria-labelledby="final-title">
  <div class="media">${img(p.i[0][0], { alt: '', sizes: '100vw', max: 2000 })}</div>
  <div class="container final__inner">
    <span class="label" style="color:var(--saffron)">Mobilia Home</span>
    <h2 class="h1" id="final-title">Votre intérieur commence <em>ici</em>.</h2>
    <p class="body-l">Découvrez nos collections ou parlez à l’un de nos conseillers : nous vous répondons sur WhatsApp.</p>
    <div class="final__ctas">
      <a class="btn btn--light" href="collection.html?room=salon">Découvrir les collections ${icon('arrow', 'i-arrow')}</a>
      <a class="btn btn--outline-light" href="${wa('Bonjour Mobilia, j’aimerais être conseillé(e) pour mon intérieur.')}" target="_blank" rel="noopener" data-wa-context="final_cta">${icon('whatsapp')}Parler à un conseiller</a>
    </div>
  </div>
</section>`;
}

function schema() {
  jsonld({
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Mobilia Home', url: SITE.shopUrl,
    logo: SITE.shopUrl + '/cdn/shop/files/mobilia-home-logo-fonce-fond-transparent.png', email: SITE.email,
    sameAs: SITE.social.map(s => s.href),
    contactPoint: [{ '@type': 'ContactPoint', telephone: SITE.phone.tel, contactType: 'customer service', areaServed: 'MA', availableLanguage: ['fr', 'ar'] }],
  });
  SITE.stores.forEach(s => jsonld({
    '@context': 'https://schema.org', '@type': 'FurnitureStore', name: `Mobilia Home ${s.name}`, url: SITE.shopUrl,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressCountry: 'MA' },
    telephone: s.phones.map(t => '+212' + t.replace(/\s/g, '').replace(/^0/, '')),
  }));
  jsonld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: SITE.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
}

export function mountHome(db) {
  DB = db;
  $('#main').innerHTML = hero() + trust() + rooms() + campaign() + selection() + story() + looks() + packs() + project() + outlet() + services() + stores() + journal() + faq() + finalCta();
  bindSelection(); bindLooks(); bindStores(); reveal(); markLoaded();
  $$('[data-list]').forEach(observeList);
  schema();
}
