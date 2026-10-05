# Mobilia Home — Architecture Shopify (thème « Mobilia Maison »)

Thème Online Store 2.0 écrit de zéro (aucun code Prestige réutilisé). Vanilla JS, aucune dépendance.
**Shopify Theme Check : 0 erreur, 0 avertissement.**

## 1. Arborescence

```
theme/
├─ layout/        theme.liquid, password.liquid
├─ config/        settings_schema.json, settings_data.json (pré-rempli : WhatsApp, téléphones, e-mail, réseaux, seuil livraison)
├─ locales/       fr.default.json (toutes les chaînes ; aucun texte d’interface en dur)
├─ templates/     index, product, collection, collection.outlet, search, cart, 404, page, page.wishlist,
│                 blog, article, list-collections, password  (JSON générés depuis la même config que le prototype)
├─ sections/      header-group.json, footer-group.json
│   ├─ globales   announcement-bar, header (+ méga-menu, menu mobile), footer, cart-drawer, predictive-search, quick-view
│   ├─ accueil    hero-shoppable, trust-bar, rooms-grid, campaign, product-tabs, brand-story, shop-the-look,
│   │             packs, interior-project, outlet-index, services, stores, journal, faq, final-cta
│   └─ gabarits   main-collection, main-product, complete-the-room, recently-viewed, main-search, main-cart,
│                 main-wishlist, main-page, main-blog, main-article, main-404, main-password, card-render
├─ snippets/      product-card, price, image, icon, icon-sprite, whatsapp-url, facets, breadcrumbs,
│                 accordion-item, look-row, quick-view, meta-tags, schema-organization, schema-product
└─ assets/        base.css, components.css, sections.css, templates.css, fonts.css.liquid, *.woff2,
                  theme.js, cart.js, search.js, facets.js, product.js, analytics.js, logo-mobilia.png
```

## 2. Ce que l’équipe marketing modifie sans développeur

| Zone | Réglages |
|---|---|
| Barre d’annonce | Messages (rotation), liens, jeton `{max_discount}` calculé sur une collection |
| Hero | Image desktop + mobile, surtitre, titre (mot en italique), texte, 2 CTA, produit étiqueté, position du point, index des pièces (menu) |
| Pièces de vie | 6 tuiles : titre, collection, collections comptées, image ou photo produit, lien |
| Campagne | Couleurs du panneau, textes, 3 produits ou une collection, « jusqu’à −X % » calculé |
| Sélection | Onglets (libellé + produits ou collection), nombre de produits |
| Inspirations | Scènes : photo, produit principal, point (x/y), 4 pièces à associer |
| Packs | Produit, nom, badge, image, composition (ou métachamp) |
| Projet, Services, FAQ, Récit, CTA final | Tous les textes, étapes, icônes, messages WhatsApp |
| Outlet | Collection, textes, adresse, nombre de catégories listées |
| Showrooms | **Métaobjets** (voir §4) |
| Fiche produit | Blocs réordonnables : titre, prix, disponibilité, sur-mesure, achat, réassurance, détails, texte |
| Collection | Surtitre, image, produits/page, tuile conseil |

## 3. Métachamps produit (`namespace: mobilia`)

À créer dans *Paramètres > Données personnalisées > Produits*. Le fichier `migration/products-metafields.csv` (Matrixify, commande `UPDATE`) pré-remplit les 5 premiers depuis les titres/descriptions existants.

| Clé | Type | Usage | Pré-rempli |
|---|---|---|---|
| `category` | Texte (1 ligne) | Surtitre carte/PDP, filtre | ✔ 1 029 |
| `display_name` | Texte (1 ligne) | Nom court (« Mona ») | ✔ 1 029 |
| `tagline` | Texte (1 ligne) | Accroche (« Design Scandinave & Confort Quotidien ») | ✔ si présent |
| `dimensions` | Texte (1 ligne) | « 270 × 205 cm » — carte, PDP, filtre Format | ✔ 523 |
| `customizable` | Booléen | Badge « Sur mesure », encart devis, délai livraison adapté | ✔ |
| `pack_items` | Liste de textes | Composition des packs | ✔ 4 packs vérifiés |
| `card_image` | Fichier (image) | Visuel de carte sans prix incrusté | — |
| `complements` | Liste de références produit | « Complétez votre intérieur » + suggestion panier | — (fallback : recommandations complémentaires Shopify) |
| `dimensions_detail` | Texte riche | Accordéon Dimensions (L × P × H, assise…) | — |
| `materials` | Texte riche | Accordéon Matières + filtre | — |
| `color` | Liste de textes | Filtre Couleur (Search & Discovery) | — |
| `care` | Texte riche | Accordéon Entretien | — |
| `warranty` | Texte riche | Accordéon Garantie & SAV | — |
| `room` | Liste de textes | Filtre Pièce | — |
| `style` | Texte (1 ligne) | Filtre Style | — |

Règle d’affichage : **un champ vide = un bloc masqué**. Aucune donnée inventée.

