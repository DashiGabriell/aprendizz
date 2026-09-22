import { Link } from 'react-router-dom'
import type { CurriculumTree, ProgressStatus } from '../lib/types'

type Props = {
  tree: CurriculumTree
  activeSlug?: string
  collapsed?: boolean
  onNavigate?: () => void
}

const statusClass: Record<ProgressStatus, string> = {
  locked: 'aula-locked',
  available: 'aula-available',
  completed: 'aula-completed',
}

export function PlayerAside({ tree, activeSlug, collapsed, onNavigate }: Props) {
  return (
    <aside
      className={`player-aside ${collapsed ? 'player-aside-collapsed' : ''}`}
      id="playerAside"
      aria-label="Conteúdo do curso"
    >
      <div className="player-aside-header">
        <h3>Conteúdo do curso</h3>
      </div>

      <nav className="player-modulos-nav">
        {tree.modules.map((block) => (
          <div key={block.module.id} className="player-modulo-group">
            <div className="player-modulo-title">
              <span className="player-modulo-icon" aria-hidden />
              <span>
                Módulo {toRoman(block.module.sort_order)}
                <span className="player-modulo-subtitle">{block.module.title}</span>
              </span>
            </div>
            <ul className="player-aulas-list">
              {block.lessons.map((lesson) => {
                const locked = lesson.status === 'locked'
                const active = lesson.slug === activeSlug
                const lessonNumber = block.lessons.filter(
                  (l) => l.kind === 'lesson' && l.sort_order <= lesson.sort_order,
                ).length
                const kindLabel = lesson.kind === 'assessment' ? 'Avaliação' : `Aula ${lessonNumber}`

                if (locked) {
                  return (
                    <li
                      key={lesson.id}
                      className={`player-aula-item ${statusClass[lesson.status]}`}
                      aria-disabled
                    >
                      <div className="player-aula-link">
                        <span className="player-aula-kind">{kindLabel}</span>
                        <span className="player-aula-title">{lesson.title}</span>
                      </div>
                    </li>
                  )
                }

                return (
                  <li
                    key={lesson.id}
                    className={`player-aula-item ${statusClass[lesson.status]} ${active ? 'active' : ''}`}
                  >
                    <Link
                      to={`/lessons/${lesson.slug}`}
                      className="player-aula-link"
                      onClick={onNavigate}
                      title={lesson.title}
                    >
                      <span className="player-aula-kind">{kindLabel}</span>
                      <span className="player-aula-title">{lesson.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let rest = n
  let out = ''
  for (const [value, glyph] of map) {
    while (rest >= value) {
      out += glyph
      rest -= value
    }
  }
  return out || String(n)
}
