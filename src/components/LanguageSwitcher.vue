<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
function setLocale(value: 'ru' | 'uz') { locale.value = value; localStorage.setItem('universe-locale', value) }
</script>

<template>
  <div class="language-switcher" role="group" aria-label="Language">
    <button :aria-pressed="locale === 'ru'" :class="{ active: locale === 'ru' }" @click="setLocale('ru')">RU</button>
    <button :aria-pressed="locale === 'uz'" :class="{ active: locale === 'uz' }" @click="setLocale('uz')">UZ</button>
  </div>
</template>
