import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import {
  buildActivityTimeline,
  computeProfileStats,
  type ActivityEvent,
  type LessonPerformance,
  type ProfileStats,
  type StudentProfile,
} from './profileStats'
import type { ExerciseSubmission, Lesson, LessonProgress, ProgressStatus } from './types'
import { resolveInitialStatus } from './unlock'
import { cacheGetOrFetch, cacheKeys, cacheSet } from './queryCache'

export type { StudentProfile, LessonPerformance, ProfileStats, ActivityEvent }

export async function ensureProfile(user: User): Promise<{ data: StudentProfile | null; error: string | null }> {
  return cacheGetOrFetch(
    cacheKeys.profile(user.id),
    async () => {
      const { data: existing, error: readError } = await supabase
        .from('aprendizz_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (readError) return { data: null, error: readError.message }
      if (existing) return { data: existing as StudentProfile, error: null }

      const meta = user.user_metadata ?? {}
      const displayName =
        (typeof meta.full_name === 'string' && meta.full_name) ||
        (typeof meta.name === 'string' && meta.name) ||
        (user.email?.split('@')[0] ?? 'Aluno')

      const { data: created, error: insertError } = await supabase
        .from('aprendizz_profiles')
        .insert({
          user_id: user.id,
          display_name: displayName,
          avatar_url: typeof meta.avatar_url === 'string' ? meta.avatar_url : null,
          bio: '',
        })
        .select('*')
        .single()

      if (insertError) {
        const { data: again, error: againError } = await supabase
          .from('aprendizz_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        if (again) return { data: again as StudentProfile, error: null }
        return { data: null, error: insertError.message || againError?.message || 'Falha ao criar perfil' }
      }

      return { data: created as StudentProfile, error: null }
    },
    { shouldCache: (r) => Boolean(r.data) && !r.error },
  )
}

export async function updateProfile(
  userId: string,
  patch: { display_name?: string; bio?: string; avatar_url?: string | null },
): Promise<{ data: StudentProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from('aprendizz_profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select('*')
    .single()

  const result = { data: data as StudentProfile | null, error: error?.message ?? null }
  if (result.data && !result.error) {
    cacheSet(cacheKeys.profile(userId), result)
  }
  return result
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage.from('aprendizz_avatars').upload(path, file, {
    upsert: true,
    contentType: file.type,
  })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from('aprendizz_avatars').getPublicUrl(path)
  const url = `${data.publicUrl}?v=${Date.now()}`
  return { url, error: null }
}

export async function loadPerformanceDashboard(userId: string): Promise<{
  lessons: LessonPerformance[]
  stats: ProfileStats
  timeline: ActivityEvent[]
  error: string | null
}> {
  const [lessonsRes, progressRes, submissionsRes] = await Promise.all([
    supabase.from('aprendizz_lessons').select('*').order('sort_order', { ascending: true }),
    supabase.from('aprendizz_lesson_progress').select('*').eq('user_id', userId),
    supabase.from('aprendizz_exercise_submissions').select('*').eq('user_id', userId),
  ])

  if (lessonsRes.error) {
    return { lessons: [], stats: computeProfileStats([]), timeline: [], error: lessonsRes.error.message }
  }
  if (progressRes.error) {
    return { lessons: [], stats: computeProfileStats([]), timeline: [], error: progressRes.error.message }
  }
  if (submissionsRes.error) {
    return { lessons: [], stats: computeProfileStats([]), timeline: [], error: submissionsRes.error.message }
  }

  const lessons = (lessonsRes.data ?? []) as Lesson[]
  const progressByLesson = new Map(
    ((progressRes.data ?? []) as LessonProgress[]).map((p) => [p.lesson_id, p]),
  )
  const submissionByLesson = new Map(
    ((submissionsRes.data ?? []) as (ExerciseSubmission & {
      created_at?: string
      updated_at?: string
    })[]).map((s) => [s.lesson_id, s]),
  )

  const performance: LessonPerformance[] = lessons.map((lesson) => {
    const progress = progressByLesson.get(lesson.id)
    const submission = submissionByLesson.get(lesson.id)
    const status = (progress?.status ??
      resolveInitialStatus(lesson.sort_order, lesson.unlocked_by_default)) as ProgressStatus

    const mcqPassed = submission?.mcq_passed ?? false
    const codePassed = submission?.code_passed ?? false
    const freeTextPassed = submission?.free_text_submitted ?? false
    const partsPassed = [mcqPassed, codePassed, freeTextPassed].filter(Boolean).length

    return {
      lessonId: lesson.id,
      slug: lesson.slug,
      sortOrder: lesson.sort_order,
      title: lesson.title,
      phase: lesson.phase,
      status,
      completedAt: progress?.completed_at ?? null,
      mcqPassed,
      codePassed,
      freeTextPassed,
      exerciseUpdatedAt: submission?.updated_at ?? null,
      exerciseCreatedAt: submission?.created_at ?? null,
      partsPassed,
      partsTotal: 3,
      scorePercent: Math.round((partsPassed / 3) * 100),
    }
  })

  return {
    lessons: performance,
    stats: computeProfileStats(performance),
    timeline: buildActivityTimeline(performance),
    error: null,
  }
}
