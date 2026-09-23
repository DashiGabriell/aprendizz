import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Markdown } from './Markdown'
import { useAuth } from '../hooks/useAuth'
import { askLessonTutor } from '../lib/tutorChat'
import type { TutorChatMessage } from '../lib/tutorChatCore'
import { appendTutorExchange, listTutorMessagesForLesson } from '../lib/tutorMessages'
import type { Lesson } from '../lib/types'

type Props = {
  lesson: Pick<Lesson, 'id' | 'slug' | 'title' | 'objectives' | 'content_md'>
}

const WELCOME =
  'Oi! Sou o **Joseph**, professor desta aula. Pergunte sobre o conteúdo — posso orientar, mas não entrego gabarito dos exercícios.'

function isWelcomeMessage(content: string) {
  return content.includes('Sou o **Joseph**') || content.includes('Sou o Joseph')
}

export function LessonTutorChat({ lesson }: Props) {
  const { user } = useAuth()
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    { role: 'assistant', content: WELCOME },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let cancelled = false
    setOpen(false)
    setInput('')
    setBusy(false)
    setError(null)
    setLoadingHistory(true)
    setMessages([{ role: 'assistant', content: WELCOME }])

    ;(async () => {
      if (!user?.id) {
        if (!cancelled) setLoadingHistory(false)
        return
      }

      const history = await listTutorMessagesForLesson(user.id, lesson.id)
      if (cancelled) return

      if (history.error) {
        setError(history.error)
        setLoadingHistory(false)
        return
      }

      if (history.data.length > 0) {
        setMessages(history.data)
      } else {
        setMessages([{ role: 'assistant', content: WELCOME }])
      }
      setLoadingHistory(false)
    })()

    return () => {
      cancelled = true
    }
  }, [lesson.id, lesson.slug, user?.id])

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
    inputRef.current?.focus()
  }, [open, messages, busy, loadingHistory])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question || busy || !user?.id) return

    const historyForApi = messages.filter(
      (m) =>
        m.role === 'user' || (m.role === 'assistant' && !isWelcomeMessage(m.content)),
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

    if (result.error || !result.data) {
      setBusy(false)
      setError(result.error ?? 'Falha ao consultar o Joseph')
      return
    }

    const reply = result.data.reply
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }])

    const saved = await appendTutorExchange({
      userId: user.id,
      lessonId: lesson.id,
      question,
      answer: reply,
    })
    setBusy(false)
    if (saved.error) {
      setError(`Resposta ok, mas não salvei no caderno: ${saved.error}`)
    }
  }

  return (
    <div className={`lesson-tutor ${open ? 'is-open' : ''}`}>
      {open ? (
        <section
          className="lesson-tutor-panel"
          id={panelId}
          role="dialog"
          aria-label={`Joseph — professor da aula ${lesson.title}`}
        >
          <header className="lesson-tutor-header">
            <div className="lesson-tutor-header-text">
              <p className="lesson-tutor-eyebrow">Professor Joseph</p>
              <h2>Dúvidas desta aula</h2>
              <p className="lesson-tutor-sub">{lesson.title}</p>
            </div>
            <button
              type="button"
              className="lesson-tutor-close"
              aria-label="Fechar chat do Joseph"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="lesson-tutor-messages" ref={listRef}>
            {loadingHistory ? (
              <p className="lesson-tutor-loading">Carregando conversa desta aula…</p>
            ) : null}

            {!loadingHistory
              ? messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
                    className={`lesson-tutor-bubble is-${message.role}`}
                  >
                    <div className="lesson-tutor-bubble-label">
                      {message.role === 'assistant' ? 'Joseph' : 'Você'}
                    </div>
                    <div className="lesson-tutor-md">
                      <Markdown content={message.content} />
                    </div>
                  </div>
                ))
              : null}

            {busy ? (
              <div className="lesson-tutor-bubble is-assistant is-typing" aria-live="polite">
                Joseph está pensando…
              </div>
            ) : null}
            {error ? <p className="lesson-tutor-error">{error}</p> : null}
          </div>

          <form className="lesson-tutor-form" onSubmit={(e) => void onSubmit(e)}>
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              disabled={busy || loadingHistory}
              placeholder="Pergunte ao Joseph sobre esta aula… (Markdown ok)"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
            />
            <button type="submit" disabled={busy || loadingHistory || !input.trim()}>
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
        aria-label={open ? 'Fechar Joseph' : 'Abrir Joseph, professor da aula'}
        onClick={() => setOpen((v) => !v)}
      >
        <img src="/dev.png" alt="" width={56} height={56} draggable={false} />
        <span className="lesson-tutor-fab-pulse" aria-hidden="true" />
      </button>
    </div>
  )
}
