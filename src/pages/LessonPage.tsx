import { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ExercisePanel } from '../components/ExercisePanel'
import { InfoModal } from '../components/InfoModal'
import { LessonCompleteModal } from '../components/LessonCompleteModal'
import { Markdown } from '../components/Markdown'
import { PlayerLayout } from '../components/PlayerLayout'
import type { NeighborLesson } from '../components/PlayerFooter'
import { useAuth } from '../hooks/useAuth'
import {
  getExerciseForLesson,
  getLessonBySlug,
  getModuleForLesson,
  getNeighborLessons,
  getProgressForLesson,
  getSubmission,
  markLessonCompletedAndUnlockNext,
  upsertSubmission,
} from '../lib/progress'
import { exerciseRequiresCode, exerciseRequiresFreeText } from '../lib/exerciseParts'
import { isLessonComplete } from '../lib/unlock'
import type { Exercise, ExerciseSubmission, Lesson, ProgressStatus } from '../lib/types'

export function LessonPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [moduleTitle, setModuleTitle] = useState('')
  const [subjectTitle, setSubjectTitle] = useState('')
  const [status, setStatus] = useState<ProgressStatus>('locked')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [submission, setSubmission] = useState<ExerciseSubmission | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [blockedNextOpen, setBlockedNextOpen] = useState(false)
  const [nextLesson, setNextLesson] = useState<{ slug: string; title: string } | null>(null)
  const [neighbors, setNeighbors] = useState<{
    previous: NeighborLesson | null
    next: NeighborLesson | null
  }>({ previous: null, next: null })
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user || !slug) return
    setLoading(true)
    setCompleteOpen(false)
    setBlockedNextOpen(false)
    setNextLesson(null)
    setError(null)
    const lessonRes = await getLessonBySlug(slug)
    if (lessonRes.error || !lessonRes.data) {
      setError(lessonRes.error ?? 'Aula não encontrada')
      setLoading(false)
      return
    }
    setLesson(lessonRes.data)

    if (lessonRes.data.module_id) {
      const modRes = await getModuleForLesson(lessonRes.data.module_id)
      if (modRes.data) {
        setModuleTitle(String(modRes.data.title ?? ''))
        const subject = modRes.data.aprendizz_subjects as { title?: string } | null
        setSubjectTitle(subject?.title ?? '')
      }
    }

    const progressRes = await getProgressForLesson(user.id, lessonRes.data.id)
    setStatus(progressRes.data?.status ?? 'locked')

    const neighborsRes = await getNeighborLessons(lessonRes.data.sort_order)
    if (neighborsRes.error) setError(neighborsRes.error)
    setNeighbors({ previous: neighborsRes.previous, next: neighborsRes.next })

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
    if (!user || !lesson || !exercise) return
    if (status === 'completed') return
    if (
      !isLessonComplete(flags, {
        codeRequired: exerciseRequiresCode(exercise),
        freeTextRequired: exerciseRequiresFreeText(exercise),
      })
    ) {
      return
    }
    const result = await markLessonCompletedAndUnlockNext(user.id, lesson)
    if (result.error) setError(result.error)
    else {
      setStatus('completed')
      setNextLesson(result.nextLesson)
      setCompleteOpen(true)
    }
  }

  const isAssessment = lesson?.kind === 'assessment'

  return (
    <PlayerLayout
      activeSlug={slug}
      subjectTitle={subjectTitle}
      moduleTitle={moduleTitle}
      currentStatus={status}
      previous={neighbors.previous}
      next={neighbors.next}
      onBlockedNext={() => setBlockedNextOpen(true)}
    >
      <article className="player-lesson">
        {loading ? <p className="player-muted">Carregando…</p> : null}
        {error ? <p className="player-error">{error}</p> : null}

        {lesson && !loading ? (
          <div className="reveal-in player-lesson-body">
            <header className="player-lesson-header">
              <p className="eyebrow">{isAssessment ? 'Avaliação de módulo' : 'Aula'}</p>
              <h1>{lesson.title}</h1>
              <ul className="player-objectives">
                {lesson.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </header>

            <section className="block-panel player-content-panel">
              <h2>{isAssessment ? 'Instruções' : 'Conteúdo'}</h2>
              <Markdown content={lesson.content_md} />
            </section>

            {exercise ? (
              <ExercisePanel
                key={`${exercise.id}:${submission?.id ?? 'new'}`}
                lesson={lesson}
                exercise={exercise}
                submission={submission}
                onSave={onSave}
                onMaybeComplete={onMaybeComplete}
              />
            ) : null}
          </div>
        ) : null}
      </article>

      {completeOpen && lesson ? (
        <LessonCompleteModal
          lessonTitle={lesson.title}
          nextLesson={nextLesson}
          onClose={() => setCompleteOpen(false)}
        />
      ) : null}

      {blockedNextOpen ? (
        <InfoModal
          title={isAssessment ? 'Próxima unidade bloqueada' : 'Próxima aula bloqueada'}
          message={
            neighbors.next
              ? `Para avançar para “${neighbors.next.title}”, conclua ${
                  isAssessment ? 'esta avaliação (10 questões)' : 'o exercício desta aula'
                }.\n\nQuando for aprovado, a próxima unidade será liberada automaticamente.`
              : 'Não há próxima unidade neste currículo.'
          }
          onClose={() => setBlockedNextOpen(false)}
        />
      ) : null}
    </PlayerLayout>
  )
}
