// Normalises the live Mobilia Shopify catalogue (products.json / collections.json exports
// in tools/research) into the compact data layer used by the prototype.
// Nothing is invented: fields that cannot be derived are left empty and hidden in the UI.
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, 'research');
const OUT = path.join(__dirname, '..', 'prototype', 'data');

// Navigation taxonomy — every handle is a real mobilia.ma collection.
const NAV = [
  { id: 'salon', label: 'Salon', groups: [
    { title: 'Salons', items: [
      ['salons-d-angle-sur-mesure', "Salon d'angle"], ['salon-en-u', 'Salon en U'],
      ['salon-marocain', 'Salon marocain'], ['salon-3-2-1', 'Salon 3 2 1'] ] },
    { title: 'Assises', items: [
      ['canape-sofa', 'Canapé & sofa'], ['canapes-clic-clac', 'Clic-clac'], ['meridienne-1', 'Méridienne'],
      ['fauteuil-1', 'Fauteuil'], ['poufs', 'Pouf'] ] } ],
    feature: { handle: 'salon-angle-lumia-400x220-panoramique-bois-massif', eyebrow: 'Sur mesure', title: "Salons d'angle personnalisables", link: 'salons-d-angle-sur-mesure' } },
  { id: 'sejour', label: 'Salle à manger', groups: [
    { title: 'Salle à manger', items: [
      ['table-a-manger-1', 'Table à manger'], ['chaises-1', 'Chaise'], ['buffets', 'Buffet'], ['console-1', 'Console'] ] },
    { title: 'Séjour', items: [
      ['table-basse-1', 'Table basse'], ['table-de-coin', 'Table de coin'], ['meuble-tv-1', 'Meuble TV'] ] } ],
    feature: { handle: 'table-a-manger-avec-6-chaises-4', eyebrow: 'Tables & chaises', title: 'Recevoir autour d’une belle table', link: 'table-a-manger-1' } },
  { id: 'chambre', label: 'Chambre', groups: [
    { title: 'Chambre adulte', items: [
      ['lits-adulte-1', 'Lit adulte'], ['chevet', 'Chevet'], ['commode-1', 'Commode'], ['matelas', 'Matelas'] ] },
    { title: 'Chambre enfant', items: [
      ['lits-enfants', 'Lit enfant & junior'], ['bureaux-enfants', 'Bureau junior'], ['chaises-de-bureaux', 'Chaise de bureau'] ] } ],
    feature: { handle: 'lit-pure-elegance-minimaliste-serenite-absolue', eyebrow: 'Chambre adulte', title: 'Des lits pensés pour le repos', link: 'lits-adulte-1' } },
  { id: 'rangement', label: 'Rangement', groups: [
    { title: 'Rangement', items: [
      ['armoire-1', 'Armoire'], ['meuble-a-chaussures-1', 'Meuble à chaussures'], ['commode-1', 'Commode'],
      ['petit-rangement-1', 'Étagère & bibliothèque'], ['rangements', 'Tout le rangement'] ] } ],
    feature: { handle: 'buffet-1', eyebrow: 'Rangement', title: 'Ranger avec style', link: 'rangements' } },
  { id: 'jardin', label: 'Jardin', link: 'espace-dexterieur' },
  { id: 'packs', label: 'Packs', link: 'packs' },
  { id: 'outlet', label: 'Outlet', link: 'outlet-roches-noires' },
];

// Primary category = first match in this specificity order (singular labels for cards).
const PRIMARY = [
  ['packs', 'Pack'], ['salon-en-u', 'Salon en U'], ['salon-marocain', 'Salon marocain'], ['salon-3-2-1', 'Salon 3 2 1'],
  ['salons-d-angle-sur-mesure', "Salon d'angle"], ['canapes-clic-clac', 'Clic-clac'], ['meridienne-1', 'Méridienne'],
  ['canape-sofa', 'Canapé'], ['poufs', 'Pouf'], ['fauteuil-1', 'Fauteuil'], ['matelas', 'Matelas'],
  ['lits-enfants', 'Lit enfant'], ['bureaux-enfants', 'Bureau junior'], ['chaises-de-bureaux', 'Chaise de bureau'],
  ['lits-adulte-1', 'Lit'], ['chevet', 'Chevet'], ['commode-1', 'Commode'], ['armoire-1', 'Armoire'],
  ['meuble-a-chaussures-1', 'Meuble à chaussures'], ['petit-rangement-1', 'Étagère'], ['table-a-manger-1', 'Table à manger'],
  ['chaises-1', 'Chaise'], ['table-de-coin', 'Table de coin'], ['table-basse-1', 'Table basse'], ['table-basses', 'Table basse'],
  ['buffets', 'Buffet'], ['console-1', 'Console'], ['meuble-tv-1', 'Meuble TV'], ['espace-dexterieur', 'Jardin'],
  ['fauteuil-et-chaise-de-bureau', 'Bureau'], ['rangements', 'Rangement'], ['outlet-roches-noires', 'Autres pièces'],
];

