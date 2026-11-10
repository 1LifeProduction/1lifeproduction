<script setup lang="ts">
import content from '~/content/contact.json'
import { CATEGORIES, type Section } from '~/data/categories'

useHead({
  title: content.seo.titre,
  meta: [
    { name: 'description',        content: content.seo.description },
    { property: 'og:title',       content: content.seo.titre },
    { property: 'og:description', content: content.seo.description },
  ],
})

const route = useRoute()

const heroTitleLines = content.hero.titre.split('\n')
const champs = content.formulaire.champs

/* Types de projet = les 4 catégories + Autre */
const PROJECT_TYPES = [
  ...CATEGORIES.map(g => ({ value: g.section, label: g.label })),
  { value: 'autre', label: content.formulaire.typeAutre },
]

/* Budgets : labels édités dans content/contact.json (les 'valeur' sont
   figées — validées côté serveur dans server/api/contact.post.ts). */
const BUDGETS = content.formulaire.budgets.map(b => ({ value: b.valeur, label: b.label }))

const form = reactive({
  name:        '',
  company:     '',
  email:       '',
  phone:       '',
  projectType: '',
  budget:      '',
  message:     '',
})

/* Préremplissage depuis les CTA "Demander un devis" (/contact?type=live…) */
const validTypes = PROJECT_TYPES.map(t => t.value)
if (typeof route.query.type === 'string' && validTypes.includes(route.query.type as Section | 'autre' as string)) {
  form.projectType = route.query.type
}

/* Texte affiché dans les sélecteurs fermés (le texte natif du <select> est
   transparent : voir .contact-form__select-wrap dans main.css). */
const typeLabel = computed(() =>
  PROJECT_TYPES.find(t => t.value === form.projectType)?.label ?? champs.type.placeholder,
)
const budgetLabel = computed(() =>
  BUDGETS.find(b => b.value === form.budget)?.label ?? champs.budget.placeholder,
)

const status    = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorMsg  = ref('')

async function submitForm() {
  status.value   = 'sending'
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name:        form.name,
        company:     form.company,
        email:       form.email,
        phone:       form.phone,
        projectType: form.projectType,
        budget:      form.budget,
        message:     form.message,
      },
    })
    status.value = 'success'
    form.name = ''; form.company = ''; form.email = ''; form.phone = ''
    form.projectType = ''; form.budget = ''; form.message = ''
  } catch (err: any) {
    status.value   = 'error'
    errorMsg.value = err?.data?.message || err?.data?.statusMessage || err?.message || content.formulaire.messages.erreur
    console.error('[contact form]', err)
  }
}
</script>

<template>
  <div class="contact-page grid-bg">

    <!-- Titre -->
    <section class="contact-hero">
      <h1 class="contact-hero__title" data-reveal>
        <template v-for="(line, i) in heroTitleLines" :key="i">
          <br v-if="i > 0">{{ line }}
        </template>
      </h1>
      <p class="contact-hero__sub" data-reveal style="--reveal-delay:120ms">
        {{ content.hero.sousTitre }}
      </p>
    </section>

    <!-- Formulaire -->
    <section class="contact-info">

      <form class="contact-form contact-form--devis" data-reveal style="--reveal-delay:120ms" @submit.prevent="submitForm">
        <div class="contact-form__grid">
          <div class="contact-form__row">
            <label class="contact-form__label" for="cf-name">{{ champs.nom.label }}</label>
            <input id="cf-name" v-model="form.name" class="contact-form__input"
                   type="text" autocomplete="name" :placeholder="champs.nom.placeholder" required />
          </div>
          <div class="contact-form__row">
            <label class="contact-form__label" for="cf-company">{{ champs.societe.label }}</label>
            <input id="cf-company" v-model="form.company" class="contact-form__input"
                   type="text" autocomplete="organization" :placeholder="champs.societe.placeholder" />
          </div>
          <div class="contact-form__row">
            <label class="contact-form__label" for="cf-email">{{ champs.email.label }}</label>
            <input id="cf-email" v-model="form.email" class="contact-form__input"
                   type="email" autocomplete="email" :placeholder="champs.email.placeholder" required />
          </div>
          <div class="contact-form__row">
            <label class="contact-form__label" for="cf-phone">{{ champs.telephone.label }}</label>
            <input id="cf-phone" v-model="form.phone" class="contact-form__input"
                   type="tel" autocomplete="tel" :placeholder="champs.telephone.placeholder" />
          </div>
          <div class="contact-form__row">
            <label class="contact-form__label" for="cf-type">{{ champs.type.label }}</label>
            <!-- Le texte visible du champ est le <span> (il ne bouge pas) ; le texte
                 du <select> est transparent — voir .contact-form__select-wrap. -->
            <div class="contact-form__select-wrap">
              <span class="contact-form__select-value" :class="{ 'is-filled': !!form.projectType }" aria-hidden="true">{{ typeLabel }}</span>
              <select id="cf-type" v-model="form.projectType" class="contact-form__select" required>
                <!-- hidden : « Choisir » reste la valeur vide (required) mais
                     n'apparaît pas dans la liste ouverte -->
                <option value="" disabled hidden>{{ champs.type.placeholder }}</option>
                <option v-for="t in PROJECT_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
          </div>
          <div class="contact-form__row">
            <label class="contact-form__label" for="cf-budget">{{ champs.budget.label }}</label>
            <div class="contact-form__select-wrap">
              <span class="contact-form__select-value" :class="{ 'is-filled': !!form.budget }" aria-hidden="true">{{ budgetLabel }}</span>
              <select id="cf-budget" v-model="form.budget" class="contact-form__select" required>
                <option value="" disabled hidden>{{ champs.budget.placeholder }}</option>
                <option v-for="b in BUDGETS" :key="b.value" :value="b.value">{{ b.label }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="contact-form__row contact-form__row--message">
          <label class="contact-form__label" for="cf-message">{{ champs.message.label }}</label>
          <textarea id="cf-message" v-model="form.message" class="contact-form__textarea"
                    :placeholder="champs.message.placeholder" required></textarea>
        </div>
        <div class="contact-form__submit-row">
          <button class="contact-form__submit" type="submit" :disabled="status === 'sending'">
            {{ status === 'sending' ? content.formulaire.boutonEnvoi : content.formulaire.bouton }}
          </button>
          <p v-if="status === 'success'" role="status" class="contact-form__status contact-form__status--success">
            {{ content.formulaire.messages.succes }}
          </p>
          <p v-if="status === 'error'" role="alert" class="contact-form__status contact-form__status--error">
            {{ errorMsg || content.formulaire.messages.erreur }}
          </p>
        </div>
      </form>

    </section>

  </div>
</template>
