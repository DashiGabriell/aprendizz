import { describe, expect, it } from 'vitest'
import { gradeMcq } from './gradeMcq'
import { isLessonComplete, resolveInitialStatus } from './unlock'

describe('gradeMcq', () => {
  const questions = [
    {
      id: 'q1',
      prompt: 'HTTP GET?',
      options: [
        { id: 'a', label: 'Read' },
        { id: 'b', label: 'Delete' },
      ],
      correctOptionId: 'a',
    },
    {
      id: 'q2',
      prompt: '404?',
      options: [
        { id: 'a', label: 'Not found' },
        { id: 'b', label: 'OK' },
      ],
      correctOptionId: 'a',
    },
  ]

  it('passes only at 100%', () => {
    expect(gradeMcq(questions, { q1: 'a', q2: 'a' }).passed).toBe(true)
    expect(gradeMcq(questions, { q1: 'a', q2: 'b' }).passed).toBe(false)
  })
})

describe('unlock', () => {
  it('marks first lesson available', () => {
    expect(resolveInitialStatus(1, true)).toBe('available')
    expect(resolveInitialStatus(2, false)).toBe('locked')
  })

  it('requires all three exercise flags', () => {
    expect(
      isLessonComplete({ mcqPassed: true, freeTextSubmitted: true, codePassed: true }),
    ).toBe(true)
    expect(
      isLessonComplete({ mcqPassed: true, freeTextSubmitted: true, codePassed: false }),
    ).toBe(false)
  })
})
