import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { courses } from '../src/data/courses.ts'
import { contact } from '../src/data/contact.ts'
import { ru } from '../src/locales/ru.ts'

const origin = 'https://www.universesamcenter.uz'
const escape = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const t = (key) => key.split('.').reduce((value, segment) => value?.[segment], ru) || ''
const template = await readFile('dist/index.html', 'utf8')
const pages = [
  { path: '/', title: ru.seo.homeTitle, description: ru.seo.homeDescription, heading: 'Учебный центр Universe Learning Center в Самарканде', text: ru.hero.text },
  { path: '/courses', title: ru.seo.coursesTitle, description: ru.seo.coursesDescription, heading: 'Курсы английского и других языков в Самарканде', text: ru.coursePicker.text },
  ...courses.map(course => ({
    path: `/courses/${course.slug}`,
    title: `${t(course.titleKey)} в Самарканде — Universe Learning Center`,
    description: `${t(course.resultKey)} Занятия в Самарканде. Узнайте о расписании и стоимости на консультации.`,
    heading: `${t(course.titleKey)} в Самарканде`, text: t(course.resultKey),
  })),
  { path: '/contacts', title: ru.seo.contactsTitle, description: ru.seo.contactsDescription, heading: 'Контакты учебного центра Universe в Самарканде', text: `${contact.addressRu}. ${contact.landmarkRu}. Телефон: ${contact.phoneDisplay}.` },
  { path: '/privacy', title: ru.seo.privacyTitle, description: ru.seo.privacyDescription, heading: ru.privacy.title, text: ru.privacy.intro },
]

for (const page of pages) {
  const canonical = `${origin}${page.path}`
  const course = courses.find(item => `/courses/${item.slug}` === page.path)
  const entity = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EducationalOrganization', 'LocalBusiness'], '@id': `${origin}/#organization`,
        name: 'Universe Learning Center', url: `${origin}/`, telephone: contact.phoneHref.slice(4),
        address: { '@type': 'PostalAddress', streetAddress: contact.addressRu, addressLocality: 'Самарканд', addressCountry: 'UZ' },
        sameAs: [contact.telegramHref],
      },
      { '@type': course ? 'Course' : 'WebPage', name: page.heading, url: canonical, description: page.description,
        ...(course ? { provider: { '@id': `${origin}/#organization` } } : {}) },
    ],
  }
  const links = page.path === '/' || page.path === '/courses'
    ? `<nav aria-label="Курсы"><ul>${courses.map(item => `<li><a href="/courses/${escape(item.slug)}">${escape(t(item.titleKey))}</a> — ${escape(t(item.resultKey))}</li>`).join('')}</ul></nav>`
    : `<p><a href="/courses">Посмотреть все курсы</a></p>`
  const body = `<main><h1>${escape(page.heading)}</h1><p>${escape(page.text)}</p>${links}<p>Universe Learning Center — языковые и IT-курсы для детей, подростков и взрослых в Самарканде.</p><p><a href="${escape(contact.phoneHref)}">${escape(contact.phoneDisplay)}</a> · ${escape(contact.addressRu)} · ${escape(contact.landmarkRu)}</p></main>`
  const metadata = {
    'name:description': page.description,
    'property:og:title': page.title,
    'property:og:description': page.description,
    'property:og:url': canonical,
    'name:twitter:title': page.title,
    'name:twitter:description': page.description,
  }
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escape(canonical)}" />`)
    .replace('<div id="app"></div>', `<div id="app">${body}</div>`)
    .replace('</head>', `<script id="organization-schema" type="application/ld+json">${JSON.stringify(entity).replace(/</g, '\\u003c')}</script>\n</head>`)
  for (const [key, value] of Object.entries(metadata)) {
    const [attribute, label] = key.split(':')
    html = html.replace(new RegExp(`(<meta ${attribute}="${label}" content=")[^"]*("[^>]*>)`), (_, prefix, suffix) => prefix + escape(value) + suffix)
  }
  const output = page.path === '/' ? 'dist/index.html' : join('dist', `${page.path.slice(1)}.html`)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, html)
}

await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${origin}${page.path}</loc></url>`).join('\n')}\n</urlset>\n`)
