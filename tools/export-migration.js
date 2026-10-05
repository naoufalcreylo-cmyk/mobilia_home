// Exports migration files for the Shopify store from the normalised catalogue:
//  - migration/products-metafields.csv  (Matrixify "Products" sheet, UPDATE only — touches nothing else)
//  - migration/stores-metaobjects.csv  (Matrixify "Metaobjects" sheet for the 4 published showrooms)
//  - migration/data-quality-report.md  (issues to fix in the catalogue, with counts and examples)
// Values are derived from Mobilia's own titles/descriptions; nothing is invented. Review before import.
const fs = require('fs');
const path = require('path');
global.window = {};
require('../prototype/data/site.js');
const S = window.MOBILIA_SITE;
const C = require('../prototype/data/catalog.json');
const OUT = path.join(__dirname, '..', 'migration');
fs.mkdirSync(OUT, { recursive: true });

const csv = rows => rows.map(r => r.map(v => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}).join(',')).join('\n') + '\n';

/* Products */
const head = ['Handle', 'Command', 'Type',
  'Metafield: mobilia.category [single_line_text_field]',
  'Metafield: mobilia.display_name [single_line_text_field]',
  'Metafield: mobilia.tagline [single_line_text_field]',
  'Metafield: mobilia.dimensions [single_line_text_field]',
  'Metafield: mobilia.customizable [boolean]',
  'Metafield: mobilia.pack_items [list.single_line_text_field]'];
const packItems = Object.fromEntries(S.packs.map(p => [p.handle, JSON.stringify(p.items)]));
const rows = [head];
for (const p of C.products) {
  const custom = p.cl.includes('salons-d-angle-sur-mesure') || /sur[ -]mesure|personnalisable/i.test(p.t);
  rows.push([p.h, 'UPDATE', p.c === 'Mobilier' || p.c === 'Autres pièces' ? '' : p.c, p.c === 'Mobilier' || p.c === 'Autres pièces' ? '' : p.c,
    p.n, p.tl, p.d, custom ? 'TRUE' : '', packItems[p.h] || '']);
}
fs.writeFileSync(path.join(OUT, 'products-metafields.csv'), '﻿' + csv(rows));

/* Stores (metaobject type "store") */
const srows = [['Handle', 'Command', 'Definition: Handle', 'Field: name', 'Field: city', 'Field: tag', 'Field: address', 'Field: phones', 'Field: opening_hours', 'Field: map_url']];
for (const s of S.stores) srows.push([s.id, 'MERGE', 'store', s.name, s.city, s.tag, s.address, JSON.stringify(s.phones), '', '']);
fs.writeFileSync(path.join(OUT, 'stores-metaobjects.csv'), '﻿' + csv(srows));

/* Data-quality report */
const raw = require('./research/all.json');
const byH = new Map(raw.map(p => [p.handle, p]));
const P = C.products;
const flyer = P.filter(p => p.cl.some(c => ['packs', 'outlet-roches-noires', 'super-deals', 'summer-days', 'rentree-scolaire'].includes(c)));
const caps = P.filter(p => p.t === p.t.toUpperCase() && /[A-Z]{4}/.test(p.t));
const noDims = P.filter(p => !p.d);
const oneImg = P.filter(p => p.i.length < 2);
const noType = raw.filter(p => !p.product_type).length;
const noDesc = P.filter(p => !(byH.get(p.h)?.body_html || '').trim());
const mismatch = P.filter(p => {
  const body = (byH.get(p.h)?.body_html || '').replace(/<[^>]+>/g, ' ');
  const m = body.match(/(\d{3})\s*cm\s*[×x]\s*(\d{3})/); const t = p.d.match(/(\d{3}) × (\d{3})/);
  return m && t && (m[1] !== t[1] || m[2] !== t[2]);
});
const handleMismatch = P.filter(p => {
  const words = p.h.split('-').filter(w => w.length > 3 && !/^(salon|angle|table|manger|avec|chaises|tapisse|bois|massif|design|pieds|metal|noir|lit|pack|chambre|coucher)$/.test(w));
  const n = p.t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return words.length && !words.some(w => n.includes(w));
});
const ex = (list, f = p => `${p.t} — /products/${p.h}`) => list.slice(0, 5).map(p => `  - ${f(p)}`).join('\n');
const maxSuper = Math.max(...C.collections.find(c => c.h === 'super-deals').ps.map(h => P.find(p => p.h === h)).filter(p => p && p.a && p.cp).map(p => Math.round((1 - p.p / p.cp) * 100)));

