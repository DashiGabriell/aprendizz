import { Link } from 'react-router-dom'
import type { CurriculumTree, ProgressStatus } from '../lib/types'

type Props = {
  tree: CurriculumTree
  activeSlug?: string
  mobileOpen?: boolean
  onNavigate?: () => void
}

const statusDot: Record<ProgressStatus, string> = {
  locked: 'bg-[var(--muted)] opacity-40',
  available: 'bg-[var(--electric)]',
  completed: 'bg-[var(--orange)]',
}

export function CurriculumSidebar({ tree, activeSlug, mobileOpen, onNavigate }: Props) {
  return (
    <aside
      className={`study-sidebar ${mobileOpen ? 'study-sidebar-open' : ''}`}
      aria-label="Navegação do currículo"
    >
      <div className="study-sidebar-inner">
        <p className="eyebrow !mb-2">Matéria</p>
        <h2 className="font-display text-lg text-[var(--heading)] leading-tight">{tree.subject.title}</h2>
        <p className="mt-2 text-xs text-[var(--muted)] line-clamp-3">{plain(tree.subject.description_md)}</p>

        <nav className="mt-6 space-y-5">
          {tree.modules.map((block) => (
            <div key={block.module.id}>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--orange)]">
                Módulo {block.module.sort_order}
              </p>
              <p className="mb-2 text-sm font-semibold text-[var(--heading)]">{block.module.title}</p>
              <ul className="space-y-1 border-l border-[var(--line)] pl-3">
                {block.lessons.map((lesson) => {
                  const locked = lesson.status === 'locked'
                  const active = lesson.slug === activeSlug
                  const lessonNumber = block.lessons.filter(
                    (l) => l.kind === 'lesson' && l.sort_order <= lesson.sort_order,
                  ).length
                  const label = lesson.kind === 'assessment' ? 'Avaliação' : `Aula ${lessonNumber}`
                  const inner = (
                    <span className="flex items-start gap-2">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot[lesson.status]}`} />
                      <span>
                        <span className="block text-[0.7rem] uppercase tracking-wide text-[var(--muted)]">
                          {label}
                        </span>
                        <span className="block text-sm leading-snug">{lesson.title}</span>
                      </span>
                    </span>
                  )

                  if (locked) {
                    return (
                      <li key={lesson.id} className="py-1.5 opacity-45">
                        {inner}
                      </li>
                    )
                  }

                  return (
                    <li key={lesson.id}>
                      <Link
                        to={`/lessons/${lesson.slug}`}
                        onClick={onNavigate}
                        className={`block rounded px-1 py-1.5 no-underline transition ${
                          active
                            ? 'bg-[rgba(37,99,235,0.12)] text-[var(--heading)]'
                            : 'text-[var(--muted)] hover:text-[var(--heading)]'
                        }`}
                      >
                        {inner}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

function plain(md: string) {
  return md.replace(/[#>*`\[\]]/g, '').replace(/\n+/g, ' ').trim()
}
