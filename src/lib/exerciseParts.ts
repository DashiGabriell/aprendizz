import type { Exercise } from './types'

/** Code part only when the exercise includes runnable tests. */
export function exerciseRequiresCode(exercise: Pick<Exercise, 'code_prompt' | 'tests'>): boolean {
  return exercise.tests.length > 0 && exercise.code_prompt.trim().length > 0
}

/** Free-text part only when a prompt exists (assessments may be MCQ-only). */
export function exerciseRequiresFreeText(exercise: Pick<Exercise, 'free_text_prompt'>): boolean {
  return exercise.free_text_prompt.trim().length > 0
}
