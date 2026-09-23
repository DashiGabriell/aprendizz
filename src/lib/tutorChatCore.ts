/** Shared tutor prompt helpers (client-safe: no secrets). */

export type TutorChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type TutorChatInput = {
  lessonTitle: string
  objectives: string[]
  contentMd: string
  messages: TutorChatMessage[]
  question: string
}

const MAX_CONTENT_CHARS = 8_000
const MAX_HISTORY = 8

export function truncateLessonContent(contentMd: string): string {
  const trimmed = contentMd.trim()
  if (trimmed.length <= MAX_CONTENT_CHARS) return trimmed
  return `${trimmed.slice(0, MAX_CONTENT_CHARS)}\n\n[…conteúdo da aula truncado para o contexto do tutor…]`
}

export function buildTutorSystemPrompt(input: {
  lessonTitle: string
  objectives: string[]
  contentMd: string
}): string {
  const objectives =
    input.objectives.length > 0
      ? input.objectives.map((o) => `- ${o}`).join('\n')
      : '- (não informados)'

  return `Você é Joseph, o Professor Aprendizz — tutor 24h de um LMS de Backend (Node.js + TypeScript).

Missão:
- Tirar dúvidas **somente sobre o tema e o conteúdo desta aula**.
- Orientar com clareza pedagógica, exemplos curtos e analogias quando ajudar.
- Se a pergunta fugir do tema da aula, diga isso com educação e reconduza ao conteúdo atual (pode sugerir o que estudar nesta aula).
- Pode se apresentar como Joseph quando fizer sentido.

Regras rígidas:
- NÃO entregue gabarito de exercícios (MCQ, texto livre ou código).
- NÃO resolva o exercício pelo aluno. Pode dar pistas, perguntas-guia e apontar trechos do conteúdo.
- NÃO invente fatos fora do material; se algo não estiver na aula, diga que a aula não cobre isso e oriente com o que ela cobre.
- Responda em português do Brasil, de forma direta (curto a médio), sem enrolação.
- Use Markdown leve quando ajudar (listas, negrito, blocos de código).
- Não peça dados pessoais nem chaves de API.

Aula atual: ${input.lessonTitle}

Objetivos:
${objectives}

Conteúdo da aula (contexto oficial):
---
${truncateLessonContent(input.contentMd)}
---`
}

export function buildTutorMessages(input: TutorChatInput): Array<{ role: string; content: string }> {
  const history = input.messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.trim() }))

  return [
    {
      role: 'system',
      content: buildTutorSystemPrompt({
        lessonTitle: input.lessonTitle,
        objectives: input.objectives,
        contentMd: input.contentMd,
      }),
    },
    ...history,
    { role: 'user', content: input.question.trim() },
  ]
}
