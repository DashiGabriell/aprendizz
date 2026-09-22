export type GradeTextInput = {
  prompt: string
  answer: string
  lessonTitle: string
  objectives?: string[]
}

export type GradeTextOutput = {
  passed: boolean
  feedback: string
}

const SYSTEM_PROMPT = `Você é um corretor pedagógico de um LMS de Backend (Node.js + TypeScript).
Avalie a resposta do aluno à pergunta de texto livre.

Critérios:
- Aceite respostas corretas em substância, mesmo com gramática imperfeita.
- Exija que o aluno demonstre entendimento dos pontos pedidos no enunciado.
- Se faltar um ponto importante, marque como erro e diga o que falta (sem entregar a resposta completa).
- Se estiver aceitável, marque como acerto e dê um feedback curto e encorajador.

Responda SOMENTE com JSON válido neste formato exato (sem markdown):
{"passed":true,"feedback":"texto curto em português"}
ou
{"passed":false,"feedback":"texto curto em português"}`

export function buildGradeMessages(input: GradeTextInput) {
  const objectives =
    input.objectives && input.objectives.length > 0
      ? `\nObjetivos da aula:\n- ${input.objectives.join('\n- ')}`
      : ''

  return [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    {
      role: 'user' as const,
      content: `Aula: ${input.lessonTitle}${objectives}

Enunciado:
${input.prompt}

Resposta do aluno:
${input.answer}`,
    },
  ]
}

export function parseGradeTextPayload(raw: string): GradeTextOutput {
  const candidates = [raw, ...(raw.match(/\{[\s\S]*?\}/g) ?? [])]
  let lastError: Error | null = null

  for (const candidate of candidates) {
    try {
      const jsonSlice = extractJsonObject(candidate.trim())
      const parsed = JSON.parse(jsonSlice) as { passed?: unknown; feedback?: unknown }
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

function coercePassed(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1 || value === '1') return true
  if (value === 'false' || value === 0 || value === '0') return false
  return null
}

function extractJsonObject(text: string): string {
  if (text.startsWith('{') && text.endsWith('}')) return text
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) return text.slice(start, end + 1)
  throw new Error('Resposta do modelo sem JSON')
}
