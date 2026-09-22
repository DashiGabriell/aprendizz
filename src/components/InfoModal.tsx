import { useEffect } from 'react'

type Props = {
  title: string
  message: string
  confirmLabel?: string
  onClose: () => void
}

export function InfoModal({ title, message, confirmLabel = 'Entendi', onClose }: Props) {
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
        aria-labelledby="info-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">Atenção</p>
        <h2 id="info-modal-title" className="mb-2 text-2xl text-[var(--heading)]">
          {title}
        </h2>
        <p className="mb-6 text-[var(--muted)] whitespace-pre-wrap">{message}</p>
        <button type="button" className="btn-primary" onClick={onClose}>
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
