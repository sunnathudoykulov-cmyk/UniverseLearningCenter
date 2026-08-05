<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeading from '../components/SectionHeading.vue'
import PhotoPlaceholder from '../components/PhotoPlaceholder.vue'
import { steps } from '../data/content'
const { t } = useI18n()
</script>

<template>
  <section id="process" class="section process-section"><div class="container process-layout"><div class="process-copy"><SectionHeading :eyebrow="t('steps.eyebrow')" :title="t('steps.title')" :text="t('steps.text')" light /><ol><li v-for="(step,index) in steps" :key="step"><span>{{ String(index+1).padStart(2,'0') }}</span><strong>{{ t(step) }}</strong></li></ol></div><PhotoPlaceholder :label="t('media.learningAlt')" :note="t('hero.photoNote')" compact /></div></section>
</template>
