/**
 * Exports full curriculum (lessons + exercises) to a reviewable Markdown file.
 * Usage: node scripts/export-curriculum-md.mjs
 */
import { writeFileSync } from 'node:fs'
import { curriculumData } from './curriculum-data.mjs'
import { withLessonDiagram } from './lesson-diagrams.mjs'

const { subject, modules } = curriculumData
const lines = []

function push(...parts) {
  for (const part of parts) lines.push(part)
}

push('# Conteúdo completo das aulas — Aprendizz')
push('')
push('> Documento gerado a partir do currículo oficial do LMS para avaliação pedagógica.')
push(`> Curso: **${subject.title}** (\`${subject.slug}\`)`)
push('')
push('## Sumário')
push('')

let unitNumber = 0
for (const mod of modules) {
  push(`- **Módulo ${mod.sort_order}:** ${mod.title}`)
  for (const lesson of mod.lessons) {
    unitNumber += 1
    const label = lesson.kind === 'assessment' ? 'Avaliação' : 'Aula'
    push(`  - ${unitNumber}. [${label}: ${lesson.title}](#${lesson.slug})`)
  }
}

push('')
push('---')
push('')
push(`# Curso: ${subject.title}`)
push('')
push(subject.description_md.trim())
push('')

unitNumber = 0
for (const mod of modules) {
  push('---')
  push('')
  push(`# Módulo ${mod.sort_order}: ${mod.title}`)
  push('')
  push(`*${(mod.description_md || '').trim()}*`)
  push('')

  for (const lesson of mod.lessons) {
    unitNumber += 1
    const kindLabel = lesson.kind === 'assessment' ? 'Avaliação' : 'Aula'

    push(`<a id="${lesson.slug}"></a>`)
    push('')
    push(`## ${unitNumber}. ${kindLabel}: ${lesson.title}`)
    push('')
    push(`- **Slug:** \`${lesson.slug}\``)
    push(`- **Tipo:** ${kindLabel.toLowerCase()}`)
    if (lesson.unlocked_by_default) push('- **Liberada por padrão:** sim')
    push('')

    if (lesson.objectives?.length) {
      push('### Objetivos de aprendizagem')
      push('')
      for (const objective of lesson.objectives) push(`- ${objective}`)
      push('')
    }

    push('### Conteúdo')
    push('')
    push(withLessonDiagram(lesson.slug, lesson.content_md).trim())
    push('')

    const hasMcq = Array.isArray(lesson.mcq) && lesson.mcq.length > 0
    const hasText = Boolean(lesson.free_text_prompt?.trim())
    const hasCode = Boolean(lesson.code_prompt?.trim() || lesson.starter_code?.trim())

    if (hasMcq || hasText || hasCode) {
      push('### Exercícios')
      push('')
    }

    if (hasMcq) {
      push('#### Múltipla escolha')
      push('')
      lesson.mcq.forEach((question, index) => {
        push(`**Q${index + 1}.** ${question.prompt}`)
        push('')
        for (const option of question.options) {
          const mark = option.id === question.correctOptionId ? ' ✅ **(gabarito)**' : ''
          push(`- (${option.id}) ${option.label}${mark}`)
        }
        push('')
      })
    }

    if (hasText) {
      push('#### Questão de texto livre')
      push('')
      push(lesson.free_text_prompt.trim())
      push('')
      push('> Corrigida por agente de IA (pass/fail + feedback pedagógico).')
      push('')
    }

    if (hasCode) {
      push('#### Exercício de código')
      push('')
      if (lesson.code_prompt?.trim()) {
        push(lesson.code_prompt.trim())
        push('')
      }
      if (lesson.starter_code?.trim()) {
        push('**Código inicial:**')
        push('')
        push('```ts')
        push(lesson.starter_code.trim())
        push('```')
        push('')
      }
      if (Array.isArray(lesson.tests) && lesson.tests.length > 0) {
        push('**Testes automatizados:**')
        push('')
        for (const test of lesson.tests) {
          const name = test.name || test.id || 'teste'
          push(`- \`${name}\`${test.description ? ` — ${test.description}` : ''}`)
          if (test.code) {
            push('')
            push('```ts')
            push(String(test.code).trim())
            push('```')
          }
        }
        push('')
      }
    }

    push('')
  }
}

push('---')
push('')
push(`_Fim do documento. Total de unidades: ${unitNumber}._`)
push('')

const outPath = 'conteudo-aulas-backend-empregavel.md'
writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log(`Wrote ${outPath} (${unitNumber} units, ${lines.length} lines)`)
