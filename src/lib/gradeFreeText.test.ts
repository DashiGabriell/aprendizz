import { describe, expect, it } from 'vitest'
import { parseGradeTextPayload } from './gradeTextAgentCore'

describe('parseGradeTextPayload', () => {
  it('parses clean JSON', () => {
    expect(parseGradeTextPayload('{"passed":true,"feedback":"Bom trabalho."}')).toEqual({
      passed: true,
      feedback: 'Bom trabalho.',
    })
  })

  it('extracts JSON from surrounding text', () => {
    expect(
      parseGradeTextPayload('Aqui vai: {"passed":false,"feedback":"Faltou o ponto sobre HTTP."} fim'),
    ).toEqual({
      passed: false,
      feedback: 'Faltou o ponto sobre HTTP.',
    })
  })
})
