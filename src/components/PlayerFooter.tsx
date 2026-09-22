import { Link, useNavigate } from 'react-router-dom'
import type { ProgressStatus } from '../lib/types'

export type NeighborLesson = {
  slug: string
  title: string
  sort_order: number
}

type Props = {
  courseSlug?: string
  previous: NeighborLesson | null
  next: NeighborLesson | null
  currentStatus: ProgressStatus
  progressPercent: number
  onBlockedNext: () => void
}

export function PlayerFooter({
  courseSlug,
  previous,
  next,
  currentStatus,
  progressPercent,
  onBlockedNext,
}: Props) {
  const navigate = useNavigate()
  const completed = currentStatus === 'completed'
  const courseHome = courseSlug ? `/courses/${courseSlug}` : '/'

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
    <footer className="player-footer" role="contentinfo">
      <div className="player-footer-progress" aria-live="polite">
        <div
          className="player-progress-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-label={`${progressPercent}% concluído`}
        >
          <div className="player-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="player-progress-text">
          <strong>{progressPercent}%</strong>
          <span className="player-progress-label"> concluído</span>
        </span>
        <span className={`player-complete-badge ${completed ? 'is-done' : ''}`}>
          {completed ? '✓ Unidade concluída' : 'Conclua o exercício para avançar'}
        </span>
      </div>

      <div className="player-footer-nav">
        <Link
          to={courseHome}
          className="player-footer-home"
          aria-label="Voltar ao roadmap do curso"
          title="Roadmap do curso"
        >
          <img src="/logo.png" alt="" width={22} height={22} className="player-home-logo" />
        </Link>

        <button
          type="button"
          className="player-btn-nav"
          disabled={!previous}
          onClick={goPrevious}
          aria-label={previous ? `Anterior: ${previous.title}` : 'Sem aula anterior'}
        >
          ← <span className="player-btn-label">Anterior</span>
        </button>

        <button
          type="button"
          className="player-btn-nav player-btn-next"
          disabled={!next}
          onClick={goNext}
          aria-label={next ? `Próxima: ${next.title}` : 'Sem próxima aula'}
        >
          <span className="player-btn-label">Próxima</span> →
        </button>
      </div>
    </footer>
  )
}
