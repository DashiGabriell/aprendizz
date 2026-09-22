import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { ProfileAvatarLink } from './ProfileAvatar'
import { ensureProfile, type StudentProfile } from '../lib/profile'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const [profile, setProfile] = useState<StudentProfile | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    let cancelled = false

    const load = () => {
      ensureProfile(user).then((res) => {
        if (!cancelled && res.data) setProfile(res.data)
      })
    }

    load()
    const onUpdated = () => load()
    window.addEventListener('aprendizz-profile-updated', onUpdated)
    return () => {
      cancelled = true
      window.removeEventListener('aprendizz-profile-updated', onUpdated)
    }
  }, [user, location.pathname])

  const avatarName = profile?.display_name || user?.email || 'Aluno'

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--nav-btn-bg)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display text-xl text-[var(--heading)] no-underline">
            Aprendizz
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/" className="btn-ghost no-underline hidden sm:inline-flex">
                Roadmap
              </Link>
            ) : null}
            <button type="button" className="btn-ghost" onClick={toggle} aria-label="Alternar tema">
              <span className="grid h-6 w-6 place-items-center bg-gradient-to-br from-[var(--electric)] to-[var(--navy)] text-white text-xs">
                {theme === 'light' ? '☾' : '☀'}
              </span>
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            {user ? (
              <>
                <ProfileAvatarLink name={avatarName} avatarUrl={profile?.avatar_url} />
                <button type="button" className="btn-ghost" onClick={() => void signOut()}>
                  Sair
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
