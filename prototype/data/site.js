/* Mobilia Home — site configuration.
   In the Shopify theme each block below maps to theme settings, section settings or metaobjects
   (see docs/03-shopify-architecture.md). Business facts are sourced from mobilia.ma (Oct 2026);
   anything Mobilia has not published (e.g. opening hours) is left null and hidden in the UI. */
window.MOBILIA_SITE = {
  shopUrl: 'https://mobilia.ma',
  whatsapp: '212661054742',
  email: 'triangledormobilia@gmail.com',
  phone: { label: '06 61 05 47 64', tel: '+212661054764' },

  announcements: [
    { text: 'Livraison express <strong>sous 48h</strong>, partout au Maroc', href: 'index.html#services' },
    { text: 'Super Deals : jusqu’à <strong>−{superDealsMax} %</strong> sur une sélection', href: 'collection.html?c=super-deals' },
    { text: 'Montage <strong>offert</strong> par nos menuisiers', href: 'index.html#services' },
    { text: 'Crédit gratuit — renseignez-vous auprès de nos conseillers', href: 'index.html#services' },
  ],

  stores: [
    { id: 'bourgogne', city: 'Casablanca', name: 'Bourgogne', tag: 'Showroom',
      address: 'Av. Dr Med Sijilmassi (ex av. du Phare), Bourgogne', phones: ['0661 05 47 64', '0522 20 27 79'], hours: null,
      page: 'https://mobilia.ma/pages/nos-magasins-bourgogne-casablanca' },
    { id: 'ghandi', city: 'Casablanca', name: 'Boulevard Ghandi', tag: 'Showroom',
      address: '230, Boulevard Ghandi', phones: ['0661 05 47 66'], hours: null },
    { id: 'roches-noires', city: 'Casablanca', name: 'Roches Noires', tag: 'Outlet',
      address: '315, Av. Ambassadeur Ben Aicha, Quartier Roches Noires', phones: ['06 62 22 63 69'], hours: null },
    { id: 'agdal', city: 'Rabat', name: 'Agdal', tag: 'Showroom',
      address: '15, Avenue Hassan II, Résidence Meriam, Agdal', phones: ['0662 05 18 00', '0674 06 09 35'], hours: null },
  ],

  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mobiliatriangle_dor/' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/Mobiliabourgogne' },
    { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@mobiliatriangle_dor' },
    { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCVRKTyjpdkwnUSfAIojNKIg' },
  ],

  /* Free delivery threshold published on /pages/nos-services */
  freeShipping: { threshold: 2500, note: 'Livraison gratuite dans un rayon de 25 km dès 2 500 DH d’achat.' },

  /* "Merchandised" images: index of the clean lifestyle photo to use on cards/editorial slots
     (in Shopify: reorder product media, or metafield mobilia.card_image). */
  imageOverrides: {
    'pack-chambre-a-coucher-linen-lit-rangement-5-pieces': 1,
    'pack-chambre-a-coucher-ayrupa-lit-160x200-complet': 2,
    'pack-chambre-a-coucher-bellat-lit-rangement-6-pieces': 1,
    'pack-chambre-a-coucher-dora-lit-coffre-5-pieces-metal-noir': 1,
  },

  hero: {
    eyebrow: 'Nouvelle collection',
    title: 'Le design qui <em>transforme</em> votre intérieur.',
    text: 'Salons sur mesure, tables, chambres : 30 ans d’expertise au prix d’usine, livrés et montés chez vous.',
    product: 'salon-aura-canape-d-angle-design',
    hotspot: { x: 47, y: 56 },
    primary: { label: 'Découvrir la collection', href: 'collection.html?c=nouvelle-collection-1' },
    secondary: { label: 'Voir nos salons', href: 'collection.html?c=salons-d-angle-sur-mesure' },
  },

  trust: [
    { k: '30 <em>ans</em>', v: 'd’expertise dans l’ameublement' },
    { k: '48<em>h</em>', v: 'Livraison express, partout au Maroc' },
    { k: 'Montage', v: 'offert, par nos menuisiers' },
    { k: 'Conseil <em>déco</em>', v: 'gratuit avec Home Décor' },
  ],

  rooms: [
    { title: 'Salon', href: 'collection.html?room=salon', collections: ['salons-d-angle-sur-mesure', 'salon-en-u', 'salon-marocain', 'salon-3-2-1', 'canape-sofa', 'canapes-clic-clac', 'meridienne-1', 'fauteuil-1', 'poufs'], image: 'salon-angle-lumia-400x220-panoramique-bois-massif' },
    { title: 'Salle à manger', href: 'collection.html?room=sejour', collections: ['table-a-manger-1', 'chaises-1', 'buffets', 'console-1'], image: 'table-a-manger-ronde-avec-6-chaises' },
    { title: 'Chambre', href: 'collection.html?room=chambre', collections: ['lits-adulte-1', 'chevet', 'commode-1', 'matelas'], image: 'lit-terracotta-design-audacieux-confort-premium' },
    { title: 'Rangement', href: 'collection.html?c=rangements', collections: ['armoire-1', 'meuble-a-chaussures-1', 'petit-rangement-1', 'rangements'], image: 'buffet-1' },
    { title: 'Chambre enfant', href: 'collection.html?room=enfant', collections: ['lits-enfants', 'bureaux-enfants', 'chaises-de-bureaux'], image: 'lit-enfant-tapisse-arc-en-ciel-90x200-multicolore' },
    { title: 'Jardin', href: 'collection.html?c=espace-dexterieur', collections: ['espace-dexterieur'], image: 'salon-dexterieur-belen' },
  ],

  campaign: {
    eyebrow: 'Offres du moment',
    title: 'Les<br>Soldes',
    text: 'Méridiennes, lits et fauteuils à prix doux, dans la limite des stocks disponibles. Le « jusqu’à » est calculé sur les prix affichés.',
    cta: { label: 'Voir toutes les offres', href: 'collection.html?c=super-deals' },
    products: ['meridienne-bobo-bouclette-gris-perle-sur-mesure', 'lit-tapisse-tio-creme-boucle-design-galbe-sommier', 'fauteuil-palvin-tissu-orange-socle-bois-massif'],
  },

  selection: [
    { id: 'salons', label: 'Salons', collection: 'salons-d-angle-sur-mesure', products: ['salon-angle-mona-270x205-bois-massif-moderne', 'salon-angle-lumia-400x220-panoramique-bois-massif', 'salon-angle-valmora-390x290-design-organique-bois-massif', 'salon-angle-calypso-260x340-confort-lounge-maroc', 'salon-d-angle-harmony', 'salon-d-angle-optima-280x200-bois-massif-moderne', 'salon-en-u-cosmo-200-400-200-bois-massif', 'salon-angle-magellan-280x200-pieds-metal-noir'] },
    { id: 'chambre', label: 'Chambre', collection: 'lits-adulte-1', products: ['lit-tapisse-hania-160x200-tissu-bouclette-design-chic', 'lit-terracotta-design-audacieux-confort-premium', 'lit-tapisse-dolce-velours-beige-personnalisable', 'lit-pure-elegance-minimaliste-serenite-absolue', 'lit-tapisse-capiton-velours-bleu-sommier-personnalisable', 'lit-tapisse-fresh-velours-vert-olive-pieds-bois', 'lit-tapisse-tio-creme-boucle-design-galbe-sommier', 'lit-enjoy-personnalisable-couleurs-dimensions'] },
    { id: 'table', label: 'Salle à manger', collection: 'table-a-manger-1', products: ['table-a-manger-ronde-avec-6-chaises', 'table-a-manger-avec-6-chaises-4', 'ensemble-table-a-manger-dayton-en-bois-massif-6-chaises-180x100-cm', 'table-manger-en-bois', 'tablea-manger-en-marbre-avec-6-chaise', 'table-a-manger-plateau-en-ceramique-avec-6-chaise', 'table-ronde-1m-avec-4-chaises', 'buffet-chic-bois-massif'] },
    { id: 'doux', label: 'Petits prix', collection: 'table-basse-1', products: ['fauteuil-hermes-design-organique-blanc-creme', 'fauteuil-palvin-tissu-orange-socle-bois-massif', 'table-basse-lyora-raffinement-naturel', 'duo-tables-basses-brave-ref-2555-bois-massif', 'pouf-andrya-rond-bouclette-socle-bois', 'table-de-chevet-1', 'buffet-uno', 'trio-table-basse-en-bois-1'] },
  ],

  story: {
    eyebrow: 'Mobilia Home depuis 30 ans',
    title: 'Des meubles pensés pour être <em>vécus</em>.',
    text: 'Depuis trois décennies, Mobilia accompagne les familles marocaines dans l’aménagement de leur intérieur. Nous sélectionnons des pièces au design actuel, au prix d’usine, et nous les livrons et les montons chez vous.',
    images: ['salon-angle-mona-270x205-bois-massif-moderne', 'fauteuil-hermes-design-organique-blanc-creme'],
    pillars: [
      { t: 'Prix d’usine', d: 'Le design contemporain, sans intermédiaire superflu.' },
      { t: 'Sur mesure', d: 'Salons d’angle personnalisables : dimensions, angle, coloris, tissus anti-taches.' },
      { t: 'Home Décor', d: 'Nos experts en décoration vous conseillent, pour tous les budgets.' },
    ],
    cta: { label: 'Nos services', href: '#services' },
  },

  /* Shop the look — the scene photo is the hero product's own photo; hotspot marks that product.
     "À associer" items are real catalogue pieces suggested by our stylists (metaobject: look). */
  looks: [
    { id: 'salon', label: 'Salon contemporain', title: 'Un salon ouvert, pensé pour recevoir', intro: 'Le salon d’angle Valmora, ses lignes organiques et nos pièces pour l’accompagner.',
      hero: 'salon-angle-valmora-390x290-design-organique-bois-massif', spot: { x: 46, y: 60 },
      pair: ['duo-tables-basses-brave-ref-2555-bois-massif', 'fauteuil-hermes-design-organique-blanc-creme', 'pouf-andrya-rond-bouclette-socle-bois', 'meuble-tv-chic'] },
    { id: 'sejour', label: 'Salle à manger', title: 'Une table ronde pour six convives', intro: 'Bois chaleureux, assises enveloppantes et rangements assortis.',
      hero: 'table-a-manger-ronde-avec-6-chaises', spot: { x: 50, y: 58 },
      pair: ['buffet-chic-bois-massif', 'buffet-1', 'console-dentree-avec-miroir-cadre-aluminium-plateau-console-en-verre'] },
    { id: 'chambre', label: 'Chambre', title: 'Une chambre douce et enveloppante', intro: 'Le lit Hania en bouclette, avec chevets, commode et matelas.',
      hero: 'lit-tapisse-hania-160x200-tissu-bouclette-design-chic', spot: { x: 50, y: 62 },
      pair: ['table-de-chevet-1', 'commode-3-tiroirs', 'matelas-smart-160x200cm'] },
    { id: 'jardin', label: 'Jardin', title: 'Le jardin comme une pièce à vivre', intro: 'Un salon d’extérieur en bois pour les longues soirées d’été.',
      hero: 'salon-d-exterieur-curly', spot: { x: 55, y: 62 },
      pair: ['salon-dexterieur-belen', 'salon-dexterieur-consoude'] },
  ],

  packs: [
    { handle: 'pack-chambre-a-coucher-bellat-lit-rangement-6-pieces', name: 'Pack chambre Bellat', badge: 'Pack chambre', items: ['Lit 160 × 200 cm', 'Sommier de rangement', '2 chevets', 'Commode', 'Miroir'] },
    { handle: 'pack-chambre-a-coucher-ayrupa-lit-160x200-complet', name: 'Pack chambre Ayrupa', badge: 'Pack chambre', items: ['Lit 160 × 200 cm', 'Sommier', '2 chevets', 'Commode', 'Miroir'] },
    { handle: 'pack-chambre-a-coucher-linen-lit-rangement-5-pieces', name: 'Pack chambre Linen', badge: 'Pack chambre', items: ['Lit 160 × 200 cm avec rangement', 'Sommier', '2 chevets'] },
    { handle: 'pack-table-a-manger-wood-avec-6-chaises', name: 'Pack salle à manger Wood', badge: 'Salle à manger', items: ['Table 160 × 90 cm bois massif', '6 chaises'] },
  ],

  project: {
    eyebrow: 'Home Décor · conseil gratuit',
    title: 'Vous avez un projet d’aménagement ?',
    text: 'Envoyez-nous vos dimensions, votre budget et vos inspirations. Nos experts en décoration vous écoutent, vous conseillent et vous accompagnent — pour tous les budgets.',
    message: 'Bonjour Mobilia, j’ai un projet d’aménagement et j’aimerais être conseillé(e). Pièce : … / Dimensions : … / Budget : …',
    steps: [
      { t: 'Vous partagez votre espace', d: 'Un message WhatsApp avec vos mesures, quelques photos ou simplement une idée.' },
      { t: 'Nous vous conseillons', d: 'Nos experts Home Décor proposent les pièces, les formats et les teintes adaptés.' },
      { t: 'Vous choisissez votre mobilier', d: 'En ligne ou en showroom, avec la possibilité du sur-mesure et du crédit gratuit.' },
      { t: 'Mobilia livre et installe', d: 'Livraison partout au Maroc et montage offert par nos techniciens menuisiers.' },
    ],
  },

  outlet: {
    collection: 'outlet-roches-noires',
    title: 'Les belles pièces. Les derniers <em>prix</em>.',
    text: 'Fins de séries et pièces d’exposition à prix réduits, à découvrir en ligne et dans notre showroom de Roches Noires.',
  },

  services: [
    { icon: 'truck', t: 'Livraison express', d: 'Recevez vos achats sous 48h, qu’ils soient effectués en magasin ou en ligne. Livraison partout au Maroc.' },
    { icon: 'pin', t: 'Livraison offerte', d: 'Gratuite dans un rayon de 25 km dès 2 500 DH d’achat.' },
    { icon: 'tool', t: 'Montage gratuit', d: 'Une équipe de techniciens menuisiers formés et expérimentés installe votre mobilier.' },
    { icon: 'spark', t: 'Home Décor', d: 'Un service conseil en décoration adapté à tous les budgets.', feature: true },
    { icon: 'card', t: 'Crédit gratuit', d: 'Crédits gratuits ou classiques à taux très intéressants, avec des organismes de crédit de renom.' },
    { icon: 'ruler', t: 'Sur mesure', d: 'Salons d’angle et packs chambre personnalisables : dimensions, coloris, tissus anti-taches.' },
    { icon: 'gift', t: 'My Wishlist', d: 'Mariage, naissance, anniversaire : ouvrez votre liste et profitez de −5 % sur les achats de vos proches, et d’un bon cadeau surprise.' },
    { icon: 'chat', t: 'À votre écoute', d: 'Une question, une réclamation ? Notre service client répond au 06 61 05 47 64 et sur WhatsApp.' },
  ],

  journal: [
    { title: 'Tendances couleurs 2027 : les teintes qui vont transformer votre intérieur', tag: 'Tendances', date: '2026-09-23',
      excerpt: 'En 2027, la décoration intérieure se réchauffe, se colore et affirme davantage sa personnalité.',
      href: 'https://mobilia.ma/blogs/news/privilegiez-un-meuble-tv-elegant-et-pratique-a-petit-prix-meubles-et-deco-au-maroc',
      img: '//mobilia.ma/cdn/shop/articles/mobilia-couleurs-de-l-annee-2027_8000634c-3506-4848-a0e6-4e73653eae02.jpg?v=1790200472' },
    { title: 'Petits espaces, grandes idées', tag: 'Conseils', date: '2026-09-23',
      excerpt: 'Un petit intérieur peut être tout aussi élégant, confortable et fonctionnel qu’un grand espace.',
      href: 'https://mobilia.ma/blogs/news/comment-choisir-son-meuble-tv-meubles-pratiques-au-maroc',
      img: '//mobilia.ma/cdn/shop/articles/mobilia-home-petit-espace-blog.jpg?v=1790189846' },
    { title: 'L’art d’aménager son salon', tag: 'Aménagement', date: '2026-09-23',
      excerpt: 'Un salon réussi ne dépend pas seulement du choix des meubles : l’équilibre entre confort, circulation et décoration fait toute la différence.',
      href: 'https://mobilia.ma/blogs/news/lindispensable-meuble-chaussures-meubles-pratiques-au-maroc',
      img: '//mobilia.ma/cdn/shop/articles/mobilia-home-tendance-deco_c82ae790-30b7-44d0-92dc-513b4aa3bb95.jpg?v=1790189754' },
  ],

  /* Every answer below restates information published by Mobilia (services page, product pages, refund policy). */
  faq: [
    { q: 'Quels sont les délais de livraison ?', a: 'Avec notre service Livraison Express, vous recevez vos achats sous 48h, qu’ils soient effectués en magasin ou en ligne. Nous préparons soigneusement votre commande et la livrons directement à votre adresse, partout au Maroc.' },
    { q: 'La livraison est-elle gratuite ?', a: 'La livraison est gratuite dans un rayon de 25 km dès 2 500 DH d’achat. Au-delà, la livraison reste disponible partout au Maroc : notre service client vous en précise les conditions.' },
    { q: 'Le montage est-il inclus ?', a: 'Oui, le montage est gratuit. Notre équipe est composée de techniciens menuisiers formés et expérimentés dans les travaux d’ébénisterie, de montage et d’aménagement.' },
    { q: 'Quels sont les moyens de paiement ?', a: 'Vous pouvez régler en ligne de façon sécurisée, par virement bancaire ou en magasin. Pour les modèles fabriqués sur mesure, une avance de 30 % est demandée pour lancer la fabrication.' },
    { q: 'Puis-je payer en plusieurs fois ?', a: 'Oui. Nous proposons des crédits gratuits ou classiques, à des taux très intéressants, offerts par des organismes de crédit de renom. Renseignez-vous auprès de nos conseillers en showroom ou sur WhatsApp.' },
    { q: 'Puis-je personnaliser mon salon ?', a: 'Nos salons d’angle sont personnalisables : dimensions ajustables, choix de l’angle, large choix de coloris et tissus anti-taches. Faites une demande de devis personnalisé à nos conseillers.' },
    { q: 'Puis-je voir les meubles avant d’acheter ?', a: 'Oui. Nos showrooms de Casablanca (Bourgogne, Boulevard Ghandi, Roches Noires) et de Rabat (Agdal) vous accueillent. Certains modèles sont disponibles à l’essai au showroom Bourgogne.' },
    { q: 'Proposez-vous un conseil en décoration ?', a: 'Oui, avec Home Décor : nos experts en décoration vous écoutent, vous conseillent et vous accompagnent dans la réalisation de vos projets. Un service adapté à tous les budgets.' },
    { q: 'Comment retourner un article ?', a: 'Pour être éligible à un retour, l’article doit être dans l’état où vous l’avez reçu, inutilisé, dans son emballage d’origine et accompagné de la preuve d’achat. Les articles soldés et les produits sur mesure ne peuvent pas être retournés. Contactez-nous à triangledormobilia@gmail.com pour toute demande.' },
    { q: 'Comment faire une réclamation ?', a: 'Notre service client est à votre écoute au 06 61 05 47 64 et sur WhatsApp (service réclamation). Inspectez votre commande à la réception et contactez-nous immédiatement en cas de défaut.' },
  ],

  /* Rules for "Complétez votre intérieur" (in Shopify: product metafield mobilia.complements,
     falling back to these category rules). */
  complements: {
    "Salon d'angle": ['table-basse-1', 'fauteuil-1', 'meuble-tv-1', 'poufs'],
    'Salon en U': ['table-basse-1', 'fauteuil-1', 'meuble-tv-1'],
    'Salon marocain': ['table-basse-1', 'table-de-coin', 'poufs'],
    'Salon 3 2 1': ['table-basse-1', 'meuble-tv-1', 'table-de-coin'],
    'Salon': ['table-basse-1', 'fauteuil-1', 'meuble-tv-1'],
    'Canapé': ['table-basse-1', 'fauteuil-1', 'poufs'],
    'Clic-clac': ['table-basse-1', 'poufs', 'table-de-coin'],
    'Méridienne': ['fauteuil-1', 'table-de-coin', 'poufs'],
    'Fauteuil': ['table-de-coin', 'poufs', 'table-basse-1'],
    'Pouf': ['fauteuil-1', 'table-basse-1', 'table-de-coin'],
    'Table basse': ['fauteuil-1', 'meuble-tv-1', 'poufs'],
    'Table de coin': ['fauteuil-1', 'table-basse-1', 'poufs'],
    'Meuble TV': ['table-basse-1', 'buffets', 'petit-rangement-1'],
    'Table à manger': ['chaises-1', 'buffets', 'console-1'],
    'Chaise': ['table-a-manger-1', 'buffets', 'console-1'],
    'Buffet': ['table-a-manger-1', 'chaises-1', 'console-1'],
    'Console': ['meuble-a-chaussures-1', 'buffets', 'petit-rangement-1'],
    'Lit': ['matelas', 'chevet', 'commode-1'],
    'Pack': ['matelas', 'armoire-1', 'commode-1'],
    'Matelas': ['lits-adulte-1', 'chevet', 'commode-1'],
    'Chevet': ['lits-adulte-1', 'commode-1', 'matelas'],
    'Commode': ['chevet', 'armoire-1', 'lits-adulte-1'],
    'Armoire': ['commode-1', 'chevet', 'meuble-a-chaussures-1'],
    'Lit enfant': ['bureaux-enfants', 'chaises-de-bureaux', 'matelas'],
    'Bureau junior': ['chaises-de-bureaux', 'lits-enfants', 'petit-rangement-1'],
    'Chaise de bureau': ['bureaux-enfants', 'petit-rangement-1', 'lits-enfants'],
    'Meuble à chaussures': ['console-1', 'armoire-1', 'petit-rangement-1'],
    'Étagère': ['meuble-tv-1', 'buffets', 'console-1'],
    'Jardin': ['espace-dexterieur'],
  },
};
