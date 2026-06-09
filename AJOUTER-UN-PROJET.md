# Ajouter un projet au portfolio

## 1. Préparer la miniature

Placer l'image dans `public/thumbnails/` au format `.png` ou `.jpg`.
- Dimensions recommandées : **16:9**, minimum 800×450px
- Nommage : `nom-du-projet.png` (minuscules, tirets)

## 2. Ajouter l'entrée dans `data/projects.json`

Ouvrir le fichier et ajouter un objet à la fin du tableau (avant le `]` final) :

```json
{
  "id": "nom-unique-du-projet",
  "title": "TITRE EN MAJUSCULES",
  "section": "evenementiel",
  "category": "captations",
  "year": 2026,
  "client": "Nom du client",
  "vimeo_url": "https://vimeo.com/XXXXXXXXX",
  "thumbnail": "/thumbnails/nom-du-projet.png",
  "description": "Description courte du projet.",
  "tags": ["tag1", "tag2", "tag3"],
  "featured": false
}
```

### Valeurs autorisées

| Champ | Valeurs possibles |
|---|---|
| `section` | `evenementiel` · `commercial` |
| `category` (evenementiel) | `captations` · `afterfilms` · `reportages` · `livestreams` · `interviews` |
| `category` (commercial) | `produits` · `films` · `publicites` · `podcasts` · `portraits` |
| `featured` | `true` → apparaît en home · `false` → uniquement dans sa section |

### Trouver l'URL Vimeo
Sur Vimeo, ouvrir la vidéo → **Share** → copier le lien (format `https://vimeo.com/XXXXXXXXX`).

## 3. Tester en local

```bash
npm run dev
```

Vérifier que le projet apparaît dans la bonne section et que la page `/projects/[id]` fonctionne.

## 4. Build et déploiement

```bash
npm run generate
```

Les fichiers statiques sont générés dans `.output/public/`. Uploader ce dossier sur le serveur OVH (voir ci-dessous).
