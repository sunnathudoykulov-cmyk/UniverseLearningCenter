export type Audience = 'children' | 'teens' | 'adults' | 'exams'

export interface Course {
  slug: string
  title: string
  audience: Audience[]
  icon: 'message' | 'award' | 'book' | 'landmark' | 'languages' | 'code'
  resultKey: string
  audienceKey: string
  accent: 'cream' | 'green' | 'wood'
}

export const courses: Course[] = [
  { slug: 'general-english', title: 'General English', audience: ['children', 'teens', 'adults'], icon: 'message', resultKey: 'courses.items.english.result', audienceKey: 'courses.items.english.audience', accent: 'cream' },
  { slug: 'ielts-cefr', title: 'IELTS / CEFR', audience: ['teens', 'adults', 'exams'], icon: 'award', resultKey: 'courses.items.ielts.result', audienceKey: 'courses.items.ielts.audience', accent: 'green' },
  { slug: 'russian', title: 'Русский язык', audience: ['children', 'teens', 'adults'], icon: 'book', resultKey: 'courses.items.russian.result', audienceKey: 'courses.items.russian.audience', accent: 'wood' },
  { slug: 'trki-milliy', title: 'ТРКИ / Milliy sertifikat', audience: ['teens', 'adults', 'exams'], icon: 'landmark', resultKey: 'courses.items.trki.result', audienceKey: 'courses.items.trki.audience', accent: 'cream' },
  { slug: 'arabic', title: 'Арабский язык', audience: ['children', 'teens', 'adults'], icon: 'languages', resultKey: 'courses.items.arabic.result', audienceKey: 'courses.items.arabic.audience', accent: 'green' },
  { slug: 'scratch', title: 'Scratch', audience: ['children'], icon: 'code', resultKey: 'courses.items.scratch.result', audienceKey: 'courses.items.scratch.audience', accent: 'wood' },
]
