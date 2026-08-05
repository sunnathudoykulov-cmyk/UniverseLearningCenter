<script setup lang="ts">
import { AlertCircle, ArrowUpRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionHeading from '../components/SectionHeading.vue'
import { advantages } from '../data/content'
const { t } = useI18n()
</script>

<template>
  <section id="advantages" class="section advantages-section"><div class="container"><SectionHeading :eyebrow="t('advantages.eyebrow')" :title="t('advantages.title')" :text="t('advantages.text')" />
    <div class="bento-grid"><article v-for="item in advantages" :key="item.number" class="advantage-card" :class="`bento-${item.size}`"><div class="advantage-top"><span>{{ item.number }}</span><ArrowUpRight /></div><h3>{{ t(item.titleKey) }}</h3><p>{{ t(item.textKey) }}</p><small v-if="item.requiresApproval"><AlertCircle />{{ t('advantages.approval') }}</small></article></div>
  </div></section>
</template>
