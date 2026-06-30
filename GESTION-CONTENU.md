# Guide de gestion du contenu

Ce document explique **comment gérer les projets (réalisations) et les membres de l'équipe** sans toucher au reste du code.

> ⚠️ Le site est **statique** : après chaque modification, il faut **régénérer et redéployer** le site pour que les changements soient visibles en ligne (voir [Mettre en ligne](#mettre-en-ligne-après-modification) en bas).

---

## 1. Les projets (réalisations)

Tous les projets sont stockés dans **un seul fichier** :

```
data/projects.json
```

C'est une **liste** ( `[ ... ]` ) d'objets, chaque objet `{ ... }` = un projet.

### Exemple d'un projet

```json
{
  "id": "saphir-session-10",
  "title": "SAPHIR SESSION #10 - AIR INTER LOWTSO",
  "section": "evenementiel",
  "category": "captations",
  "year": 2026,
  "client": "Saphir Session",
  "vimeo_url": "https://vimeo.com/76979871",
  "thumbnail": "/thumbnails/lowtso.png",
  "description": "Captation de la session #10 de Saphir, tournée devant l'avion Air Inter avec l'artiste Lowtso.",
  "tags": ["session", "live", "captation"],
  "featured": true
}
```

### Signification de chaque champ

| Champ | Obligatoire | Description |
|-------|:-----------:|-------------|
| `id` | ✅ | Identifiant **unique**, en minuscules avec des tirets (ex. `mon-projet-2026`). Sert de référence interne. Ne pas mettre d'espaces ni d'accents. |
| `title` | ✅ | Titre affiché du projet. |
| `section` | ✅ | `"evenementiel"` **ou** `"commercial"` (uniquement ces deux valeurs). Détermine sur quelle page le projet apparaît. |
| `category` | ✅ | Sous-catégorie. **Doit correspondre exactement** à un slug autorisé pour la section (voir tableau ci-dessous). |
| `year` | ✅ | Année (nombre, sans guillemets). Ex. `2026`. |
| `client` | ✅ | Nom du client. |
| `vimeo_url` | ✅ | Lien Vimeo de la vidéo. |
| `thumbnail` | ✅ | Chemin de la vignette. Le fichier doit être déposé dans `public/thumbnails/` et écrit ici **sans `/public`** (ex. `/thumbnails/mon-image.png`). |
| `description` | ✅ | Texte de présentation du projet. |
| `tags` | ✅ | Liste de mots-clés entre crochets (ex. `["live", "captation"]`). Peut être vide : `[]`. |
| `featured` | ✅ | `true` = le projet apparaît **sur la page d'accueil** (carrousel). `false` = il n'apparaît que sur sa page de section. |

### Valeurs autorisées pour `category`

La `category` doit appartenir à la même `section` :

**Section `evenementiel`** :
- `captations`
- `livestreams`
- `lives-sessions`
- `afterfilms`

**Section `commercial`** :
- `podcasts-emissions`
- `produits`
- `publicites-vfx`
- `clips`
- `films`
- `scenographie-3d`

> La **liste** des catégories (slugs) est définie dans `data/categories.ts`. Si une nouvelle catégorie est nécessaire, c'est ce fichier qu'il faut faire évoluer (demander à un dev). Pour modifier leurs **textes** (titres, descriptions, mots-clés), voir la [section 2](#2-les-textes-des-catégories-titres-descriptions-mots-clés).

### Où apparaît un projet ?

- **Page d'accueil** (`/`) : uniquement les projets avec `"featured": true`.
- **Page `/evenementiel`** : tous les projets dont `section` = `evenementiel`, filtrables par `category`.
- **Page `/commercial`** : tous les projets dont `section` = `commercial`, filtrables par `category`.

---

### ➕ Ajouter un projet

1. **Déposer la vignette** dans le dossier `public/thumbnails/` (ex. `public/thumbnails/mon-projet.png`). Format conseillé : image horizontale, nette.
2. Ouvrir `data/projects.json`.
3. **Copier un projet existant** (tout le bloc entre `{` et `}`) et le coller à la suite, **séparé par une virgule**.
4. Remplacer les valeurs (penser à un `id` unique et au bon chemin `thumbnail`).

Exemple — ajout d'un projet à la fin de la liste :

```json
  {
    "id": "ancien-projet",
    "...": "..."
  },
  {
    "id": "mon-nouveau-projet",
    "title": "MON NOUVEAU PROJET",
    "section": "commercial",
    "category": "produits",
    "year": 2026,
    "client": "Nom du client",
    "vimeo_url": "https://vimeo.com/123456789",
    "thumbnail": "/thumbnails/mon-projet.png",
    "description": "Description du projet.",
    "tags": ["produit", "studio"],
    "featured": false
  }
]
```

> 🔸 Le **dernier** projet de la liste **n'a pas** de virgule après son `}` (la virgule sépare les projets, elle ne se met pas avant le `]` final).

### ✏️ Modifier un projet

Repérer le projet par son `id` ou son `title`, puis changer la valeur souhaitée. Exemple, changer l'année et le titre :

```json
"title": "TITRE MIS À JOUR",
"year": 2025,
```

Pour changer la vignette : déposer la nouvelle image dans `public/thumbnails/` et mettre à jour le champ `thumbnail`.

### 🗑️ Supprimer un projet

1. Supprimer tout le bloc du projet, de son `{` jusqu'à son `}`.
2. Supprimer aussi la **virgule** qui le séparait du projet voisin (attention à ne pas se retrouver avec deux virgules `,,` ou une virgule juste avant le `]`).
3. (Optionnel) Supprimer son image dans `public/thumbnails/`.

### ✅ Règles JSON à respecter (sinon le site ne se génère pas)

- Toujours des **guillemets droits** `"` (pas `« »` ni `'`).
- Une **virgule entre** chaque projet, **jamais** après le dernier.
- Les nombres (`year`) **sans** guillemets ; le reste **avec** guillemets.
- Astuce : coller le contenu dans un validateur JSON en ligne pour vérifier qu'il n'y a pas d'erreur de virgule.

---

## 2. Les textes des catégories (titres, descriptions, mots-clés)

Tous les **textes** des catégories et sous-catégories sont dans :

```
content/categories.json
```

> 💡 On ne modifie que ce qui est **entre les guillemets `"..."`**. On ne touche **jamais** aux clés à gauche des `:` (comme `captations`, `titre`, `description`) : elles servent aux adresses des pages.

### Structure d'une sous-catégorie

```json
"captations": {
  "titre": "Captations",
  "description": "Nous capturons vos événements avec précision...",
  "tags": ["Multicaméra", "Conférences", "Festivals", "Son pro"]
}
```

| Champ | Description |
|-------|-------------|
| `titre` | Le nom affiché de la (sous-)catégorie. |
| `description` | Le texte de présentation. Laisser `""` (vide) si pas encore rédigé → un repère `{{...}}` s'affiche en attendant. |
| `tags` | Les petites bulles de mots-clés. Liste entre crochets, chaque mot entre guillemets, séparés par des virgules. `[]` = aucune bulle. |

### Exemple — remplir une description vide

Avant :
```json
"clips": {
  "titre": "Clips",
  "description": "",
  "tags": []
}
```

Après :
```json
"clips": {
  "titre": "Clips",
  "description": "Nous réalisons des clips musicaux à l'identité forte, du concept au montage.",
  "tags": ["Musique", "Réalisation", "Montage"]
}
```

> ⚠️ Pour **ajouter une nouvelle catégorie** (et pas seulement modifier son texte), il faut faire évoluer `data/categories.ts` → demander à un dev. Ici, vous modifiez uniquement **les textes** des catégories existantes.

---

## 3. Les logos clients (bandeau défilant)

Le bandeau de logos qui défile (accueil + page « À propos ») est alimenté par :

```
content/clients.json
```

### Étape 1 — Déposer l'image du logo
Placez le fichier dans le dossier **`public/clients/`**.

- Format conseillé : **PNG à fond transparent**.
- ⚠️ Les logos sont affichés **en blanc** (un filtre est appliqué automatiquement) : choisissez des logos lisibles en silhouette unie (un logo monochrome rend mieux).
- Exemple : `public/clients/adidas.png`

### Étape 2 — L'ajouter à la liste
Ouvrez `content/clients.json` et ajoutez une ligne :

```json
[
  { "nom": "Formula 1", "logo": "f1.png" },
  { "nom": "Nike", "logo": "nike.png" },
  { "nom": "Spotify", "logo": "spotify.png" },
  { "nom": "Chanel", "logo": "chanel.png" },
  { "nom": "Adidas", "logo": "adidas.png" }
]
```

| Champ | Description |
|-------|-------------|
| `nom` | Le nom de la marque (pour l'accessibilité). |
| `logo` | Le **nom exact du fichier** déposé dans `public/clients/`. |

- Mettre une **virgule** entre chaque ligne, mais **pas** après la dernière.
- Pour **supprimer** un logo : effacer sa ligne.

> 💡 **Conseil** : garder le bandeau à **~10 logos maximum** pour qu'il reste fluide sur les téléphones. Au-delà, le défilement peut saccader sur certains mobiles.

---

## 4. Les membres de l'équipe (page « À propos »)

L'équipe s'affiche dans l'**hexagone** de la page `/a-propos`. Elle est définie dans :

```
pages/a-propos.vue
```

Cherche le bloc `const team = [ ... ]` (vers le haut du fichier) :

```js
const team = [
  { photo: '/team/1.png', name: '{{TEAM_1_NOM}}', role: '{{TEAM_1_ROLE}}' },
  { photo: '/team/2.png', name: '{{TEAM_2_NOM}}', role: '{{TEAM_2_ROLE}}' },
  { photo: '/team/3.png', name: '{{TEAM_3_NOM}}', role: '{{TEAM_3_ROLE}}' },
  { photo: '/team/4.png', name: '{{TEAM_4_NOM}}', role: '{{TEAM_4_ROLE}}' },
  { photo: '/team/5.png', name: '{{TEAM_5_NOM}}', role: '{{TEAM_5_ROLE}}' },
  { photo: '/team/6.png', name: '{{TEAM_6_NOM}}', role: '{{TEAM_6_ROLE}}' },
]
```

Chaque ligne = un membre, avec 3 champs :

| Champ | Description |
|-------|-------------|
| `photo` | Chemin de la photo. Le fichier va dans `public/team/` et s'écrit **sans `/public`** (ex. `/team/1.png`). Mettre `''` (vide) pour une bulle sans photo. |
| `name` | Nom affiché sous la bulle. |
| `role` | Rôle/poste affiché en dessous. |

> ⚠️ **L'hexagone est conçu pour exactement 6 membres** (6 sommets). Garde les **6 lignes**. Tu peux changer les photos / noms / rôles, mais n'ajoute pas une 7e ligne et n'en supprime pas (cela casserait la disposition).

### ✏️ Renseigner / modifier un membre

1. **Déposer la photo** dans `public/team/` (idéalement **carrée**, ex. 600×600 px ; elle est recadrée en cercle).
2. Mettre à jour la ligne correspondante :

```js
{ photo: '/team/1.png', name: 'Jean Dupont', role: 'Réalisateur' },
```

L'ordre des lignes (1 → 6) correspond à l'ordre des bulles autour de l'hexagone.

### Remplacer une photo

Soit on remplace directement le fichier dans `public/team/` (en gardant le même nom, ex. `1.png`), soit on dépose un nouveau fichier et on met à jour le champ `photo` avec le nouveau chemin.

---

## 5. Bonus — réseaux sociaux & e-mail du footer

Les liens des réseaux sociaux et l'adresse e-mail se trouvent dans :

```
components/TheFooter.vue
```

(bloc `const socials = [ ... ]` pour les réseaux, et le lien `mailto:` pour l'e-mail).

---

## Mettre en ligne après modification

Le site étant **statique**, après toute modification il faut le régénérer puis le redéployer :

```bash
npm run build
```

Cela lance `nuxt generate` et produit le site prêt à mettre en ligne dans le dossier **`.output/public/`** (à déployer selon votre hébergeur).

> Pour **prévisualiser** le rendu final généré :
> ```bash
> npm run preview
> ```
>
> Pour **travailler en local** avec rechargement automatique :
> ```bash
> npm run dev
> ```
> puis ouvrir l'adresse affichée (par défaut http://localhost:3000).
