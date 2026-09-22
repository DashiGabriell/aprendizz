# Aprendizz — Domain Context

## What this is

**Aprendizz** is a simple LMS for studying a Backend employability roadmap (Node.js + TypeScript + PostgreSQL), one lesson at a time, with a mandatory fixation exercise per lesson.

## Glossary

| Term | Meaning |
|------|---------|
| Lesson | One ordered study unit from `ideia.md` (strategy, week, cycle, project, or Aula 01) |
| Exercise | The fixation block for a lesson: MCQ + free-text + runnable code (when applicable) |
| Progress | Per-user state: `locked` \| `available` \| `completed` |
| Unlock | Making the next lesson `available` after the current exercise is fully passed |
| Runner | In-browser TS/JS sandbox that executes student code against exercise tests |
| Shared project | Existing Supabase project; Aprendizz tables/resources are namespaced |

## Resource naming

Every Supabase resource created for this app is prefixed with `aprendizz_` (tables, named policies, indexes, functions).

Auth is **inherited** from the shared Supabase project (`auth.users`). No separate `profiles` table in MVP.

## Tables

- `aprendizz_lessons`
- `aprendizz_exercises`
- `aprendizz_lesson_progress`
- `aprendizz_exercise_submissions`

## Completion rule

A lesson is `completed` only when:

1. MCQ is 100% correct
2. Free-text answer was submitted
3. Code tests all pass

Then the next lesson by `sort_order` becomes `available`.