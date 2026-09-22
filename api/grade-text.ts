import { gradeFreeTextWithOpenRouter } from '../server/gradeTextAgent.ts'

type GradeBody = {
  prompt?: string
  answer?: string
  lessonTitle?: string
  objectives?: string[]
}

type ApiRequest = {
  method?: string
  body?: GradeBody
}

type ApiResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body ?? {}) as GradeBody

  if (!body.prompt?.trim() || !body.answer?.trim() || !body.lessonTitle?.trim()) {
    return res.status(400).json({ error: 'prompt, answer e lessonTitle são obrigatórios' })
  }

  const apiKey = process.env.API_KEY_OPENROUTER
  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY_OPENROUTER não configurada no servidor' })
  }

  try {
    const result = await gradeFreeTextWithOpenRouter(
      {
        prompt: body.prompt,
        answer: body.answer,
        lessonTitle: body.lessonTitle,
        objectives: Array.isArray(body.objectives) ? body.objectives : [],
      },
      apiKey,
    )
    return res.status(200).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha ao corrigir texto'
    return res.status(502).json({ error: message })
  }
}
