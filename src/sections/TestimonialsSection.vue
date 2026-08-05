<script setup lang="ts">
import { MessageSquareQuote } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '../components/SectionHeading.vue'
import { testimonials } from '../data/content'
const { t } = useI18n()
</script>

<template><section class="section testimonials-section"><div class="container"><SectionHeading :eyebrow="t('testimonials.eyebrow')" :title="t('testimonials.title')" :text="t('testimonials.text')" /><div class="testimonial-grid"><article v-for="item in testimonials" :key="item.id"><MessageSquareQuote /><p>{{ t('testimonials.placeholder') }}</p><span>{{ t('testimonials.note') }}</span></article></div></div></section></template>
