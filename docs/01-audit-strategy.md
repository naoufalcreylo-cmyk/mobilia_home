# Mobilia Home — Audit, stratégie & plan de refonte

Document de travail · octobre 2026
Sources : mobilia.ma (thème Shopify *Prestige 4.13*, exports `products.json` / `collections.json`, pages publiques) et sketch-design.ma (site sur mesure, non-Shopify).

---

## PHASE 1 — AUDIT

### 1.1 Ce que nous avons vérifié sur mobilia.ma

| Élément | Constat (données réelles) |
|---|---|
| Plateforme | Shopify, thème Prestige 4.13 (« Mobilia - Prestige - 100% Licenced »), boutique `mobilia-triangle-dor.myshopify.com` |
| Catalogue | **1 029 produits** répartis dans **36 collections publiques** |
| Prix barrés | **993 / 1 029** produits ont un `compare_at_price` (97 %) |
| Photos | **839 produits n’ont qu’une seule photo** ; 145 produits indisponibles |
| Variantes | Aucune variante : couleurs/dimensions décrites en texte libre |
| Dimensions | Trouvées dans le titre, le handle ou la description pour 523 produits — formats hétérogènes (`220×330 cm`, `L190* D100* H80`) |
| Descriptions | 845 produits décrits ; les fiches récentes suivent une structure stable (📐 Dimensions & personnalisation · 🚚 Livraison & service · 💳 Modalités de paiement) |
| Avis | Judge.me installé, **0 avis publié** (note moyenne 0.00) |
| Logo | Wordmark taupe `#6C625B` + accent safran `#F0BA16` (couleurs échantillonnées sur le PNG officiel) |
| Showrooms | 4 adresses publiées : Bourgogne, Bd Ghandi, Roches Noires (Casablanca), Agdal (Rabat). Aucun horaire publié |
| WhatsApp | Un numéro : +212 661 05 47 42 (service commercial et réclamation) |
| Services (page *Nos services*) | Livraison express sous 48h · Livraison gratuite dans un rayon de 25 km dès 2 500 DH · Livraison partout au Maroc · Montage gratuit · Home Décor (conseil déco) · Crédit gratuit ou classique · Liste « My Wishlist » (−5 % sur les achats des proches) |
| Paiement (fiches produits) | Virement bancaire ou en magasin ; avance de 30 % pour le sur-mesure |
| Blog | 3 articles récents (Tendances couleurs 2027 · Petits espaces, grandes idées · L’art d’aménager son salon) |
| Réseaux | Facebook, Instagram, TikTok, YouTube |

### 1.2 Forces de Mobilia

1. **Profondeur de catalogue** — salons d’angle (108), tables basses (116), tables à manger (86), lits (79)… bien plus large que Sketch Design.
2. **Nouvelle photographie lifestyle** — les fiches récentes (salons Mona, Lumia, Aura, Valmora ; tables à manger ; lits tapissés) ont des visuels chauds, cohérents et premium. C’est le meilleur actif visuel de la marque.
3. **Sur-mesure** — les salons d’angle sont personnalisables (dimensions, coloris, tissus anti-taches) : argument fort et sous-exploité.
4. **Services réels et différenciants** — montage gratuit, crédit gratuit, Home Décor, livraison 48h, liste de mariage.
5. **Packs** — 47 produits dans la collection Packs, dont de vrais ensembles chambre (Linen, Cross, Bohem, Barcelone…).
6. **Réseau physique** — 3 showrooms à Casablanca + 1 à Rabat, dont un Outlet (Roches Noires).
7. **30 ans d’expertise** — affiché, mais jamais raconté.

### 1.3 Faiblesses & risques

