<script setup lang="ts">
import { Clock3, Compass, MapPin, Navigation, Phone, Send } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '../components/SectionHeading.vue'
import ContactItem from '../components/ContactItem.vue'
import BaseCta from '../components/BaseCta.vue'
import { contact } from '../data/contact'
const { t, locale } = useI18n()
</script>

<template>
  <section id="contacts" class="section contact-section"><div class="container"><div class="contact-shell"><SectionHeading :eyebrow="t('contacts.eyebrow')" :title="t('contacts.title')" :text="t('contacts.text')" />
    <div class="contact-grid"><ContactItem :label="t('contacts.phone')" :href="contact.phoneHref"><template #icon><Phone /></template>{{ contact.phoneDisplay }}</ContactItem><ContactItem :label="t('common.telegram')" :href="contact.telegramHref"><template #icon><Send /></template>{{ contact.telegramHandle }}</ContactItem><ContactItem :label="t('contacts.address')"><template #icon><MapPin /></template>{{ locale === 'ru' ? contact.addressRu : contact.addressUz }}</ContactItem><ContactItem :label="t('contacts.landmark')"><template #icon><Compass /></template>{{ locale === 'ru' ? contact.landmarkRu : contact.landmarkUz }}</ContactItem><ContactItem :label="t('contacts.hours')"><template #icon><Clock3 /></template>{{ contact.workingHours }}</ContactItem></div>
    <div class="map-placeholder"><div><Navigation /><p>{{ t('contacts.mapNote') }}</p></div><BaseCta :href="contact.routeHref" variant="secondary">{{ t('common.route') }}</BaseCta></div>
  </div></div></section>
</template>
