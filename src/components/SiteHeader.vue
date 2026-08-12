<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Menu, Phone, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import BaseCta from './BaseCta.vue'
import { contact } from '../data/contact'

const { t } = useI18n()
const open = ref(false)
const closeButton = ref<HTMLButtonElement | null>(null)
const links = [
  ['nav.courses', '/courses'], ['nav.advantages', '/#advantages'],
  ['nav.process', '/#process'], ['nav.faq', '/#faq'], ['nav.contacts', '/contacts'],
]
function close() { open.value = false }
function onKeydown(event: KeyboardEvent) { if (event.key === 'Escape') close() }
watch(open, async (value) => {
  document.body.classList.toggle('menu-open', value)
  if (value) { await nextTick(); closeButton.value?.focus() }
})
window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => { window.removeEventListener('keydown', onKeydown); document.body.classList.remove('menu-open') })
</script>

<template>
  <header class="site-header">
    <div class="header-shell">
      <RouterLink to="/" class="brand-link" aria-label="Universe Learning Center" @click="close"><BrandLogo compact /></RouterLink>
      <nav class="desktop-nav" :aria-label="t('footer.navigation')">
        <RouterLink v-for="link in links" :key="link[1]" :to="link[1]">{{ t(link[0]) }}</RouterLink>
      </nav>
      <div class="header-actions">
        <LanguageSwitcher />
        <BaseCta to="/#consultation" class="header-cta">{{ t('common.enroll') }}</BaseCta>
        <button class="menu-button" :aria-label="t('nav.menu')" :aria-expanded="open" aria-controls="mobile-navigation" @click="open = true"><Menu /></button>
      </div>
    </div>
    <div v-if="open" class="menu-backdrop" @click.self="close">
      <nav id="mobile-navigation" class="mobile-menu" :aria-label="t('footer.navigation')">
        <div class="mobile-menu-top"><BrandLogo /><button ref="closeButton" :aria-label="t('nav.close')" @click="close"><X /></button></div>
        <RouterLink v-for="link in links" :key="link[1]" :to="link[1]" @click="close">{{ t(link[0]) }}</RouterLink>
        <a :href="contact.phoneHref" class="mobile-phone"><Phone :size="20" />{{ contact.phoneDisplay }}</a>
        <BaseCta to="/#consultation" block @click="close">{{ t('common.enroll') }}</BaseCta>
      </nav>
    </div>
  </header>
</template>
