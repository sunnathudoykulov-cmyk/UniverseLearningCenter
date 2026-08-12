<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Phone, Send } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { contact } from '../data/contact'
const { t } = useI18n()
const visible = ref(false)
function update() {
  const footer = document.querySelector('#footer')?.getBoundingClientRect()
  const form = document.querySelector('#consultation')?.getBoundingClientRect()
  const blocked = [footer, form].some((box) => box && box.top < window.innerHeight && box.bottom > 0)
  visible.value = window.scrollY > Math.min(620, window.innerHeight * .72) && !blocked
}
onMounted(() => { update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update) })
onBeforeUnmount(() => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) })
</script>

<template>
  <Transition name="sticky"><div v-if="visible" class="mobile-sticky" :aria-label="t('mobileBar.label')"><a :href="contact.phoneHref"><Phone />{{ t('mobileBar.call') }}</a><RouterLink to="/#consultation"><Send />{{ t('mobileBar.enroll') }}</RouterLink></div></Transition>
</template>
