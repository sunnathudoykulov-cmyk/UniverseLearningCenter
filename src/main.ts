import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { router } from './router'
import { ru } from './locales/ru'
import { uz } from './locales/uz'
import './styles.css'

const savedLocale = localStorage.getItem('universe-locale')
const locale = savedLocale === 'uz' ? 'uz' : 'ru'

export const i18n = createI18n({ legacy: false, locale, fallbackLocale: 'ru', messages: { ru, uz } })

createApp(App).use(router).use(i18n).mount('#app')
