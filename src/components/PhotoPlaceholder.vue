<script setup lang="ts">
import { Image, Sparkles } from 'lucide-vue-next'
defineProps<{ label: string; note?: string; compact?: boolean }>()
</script>

<template>
  <div class="photo-placeholder" :class="{ compact }" role="img" :aria-label="label">
    <div class="window-grid" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="desk" aria-hidden="true"><i></i><i></i></div>
    <div class="plant" aria-hidden="true"><b></b><b></b><b></b></div>
    <div class="photo-label"><Image :size="18" /><span>{{ note || label }}</span><Sparkles :size="16" /></div>
  </div>
</template>
