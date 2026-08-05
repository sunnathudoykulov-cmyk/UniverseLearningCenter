<script setup lang="ts">
import { UserRound } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
defineProps<{ index: number }>()
const { t } = useI18n()
</script>

<template>
  <article class="teacher-card">
    <div class="teacher-photo"><div class="teacher-silhouette"><UserRound /></div><span>{{ t('teachers.photo') }}</span></div>
    <div class="teacher-body"><span class="approval-dot">{{ String(index).padStart(2, '0') }}</span><h3>{{ t('teachers.cardTitle') }}</h3><p>{{ t('teachers.cardText') }}</p><button disabled>{{ t('teachers.pending') }}</button></div>
  </article>
</template>
