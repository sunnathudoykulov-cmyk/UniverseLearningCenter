<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import MobileStickyBar from './components/MobileStickyBar.vue'

const { t, locale } = useI18n()
const route = useRoute()

watch([() => route.fullPath, locale], () => {
  const titleKey = String(route.meta.title || 'seo.homeTitle')
  const descriptionKey = String(route.meta.description || 'seo.homeDescription')
  document.documentElement.lang = locale.value
  document.title = t(titleKey)
  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.append(description) }
  description.content = t(descriptionKey)
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
  canonical.href = `${window.location.origin}${route.path}`
  const payload = {
    '@context': 'https://schema.org', '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: 'Universe Learning Center', telephone: '+998950376232',
    address: { '@type': 'PostalAddress', streetAddress: locale.value === 'ru' ? 'Уста Умаркула Журакулова, 133, 2–3 этажи' : 'Usta Umarqul Jo‘raqulov ko‘chasi, 133, 2–3-qavat', addressLocality: 'Samarkand', addressCountry: 'UZ' },
  }
  let schema = document.querySelector<HTMLScriptElement>('#organization-schema')
  if (!schema) { schema = document.createElement('script'); schema.id = 'organization-schema'; schema.type = 'application/ld+json'; document.head.append(schema) }
  schema.textContent = JSON.stringify(payload)
}, { immediate: true })
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <SiteHeader />
  <main id="main"><RouterView /></main>
  <SiteFooter />
  <MobileStickyBar />
</template>
