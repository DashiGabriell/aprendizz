import type { FreeTextGradeResult } from './types'

export type GradeFreeTextRequest = {
  prompt: string
  answer: string
  lessonTitle: string
  objectives: string[]
}

export async function gradeFreeText(
  input: GradeFreeTextRequest,
): Promise<{ data: FreeTextGradeResult | null; error: string | null }> {
  try {
    const response = await fetch('/api/grade-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const payload = (await response.json()) as FreeTextGradeResult & { error?: string }
    if (!response.ok) {
      return { data: null, error: payload.error ?? `Falha HTTP ${response.status}` }
    }
    if (typeof payload.passed !== 'boolean' || typeof payload.feedback !== 'string') {
      return { data: null, error: 'Resposta de correção inválida' }
    }
    return { data: { passed: payload.passed, feedback: payload.feedback }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Não foi possível corrigir o texto',
    }
  }
}
