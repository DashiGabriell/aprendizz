import type {
  CourseSummary,
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
import { ensureAuthSession, supabase } from './supabase'
import {
  cacheGet,
  cacheGetOrFetch,
  cacheKeys,
  cacheSet,
  invalidateUserProgressViews,
} from './queryCache'

type Result<T> = { data: T; error: string | null }

const okResult = <T extends { error: string | null }>(value: T) => !value.error

/** Sync peek for instant UI when data was already loaded this session. */
export function peekCourses(userId: string): CourseSummary[] | null {
  const hit = cacheGet<Result<CourseSummary[]>>(cacheKeys.courses(userId))
  return hit && !hit.error ? hit.data : null
}

export function peekCurriculumTree(userId: string, courseSlug?: string): CurriculumTree | null {
  const key = courseSlug ? cacheKeys.tree(userId, courseSlug) : cacheKeys.treeDefault(userId)
  const hit = cacheGet<{ data: CurriculumTree | null; error: string | null }>(key)
  return hit && !hit.error ? hit.data : null
}

async function fetchCoursesWithProgress(userId: string): Promise<Result<CourseSummary[]>> {
  const { data: subjects, error: subjectError } = await supabase
    .from('aprendizz_subjects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (subjectError) return { data: [], error: subjectError.message }
  const subjectList = (subjects as Subject[]) ?? []
  if (subjectList.length === 0) return { data: [], error: 'Nenhum curso cadastrado. Rode o seed.' }

  const { data: modules, error: modulesError } = await supabase
    .from('aprendizz_modules')
    .select('id, subject_id')

  if (modulesError) return { data: [], error: modulesError.message }

  const { data: lessons, error: lessonsError } = await supabase
    .from('aprendizz_lessons')
    .select('id, module_id, slug, sort_order, unlocked_by_default')
    .order('sort_order', { ascending: true })

  if (lessonsError) return { data: [], error: lessonsError.message }

  const { data: progress, error: progressError } = await supabase
    .from('aprendizz_lesson_progress')
    .select('lesson_id, status')
    .eq('user_id', userId)

  if (progressError) return { data: [], error: progressError.message }

  const byLesson = new Map(
    ((progress as Array<{ lesson_id: string; status: ProgressStatus }>) ?? []).map((p) => [
      p.lesson_id,
      p.status,
    ]),
  )
  const modulesBySubject = new Map<string, string[]>()
  for (const mod of (modules as Array<{ id: string; subject_id: string }>) ?? []) {
    const list = modulesBySubject.get(mod.subject_id) ?? []
    list.push(mod.id)
    modulesBySubject.set(mod.subject_id, list)
  }

  const lessonList =
    (lessons as Array<{
      id: string
      module_id: string
      slug: string
      sort_order: number
      unlocked_by_default: boolean
    }>) ?? []

  const courses: CourseSummary[] = subjectList.map((subject) => {
    const moduleIds = new Set(modulesBySubject.get(subject.id) ?? [])
    const courseLessons = lessonList.filter((l) => moduleIds.has(l.module_id))
    const withStatus = courseLessons.map((lesson) => ({
      ...lesson,
      status: (byLesson.get(lesson.id) ??
        resolveInitialStatus(lesson.sort_order, lesson.unlocked_by_default)) as ProgressStatus,
    }))
    const completedCount = withStatus.filter((l) => l.status === 'completed').length
    const continueLesson =
      withStatus.find((l) => l.status === 'available') ??
      withStatus.find((l) => l.status === 'completed') ??
      null

    let progressLabel: CourseSummary['progressLabel'] = 'Não iniciado'
    if (withStatus.length > 0 && completedCount === withStatus.length) {
      progressLabel = 'Concluído'
    } else if (completedCount > 0) {
      progressLabel = 'Em andamento'
    }

    return {
      id: subject.id,
      slug: subject.slug,
      title: subject.title,
      description_md: subject.description_md,
      sort_order: subject.sort_order,
      lessonCount: withStatus.length,
      completedCount,
      continueSlug: continueLesson?.slug ?? null,
      progressLabel,
    }
  })

  return { data: courses, error: null }
}

export async function listCoursesWithProgress(userId: string): Promise<Result<CourseSummary[]>> {
  return cacheGetOrFetch(cacheKeys.courses(userId), () => fetchCoursesWithProgress(userId), {
    shouldCache: okResult,
  })
}

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

async function fetchCurriculumTree(
  userId: string,
  courseSlug?: string,
): Promise<{ data: CurriculumTree | null; error: string | null }> {
  const subjectRes = courseSlug
    ? await supabase.from('aprendizz_subjects').select('*').eq('slug', courseSlug).maybeSingle()
    : await supabase
        .from('aprendizz_subjects')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle()

  if (subjectRes.error) return { data: null, error: subjectRes.error.message }
  const subject = subjectRes.data as Subject | null
  if (!subject) {
    return {
      data: null,
      error: courseSlug ? `Curso "${courseSlug}" não encontrado.` : 'Nenhum curso cadastrado. Rode o seed.',
    }
  }

  const { data: modules, error: modulesError } = await supabase
    .from('aprendizz_modules')
    .select('*')
    .eq('subject_id', subject.id)
    .order('sort_order', { ascending: true })

  if (modulesError) return { data: null, error: modulesError.message }

  const moduleList = (modules as Module[]) ?? []
  const moduleIds = moduleList.map((m) => m.id)

  let lessonList: Lesson[] = []
  if (moduleIds.length > 0) {
    const { data: lessons, error: lessonsError } = await supabase
      .from('aprendizz_lessons')
      .select('*')
      .in('module_id', moduleIds)
      .order('sort_order', { ascending: true })

    if (lessonsError) return { data: null, error: lessonsError.message }
    lessonList = (lessons as Lesson[]) ?? []
  }

  const { data: progress, error: progressError } = await supabase
    .from('aprendizz_lesson_progress')
    .select('*')
    .eq('user_id', userId)

  if (progressError) return { data: null, error: progressError.message }

  const byLesson = new Map((progress as LessonProgress[]).map((p) => [p.lesson_id, p.status]))

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

export async function loadCurriculumTree(
  userId: string,
  courseSlug?: string,
): Promise<{
  data: CurriculumTree | null
  error: string | null
}> {
  const key = courseSlug ? cacheKeys.tree(userId, courseSlug) : cacheKeys.treeDefault(userId)
  return cacheGetOrFetch(key, () => fetchCurriculumTree(userId, courseSlug), { shouldCache: okResult })
}

export async function ensureProgressRows(userId: string): Promise<{ error: string | null }> {
  const auth = await ensureAuthSession()
  if (!auth.session) {
    return { error: auth.error ?? 'Sessão expirada. Faça login novamente.' }
  }

  return cacheGetOrFetch(
    cacheKeys.progressEnsured(userId),
    async () => {
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
    },
    { shouldCache: okResult },
  )
}

export async function getLessonBySlug(slug: string) {
  return cacheGetOrFetch(
    cacheKeys.lesson(slug),
    async () => {
      const { data, error } = await supabase.from('aprendizz_lessons').select('*').eq('slug', slug).maybeSingle()
      return { data: data as Lesson | null, error: error?.message ?? null }
    },
    { shouldCache: okResult },
  )
}

export async function getNeighborLessons(sortOrder: number): Promise<{
  previous: { slug: string; title: string; sort_order: number; kind?: string } | null
  next: { slug: string; title: string; sort_order: number; kind?: string } | null
  error: string | null
}> {
  return cacheGetOrFetch(
    cacheKeys.neighbors(sortOrder),
    async () => {
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
    },
    { shouldCache: okResult },
  )
}

export async function getProgressForLesson(userId: string, lessonId: string) {
  return cacheGetOrFetch(
    cacheKeys.lessonProgress(userId, lessonId),
    async () => {
      const { data, error } = await supabase
        .from('aprendizz_lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .maybeSingle()
      return { data: data as LessonProgress | null, error: error?.message ?? null }
    },
    { shouldCache: okResult },
  )
}

export async function getExerciseForLesson(lessonId: string) {
  return cacheGetOrFetch(
    cacheKeys.exercise(lessonId),
    async () => {
      const { data, error } = await supabase
        .from('aprendizz_exercises')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle()
      return { data: data as Exercise | null, error: error?.message ?? null }
    },
    { shouldCache: okResult },
  )
}

export async function getSubmission(userId: string, exerciseId: string) {
  return cacheGetOrFetch(
    cacheKeys.submission(userId, exerciseId),
    async () => {
      const { data, error } = await supabase
        .from('aprendizz_exercise_submissions')
        .select('*')
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .maybeSingle()
      return { data: data as ExerciseSubmission | null, error: error?.message ?? null }
    },
    { shouldCache: okResult },
  )
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

  const result = { data: data as ExerciseSubmission | null, error: error?.message ?? null }
  if (result.data && !result.error) {
    cacheSet(cacheKeys.submission(args.userId, args.exerciseId), result)
  }
  return result
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

  if (nextError) {
    invalidateUserProgressViews(userId)
    return { error: nextError.message, nextLesson: null }
  }
  if (!nextLesson) {
    invalidateUserProgressViews(userId)
    return { error: null, nextLesson: null }
  }

  const { error: unlockError } = await supabase
    .from('aprendizz_lesson_progress')
    .update({ status: 'available', updated_at: now })
    .eq('user_id', userId)
    .eq('lesson_id', nextLesson.id)
    .eq('status', 'locked')

  invalidateUserProgressViews(userId)

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
  return cacheGetOrFetch(
    cacheKeys.module(moduleId),
    async () => {
      const { data, error } = await supabase
        .from('aprendizz_modules')
        .select('*, aprendizz_subjects(*)')
        .eq('id', moduleId)
        .maybeSingle()
      return { data, error: error?.message ?? null }
    },
    { shouldCache: okResult },
  )
}
