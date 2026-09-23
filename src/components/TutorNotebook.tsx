import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Markdown } from './Markdown'
import type { TutorNotebookEntry } from '../lib/tutorMessages'
import { formatDatePt } from '../lib/profileStats'

type Props = {
  entries: TutorNotebookEntry[]
  loading?: boolean
}

export function TutorNotebook({ entries, loading }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((entry) => {
      const haystack = `${entry.lessonTitle} ${entry.question} ${entry.answer}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [entries, query])

  return (
    <section className="block-panel tutor-notebook">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Caderno com o Joseph</p>
          <h2 className="text-xl">Anotações do professor</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
            Perguntas e respostas salvas por aula — revise como um caderno de estudos.
          </p>
        </div>
        <label className="block w-full sm:max-w-xs text-sm font-semibold text-[var(--heading)]">
          Pesquisar
          <input
            className="input-field mt-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Aula, pergunta ou resposta…"
            disabled={loading}
          />
        </label>
      </div>

      {loading ? <p className="text-sm text-[var(--muted)]">Carregando anotações…</p> : null}

      {!loading && entries.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Ainda não há conversas com o Joseph. Abra uma aula e tire uma dúvida pelo ícone do
          professor.
        </p>
      ) : null}

      {!loading && entries.length > 0 && filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Nenhuma anotação encontrada para “{query.trim()}”.
        </p>
      ) : null}

      {!loading && filtered.length > 0 ? (
        <ul className="space-y-4">
          {filtered.map((entry) => (
            <li key={entry.id} className="tutor-notebook-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {entry.lessonSlug ? (
                    <Link
                      to={`/lessons/${entry.lessonSlug}`}
                      className="font-semibold text-[var(--heading)] no-underline hover:text-[var(--orange)]"
                    >
                      {entry.lessonTitle}
                    </Link>
                  ) : (
                    <p className="font-semibold text-[var(--heading)]">{entry.lessonTitle}</p>
                  )}
                  <p className="text-xs text-[var(--muted)]">{formatDatePt(entry.askedAt)}</p>
                </div>
                <span className="tutor-notebook-tag">Joseph</span>
              </div>

              <div className="tutor-notebook-qa">
                <div>
                  <p className="tutor-notebook-role">Você perguntou</p>
                  <div className="tutor-notebook-md">
                    <Markdown content={entry.question} />
                  </div>
                </div>
                <div>
                  <p className="tutor-notebook-role">Joseph respondeu</p>
                  <div className="tutor-notebook-md">
                    <Markdown content={entry.answer} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
