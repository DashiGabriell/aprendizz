# ADR 0004 — LMS home vs course roadmap

## Status

Accepted

## Context

The first curriculum (Backend Empregável) was shown on `/` as if it were the whole product. More courses will be added later.

## Decision

- `/` is the LMS home: lists available **courses**.
- `/courses/:slug` is the **roadmap** of one course.
- In the domain, Course = enrollable program; Aprendizz = the LMS. DB table remains `aprendizz_subjects`.

## Consequences

- Navigation and player “home” links point to the course roadmap or LMS home with clear labels.
- Adding a course is another subject row + seed, without redesigning the product shell.
