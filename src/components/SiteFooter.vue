<script setup lang="ts">
import { MapPin, Phone, Send } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'
import { courses } from '../data/courses'
import { contact } from '../data/contact'
const { t, locale } = useI18n()
</script>

<template>
  <footer id="footer" class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand"><BrandLogo /><p>{{ t('footer.text') }}</p><span>{{ t('footer.legal') }}</span></div>
      <div><h2>{{ t('footer.navigation') }}</h2><nav><RouterLink to="/courses">{{ t('nav.courses') }}</RouterLink><RouterLink to="/#advantages">{{ t('nav.advantages') }}</RouterLink><RouterLink to="/#faq">{{ t('nav.faq') }}</RouterLink><RouterLink to="/contacts">{{ t('nav.contacts') }}</RouterLink></nav></div>
      <div><h2>{{ t('footer.directions') }}</h2><nav><RouterLink v-for="course in courses.slice(0,4)" :key="course.slug" :to="`/courses/${course.slug}`">{{ course.title }}</RouterLink></nav></div>
      <div class="footer-contact"><h2>{{ t('footer.contact') }}</h2><a :href="contact.phoneHref"><Phone />{{ contact.phoneDisplay }}</a><a :href="contact.telegramHref" target="_blank" rel="noopener"><Send />{{ contact.telegramHandle }}</a><p><MapPin />{{ locale === 'ru' ? contact.addressRu : contact.addressUz }}</p></div>
    </div>
    <div class="container footer-bottom"><span>{{ t('footer.rights') }}</span><RouterLink to="/privacy">{{ t('footer.privacy') }}</RouterLink></div>
  </footer>
</template>
