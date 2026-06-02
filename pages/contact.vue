<script setup lang="ts">
useHead({
  title: '1LIFE PRODUCTION',
  meta: [
    { name: 'description',        content: 'Contactez 1LIFE PRODUCTION pour votre prochain projet audiovisuel. Échangeons sur vos besoins créatifs.' },
    { property: 'og:description', content: 'Contactez 1LIFE PRODUCTION pour votre prochain projet audiovisuel. Échangeons sur vos besoins créatifs.' },
  ],
})

const form = reactive({
  name:    '',
  email:   '',
  subject: '',
  message: '',
})

const status    = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorMsg  = ref('')

async function submitForm() {
  status.value   = 'sending'
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name:    form.name,
        email:   form.email,
        subject: form.subject,
        message: form.message,
      },
    })
    status.value   = 'success'
    form.name    = ''
    form.email   = ''
    form.subject = ''
    form.message = ''
  } catch (err: any) {
    status.value   = 'error'
    errorMsg.value = err?.data?.message || err?.data?.statusMessage || err?.message || 'Une erreur est survenue, réessayez.'
    console.error('[contact form]', err)
  }
}
</script>

<template>
  <div class="contact-page grid-bg">

    <!-- Titre -->
    <section class="contact-hero">
      <h1 class="contact-hero__title">GET<br>IN TOUCH</h1>
    </section>

    <!-- Carte contact + formulaire -->
    <section class="contact-info">

      <div class="contact-info__card">
        <div class="contact-info__row">
          <span class="contact-info__label">Instagram</span>
          <a href="https://instagram.com/1lifeproduction" target="_blank" rel="noopener"
             class="contact-info__value">@1lifeproduction</a>
        </div>
        <div class="contact-info__row">
          <span class="contact-info__label">LinkedIn</span>
          <a href="https://linkedin.com" target="_blank" rel="noopener"
             class="contact-info__value">@1Life Production</a>
        </div>
        <div class="contact-info__row">
          <span class="contact-info__label">Mail</span>
          <a href="mailto:1lifeprod@unlockcollectif.com"
             class="contact-info__value">1lifeprod@unlockcollectif.com</a>
        </div>
      </div>

      <form class="contact-form" @submit.prevent="submitForm">
        <div class="contact-form__row">
          <label class="contact-form__label" for="cf-name">Nom</label>
          <input id="cf-name" v-model="form.name" class="contact-form__input"
                 type="text" placeholder="Votre nom" required />
        </div>
        <div class="contact-form__row">
          <label class="contact-form__label" for="cf-email">Email</label>
          <input id="cf-email" v-model="form.email" class="contact-form__input"
                 type="email" placeholder="votre@email.com" required />
        </div>
        <div class="contact-form__row">
          <label class="contact-form__label" for="cf-subject">Objet</label>
          <input id="cf-subject" v-model="form.subject" class="contact-form__input"
                 type="text" placeholder="Sujet du message" required />
        </div>
        <div class="contact-form__row contact-form__row--message">
          <label class="contact-form__label" for="cf-message">Message</label>
          <textarea id="cf-message" v-model="form.message" class="contact-form__textarea"
                    placeholder="Votre message..." required></textarea>
        </div>
        <div class="contact-form__submit-row">
          <button class="contact-form__submit" type="submit" :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Envoi…' : 'Envoyer' }}
          </button>
          <p v-if="status === 'success'" class="contact-form__status contact-form__status--success">
            Message envoyé avec succès.
          </p>
          <p v-if="status === 'error'" class="contact-form__status contact-form__status--error">
            {{ errorMsg || 'Une erreur est survenue, réessayez.' }}
          </p>
        </div>
      </form>

    </section>

  </div>
</template>
