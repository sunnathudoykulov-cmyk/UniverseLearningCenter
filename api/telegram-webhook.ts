import type { IncomingMessage, ServerResponse } from 'node:http'
import { assistantFallback, generateAssistantReply } from './ai-assistant'
import { defaultBotContent, getBotContent, type BotCourse, type BotLanguage } from './bot-content'

const SITE_URL = 'https://www.universesamcenter.uz'
const PHONE = '+998 95 037 62 32'
const ADDRESS = {
  ru: 'Самарканд, ул. Уста Умаркула Журакулова, 133, 2–3 этажи, напротив Янги Базара.',
  uz: 'Samarqand, Usta Umarqul Jo‘raqulov ko‘chasi, 133, 2–3-qavat, Yangi bozor ro‘parasida.',
}

type Language = BotLanguage
type TelegramButton = { text: string; callback_data?: string; url?: string }
type TelegramUpdate = {
  message?: {
    chat: { id: number }
    text?: string
    from?: { first_name?: string; last_name?: string; username?: string; language_code?: string }
  }
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } } }
}
type RequestWithBody = IncomingMessage & { body?: unknown }

const courses = defaultBotContent.courses

function courseTitle(course: BotCourse, language: Language) {
  return language === 'ru' ? course.titleRu : course.titleUz
}

function courseFacts(course: BotCourse, language: Language) {
  const facts = language === 'ru'
    ? [
        course.price && `Стоимость: ${course.price}`,
        course.schedule && `Расписание: ${course.schedule}`,
        course.groups && `Группы: ${course.groups}`,
        course.freeSeats && `Свободные места: ${course.freeSeats}`,
      ]
    : [
        course.price && `Narxi: ${course.price}`,
        course.schedule && `Jadval: ${course.schedule}`,
        course.groups && `Guruhlar: ${course.groups}`,
        course.freeSeats && `Bo‘sh joylar: ${course.freeSeats}`,
      ]
  const availableFacts = facts.filter(Boolean)
  return availableFacts.length
    ? availableFacts.join('\n')
    : language === 'ru'
      ? 'Актуальные группы, расписание, стоимость и свободные места подтвердит администратор.'
      : 'Amaldagi guruhlar, jadval, narx va bo‘sh joylarni administrator tasdiqlaydi.'
}

function sendJson(response: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

async function readJson(request: RequestWithBody) {
  if (request.body !== undefined) return request.body
  let rawBody = ''
  for await (const chunk of request) rawBody += chunk.toString()
  return JSON.parse(rawBody)
}

function languageKeyboard(): TelegramButton[][] {
  return [[
    { text: 'Русский 🇷🇺', callback_data: 'lang:ru' },
    { text: 'O‘zbekcha 🇺🇿', callback_data: 'lang:uz' },
  ]]
}

function mainKeyboard(language: Language): TelegramButton[][] {
  return [
    [{ text: language === 'ru' ? '🎓 Записаться на пробный урок' : '🎓 Sinov darsiga yozilish', callback_data: `trial:${language}` }],
    [{ text: language === 'ru' ? '📚 Наши курсы' : '📚 Kurslarimiz', callback_data: `courses:${language}` }],
    [{ text: language === 'ru' ? '📍 Адрес и контакты' : '📍 Manzil va aloqa', callback_data: `contacts:${language}` }],
    [{ text: language === 'ru' ? '🌐 Открыть сайт' : '🌐 Saytni ochish', url: SITE_URL }],
  ]
}

function courseKeyboard(language: Language, availableCourses = courses): TelegramButton[][] {
  return [
    ...availableCourses.map((course) => [{ text: courseTitle(course, language), callback_data: `course:${course.slug}:${language}` }]),
    [{ text: language === 'ru' ? '← Главное меню' : '← Asosiy menyu', callback_data: `menu:${language}` }],
  ]
}

function leadFollowUpKeyboard(language: Language): TelegramButton[][] {
  return [
    [{ text: language === 'ru' ? '📚 Посмотреть другие курсы' : '📚 Boshqa kurslarni ko‘rish', callback_data: `courses:${language}` }],
    [{ text: language === 'ru' ? '📍 Адрес и контакты' : '📍 Manzil va aloqa', callback_data: `contacts:${language}` }],
    [{ text: language === 'ru' ? '🌐 Открыть сайт' : '🌐 Saytni ochish', url: SITE_URL }],
  ]
}

export function parseLeadStart(text = '') {
  const match = text.match(/^\/start(?:@\w+)?\s+lead_([a-z0-9-]+)_(ru|uz)$/i)
  if (!match) return null
  const course = courses.find((item) => item.slug === match[1].toLowerCase())
  if (!course) return null
  return { course, language: match[2].toLowerCase() as Language }
}

export function detectLanguage(text: string, telegramLanguage?: string): Language {
  if (/[а-яё]/i.test(text)) return 'ru'
  if (/\b(ru|russian|русский)\b/i.test(text)) return 'ru'
  if (/\b(uz|uzbek|o['‘’]?zbek)\b/i.test(text)) return 'uz'
  return telegramLanguage?.toLowerCase().startsWith('ru') ? 'ru' : 'uz'
}

export function buildEnrollmentUrl(course: string, language: Language) {
  const query = new URLSearchParams({ course, lang: language, ref: 'telegram-bot' })
  return `${SITE_URL}/?${query.toString()}#consultation`
}

async function telegramRequest(method: string, body: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('telegram_not_configured')

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  })
  const result = await response.json() as { ok?: boolean }
  if (!response.ok || !result.ok) throw new Error('telegram_request_failed')
}

function sendMessage(chatId: number, text: string, keyboard?: TelegramButton[][], useHtml = true) {
  return telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
    ...(useHtml ? { parse_mode: 'HTML' } : {}),
    disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
  })
}

