export type BotLanguage = 'ru' | 'uz'

export interface BotCourse {
  slug: string
  titleRu: string
  titleUz: string
  descriptionRu: string
  descriptionUz: string
  price?: string | null
  schedule?: string | null
  groups?: string | null
  freeSeats?: string | null
}

export interface BotContent {
  courses: BotCourse[]
  updatedAt?: string
}

export const defaultBotContent: BotContent = {
  courses: [
    { slug: 'general-english', titleRu: 'General English', titleUz: 'General English', descriptionRu: 'Разговорная речь, аудирование, чтение и письмо для детей, подростков и взрослых.', descriptionUz: 'Bolalar, o‘smirlar va kattalar uchun gapirish, tinglash, o‘qish va yozish ko‘nikmalari.' },
    { slug: 'ielts-cefr', titleRu: 'IELTS / CEFR', titleUz: 'IELTS / CEFR', descriptionRu: 'Подготовка к формату IELTS и национальному экзамену CEFR.', descriptionUz: 'IELTS va milliy CEFR imtihonlari formatiga tayyorgarlik.' },
    { slug: 'russian', titleRu: 'Русский язык', titleUz: 'Rus tili', descriptionRu: 'Грамотная речь, письмо и уверенное использование русского языка.', descriptionUz: 'Savodli nutq, yozish va rus tilidan ishonchli foydalanish.' },
    { slug: 'trki-milliy', titleRu: 'ТРКИ / Национальный сертификат', titleUz: 'TRKI / Milliy sertifikat', descriptionRu: 'Системная подготовка к структуре экзамена по русскому языку.', descriptionUz: 'Rus tili imtihoni tuzilmasiga tizimli tayyorgarlik.' },
    { slug: 'arabic', titleRu: 'Арабский язык', titleUz: 'Arab tili', descriptionRu: 'Чтение, письмо, словарный запас и разговорная практика.', descriptionUz: 'O‘qish, yozish, lug‘at va so‘zlashuv amaliyoti.' },
    { slug: 'scratch', titleRu: 'Scratch для детей', titleUz: 'Bolalar uchun Scratch', descriptionRu: 'Алгоритмы и основы программирования через визуальные проекты.', descriptionUz: 'Vizual loyihalar orqali algoritmlar va dasturlash asoslari.' },
  ],
}

const CACHE_TTL_MS = 60_000
let contentCache: { expiresAt: number; value: BotContent } | undefined

function cleanOptional(value: unknown, maxLength = 240) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : null
}

function parseCourse(value: unknown): BotCourse | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const course = value as Record<string, unknown>
  const slug = cleanOptional(course.slug, 40)
  const titleRu = cleanOptional(course.titleRu, 80)
  const titleUz = cleanOptional(course.titleUz, 80)
  const descriptionRu = cleanOptional(course.descriptionRu, 400)
  const descriptionUz = cleanOptional(course.descriptionUz, 400)
  if (!slug || !titleRu || !titleUz || !descriptionRu || !descriptionUz) return null

  return {
    slug,
    titleRu,
    titleUz,
    descriptionRu,
    descriptionUz,
    price: cleanOptional(course.price),
    schedule: cleanOptional(course.schedule),
    groups: cleanOptional(course.groups),
    freeSeats: cleanOptional(course.freeSeats),
  }
}

export function parseBotContent(value: unknown): BotContent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  if (!Array.isArray(input.courses)) return null
  const courses = input.courses.map(parseCourse).filter((course): course is BotCourse => Boolean(course))
  if (!courses.length) return null
  return {
    courses: courses.slice(0, 30),
    updatedAt: cleanOptional(input.updatedAt, 80) || undefined,
  }
}

export async function getBotContent(): Promise<BotContent> {
  const sourceUrl = process.env.BOT_CONTENT_URL
  if (!sourceUrl) return defaultBotContent
  if (contentCache && contentCache.expiresAt > Date.now()) return contentCache.value

  try {
    const response = await fetch(sourceUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3_000),
    })
    if (!response.ok) return defaultBotContent
    const content = parseBotContent(await response.json())
    if (!content) return defaultBotContent
    contentCache = { value: content, expiresAt: Date.now() + CACHE_TTL_MS }
    return content
  } catch {
    return defaultBotContent
  }
}

export function resetBotContentCache() {
  contentCache = undefined
}
