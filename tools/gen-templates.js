// Generates theme/templates/*.json from prototype/data/site.js so the prototype and the
// Shopify theme share one verified content source (real handles, FAQ answers, pack compositions).
const fs = require('fs');
const path = require('path');
global.window = {};
require('../prototype/data/site.js');
const S = window.MOBILIA_SITE;
const T = path.join(__dirname, '..', 'theme', 'templates');
fs.mkdirSync(path.join(T, 'customers'), { recursive: true });

const ROOM_COLLECTION = { 'room=salon': 'salons-d-angle-sur-mesure', 'room=sejour': 'table-a-manger-1', 'room=chambre': 'lits-adulte-1', 'room=enfant': 'lits-enfants' };
const blocks = (type, list, map) => {
  const b = {}; const order = [];
  list.forEach((x, i) => { const id = `${type}_${i + 1}`; b[id] = { type, settings: map(x, i) }; order.push(id); });
  return { blocks: b, block_order: order };
};
const href = h => h.replace(/^collection\.html\?c=/, 'shopify://collections/').replace(/^index\.html/, '/').replace(/^#/, '/#');
const strip = s => s.replace(/<[^>]+>/g, '');

const index = {
  sections: {
    hero: {
      type: 'hero-shoppable',
      settings: {
        eyebrow: S.hero.eyebrow, title: S.hero.title, text: S.hero.text,
        cta1_label: S.hero.primary.label, cta1_link: href(S.hero.primary.href),
        cta2_label: S.hero.secondary.label, cta2_link: href(S.hero.secondary.href),
        product: S.hero.product, hotspot_x: S.hero.hotspot.x, hotspot_y: S.hero.hotspot.y,
        index_menu: 'pieces-de-vie',
        image_alt: 'Salon d’angle Aura dans un séjour lumineux',
      },
    },
    trust: { type: 'trust-bar', settings: { aria_label: 'Nos engagements' }, ...blocks('item', S.trust, t => ({ key: t.k, value: t.v })) },
    rooms: {
      type: 'rooms-grid',
      settings: { eyebrow: 'Par pièce de vie', title: 'Aménagez chaque <em>espace</em>.', text: 'Pensez votre intérieur pièce par pièce : salons, salles à manger, chambres et rangements, réunis au même endroit.' },
      ...blocks('room', S.rooms, r => {
        const q = r.href.split('?')[1] || '';
        const main = ROOM_COLLECTION[q] || (q.startsWith('c=') ? q.slice(2) : r.collections[0]);
        return { title: r.title, collection: main, extra_collections: r.collections, image_product: r.image, link: '' };
      }),
    },
    campaign: {
      type: 'campaign',
      settings: { eyebrow: S.campaign.eyebrow, title: S.campaign.title, text: strip(S.campaign.text.split(' Le « jusqu')[0]), show_upto: true, panel_color: '#F0BA16', text_color: '#24201D', products: S.campaign.products, collection: 'super-deals', cta_label: S.campaign.cta.label, cta_link: 'shopify://collections/super-deals', list_name: 'campaign_soldes' },
    },
    selection: {
      type: 'product-tabs', settings: { eyebrow: 'La sélection du moment', title: 'Nos pièces <em>favorites</em>.', limit: 8 },
      ...blocks('tab', S.selection, t => ({ label: t.label, products: t.products, collection: t.collection })),
    },
    story: {
      type: 'brand-story',
      settings: { eyebrow: S.story.eyebrow, title: S.story.title, text: `<p>${S.story.text}</p>`, image_product: S.story.images[0], image_2_product: S.story.images[1], cta_label: S.story.cta.label, cta_link: '/#services' },
      ...blocks('pillar', S.story.pillars, p => ({ title: p.t, text: p.d })),
    },
    looks: {
      type: 'shop-the-look', settings: { eyebrow: 'Inspirations achetables', title: 'Composez la pièce, <em>pas seulement</em> le meuble.', text: 'Chaque scène réunit une pièce maîtresse et les meubles de notre catalogue qui l’accompagnent. Ajoutez-les directement au panier.' },
      ...blocks('scene', S.looks, l => ({ label: l.label, title: l.title, intro: l.intro, product: l.hero, x: l.spot.x, y: l.spot.y, pair: l.pair })),
    },
    packs: {
      type: 'packs', settings: { eyebrow: 'Packs Mobilia', title: 'Des packs pour aménager <em>plus simplement</em>.', text: 'Des ensembles coordonnés, pensés par pièce, avec un prix d’ensemble plus doux que l’achat séparé.', collection: 'packs', cta_label: 'Tous les packs' },
      ...blocks('pack', S.packs, p => ({ product: p.handle, name: p.name, badge: p.badge, items: p.items.join('\n') })),
    },
    project: {
      type: 'interior-project',
      settings: { eyebrow: S.project.eyebrow, title: S.project.title, text: S.project.text, cta_label: 'Parler à un conseiller déco', whatsapp_message: S.project.message, cta2_label: 'Venir en showroom', cta2_link: '/#magasins' },
      ...blocks('step', S.project.steps, s => ({ title: s.t, text: s.d })),
    },
    outlet: {
      type: 'outlet-index',
      settings: { collection: S.outlet.collection, eyebrow: 'Mobilia Outlet', title: S.outlet.title, text: S.outlet.text, address: '315, Av. Ambassadeur Ben Aicha, Quartier Roches Noires, Casablanca', watermark: 'Outlet', rows: 6, cta_label: 'Découvrir l’Outlet' },
    },
    services: {
      type: 'services', settings: { eyebrow: 'Nos services', title: 'Bien plus qu’un <em>meuble</em>.', text: 'De la livraison express au conseil en décoration, nous vous accompagnons jusqu’à l’installation.' },
      ...blocks('service', S.services, s => ({ icon: s.icon, title: s.t, text: s.d, feature: !!s.feature, link_label: s.feature ? 'Prendre conseil' : '', whatsapp_message: s.feature ? 'Bonjour Mobilia, je souhaite bénéficier du service Home Décor.' : '' })),
    },
    stores: { type: 'stores', settings: { eyebrow: 'Nos showrooms', title: 'Découvrez Mobilia <em>près de chez vous</em>.', text: 'Venez voir, toucher et essayer nos salons avant de choisir. Nos conseillers vous accueillent à Casablanca et à Rabat.', image_product: 'salon-angle-calypso-260x340-confort-lounge-maroc' } },
    journal: { type: 'journal', settings: { blog: 'news', eyebrow: 'Inspirations & conseils', title: 'Le journal <em>Mobilia</em>.' } },
    faq: {
      type: 'faq', settings: { eyebrow: 'Questions fréquentes', title: 'Tout savoir avant de <em>commander</em>.', text: 'Livraison, montage, paiement, sur-mesure : les réponses de notre service client.', cta_label: 'Poser une autre question', whatsapp_message: 'Bonjour Mobilia, j’ai une question.', open_first: true, flush_top: true },
      ...blocks('question', S.faq, f => ({ question: f.q, answer: `<p>${f.a}</p>` })),
    },
    final: { type: 'final-cta', settings: { image_product: 'salon-angle-lumia-400x220-panoramique-bois-massif', eyebrow: 'Mobilia Home', title: 'Votre intérieur commence <em>ici</em>.', text: 'Découvrez nos collections ou parlez à l’un de nos conseillers : nous vous répondons sur WhatsApp.', cta_label: 'Découvrir les collections', cta_link: 'shopify://collections/salons-d-angle-sur-mesure', cta2_label: 'Parler à un conseiller', whatsapp_message: 'Bonjour Mobilia, j’aimerais être conseillé(e) pour mon intérieur.' } },
  },
  order: ['hero', 'trust', 'rooms', 'campaign', 'selection', 'story', 'looks', 'packs', 'project', 'outlet', 'services', 'stores', 'journal', 'faq', 'final'],
};

const product = {
  sections: {
    main: {
      type: 'main-product',
      blocks: {
        title: { type: 'title' }, price: { type: 'price', settings: { credit_text: 'Crédit gratuit ou classique possible' } },
        stock: { type: 'stock', settings: {} }, custom: { type: 'custom', settings: {} }, buy: { type: 'buy_buttons' },
        perks: { type: 'perks', settings: { store_link: '/#magasins' } }, details: { type: 'details', settings: {} },
      },
      block_order: ['title', 'price', 'stock', 'custom', 'buy', 'perks', 'details'],
    },
    complete: { type: 'complete-the-room', settings: {} },
    recent: { type: 'recently-viewed', settings: {} },
  },
  order: ['main', 'complete', 'recent'],
};

const simple = (type, settings = {}) => ({ sections: { main: { type, settings } }, order: ['main'] });
const files = {
  'index.json': index,
  'product.json': product,
  'collection.json': simple('main-collection'),
  'collection.outlet.json': simple('main-collection', { eyebrow: 'Roches Noires · Casablanca', show_image: false, show_tile: false }),
  'search.json': simple('main-search'),
  'cart.json': simple('main-cart'),
  '404.json': simple('main-404'),
  'page.json': simple('main-page'),
  'page.wishlist.json': simple('main-wishlist'),
  'blog.json': simple('main-blog'),
  'article.json': simple('main-article'),
  'list-collections.json': { sections: { main: { type: 'rooms-grid', settings: { eyebrow: 'Catalogue', title: 'Toutes nos <em>collections</em>.', text: '' }, ...blocks('room', S.rooms, r => ({ title: r.title, collection: r.collections[0], extra_collections: r.collections, image_product: r.image })) } }, order: ['main'] },
};
for (const [f, json] of Object.entries(files)) fs.writeFileSync(path.join(T, f), JSON.stringify(json, null, 2) + '\n');
console.log(Object.keys(files).join(', '));
