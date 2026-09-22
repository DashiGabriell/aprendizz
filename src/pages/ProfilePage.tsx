import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProfileAvatar } from '../components/ProfileAvatar'
import { useAuth } from '../hooks/useAuth'
import {
  ensureProfile,
  loadPerformanceDashboard,
  updateProfile,
  uploadAvatar,
  type ActivityEvent,
  type LessonPerformance,
  type ProfileStats,
  type StudentProfile,
} from '../lib/profile'
import { formatDatePt, formatDateShort } from '../lib/profileStats'
import { ensureProgressRows } from '../lib/progress'

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="block-panel !p-4">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--orange)]">{label}</p>
      <p className="mt-1 font-display text-3xl text-[var(--heading)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  )
}

function PartPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
      style={{
        color: ok ? 'var(--success)' : 'var(--muted)',
        background: ok ? 'rgba(15, 122, 69, 0.12)' : 'rgba(0,0,0,0.04)',
        border: `1px solid ${ok ? 'rgba(15,122,69,0.25)' : 'var(--line)'}`,
      }}
    >
      {ok ? '✓' : '○'} {label}
    </span>
  )
}

export function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [lessons, setLessons] = useState<LessonPerformance[]>([])
  const [timeline, setTimeline] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const email = user?.email ?? ''

  useEffect(() => {
    if (!user) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)
      await ensureProgressRows(user.id)

      const profileRes = await ensureProfile(user)
      if (cancelled) return
      if (profileRes.error || !profileRes.data) {
        setError(profileRes.error ?? 'Não foi possível carregar o perfil')
        setLoading(false)
        return
      }

      setProfile(profileRes.data)
      setDisplayName(profileRes.data.display_name)
      setBio(profileRes.data.bio)

      const dash = await loadPerformanceDashboard(user.id)
      if (cancelled) return
      if (dash.error) {
        setError(dash.error)
        setLoading(false)
        return
      }

      setLessons(dash.lessons)
      setStats(dash.stats)
      setTimeline(dash.timeline)
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [user])

  const studied = useMemo(
    () => lessons.filter((l) => l.status === 'completed' || l.partsPassed > 0),
    [lessons],
  )
  const remainingLessons = useMemo(
    () => lessons.filter((l) => l.status !== 'completed'),
    [lessons],
  )

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaveMsg(null)
    const result = await updateProfile(user.id, {
      display_name: displayName.trim() || email.split('@')[0] || 'Aluno',
      bio: bio.trim(),
    })
    setSaving(false)
    if (result.error || !result.data) {
      setSaveMsg(result.error ?? 'Erro ao salvar')
      return
    }
    setProfile(result.data)
    setSaveMsg('Perfil atualizado.')
    window.dispatchEvent(new Event('aprendizz-profile-updated'))
  }

  async function onAvatarChange(file: File | null) {
    if (!user || !file) return
    if (!file.type.startsWith('image/')) {
      setSaveMsg('Envie uma imagem (JPG, PNG ou WebP).')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setSaveMsg('A imagem deve ter no máximo 2 MB.')
      return
    }
    setSaving(true)
    setSaveMsg(null)
    const uploaded = await uploadAvatar(user.id, file)
    if (uploaded.error || !uploaded.url) {
      setSaving(false)
      setSaveMsg(uploaded.error ?? 'Falha no upload')
      return
    }
    const result = await updateProfile(user.id, { avatar_url: uploaded.url })
    setSaving(false)
    if (result.error || !result.data) {
      setSaveMsg(result.error ?? 'Falha ao salvar avatar')
      return
    }
    setProfile(result.data)
    setSaveMsg('Foto atualizada.')
    window.dispatchEvent(new Event('aprendizz-profile-updated'))
  }

  const display = displayName || profile?.display_name || email || 'Aluno'

  return (
    <Layout>
      <div className="reveal-in space-y-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Perfil do aluno</p>
            <h1 className="page-title mb-2">Seu desempenho</h1>
            <p className="max-w-2xl text-[var(--muted)]">
              Acompanhe o que já estudou, como foi em cada exercício e quanto falta para concluir o
              roadmap Backend.
            </p>
          </div>
          <Link to="/" className="btn-ghost w-fit no-underline">
            ← Roadmap
          </Link>
        </header>

        {loading ? <p className="text-[var(--muted)]">Carregando perfil…</p> : null}
        {error ? (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        ) : null}

        {!loading && profile && stats ? (
          <>
            <section className="block-panel grid gap-6 md:grid-cols-[auto_1fr]">
              <div className="flex flex-col items-center gap-3 md:items-start">
                <ProfileAvatar name={display} avatarUrl={profile.avatar_url} size="lg" />
                <label className="btn-ghost cursor-pointer">
                  Trocar foto
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(e) => void onAvatarChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <form className="space-y-4" onSubmit={(e) => void onSaveProfile(e)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[var(--heading)]">
                    Nome de exibição
                    <input
                      className="input-field mt-1"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      maxLength={80}
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[var(--heading)]">
                    Email
                    <input className="input-field mt-1 opacity-80" value={email} readOnly />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-[var(--heading)]">
                  Bio
                  <textarea
                    className="input-field mt-1 min-h-24"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={400}
                    placeholder="Conte em uma frase o seu foco de estudos…"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Salvando…' : 'Salvar perfil'}
                  </button>
                  {saveMsg ? <p className="text-sm text-[var(--muted)]">{saveMsg}</p> : null}
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Conta desde {formatDateShort(user?.created_at)} · Perfil atualizado{' '}
                  {formatDateShort(profile.updated_at)}
                </p>
              </form>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Progresso"
                value={`${stats.progressPercent}%`}
                hint={`${stats.completed} de ${stats.totalLessons} aulas`}
              />
              <StatCard
                label="Média nos exercícios"
                value={`${stats.averageLessonScore}%`}
                hint="MCQ + texto + código"
              />
              <StatCard
                label="Restam"
                value={stats.remaining}
                hint={stats.remaining === 0 ? 'Roadmap concluído' : 'aulas para finalizar'}
              />
              <StatCard
                label="Última atividade"
                value={stats.lastActivityAt ? formatDateShort(stats.lastActivityAt) : '—'}
                hint={
                  stats.firstActivityAt
                    ? `Início: ${formatDateShort(stats.firstActivityAt)}`
                    : 'Ainda sem envios'
                }
              />
            </section>

            <section className="block-panel">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl">Conclusão do roadmap</h2>
                <span className="text-sm font-semibold text-[var(--royal)]">
                  {stats.completed}/{stats.totalLessons}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden border border-[var(--line)] bg-[rgba(37,99,235,0.08)]">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${stats.progressPercent}%`,
                    background: 'linear-gradient(90deg, var(--electric), var(--orange))',
                  }}
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <p className="text-sm text-[var(--muted)]">
                  <strong className="text-[var(--heading)]">{stats.completed}</strong> concluídas
                </p>
                <p className="text-sm text-[var(--muted)]">
                  <strong className="text-[var(--heading)]">{stats.available}</strong> disponíveis
                </p>
                <p className="text-sm text-[var(--muted)]">
                  <strong className="text-[var(--heading)]">{stats.locked}</strong> bloqueadas
                </p>
              </div>
              {stats.phasesStudied.length > 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Fases tocadas:{' '}
                  <span className="font-semibold text-[var(--heading)]">
                    {stats.phasesStudied.join(' · ')}
                  </span>
                </p>
              ) : null}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="block-panel">
                <h3 className="mb-2 text-lg">MCQ</h3>
                <p className="font-display text-3xl text-[var(--heading)]">{stats.mcqPassedCount}</p>
                <p className="text-sm text-[var(--muted)]">aulas com MCQ 100%</p>
              </div>
              <div className="block-panel">
                <h3 className="mb-2 text-lg">Texto</h3>
                <p className="font-display text-3xl text-[var(--heading)]">
                  {stats.freeTextPassedCount}
                </p>
                <p className="text-sm text-[var(--muted)]">respostas aprovadas</p>
              </div>
              <div className="block-panel">
                <h3 className="mb-2 text-lg">Código</h3>
                <p className="font-display text-3xl text-[var(--heading)]">{stats.codePassedCount}</p>
                <p className="text-sm text-[var(--muted)]">runners com testes OK</p>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="block-panel">
                <h2 className="mb-4 text-xl">Estudado até agora</h2>
                {studied.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">
                    Você ainda não concluiu partes de exercício. Comece pela primeira aula do roadmap.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {studied.map((l) => (
                      <li key={l.lessonId} className="border-b border-[var(--line)] pb-3 last:border-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to={`/lessons/${l.slug}`}
                              className="font-semibold text-[var(--heading)] no-underline hover:text-[var(--orange)]"
                            >
                              {String(l.sortOrder).padStart(2, '0')}. {l.title}
                            </Link>
                            <p className="text-xs text-[var(--muted)]">{l.phase}</p>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-[var(--royal)]">
                            {l.scorePercent}%
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <PartPill ok={l.mcqPassed} label="MCQ" />
                          <PartPill ok={l.freeTextPassed} label="Texto" />
                          <PartPill ok={l.codePassed} label="Código" />
                        </div>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          {l.status === 'completed'
                            ? `Concluída em ${formatDatePt(l.completedAt)}`
                            : `Exercício em ${formatDatePt(l.exerciseUpdatedAt || l.exerciseCreatedAt)}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="block-panel">
                <h2 className="mb-4 text-xl">O que falta</h2>
                {remainingLessons.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">
                    Parabéns — todas as aulas do roadmap foram concluídas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {remainingLessons.map((l) => (
                      <li
                        key={l.lessonId}
                        className="flex items-center justify-between gap-3 border border-[var(--line)] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--heading)]">
                            {String(l.sortOrder).padStart(2, '0')}. {l.title}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {l.status === 'available' ? 'Disponível agora' : 'Bloqueada'}
                          </p>
                        </div>
                        {l.status === 'available' ? (
                          <Link to={`/lessons/${l.slug}`} className="btn-ghost shrink-0 no-underline">
                            Continuar
                          </Link>
                        ) : (
                          <span className="text-xs font-semibold text-[var(--muted)]">🔒</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="block-panel">
              <h2 className="mb-4 text-xl">Desempenho por aula</h2>
              <div className="profile-table-wrap">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs uppercase tracking-wide text-[var(--muted)]">
                    <th className="py-2 pr-3 font-semibold">Aula</th>
                    <th className="py-2 pr-3 font-semibold">Status</th>
                    <th className="py-2 pr-3 font-semibold">MCQ</th>
                    <th className="py-2 pr-3 font-semibold">Texto</th>
                    <th className="py-2 pr-3 font-semibold">Código</th>
                    <th className="py-2 pr-3 font-semibold">Nota</th>
                    <th className="py-2 font-semibold">Datas</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l) => (
                    <tr key={l.lessonId} className="border-b border-[var(--line)] align-top">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-[var(--heading)]">
                          {String(l.sortOrder).padStart(2, '0')}. {l.title}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{l.phase}</p>
                      </td>
                      <td className="py-3 pr-3 capitalize text-[var(--muted)]">
                        {l.status === 'completed'
                          ? 'Concluída'
                          : l.status === 'available'
                            ? 'Disponível'
                            : 'Bloqueada'}
                      </td>
                      <td className="py-3 pr-3">{l.mcqPassed ? '✓' : '—'}</td>
                      <td className="py-3 pr-3">{l.freeTextPassed ? '✓' : '—'}</td>
                      <td className="py-3 pr-3">{l.codePassed ? '✓' : '—'}</td>
                      <td className="py-3 pr-3 font-semibold text-[var(--heading)]">
                        {l.partsPassed > 0 || l.status === 'completed' ? `${l.scorePercent}%` : '—'}
                      </td>
                      <td className="py-3 text-xs text-[var(--muted)]">
                        <div>Exercício: {formatDateShort(l.exerciseUpdatedAt || l.exerciseCreatedAt)}</div>
                        <div>Conclusão: {formatDateShort(l.completedAt)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </section>

            <section className="block-panel">
              <h2 className="mb-4 text-xl">Linha do tempo</h2>
              {timeline.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">Sem eventos ainda.</p>
              ) : (
                <ol className="relative space-y-4 border-l-2 border-[var(--line)] pl-5">
                  {timeline.slice(0, 20).map((ev) => (
                    <li key={ev.id} className="relative">
                      <span
                        className="absolute -left-[1.55rem] top-1 h-3 w-3 rounded-full"
                        style={{
                          background: ev.kind === 'completed' ? 'var(--orange)' : 'var(--electric)',
                        }}
                      />
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                        {formatDatePt(ev.at)}
                      </p>
                      <p className="font-semibold text-[var(--heading)]">
                        {ev.slug ? (
                          <Link to={`/lessons/${ev.slug}`} className="no-underline hover:text-[var(--orange)]">
                            {ev.title}
                          </Link>
                        ) : (
                          ev.title
                        )}
                      </p>
                      <p className="text-sm text-[var(--muted)]">{ev.detail}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        ) : null}
      </div>
    </Layout>
  )
}
