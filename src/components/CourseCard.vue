<script setup lang="ts">
import { ArrowUpRight, Award, BookOpen, Braces, Building2, Languages, MessageCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Course } from '../data/courses'
defineProps<{ course: Course }>()
const { t } = useI18n()
const icons = { message: MessageCircle, award: Award, book: BookOpen, landmark: Building2, languages: Languages, code: Braces }
</script>

<template>
  <article class="course-card" :class="`course-${course.accent}`">
    <div class="course-top"><span class="course-icon"><component :is="icons[course.icon]" /></span><span class="course-arrow"><ArrowUpRight /></span></div>
    <div><h3>{{ t(course.titleKey) }}</h3><p class="course-audience">{{ t(course.audienceKey) }}</p><p>{{ t(course.resultKey) }}</p></div>
    <div class="course-actions"><RouterLink :to="`/courses/${course.slug}`">{{ t('common.details') }}<ArrowUpRight /></RouterLink><RouterLink to="/#consultation" class="text-link">{{ t('common.consultation') }}</RouterLink></div>
  </article>
</template>