fs.writeFileSync(path.join(OUT, 'data-quality-report.md'), `# Rapport qualité catalogue — mobilia.ma

Généré depuis l’export public du ${new Date().toISOString().slice(0, 10)} (${P.length} produits dans les collections publiques, ${raw.length} produits au total).
Chaque point a un impact direct sur la conversion, le SEO ou la confiance. Priorité : P1 > P2 > P3.

## P1 — Confiance & conformité

1. **Promesse « jusqu’à −70 % »** affichée sur le site alors que la remise maximale réelle de la collection Super Deals est de **${maxSuper} %**.
   → Le nouveau thème calcule ce chiffre automatiquement (barre d’annonce, campagne, outlet).
2. **Politique de remboursement** = modèle Shopify non rempli, en anglais, avec « [INSERT RETURN ADDRESS] ».
   → Rédiger la politique en français (adresse de retour, délais, exclusions sur-mesure/soldes). La FAQ du thème reprend uniquement ce qui est publié.
3. **Prix incrustés dans les visuels** (flyers « SUPER DEALS », « OUTLET », « Summer Days », « Rentrée scolaire ») — ${flyer.length} produits dans ces collections. Certains portent le logo bleu « Mobilia Triangle d’or ».
   → Mettre une photo produit/lifestyle propre en première position (ou renseigner \`mobilia.card_image\`). Les prix doivent venir uniquement de Shopify.
${ex(flyer)}

## P2 — Compréhension produit

4. **Dimensions absentes ou non structurées** : ${noDims.length} produits sans dimensions détectables.
   → Le fichier \`products-metafields.csv\` remplit \`mobilia.dimensions\` pour ${P.length - noDims.length} produits ; compléter les autres.
5. **Dimensions contradictoires titre / description** : ${mismatch.length} cas détectés.
${ex(mismatch, p => `${p.t} — titre ${p.d}`)}
6. **Type de produit vide** pour ${noType} produits → les filtres « Type de meuble » et l’index Outlet en dépendent. Le CSV propose un type pour chaque produit.
7. **${noDesc.length} produits sans description.**
8. **${oneImg.length} produits avec une seule photo** → pas de second visuel au survol, galerie pauvre. Viser 4+ photos (vue de face, 3/4, détail matière, mise en situation).

## P3 — SEO & cohérence

9. **Titres en majuscules** : ${caps.length} produits (ex. « TABLE À MANGER AVEC 6 CHAISES »).
${ex(caps)}
10. **Handles qui ne correspondent plus au titre** (${handleMismatch.length} cas probables) — ex. \`lit-pure-elegance-minimaliste-serenite-absolue\` → « Lit Tapissé florense ».
    → Ne pas changer les handles (SEO) ; corriger plutôt les titres, ou créer des redirections 301 si renommage.
11. **Articles de blog** publiés sur des URLs sans rapport (« Tendances couleurs 2027 » sur \`/privilegiez-un-meuble-tv-elegant…\`). → Créer de nouveaux articles avec le bon slug + redirection 301.
12. **Collection « Packs Promos »** contenant des produits qui ne sont pas des packs (balançoires, salons de jardin seuls).
13. **Collections en double** : \`table-basse-1\` (Tables Basses) et \`table-basses\` (Table Basses).
14. **Compte à rebours expiré** (\`00J 00H 00M 00S\`) dans la barre d’annonce actuelle.
15. **Horaires des showrooms** non publiés → champ \`opening_hours\` prévu dans le métaobjet *store* (affiché uniquement s’il est rempli).
`);
console.log('products', rows.length - 1, '| stores', srows.length - 1, '| flyers', flyer.length, '| noDims', noDims.length, '| mismatch', mismatch.length, '| caps', caps.length, '| handleMismatch', handleMismatch.length, '| maxSuper', maxSuper);