| # | Problème | Impact |
|---|---|---|
| 1 | **Bannières « texte dans l’image »** (SUPER DEALS −70 %, PACKS PROMOS) | Non éditables, illisibles en mobile, invisibles pour le SEO et les lecteurs d’écran, esthétique « flyer » |
| 2 | **Prix incrustés dans les photos produit** (packs, outlet, summer days) — certains portent même le logo bleu « Mobilia Triangle d’or » | Prix potentiellement faux après une remise, incohérence de marque, rendu discount |
| 3 | **97 % des produits « en promo »** | Le badge promo ne signifie plus rien ; perception « déstockage permanent » |
| 4 | **Promesse « jusqu’à −70 % » non étayée** : remise max réelle 48 % dans Super Deals, 65 % dans l’Outlet | Risque de confiance (et juridique) |
| 5 | **Compte à rebours expiré** (`00J 00H 00M 00S`) dans la barre d’annonce | Signal d’abandon |
| 6 | Bandeau de réassurance avec emojis (🚚 ✔️ ⭐) | Perception amateur |
| 7 | Méga-menu texte seul, sans hiérarchie visuelle ni pièce de vie | Découverte difficile d’un catalogue profond |
| 8 | **Aucun parcours par pièce** ni inspiration achetable | Le client achète un produit, pas un intérieur |
| 9 | Collection *Packs* contenant des non-packs (balançoires, salon de jardin seul) | Brouille l’offre |
| 10 | Données produit hétérogènes (titres MAJUSCULES, dimensions contradictoires entre titre et description — ex. Mona « 270×205 » vs « 290 × 200 cm ») | Confusion, retours |
| 11 | **Politique de remboursement = modèle Shopify non rempli** (« [INSERT RETURN ADDRESS] », en anglais) | Confiance, conformité |
| 12 | Slugs de blog incohérents (« Tendances couleurs 2027 » publié sur `/privilegiez-un-meuble-tv-elegant…`) | SEO |
| 13 | WhatsApp en pop-up générique, sans contexte produit | Perte d’information, friction commerciale |
| 14 | Horaires des magasins absents | Visite en magasin freinée |

### 1.4 Sketch Design — ce qui fonctionne (stratégie, pas pixels)

| Idée Sketch | Pourquoi ça marche | Comment Mobilia fera mieux |
|---|---|---|
| Promo hero avec cartes produits « Vous économisez » | Rend la promo concrète | Promo calculée depuis les vraies données, hiérarchie prix sobre, réservée aux modules campagne — pas à chaque carte |
| « Nos collections » numérotées 01–08 | Lisibilité | **Parcours par pièce** asymétrique + méga-menu visuel par pièce + compteurs réels de pièces |
| « Notre approche » (3 piliers) | Valeur de marque | Récit « 30 ans » + **sur-mesure** prouvé par les fiches + Home Décor |
| « En situation » — ensembles photographiés | Inspiration | **Scènes achetables** : point d’intérêt sur le produit + pièces réelles à associer, par pièce de vie |
| Magasins + « Venez toucher, essayer » | Rassure | Sélecteur de showrooms avec téléphone cliquable, itinéraire, WhatsApp |
| Commande via WhatsApp (sélection envoyée) | Canal naturel au Maroc | **Double voie** : vrai checkout Shopify **et** WhatsApp pré-rempli (produit, URL, quantité ; panier complet) |
| FAQ | Lève les objections | FAQ répondue uniquement avec des informations Mobilia vérifiées + schema FAQPage |
| Projet d’aménagement en 3 étapes | Conseil | 4 étapes jusqu’à « Mobilia livre et installe » (montage gratuit réel) |

**Faiblesses de Sketch à exploiter** : pas de paiement en ligne (WhatsApp obligatoire), cartes produit très chargées (−51 %, −45 %… partout), pas de filtres avancés, pas de cross-sell par pièce, pas de packs structurés, méga-menu plat.

---

## PHASE 2 — STRATÉGIE

### 2.1 Positionnement

> **Mobilia Home — le design qui se vit, au prix d’usine.**
> 30 ans à meubler les intérieurs marocains : des pièces sur mesure, livrées et montées chez vous, avec un conseiller pour composer l’ensemble.

Promesse en trois temps, déclinée partout : **Inspirer** (pièces de vie, scènes) → **Rassurer** (prix d’usine, 48h, montage, crédit, showrooms) → **Accompagner** (Home Décor, WhatsApp contextuel).