// Room each collection belongs to (used for "Complétez votre intérieur" logic and filters).
const ROOM = {
  salon: ['salons-d-angle-sur-mesure', 'salon-en-u', 'salon-marocain', 'salon-3-2-1', 'canape-sofa', 'canapes-clic-clac', 'meridienne-1', 'fauteuil-1', 'poufs', 'table-basse-1', 'table-basses', 'table-de-coin', 'meuble-tv-1'],
  sejour: ['table-a-manger-1', 'chaises-1', 'buffets', 'console-1'],
  chambre: ['lits-adulte-1', 'chevet', 'commode-1', 'matelas', 'armoire-1'],
  enfant: ['lits-enfants', 'bureaux-enfants', 'chaises-de-bureaux'],
  rangement: ['armoire-1', 'meuble-a-chaussures-1', 'petit-rangement-1', 'rangements'],
  jardin: ['espace-dexterieur'],
};

const cols = JSON.parse(fs.readFileSync(path.join(R, 'collections.json'))).collections;
const products = new Map();
const membership = {};
for (const c of cols) {
  const list = JSON.parse(fs.readFileSync(path.join(R, 'cols', c.handle + '.json'))).products;
  membership[c.handle] = list.map(p => p.handle);
  for (const p of list) {
    if (!products.has(p.handle)) products.set(p.handle, { raw: p, cols: [] });
    products.get(p.handle).cols.push(c.handle);
  }
}

const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").toLowerCase();
const isCaps = s => s === s.toUpperCase() && /[A-Z]/.test(s);
const sentence = s => s.toLowerCase().replace(/(^|[.!?]\s+)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());

function dims(...sources) {
  for (const s of sources) {
    if (!s) continue;
    const t = s.replace(/&amp;/g, '&');
    let m = t.match(/(\d{2,3})\s*(?:cm)?\s*[x×X*]\s*(\d{2,3})(?:\s*(?:cm)?\s*[x×X*]\s*(\d{2,3}))?\s*(cm)?/);
    if (m && +m[1] >= 30 && +m[2] >= 30) return [m[1], m[2], m[3]].filter(Boolean).join(' × ') + ' cm';
    m = t.match(/L\s*:?\s*(\d{2,3})\s*\*?\s*(?:cm)?\s*[,;]?\s*[DPl]\s*:?\s*(\d{2,3})\s*\*?\s*(?:cm)?\s*[,;]?\s*(?:H\s*:?\s*(\d{2,3}))?/);
    if (m) return 'L' + m[1] + ' × P' + m[2] + (m[3] ? ' × H' + m[3] : '') + ' cm';
  }
  return '';
}

function cleanName(title, category) {
  let [name, ...rest] = title.split(/\s+[-–—|]\s+|\s{2,}/);
  let tagline = rest.join(' – ').trim();
  name = name.replace(/\s+/g, ' ').trim();
  if (isCaps(name)) name = sentence(name);
  // Remove trailing dimension fragments from the display name (shown separately).
  name = name.replace(/[,\s-]*\d{2,3}\s*(cm)?\s*[x×X*]\s*\d{2,3}(\s*[x×X*]\s*\d{2,3})?\s*(cm)?\.?$/i, '').trim();
  // Fix lone uppercase model names inside mixed titles: "Lit CROSS" → "Lit Cross"
  name = name.replace(/\b([A-ZÀ-Ý]{3,})\b/g, w => w.charAt(0) + w.slice(1).toLowerCase());
  name = name.charAt(0).toUpperCase() + name.slice(1);
  // "Salon d'Angle Mona" + category "Salon d'angle" → "Mona" (only when a clean model name remains)
  const pre = strip(category) + ' ';
  if (strip(name).startsWith(pre)) {
    const rest = name.slice(pre.length).trim();
    if (/^\p{Lu}[\p{L}-]+( \p{Lu}[\p{L}-]+)?$/u.test(rest)) name = rest;
  }
  return { name, tagline };
}

