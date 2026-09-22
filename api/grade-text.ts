/**
 * Vercel Serverless Function — free-text grading via OpenRouter.
 * Self-contained (no ../server or ../src imports) so production bundling cannot crash on load.
 */

type GradeBody = {
  prompt?: string
  answer?: string
  lessonTitle?: string
  objectives?: string[]
}

type GradeResult = {
  passed: boolean
  feedback: string
}

type VercelRequest = {
  method?: string
  body?: GradeBody | string
  on?: (event: string, listener: (...args: unknown[]) => void) => void
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
  end: (body?: string) => void
}

const SYSTEM_PROMPT = `Você é um corretor pedagógico de um LMS de Backend (Node.js + TypeScript).
Avalie a resposta do aluno à pergunta de texto livre.

Critérios:
- Aceite respostas corretas em substância, mesmo com gramática imperfecta.
- Exija que o aluno demonstre entendimento dos pontos pedidos no enunciado.
- Se faltar um ponto importante, marque como erro e diga o que falta (sem entregar a resposta completa).
- Se estiver aceitável, marque como acerto e dê um feedback curto e encorajador.

Responda SOMENTE com JSON válido neste formato exato (sem markdown):
{"passed":true,"feedback":"texto curto em português"}
ou
{"passed":false,"feedback":"texto curto em português"}`

const DEFAULT_MODEL = 'google/gemma-4-31b-it:free'
const FALLBACK_MODELS = [
  'qwen/qwen3.8-27b:free',
  'openrouter/free',
  'nvidia/nemotron-3-super-120b-a12b:free',
]

function readEnvKey() {
  return process.env.API_KEY_OPENROUTER?.trim() || process.env.OPENROUTER_API_KEY?.trim() || ''
}

function buildMessages(input: {
  prompt: string
  answer: string
  lessonTitle: string
  objectives?: string[]
}) {
  const objectives =
    input.objectives && input.objectives.length > 0
      ? `\nObjetivos da aula:\n- ${input.objectives.join('\n- ')}`
      : ''

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Aula: ${input.lessonTitle}${objectives}

Enunciado:
${input.prompt}

Resposta do aluno:
${input.answer}`,
    },
  ]
}

function coercePassed(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1 || value === '1') return true
  if (value === 'false' || value === 0 || value === '0') return false
  return null
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1)
  throw new Error('Resposta do modelo sem JSON')
}

function isEmptyGradeJson(raw: string): boolean {
  try {
    const parsed = JSON.parse(extractJsonObject(raw)) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return true
    const keys = Object.keys(parsed)
    if (keys.length === 0) return true
    if (keys.length === 1 && keys[0] === '' && parsed[''] === '') return true
    return false
  } catch {
    return false
  }
}

function parseGradeTextPayload(raw: string): GradeResult {
  const candidates = [raw, ...(raw.match(/\{[\s\S]*?\}/g) ?? [])]
  let lastError: Error | null = null

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(extractJsonObject(candidate.trim())) as {
        passed?: unknown
        feedback?: unknown
      }
      const passed = coercePassed(parsed.passed)
      if (passed === null) {
        lastError = new Error('Resposta do modelo sem campo passed boolean')
        continue
      }
      const feedback =
        typeof parsed.feedback === 'string' && parsed.feedback.trim()
          ? parsed.feedback.trim()
          : passed
            ? 'Resposta aceita.'
            : 'Resposta insuficiente. Revise o enunciado e tente de novo.'
      return { passed, feedback }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('JSON inválido')
    }
  }

  throw lastError ?? new Error('Resposta do modelo sem JSON')
}

async function callOpenRouter(args: {
  apiKey: string
  model: string
  messages: Array<{ role: string; content: string }>
  useJsonFormat: boolean
}): Promise<{ content: string; reasoning: string }> {
  const payload: Record<string, unknown> = {
    model: args.model,
    temperature: 0.1,
    messages: args.messages,
  }
  if (args.useJsonFormat) payload.response_format = { type: 'json_object' }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://aprendizz.vercel.app',
      'X-Title': process.env.OPENROUTER_APP_NAME ?? 'Aprendizz',
    },
    body: JSON.stringify(payload),
  })

  const raw = await response.text()
  if (!response.ok) {
    throw new Error(`OpenRouter HTTP ${response.status}: ${raw.slice(0, 240)}`)
  }

  const data = JSON.parse(raw) as {
    choices?: Array<{ message?: { content?: string | null; reasoning?: string | null } }>
  }
  const message = data.choices?.[0]?.message
  return {
    content: message?.content?.trim() || '',
    reasoning: message?.reasoning?.trim() || '',
  }
}

async function gradeFreeText(
  input: {
    prompt: string
    answer: string
    lessonTitle: string
    objectives: string[]
  },
  apiKey: string,
): Promise<GradeResult> {
  const preferred = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL
  const models = [preferred, ...FALLBACK_MODELS.filter((m) => m !== preferred)]
  const messages = buildMessages(input)

  let lastError: Error | null = null
  for (const model of models) {
    for (const useJsonFormat of [true, false]) {
      try {
        const { content, reasoning } = await callOpenRouter({
          apiKey,
          model,
          messages,
          useJsonFormat,
        })
        const payloads = [content, reasoning].filter(Boolean)
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
  }

  throw lastError ?? new Error('Falha ao corrigir texto')
}

function readBody(req: VercelRequest): Promise<GradeBody> {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body)
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return Promise.resolve(JSON.parse(req.body) as GradeBody)
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    if (!req.on) {
      resolve({})
      return
    }
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
    })
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? (JSON.parse(raw) as GradeBody) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.status(status)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.json(body)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  let body: GradeBody
  try {
    body = await readBody(req)
  } catch {
    sendJson(res, 400, { error: 'JSON inválido' })
    return
  }

  if (!body.prompt?.trim() || !body.answer?.trim() || !body.lessonTitle?.trim()) {
    sendJson(res, 400, { error: 'prompt, answer e lessonTitle são obrigatórios' })
    return
  }

  const apiKey = readEnvKey()
  if (!apiKey) {
    sendJson(res, 500, {
      error:
        'API_KEY_OPENROUTER não configurada na Vercel. Project Settings → Environment Variables.',
    })
    return
  }

  try {
    const result = await gradeFreeText(
      {
        prompt: body.prompt,
        answer: body.answer,
        lessonTitle: body.lessonTitle,
        objectives: Array.isArray(body.objectives) ? body.objectives : [],
      },
      apiKey,
    )
    sendJson(res, 200, result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha ao corrigir texto'
    console.error('[grade-text]', message)
    sendJson(res, 502, { error: message })
  }
}
