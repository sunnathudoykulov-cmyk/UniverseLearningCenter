import type { IncomingMessage, ServerResponse } from 'node:http'

const MAX_BODY_BYTES = 8_192
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000
const RATE_LIMIT_MAX_REQUESTS = 5

const courseNames: Record<string, string> = {
  'general-english': 'General English',
  'ielts-cefr': 'IELTS / CEFR',
  russian: 'Русский язык',
  'trki-milliy': 'ТРКИ / Milliy sertifikat',
  arabic: 'Арабский язык',
  scratch: 'Scratch',
}

type LeadLanguage = 'ru' | 'uz'

export interface Lead {
  name: string
  phone: string
  direction: keyof typeof courseNames
  age: number
  language: LeadLanguage
  consent: true
  website?: string
  source?: string
}

type RequestWithBody = IncomingMessage & { body?: unknown }
type RateLimitEntry = { count: number; resetAt: number }

const rateLimits = new Map<string, RateLimitEntry>()

function sendJson(response: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizePhone(value: unknown) {
  const digits = typeof value === 'string' ? value.replace(/\D/g, '') : ''
  return digits.length === 12 && digits.startsWith('998') ? `+${digits}` : ''
}

export function parseLead(value: unknown): { lead?: Lead; errors?: string[] } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['invalid_body'] }

  const body = value as Record<string, unknown>
  const name = normalizeText(body.name, 80)
  const phone = normalizePhone(body.phone)
  const direction = normalizeText(body.direction, 40)
  const age = Number(body.age)
  const language = body.language
  const website = normalizeText(body.website, 200)
  const source = normalizeText(body.source, 300)
  const errors: string[] = []

  if (name.length < 2) errors.push('name')
  if (!phone) errors.push('phone')
  if (!Object.hasOwn(courseNames, direction)) errors.push('direction')
  if (!Number.isInteger(age) || age < 3 || age > 99) errors.push('age')
  if (language !== 'ru' && language !== 'uz') errors.push('language')
  if (body.consent !== true) errors.push('consent')

  if (errors.length) return { errors }

  return {
    lead: {
      name,
      phone,
      direction,
      age,
      language: language as LeadLanguage,
      consent: true,
      website,
      source,
    },
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character)
}

function getClientIp(request: IncomingMessage) {
  const forwardedFor = request.headers['x-forwarded-for']
  const firstForwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]
  return firstForwardedIp?.trim() || request.socket.remoteAddress || 'unknown'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const current = rateLimits.get(ip)

  if (!current || current.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > RATE_LIMIT_MAX_REQUESTS
}

function isAllowedOrigin(request: IncomingMessage) {
  const origin = request.headers.origin
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return !origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin)
}

async function readJson(request: RequestWithBody) {
  if (request.body !== undefined) return request.body

  let rawBody = ''
  for await (const chunk of request) {
    rawBody += chunk.toString()
    if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) throw new Error('body_too_large')
  }

  return JSON.parse(rawBody)
}

async function sendToTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('telegram_not_configured')

  const languageName = lead.language === 'ru' ? 'Русский' : 'O‘zbekcha'
  const source = lead.source ? `\n<b>Источник:</b> ${escapeHtml(lead.source)}` : ''
  const text = [
    '🎓 <b>Новая заявка с сайта Universe</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>`,
    `<b>Направление:</b> ${escapeHtml(courseNames[lead.direction])}`,
    `<b>Возраст ученика:</b> ${lead.age}`,
    `<b>Язык общения:</b> ${languageName}${source}`,
  ].join('\n')

  const messageThreadId = Number(process.env.TELEGRAM_THREAD_ID)
  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(Number.isInteger(messageThreadId) && messageThreadId > 0 ? { message_thread_id: messageThreadId } : {}),
    }),
    signal: AbortSignal.timeout(8_000),
  })

  const result = await telegramResponse.json() as { ok?: boolean }
  if (!telegramResponse.ok || !result.ok) throw new Error('telegram_request_failed')
}

export default async function handler(request: RequestWithBody, response: ServerResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { ok: false, error: 'method_not_allowed' })
    return
  }

  if (!isAllowedOrigin(request)) {
    sendJson(response, 403, { ok: false, error: 'origin_not_allowed' })
    return
  }

  if (isRateLimited(getClientIp(request))) {
    sendJson(response, 429, { ok: false, error: 'rate_limited' })
    return
  }

  try {
    const parsed = parseLead(await readJson(request))
    if (!parsed.lead) {
      sendJson(response, 400, { ok: false, error: 'validation_failed', fields: parsed.errors })
      return
    }

    // A filled honeypot means a bot submitted the form. Return success without notifying staff.
    if (parsed.lead.website) {
      sendJson(response, 200, { ok: true })
      return
    }

    await sendToTelegram(parsed.lead)
    sendJson(response, 200, { ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'body_too_large') {
      sendJson(response, 413, { ok: false, error: 'body_too_large' })
      return
    }
    if (error instanceof SyntaxError) {
      sendJson(response, 400, { ok: false, error: 'invalid_json' })
      return
    }

    sendJson(response, 503, { ok: false, error: 'delivery_unavailable' })
  }
}
