<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LeadForm from '../components/LeadForm.vue'
import SectionHeading from '../components/SectionHeading.vue'
const { t } = useI18n()
</script>

<template><section id="consultation" class="section consultation-section"><div class="container consultation-shell"><div class="consultation-copy"><SectionHeading :eyebrow="t('form.eyebrow')" :title="t('form.title')" :text="t('form.text')" light /><div class="consultation-orbit" aria-hidden="true"><i></i><b></b></div></div><LeadForm /></div></section></template>
