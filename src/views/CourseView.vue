<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ArrowLeft, CheckCircle2 } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { courses } from '../data/courses'
import { contact } from '../data/contact'
import BaseCta from '../components/BaseCta.vue'
import ConsultationSection from '../sections/ConsultationSection.vue'
const route = useRoute(); const router = useRouter(); const { t } = useI18n()
const course = computed(() => courses.find((item) => item.slug === route.params.slug))
watchEffect(() => { if (!course.value) router.replace('/not-found') })
</script>

<template><template v-if="course"><section class="course-detail-hero"><div class="container"><RouterLink to="/courses" class="back-link"><ArrowLeft />{{ t('common.back') }}</RouterLink><span class="eyebrow">{{ t('courses.audience') }} · {{ t(course.audienceKey) }}</span><h1>{{ t(course.titleKey) }}</h1><p>{{ t(course.resultKey) }}</p><div class="detail-actions"><BaseCta :to="`/?course=${course.slug}#consultation`">{{ t('courses.courseCta') }}</BaseCta><BaseCta :href="contact.phoneHref" variant="light">{{ contact.phoneDisplay }}</BaseCta></div></div></section><section class="section"><div class="container detail-grid"><article><span>01</span><h2>{{ t('courses.expected') }}</h2><p>{{ t(course.resultKey) }}</p></article><article><span>02</span><h2>{{ t('courses.audience') }}</h2><p>{{ t(course.audienceKey) }}</p></article><article><span>03</span><h2>{{ t('courses.formatTitle') }}</h2><p>{{ t('courses.unknownFacts') }}</p></article><div class="detail-note"><CheckCircle2 /><p>{{ t('form.text') }}</p></div></div></section><ConsultationSection /></template></template>
