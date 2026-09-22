import { lazy, Suspense, useMemo, useState } from 'react'
import type { Exercise, ExerciseSubmission } from '../lib/types'
import { gradeMcq } from '../lib/gradeMcq'
import { runStudentCode } from '../lib/runCode'
import { useTheme } from '../hooks/useTheme'

const Editor = lazy(() => import('@monaco-editor/react'))

type Props = {
  exercise: Exercise
  submission: ExerciseSubmission | null
  onSave: (patch: Partial<ExerciseSubmission>) => Promise<void>
  onMaybeComplete: (flags: {
    mcqPassed: boolean
    freeTextSubmitted: boolean
    codePassed: boolean
  }) => Promise<void>
}

export function ExercisePanel({ exercise, submission, onSave, onMaybeComplete }: Props) {
  const { theme } = useTheme()
  const [tab, setTab] = useState<'mcq' | 'text' | 'code'>('mcq')
  const [answers, setAnswers] = useState<Record<string, string>>(submission?.mcq_answers ?? {})
  const [freeText, setFreeText] = useState(submission?.free_text_answer ?? '')
  const [code, setCode] = useState(submission?.code_answer || exercise.starter_code)
  const [mcqMsg, setMcqMsg] = useState<string | null>(null)
  const [codeMsg, setCodeMsg] = useState<string | null>(null)
  const [codeResults, setCodeResults] = useState<Array<{ name: string; ok: boolean; error?: string }>>([])
  const [busy, setBusy] = useState(false)

  const flags = useMemo(
    () => ({
      mcqPassed: submission?.mcq_passed ?? false,
      freeTextSubmitted: submission?.free_text_submitted ?? false,
      codePassed: submission?.code_passed ?? false,
    }),
    [submission],
  )

  const tabs = [
    { id: 'mcq' as const, label: 'MCQ', done: flags.mcqPassed },
    { id: 'text' as const, label: 'Texto', done: flags.freeTextSubmitted },
    { id: 'code' as const, label: 'Código', done: flags.codePassed },
  ]

  async function submitMcq() {
    setBusy(true)
    const result = gradeMcq(exercise.mcq, answers)
    setMcqMsg(
      result.passed
        ? `Perfeito: ${result.correctCount}/${result.total}`
        : `Ainda não: ${result.correctCount}/${result.total}. Revise e tente de novo.`,
    )
    const nextFlags = { ...flags, mcqPassed: result.passed }
    await onSave({
      mcq_answers: answers,
      mcq_passed: result.passed,
    })
    await onMaybeComplete(nextFlags)
    setBusy(false)
  }

  async function submitText() {
    if (!freeText.trim()) {
      setMcqMsg(null)
      return
    }
    setBusy(true)
    const nextFlags = { ...flags, freeTextSubmitted: true }
    await onSave({
      free_text_answer: freeText.trim(),
      free_text_submitted: true,
    })
    await onMaybeComplete(nextFlags)
    setBusy(false)
  }

  async function submitCode() {
    setBusy(true)
    const run = await runStudentCode(code, exercise.tests)
    setCodeResults(run.results)
    setCodeMsg(run.passed ? 'Todos os testes passaram.' : 'Alguns testes falharam.')
    const nextFlags = { ...flags, codePassed: run.passed }
    await onSave({
      code_answer: code,
      code_passed: run.passed,
    })
    await onMaybeComplete(nextFlags)
    setBusy(false)
  }

  return (
    <section className="block-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl">Exercício de fixação</h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn-ghost ${tab === t.id ? 'border-[var(--orange)]' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.done ? ' ✓' : ''}
            </button>
          ))}
        </div>
      </div>

      {tab === 'mcq' ? (
        <div className="space-y-5">
          {exercise.mcq.map((q, idx) => (
            <fieldset key={q.id} className="border border-[var(--line)] p-4">
              <legend className="px-1 text-sm font-semibold text-[var(--heading)]">
                {idx + 1}. {q.prompt}
              </legend>
              <div className="mt-2 space-y-2">
                {q.options.map((opt) => (
                  <label key={opt.id} className="flex cursor-pointer items-start gap-2 text-sm text-[var(--muted)]">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt.id}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {mcqMsg ? <p className="text-sm text-[var(--muted)]">{mcqMsg}</p> : null}
          <button type="button" className="btn-primary" disabled={busy} onClick={() => void submitMcq()}>
            Corrigir MCQ
          </button>
        </div>
      ) : null}

      {tab === 'text' ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">{exercise.free_text_prompt}</p>
          <textarea
            className="input-field min-h-40"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Escreva com suas palavras..."
          />
          <button type="button" className="btn-primary" disabled={busy || !freeText.trim()} onClick={() => void submitText()}>
            Enviar texto
          </button>
          {flags.freeTextSubmitted ? (
            <p className="text-sm" style={{ color: 'var(--success)' }}>
              Texto enviado.
            </p>
          ) : null}
        </div>
      ) : null}

      {tab === 'code' ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">{exercise.code_prompt}</p>
          <div className="overflow-hidden border border-[var(--line)]" style={{ minHeight: 280 }}>
            <Suspense fallback={<p className="p-4 text-sm text-[var(--muted)]">Carregando editor…</p>}>
              <Editor
                height="280px"
                defaultLanguage="typescript"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={(v) => setCode(v ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                }}
              />
            </Suspense>
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={() => void submitCode()}>
            Rodar testes
          </button>
          {codeMsg ? <p className="text-sm text-[var(--muted)]">{codeMsg}</p> : null}
          <ul className="space-y-1 text-sm">
            {codeResults.map((r) => (
              <li key={r.name} style={{ color: r.ok ? 'var(--success)' : 'var(--danger)' }}>
                {r.ok ? '✓' : '✗'} {r.name}
                {r.error ? ` — ${r.error}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
