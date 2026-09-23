/**
 * Vercel Serverless Function — lesson tutor via OpenRouter.
 * Self-contained so production bundling does not depend on ../server or ../src imports.
 */

type TutorMessage = { role?: string; content?: string }

type TutorBody = {
  lessonTitle?: string
  objectives?: string[]
  contentMd?: string
  messages?: TutorMessage[]
  question?: string
}

type VercelRequest = {
  method?: string
  body?: TutorBody | string
  on?: (event: string, listener: (...args: unknown[]) => void) => void
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
  end: (body?: string) => void
}

const DEFAULT_MODEL = 'google/gemma-4-31b-it:free'
const FALLBACK_MODELS = [
  'qwen/qwen3.8-27b:free',
  'openrouter/free',
  'nvidia/nemotron-3-super-120b-a12b:free',
]
const MAX_CONTENT_CHARS = 8_000
const MAX_HISTORY = 8

function readEnvKey() {
  return process.env.API_KEY_OPENROUTER?.trim() || process.env.OPENROUTER_API_KEY?.trim() || ''
}

function truncateLessonContent(contentMd: string): string {
  const trimmed = contentMd.trim()
  if (trimmed.length <= MAX_CONTENT_CHARS) return trimmed
  return `${trimmed.slice(0, MAX_CONTENT_CHARS)}\n\n[…conteúdo da aula truncado para o contexto do tutor…]`
}

function buildTutorSystemPrompt(input: {
  lessonTitle: string
  objectives: string[]
  contentMd: string
}): string {
  const objectives =
    input.objectives.length > 0
      ? input.objectives.map((o) => `- ${o}`).join('\n')
      : '- (não informados)'

  return `Você é o Professor Aprendizz, tutor 24h de um LMS de Backend (Node.js + TypeScript).

Missão:
- Tirar dúvidas **somente sobre o tema e o conteúdo desta aula**.
- Orientar com clareza pedagógica, exemplos curtos e analogias quando ajudar.
- Se a pergunta fugir do tema da aula, diga isso com educação e reconduza ao conteúdo atual (pode sugerir o que estudar nesta aula).

Regras rígidas:
- NÃO entregue gabarito de exercícios (MCQ, texto livre ou código).
- NÃO resolva o exercício pelo aluno. Pode dar pistas, perguntas-guia e apontar trechos do conteúdo.
- NÃO invente fatos fora do material; se algo não estiver na aula, diga que a aula não cobre isso e oriente com o que ela cobre.
- Responda em português do Brasil, de forma direta (curto a médio), sem enrolação.
- Não peça dados pessoais nem chaves de API.

Aula atual: ${input.lessonTitle}

Objetivos:
${objectives}

Conteúdo da aula (contexto oficial):
---
${truncateLessonContent(input.contentMd)}
---`
}

function buildTutorMessages(input: {
  lessonTitle: string
  objectives: string[]
  contentMd: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  question: string
}): Array<{ role: string; content: string }> {
  const history = input.messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role,
    content: m.content.trim(),
  }))

  return [
    {
      role: 'system',
      content: buildTutorSystemPrompt({
        lessonTitle: input.lessonTitle,
        objectives: input.objectives,
        contentMd: input.contentMd,
      }),
    },
    ...history,
    { role: 'user', content: input.question.trim() },
  ]
}

async function callOpenRouter(args: {
  apiKey: string
  model: string
  messages: Array<{ role: string; content: string }>
}): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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

async function tutorReply(
  input: {
    lessonTitle: string
    objectives: string[]
    contentMd: string
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    question: string
  },
  apiKey: string,
): Promise<string> {
  const preferred = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL
  const models = [preferred, ...FALLBACK_MODELS.filter((m) => m !== preferred)]
  const messages = buildTutorMessages(input)

  let lastError: Error | null = null
  for (const model of models) {
    try {
      const content = await callOpenRouter({ apiKey, model, messages })
      if (!content.trim()) throw new Error('Resposta vazia do modelo')
      return content.trim()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Falha no tutor')
    }
  }
  throw lastError ?? new Error('Falha no tutor')
}

function readBody(req: VercelRequest): Promise<TutorBody> {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body)
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return Promise.resolve(JSON.parse(req.body) as TutorBody)
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
        resolve(raw ? (JSON.parse(raw) as TutorBody) : {})
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

function normalizeHistory(raw: TutorMessage[] | undefined): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content).trim(),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_HISTORY)
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

  let body: TutorBody
  try {
    body = await readBody(req)
  } catch {
    sendJson(res, 400, { error: 'JSON inválido' })
    return
  }

  if (!body.lessonTitle?.trim() || !body.contentMd?.trim() || !body.question?.trim()) {
    sendJson(res, 400, { error: 'lessonTitle, contentMd e question são obrigatórios' })
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
    const reply = await tutorReply(
      {
        lessonTitle: body.lessonTitle,
        objectives: Array.isArray(body.objectives) ? body.objectives : [],
        contentMd: body.contentMd,
        messages: normalizeHistory(body.messages),
        question: body.question,
      },
      apiKey,
    )
    sendJson(res, 200, { reply })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha no tutor'
    console.error('[tutor-chat]', message)
    sendJson(res, 502, { error: message })
  }
}
