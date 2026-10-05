# Mobilia Home — Design system

Source de vérité : `theme/assets/base.css` (tokens) → `components.css` → `sections.css` → `templates.css`.
Le prototype et le thème Shopify utilisent **exactement les mêmes fichiers CSS**.

## 1. Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--taupe` | `#6C625B` | Couleur du logo. Surtitres, numéros, icônes, liens secondaires |
| `--saffron` | `#F0BA16` | Accent du logo. Soulignement de navigation, point actif, panneau campagne, CTA Outlet. Jamais pour du texte courant sur fond clair |
| `--ink` | `#24201D` | Texte, boutons principaux |
| `--muted` | `#6E655E` | Texte secondaire (contraste 5.4:1 sur ivoire) |
| `--ivory` | `#FAF8F4` | Fond principal |
| `--linen` | `#F3EEE6` | Sections alternées |
| `--sand` / `--stone` | `#E7DED1` / `#CFC4B5` | Fonds tertiaires, états vides |
| `--line` / `--line-strong` | `#E2DACE` / `#CBBFAF` | Filets |
| `--night` | `#1C1917` | Footer, Outlet |
| `--sale` | `#9E3D22` | Remise (texte), badge −% sur la fiche produit |
| `--ok` | `#3F6B4E` | Économies, disponibilité |
| `#5A514B` | — | Fond « Projet d’aménagement » (taupe approfondi pour garantir 4.5:1 sur texte clair) |

Les deux couleurs de marque ont été **échantillonnées sur le PNG officiel** du logo ; rien n’a été « rebrandé ».

## 2. Typographie

- **Display** : *Instrument Serif* (400, italique) — titres, noms de produits, prix d’ensemble. L’italique sert à mettre un mot en valeur (« transforme », « vécus »).
- **UI** : *Manrope* variable (400–700) — interface, texte, prix, boutons. Ses formes géométriques arrondies répondent au logotype.
- Auto-hébergées (woff2, sous-ensemble latin, `font-display: swap`, préchargées).

| Style | Taille (`clamp`) | Interligne |
|---|---|---|
| Display XL | 48 → 116 px | 0.95 |
| H1 | 40 → 76 px | 1.0 |
| H2 | 32 → 56 px | 1.04 |
| H3 | 24 → 34 px | 1.12 |
| H4 | 18 → 21 px (Manrope 600) | 1.3 |
| Body L | 17 → 19 px | 1.65 |
| Body | 16 px | 1.6 |
| Small | 14 px | 1.55 |
| Label | 12 px, capitales, +0.14em | 1.2 |
| Prix | 17 px, 600, chiffres tabulaires | 1.2 |
| Navigation | 15 px, 500 | 1 |
| Boutons | 14 px, 600, capitales, +0.06em | 1 |

## 3. Grille & espacements

- 12 colonnes desktop · 8 tablette (< 1024) · 4 mobile (< 768). Gouttière `clamp(16px, …, 24px)`.
- Marges latérales `clamp(16px, 4vw, 64px)`, largeur max 1600 px.
- Échelle 4 px : 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Rythme vertical des sections : `clamp(64px, …, 144px)`.

## 4. Ratios d’image

| Contexte | Ratio |
|---|---|
| Carte produit | 4:5 (cadre fixe → aucune hauteur de carte incohérente) |
| Catégorie / pièce | 7:8 (grande tuile), 5:3.6, 4:3.4 |
| Lifestyle / scène | 4:3.2, 3:2 |
| Hero | pleine hauteur desktop, 4:4.6 mobile |
| Galerie produit | 1:1 (première), 4:5 (suivantes), 3:2 (dernière impaire) |

`object-fit: cover` partout ; les cadres sont fixés en CSS **avant** chargement → CLS = 0.

## 5. Composants

- **Boutons** : principal (encre), ghost (filet), light (sur sombre), saffron (Outlet), WhatsApp (filet + icône verte). Hauteur 52 px (44 px min. tactile).
- **Carte produit** : surtitre catégorie · nom serif · accroche · dimensions · prix / prix barré / −% discret. Second visuel au survol, favoris, aperçu rapide (desktop). Un seul badge maximum (Indisponible > Nouveau > Sur mesure).
- **Chips** : filtres, onglets, sous-catégories (pilule, 40 px).
- **Accordéons** : bouton + région, panneaux fermés `inert`.
- **Tiroirs** : panier (droite), menu & filtres (gauche/plein écran), focus piégé, Échap, restauration du focus.
- **États vides** : panier, recherche, filtres, favoris, collection, 404 — toujours une sortie (pièces de vie, WhatsApp).

## 6. Icônes

37 icônes au trait 1.5 px, grille 24 px, dessinées pour le projet (`snippets/icon-sprite.liquid`). Utilisées avec parcimonie : services, réassurance PDP, utilitaires.

## 7. Mouvement

Durées 200 / 450 / 900 ms, courbe `cubic-bezier(.16,1,.3,1)`. Zoom image au survol (1.035–1.045), soulignement de navigation, flèches qui avancent, révélations douces. `prefers-reduced-motion` coupe tout.

## 8. Accessibilité (vérifiée)

axe-core WCAG 2.1 AA : **0 violation** sur accueil, collection, produit et recherche vide, à 1440 px et 390 px. Lighthouse Accessibilité 100.
