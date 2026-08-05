<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ArrowRight, Phone, Send } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { courses } from '../data/courses'
import { contact } from '../data/contact'
const { t } = useI18n()
const endpoint = import.meta.env.VITE_LEAD_ENDPOINT
const loading = ref(false)
const status = ref<'idle' | 'unavailable' | 'error' | 'success'>('idle')
const form = reactive({ name: '', phone: '+998 ', direction: '', age: '', language: 'ru', consent: false })
const errors = reactive<Record<string, string>>({})
const statusText = computed(() => status.value === 'idle' ? '' : t(`form.${status.value}`))

function maskPhone(event: Event) {
  const input = event.target as HTMLInputElement
  let digits = input.value.replace(/\D/g, '')
  if (digits.startsWith('998')) digits = digits.slice(3)
  digits = digits.slice(0, 9)
  const parts = [digits.slice(0,2), digits.slice(2,5), digits.slice(5,7), digits.slice(7,9)].filter(Boolean)
  form.phone = '+998 ' + parts.map((part, i) => i === 0 ? part : i === 1 ? part : part).join(' ')
}
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.name.trim()) errors.name = t('form.required')
  if (form.phone.replace(/\D/g, '').length !== 12) errors.phone = t('form.phoneError')
  if (!form.direction) errors.direction = t('form.required')
  if (!form.age || Number(form.age) < 3 || Number(form.age) > 99) errors.age = t('form.required')
  if (!form.consent) errors.consent = t('form.consentError')
  return !Object.keys(errors).length
}
async function submit() {
  if (loading.value || !validate()) return
  if (!endpoint) { status.value = 'unavailable'; return }
  loading.value = true; status.value = 'idle'
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!response.ok) throw new Error('Request failed')
    status.value = 'success'
  } catch { status.value = 'error' } finally { loading.value = false }
}
</script>

<template>
  <form class="lead-form" novalidate @submit.prevent="submit">
    <div class="field"><label for="lead-name">{{ t('form.name') }}</label><input id="lead-name" v-model="form.name" autocomplete="name" :placeholder="t('form.namePlaceholder')" :aria-invalid="Boolean(errors.name)" /><small v-if="errors.name">{{ errors.name }}</small></div>
    <div class="field"><label for="lead-phone">{{ t('form.phone') }}</label><input id="lead-phone" v-model="form.phone" inputmode="tel" autocomplete="tel" :aria-invalid="Boolean(errors.phone)" @input="maskPhone" /><small v-if="errors.phone">{{ errors.phone }}</small></div>
    <div class="field"><label for="lead-direction">{{ t('form.direction') }}</label><select id="lead-direction" v-model="form.direction" :aria-invalid="Boolean(errors.direction)"><option value="" disabled>{{ t('form.choose') }}</option><option v-for="course in courses" :key="course.slug" :value="course.slug">{{ course.title }}</option></select><small v-if="errors.direction">{{ errors.direction }}</small></div>
    <div class="field"><label for="lead-age">{{ t('form.age') }}</label><input id="lead-age" v-model="form.age" type="number" inputmode="numeric" min="3" max="99" :aria-invalid="Boolean(errors.age)" /><small v-if="errors.age">{{ errors.age }}</small></div>
    <fieldset class="field language-field"><legend>{{ t('form.language') }}</legend><label><input v-model="form.language" type="radio" value="ru" />{{ t('form.russian') }}</label><label><input v-model="form.language" type="radio" value="uz" />{{ t('form.uzbek') }}</label></fieldset>
    <div class="field consent-field"><label><input v-model="form.consent" type="checkbox" /><span>{{ t('form.consent') }}</span></label><small v-if="errors.consent">{{ errors.consent }}</small></div>
    <button class="btn btn-primary submit-button" type="submit" :disabled="loading"><span>{{ loading ? t('form.sending') : t('form.submit') }}</span><ArrowRight /></button>
    <p v-if="statusText" class="form-status" :class="`status-${status}`" role="status">{{ statusText }}</p>
    <div class="form-alternatives"><a :href="contact.phoneHref"><Phone />{{ contact.phoneDisplay }}</a><a :href="contact.telegramHref" target="_blank" rel="noopener"><Send />{{ contact.telegramHandle }}</a></div>
  </form>
</template>
