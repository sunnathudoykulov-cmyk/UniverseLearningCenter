import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CoursesView from './views/CoursesView.vue'
import CourseView from './views/CourseView.vue'
import ContactsView from './views/ContactsView.vue'
import PrivacyView from './views/PrivacyView.vue'
import NotFoundView from './views/NotFoundView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 100, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'seo.homeTitle', description: 'seo.homeDescription' } },
    { path: '/courses', name: 'courses', component: CoursesView, meta: { title: 'seo.coursesTitle', description: 'seo.coursesDescription' } },
    { path: '/courses/:slug', name: 'course', component: CourseView, meta: { title: 'seo.courseTitle', description: 'seo.courseDescription' } },
    { path: '/contacts', name: 'contacts', component: ContactsView, meta: { title: 'seo.contactsTitle', description: 'seo.contactsDescription' } },
    { path: '/privacy', name: 'privacy', component: PrivacyView, meta: { title: 'seo.privacyTitle', description: 'seo.privacyDescription' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'seo.notFoundTitle', description: 'seo.notFoundDescription' } },
  ],
})
