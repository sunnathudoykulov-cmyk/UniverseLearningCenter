<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FaqAccordion from '../components/FaqAccordion.vue'
import SectionHeading from '../components/SectionHeading.vue'
const { t } = useI18n()
</script>

<template><section id="faq" class="section faq-section"><div class="container faq-layout"><SectionHeading :eyebrow="t('faq.eyebrow')" :title="t('faq.title')" :text="t('faq.text')" /><FaqAccordion /></div></section></template>
