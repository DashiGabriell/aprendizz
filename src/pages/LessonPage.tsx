import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ExercisePanel } from '../components/ExercisePanel'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'
import { useAuth } from '../hooks/useAuth'
import {
  getExerciseForLesson,
  getLessonBySlug,
  getProgressForLesson,
  getSubmission,
  markLessonCompletedAndUnlockNext,
  upsertSubmission,
} from '../lib/progress'
import { isLessonComplete } from '../lib/unlock'
import type { Exercise, ExerciseSubmission, Lesson, ProgressStatus } from '../lib/types'

export function LessonPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [status, setStatus] = useState<ProgressStatus>('locked')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [submission, setSubmission] = useState<ExerciseSubmission | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [doneBanner, setDoneBanner] = useState(false)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user || !slug) return
    setLoading(true)
    const lessonRes = await getLessonBySlug(slug)
    if (lessonRes.error || !lessonRes.data) {
      setError(lessonRes.error ?? 'Aula não encontrada')
      setLoading(false)
      return
    }
    setLesson(lessonRes.data)

    const progressRes = await getProgressForLesson(user.id, lessonRes.data.id)
    setStatus(progressRes.data?.status ?? 'locked')

    const exerciseRes = await getExerciseForLesson(lessonRes.data.id)
    if (exerciseRes.error || !exerciseRes.data) {
      setError(exerciseRes.error ?? 'Exercício não encontrado')
      setLoading(false)
      return
    }
    setExercise(exerciseRes.data)

    const subRes = await getSubmission(user.id, exerciseRes.data.id)
    setSubmission(subRes.data)
    setLoading(false)
  }, [user, slug])

  useEffect(() => {
    void reload()
  }, [reload])

  if (!loading && status === 'locked') {
    return <Navigate to="/" replace />
  }

  async function onSave(patch: Partial<ExerciseSubmission>) {
    if (!user || !exercise || !lesson) return
    const result = await upsertSubmission({
      userId: user.id,
      exerciseId: exercise.id,
      lessonId: lesson.id,
      current: submission,
      patch,
    })
    if (result.error) setError(result.error)
    else setSubmission(result.data)
  }

  async function onMaybeComplete(flags: {
    mcqPassed: boolean
    freeTextSubmitted: boolean
    codePassed: boolean
  }) {
    if (!user || !lesson) return
    if (!isLessonComplete(flags)) return
    const result = await markLessonCompletedAndUnlockNext(user.id, lesson)
    if (result.error) setError(result.error)
    else {
      setStatus('completed')
      setDoneBanner(true)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="text-sm font-semibold text-[var(--royal)] no-underline">
          ← Voltar ao roadmap
        </Link>
      </div>

      {loading ? <p className="text-[var(--muted)]">Carregando…</p> : null}
      {error ? (
        <p className="mb-4 text-sm" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      ) : null}

      {lesson ? (
        <div className="reveal-in space-y-8">
          <header>
            <p className="eyebrow">{lesson.phase}</p>
            <h1 className="mb-3 text-3xl sm:text-4xl">{lesson.title}</h1>
            <ul className="list-disc space-y-1 pl-5 text-[var(--muted)]">
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </header>

          {doneBanner ? (
            <div className="block-panel border-[rgba(255,90,0,0.4)]">
              <p className="font-semibold text-[var(--heading)]">Aula concluída.</p>
              <p className="text-sm text-[var(--muted)]">A próxima aula foi liberada no roadmap.</p>
            </div>
          ) : null}

          <section className="block-panel">
            <h2 className="mb-4 text-xl">Conteúdo</h2>
            <Markdown content={lesson.content_md} />
          </section>

          {exercise ? (
            <ExercisePanel
              exercise={exercise}
              submission={submission}
              onSave={onSave}
              onMaybeComplete={onMaybeComplete}
            />
          ) : null}
        </div>
      ) : null}
    </Layout>
  )
}
