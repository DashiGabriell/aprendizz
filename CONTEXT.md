# Aprendizz — Domain Context

## What this is

**Aprendizz** is the LMS product. Students browse **courses**, then study each course as **Module → Lesson** (with a **module assessment** of 10 questions).

## Glossary

| Term | Meaning |
|------|---------|
| LMS (Aprendizz) | The product itself — catalog, auth, progress, player — not a single curriculum |
| Course (Curso) | An enrollable program inside the LMS (e.g. Backend Empregável). Stored as `aprendizz_subjects` |
| Module (Módulo) | Ordered group of lessons inside a course |
| Lesson (Aula) | Study unit with full content + fixation exercise |
| Assessment (Avaliação) | End-of-module exam with 10 MCQs covering the module |
| Exercise | Only on lessons and assessments — never on the course roadmap |
| Roadmap | Course path view (modules + units) — not the LMS home |
| Progress | Per-user: `locked` \| `available` \| `completed` |
| Unlock | Next unit unlocks after current exercise/assessment is passed |

_Avoid_: calling one Course “Aprendizz”; treating the home page as a single-course roadmap.

## Resource naming

Every Supabase resource is prefixed with `aprendizz_`.

## Tables

- `aprendizz_subjects` (courses)
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
