<script setup lang="ts">
import projectsData from '~/data/projects.json'

const clients = [
  { name: 'Formula 1', slug: 'f1'      },
  { name: 'Nike',      slug: 'nike'    },
  { name: 'Spotify',   slug: 'spotify' },
  { name: 'Chanel',    slug: 'chanel'  },
]

const members = [
  { name: 'Lucas F.',   role: 'Réalisateur' },
  { name: 'Chloé M.',   role: 'Cheffe op.' },
  { name: 'Rémi D.',    role: 'Monteur' },
  { name: 'Yasmine O.', role: 'Productrice' },
  { name: 'Tom B.',     role: 'Motion design' },
]

useHead({ title: 'À propos — 1LIFE PRODUCTION' })
</script>

<template>
  <div class="about-page grid-bg">

    <!-- Hero title -->
    <section class="about-hero">
      <h1 class="about-hero__title">About</h1>
    </section>

    <!-- Text card -->
    <section class="about-intro">
      <div class="about-intro__card">
        <p>
          <strong>1Lifeproduction</strong> est un collectif créatif spécialisé dans la
          production audiovisuelle et la création visuelle. Fondé par des amis passionnés
          par l'image, 1Life réunit une équipe multidisciplinaire composée de :
        </p>
        <p>
          <strong>photographes, vidéastes, graphistes, dronistes FPV, artistes 3D,
          motion designers et experts VFX.</strong>
        </p>
        <p>
          Depuis plus de <strong>10 ans</strong>, nous accompagnons <strong>marques,
          entreprises et créateurs</strong> dans la réalisation de contenus visuels
          <strong>forts, immersifs et impactants.</strong>
        </p>
        <p>
          Chaque projet est pensé sur mesure, avec une attention particulière portée à
          <strong>l'esthétique, à l'émotion et à la narration.</strong>
        </p>
        <p>
          De la photographie à la production vidéo, en passant par le FPV, la 3D et les
          effets visuels, nous transformons les idées en expériences visuelles uniques,
          conçues pour captiver et laisser une empreinte durable.
        </p>
        <p>
          <strong>Au-delà de la production.<br>Nous créons des visuels que l'on n'oublie pas.</strong>
        </p>
      </div>
    </section>

    <!-- Team -->
    <section class="about-team">
      <div class="about-team__blob" aria-hidden="true"></div>
      <h2 class="about-team__title">Notre équipe</h2>

      <div class="about-team__constellation" aria-hidden="true">
        <!--
          6 nœuds — disposition losange vertical :
               (c-top)
          (ml)         (mr)
          (ml2)        (mr2)
               (c-bot)
          + centre optionnel remplacé par ligne croisée
        -->
        <svg class="about-team__lines" viewBox="0 0 500 560" preserveAspectRatio="xMidYMid meet">
          <!-- horizontales -->
          <line x1="145" y1="190" x2="355" y2="190" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <line x1="145" y1="370" x2="355" y2="370" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <!-- verticales -->
          <line x1="145" y1="190" x2="145" y2="370" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <line x1="355" y1="190" x2="355" y2="370" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <!-- top vers haut-centre -->
          <line x1="145" y1="190" x2="250" y2="80"  stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <line x1="355" y1="190" x2="250" y2="80"  stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <!-- bottom vers bas-centre -->
          <line x1="145" y1="370" x2="250" y2="480" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
          <line x1="355" y1="370" x2="250" y2="480" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        </svg>

        <div class="about-team__node about-team__node--ct" ><div class="about-team__avatar"></div></div>
        <div class="about-team__node about-team__node--ml" ><div class="about-team__avatar"></div></div>
        <div class="about-team__node about-team__node--mr" ><div class="about-team__avatar"></div></div>
        <div class="about-team__node about-team__node--ml2"><div class="about-team__avatar"></div></div>
        <div class="about-team__node about-team__node--mr2"><div class="about-team__avatar"></div></div>
        <div class="about-team__node about-team__node--cb" ><div class="about-team__avatar"></div></div>
      </div>
    </section>

    <!-- Clients -->
    <section class="clients-section" aria-label="Nos clients">
      <div class="container">
        <h2 class="clients-section__label">ILS NOUS FONT<br>CONFIANCE</h2>
        <div class="clients-section__logos">
          <img
            v-for="c in clients"
            :key="c.slug"
            :src="`/clients/${c.slug}.png`"
            :alt="c.name"
            class="clients-section__logo"
          />
        </div>
      </div>
    </section>

  </div>
</template>
