# SMART HOME GROUP — Catalogue 2026

Site statique en français : HTML, CSS et JavaScript, sans installation ni compilation.

## Démarrer

Depuis ce dossier :

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Ouvrir http://127.0.0.1:8000/.

## Catalogue

24 fiches issues du catalogue fourni : 12 lave-linge, 3 réfrigérateurs, 3 congélateurs, 2 fontaines à eau et 4 rafraîchisseurs d’air.

- `assets/data/products.json` : données des produits et pages sources du PDF.
- `assets/img/catalogue/` : photos originales extraites du catalogue, en WebP.
- `assets/css/catalogue.css` : présentation et adaptations mobile.
- `assets/js/catalogue.js` : recherche, filtres, tri et fiches détaillées.
- `scripts/build_site.py` : régénère les quatre pages et `products-data.js` depuis les données JSON. Exécuter `python scripts/build_site.py` depuis la racine après une modification des données.

Les photos, noms et descriptions proviennent du catalogue SMART HOME GROUP (V4). Les informations contradictoires des fiches des pages 3 et 5 et les volumes à confirmer de la page 10 sont signalés dans les détails.

Les prix ne sont pas fournis. La page Contact transmet directement les demandes à info@smarthome.com.tn via FormSubmit (AJAX). Le destinataire doit activer la réception via le lien de confirmation FormSubmit avant de recevoir les demandes. Aucun secret n’est stocké dans le site. Les données transitent par FormSubmit. Les messages restent dans le formulaire en cas d’erreur.

La recherche gère les accents, les filtres combinent famille et marque, et le tri s’applique au sein de chaque famille. Les fiches détaillées s’ouvrent au clic et se ferment avec Échap.

Les polices et les icônes sont chargées depuis Google Fonts et Font Awesome ; le site reste utilisable avec les polices de secours.

Photos améliorées : assets/img/catalogue/produit-{01,02,06,08,22}-hd.png. Restauration via ImageGen intégré : amélioration de netteté et réduction de pixellisation, en conservant les appareils et leur angle de vue.

## SAV et réseau

La page `sav.html` reprend les informations SAV et distribution des pages 7 et 9 de la présentation Smart Home–Midea fournie : techniciens internes, 18 agents agréés, plus de 180 revendeurs et grandes surfaces. Aucun délai ni condition de garantie n’est ajouté. Les demandes SAV et revendeur préremplissent le formulaire Contact.

Carte générée avec ImageGen intégré : `assets/img/sav/reseau-distribution-tunisie.png`. Prompt : carte illustrative de la Tunisie, palette bleu du logo, repères Nord, Grand Tunis, Nabeul–Hammamet, Kairouan, Sousse, Monastir, Sfax, Sud ; réseau de distribution distinct des centres SAV ; libellés français lisibles.

Carte géographique actuelle : assets/img/sav/reseau-distribution-tunisie.svg, construite à partir des contours Natural Earth 1:50m (domaine public), projection équirectangulaire adaptée aux latitudes tunisiennes. Fond mer/terres et repères géographiques des zones. Source : https://www.naturalearthdata.com/ et https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson .

## Animation d’accueil

Vidéo muette de 15 secondes en boucle : `assets/video/smart-home-hero.mp4` (H.264, 960×800, 24 images/s). Les scènes utilisent les visuels du catalogue ; la bannière blanche est conservée en HTML au premier plan. Contrôle pause/lecture, image de secours, lecture inline mobile et pause par défaut avec `prefers-reduced-motion`.

Sources d’animation : `scripts/hero-video-stage.html` et `scripts/render-hero-video.cjs`. Pour reconstruire, installer `imageio-ffmpeg` dans `tmp/video-tools`, puis exécuter le script Node depuis la racine avec Playwright et Edge installés. Le rendu n’est pas requis pour héberger le site.
