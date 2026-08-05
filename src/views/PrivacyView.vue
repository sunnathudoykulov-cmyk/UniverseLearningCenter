<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, tm } = useI18n()
const items = computed(() => tm('privacy.items') as unknown as string[])
</script>
<template><section class="legal-page"><div class="container legal-content"><span class="eyebrow">Universe Learning Center</span><h1>{{ t('privacy.title') }}</h1><p>{{ t('privacy.intro') }}</p><ol><li v-for="(item,index) in items" :key="index">{{ item }}</li></ol><RouterLink to="/" class="btn btn-secondary">{{ t('common.home') }}</RouterLink></div></section></template>
