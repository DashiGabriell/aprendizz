# Aprendizz — Domain Context

## What this is

**Aprendizz** is an LMS for a Backend employability curriculum (Node.js + TypeScript + PostgreSQL), structured as **Matéria → Módulo → Aula**, with a **module assessment** (10 questions) at the end of each module.

## Glossary

| Term | Meaning |
|------|---------|
| Subject (Matéria) | Top-level course topic (e.g. Backend Empregável) |
| Module (Módulo) | Ordered group of lessons inside a subject |
| Lesson (Aula) | Study unit with full content + fixation exercise |
| Assessment (Avaliação) | End-of-module exam with 10 MCQs covering the module |
| Exercise | Only on lessons and assessments — never on the Roadmap |
| Roadmap | Explains the path only (no exercises) |
| Progress | Per-user: `locked` \| `available` \| `completed` |
| Unlock | Next unit unlocks after current exercise/assessment is passed |

## Resource naming

Every Supabase resource is prefixed with `aprendizz_`.

## Tables

- `aprendizz_subjects`
- `aprendizz_modules`
- `aprendizz_lessons` (`kind`: `lesson` \| `assessment`)
- `aprendizz_exercises`
- `aprendizz_lesson_progress`
- `aprendizz_exercise_submissions`
- `aprendizz_profiles`

## Completion rule

- **Lesson**: MCQ 100% + free-text passed (if present) + code tests (if present)
- **Assessment**: all 10 MCQs correct (no free-text/code required)

Then the next unit by global `sort_order` becomes `available`.
