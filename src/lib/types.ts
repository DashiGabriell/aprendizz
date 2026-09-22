export type ProgressStatus = 'locked' | 'available' | 'completed'

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
  // Expression evaluated in sandbox; must return true
  assert: string
}

export type Lesson = {
  id: string
  slug: string
  sort_order: number
  title: string
  phase: string
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
}

export type LessonWithProgress = Lesson & {
  status: ProgressStatus
}
