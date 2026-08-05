<script setup lang="ts">
import logo from '../assets/brand/universe-logo-white.svg'
defineProps<{ compact?: boolean }>()
</script>

<template><img :src="logo" alt="Universe Learning Center" :class="compact ? 'h-9 w-auto' : 'h-12 w-auto'" /></template>
