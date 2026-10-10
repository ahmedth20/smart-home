# SMART HOME GROUP — Catalogue 2026

Site statique en français : HTML, CSS et JavaScript, sans installation ni compilation.

## Démarrer

Depuis ce dossier :

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Ouvrir http://127.0.0.1:8000/.

## Catalogue

26 fiches issues du catalogue fourni : 12 lave-linge, 3 réfrigérateurs, 5 congélateurs, 2 fontaines à eau et 4 rafraîchisseurs d’air.

- `assets/data/products.json` : données des produits et pages sources du PDF.
- `assets/img/catalogue/` : photos originales extraites du catalogue, en WebP.
- `assets/css/catalogue.css` : présentation et adaptations mobile.
- `assets/js/catalogue.js` : recherche, filtres, tri et fiches détaillées.
- `scripts/build_site.py` : régénère les quatre pages et `products-data.js` depuis les données JSON. Exécuter `python scripts/build_site.py` depuis la racine après une modification des données.

Les photos, noms et descriptions proviennent du catalogue SMART HOME GROUP (V4). Les informations contradictoires des fiches des pages 3 et 5 et les volumes à confirmer de la page 10 sont signalés dans les détails.

Les prix ne sont pas fournis. Les coordonnées restent à renseigner ; la page Contact prépare une demande copiable, sans prétendre l’envoyer.

La recherche gère les accents, les filtres combinent famille et marque, et le tri s’applique au sein de chaque famille. Les fiches détaillées s’ouvrent au clic et se ferment avec Échap.

Les polices et les icônes sont chargées depuis Google Fonts et Font Awesome ; le site reste utilisable avec les polices de secours.