Filtres recommandés dans *Search & Discovery* : Type de produit, Prix, Disponibilité, `mobilia.dimensions` (Format), `mobilia.color`, `mobilia.materials`, `mobilia.room`.

## 4. Métaobjet `store`

*Paramètres > Données personnalisées > Métaobjets > Ajouter une définition* — handle `store`, accès Storefront activé.

| Champ | Type |
|---|---|
| `name` | Texte (1 ligne) |
| `city` | Texte (1 ligne) |
| `tag` | Texte (1 ligne) — « Showroom » / « Outlet » |
| `address` | Texte (1 ligne) |
| `phones` | Liste de textes |
| `opening_hours` | Texte (1 ligne) — optionnel, affiché seulement si rempli |
| `map_url` | URL — optionnel (sinon lien Google Maps généré) |

`migration/stores-metaobjects.csv` contient les 4 adresses publiées sur mobilia.ma. Les métaobjets alimentent aussi le schema `FurnitureStore` (LocalBusiness).

## 5. Menus à créer (*Contenu > Menus*)

- **main-menu** (3 niveaux) :
  `Salon` → `Salons` (Salon d’angle, Salon en U, Salon marocain, Salon 3 2 1) · `Assises` (Canapé & sofa, Clic-clac, Méridienne, Fauteuil, Pouf)
  `Salle à manger` → `Salle à manger` (Table à manger, Chaise, Buffet, Console) · `Séjour` (Table basse, Table de coin, Meuble TV)
  `Chambre` → `Chambre adulte` (Lit, Chevet, Commode, Matelas) · `Chambre enfant` (Lit enfant & junior, Bureau junior, Chaise de bureau)
  `Rangement` → Armoire, Meuble à chaussures, Commode, Étagère & bibliothèque
  `Jardin`, `Packs`, `Outlet` (liens directs)
- **pieces-de-vie** : index du hero (Salon, Salle à manger, Chambre, Rangement, Chambre enfant, Jardin)
- **footer-collections**, **footer-mobilia**, **footer-services**, **footer-aide**, **footer** (légal)

Recommandé : créer des **collections automatiques par pièce** (`salon`, `salle-a-manger`, `chambre`) basées sur le type de produit, pour que « Tout l’univers salon » mène à une vraie page indexable.

## 6. Données de commerce & URLs

- Toutes les URLs `/collections/*` et `/products/*` existantes sont conservées.
- Collection Outlet : appliquer le modèle `collection.outlet` (en-tête sombre).
- Page Favoris : créer la page `/pages/favoris` avec le modèle `page.wishlist`, puis la choisir dans *Paramètres du thème > Marque*.
- Format monétaire conseillé (*Paramètres > Général*) : `{{amount_no_decimals_with_space_separator}} DH`.

## 7. Analytics

`assets/analytics.js` pousse dans `dataLayer` (schéma GA4) : `view_item_list`, `select_item`, `view_item`, `search`, `view_search_results`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_to_wishlist`, `filter_apply`, `whatsapp_click` (avec contexte : product, buybar, cart, project, store, faq…), `newsletter_signup`.

- Installer **Google Tag Manager** (app ou Customer Events) et mapper ces événements vers GA4, Google Ads, Meta Pixel et TikTok Pixel → **une seule source, aucun doublon**.
- `purchase` et les étapes de checkout restent mesurées par les **Customer Events** de Shopify (le checkout n’est pas modifiable par le thème).
- Avant mise en ligne : vérifier qu’aucune app de tracking existante ne pousse déjà `add_to_cart` (sinon désactiver l’une des deux sources).

## 8. Performance

- Images : `image_url` + `image_tag` avec `srcset` (240 → 2000 px) et `sizes` exacts ; WebP/AVIF servis automatiquement par le CDN Shopify ; LCP préchargé (`preload: true`, `fetchpriority=high`), le reste en `loading=lazy`.
- Polices auto-hébergées préchargées, `font-display: swap`.
- CSS par gabarit (sections.css seulement là où nécessaire), JS `defer`, ~35 Ko de JS au total (13 Ko gzip), aucune librairie.
- Cadres d’image à ratio fixe → CLS 0.

## 9. Mise en ligne

1. `shopify theme push --unpublished` depuis `theme/` (Shopify CLI) — ou importer le ZIP du dossier.
2. Créer métachamps, métaobjets `store`, menus (§3–5) ; importer les CSV `migration/` (Matrixify).
3. Ouvrir l’éditeur : vérifier hero, pièces de vie, inspirations ; téléverser de vraies photos de showroom.
4. Installer/brancher GTM ; vérifier les événements en mode Aperçu.
5. Recette sur l’aperçu du thème (mobile d’abord), puis publication.

## 10. Limites connues (honnêtes)

- Le thème a passé Theme Check mais **n’a pas pu être exécuté sur la boutique** (pas d’accès Admin) : une recette sur un thème non publié est indispensable.
- Le méga-menu suppose la structure de menu décrite §5.
- Les visuels « flyers » (prix incrustés) restent visibles tant que les médias ne sont pas réordonnés — voir `migration/data-quality-report.md`.
