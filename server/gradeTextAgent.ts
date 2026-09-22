/**
 * OpenRouter free-text grading agent (Node runtime).
 * Used by Vercel /api/grade-text and the Vite dev middleware.
 */
import {
  buildGradeMessages,
  parseGradeTextPayload,
  type GradeTextInput,
  type GradeTextOutput,
} from '../src/lib/gradeTextAgentCore.ts'

export type { GradeTextInput, GradeTextOutput }
export { buildGradeMessages, parseGradeTextPayload }

const DEFAULT_MODEL = 'google/gemma-4-31b-it:free'
const FALLBACK_MODELS = ['qwen/qwen3.8-27b:free', 'openrouter/free', 'nvidia/nemotron-3-super-120b-a12b:free']

export async function gradeFreeTextWithOpenRouter(
  input: GradeTextInput,
  apiKey: string,
  options: { model?: string; fetchImpl?: typeof fetch } = {},
): Promise<GradeTextOutput> {
  if (!apiKey) throw new Error('API_KEY_OPENROUTER não configurada')
  if (!input.answer.trim()) throw new Error('Resposta vazia')

  const fetchImpl = options.fetchImpl ?? fetch
  const preferred = options.model ?? process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL
  const models = [preferred, ...FALLBACK_MODELS.filter((m) => m !== preferred)]
  const messages = buildGradeMessages(input)

  const attempts: Array<{ model: string; useJsonFormat: boolean }> = []
  for (const model of models) {
    attempts.push({ model, useJsonFormat: true })
    attempts.push({ model, useJsonFormat: false })
  }

  let lastError: Error | null = null

  for (const attempt of attempts) {
    try {
      const { content, reasoning } = await callOpenRouter({
        fetchImpl,
        apiKey,
        model: attempt.model,
        messages,
        useJsonFormat: attempt.useJsonFormat,
      })

      const payloads = [content, reasoning].filter((v): v is string => Boolean(v?.trim()))
      let parseError: Error | null = null
      for (const payload of payloads) {
        if (isEmptyGradeJson(payload)) continue
        try {
          return parseGradeTextPayload(payload)
        } catch (err) {
          parseError = err instanceof Error ? err : new Error('JSON inválido')
        }
      }
      throw parseError ?? new Error('Resposta do modelo sem JSON útil')
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Falha ao corrigir texto')
    }
  }

  throw lastError ?? new Error('Falha ao corrigir texto')
}

function isEmptyGradeJson(raw: string): boolean {
  try {
    const parsed = JSON.parse(extractLooseObject(raw)) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return true
    const keys = Object.keys(parsed)
    if (keys.length === 0) return true
    if (keys.length === 1 && keys[0] === '' && parsed[''] === '') return true
    return false
  } catch {
    return false
  }
}

function extractLooseObject(text: string): string {
  const trimmed = text.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1)
  return trimmed
}

async function callOpenRouter(args: {
  fetchImpl: typeof fetch
  apiKey: string
  model: string
  messages: ReturnType<typeof buildGradeMessages>
  useJsonFormat: boolean
}): Promise<{ content: string; reasoning: string }> {
  const payload: Record<string, unknown> = {
    model: args.model,
    temperature: 0.1,
    messages: args.messages,
  }
  if (args.useJsonFormat) {
    payload.response_format = { type: 'json_object' }
  }

  const response = await args.fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://aprendizz.app',
      'X-Title': process.env.OPENROUTER_APP_NAME ?? 'Aprendizz',
    },
    body: JSON.stringify(payload),
  })

  const raw = await response.text()
  if (!response.ok) {
    throw new Error(`OpenRouter HTTP ${response.status}: ${raw.slice(0, 240)}`)
  }

  let data: {
    choices?: Array<{ message?: { content?: string | null; reasoning?: string | null } }>
  }
  try {
    data = JSON.parse(raw) as typeof data
  } catch {
    throw new Error('OpenRouter retornou JSON inválido')
  }

  const message = data.choices?.[0]?.message
  return {
    content: message?.content?.trim() || '',
    reasoning: message?.reasoning?.trim() || '',
  }
}
