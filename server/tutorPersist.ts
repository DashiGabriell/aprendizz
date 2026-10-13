/**
 * Persist Joshua tutor exchanges with service role (fallback: Management API token).
 */
import { createClient } from '@supabase/supabase-js'

function readSupabaseUrl() {
  return process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim() || ''
}

function readServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    ''
  )
}

function readAnonKey() {
  return (
    process.env.SUPABASE_ANON_PUBLIC?.trim() ||
    process.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    ''
  )
}

export async function verifySupabaseUserId(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.toLowerCase().startsWith('bearer ')) return null
  const jwt = authHeader.slice(7).trim()
  if (!jwt) return null

  const url = readSupabaseUrl()
  const anon = readAnonKey()
  const service = readServiceRoleKey()
  if (!url || (!anon && !service)) return null

  const client = createClient(url, anon || service, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await client.auth.getUser(jwt)
  if (error || !data.user?.id) return null
  return data.user.id
}

async function persistWithServiceRole(args: {
  userId: string
  lessonId: string
  question: string
  answer: string
}): Promise<void> {
  const url = readSupabaseUrl()
  const service = readServiceRoleKey()
  if (!url || !service) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_SECRET ausentes — não foi possível salvar o chat.',
    )
  }

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error } = await admin.from('aprendizz_tutor_messages').insert([
    {
      user_id: args.userId,
      lesson_id: args.lessonId,
      role: 'user',
      content: args.question.trim(),
    },
    {
      user_id: args.userId,
      lesson_id: args.lessonId,
      role: 'assistant',
      content: args.answer.trim(),
    },
  ])

  if (error) throw new Error(`Falha ao salvar conversa: ${error.message}`)
}

async function persistWithManagementToken(args: {
  userId: string
  lessonId: string
  question: string
  answer: string
}): Promise<void> {
  const projectId = process.env.SUPABASE_PROJECT_ID?.trim()
  const token = process.env.SUPABASE_TOKEN?.trim()
  if (!projectId || !token) {
    throw new Error('SUPABASE_PROJECT_ID / SUPABASE_TOKEN ausentes para fallback de persistência')
  }

  const tag = `m${Date.now().toString(36)}`
  const q = args.question.replaceAll(`$${tag}$`, '')
  const a = args.answer.replaceAll(`$${tag}$`, '')
  const sql = `
insert into public.aprendizz_tutor_messages (user_id, lesson_id, role, content)
values
  ('${args.userId}'::uuid, '${args.lessonId}'::uuid, 'user', $${tag}$${q}$${tag}$),
  ('${args.userId}'::uuid, '${args.lessonId}'::uuid, 'assistant', $${tag}$${a}$${tag}$);
`

  const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Fallback SQL save failed: ${res.status} ${text.slice(0, 200)}`)
  }
}

export async function saveTutorExchange(args: {
  userId: string
  lessonId: string
  question: string
  answer: string
}): Promise<void> {
  try {
    await persistWithServiceRole(args)
  } catch (primaryErr) {
    try {
      await persistWithManagementToken(args)
    } catch {
      throw primaryErr instanceof Error ? primaryErr : new Error('Falha ao salvar conversa')
    }
  }
}
