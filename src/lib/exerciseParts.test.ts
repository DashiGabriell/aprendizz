import { describe, expect, it } from 'vitest'
import { exerciseRequiresCode, exerciseRequiresFreeText } from './exerciseParts'
import { isLessonComplete } from './unlock'

describe('exerciseRequiresCode', () => {
  it('is false when there are no tests or no prompt', () => {
    expect(exerciseRequiresCode({ code_prompt: '', tests: [] })).toBe(false)
    expect(exerciseRequiresCode({ code_prompt: 'Implemente X', tests: [] })).toBe(false)
    expect(exerciseRequiresCode({ code_prompt: '  ', tests: [{ name: 't', assert: 'true' }] })).toBe(
      false,
    )
  })

  it('is true when prompt and tests exist', () => {
    expect(
      exerciseRequiresCode({
        code_prompt: 'Implemente sum',
        tests: [{ name: 'ok', assert: 'sum(1,1)===2' }],
      }),
    ).toBe(true)
  })
})

describe('exerciseRequiresFreeText', () => {
  it('depends on prompt presence', () => {
    expect(exerciseRequiresFreeText({ free_text_prompt: '' })).toBe(false)
    expect(exerciseRequiresFreeText({ free_text_prompt: 'Explique X' })).toBe(true)
  })
})

describe('isLessonComplete with optional parts', () => {
  it('ignores code when not required', () => {
    expect(
      isLessonComplete(
        { mcqPassed: true, freeTextSubmitted: true, codePassed: false },
        { codeRequired: false },
      ),
    ).toBe(true)
  })

  it('ignores free text when not required (assessment)', () => {
    expect(
      isLessonComplete(
        { mcqPassed: true, freeTextSubmitted: false, codePassed: false },
        { codeRequired: false, freeTextRequired: false },
      ),
    ).toBe(true)
  })

  it('still requires code when required', () => {
    expect(
      isLessonComplete(
        { mcqPassed: true, freeTextSubmitted: true, codePassed: false },
        { codeRequired: true },
      ),
    ).toBe(false)
  })
})
