export type Audience = 'children' | 'teens' | 'adults' | 'exams'

export interface Course {
  slug: string
  titleKey: string
  audience: Audience[]
  icon: 'message' | 'award' | 'book' | 'landmark' | 'languages' | 'code'
  resultKey: string
  audienceKey: string
  accent: 'cream' | 'green' | 'wood'
}

export const courses: Course[] = [
  { slug: 'general-english', titleKey: 'courses.items.english.title', audience: ['children', 'teens', 'adults'], icon: 'message', resultKey: 'courses.items.english.result', audienceKey: 'courses.items.english.audience', accent: 'cream' },
  { slug: 'ielts-cefr', titleKey: 'courses.items.ielts.title', audience: ['teens', 'adults', 'exams'], icon: 'award', resultKey: 'courses.items.ielts.result', audienceKey: 'courses.items.ielts.audience', accent: 'green' },
  { slug: 'russian', titleKey: 'courses.items.russian.title', audience: ['children', 'teens', 'adults'], icon: 'book', resultKey: 'courses.items.russian.result', audienceKey: 'courses.items.russian.audience', accent: 'wood' },
  { slug: 'trki-milliy', titleKey: 'courses.items.trki.title', audience: ['teens', 'adults', 'exams'], icon: 'landmark', resultKey: 'courses.items.trki.result', audienceKey: 'courses.items.trki.audience', accent: 'cream' },
  { slug: 'arabic', titleKey: 'courses.items.arabic.title', audience: ['children', 'teens', 'adults'], icon: 'languages', resultKey: 'courses.items.arabic.result', audienceKey: 'courses.items.arabic.audience', accent: 'green' },
  { slug: 'scratch', titleKey: 'courses.items.scratch.title', audience: ['children'], icon: 'code', resultKey: 'courses.items.scratch.result', audienceKey: 'courses.items.scratch.audience', accent: 'wood' },
]
