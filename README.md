# Mobilia Home — refonte e-commerce

Refonte complète de l’expérience mobilia.ma : audit, stratégie, design system, **prototype haute fidélité** alimenté par le vrai catalogue, et **thème Shopify Online Store 2.0** prêt à déployer.

## Contenu

| Dossier | Contenu |
|---|---|
| `docs/01-audit-strategy.md` | Audit Mobilia & Sketch Design, positionnement, principes, architecture de l’information, plans de pages |
| `docs/02-design-system.md` | Couleurs, typographie, grille, ratios, composants, mouvement, accessibilité |
| `docs/03-shopify-architecture.md` | Arborescence du thème, réglages éditables, métachamps, métaobjets, menus, analytics, mise en ligne |
| `prototype/` | Site navigable (accueil, collections, pièces de vie, recherche, fiche produit, panier, favoris) sur les **1 029 vrais produits** |
| `theme/` | Thème Shopify « Mobilia Maison » (Liquid, sections, blocs, JSON templates) — Theme Check : 0 problème |
| `migration/` | Import Matrixify des métachamps produits, métaobjets showrooms, rapport qualité catalogue |
| `tools/` | Pipeline de données, génération des templates, captures QA, audits axe/Theme Check |
| `qa/` | Captures d’écran de recette (desktop, tablette, mobile, états interactifs) |

## Lancer le prototype

```bash
node tools/serve.js        # → http://localhost:4173
```

Pages : `/` · `/collection.html?c=salons-d-angle-sur-mesure` · `/collection.html?room=chambre` · `/collection.html?q=table` · `/collection.html?list=favoris` · `/product.html?p=salon-angle-valmora-390x290-design-organique-bois-massif`

« Finaliser la commande » ouvre le **vrai panier mobilia.ma** (permalien `/cart/variant:qty`) ; les boutons WhatsApp écrivent au vrai numéro du service commercial avec le produit, la quantité, le prix et l’URL.

## Régénérer

```bash
node tools/build-catalog.js     # catalogue normalisé depuis tools/research (exports publics mobilia.ma)
node tools/gen-templates.js     # theme/templates/*.json depuis prototype/data/site.js
node tools/export-migration.js  # migration/*.csv + rapport qualité
node tools/theme-check.js       # Shopify Theme Check
node tools/a11y.js              # axe-core WCAG 2.1 AA (serveur lancé)
```

## Résultats de recette

- **Accessibilité** : axe-core 0 violation (accueil, collection, produit, recherche vide — 1440 px & 390 px) ; Lighthouse 100.
- **Lighthouse (accueil, mobile, prototype)** : Performance 81 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100 · CLS 0 · TBT 0 ms.
- **Débordement horizontal** : 0 px à 390, 768, 1024, 1100, 1280, 1440 px.
- **Theme Check** : 0 erreur, 0 avertissement.

## Principe de vérité

Aucun contenu inventé : produits, prix, remises, adresses, téléphones, services, conditions de livraison et de paiement viennent de mobilia.ma. Les données absentes (horaires, avis clients, garanties) ne sont **pas** affichées ; les composants sont prêts à les recevoir. Les « jusqu’à −X % » sont calculés sur les prix réels.