### 2.2 Direction visuelle

*Magazine d’architecture × showroom contemporain × e-commerce premium.*

- La **photographie lifestyle** est le langage principal ; l’UI se retire.
- Fond ivoire chaud, encre taupe-anthracite, **safran Mobilia** utilisé comme signature (soulignement, point actif, module campagne), jamais comme aplat généralisé.
- Typographie éditoriale serif en très grand corps, sans-serif géométrique pour l’interface (écho aux formes arrondies du logo).
- Asymétrie maîtrisée, filets fins, pas de cartes ombrées, rayons de 2 px.
- Promotions fortes mais **cantonnées** : un module campagne, un Outlet distinct (fond sombre), des prix barrés discrets sur les cartes.

### 2.3 Principes de design

1. **Une pièce, pas un produit** — chaque parcours ramène à la pièce de vie.
2. **Promo honnête** — remises calculées, jamais incrustées dans l’image.
3. **Moins, mais plus grand** — 4 produits visibles valent mieux que 12 vignettes.
4. **WhatsApp au bon moment** — jamais flottant en 5 exemplaires ; contextuel et pré-rempli.
5. **Tout est éditable** — aucun texte de campagne codé en dur.
6. **Donnée absente = composant masqué** — jamais de contenu inventé.

### 2.4 Architecture de l’information

```
Accueil
├─ Salon ............ Salons : d’angle · en U · marocain · 3 2 1
│                     Assises : canapé & sofa · clic-clac · méridienne · fauteuil · pouf
├─ Salle à manger ... Salle à manger : table à manger · chaise · buffet · console
│                     Séjour : table basse · table de coin · meuble TV
├─ Chambre .......... Adulte : lit · chevet · commode · matelas
│                     Enfant : lit enfant & junior · bureau junior · chaise de bureau
├─ Rangement ........ armoire · meuble à chaussures · commode · étagère & bibliothèque
├─ Jardin
├─ Packs
├─ Outlet (Roches Noires)
└─ Utilitaires : Nos magasins · Conseil déco (WhatsApp) · Mobilia Pro · Recherche · Favoris · Panier
```
Toutes les URLs `/collections/*` et `/products/*` existantes sont conservées.

### 2.5 Architecture de la page d’accueil

| # | Section | Question CRO | Amélioration vs référence |
|---|---|---|---|
| 01 | Barre d’annonce rotative (3 messages) | Confiance | Sobre, sans compte à rebours mort |
| 02 | Header sticky + méga-menu visuel | Découverte | Colonnes par usage + visuel produit réel |
| 03 | Hero éditorial *shoppable* (titre serif XXL, produit étiqueté avec prix réel, index des pièces) | Inspiration | Pas de « image + titre centré » ; le hero vend un produit réel |
| 04 | Réassurance discrète (4 preuves) | Confiance | Typographique, sans icônes ni emojis |
| 05 | « Aménagez chaque espace » — grille asymétrique par pièce | Découverte | Compteurs réels, hover photo |
| 06 | Campagne (Super Deals) — remise max calculée | Achat | Promo forte, typographique, éditable |
| 07 | Sélection du moment — onglets (Nouveautés · Salons · Chambre · Prix doux) | Découverte | Une grille, quatre angles |
| 08 | Récit de marque « Des meubles pensés pour être vécus » | Confiance | Sur-mesure + 30 ans + Home Décor |
| 09 | Inspirations achetables (scènes par pièce) | Inspiration | Hotspot + pièces à associer, ajout au panier direct |
| 10 | Packs « pour aménager plus simplement » | Achat | Composition + économie explicites |
| 11 | Composez votre intérieur (4 étapes + WhatsApp) | Assistance | Message WhatsApp pré-rempli |
| 12 | Outlet (section sombre) | Achat | Isolé, n’abîme pas la marque |
| 13 | Services (7 services vérifiés) | Compréhension | Textes issus de *Nos services* |
| 14 | Showrooms (sélecteur) | Confiance | Tel/itinéraire/WhatsApp par magasin |
| 15 | Inspirations & conseils (blog) | Inspiration / SEO | Vrais articles |
| 16 | FAQ (réponses vérifiées) | Compréhension | Schema FAQPage |
| 17 | CTA final | Assistance | Double voie collections / conseiller |
| 18 | Footer structuré | — | Newsletter, réseaux, paiement, légal |