// Split body_html into named sections using the emoji headings Mobilia already uses.
function sections(html) {
  if (!html) return [];
  const clean = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, '')
    .replace(/\s(data-[\w-]+|style|class|id|dir)="[^"]*"/g, '')
    .replace(/<\/?(span|div|meta|font|o:p)[^>]*>/g, '')
    .replace(/<h[1-6][^>]*>/g, '<h3>').replace(/<\/h[1-6]>/g, '</h3>')
    .replace(/<b>|<\/b>/g, m => m.replace('b', 'strong'))
    .replace(/<img[^>]*>/g, '')
    .replace(/<p>\s*(&nbsp;)?\s*<\/p>/g, '')
    .replace(/\n+/g, ' ').trim();
  const parts = clean.split(/<h3>/);
  const out = [];
  if (parts[0].replace(/<[^>]+>/g, '').trim()) out.push({ t: 'Description', h: parts[0].trim() });
  for (const part of parts.slice(1)) {
    const [head, ...body] = part.split('</h3>');
    const t = head.replace(/<[^>]+>/g, '').replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, '').replace(/&amp;/g, '&').trim();
    const h = body.join('').trim();
    if (!h.replace(/<[^>]+>/g, '').trim()) continue;
    out.push({ t: t || 'Détails', h });
  }
  // Plain-text bodies like "Reference: 2264 Dimension: L190* D100* H80"
  if (out.length === 1 && out[0].h.length < 160 && !/<(ul|li)/.test(out[0].h)) out[0].t = 'Caractéristiques';
  return out;
}

const catalog = [];
const descriptions = {};
for (const [handle, { raw: p, cols: inCols }] of products) {
  const prim = PRIMARY.find(([h]) => inCols.includes(h));
  const KW = [[/^pack/i, 'Pack'], [/salon d.?angle/i, "Salon d'angle"], [/salon en u/i, 'Salon en U'], [/ext[ée]rieur|jardin/i, 'Jardin'], [/^salon/i, 'Salon'], [/^lit/i, 'Lit'], [/table (a|à) manger/i, 'Table à manger'], [/table basse/i, 'Table basse'], [/fauteuil/i, 'Fauteuil'], [/chaise/i, 'Chaise'], [/meuble tv/i, 'Meuble TV'], [/commode/i, 'Commode'], [/buffet/i, 'Buffet'], [/canap/i, 'Canapé']];
  const kw = KW.find(([re]) => re.test(p.title));
  const category = /^pack/i.test(p.title) ? 'Pack' : prim && !(prim[0] === 'outlet-roches-noires' && kw) ? prim[1] : kw ? kw[1] : 'Mobilier';
  const v = p.variants[0];
  const price = Math.round(+v.price);
  const compare = v.compare_at_price && +v.compare_at_price > +v.price ? Math.round(+v.compare_at_price) : 0;
  const { name, tagline } = cleanName(p.title, category);
  const body = p.body_html || '';
  const rooms = Object.entries(ROOM).filter(([, hs]) => hs.some(h => inCols.includes(h))).map(([r]) => r);
  const opts = p.options.filter(o => o.name !== 'Title').map(o => ({ n: o.name, v: o.values }));
  catalog.push({
    h: handle, n: name, tl: tagline, t: p.title, c: category,
    d: dims(p.title, handle.replace(/-/g, ' '), body.replace(/<[^>]+>/g, ' ')),
    p: price, cp: compare,
    a: p.variants.some(x => x.available) ? 1 : 0,
    i: p.images.slice(0, 6).map(im => [im.src.replace(/^https:/, ''), im.width, im.height]),
    cl: inCols, r: rooms,
    tg: p.tags,
    o: opts.length ? opts : undefined,
    vs: p.variants.length > 1 ? p.variants.map(x => ({ id: x.id, t: x.title, p: Math.round(+x.price), cp: x.compare_at_price ? Math.round(+x.compare_at_price) : 0, a: x.available ? 1 : 0, o: [x.option1, x.option2, x.option3].filter(Boolean) })) : undefined,
    vid: v.id,
    ts: Date.parse(p.published_at || p.created_at),
  });
  const s = sections(body);
  if (s.length) descriptions[handle] = s;
}

const collections = cols.map(c => ({
  h: c.handle, t: c.title.replace(/\s+/g, ' ').trim(),
  d: (c.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  img: c.image ? c.image.src.replace(/^https:/, '') : '',
  n: membership[c.handle].length,
  ps: membership[c.handle],
}));

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify({ nav: NAV, collections, products: catalog }));
fs.writeFileSync(path.join(OUT, 'descriptions.json'), JSON.stringify(descriptions));
const sz = f => (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + ' KB';
console.log('products', catalog.length, 'with dims', catalog.filter(x => x.d).length, 'with desc', Object.keys(descriptions).length);
console.log('catalog.json', sz('catalog.json'), 'descriptions.json', sz('descriptions.json'));
