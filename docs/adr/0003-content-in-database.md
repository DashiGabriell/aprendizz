# ADR 0003 — Lesson content lives in Postgres

## Status

Accepted

## Context

Content must be editable via SQL seed and readable by the authenticated client.

## Decision

- Store lesson markdown and exercise payloads in `aprendizz_lessons` / `aprendizz_exercises`.
- Version the seed/migrations in git; no admin CMS in MVP.

## Consequences

- App depends on seeded DB to show curriculum.
- Deploy/setup docs must include applying migrations + seed.
