<script setup lang="ts">
withDefaults(defineProps<{ to?: string; href?: string; variant?: 'primary' | 'secondary' | 'light'; block?: boolean }>(), { variant: 'primary', block: false })
</script>

<template>
  <RouterLink v-if="to" :to="to" class="btn" :class="[`btn-${variant}`, { 'w-full': block }]"><slot /></RouterLink>
  <a v-else-if="href" :href="href" class="btn" :class="[`btn-${variant}`, { 'w-full': block }]" target="_blank" rel="noopener"><slot /></a>
  <button v-else class="btn" :class="[`btn-${variant}`, { 'w-full': block }]" type="button"><slot /></button>
</template>
