import { useEffect } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  lessonTitle: string
  nextLesson: { slug: string; title: string } | null
  onClose: () => void
}

export function LessonCompleteModal({ lessonTitle, nextLesson, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel reveal-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-complete-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">Progresso</p>
        <h2 id="lesson-complete-title" className="mb-2 text-2xl text-[var(--heading)]">
          Aula concluída
        </h2>
        <p className="mb-6 text-[var(--muted)]">
          Você finalizou <strong className="text-[var(--heading)]">{lessonTitle}</strong>
          {nextLesson ? '. A próxima aula já está liberada.' : '. Você concluiu todas as aulas do roadmap.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {nextLesson ? (
            <Link to={`/lessons/${nextLesson.slug}`} className="btn-primary no-underline">
              Próxima aula
            </Link>
          ) : (
            <Link to="/" className="btn-primary no-underline">
              Voltar ao roadmap
            </Link>
          )}
          <button type="button" className="btn-ghost" onClick={onClose}>
            Continuar nesta aula
          </button>
        </div>
        {nextLesson ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Em seguida: {nextLesson.title}</p>
        ) : null}
      </div>
    </div>
  )
}
