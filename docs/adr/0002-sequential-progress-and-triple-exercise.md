# ADR 0002 — Sequential progress and triple exercise

## Status

Accepted (amended)

## Context

Students must study one lesson at a time and fix concepts with strong exercises.
Code exercises only make sense when the lesson actually teaches programming.

## Decision

- Lessons unlock strictly by `sort_order`.
- Each exercise always has MCQ + free text.
- Runnable code is included **only** when the lesson teaches code (non-empty `code_prompt` + tests).
- Free text is graded by an OpenRouter agent with immediate pass/fail feedback.
- Completion requires MCQ 100%, free text passed, and code tests passing when code is required.

## Consequences

- Progress logic is centralized and testable (`exerciseRequiresCode`, `isLessonComplete`).
- Conceptual lessons (strategy, plan, HTTP intro, study cycle, project overview, Aula 01) ship without a code tab.
- OpenRouter key stays server-side (`API_KEY_OPENROUTER` via `/api/grade-text`).
