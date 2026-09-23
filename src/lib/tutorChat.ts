import type { TutorChatMessage } from './tutorChatCore'

export type AskTutorRequest = {
  lessonTitle: string
  objectives: string[]
  contentMd: string
  messages: TutorChatMessage[]
  question: string
}

export async function askLessonTutor(
  input: AskTutorRequest,
): Promise<{ data: { reply: string } | null; error: string | null }> {
  try {
    const response = await fetch('/api/tutor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const payload = (await response.json()) as { reply?: string; error?: string }
    if (!response.ok) {
      return { data: null, error: payload.error ?? `Falha HTTP ${response.status}` }
    }
    if (typeof payload.reply !== 'string' || !payload.reply.trim()) {
      return { data: null, error: 'Resposta do tutor inválida' }
    }
    return { data: { reply: payload.reply.trim() }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Não foi possível falar com o professor',
    }
  }
}
