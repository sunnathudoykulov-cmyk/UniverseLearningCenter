import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { buildEnrollmentUrl, detectLanguage, handleUpdate, parseLeadStart } from './telegram-webhook'

describe('Telegram webhook', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.TELEGRAM_BOT_TOKEN
    delete process.env.TELEGRAM_WEBHOOK_SECRET
    delete process.env.OPENAI_API_KEY
    delete process.env.OPENAI_MODEL
    delete process.env.BOT_CONTENT_URL
  })

  it('builds a prefilled enrollment URL', () => {
    expect(buildEnrollmentUrl('general-english', 'uz')).toContain('course=general-english&lang=uz&ref=telegram-bot')
  })

  it('parses a website lead deep link without exposing personal data', () => {
    expect(parseLeadStart('/start lead_general-english_uz')).toMatchObject({
      course: { slug: 'general-english' },
      language: 'uz',
    })
    expect(parseLeadStart('/start lead_unknown_ru')).toBeNull()
  })

  it('detects Russian and Uzbek messages', () => {
    expect(detectLanguage('Сколько стоит курс?')).toBe('ru')
    expect(detectLanguage('Kurs narxi qancha?')).toBe('uz')
    expect(detectLanguage('Hello', 'ru-RU')).toBe('ru')
  })

  it('shows the language selector for a new message', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    const telegramFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', telegramFetch)

    await handleUpdate({ message: { chat: { id: 123 }, text: '/start' } })

    const body = JSON.parse(telegramFetch.mock.calls[0][1].body)
    expect(body.chat_id).toBe(123)
    expect(body.reply_markup.inline_keyboard[0][1].callback_data).toBe('lang:uz')
  })

  it('welcomes a website lead in the selected language and course', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    const telegramFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', telegramFetch)

    await handleUpdate({ message: { chat: { id: 456 }, text: '/start lead_russian_ru' } })

    const body = JSON.parse(telegramFetch.mock.calls[0][1].body)
    expect(body.chat_id).toBe(456)
    expect(body.text).toContain('Мы получили вашу заявку с сайта')
    expect(body.text).toContain('Русский язык')
    expect(body.reply_markup.inline_keyboard[0][0].callback_data).toBe('courses:ru')
  })

  it('uses the AI assistant for a free-form question and sends a plain Telegram message', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    process.env.OPENAI_API_KEY = 'test-openai-key'
    const requestFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === 'https://api.openai.com/v1/responses') {
        return {
          ok: true,
          json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Цена уточняется у администратора.' }] }] }),
        }
      }
      return { ok: true, json: async () => ({ ok: true }) }
    })
    vi.stubGlobal('fetch', requestFetch)

    await handleUpdate({ message: { chat: { id: 789 }, text: 'Сколько стоит IELTS?' } })

    const openAICall = requestFetch.mock.calls.find(([url]) => url === 'https://api.openai.com/v1/responses')
    expect(openAICall?.[1].headers.Authorization).toBe('Bearer test-openai-key')
    const telegramCall = requestFetch.mock.calls.find(([url]) => String(url).includes('api.telegram.org'))
    const body = JSON.parse(telegramCall?.[1].body)
    expect(body.text).toContain('Цена уточняется')
    expect(body.parse_mode).toBeUndefined()
  })

  it('falls back safely when the AI key is not configured', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    const telegramFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', telegramFetch)

    await handleUpdate({ message: { chat: { id: 790 }, text: 'Есть вечерняя группа?' } })

    const body = JSON.parse(telegramFetch.mock.calls[0][1].body)
    expect(body.text).toContain('Позвоните администратору')
  })

  it('rejects webhook requests without Telegram secret', async () => {
    process.env.TELEGRAM_WEBHOOK_SECRET = 'expected-secret'
    const output: { statusCode?: number; body?: string; headers: Record<string, string> } = { headers: {} }
    const request = { method: 'POST', headers: {}, body: {}, socket: {} } as unknown as Parameters<typeof handler>[0]
    const response = {
      set statusCode(value: number) { output.statusCode = value },
      setHeader(key: string, value: string) { output.headers[key] = value },
      end(body: string) { output.body = body },
    } as unknown as Parameters<typeof handler>[1]

    await handler(request, response)

    expect(output.statusCode).toBe(401)
    expect(JSON.parse(output.body || '{}')).toEqual({ ok: false, error: 'unauthorized' })
  })
})
