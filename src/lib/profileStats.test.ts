import { describe, expect, it } from 'vitest'
import { computeProfileStats, initialsFrom, type LessonPerformance } from './profileStats'

function lesson(partial: Partial<LessonPerformance> & Pick<LessonPerformance, 'lessonId' | 'sortOrder'>): LessonPerformance {
  return {
    slug: 'x',
    title: 'T',
    phase: 'Fase',
    status: 'locked',
    completedAt: null,
    mcqPassed: false,
    codePassed: false,
    freeTextPassed: false,
    exerciseUpdatedAt: null,
    exerciseCreatedAt: null,
    partsPassed: 0,
    partsTotal: 3,
    scorePercent: 0,
    ...partial,
  }
}

describe('computeProfileStats', () => {
  it('computes progress and remaining', () => {
    const stats = computeProfileStats([
      lesson({
        lessonId: '1',
        sortOrder: 1,
        status: 'completed',
        partsPassed: 3,
        scorePercent: 100,
        mcqPassed: true,
        codePassed: true,
        freeTextPassed: true,
        exerciseUpdatedAt: '2026-01-02T00:00:00Z',
      }),
      lesson({ lessonId: '2', sortOrder: 2, status: 'available' }),
      lesson({ lessonId: '3', sortOrder: 3, status: 'locked' }),
    ])

    expect(stats.totalLessons).toBe(3)
    expect(stats.completed).toBe(1)
    expect(stats.remaining).toBe(2)
    expect(stats.progressPercent).toBe(33)
    expect(stats.averageLessonScore).toBe(100)
  })
})

describe('initialsFrom', () => {
  it('uses email initial or name parts', () => {
    expect(initialsFrom('gabriel@x.com')).toBe('G')
    expect(initialsFrom('Gabriel Dash')).toBe('GD')
  })
})
