-- Aprendizz schema (shared Supabase project). All resources prefixed aprendizz_

create extension if not exists "pgcrypto";

create table if not exists public.aprendizz_lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order integer not null unique,
  title text not null,
  phase text not null,
  objectives text[] not null default '{}',
  content_md text not null,
  unlocked_by_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aprendizz_exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.aprendizz_lessons(id) on delete cascade,
  mcq jsonb not null default '[]'::jsonb,
  free_text_prompt text not null,
  code_prompt text not null,
  starter_code text not null default '',
  tests jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aprendizz_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.aprendizz_lessons(id) on delete cascade,
  status text not null check (status in ('locked', 'available', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.aprendizz_exercise_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.aprendizz_exercises(id) on delete cascade,
  lesson_id uuid not null references public.aprendizz_lessons(id) on delete cascade,
  mcq_answers jsonb not null default '{}'::jsonb,
  free_text_answer text not null default '',
  code_answer text not null default '',
  mcq_passed boolean not null default false,
  code_passed boolean not null default false,
  free_text_submitted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, exercise_id)
);

create index if not exists aprendizz_lessons_sort_order_idx on public.aprendizz_lessons (sort_order);
create index if not exists aprendizz_lesson_progress_user_idx on public.aprendizz_lesson_progress (user_id);
create index if not exists aprendizz_exercise_submissions_user_idx on public.aprendizz_exercise_submissions (user_id);

alter table public.aprendizz_lessons enable row level security;
alter table public.aprendizz_exercises enable row level security;
alter table public.aprendizz_lesson_progress enable row level security;
alter table public.aprendizz_exercise_submissions enable row level security;

drop policy if exists aprendizz_lessons_select_authenticated on public.aprendizz_lessons;
create policy aprendizz_lessons_select_authenticated
  on public.aprendizz_lessons for select
  to authenticated
  using (true);

drop policy if exists aprendizz_exercises_select_authenticated on public.aprendizz_exercises;
create policy aprendizz_exercises_select_authenticated
  on public.aprendizz_exercises for select
  to authenticated
  using (true);

drop policy if exists aprendizz_lesson_progress_select_own on public.aprendizz_lesson_progress;
create policy aprendizz_lesson_progress_select_own
  on public.aprendizz_lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists aprendizz_lesson_progress_insert_own on public.aprendizz_lesson_progress;
create policy aprendizz_lesson_progress_insert_own
  on public.aprendizz_lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists aprendizz_lesson_progress_update_own on public.aprendizz_lesson_progress;
create policy aprendizz_lesson_progress_update_own
  on public.aprendizz_lesson_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists aprendizz_exercise_submissions_select_own on public.aprendizz_exercise_submissions;
create policy aprendizz_exercise_submissions_select_own
  on public.aprendizz_exercise_submissions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists aprendizz_exercise_submissions_insert_own on public.aprendizz_exercise_submissions;
create policy aprendizz_exercise_submissions_insert_own
  on public.aprendizz_exercise_submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists aprendizz_exercise_submissions_update_own on public.aprendizz_exercise_submissions;
create policy aprendizz_exercise_submissions_update_own
  on public.aprendizz_exercise_submissions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
