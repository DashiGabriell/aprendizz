import { ensureAuthSession, supabase } from './supabase'
import type { TutorChatMessage } from './tutorChatCore'

export type TutorMessageRow = {
  id: string
  user_id: string
  lesson_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type TutorNotebookEntry = {
  id: string
  lessonId: string
  lessonTitle: string
  lessonSlug: string
  question: string
  answer: string
  askedAt: string
}

export async function listTutorMessagesForLesson(
  userId: string,
  lessonId: string,
): Promise<{ data: TutorChatMessage[]; error: string | null }> {
  const auth = await ensureAuthSession()
  if (!auth.session) {
    return { data: [], error: auth.error ?? 'Sessão expirada. Faça login novamente.' }
  }

  const { data, error } = await supabase
    .from('aprendizz_tutor_messages')
    .select('role, content')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true })

  if (error) return { data: [], error: error.message }

  const messages = ((data as Array<{ role: string; content: string }> | null) ?? [])
    .filter((row) => row.role === 'user' || row.role === 'assistant')
    .map((row) => ({
      role: row.role as 'user' | 'assistant',
      content: row.content,
    }))

  return { data: messages, error: null }
}

export async function appendTutorExchange(args: {
  userId: string
  lessonId: string
  question: string
  answer: string
}): Promise<{ error: string | null }> {
  const auth = await ensureAuthSession()
  if (!auth.session) {
    return { error: auth.error ?? 'Sessão expirada. Faça login novamente.' }
  }

  const rows = [
    {
      user_id: args.userId,
      lesson_id: args.lessonId,
      role: 'user' as const,
      content: args.question.trim(),
    },
    {
      user_id: args.userId,
      lesson_id: args.lessonId,
      role: 'assistant' as const,
      content: args.answer.trim(),
    },
  ]

  const { error } = await supabase.from('aprendizz_tutor_messages').insert(rows)
  return { error: error?.message ?? null }
}

export async function listTutorNotebook(
  userId: string,
): Promise<{ data: TutorNotebookEntry[]; error: string | null }> {
  const auth = await ensureAuthSession()
  if (!auth.session) {
    return { data: [], error: auth.error ?? 'Sessão expirada. Faça login novamente.' }
  }

  const { data, error } = await supabase
    .from('aprendizz_tutor_messages')
    .select('id, role, content, created_at, lesson_id, aprendizz_lessons(title, slug)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) return { data: [], error: error.message }

  type Row = {
    id: string
    role: string
    content: string
    created_at: string
    lesson_id: string
    aprendizz_lessons: { title?: string; slug?: string } | { title?: string; slug?: string }[] | null
  }

  const rows = (data as Row[] | null) ?? []
  const entries: TutorNotebookEntry[] = []

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i]
    if (row.role !== 'user') continue
    const next = rows[i + 1]
    if (!next || next.role !== 'assistant' || next.lesson_id !== row.lesson_id) continue

    const lessonJoin = Array.isArray(row.aprendizz_lessons)
      ? row.aprendizz_lessons[0]
      : row.aprendizz_lessons

    entries.push({
      id: row.id,
      lessonId: row.lesson_id,
      lessonTitle: lessonJoin?.title?.trim() || 'Aula',
      lessonSlug: lessonJoin?.slug?.trim() || '',
      question: row.content,
      answer: next.content,
      askedAt: row.created_at,
    })
  }

  // Newest first for the notebook
  entries.reverse()
  return { data: entries, error: null }
}
