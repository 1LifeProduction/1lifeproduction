# Portfolio collectif vidéastes

## Figma
URL de la maquette : https://www.figma.com/design/GMf4oHTbzQ3QF6gSgeo4pI/1Life-Website?node-id=0-1&t=WAe4quVoOv07AAlr-1 
Utilise le MCP Figma pour lire les frames avant de coder chaque page.

## Stack
- Nuxt 3, nuxt generate, Vue 3 Composition API
- CSS vanilla avec variables, pas de Tailwind

## Conventions CSS
- Utilise les tokens de couleur exactement comme définis dans Figma
- Respecte les espacements du fichier (ne pas inventer)
- Les breakpoints sont : mobile 375px, desktop 1280px

## Structure données
- Les projets sont dans data/projects.json
- Champs : id, title, section, category, client, vimeo_url, thumbnail, description, tags, featured, photos (optionnel : série photo → carrousel dans la modale), year (optionnel)
- Médias web dans public/ : thumbnails/ (vignettes), photos/<id>/ (séries), covers/ (hero marque/événementiel + chapitres sans projet), videos/ (cartes expertises + heros Live/Docu), showreel.mp4 (hero home). Les heros utilisent components/ProgressiveVideo.vue : version légère (720p) immédiate, version -hq.mp4 (1080p) chargée en fond puis substituée en fondu (desktop uniquement)

## Pages (refonte août 2026 — structure reprise du HTML client, DA conservée)
- / → Home (hero vidéo, 3 projets featured, description studio, liens expertises, bandeau marques)
- /live, /documentaire, /marque, /evenementiel → pages catégories (composant partagé components/CategoryPage.vue) :
  hero + sous-catégories alternées gauche/droite (projet phare + tiroir « Voir les projets » → modale) + process + FAQ (JSON-LD) + CTA devis
- /equipe (remplace /a-propos) → constellation équipe + repères + FAQ + CTA devis
- /contact → formulaire devis (nom, société, email, téléphone, type de projet, budget conditionnel, message — PAS de champ Timing), envoi via /api/contact (Resend, clés dans .env)
- /commercial et /a-propos → redirections 301 via routeRules (nuxt.config.ts) vers /marque et /equipe — pas de pages stubs
- Structure catégories/sous-catégories : data/categories.ts (structure) + content/categories.json (textes client)

## Règles importantes
- Ne jamais inventer des styles qui ne sont pas dans la maquette
- Si une frame Figma est absente ou illisible, demander avant de continuer
- Pages toujours pré-rendues en HTML statique (pas de SSR à la requête). Build de prod = `nuxt build` (Vercel) : routeRules '/**' prerender + la fonction /api/contact ; `nuxt generate` reste dispo pour un hébergement purement statique (sans formulaire)