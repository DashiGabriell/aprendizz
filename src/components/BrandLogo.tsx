import { Link } from 'react-router-dom'

type Props = {
  to?: string
  className?: string
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 28,
  md: 36,
  lg: 48,
} as const

export function BrandLogo({ to = '/', className = '', showWordmark = true, size = 'md' }: Props) {
  const px = sizes[size]
  const inner = (
    <span className={`brand-logo ${className}`.trim()}>
      <img src="/logo.png" alt="" width={px} height={px} className="brand-logo-img" />
      {showWordmark ? <span className="brand-logo-text">Aprendizz</span> : null}
    </span>
  )

  if (!to) return inner

  return (
    <Link to={to} className="brand-logo-link no-underline" aria-label="Aprendizz — início">
      {inner}
    </Link>
  )
}
