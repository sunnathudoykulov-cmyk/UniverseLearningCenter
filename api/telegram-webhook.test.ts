import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { buildEnrollmentUrl, handleUpdate } from './telegram-webhook'

describe('Telegram webhook', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.TELEGRAM_BOT_TOKEN
    delete process.env.TELEGRAM_WEBHOOK_SECRET
  })

  it('builds a prefilled enrollment URL', () => {
    expect(buildEnrollmentUrl('general-english', 'uz')).toContain('course=general-english&lang=uz&ref=telegram-bot')
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