---

## PHASE 3 — DESIGN SYSTEM (résumé — détail dans `02-design-system.md`)

- **Typo** : *Instrument Serif* (display) + *Manrope* (UI). Échelle fluide `clamp()`.
- **Couleurs** : `--ink #24201D` · `--taupe #6C625B` (logo) · `--saffron #F0BA16` (logo) · `--ivory #FAF8F4` · `--linen #F3EEE6` · `--sand #E7DED1` · `--line #E2DACE` · `--sale #9E3D22` · `--ok #3F6B4E`.
- **Grille** : 12 colonnes desktop (gouttière 24 px, marges `clamp(16px, 4vw, 64px)`), 8 tablette, 4 mobile.
- **Ratios** : produit 4:5 · catégorie 4:5 / 3:4 · lifestyle 3:2 / 16:9 · hero 16:10 → 4:5 mobile.

---

## PHASE 4 — PLANS DE PAGES

### Accueil — voir tableau 2.5.

### Collection (PLP)
1. Fil d’Ariane → titre serif XL + compteur réel + description de collection (si renseignée dans Shopify).
2. Navigation des sous-catégories (puces de la même famille du méga-menu).
3. Barre d’outils sticky : *Filtrer* (tiroir), tri, densité de grille (desktop), nombre de résultats.
4. Filtres disponibles avec les données actuelles : type de meuble, pièce, prix (plage), disponibilité, promotion. Couleur / matière / dimensions **activés via métachamps** (voir `03-shopify-architecture.md`).
5. Filtres actifs en puces supprimables + « Tout effacer ».
6. Grille 4/3/2 colonnes ; tuile éditoriale « Besoin d’aide pour choisir ? » insérée après la 8ᵉ carte.
7. « Voir plus » progressif avec indicateur « 24 sur 108 ».
8. États : aucun résultat après filtrage, collection vide.

### Produit (PDP)
- Desktop : galerie 7/12 (grandes images empilées + vignettes, zoom plein écran), panneau 5/12 sticky.
- Panneau : catégorie · nom · accroche · dimensions · prix / prix barré / économie · disponibilité · quantité · **Ajouter au panier** · **Commander sur WhatsApp** (pré-rempli) · livraison & montage · showrooms.
- Accordéons générés depuis la description existante (Description, Dimensions & personnalisation, Livraison & service, Modalités de paiement…).
- « Complétez votre intérieur » : règles par type (salon → table basse, fauteuil, meuble TV, pouf ; lit → matelas, chevet, commode ; table → chaises, buffet, console).
- Vus récemment (local).
- Mobile : galerie swipe plein écran avec compteur, barre d’achat sticky (prix + panier + WhatsApp).

### Recherche
Overlay plein écran : champ, recherches populaires (catégories réelles), puis en saisie : catégories correspondantes, produits avec image et prix, « Voir les N résultats ». Recherche insensible aux accents. Résultats complets sur le gabarit PLP. État « aucun résultat » avec suggestions et WhatsApp.

### Panier
Tiroir latéral (plein écran mobile) : lignes (image, nom, catégorie, prix, quantité, supprimer), progression vers la livraison gratuite (2 500 DH, rayon 25 km), sous-total, **Finaliser la commande** (checkout Shopify), **Envoyer mon panier sur WhatsApp**, suggestion unique et discrète. État vide intentionnel.

### Mobile
Header compact (menu · logo · recherche · panier), menu en tiroir par pièce avec accordéons et visuels, barre d’achat sticky sur PDP, filtres plein écran, carrousels uniquement là où ils aident (sélection produits, packs).
