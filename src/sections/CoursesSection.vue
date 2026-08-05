<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import CourseCard from '../components/CourseCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { courses, type Audience } from '../data/courses'
const { t } = useI18n()
const selected = ref<'all' | Audience>('all')
const filters: Array<'all' | Audience> = ['all', 'children', 'teens', 'adults', 'exams']
const visible = computed(() => selected.value === 'all' ? courses : courses.filter((course) => course.audience.includes(selected.value as Audience)))
</script>

<template>
  <section id="courses" class="section course-section">
    <div class="container">
      <div class="section-intro-row"><SectionHeading :eyebrow="t('coursePicker.eyebrow')" :title="t('coursePicker.title')" :text="t('coursePicker.text')" /><RouterLink to="/courses" class="round-link" :aria-label="t('nav.courses')"><ArrowRight /></RouterLink></div>
      <div class="course-filters" role="group" :aria-label="t('coursePicker.title')"><button v-for="filter in filters" :key="filter" :class="{ active: selected === filter }" :aria-pressed="selected === filter" @click="selected = filter">{{ t(`coursePicker.${filter}`) }}</button></div>
      <TransitionGroup name="course-list" tag="div" class="course-grid"><CourseCard v-for="course in visible" :key="course.slug" :course="course" /></TransitionGroup>
      <p v-if="!visible.length" class="empty-state">{{ t('coursePicker.empty') }}</p>
    </div>
  </section>
</template>
