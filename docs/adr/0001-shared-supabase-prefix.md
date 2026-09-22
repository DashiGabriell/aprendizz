# ADR 0001 — Shared Supabase with `aprendizz_` prefix

## Status

Accepted

## Context

The team already has a Supabase project in use. Aprendizz is low-impact and should reuse that project and the same Auth users.

## Decision

- Reuse the existing Supabase project and Auth.
- Prefix every new resource with `aprendizz_`.
- Do not create a dedicated `profiles` table; use `auth.users`.

## Consequences

- Migrations must not collide with existing tables.
- Client queries always target `aprendizz_*` tables.
- RLS policies reference `auth.uid()` from the shared Auth.
