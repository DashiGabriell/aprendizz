import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { BrandLogo } from './BrandLogo'
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
      <header className="site-header sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--nav-btn-bg)] backdrop-blur-md">
        <div className="site-header-inner mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <BrandLogo size="md" />
          <div className="site-header-actions flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <Link to="/" className="btn-ghost no-underline hidden sm:inline-flex">
                Cursos
              </Link>
            ) : null}
            <button type="button" className="btn-ghost" onClick={toggle} aria-label="Alternar tema">
              <span className="grid h-6 w-6 place-items-center bg-gradient-to-br from-[var(--electric)] to-[var(--navy)] text-white text-xs">
                {theme === 'light' ? '☾' : '☀'}
              </span>
              <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            {user ? (
              <>
                <ProfileAvatarLink name={avatarName} avatarUrl={profile?.avatar_url} />
                <button type="button" className="btn-ghost hidden sm:inline-flex" onClick={() => void signOut()}>
                  Sair
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>
      <main className="site-main mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
