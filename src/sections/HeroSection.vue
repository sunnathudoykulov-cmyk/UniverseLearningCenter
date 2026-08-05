<script setup lang="ts">
import { ArrowDownRight, Languages, Phone, Sparkles } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import orbit from '../assets/brand/orbit-matcha.svg'
import BaseCta from '../components/BaseCta.vue'
import PhotoPlaceholder from '../components/PhotoPlaceholder.vue'
import { contact } from '../data/contact'
const { t } = useI18n()
</script>

<template>
  <section id="hero" class="hero section-top">
    <div class="container hero-shell">
      <img :src="orbit" alt="" class="hero-orbit" />
      <div class="hero-copy">
        <span class="eyebrow eyebrow-light"><Sparkles />{{ t('hero.eyebrow') }}</span>
        <h1>{{ t('hero.title') }}</h1>
        <p>{{ t('hero.text') }}</p>
        <div class="hero-actions"><BaseCta to="/#consultation">{{ t('hero.primary') }}<ArrowDownRight /></BaseCta><BaseCta to="/#courses" variant="light">{{ t('hero.secondary') }}</BaseCta></div>
        <div class="hero-contact"><a :href="contact.phoneHref"><Phone />{{ contact.phoneDisplay }}</a><span><Languages />{{ t('hero.trust2') }}</span></div>
      </div>
      <div class="hero-visual"><PhotoPlaceholder :label="t('hero.visualLabel')" :note="t('hero.photoNote')" /><div class="hero-badge"><strong>RU / UZ</strong><span>{{ t('hero.trust1') }}</span></div></div>
    </div>
  </section>
</template>
