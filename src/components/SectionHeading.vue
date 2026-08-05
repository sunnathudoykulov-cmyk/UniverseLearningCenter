<script setup lang="ts">
withDefaults(defineProps<{ eyebrow: string; title: string; text?: string; align?: 'left' | 'center'; light?: boolean }>(), { align: 'left', light: false })
</script>

<template>
  <div class="section-heading" :class="[{ centered: align === 'center', light }]">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h2>{{ title }}</h2>
    <p v-if="text">{{ text }}</p>
  </div>
</template>
