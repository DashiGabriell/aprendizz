import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { LessonCard } from '../components/LessonCard'
import { useAuth } from '../hooks/useAuth'
import { ensureProgressRows, listLessonsWithProgress } from '../lib/progress'
import type { LessonWithProgress } from '../lib/types'

export function RoadmapPage() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState<LessonWithProgress[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const ensured = await ensureProgressRows(user.id)
      if (ensured.error) {
        if (!cancelled) setError(ensured.error)
        setLoading(false)
        return
      }
      const result = await listLessonsWithProgress(user.id)
      if (!cancelled) {
        if (result.error) setError(result.error)
        else setLessons(result.data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const completed = lessons.filter((l) => l.status === 'completed').length

  return (
    <Layout>
      <div className="reveal-in mb-8">
        <p className="eyebrow">Roadmap Backend</p>
        <h1 className="mb-3 max-w-[16ch] text-4xl sm:text-5xl">Estude uma aula por vez</h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">
          Conteúdo na ordem do plano: estratégia, 12 semanas, ciclo diário, projeto e Aula 01. Cada
          aula exige MCQ, texto e código.
        </p>
        <p className="mt-4 text-sm font-semibold text-[var(--royal)]">
          Progresso: {completed}/{lessons.length || '—'} concluídas
        </p>
      </div>

      {loading ? <p className="text-[var(--muted)]">Carregando aulas…</p> : null}
      {error ? (
        <p className="text-sm" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson, i) => (
          <div key={lesson.id} style={{ animationDelay: `${i * 0.04}s` }}>
            <LessonCard lesson={lesson} />
          </div>
        ))}
      </div>
    </Layout>
  )
}
