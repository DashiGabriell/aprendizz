import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  console.warn('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing from env')
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/** Ensures a valid access token is attached before authenticated RLS queries. */
export async function ensureAuthSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) return { session: null, error: error.message }

  if (data.session) {
    const expiresAt = data.session.expires_at ?? 0
    const soon = expiresAt * 1000 - Date.now() < 60_000
    if (!soon) return { session: data.session, error: null }

    const refreshed = await supabase.auth.refreshSession()
    if (refreshed.error) return { session: data.session, error: refreshed.error.message }
    return { session: refreshed.data.session, error: null }
  }

  return { session: null, error: 'Sessão expirada. Faça login novamente.' }
}
