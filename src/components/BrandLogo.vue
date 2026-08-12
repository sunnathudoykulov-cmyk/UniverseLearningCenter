<script setup lang="ts">
import logo from '../assets/brand/universe-logo-white.svg'
defineProps<{ compact?: boolean }>()
</script>

<template><img :src="logo" alt="Universe Learning Center" class="brand-logo" :class="{ compact }" /></template>
