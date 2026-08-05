<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeading from '../components/SectionHeading.vue'
import TeacherCard from '../components/TeacherCard.vue'
import { teachers } from '../data/content'
const { t } = useI18n()
</script>

<template><section id="teachers" class="section teachers-section"><div class="container"><SectionHeading :eyebrow="t('teachers.eyebrow')" :title="t('teachers.title')" :text="t('teachers.text')" /><div class="teacher-track"><TeacherCard v-for="teacher in teachers" :key="teacher.id" :index="teacher.id" /></div></div></section></template>
