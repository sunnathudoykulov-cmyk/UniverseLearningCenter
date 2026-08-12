import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { parseLead } from './lead'

const validLead = {
  name: 'Sunnat',
  phone: '+998 95 037 62 32',
  direction: 'general-english',
  age: 16,
  language: 'ru',
  consent: true,
}

describe('parseLead', () => {
  it('normalizes a valid lead', () => {
    expect(parseLead(validLead)).toMatchObject({
      lead: { ...validLead, phone: '+998950376232' },
    })
  })

  it('rejects invalid or incomplete data', () => {
    const result = parseLead({ ...validLead, phone: '123', age: 2, consent: false })
    expect(result.errors).toEqual(expect.arrayContaining(['phone', 'age', 'consent']))
  })

  it('preserves the honeypot for spam handling', () => {
    expect(parseLead({ ...validLead, website: 'spam.example' }).lead?.website).toBe('spam.example')
  })
})

describe('lead handler', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.TELEGRAM_BOT_TOKEN
    delete process.env.TELEGRAM_CHAT_ID
  })

  it('delivers a valid lead without exposing Telegram credentials', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    process.env.TELEGRAM_CHAT_ID = '-100123'
    const telegramFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', telegramFetch)

    const request = {
      method: 'POST',
      headers: {},
      body: validLead,
      socket: { remoteAddress: 'test-success' },
    } as unknown as Parameters<typeof handler>[0]
    const output: { statusCode?: number; body?: string; headers: Record<string, string> } = { headers: {} }
    const response = {
      set statusCode(value: number) { output.statusCode = value },
      setHeader(key: string, value: string) { output.headers[key] = value },
      end(body: string) { output.body = body },
    } as unknown as Parameters<typeof handler>[1]

    await handler(request, response)

    expect(output.statusCode).toBe(200)
    expect(JSON.parse(output.body || '{}')).toEqual({ ok: true })
    expect(telegramFetch).toHaveBeenCalledOnce()
    expect(output.body).not.toContain('test-token')
  })

  it('rejects non-POST requests', async () => {
    const request = { method: 'GET', headers: {}, socket: {} } as unknown as Parameters<typeof handler>[0]
    const output: { statusCode?: number; body?: string; headers: Record<string, string> } = { headers: {} }
    const response = {
      set statusCode(value: number) { output.statusCode = value },
      setHeader(key: string, value: string) { output.headers[key] = value },
      end(body: string) { output.body = body },
    } as unknown as Parameters<typeof handler>[1]

    await handler(request, response)

    expect(output.statusCode).toBe(405)
    expect(output.headers.Allow).toBe('POST')
  })
})
