import { useNavigate } from 'react-router-dom'
import type { ProgressStatus } from '../lib/types'

export type NeighborLesson = {
  slug: string
  title: string
  sort_order: number
}

type Props = {
  previous: NeighborLesson | null
  next: NeighborLesson | null
  currentStatus: ProgressStatus
  onBlockedNext: () => void
}

export function LessonNavFooter({ previous, next, currentStatus, onBlockedNext }: Props) {
  const navigate = useNavigate()
  const canGoNext = currentStatus === 'completed' && Boolean(next)

  function goPrevious() {
    if (!previous) return
    navigate(`/lessons/${previous.slug}`)
  }

  function goNext() {
    if (!next) return
    if (currentStatus !== 'completed') {
      onBlockedNext()
      return
    }
    navigate(`/lessons/${next.slug}`)
  }

  return (
    <footer className="mt-10 border-t-2 border-[var(--orange)] pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="btn-ghost justify-center sm:justify-start"
          disabled={!previous}
          onClick={goPrevious}
          aria-label={previous ? `Aula anterior: ${previous.title}` : 'Não há aula anterior'}
        >
          ← Anterior
        </button>

        <p className="order-first text-center text-xs text-[var(--muted)] sm:order-none sm:max-w-xs">
          {next
            ? canGoNext
              ? `Próxima: ${next.title}`
              : 'Conclua o exercício desta aula para liberar a próxima.'
            : 'Você está na última aula do roadmap.'}
        </p>

        <button
          type="button"
          className={`btn-primary justify-center sm:justify-start ${!next ? 'opacity-50' : ''}`}
          disabled={!next}
          onClick={goNext}
          aria-label={next ? `Próxima aula: ${next.title}` : 'Não há próxima aula'}
        >
          Próxima →
        </button>
      </div>
    </footer>
  )
}
