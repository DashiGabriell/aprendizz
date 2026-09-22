import type { ProgressStatus } from './types'

export function isLessonComplete(
  flags: {
    mcqPassed: boolean
    freeTextSubmitted: boolean
    codePassed: boolean
  },
  options: { codeRequired?: boolean; freeTextRequired?: boolean } = {},
): boolean {
  const codeRequired = options.codeRequired ?? true
  const freeTextRequired = options.freeTextRequired ?? true
  const codeOk = codeRequired ? flags.codePassed : true
  const textOk = freeTextRequired ? flags.freeTextSubmitted : true
  return flags.mcqPassed && textOk && codeOk
}

export function nextStatusAfterCompletion(
  currentSortOrder: number,
  lessonSortOrder: number,
  previousCompleted: boolean,
): ProgressStatus {
  if (lessonSortOrder === currentSortOrder) return 'completed'
  if (lessonSortOrder === currentSortOrder + 1 && previousCompleted) return 'available'
  if (lessonSortOrder < currentSortOrder) return 'completed'
  return 'locked'
}

export function resolveInitialStatus(sortOrder: number, unlockedByDefault: boolean): ProgressStatus {
  if (unlockedByDefault || sortOrder === 1) return 'available'
  return 'locked'
}
