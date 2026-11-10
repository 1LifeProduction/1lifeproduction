# Guide de gestion du contenu

Ce document explique **comment modifier tous les textes et contenus du site** sans toucher au reste du code.

> ⚠️ Le site est **statique** : après chaque modification, il faut **régénérer et redéployer** le site pour que les changements soient visibles en ligne (voir [Mettre en ligne](#mettre-en-ligne-après-modification) en bas).

---

## 0. Carte des fichiers — où modifier quoi ?

**Tous les textes du site** vivent dans le dossier `content/` (+ les projets dans `data/projects.json`) :

| Fichier | Contenu |
|---------|---------|
| `content/home.json` | Page d'accueil : baseline + grand titre du hero, texte de présentation du studio, cards expertises (tags, descriptions, bouton), SEO. |
| `content/categories.json` | Les 4 pages catégories (Live, Documentaire, Marque, Événementiel) : hero, sous-catégories (titres, descriptions, tags), process, FAQ, CTA devis, SEO. |
| `content/equipe.json` | Page Équipe : titre, paragraphes d'intro, **membres de l'équipe** (nom, rôle, photo), repères chiffrés, FAQ, CTA, SEO. |
| `content/contact.json` (dont `formulaire.confirmation` : l'e-mail automatique reçu par le visiteur) | Page Contact : titre, sous-titre, libellés et placeholders du formulaire, budgets, messages de confirmation/erreur, SEO. |
| `content/global.json` | Commun à tout le site : email et adresse du footer, URLs des réseaux sociaux, titre du bandeau clients, libellés d'interface (« Voir les projets », « Questions fréquentes »…). |
| `content/clients.json` | Logos du bandeau marques défilant. |
| `content/legal.json` | Pages légales (mentions légales, politique de confidentialité) : titre + sections (`titre`, `paragraphes`). Tant que `sections` est vide, la page affiche « Contenu à venir ». |
| `public/showreel*.mp4`, `public/videos/`, `public/covers/` | Vidéos d'habillage et couvertures (voir section 6). |
| `data/projects.json` | Les projets (réalisations) : titres, catégories, liens vidéo (Vimeo ou YouTube), vignettes. |

Conventions dans les textes :
- `\n` = **saut de ligne** (dans les grands titres et l'adresse).
- `**mot**` = mot en **gras** (dans les paragraphes d'intro accueil/équipe).
- On ne modifie que les **valeurs** entre guillemets, jamais les **clés** à gauche des `:`.

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
  "section": "live",
  "category": "live-sessions",
  "year": 2026,
  "client": "Saphir Session",
  "vimeo_url": "https://vimeo.com/76979871",
  "thumbnail": "/thumbnails/lowtso.webp",
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
| `section` | ✅ | `"live"`, `"documentaire"`, `"marque"` **ou** `"evenementiel"` (uniquement ces quatre valeurs). Détermine sur quelle page le projet apparaît. |
| `category` | ✅ | Sous-catégorie. **Doit correspondre exactement** à un slug autorisé pour la section (voir tableau ci-dessous). |
| `year` | — | Année (nombre, sans guillemets), facultative. Ex. `2026`. |
| `client` | ✅ | Nom du client. |
| `vimeo_url` | ✅ | Lien de la vidéo : **Vimeo ou YouTube** (`vimeo.com/…`, `youtube.com/watch?v=…`, `youtu.be/…`, Shorts, ou une **playlist** `youtube.com/playlist?list=…`). Peut rester vide `""` : la vignette (ou les photos) s'affiche à la place. |
| `photos` | — | Facultatif. Liste de photos pour un **projet photo** (ou vidéo + photos) : `["/photos/mon-projet/1.webp", "/photos/mon-projet/2.webp"]`. Fichiers à déposer dans `public/photos/mon-projet/`. La modale affiche alors un carrousel (flèches, clavier). |
| `thumbnail` | ✅ | Chemin de la vignette. Le fichier doit être déposé dans `public/thumbnails/` et écrit ici **sans `/public`** (ex. `/thumbnails/mon-image.png`). |
| `description` | ✅ | Texte de présentation du projet. |
| `tags` | ✅ | Liste de mots-clés entre crochets (ex. `["live", "captation"]`). Peut être vide : `[]`. |
| `featured` | ✅ | `true` = le projet apparaît **sur la page d'accueil** (carrousel). `false` = il n'apparaît que sur sa page de section. |

### Valeurs autorisées pour `category`

La `category` doit appartenir à la même `section` :

**Section `live`** :
- `live-sessions`
- `captation-multicam`
- `livestream`

**Section `documentaire`** :
- `documentaire-musical`
- `artisanat-savoir-faire`
- `cuisine-territoires`

**Section `marque`** :
- `film-de-marque`
- `video-corporate`
- `film-produit`
- `podcasts-emissions`
- `publicite-vfx`
- `photographie`
- `3d-scenographie`

**Section `evenementiel`** :
- `aftermovie`
- `reportage-photo-video`
- `conferences-institutionnel`

> La **liste** des catégories (slugs) est définie dans `data/categories.ts`. Si une nouvelle catégorie est nécessaire, c'est ce fichier qu'il faut faire évoluer (demander à un dev). Pour modifier leurs **textes** (titres, descriptions, mots-clés), voir la [section 2](#2-les-textes-des-catégories-titres-descriptions-mots-clés).

### Où apparaît un projet ?

- **Page d'accueil** (`/`) : uniquement les projets avec `"featured": true`.
- **Pages catégories** (`/live`, `/documentaire`, `/marque`, `/evenementiel`) : chaque projet apparaît dans le bloc de sa sous-catégorie (`category`).
  - Le **premier** projet de la liste (dans `projects.json`) pour une sous-catégorie donnée = **projet phare** du bloc (grande vidéo/vignette).
  - Les **suivants** apparaissent dans le tiroir « Voir les projets » (clic → ouverture en modale).
  - L'**ordre dans le fichier** détermine donc qui est mis en avant.

---

### ➕ Ajouter un projet

1. **Déposer la vignette** dans le dossier `public/thumbnails/` (ex. `public/thumbnails/mon-projet.webp`). Format conseillé : image horizontale, nette.
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
    "thumbnail": "/thumbnails/mon-projet.webp",
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

### Structure d'une catégorie (Live, Documentaire, Marque, Événementiel)

Chaque catégorie contient tous les textes de sa page :

```json
"live": {
  "titre": "Live",
  "hero": {
    "kicker": "Captation multicam · Live session · Livestream",
    "titre": "Notre place n'a jamais été dans le public.",
    "sousTitre": "Elle a toujours été entre la scène...",
    "copy": "Chez 1Life Production, nous imaginons..."
  },
  "process": {
    "titre": "La technique n'est jamais le point de départ.",
    "etapes": [ { "titre": "Comprendre", "texte": "..." } ],
    "signature": { "titre": "Premiers arrivés, derniers repartis.", "texte": "..." }
  },
  "faq": {
    "titre": "Live, captation multicam & livestream.",
    "items": [ { "q": "Question ?", "a": "Réponse." } ]
  },
  "cta": { "titre": "Vous préparez un live ?", "texte": "...", "bouton": "Demander un devis" }
}
```

| Bloc | Description |
|------|-------------|
| `titre` | Le nom affiché dans le menu et le footer. |
| `hero` | Le haut de la page : `kicker` (petite ligne au-dessus), `titre` (accroche), `sousTitre`, `copy` (paragraphe). |
| `process` | La section « Comment on travaille » : 4 `etapes` + la `signature` (citation). |
| `faq` | Les questions fréquentes de la page (`items` : liste de `q`/`a`). |
| `cta` | Le bandeau devis en bas de page (`titre`, `texte`, `bouton`). |

### Structure d'une sous-catégorie

```json
"live-sessions": {
  "kicker": "01 · Production artistique",
  "titre": "Live sessions",
  "description": "Premier paragraphe.\n\nDeuxième paragraphe.",
  "tags": ["Production artistique", "Repérage", "Scénographie"]
}
```

| Champ | Description |
|-------|-------------|
| `kicker` | La petite ligne numérotée au-dessus du titre (ex. `01 · Énergie`). |
| `titre` | Le nom affiché de la sous-catégorie. |
| `description` | Le texte de présentation. `\n\n` = saut de paragraphe. |
| `tags` | Les petites bulles de mots-clés. Liste entre crochets, chaque mot entre guillemets, séparés par des virgules. `[]` = aucune bulle. |

> ⚠️ Pour **ajouter une nouvelle catégorie** (et pas seulement modifier son texte), il faut faire évoluer `data/categories.ts` → demander à un dev. Ici, vous modifiez uniquement **les textes** des catégories existantes.

---

## 3. Les logos clients (bandeau défilant)

Le bandeau de logos qui défile (accueil + page « À propos ») est alimenté par :

```
content/clients.json
```

### Étape 1 — Déposer l'image du logo
Placez le fichier dans le dossier **`public/clients/`**.

- Format conseillé : **PNG ou WebP à fond transparent**.
- Un logo listé dans `clients.json` dont le fichier n'est **pas encore** dans `public/clients/` est simplement ignoré (rien de cassé dans le bandeau) : il apparaît dès que le fichier est déposé et le site regénéré.
- ⚠️ Les logos sont affichés **en blanc** (un filtre est appliqué automatiquement) : choisissez des logos lisibles en silhouette unie (un logo monochrome rend mieux).
- Exemple : `public/clients/adidas.png`

### Étape 2 — L'ajouter à la liste
Ouvrez `content/clients.json` et ajoutez une ligne :

```json
[
  { "nom": "Nike", "logo": "nike.png" },
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

## 4. Les membres de l'équipe (page « Équipe »)

L'équipe s'affiche dans la **constellation** de la page `/equipe`. Elle est définie dans :

```
content/equipe.json
```

Bloc `"equipe"` → `"membres"` :

```json
"membres": [
  { "photo": "", "nom": "QUENTIN", "role": "Directeur de production" },
  { "photo": "", "nom": "TITOUAN", "role": "Réalisateur · Directeur technique" }
]
```

Chaque ligne = un membre, avec 3 champs :

| Champ | Description |
|-------|-------------|
| `photo` | Chemin de la photo. Le fichier va dans `public/team/` et s'écrit **sans `/public`** (ex. `/team/1.png`). Mettre `""` (vide) → la bulle affiche l'initiale du prénom. |
| `nom` | Nom affiché sous la bulle. |
| `role` | Rôle/poste affiché en dessous. |

> 💡 La forme s'adapte automatiquement au **nombre de membres** (polygone régulier) : on peut ajouter ou retirer une ligne sans casser la disposition.

### ✏️ Renseigner / modifier un membre

1. **Déposer la photo** dans `public/team/` (idéalement **carrée**, ex. 600×600 px ; elle est recadrée en cercle).
2. Mettre à jour la ligne correspondante :

```json
{ "photo": "/team/1.png", "nom": "Jean Dupont", "role": "Réalisateur" },
```

L'ordre des lignes correspond à l'ordre des bulles autour du polygone. Les autres textes de la page (intro, repères, FAQ, CTA) se modifient dans le même fichier.

### Remplacer une photo

Soit on remplace directement le fichier dans `public/team/` (en gardant le même nom, ex. `1.png`), soit on dépose un nouveau fichier et on met à jour le champ `photo` avec le nouveau chemin.

---

## 5. Réseaux sociaux, e-mail & adresse du footer

Tout se modifie dans :

```
content/global.json
```

Bloc `"footer"` : `email`, `adresse` (`\n` = saut de ligne) et `reseaux` (les URLs Instagram / YouTube / TikTok / LinkedIn — vider une URL `""` masque sa pastille).

---

## 6. Vidéos d'habillage (showreels, teaser) et couvertures

Les vidéos d'habillage **ne sont pas** des liens YouTube : ce sont des fichiers MP4 **muets** déposés dans `public/`, lus en boucle.

| Emplacement | Fichier léger (démarre tout de suite) | Fichier haute qualité (chargé en fond) |
|-------------|------------------------------------------|------------------------------------------|
| Hero de la page d'accueil | `public/showreel.mp4` | `public/showreel-hq.mp4` |
| Hero de la page Live + carte Live (accueil) | `public/videos/expertise-live.mp4` | `public/videos/expertise-live-hq.mp4` |
| Hero de la page Documentaire + carte Documentaire (accueil) | `public/videos/expertise-documentaire.mp4` | `public/videos/expertise-documentaire-hq.mp4` |

Fonctionnement : la version **légère** (720p, ~10 Mo) s'affiche immédiatement ; sur ordinateur, la version **-hq** (1080p) se télécharge en arrière-plan et remplace la légère en fondu dès qu'elle est prête. Sur mobile, seule la légère est chargée. Si le fichier -hq manque, la légère reste : rien ne casse.

Pour **remplacer** une vidéo : exporter un MP4 (H.264, sans son) aux mêmes noms de fichier. Recommandé : légère en 1280×720 (~2 Mbit/s), HQ en 1920×1080 (~5 Mbit/s). Les images d'attente (posters) des cartes sont `public/videos/expertise-*-poster.jpg`.

Les **couvertures** (image de hero des pages Marque et Événementiel, visuels des chapitres sans projet) sont dans `public/covers/` et référencées dans `content/categories.json` (`hero.image`, `hero.video`, `hero.videoHq`, et `visuel` dans une sous-catégorie).

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
