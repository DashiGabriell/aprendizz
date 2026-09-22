import { describe, expect, it } from 'vitest'
import { parseGradeTextPayload } from './gradeTextAgentCore'

describe('parseGradeTextPayload', () => {
  it('parses clean JSON', () => {
    expect(parseGradeTextPayload('{"passed":true,"feedback":"Bom trabalho."}')).toEqual({
      passed: true,
      feedback: 'Bom trabalho.',
    })
  })

  it('accepts string booleans', () => {
    expect(parseGradeTextPayload('{"passed":"true","feedback":"Ok"}')).toEqual({
      passed: true,
      feedback: 'Ok',
    })
  })
})
