import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateAssistantReply, parseAssistantText } from './ai-assistant'
import { defaultBotContent } from './bot-content'

describe('AI assistant', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.OPENAI_API_KEY
    delete process.env.OPENAI_MODEL
  })

  it('extracts text from a Responses API payload', () => {
    expect(parseAssistantText({
      output: [{ type: 'message', content: [{ type: 'output_text', text: 'Готово' }] }],
    })).toBe('Готово')
  })

  it('keeps the API key server-side and redacts a phone number from user input', async () => {
    process.env.OPENAI_API_KEY = 'server-secret'
    const openAIFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Ответ' }] }] }),
    })
    vi.stubGlobal('fetch', openAIFetch)

    await expect(generateAssistantReply('Позвоните мне +998 95 123 45 67', 'ru', defaultBotContent)).resolves.toBe('Ответ')

    const body = JSON.parse(openAIFetch.mock.calls[0][1].body)
    expect(openAIFetch.mock.calls[0][1].headers.Authorization).toBe('Bearer server-secret')
    expect(body.input).toContain('[номер скрыт]')
    expect(body.input).not.toContain('+998')
    expect(body.model).toBe('gpt-5.6-luna')
  })
})
