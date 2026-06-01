<script setup lang="ts">
const config = useRuntimeConfig()

type Status = 'idle' | 'loading' | 'success' | 'error'

const status = ref<Status>('idle')
const errorMessage = ref('')

const form = reactive({
  name:    '',
  email:   '',
  subject: '',
  message: '',
})

async function submit() {
  if (status.value === 'loading') return
  status.value = 'loading'
  errorMessage.value = ''

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.public.web3formsKey,
        name:       form.name,
        email:      form.email,
        subject:    form.subject,
        message:    form.message,
      }),
    })

    const data = await res.json()

    if (data.success) {
      status.value = 'success'
      form.name = form.email = form.subject = form.message = ''
    } else {
      throw new Error(data.message || 'Erreur lors de l\'envoi.')
    }
  } catch (e: unknown) {
    status.value = 'error'
    errorMessage.value = e instanceof Error ? e.message : 'Une erreur est survenue. Réessayez.'
  }
}

useHead({ title: 'Contact — 1LIFE PRODUCTION' })
</script>

<template>
  <div class="contact-page grid-bg">
    <!-- Hero -->
    <div class="contact-hero">
      <div class="container">
        <h1 class="contact-hero__title">GET<br>IN TOUCH</h1>
      </div>
    </div>

    <!-- Layout -->
    <div class="contact-layout">
      <!-- Info -->
      <div class="contact-info">
        <div class="contact-info__item">
          <span class="contact-info__label">Instagram</span>
          <a href="https://instagram.com/1lifeproduction" target="_blank" rel="noopener"
             class="contact-info__value">@1lifeproduction</a>
        </div>
        <div class="contact-info__item">
          <span class="contact-info__label">LinkedIn</span>
          <a href="https://linkedin.com" target="_blank" rel="noopener"
             class="contact-info__value">@1Life Production</a>
        </div>
        <div class="contact-info__item">
          <span class="contact-info__label">Mail</span>
          <a href="mailto:1lifeprod@unlockcollectif.com"
             class="contact-info__value">1lifeprod@unlockcollectif.com</a>
        </div>
        <div class="contact-info__item">
          <span class="contact-info__label">Lieu</span>
          <span class="contact-info__value">Paris, France</span>
        </div>
      </div>

      <!-- Form -->
      <div class="contact-form-wrap">
        <form class="contact-form" @submit.prevent="submit" novalidate>
          <div class="form-field">
            <label for="name">Nom</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Votre nom"
              required
              :disabled="status === 'loading'"
            />
          </div>
          <div class="form-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="votre@email.com"
              required
              :disabled="status === 'loading'"
            />
          </div>
          <div class="form-field">
            <label for="subject">Sujet</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="Objet de votre message"
              required
              :disabled="status === 'loading'"
            />
          </div>
          <div class="form-field">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              placeholder="Décrivez votre projet..."
              required
              :disabled="status === 'loading'"
            ></textarea>
          </div>

          <div
            v-if="status === 'success'"
            class="form-status form-status--success"
            role="status"
          >
            Message envoyé ! Nous vous répondons sous 48h.
          </div>
          <div
            v-if="status === 'error'"
            class="form-status form-status--error"
            role="alert"
          >
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="status === 'loading'"
          >
            {{ status === 'loading' ? 'Envoi...' : 'Envoyer' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
