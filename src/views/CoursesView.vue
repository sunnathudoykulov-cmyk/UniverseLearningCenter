<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CourseCard from '../components/CourseCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import BaseCta from '../components/BaseCta.vue'
import { courses } from '../data/courses'
const { t } = useI18n()
</script>

<template><section class="page-hero"><div class="container"><span class="eyebrow">{{ t('coursePicker.eyebrow') }}</span><h1>{{ t('courses.pageTitle') }}</h1><p>{{ t('courses.pageText') }}</p></div></section><section class="section page-courses"><div class="container"><div class="course-grid"><CourseCard v-for="course in courses" :key="course.slug" :course="course" /></div><div class="course-help"><SectionHeading :eyebrow="t('courses.helpEyebrow')" :title="t('courses.helpTitle')" :text="t('courses.helpText')" /><BaseCta to="/#consultation">{{ t('common.consultation') }}</BaseCta></div></div></section></template>
