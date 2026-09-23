import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { askLessonTutor } from '../lib/tutorChat'
import type { TutorChatMessage } from '../lib/tutorChatCore'
import type { Lesson } from '../lib/types'

type Props = {
  lesson: Pick<Lesson, 'slug' | 'title' | 'objectives' | 'content_md'>
}

const WELCOME =
  'Oi! Sou o professor desta aula. Pergunte sobre o conteúdo — posso orientar, mas não entrego gabarito dos exercícios.'

export function LessonTutorChat({ lesson }: Props) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    { role: 'assistant', content: WELCOME },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setOpen(false)
    setInput('')
    setBusy(false)
    setError(null)
    setMessages([{ role: 'assistant', content: WELCOME }])
  }, [lesson.slug])

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
    inputRef.current?.focus()
  }, [open, messages, busy])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question || busy) return

    const historyForApi = messages.filter(
      (m) => m.role === 'user' || (m.role === 'assistant' && m.content !== WELCOME),
    )

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setBusy(true)

    const result = await askLessonTutor({
      lessonTitle: lesson.title,
      objectives: lesson.objectives,
      contentMd: lesson.content_md,
      messages: historyForApi,
      question,
    })

    setBusy(false)
    if (result.error || !result.data) {
      setError(result.error ?? 'Falha ao consultar o professor')
      return
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: result.data!.reply }])
  }

  return (
    <div className={`lesson-tutor ${open ? 'is-open' : ''}`}>
      {open ? (
        <section
          className="lesson-tutor-panel"
          id={panelId}
          role="dialog"
          aria-label={`Professor da aula ${lesson.title}`}
        >
          <header className="lesson-tutor-header">
            <div className="lesson-tutor-header-text">
              <p className="lesson-tutor-eyebrow">Professor</p>
              <h2>Dúvidas desta aula</h2>
              <p className="lesson-tutor-sub">{lesson.title}</p>
            </div>
            <button
              type="button"
              className="lesson-tutor-close"
              aria-label="Fechar chat do professor"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="lesson-tutor-messages" ref={listRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`lesson-tutor-bubble is-${message.role}`}
              >
                {message.content}
              </div>
            ))}
            {busy ? (
              <div className="lesson-tutor-bubble is-assistant is-typing" aria-live="polite">
                Pensando…
              </div>
            ) : null}
            {error ? <p className="lesson-tutor-error">{error}</p> : null}
          </div>

          <form className="lesson-tutor-form" onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              disabled={busy}
              placeholder="Pergunte sobre o conteúdo desta aula…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
            />
            <button type="submit" disabled={busy || !input.trim()}>
              Enviar
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="lesson-tutor-fab"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? 'Fechar professor' : 'Abrir professor da aula'}
        onClick={() => setOpen((v) => !v)}
      >
        <img src="/dev.png" alt="" width={56} height={56} draggable={false} />
        <span className="lesson-tutor-fab-pulse" aria-hidden="true" />
      </button>
    </div>
  )
}
