# Rapport qualité catalogue — mobilia.ma

Généré depuis l’export public du 2026-10-05 (1029 produits dans les collections publiques, 1087 produits au total).
Chaque point a un impact direct sur la conversion, le SEO ou la confiance. Priorité : P1 > P2 > P3.

## P1 — Confiance & conformité

1. **Promesse « jusqu’à −70 % »** affichée sur le site alors que la remise maximale réelle de la collection Super Deals est de **48 %**.
   → Le nouveau thème calcule ce chiffre automatiquement (barre d’annonce, campagne, outlet).
2. **Politique de remboursement** = modèle Shopify non rempli, en anglais, avec « [INSERT RETURN ADDRESS] ».
   → Rédiger la politique en français (adresse de retour, délais, exclusions sur-mesure/soldes). La FAQ du thème reprend uniquement ce qui est publié.
3. **Prix incrustés dans les visuels** (flyers « SUPER DEALS », « OUTLET », « Summer Days », « Rentrée scolaire ») — 162 produits dans ces collections. Certains portent le logo bleu « Mobilia Triangle d’or ».
   → Mettre une photo produit/lifestyle propre en première position (ou renseigner `mobilia.card_image`). Les prix doivent venir uniquement de Shopify.
  - PACK DE LA RENTRÉE SCOLAIRE — /products/pack-de-la-rentree-scolaire-2
  - PACK DE LA RENTRÉE SCOLAIRE — /products/pack-de-la-rentree-scolaire
  - PACK DE LA RENTRÉE SCOLAIRE — /products/pack-de-la-rentree-scolaire-3
  - PACK DE LA RENTRÉE SCOLAIRE — /products/pack-de-la-rentree-scolaire-1
  - BUREAU D'ÉCRITURE AVEC RANGEMENT ET TIROIR — /products/bureau-decriture-avec-rangement-et-tiroir-3

## P2 — Compréhension produit

4. **Dimensions absentes ou non structurées** : 506 produits sans dimensions détectables.
   → Le fichier `products-metafields.csv` remplit `mobilia.dimensions` pour 523 produits ; compléter les autres.
5. **Dimensions contradictoires titre / description** : 8 cas détectés.
  - Pack METROPOL – Luxe Urbain & Design Géométrique — titre 180 × 200 cm
  - Lit REMA – Éclat Mural & Design Panoramique — titre 180 × 200 cm
  - Salon d’Angle Mona - Design Scandinave & Confort Quotidien — titre 270 × 205 cm
  - Salon d’Angle MAGELLAN  Design Contemporain & Méridienne Évasion — titre 280 × 200 cm
  - Salon d’Angle Lumia - Espace XXL & Sérénité Contemporaine — titre 400 × 220 cm
6. **Type de produit vide** pour 874 produits → les filtres « Type de meuble » et l’index Outlet en dépendent. Le CSV propose un type pour chaque produit.
7. **170 produits sans description.**
8. **839 produits avec une seule photo** → pas de second visuel au survol, galerie pauvre. Viser 4+ photos (vue de face, 3/4, détail matière, mise en situation).

## P3 — SEO & cohérence

9. **Titres en majuscules** : 265 produits (ex. « TABLE À MANGER AVEC 6 CHAISES »).
  - ARMOIRE 2 PORTES — /products/armoire-2-portes
  - ARMOIRE 2 PORTES — /products/armoire-2-portes-1
  - ARMOIRE DIVA 3 PORTES — /products/armoire-diva
  - ARMOIRE DIVA 3 PORTES — /products/diva
  - ARMOIRE DIVA 4 PORTES — /products/armoire-diva-4-portes
10. **Handles qui ne correspondent plus au titre** (56 cas probables) — ex. `lit-pure-elegance-minimaliste-serenite-absolue` → « Lit Tapissé florense ».
    → Ne pas changer les handles (SEO) ; corriger plutôt les titres, ou créer des redirections 301 si renommage.
11. **Articles de blog** publiés sur des URLs sans rapport (« Tendances couleurs 2027 » sur `/privilegiez-un-meuble-tv-elegant…`). → Créer de nouveaux articles avec le bon slug + redirection 301.
12. **Collection « Packs Promos »** contenant des produits qui ne sont pas des packs (balançoires, salons de jardin seuls).
13. **Collections en double** : `table-basse-1` (Tables Basses) et `table-basses` (Table Basses).
14. **Compte à rebours expiré** (`00J 00H 00M 00S`) dans la barre d’annonce actuelle.
15. **Horaires des showrooms** non publiés → champ `opening_hours` prévu dans le métaobjet *store* (affiché uniquement s’il est rempli).
