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
- Champs : id, title, section, category, year, client, vimeo_url, thumbnail, description, tags, featured

## Pages
- / → Home
- /evenementiel → filtrable par : captations, afterfilms, reportages, livestreams, interviews
- /commercial → filtrable par : produits, films, publicites, podcasts, portraits
- /projects/[id] → page projet dynamique
- /a-propos
- /contact → Web3Forms, clé dans .env

## Règles importantes
- Ne jamais inventer des styles qui ne sont pas dans la maquette
- Si une frame Figma est absente ou illisible, demander avant de continuer
- Toujours générer en statique (nuxt generate), jamais de SSR