import type {
  CurriculumTree,
  Exercise,
  ExerciseSubmission,
  Lesson,
  LessonProgress,
  LessonWithProgress,
  Module,
  ProgressStatus,
  Subject,
} from './types'
import { resolveInitialStatus } from './unlock'
import { supabase } from './supabase'

export async function listLessonsWithProgress(userId: string): Promise<{
  data: LessonWithProgress[]
  error: string | null
}> {
  const tree = await loadCurriculumTree(userId)
  if (tree.error || !tree.data) return { data: [], error: tree.error }
  return {
    data: tree.data.modules.flatMap((m) => m.lessons),
    error: null,
  }
}

export async function loadCurriculumTree(userId: string): Promise<{
  data: CurriculumTree | null
  error: string | null
}> {
  const { data: subjects, error: subjectError } = await supabase
    .from('aprendizz_subjects')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(1)

  if (subjectError) return { data: null, error: subjectError.message }
  const subject = (subjects?.[0] as Subject | undefined) ?? null
  if (!subject) return { data: null, error: 'Nenhuma matéria cadastrada. Rode o seed.' }

  const { data: modules, error: modulesError } = await supabase
    .from('aprendizz_modules')
    .select('*')
    .eq('subject_id', subject.id)
    .order('sort_order', { ascending: true })

  if (modulesError) return { data: null, error: modulesError.message }

  const { data: lessons, error: lessonsError } = await supabase
    .from('aprendizz_lessons')
    .select('*')
    .order('sort_order', { ascending: true })

  if (lessonsError) return { data: null, error: lessonsError.message }

  const { data: progress, error: progressError } = await supabase
    .from('aprendizz_lesson_progress')
    .select('*')
    .eq('user_id', userId)

  if (progressError) return { data: null, error: progressError.message }

  const byLesson = new Map((progress as LessonProgress[]).map((p) => [p.lesson_id, p.status]))
  const moduleList = (modules as Module[]) ?? []
  const lessonList = (lessons as Lesson[]) ?? []

  return {
    data: {
      subject,
      modules: moduleList.map((mod) => ({
        module: mod,
        lessons: lessonList
          .filter((l) => l.module_id === mod.id)
          .map((lesson) => ({
            ...lesson,
            status: (byLesson.get(lesson.id) ??
              resolveInitialStatus(lesson.sort_order, lesson.unlocked_by_default)) as ProgressStatus,
            moduleTitle: mod.title,
            moduleSlug: mod.slug,
            subjectTitle: subject.title,
            subjectSlug: subject.slug,
          })),
      })),
    },
    error: null,
  }
}

export async function ensureProgressRows(userId: string): Promise<{ error: string | null }> {
  const { data: lessons, error: lessonsError } = await supabase
    .from('aprendizz_lessons')
    .select('id, sort_order, unlocked_by_default')
    .order('sort_order', { ascending: true })

  if (lessonsError) return { error: lessonsError.message }
  if (!lessons?.length) return { error: 'Nenhuma aula encontrada. Aplique o seed.' }

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

export async function getNeighborLessons(sortOrder: number): Promise<{
  previous: { slug: string; title: string; sort_order: number; kind?: string } | null
  next: { slug: string; title: string; sort_order: number; kind?: string } | null
  error: string | null
}> {
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from('aprendizz_lessons')
      .select('slug, title, sort_order, kind')
      .eq('sort_order', sortOrder - 1)
      .maybeSingle(),
    supabase
      .from('aprendizz_lessons')
      .select('slug, title, sort_order, kind')
      .eq('sort_order', sortOrder + 1)
      .maybeSingle(),
  ])

  if (prevRes.error) return { previous: null, next: null, error: prevRes.error.message }
  if (nextRes.error) return { previous: null, next: null, error: nextRes.error.message }

  return {
    previous: prevRes.data as { slug: string; title: string; sort_order: number; kind?: string } | null,
    next: nextRes.data as { slug: string; title: string; sort_order: number; kind?: string } | null,
    error: null,
  }
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
    free_text_feedback: args.patch.free_text_feedback ?? args.current?.free_text_feedback ?? '',
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

  if (completeError) return { error: completeError.message, nextLesson: null }

  const { data: nextLesson, error: nextError } = await supabase
    .from('aprendizz_lessons')
    .select('id, slug, title, kind')
    .eq('sort_order', lesson.sort_order + 1)
    .maybeSingle()

  if (nextError) return { error: nextError.message, nextLesson: null }
  if (!nextLesson) return { error: null, nextLesson: null }

  const { error: unlockError } = await supabase
    .from('aprendizz_lesson_progress')
    .update({ status: 'available', updated_at: now })
    .eq('user_id', userId)
    .eq('lesson_id', nextLesson.id)
    .eq('status', 'locked')

  return {
    error: unlockError?.message ?? null,
    nextLesson: {
      slug: nextLesson.slug as string,
      title: nextLesson.title as string,
      kind: nextLesson.kind as string,
    },
  }
}

export async function getModuleForLesson(moduleId: string) {
  const { data, error } = await supabase
    .from('aprendizz_modules')
    .select('*, aprendizz_subjects(*)')
    .eq('id', moduleId)
    .maybeSingle()
  return { data, error: error?.message ?? null }
}
