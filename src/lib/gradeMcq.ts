import type { McqQuestion } from './types'

export function gradeMcq(
  questions: McqQuestion[],
  answers: Record<string, string>,
): { passed: boolean; correctCount: number; total: number } {
  const total = questions.length
  if (total === 0) return { passed: true, correctCount: 0, total: 0 }

  let correctCount = 0
  for (const q of questions) {
    if (answers[q.id] === q.correctOptionId) correctCount += 1
  }

  return {
    passed: correctCount === total,
    correctCount,
    total,
  }
}
