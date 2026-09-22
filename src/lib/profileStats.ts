export type StudentProfile = {
  user_id: string
  display_name: string
  avatar_url: string | null
  bio: string
  created_at: string
  updated_at: string
}

export type LessonPerformance = {
  lessonId: string
  slug: string
  sortOrder: number
  title: string
  phase: string
  status: 'locked' | 'available' | 'completed'
  completedAt: string | null
  mcqPassed: boolean
  codePassed: boolean
  freeTextPassed: boolean
  exerciseUpdatedAt: string | null
  exerciseCreatedAt: string | null
  partsPassed: number
  partsTotal: 3
  scorePercent: number
}

export type ProfileStats = {
  totalLessons: number
  completed: number
  available: number
  locked: number
  progressPercent: number
  remaining: number
  mcqPassedCount: number
  codePassedCount: number
  freeTextPassedCount: number
  submissionsCount: number
  averageLessonScore: number
  phasesStudied: string[]
  firstActivityAt: string | null
  lastActivityAt: string | null
  lastCompletedAt: string | null
}

export type ActivityEvent = {
  id: string
  at: string
  kind: 'completed' | 'exercise'
  title: string
  detail: string
  slug?: string
}

export function computeProfileStats(lessons: LessonPerformance[]): ProfileStats {
  const totalLessons = lessons.length
  const completed = lessons.filter((l) => l.status === 'completed').length
  const available = lessons.filter((l) => l.status === 'available').length
  const locked = lessons.filter((l) => l.status === 'locked').length
  const remaining = Math.max(totalLessons - completed, 0)
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100)

  const withExercise = lessons.filter((l) => l.exerciseUpdatedAt || l.exerciseCreatedAt)
  const mcqPassedCount = withExercise.filter((l) => l.mcqPassed).length
  const codePassedCount = withExercise.filter((l) => l.codePassed).length
  const freeTextPassedCount = withExercise.filter((l) => l.freeTextPassed).length

  const scored = lessons.filter((l) => l.status === 'completed' || l.partsPassed > 0)
  const averageLessonScore =
    scored.length === 0
      ? 0
      : Math.round(scored.reduce((acc, l) => acc + l.scorePercent, 0) / scored.length)

  const phasesStudied = [
    ...new Set(
      lessons
        .filter((l) => l.status === 'completed' || l.status === 'available' || l.partsPassed > 0)
        .map((l) => l.phase),
    ),
  ]

  const activityDates = lessons
    .flatMap((l) => [l.completedAt, l.exerciseUpdatedAt, l.exerciseCreatedAt])
    .filter((d): d is string => Boolean(d))
    .sort()

  const completedDates = lessons
    .map((l) => l.completedAt)
    .filter((d): d is string => Boolean(d))
    .sort()

  return {
    totalLessons,
    completed,
    available,
    locked,
    progressPercent,
    remaining,
    mcqPassedCount,
    codePassedCount,
    freeTextPassedCount,
    submissionsCount: withExercise.length,
    averageLessonScore,
    phasesStudied,
    firstActivityAt: activityDates[0] ?? null,
    lastActivityAt: activityDates[activityDates.length - 1] ?? null,
    lastCompletedAt: completedDates[completedDates.length - 1] ?? null,
  }
}

export function buildActivityTimeline(lessons: LessonPerformance[]): ActivityEvent[] {
  const events: ActivityEvent[] = []

  for (const lesson of lessons) {
    if (lesson.completedAt) {
      events.push({
        id: `done-${lesson.lessonId}`,
        at: lesson.completedAt,
        kind: 'completed',
        title: lesson.title,
        detail: 'Aula concluída',
        slug: lesson.slug,
      })
    }
    if (lesson.exerciseUpdatedAt || lesson.exerciseCreatedAt) {
      const parts = [
        lesson.mcqPassed ? 'MCQ ✓' : 'MCQ',
        lesson.freeTextPassed ? 'Texto ✓' : 'Texto',
        lesson.codePassed ? 'Código ✓' : 'Código',
      ].join(' · ')
      events.push({
        id: `ex-${lesson.lessonId}`,
        at: (lesson.exerciseUpdatedAt || lesson.exerciseCreatedAt) as string,
        kind: 'exercise',
        title: lesson.title,
        detail: `Exercício atualizado — ${parts}`,
        slug: lesson.slug,
      })
    }
  }

  return events.sort((a, b) => (a.at < b.at ? 1 : -1))
}

export function initialsFrom(nameOrEmail: string): string {
  const base = nameOrEmail.trim()
  if (!base) return 'A'
  if (base.includes('@')) {
    return base[0]!.toUpperCase()
  }
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
}

export function formatDatePt(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
