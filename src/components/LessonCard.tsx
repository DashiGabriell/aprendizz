import { Link } from 'react-router-dom'
import type { LessonWithProgress } from '../lib/types'

const statusLabel: Record<LessonWithProgress['status'], string> = {
  locked: 'Bloqueada',
  available: 'Disponível',
  completed: 'Concluída',
}

export function LessonCard({ lesson }: { lesson: LessonWithProgress }) {
  const locked = lesson.status === 'locked'
  const inner = (
    <article
      className={`block-panel reveal-in transition ${locked ? 'opacity-55' : 'hover:border-[var(--orange)]'}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--orange)]">
          {lesson.phase}
        </span>
        <span className="text-xs font-semibold text-[var(--muted)]">{statusLabel[lesson.status]}</span>
      </div>
      <h3 className="mb-2 text-lg text-[var(--heading)]">
        <span className="mr-2 text-[var(--orange)]">{String(lesson.sort_order).padStart(2, '0')}</span>
        {lesson.title}
      </h3>
      <p className="text-sm text-[var(--muted)] line-clamp-2">
        {lesson.objectives[0] ?? 'Estude o conteúdo e complete o exercício.'}
      </p>
    </article>
  )

  if (locked) return <div aria-disabled>{inner}</div>

  return (
    <Link to={`/lessons/${lesson.slug}`} className="no-underline text-inherit">
      {inner}
    </Link>
  )
}
