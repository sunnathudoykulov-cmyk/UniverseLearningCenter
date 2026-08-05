<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { faqItems } from '../data/content'
const { t } = useI18n()
const active = ref<string | null>('age')
function toggle(id: string) { active.value = active.value === id ? null : id }
</script>

<template>
  <div class="faq-list">
    <article v-for="(item, index) in faqItems" :key="item" class="faq-item" :class="{ open: active === item }">
      <h3><button :aria-expanded="active === item" :aria-controls="`faq-${item}`" @click="toggle(item)"><span class="faq-number">{{ String(index + 1).padStart(2, '0') }}</span><span>{{ t(`faq.${item}.q`) }}</span><Plus /></button></h3>
      <div v-show="active === item" :id="`faq-${item}`" class="faq-answer"><p>{{ t(`faq.${item}.a`) }}</p></div>
    </article>
  </div>
</template>
