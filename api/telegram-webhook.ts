import type { IncomingMessage, ServerResponse } from 'node:http'

const SITE_URL = 'https://www.universesamcenter.uz'
const PHONE = '+998 95 037 62 32'
const ADDRESS = {
  ru: 'Самарканд, ул. Уста Умаркула Журакулова, 133, 2–3 этажи, напротив Янги Базара.',
  uz: 'Samarqand, Usta Umarqul Jo‘raqulov ko‘chasi, 133, 2–3-qavat, Yangi bozor ro‘parasida.',
}

type Language = 'ru' | 'uz'
type TelegramButton = { text: string; callback_data?: string; url?: string }
type TelegramUpdate = {
  message?: { chat: { id: number }; text?: string }
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } } }
}
type RequestWithBody = IncomingMessage & { body?: unknown }

const courses = [
  { slug: 'general-english', ru: 'General English', uz: 'General English' },
  { slug: 'ielts-cefr', ru: 'IELTS / CEFR', uz: 'IELTS / CEFR' },
  { slug: 'russian', ru: 'Русский язык', uz: 'Rus tili' },
  { slug: 'arabic', ru: 'Арабский язык', uz: 'Arab tili' },
] as const

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

function courseKeyboard(language: Language): TelegramButton[][] {
  return [
    ...courses.map((course) => [{ text: course[language], callback_data: `course:${course.slug}:${language}` }]),
    [{ text: language === 'ru' ? '← Главное меню' : '← Asosiy menyu', callback_data: `menu:${language}` }],
  ]
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

function sendMessage(chatId: number, text: string, keyboard?: TelegramButton[][]) {
  return telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
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
      ? '<b>Universe Learning Center</b>\nВыберите нужный раздел:'
      : '<b>Universe Learning Center</b>\nKerakli bo‘limni tanlang:'
    await sendMessage(chatId, text, mainKeyboard(language))
    return
  }

  if (action === 'trial' || action === 'courses') {
    const text = language === 'ru' ? 'Выберите направление:' : 'Yo‘nalishni tanlang:'
    await sendMessage(chatId, text, courseKeyboard(language))
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
    const course = courses.find((item) => item.slug === value)
    if (!course) return
    const text = language === 'ru'
      ? `<b>${course.ru}</b>\nНажмите кнопку ниже — курс уже будет выбран в форме. После отправки администратор свяжется с вами.`
      : `<b>${course.uz}</b>\nQuyidagi tugmani bosing — kurs arizada oldindan tanlanadi. Yuborganingizdan so‘ng administrator siz bilan bog‘lanadi.`
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
  await sendMessage(
    chatId,
    '<b>Universe Learning Center</b>\nTilni tanlang / Выберите язык:',
    languageKeyboard(),
  )
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
