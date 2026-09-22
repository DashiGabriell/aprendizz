import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { ensureProfile, type StudentProfile } from '../lib/profile'
import { ensureProgressRows, loadCurriculumTree } from '../lib/progress'
import type { CurriculumTree, ProgressStatus } from '../lib/types'
import { BrandLogo } from './BrandLogo'
import { ProfileAvatarLink } from './ProfileAvatar'
import { PlayerAside } from './PlayerAside'
import { PlayerFooter, type NeighborLesson } from './PlayerFooter'

type Props = {
  children: React.ReactNode
  activeSlug?: string
  courseSlug?: string
  subjectTitle?: string
  moduleTitle?: string
  currentStatus: ProgressStatus
  previous: NeighborLesson | null
  next: NeighborLesson | null
  onBlockedNext: () => void
}

export function PlayerLayout({
  children,
  activeSlug,
  courseSlug,
  subjectTitle,
  moduleTitle,
  currentStatus,
  previous,
  next,
  onBlockedNext,
}: Props) {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const [tree, setTree] = useState<CurriculumTree | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [asideOpen, setAsideOpen] = useState(false)
  const [asideCollapsed, setAsideCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('player-mode')
    document.body.classList.add('player-mode')
    return () => {
      document.documentElement.classList.remove('player-mode')
      document.body.classList.remove('player-mode')
    }
  }, [])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ensureProfile(user).then((res) => {
      if (!cancelled && res.data) setProfile(res.data)
    })
    ;(async () => {
      const ensured = await ensureProgressRows(user.id)
      if (ensured.error) {
        if (!cancelled) setError(ensured.error)
        return
      }
      const result = await loadCurriculumTree(user.id, courseSlug || undefined)
      if (!cancelled) {
        if (result.error) setError(result.error)
        else setTree(result.data)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, activeSlug, courseSlug])

  const flat = useMemo(() => tree?.modules.flatMap((m) => m.lessons) ?? [], [tree])
  const completed = flat.filter((l) => l.status === 'completed').length
  const progressPercent = flat.length === 0 ? 0 : Math.round((completed / flat.length) * 100)

  const displaySubject = subjectTitle || tree?.subject.title || 'Aprendizz'
  const displayModule = moduleTitle || ''
  const avatarName = profile?.display_name || user?.email || 'Aluno'

  return (
    <div className="player-page">
      <div className="player-container">
        <header className="player-header" role="banner">
          <div className="player-header-left">
            <BrandLogo to="/" size="sm" className="player-brand" />
            <span className="player-header-sub">Player de aulas</span>
          </div>

          <div className="player-header-center">
            <p className="player-curso-nome">{displaySubject}</p>
            {displayModule ? <p className="player-jornada-badge">{displayModule}</p> : null}
          </div>

          <div className="player-header-right">
            <button type="button" className="btn-ghost" onClick={toggle} aria-label="Alternar tema">
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
        </header>

        <div className={`player-wrapper ${asideCollapsed ? 'aside-collapsed' : ''}`}>
          <button
            type="button"
            className="player-toggle-mobile"
            onClick={() => setAsideOpen(true)}
            aria-label="Abrir conteúdo do curso"
          >
            ☰ Conteúdo
          </button>

          <button
            type="button"
            className="player-toggle-collapse"
            onClick={() => setAsideCollapsed((v) => !v)}
            aria-label={asideCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {asideCollapsed ? '»' : '«'}
          </button>

          {asideOpen ? (
            <button
              type="button"
              className="player-aside-overlay"
              aria-label="Fechar menu"
              onClick={() => setAsideOpen(false)}
            />
          ) : null}

          {tree ? (
            <div className={`player-aside-shell ${asideOpen ? 'is-open' : ''}`}>
              <PlayerAside
                tree={tree}
                activeSlug={activeSlug}
                collapsed={asideCollapsed}
                onNavigate={() => setAsideOpen(false)}
              />
            </div>
          ) : (
            <aside className="player-aside">
              <p className="player-aside-loading">{error ?? 'Carregando conteúdo…'}</p>
            </aside>
          )}

          <main className="player-main" id="main-content" role="main" aria-label="Conteúdo da aula">
            {children}
          </main>
        </div>

        <PlayerFooter
          courseSlug={courseSlug || tree?.subject.slug}
          previous={previous}
          next={next}
          currentStatus={currentStatus}
          progressPercent={progressPercent}
          onBlockedNext={onBlockedNext}
        />
      </div>
    </div>
  )
}
