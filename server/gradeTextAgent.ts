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

export async function gradeFreeTextWithOpenRouter(
  input: GradeTextInput,
  apiKey: string,
  options: { model?: string; fetchImpl?: typeof fetch } = {},
): Promise<GradeTextOutput> {
  if (!apiKey) throw new Error('API_KEY_OPENROUTER não configurada')
  if (!input.answer.trim()) throw new Error('Resposta vazia')

  const fetchImpl = options.fetchImpl ?? fetch
  const model = options.model ?? process.env.OPENROUTER_MODEL ?? 'openrouter/free'

  const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://aprendizz.local',
      'X-Title': process.env.OPENROUTER_APP_NAME ?? 'Aprendizz',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: buildGradeMessages(input),
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`OpenRouter HTTP ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenRouter retornou resposta vazia')
  return parseGradeTextPayload(content)
}
