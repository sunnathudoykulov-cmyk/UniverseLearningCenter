<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CourseCard from '../components/CourseCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { courses } from '../data/courses'
const { t } = useI18n()
</script>

<template><section class="page-hero"><div class="container"><span class="eyebrow">{{ t('coursePicker.eyebrow') }}</span><h1>{{ t('courses.pageTitle') }}</h1><p>{{ t('courses.pageText') }}</p></div></section><section class="section page-courses"><div class="container"><div class="course-grid"><CourseCard v-for="course in courses" :key="course.slug" :course="course" /></div><SectionHeading class="course-page-note" :eyebrow="t('common.placeholder')" :title="t('courses.unknownFacts')" /></div></section></template>
