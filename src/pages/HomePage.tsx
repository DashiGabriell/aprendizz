import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../hooks/useAuth'
import { ensureProgressRows, listCoursesWithProgress, peekCourses } from '../lib/progress'
import type { CourseSummary } from '../lib/types'

export function HomePage() {
  const { user } = useAuth()
  const userId = user?.id
  const cached = userId ? peekCourses(userId) : null
  const [courses, setCourses] = useState<CourseSummary[]>(() => cached ?? [])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(() => !cached)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load(showSpinner: boolean) {
      const warm = peekCourses(userId!)
      if (warm) {
        setCourses(warm)
        setLoading(false)
      } else if (showSpinner) {
        setLoading(true)
      }
      const ensured = await ensureProgressRows(userId!)
      if (ensured.error) {
        if (!cancelled) setError(ensured.error)
        setLoading(false)
        return
      }
      const result = await listCoursesWithProgress(userId!)
      if (!cancelled) {
        if (result.error) setError(result.error)
        else setCourses(result.data)
        setLoading(false)
      }
    }

    void load(true)
    const onProgress = () => void load(false)
    window.addEventListener('aprendizz-progress-updated', onProgress)
    return () => {
      cancelled = true
      window.removeEventListener('aprendizz-progress-updated', onProgress)
    }
  }, [userId])

  return (
    <Layout>
      <div className="reveal-in space-y-10">
        <header className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <img src="/logo.png" alt="" width={56} height={56} className="brand-logo-img" />
            <p className="eyebrow !mb-0">Aprendizz</p>
          </div>
          <h1 className="page-title mb-3 max-w-[20ch]">Seus cursos</h1>
          <p className="text-lg text-[var(--muted)]">
            O Aprendizz é o LMS. Escolha um curso para abrir o roadmap, estudar as aulas e fazer as
            avaliações.
          </p>
        </header>

        {loading ? <p className="text-[var(--muted)]">Carregando cursos…</p> : null}
        {error ? (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
          <section aria-label="Cursos disponíveis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, i) => (
              <article
                key={course.id}
                className="block-panel reveal-in flex min-w-0 flex-col"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--orange)]">
                    Curso
                  </span>
                  <span className="text-xs font-semibold text-[var(--royal)]">{course.progressLabel}</span>
                </div>
                <h2 className="text-xl text-[var(--heading)] sm:text-2xl">{course.title}</h2>
                <p className="mt-2 flex-1 text-sm text-[var(--muted)]">{plain(course.description_md)}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--heading)]">
                  {course.completedCount}/{course.lessonCount} unidades
                </p>
                <div className="course-card-actions mt-4">
                  <Link to={`/courses/${course.slug}`} className="btn-primary no-underline">
                    Abrir curso
                  </Link>
                  {course.continueSlug ? (
                    <Link to={`/lessons/${course.continueSlug}`} className="btn-ghost no-underline">
                      Continuar aula
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </Layout>
  )
}

function plain(md: string) {
  const text = md.replace(/[#>*`\[\]]/g, '').replace(/\n+/g, ' ').trim()
  if (text.length <= 180) return text
  return `${text.slice(0, 179)}…`
}
