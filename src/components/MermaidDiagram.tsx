import { useEffect, useId, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

type Props = {
  chart: string
}

export function MermaidDiagram({ chart }: Props) {
  const { theme } = useTheme()
  const reactId = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const renderId = `aprendizz-mmd-${reactId}-${Math.random().toString(36).slice(2, 8)}`

    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: theme === 'dark' ? 'dark' : 'neutral',
          fontFamily: 'Outfit, sans-serif',
        })
        const { svg: rendered } = await mermaid.render(renderId, chart.trim())
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setSvg(null)
          setError(err instanceof Error ? err.message : 'Falha ao renderizar diagrama')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chart, theme, reactId])

  if (error) {
    return (
      <div className="mermaid-wrap mermaid-error">
        <p className="text-sm" style={{ color: 'var(--danger)' }}>
          Não foi possível exibir o diagrama.
        </p>
        <pre className="mt-2 overflow-x-auto text-xs text-[var(--muted)]">{chart}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="mermaid-wrap">
        <p className="text-sm text-[var(--muted)]">Carregando diagrama…</p>
      </div>
    )
  }

  return (
    <div
      className="mermaid-wrap"
      role="img"
      aria-label="Diagrama da aula"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
