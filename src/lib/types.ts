export type ProgressStatus = 'locked' | 'available' | 'completed'

export type LessonKind = 'lesson' | 'assessment'

export type McqOption = {
  id: string
  label: string
}

export type McqQuestion = {
  id: string
  prompt: string
  options: McqOption[]
  correctOptionId: string
}

export type CodeTest = {
  name: string
  assert: string
}

export type Subject = {
  id: string
  slug: string
  title: string
  description_md: string
  sort_order: number
}

export type Module = {
  id: string
  subject_id: string
  slug: string
  title: string
  description_md: string
  sort_order: number
}

export type Lesson = {
  id: string
  module_id: string
  slug: string
  sort_order: number
  title: string
  /** @deprecated use module title via join; kept for display fallback */
  phase: string
  kind: LessonKind
  objectives: string[]
  content_md: string
  unlocked_by_default: boolean
}

export type Exercise = {
  id: string
  lesson_id: string
  mcq: McqQuestion[]
  free_text_prompt: string
  code_prompt: string
  starter_code: string
  tests: CodeTest[]
}

export type LessonProgress = {
  id: string
  user_id: string
  lesson_id: string
  status: ProgressStatus
  completed_at: string | null
}

export type ExerciseSubmission = {
  id: string
  user_id: string
  exercise_id: string
  lesson_id: string
  mcq_answers: Record<string, string>
  free_text_answer: string
  code_answer: string
  mcq_passed: boolean
  code_passed: boolean
  free_text_submitted: boolean
  free_text_feedback: string
  created_at?: string
  updated_at?: string
}

export type FreeTextGradeResult = {
  passed: boolean
  feedback: string
}

export type LessonWithProgress = Lesson & {
  status: ProgressStatus
  moduleTitle?: string
  moduleSlug?: string
  subjectTitle?: string
  subjectSlug?: string
}

export type CurriculumTree = {
  subject: Subject
  modules: Array<{
    module: Module
    lessons: LessonWithProgress[]
  }>
}

/** Course card for the LMS home catalog (backed by `aprendizz_subjects`). */
export type CourseSummary = {
  id: string
  slug: string
  title: string
  description_md: string
  sort_order: number
  lessonCount: number
  completedCount: number
  continueSlug: string | null
  progressLabel: 'Não iniciado' | 'Em andamento' | 'Concluído'
}
