import { useEffect, useState } from 'react'
import { Layout } from './Layout'
import { CurriculumSidebar } from './CurriculumSidebar'
import { useAuth } from '../hooks/useAuth'
import { ensureProgressRows, loadCurriculumTree } from '../lib/progress'
import type { CurriculumTree } from '../lib/types'

type Props = {
  children: React.ReactNode
  activeSlug?: string
}

export function StudyLayout({ children, activeSlug }: Props) {
  const { user } = useAuth()
  const userId = user?.id
  const [tree, setTree] = useState<CurriculumTree | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    ;(async () => {
      const ensured = await ensureProgressRows(userId)
      if (ensured.error) {
        if (!cancelled) setError(ensured.error)
        return
      }
      const result = await loadCurriculumTree(userId)
      if (!cancelled) {
        if (result.error) setError(result.error)
        else setTree(result.data)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <Layout>
      <div className="study-shell">
        <button
          type="button"
          className="btn-ghost study-sidebar-toggle mb-4 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? 'Fechar menu' : 'Curso / Módulos / Aulas'}
        </button>

        {mobileOpen ? (
          <button
            type="button"
            className="study-sidebar-backdrop lg:hidden"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        {tree ? (
          <CurriculumSidebar
            tree={tree}
            activeSlug={activeSlug}
            mobileOpen={mobileOpen}
            onNavigate={() => setMobileOpen(false)}
          />
        ) : (
          <aside className="study-sidebar">
            <p className="text-sm text-[var(--muted)]">{error ?? 'Carregando currículo…'}</p>
          </aside>
        )}

        <div className="study-content min-w-0">{children}</div>
      </div>
    </Layout>
  )
}
