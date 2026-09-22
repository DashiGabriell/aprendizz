import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    if (result.error) setError(result.error)
    setBusy(false)
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md reveal-in">
        <div className="mb-4 flex items-center gap-3">
          <img src="/logo.png" alt="" width={48} height={48} className="brand-logo-img" />
          <p className="eyebrow !mb-0">Aprendizz</p>
        </div>
        <h1 className="page-title mb-2">Entrar</h1>
        <p className="mb-8 text-[var(--muted)]">
          Use a mesma conta do projeto Supabase compartilhado.
        </p>
        <form className="block-panel space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <label className="block text-sm font-semibold text-[var(--heading)]">
            Email
            <input
              className="input-field mt-1"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[var(--heading)]">
            Senha
            <input
              className="input-field mt-1"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="text-sm" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          ) : null}
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
