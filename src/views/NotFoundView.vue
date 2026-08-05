<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template><section class="not-found"><div class="container"><span>{{ t('notFound.code') }}</span><h1>{{ t('notFound.title') }}</h1><p>{{ t('notFound.text') }}</p><RouterLink to="/" class="btn btn-primary">{{ t('common.home') }}</RouterLink></div></section></template>
