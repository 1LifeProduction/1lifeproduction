# 1LIFE PRODUCTION — Portfolio

Site portfolio statique pour le collectif de vidéastes 1Life Production.  
Stack : Nuxt 3 · Vue 3 Composition API · CSS vanilla · `nuxt generate`

---

## Installation

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd 1lifeproduction

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env
# → Renseignez votre clé Web3Forms dans .env

# 4. Lancer le serveur de dev
npm run dev
```

Le site est accessible sur `http://localhost:3000`.

---

## Ajouter un nouveau projet

### Étape 1 — Préparer la thumbnail

Déposez l'image du projet dans `/public/thumbnails/`.

- Format recommandé : **JPEG**, ratio **16:9**, résolution min. **1280×720 px**
- Nom du fichier : utilisez le slug du projet (ex. `mon-nouveau-projet.jpg`)

### Étape 2 — Éditer `data/projects.json`

Ouvrez `data/projects.json` et ajoutez un objet à la fin du tableau :

```json
{
  "id": "mon-nouveau-projet",
  "title": "Titre du projet",
  "section": "evenementiel",
  "category": "captations",
  "year": 2025,
  "client": "Nom du client",
  "vimeo_url": "https://vimeo.com/XXXXXXXXX",
  "thumbnail": "/thumbnails/mon-nouveau-projet.jpg",
  "description": "Description courte du projet (2-3 phrases).",
  "tags": ["live", "multicam"],
  "featured": false
}
```

**Valeurs possibles :**

| Champ | Options |
|-------|---------|
| `section` | `evenementiel` · `commercial` |
| `category` — événementiel | `captations` · `afterfilms` · `reportages` · `livestreams` · `interviews` |
| `category` — commercial | `produits` · `films` · `publicites` · `podcasts` · `portraits` |
| `featured` | `true` → apparaît sur la home · `false` → section uniquement |

> **Important :** le champ `id` doit être unique et ne contenir que des lettres minuscules, chiffres et tirets.

### Étape 3 — Lancer le build

```bash
npm run build
```

Cela génère le site statique dans le dossier `.output/public/`.

### Étape 4 — Déployer sur OVH (FTP)

1. Connectez-vous à votre espace FTP OVH via FileZilla ou votre client FTP habituel :
   - Hôte : `ftp.<votre-domaine>.com`
   - Identifiant / Mot de passe : dans votre espace client OVH
   - Port : `21`

2. Naviguez vers le dossier racine de votre hébergement (souvent `www/` ou `public_html/`).

3. **Supprimez** les anciens fichiers du site.

4. **Uploadez** l'intégralité du contenu du dossier `.output/public/` vers la racine.

5. Vérifiez sur votre domaine que le site est bien mis à jour.

> **Conseil :** si vous mettez uniquement à jour des projets, vous pouvez vous contenter de remplacer les fichiers `thumbnails/`, `_payload/` et les pages HTML concernées plutôt que de tout re-uploader.

---

## Structure du projet

```
/
├── assets/css/main.css        → Variables CSS & styles globaux
├── components/
│   ├── TheHeader.vue          → Navigation principale (dropdown + mobile)
│   ├── TheFooter.vue          → Footer avec "Get In Touch"
│   ├── CategoryPage.vue       → Page catégorie (hero, chapitres, modale galerie, FAQ, CTA)
│   ├── ProgressiveVideo.vue   → Vidéo d'habillage légère → HQ en fond
│   ├── PhotoSlideshow.vue     → Diaporama auto d'une série photo
│   ├── BrandMarquee.vue       → Bandeau logos clients
│   └── VimeoEmbed.vue         → Lecteur Vimeo responsive 16:9
├── data/
│   └── projects.json          → Source de vérité pour tous les projets
├── pages/
│   ├── index.vue              → Home (featured + clients)
│   ├── evenementiel.vue       → Section événementiel + filtres
│   ├── commercial.vue         → Section commercial + filtres
│   ├── projects/[id].vue      → Page individuelle d'un projet
│   ├── a-propos.vue           → Présentation du collectif & équipe
│   └── contact.vue            → Formulaire Web3Forms + liens sociaux
├── public/
│   └── thumbnails/            → Images des projets (JPEG 16:9)
├── .env.example               → Modèle de fichier d'environnement
└── nuxt.config.ts             → Config Nuxt (CSS global, prerender, env)
```

---

## Configuration du formulaire de contact

Le formulaire utilise [Web3Forms](https://web3forms.com) — gratuit jusqu'à 250 soumissions/mois.

1. Créez un compte sur https://web3forms.com
2. Créez un formulaire pour votre domaine → copiez la clé d'accès
3. Dans `.env` : `WEB3FORMS_ACCESS_KEY=votre_cle_ici`
4. Lors du build, Nuxt injecte automatiquement la clé dans le site

---

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `WEB3FORMS_ACCESS_KEY` | Clé API Web3Forms pour le formulaire de contact |
