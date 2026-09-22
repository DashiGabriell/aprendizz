import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { Exercise, ExerciseSubmission, Lesson } from '../lib/types'
import { exerciseRequiresCode, exerciseRequiresFreeText } from '../lib/exerciseParts'
import { gradeFreeText } from '../lib/gradeFreeText'
import { gradeMcq } from '../lib/gradeMcq'
import { runStudentCode } from '../lib/runCode'
import { useTheme } from '../hooks/useTheme'

const Editor = lazy(() => import('@monaco-editor/react'))

type Props = {
  lesson: Pick<Lesson, 'title' | 'objectives' | 'kind'>
  exercise: Exercise
  submission: ExerciseSubmission | null
  onSave: (patch: Partial<ExerciseSubmission>) => Promise<void>
  onMaybeComplete: (flags: {
    mcqPassed: boolean
    freeTextSubmitted: boolean
    codePassed: boolean
  }) => Promise<void>
}

export function ExercisePanel({ lesson, exercise, submission, onSave, onMaybeComplete }: Props) {
  const { theme } = useTheme()
  const codeRequired = exerciseRequiresCode(exercise)
  const freeTextRequired = exerciseRequiresFreeText(exercise)
  const [tab, setTab] = useState<'mcq' | 'text' | 'code'>('mcq')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [freeText, setFreeText] = useState('')
  const [code, setCode] = useState(exercise.starter_code)
  const [mcqMsg, setMcqMsg] = useState<string | null>(null)
  const [textMsg, setTextMsg] = useState<string | null>(null)
  const [textPassed, setTextPassed] = useState(false)
  const [codeMsg, setCodeMsg] = useState<string | null>(null)
  const [codeResults, setCodeResults] = useState<Array<{ name: string; ok: boolean; error?: string }>>([])
  const [busy, setBusy] = useState(false)
  const [editingMcq, setEditingMcq] = useState(true)
  const [editingText, setEditingText] = useState(true)
  const [editingCode, setEditingCode] = useState(true)

  const flags = useMemo(
    () => ({
      mcqPassed: submission?.mcq_passed ?? false,
      freeTextSubmitted: freeTextRequired ? (submission?.free_text_submitted ?? false) : true,
      codePassed: codeRequired ? (submission?.code_passed ?? false) : true,
    }),
    [submission, codeRequired, freeTextRequired],
  )

  useEffect(() => {
    const mcqAnswers = submission?.mcq_answers ?? {}
    const savedText = submission?.free_text_answer ?? ''
    const savedCode = submission?.code_answer?.trim()
      ? submission.code_answer
      : exercise.starter_code

    setAnswers(mcqAnswers)
    setFreeText(savedText)
    setCode(savedCode)
    setTextMsg(submission?.free_text_feedback || null)
    setTextPassed(submission?.free_text_submitted ?? false)

    const mcqDone = submission?.mcq_passed ?? false
    const textDone = freeTextRequired ? (submission?.free_text_submitted ?? false) : false
    const codeDone = codeRequired ? (submission?.code_passed ?? false) : false

    setEditingMcq(!mcqDone)
    setEditingText(!textDone)
    setEditingCode(!codeDone)

    if (mcqDone) {
      const graded = gradeMcq(exercise.mcq, mcqAnswers)
      setMcqMsg(`Concluído anteriormente: ${graded.correctCount}/${graded.total} corretas.`)
    } else if (Object.keys(mcqAnswers).length > 0) {
      setMcqMsg('Respostas anteriores restauradas. Você pode corrigir de novo.')
    } else {
      setMcqMsg(null)
    }

    if (codeDone) {
      setCodeMsg('Código anterior aprovado nos testes. Use “Responder novamente” para alterar.')
      setCodeResults([])
    } else if (savedCode && savedCode !== exercise.starter_code) {
      setCodeMsg('Código anterior restaurado. Rode os testes para validar.')
      setCodeResults([])
    } else {
      setCodeMsg(null)
      setCodeResults([])
    }
  }, [submission, exercise, codeRequired, freeTextRequired])

  const activeTab =
    tab === 'code' && !codeRequired ? 'mcq' : tab === 'text' && !freeTextRequired ? 'mcq' : tab

  const tabs = [
    { id: 'mcq' as const, label: lesson.kind === 'assessment' ? 'Questões' : 'MCQ', done: flags.mcqPassed },
    ...(freeTextRequired
      ? [{ id: 'text' as const, label: 'Texto', done: submission?.free_text_submitted ?? false }]
      : []),
    ...(codeRequired ? [{ id: 'code' as const, label: 'Código', done: flags.codePassed }] : []),
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
    if (result.passed) setEditingMcq(false)
    await onMaybeComplete(nextFlags)
    setBusy(false)
  }

  async function submitText() {
    if (!freeText.trim()) return
    setBusy(true)
    setTextMsg(null)

    // Persist draft even if AI grading fails, so the student does not lose work.
    await onSave({
      free_text_answer: freeText.trim(),
    })

    const grade = await gradeFreeText({
      prompt: exercise.free_text_prompt,
      answer: freeText.trim(),
      lessonTitle: lesson.title,
      objectives: lesson.objectives,
    })
    if (grade.error || !grade.data) {
      setTextPassed(false)
      setTextMsg(grade.error ?? 'Não foi possível corrigir o texto.')
      setBusy(false)
      return
    }

    setTextPassed(grade.data.passed)
    setTextMsg(grade.data.feedback)
    const nextFlags = { ...flags, freeTextSubmitted: grade.data.passed }
    await onSave({
      free_text_answer: freeText.trim(),
      free_text_submitted: grade.data.passed,
      free_text_feedback: grade.data.feedback,
    })
    if (grade.data.passed) setEditingText(false)
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
    if (run.passed) setEditingCode(false)
    await onMaybeComplete(nextFlags)
    setBusy(false)
  }

  const hasAnySaved =
    Boolean(submission) &&
    (Object.keys(submission?.mcq_answers ?? {}).length > 0 ||
      Boolean(submission?.free_text_answer?.trim()) ||
      Boolean(submission?.code_answer?.trim()) ||
      flags.mcqPassed ||
      flags.freeTextSubmitted ||
      (codeRequired && flags.codePassed))

  return (
    <section className="block-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl">Exercício de fixação</h2>
          {hasAnySaved ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              Suas respostas anteriores foram restauradas.
            </p>
          ) : null}
        </div>
        <div className="exercise-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn-ghost ${activeTab === t.id ? 'border-[var(--orange)]' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.done ? ' ✓' : ''}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'mcq' ? (
        <div className="space-y-5">
          {!editingMcq && flags.mcqPassed ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-[rgba(15,122,69,0.08)] px-3 py-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                MCQ já concluído — respostas salvas abaixo.
              </p>
              <button type="button" className="btn-ghost" onClick={() => setEditingMcq(true)}>
                Responder novamente
              </button>
            </div>
          ) : null}

          {exercise.mcq.map((q, idx) => (
            <fieldset key={q.id} className="border border-[var(--line)] p-4" disabled={!editingMcq}>
              <legend className="px-1 text-sm font-semibold text-[var(--heading)]">
                {idx + 1}. {q.prompt}
              </legend>
              <div className="mt-2 space-y-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.id
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-2 text-sm ${
                        editingMcq ? 'cursor-pointer' : 'cursor-default'
                      } text-[var(--muted)]`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={selected}
                        disabled={!editingMcq}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                      />
                      <span className={selected && !editingMcq ? 'font-semibold text-[var(--heading)]' : ''}>
                        {opt.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
          {mcqMsg ? <p className="text-sm text-[var(--muted)]">{mcqMsg}</p> : null}
          {editingMcq ? (
            <button type="button" className="btn-primary" disabled={busy} onClick={() => void submitMcq()}>
              Corrigir MCQ
            </button>
          ) : null}
        </div>
      ) : null}

      {activeTab === 'text' && freeTextRequired ? (
        <div className="space-y-4">
          {!editingText && flags.freeTextSubmitted ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-[rgba(15,122,69,0.08)] px-3 py-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                Texto já aprovado — resposta salva abaixo.
              </p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditingText(true)
                  setTextPassed(false)
                }}
              >
                Responder novamente
              </button>
            </div>
          ) : null}

          <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">{exercise.free_text_prompt}</p>
          <textarea
            className="input-field min-h-40"
            value={freeText}
            readOnly={!editingText}
            onChange={(e) => {
              setFreeText(e.target.value)
              setTextPassed(false)
            }}
            placeholder="Escreva com suas palavras..."
          />
          {editingText ? (
            <button
              type="button"
              className="btn-primary"
              disabled={busy || !freeText.trim()}
              onClick={() => void submitText()}
            >
              {busy ? 'Corrigindo…' : 'Corrigir texto'}
            </button>
          ) : null}
          {textMsg ? (
            <p className="text-sm" style={{ color: textPassed || flags.freeTextSubmitted ? 'var(--success)' : 'var(--danger)' }}>
              {textPassed || (!editingText && flags.freeTextSubmitted) ? '✓ Acerto. ' : '✗ Ainda não. '}
              {textMsg}
            </p>
          ) : null}
        </div>
      ) : null}

      {activeTab === 'code' && codeRequired ? (
        <div className="space-y-4">
          {!editingCode && flags.codePassed ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-[rgba(15,122,69,0.08)] px-3 py-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                Código já aprovado — solução salva no editor.
              </p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditingCode(true)
                  setCodeMsg(null)
                }}
              >
                Responder novamente
              </button>
            </div>
          ) : null}

          <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">{exercise.code_prompt}</p>
          <div className="code-editor-shell">
            <Suspense fallback={<p className="p-4 text-sm text-[var(--muted)]">Carregando editor…</p>}>
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={(v) => {
                  if (!editingCode) return
                  setCode(v ?? '')
                }}
                options={{
                  readOnly: !editingCode,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </Suspense>
          </div>
          {editingCode ? (
            <button type="button" className="btn-primary" disabled={busy} onClick={() => void submitCode()}>
              Rodar testes
            </button>
          ) : null}
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
