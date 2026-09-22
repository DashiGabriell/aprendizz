import { supabase } from './supabase'
import type {
  Exercise,
  ExerciseSubmission,
  Lesson,
  LessonProgress,
  LessonWithProgress,
  ProgressStatus,
} from './types'
import { resolveInitialStatus } from './unlock'

export async function listLessonsWithProgress(userId: string): Promise<{
  data: LessonWithProgress[]
  error: string | null
}> {
  const { data: lessons, error: lessonsError } = await supabase
    .from('aprendizz_lessons')
    .select('*')
    .order('sort_order', { ascending: true })

  if (lessonsError) return { data: [], error: lessonsError.message }

  const { data: progress, error: progressError } = await supabase
    .from('aprendizz_lesson_progress')
    .select('*')
    .eq('user_id', userId)

  if (progressError) return { data: [], error: progressError.message }

  const byLesson = new Map((progress as LessonProgress[]).map((p) => [p.lesson_id, p.status]))

  return {
    data: (lessons as Lesson[]).map((lesson) => ({
      ...lesson,
      status: (byLesson.get(lesson.id) ??
        resolveInitialStatus(lesson.sort_order, lesson.unlocked_by_default)) as ProgressStatus,
    })),
    error: null,
  }
}

export async function ensureProgressRows(userId: string): Promise<{ error: string | null }> {
  const { data: lessons, error: lessonsError } = await supabase
    .from('aprendizz_lessons')
    .select('id, sort_order, unlocked_by_default')
    .order('sort_order', { ascending: true })

  if (lessonsError) return { error: lessonsError.message }
  if (!lessons?.length) return { error: 'Nenhuma aula encontrada. Aplique o seed SQL.' }

  const { data: existing, error: existingError } = await supabase
    .from('aprendizz_lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)

  if (existingError) return { error: existingError.message }

  const have = new Set((existing ?? []).map((r) => r.lesson_id as string))
  const missing = lessons
    .filter((l) => !have.has(l.id as string))
    .map((l) => ({
      user_id: userId,
      lesson_id: l.id,
      status: resolveInitialStatus(l.sort_order as number, l.unlocked_by_default as boolean),
    }))

  if (missing.length === 0) return { error: null }

  const { error } = await supabase.from('aprendizz_lesson_progress').insert(missing)
  return { error: error?.message ?? null }
}

export async function getLessonBySlug(slug: string) {
  const { data, error } = await supabase.from('aprendizz_lessons').select('*').eq('slug', slug).maybeSingle()
  return { data: data as Lesson | null, error: error?.message ?? null }
}

export async function getProgressForLesson(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('aprendizz_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle()
  return { data: data as LessonProgress | null, error: error?.message ?? null }
}

export async function getExerciseForLesson(lessonId: string) {
  const { data, error } = await supabase
    .from('aprendizz_exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle()
  return { data: data as Exercise | null, error: error?.message ?? null }
}

export async function getSubmission(userId: string, exerciseId: string) {
  const { data, error } = await supabase
    .from('aprendizz_exercise_submissions')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .maybeSingle()
  return { data: data as ExerciseSubmission | null, error: error?.message ?? null }
}

export async function upsertSubmission(args: {
  userId: string
  exerciseId: string
  lessonId: string
  current: ExerciseSubmission | null
  patch: Partial<ExerciseSubmission>
}) {
  const payload = {
    user_id: args.userId,
    exercise_id: args.exerciseId,
    lesson_id: args.lessonId,
    mcq_answers: args.patch.mcq_answers ?? args.current?.mcq_answers ?? {},
    free_text_answer: args.patch.free_text_answer ?? args.current?.free_text_answer ?? '',
    code_answer: args.patch.code_answer ?? args.current?.code_answer ?? '',
    mcq_passed: args.patch.mcq_passed ?? args.current?.mcq_passed ?? false,
    code_passed: args.patch.code_passed ?? args.current?.code_passed ?? false,
    free_text_submitted: args.patch.free_text_submitted ?? args.current?.free_text_submitted ?? false,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('aprendizz_exercise_submissions')
    .upsert(payload, { onConflict: 'user_id,exercise_id' })
    .select('*')
    .single()

  return { data: data as ExerciseSubmission | null, error: error?.message ?? null }
}

export async function markLessonCompletedAndUnlockNext(userId: string, lesson: Lesson) {
  const now = new Date().toISOString()
  const { error: completeError } = await supabase
    .from('aprendizz_lesson_progress')
    .update({ status: 'completed', completed_at: now, updated_at: now })
    .eq('user_id', userId)
    .eq('lesson_id', lesson.id)

  if (completeError) return { error: completeError.message }

  const { data: nextLesson, error: nextError } = await supabase
    .from('aprendizz_lessons')
    .select('id')
    .eq('sort_order', lesson.sort_order + 1)
    .maybeSingle()

  if (nextError) return { error: nextError.message }
  if (!nextLesson) return { error: null }

  const { error: unlockError } = await supabase
    .from('aprendizz_lesson_progress')
    .update({ status: 'available', updated_at: now })
    .eq('user_id', userId)
    .eq('lesson_id', nextLesson.id)
    .eq('status', 'locked')

  return { error: unlockError?.message ?? null }
}
