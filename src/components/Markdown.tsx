import { Children, isValidElement, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MermaidDiagram } from './MermaidDiagram'

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return ''
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const child = Children.toArray(children)[0]
            if (isValidElement<{ className?: string; children?: ReactNode }>(child)) {
              const className = child.props.className ?? ''
              if (className.includes('language-mermaid')) {
                const chart = extractText(child.props.children).replace(/\n$/, '')
                return <MermaidDiagram chart={chart} />
              }
            }
            return <pre>{children}</pre>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
