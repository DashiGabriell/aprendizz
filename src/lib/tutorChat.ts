import type { TutorChatMessage } from './tutorChatCore'
import { ensureAuthSession } from './supabase'

export type AskTutorRequest = {
  lessonId: string
  lessonTitle: string
  objectives: string[]
  contentMd: string
  messages: TutorChatMessage[]
  question: string
}

export async function askLessonTutor(
  input: AskTutorRequest,
): Promise<{ data: { reply: string; saved: boolean } | null; error: string | null }> {
  try {
    const auth = await ensureAuthSession()
    if (!auth.session?.access_token) {
      return { data: null, error: auth.error ?? 'Faça login novamente para conversar com o Joshua.' }
    }

    const response = await fetch('/api/tutor-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.session.access_token}`,
      },
      body: JSON.stringify(input),
    })
    const payload = (await response.json()) as {
      reply?: string
      saved?: boolean
      error?: string
    }
    if (!response.ok) {
      return { data: null, error: payload.error ?? `Falha HTTP ${response.status}` }
    }
    if (typeof payload.reply !== 'string' || !payload.reply.trim()) {
      return { data: null, error: 'Resposta do tutor inválida' }
    }
    return {
      data: { reply: payload.reply.trim(), saved: Boolean(payload.saved) },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Não foi possível falar com o professor',
    }
  }
}