async function handleCallback(update: NonNullable<TelegramUpdate['callback_query']>) {
  const chatId = update.message?.chat.id
  if (!chatId) return

  await telegramRequest('answerCallbackQuery', { callback_query_id: update.id })
  const [action, value, rawLanguage] = (update.data || '').split(':')
  const language: Language = rawLanguage === 'uz' || value === 'uz' ? 'uz' : 'ru'

  if (action === 'lang' || action === 'menu') {
    const text = language === 'ru'
      ? '<b>Universe Learning Center</b>\nВыберите нужный раздел или напишите свой вопрос:'
      : '<b>Universe Learning Center</b>\nKerakli bo‘limni tanlang yoki savolingizni yozing:'
    await sendMessage(chatId, text, mainKeyboard(language))
    return
  }

  if (action === 'trial' || action === 'courses') {
    const content = await getBotContent()
    const text = language === 'ru' ? 'Выберите направление:' : 'Yo‘nalishni tanlang:'
    await sendMessage(chatId, text, courseKeyboard(language, content.courses))
    return
  }

  if (action === 'contacts') {
    const text = language === 'ru'
      ? `<b>Universe Learning Center</b>\n📍 ${ADDRESS.ru}\n☎️ ${PHONE}`
      : `<b>Universe Learning Center</b>\n📍 ${ADDRESS.uz}\n☎️ ${PHONE}`
    await sendMessage(chatId, text, [
      [{ text: language === 'ru' ? '🌐 Открыть сайт' : '🌐 Saytni ochish', url: SITE_URL }],
      [{ text: language === 'ru' ? '← Главное меню' : '← Asosiy menyu', callback_data: `menu:${language}` }],
    ])
    return
  }

  if (action === 'course') {
    const content = await getBotContent()
    const course = content.courses.find((item) => item.slug === value)
    if (!course) return
    const text = language === 'ru'
      ? `<b>${course.titleRu}</b>\n${course.descriptionRu}\n\n${courseFacts(course, language)}`
      : `<b>${course.titleUz}</b>\n${course.descriptionUz}\n\n${courseFacts(course, language)}`
    await sendMessage(chatId, text, [
      [{ text: language === 'ru' ? 'Заполнить заявку' : 'Arizani to‘ldirish', url: buildEnrollmentUrl(course.slug, language) }],
      [{ text: language === 'ru' ? '← Выбрать другой курс' : '← Boshqa kursni tanlash', callback_data: `courses:${language}` }],
    ])
  }
}

export async function handleUpdate(update: TelegramUpdate) {
  if (update.callback_query) {
    await handleCallback(update.callback_query)
    return
  }

  const chatId = update.message?.chat.id
  if (!chatId) return
  const messageText = update.message?.text?.trim() || ''
  const leadStart = parseLeadStart(messageText)
  if (leadStart) {
    const { course, language } = leadStart
    const text = language === 'ru'
      ? `<b>Здравствуйте! Это Universe Learning Center.</b>\n\nМы получили вашу заявку с сайта. Вы выбрали курс <b>${course.titleRu}</b>.\n${course.descriptionRu}\n\nАктуальную группу, время занятий и свободные места подтвердит администратор, когда свяжется с вами.`
      : `<b>Assalomu alaykum! Bu Universe Learning Center.</b>\n\nSaytdagi arizangizni oldik. Siz <b>${course.titleUz}</b> kursini tanladingiz.\n${course.descriptionUz}\n\nAdministrator siz bilan bog‘langanda amaldagi guruh, dars vaqti va bo‘sh joylarni tasdiqlaydi.`
    await sendMessage(chatId, text, leadFollowUpKeyboard(language))
    return
  }

  if (!messageText || /^\/(start|menu)(?:@\w+)?$/i.test(messageText)) {
    await sendMessage(chatId, '<b>Universe Learning Center</b>\nTilni tanlang / Выберите язык:', languageKeyboard())
    return
  }

  const language = detectLanguage(messageText, update.message?.from?.language_code)
  const content = await getBotContent()
  let reply: string
  try {
    reply = await generateAssistantReply(messageText, language, content)
  } catch {
    reply = assistantFallback(language)
  }
  await sendMessage(chatId, reply, mainKeyboard(language), false)
}

export default async function handler(request: RequestWithBody, response: ServerResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { ok: false, error: 'method_not_allowed' })
    return
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  const providedSecret = request.headers['x-telegram-bot-api-secret-token']
  if (!secret || providedSecret !== secret) {
    sendJson(response, 401, { ok: false, error: 'unauthorized' })
    return
  }

  try {
    await handleUpdate(await readJson(request) as TelegramUpdate)
    sendJson(response, 200, { ok: true })
  } catch {
    sendJson(response, 503, { ok: false, error: 'delivery_unavailable' })
  }
}
