import { Link } from 'react-router-dom'
import { initialsFrom } from '../lib/profileStats'

type Props = {
  name: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClass = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-24 w-24 text-2xl',
}

export function ProfileAvatar({ name, avatarUrl, size = 'sm', className = '' }: Props) {
  const initials = initialsFrom(name)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`Foto de ${name}`}
        className={`${sizeClass[size]} rounded-full object-cover border border-[var(--line)] ${className}`}
      />
    )
  }

  return (
    <span
      className={`${sizeClass[size]} inline-grid place-items-center rounded-full font-display font-bold text-white bg-gradient-to-br from-[var(--electric)] to-[var(--navy)] border border-[var(--line)] ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  )
}

export function ProfileAvatarLink({
  name,
  avatarUrl,
  to = '/profile',
}: {
  name: string
  avatarUrl?: string | null
  to?: string
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full no-underline ring-offset-2 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--orange)]"
      aria-label="Abrir perfil"
      title="Meu perfil"
    >
      <ProfileAvatar name={name} avatarUrl={avatarUrl} size="sm" />
    </Link>
  )
}
