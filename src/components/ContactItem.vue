<script setup lang="ts">
defineProps<{ label: string; href?: string }>()
</script>

<template>
  <a v-if="href" :href="href" class="contact-item"><span class="contact-icon"><slot name="icon" /></span><span><small>{{ label }}</small><strong><slot /></strong></span></a>
  <div v-else class="contact-item"><span class="contact-icon"><slot name="icon" /></span><span><small>{{ label }}</small><strong><slot /></strong></span></div>
</template>
