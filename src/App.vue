<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import MobileStickyBar from './components/MobileStickyBar.vue'
import { courses } from './data/courses'

const { t, locale } = useI18n()
const route = useRoute()

watch([() => route.fullPath, locale], () => {
  const titleKey = String(route.meta.title || 'seo.homeTitle')
  const descriptionKey = String(route.meta.description || 'seo.homeDescription')
  const selectedCourse = route.name === 'course' ? courses.find((item) => item.slug === route.params.slug) : undefined
  const pageTitle = selectedCourse ? `${t(selectedCourse.titleKey)} — Universe Learning Center` : t(titleKey)
  const pageDescription = selectedCourse ? t(selectedCourse.resultKey) : t(descriptionKey)
  document.documentElement.lang = locale.value
  document.title = pageTitle
  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.append(description) }
  description.content = pageDescription
  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (robots) robots.content = route.name === 'not-found' ? 'noindex, follow' : 'index, follow'
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
  canonical.href = `https://www.universesamcenter.uz${route.path}`
  const socialMeta: Record<string, string> = {
    'og:title': pageTitle,
    'og:description': pageDescription,
    'og:url': canonical.href,
    'og:locale': locale.value === 'ru' ? 'ru_RU' : 'uz_UZ',
  }
  Object.entries(socialMeta).forEach(([property, content]) => {
    let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('property', property); document.head.append(meta) }
    meta.content = content
  })
  const namedMeta: Record<string, string> = { 'twitter:title': pageTitle, 'twitter:description': pageDescription }
  Object.entries(namedMeta).forEach(([name, content]) => {
    let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
    if (!meta) { meta = document.createElement('meta'); meta.name = name; document.head.append(meta) }
    meta.content = content
  })
  const payload = {
    '@context': 'https://schema.org', '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': 'https://www.universesamcenter.uz/#organization',
    name: 'Universe Learning Center', url: 'https://www.universesamcenter.uz/', telephone: '+998950376232',
    sameAs: ['https://t.me/UniverseLearningCenterBot'],
    address: { '@type': 'PostalAddress', streetAddress: locale.value === 'ru' ? 'Уста Умаркула Журакулова, 133, 2–3 этажи' : 'Usta Umarqul Jo‘raqulov ko‘chasi, 133, 2–3-qavat', addressLocality: 'Samarkand', addressCountry: 'UZ' },
  }
  let schema = document.querySelector<HTMLScriptElement>('#organization-schema')
  if (!schema) { schema = document.createElement('script'); schema.id = 'organization-schema'; schema.type = 'application/ld+json'; document.head.append(schema) }
  schema.textContent = JSON.stringify(payload)
}, { immediate: true })
</script>

<template>
  <a href="#main" class="skip-link">{{ t('common.skipToContent') }}</a>
  <SiteHeader />
  <main id="main"><RouterView /></main>
  <SiteFooter />
  <MobileStickyBar />
</template>
