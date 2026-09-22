# Spec — Aprendizz LMS MVP

## Goal

Ship a sequential Backend study LMS driven by `ideia.md` content, using shared Supabase Auth and `aprendizz_*` tables.

## Vertical slices

1. Auth gate (login with inherited Supabase user)
2. Lesson catalog with lock/available/completed states
3. Lesson detail with markdown content
4. Exercise: MCQ auto-grade
5. Exercise: free-text submit
6. Exercise: code runner + tests
7. Completion unlocks next lesson

## Non-goals

Admin CMS, AI grading, multi-course, new Supabase project.
