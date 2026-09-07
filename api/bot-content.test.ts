import { afterEach, describe, expect, it, vi } from 'vitest'
import { defaultBotContent, getBotContent, parseBotContent, resetBotContentCache } from './bot-content'

describe('bot content', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.BOT_CONTENT_URL
    resetBotContentCache()
  })

  it('rejects incomplete remote course data', () => {
    expect(parseBotContent({ courses: [{ slug: 'ielts-cefr' }] })).toBeNull()
  })

  it('loads owner-editable course facts from a configured endpoint', async () => {
    process.env.BOT_CONTENT_URL = 'https://example.com/bot-content.json'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        courses: [{
          slug: 'ielts-cefr',
          titleRu: 'IELTS / CEFR',
          titleUz: 'IELTS / CEFR',
          descriptionRu: 'Подготовка к экзамену.',
          descriptionUz: 'Imtihonga tayyorgarlik.',
          price: 'Уточнённая цена',
          schedule: 'Пн / Ср / Пт, 18:00',
        }],
      }),
    }))

    const content = await getBotContent()
    expect(content.courses[0]).toMatchObject({ price: 'Уточнённая цена', schedule: 'Пн / Ср / Пт, 18:00' })
  })

  it('uses safe defaults when the endpoint is unavailable', async () => {
    process.env.BOT_CONTENT_URL = 'https://example.com/bot-content.json'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await expect(getBotContent()).resolves.toEqual(defaultBotContent)
  })
})
