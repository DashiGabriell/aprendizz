import { describe, expect, it } from 'vitest'
import { buildTutorMessages, buildTutorSystemPrompt, truncateLessonContent } from './tutorChatCore'

describe('tutorChatCore', () => {
  it('truncates long lesson content', () => {
    const long = 'x'.repeat(10_000)
    const out = truncateLessonContent(long)
    expect(out.length).toBeLessThan(long.length)
    expect(out).toContain('truncado')
  })

  it('builds a system prompt scoped to the lesson with anti-gabarito rules', () => {
    const prompt = buildTutorSystemPrompt({
      lessonTitle: 'HTTP na prática',
      objectives: ['Explicar status codes'],
      contentMd: '## Status\n200 OK',
    })
    expect(prompt).toContain('HTTP na prática')
    expect(prompt).toContain('Explicar status codes')
    expect(prompt).toContain('200 OK')
    expect(prompt).toContain('Joseph')
    expect(prompt.toLowerCase()).toContain('gabarito')
  })

  it('appends the new question after limited history', () => {
    const messages = buildTutorMessages({
      lessonTitle: 'Auth',
      objectives: [],
      contentMd: 'AuthN vs AuthZ',
      messages: [
        { role: 'user', content: 'o que é 401?' },
        { role: 'assistant', content: 'Não autenticado.' },
      ],
      question: 'e 403?',
    })
    expect(messages[0]?.role).toBe('system')
    expect(messages.at(-1)).toEqual({ role: 'user', content: 'e 403?' })
    expect(messages.some((m) => m.content === 'o que é 401?')).toBe(true)
  })
})
