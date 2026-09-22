import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'
import { useAuth } from '../hooks/useAuth'
import { ensureProgressRows, loadCurriculumTree } from '../lib/progress'
import type { CurriculumTree } from '../lib/types'

export function RoadmapPage() {
  const { user } = useAuth()
  const [tree, setTree] = useState<CurriculumTree | null>(null)
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
      const result = await loadCurriculumTree(user.id)
      if (!cancelled) {
        if (result.error) setError(result.error)
        else setTree(result.data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const flat = useMemo(() => tree?.modules.flatMap((m) => m.lessons) ?? [], [tree])
  const completed = flat.filter((l) => l.status === 'completed').length
  const continueLesson = flat.find((l) => l.status === 'available') ?? flat.find((l) => l.status === 'completed')

  return (
    <Layout>
      <div className="reveal-in space-y-8">
        <header>
          <p className="eyebrow">Roadmap</p>
          <h1 className="mb-3 max-w-[18ch] text-4xl sm:text-5xl">O caminho do Backend empregável</h1>
          <p className="max-w-2xl text-lg text-[var(--muted)]">
            Este roadmap só explica a jornada. Os exercícios ficam nas aulas e na avaliação de cada
            módulo. Estude na ordem: Matéria → Módulo → Aula.
          </p>
          {tree ? (
            <p className="mt-4 text-sm font-semibold text-[var(--royal)]">
              Progresso geral: {completed}/{flat.length} unidades concluídas
            </p>
          ) : null}
        </header>

        {loading ? <p className="text-[var(--muted)]">Carregando caminho…</p> : null}
        {error ? (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        ) : null}

        {tree ? (
          <>
            <section className="block-panel">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--orange)]">Matéria</p>
              <h2 className="mt-1 text-2xl">{tree.subject.title}</h2>
              <div className="mt-4">
                <Markdown content={tree.subject.description_md} />
              </div>
              {continueLesson ? (
                <Link to={`/lessons/${continueLesson.slug}`} className="btn-primary mt-4 inline-flex no-underline">
                  Continuar estudando
                </Link>
              ) : null}
            </section>

            <div className="space-y-4">
              {tree.modules.map((block) => {
                const done = block.lessons.filter((l) => l.status === 'completed').length
                const assessment = block.lessons.find((l) => l.kind === 'assessment')
                const classLessons = block.lessons.filter((l) => l.kind === 'lesson')
                return (
                  <section key={block.module.id} className="block-panel">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--orange)]">
                          Módulo {block.module.sort_order}
                        </p>
                        <h3 className="text-xl text-[var(--heading)]">{block.module.title}</h3>
                      </div>
                      <p className="text-sm font-semibold text-[var(--royal)]">
                        {done}/{block.lessons.length} concluídas
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{plain(block.module.description_md)}</p>
                    <ol className="mt-4 space-y-2">
                      {classLessons.map((lesson, i) => (
                        <li key={lesson.id} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                          <span className="font-display text-[var(--heading)]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{lesson.title}</span>
                          <span className="ml-auto text-xs uppercase tracking-wide">
                            {lesson.status === 'completed'
                              ? 'Feita'
                              : lesson.status === 'available'
                                ? 'Atual'
                                : 'Bloqueada'}
                          </span>
                        </li>
                      ))}
                      {assessment ? (
                        <li className="flex items-center gap-2 border-t border-[var(--line)] pt-2 text-sm font-semibold text-[var(--heading)]">
                          <span className="text-[var(--orange)]">Avaliação</span>
                          <span>{assessment.title}</span>
                          <span className="ml-auto text-xs font-normal uppercase tracking-wide text-[var(--muted)]">
                            10 questões · {assessment.status === 'completed' ? 'Feita' : assessment.status === 'available' ? 'Liberada' : 'Bloqueada'}
                          </span>
                        </li>
                      ) : null}
                    </ol>
                  </section>
                )
              })}
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  )
}

function plain(md: string) {
  return md.replace(/[#>*`\[\]]/g, '').replace(/\n+/g, ' ').trim()
}
