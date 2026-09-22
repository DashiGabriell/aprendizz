import type { ProgressStatus } from './types'

export function isLessonComplete(flags: {
  mcqPassed: boolean
  freeTextSubmitted: boolean
  codePassed: boolean
}): boolean {
  return flags.mcqPassed && flags.freeTextSubmitted && flags.codePassed
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
