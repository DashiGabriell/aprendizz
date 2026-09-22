# ADR 0002 — Sequential progress and triple exercise

## Status

Accepted

## Context

Students must study one lesson at a time and fix concepts with strong exercises.

## Decision

- Lessons unlock strictly by `sort_order`.
- Each exercise prefers three parts: MCQ, free text, runnable code.
- Completion requires MCQ 100%, free text submitted, and all code tests passing.

## Consequences

- Progress logic is centralized and testable.
- Content seed must include all three parts whenever feasible.
