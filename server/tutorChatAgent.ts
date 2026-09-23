/**
 * OpenRouter lesson tutor agent (Node runtime).
 * Used by Vite dev middleware; Vercel uses self-contained api/tutor-chat.ts.
 */
import { buildTutorMessages, type TutorChatInput } from '../src/lib/tutorChatCore.ts'

export type { TutorChatInput }

const DEFAULT_MODEL = 'google/gemma-4-31b-it:free'
const FALLBACK_MODELS = [
  'qwen/qwen3.8-27b:free',
  'openrouter/free',
  'nvidia/nemotron-3-super-120b-a12b:free',
]

export async function tutorChatWithOpenRouter(
  input: TutorChatInput,
  apiKey: string,
  options: { model?: string; fetchImpl?: typeof fetch } = {},
): Promise<{ reply: string }> {
  if (!apiKey) throw new Error('API_KEY_OPENROUTER não configurada')
  if (!input.question.trim()) throw new Error('Pergunta vazia')
  if (!input.lessonTitle.trim()) throw new Error('Aula sem título')

  const fetchImpl = options.fetchImpl ?? fetch
  const preferred = options.model ?? process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL
  const models = [preferred, ...FALLBACK_MODELS.filter((m) => m !== preferred)]
  const messages = buildTutorMessages(input)

  let lastError: Error | null = null
  for (const model of models) {
    try {
      const content = await callOpenRouter({
        fetchImpl,
        apiKey,
        model,
        messages,
      })
      if (!content.trim()) throw new Error('Resposta vazia do modelo')
      return { reply: content.trim() }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Falha no tutor')
    }
  }

  throw lastError ?? new Error('Falha no tutor')
}

async function callOpenRouter(args: {
  fetchImpl: typeof fetch
  apiKey: string
  model: string
  messages: Array<{ role: string; content: string }>
}): Promise<string> {
  const response = await args.fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://aprendizz.vercel.app',
      'X-Title': process.env.OPENROUTER_APP_NAME ?? 'Aprendizz Tutor',
    },
    body: JSON.stringify({
      model: args.model,
      temperature: 0.4,
      messages: args.messages,
    }),
  })

  const raw = await response.text()
  if (!response.ok) {
    throw new Error(`OpenRouter HTTP ${response.status}: ${raw.slice(0, 240)}`)
  }

  const data = JSON.parse(raw) as {
    choices?: Array<{ message?: { content?: string | null; reasoning?: string | null } }>
  }
  const message = data.choices?.[0]?.message
  return message?.content?.trim() || message?.reasoning?.trim() || ''
}
