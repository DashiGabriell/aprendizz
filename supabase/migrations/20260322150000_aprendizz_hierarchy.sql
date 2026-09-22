-- Hierarchy: Matéria → Módulo → Aula (+ avaliação de fim de módulo)
-- Prefix: aprendizz_

create table if not exists public.aprendizz_subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description_md text not null default '',
  sort_order integer not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aprendizz_modules (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.aprendizz_subjects(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description_md text not null default '',
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, sort_order)
);

create index if not exists aprendizz_modules_subject_idx on public.aprendizz_modules (subject_id, sort_order);

alter table public.aprendizz_subjects enable row level security;
alter table public.aprendizz_modules enable row level security;

drop policy if exists aprendizz_subjects_select_authenticated on public.aprendizz_subjects;
create policy aprendizz_subjects_select_authenticated
  on public.aprendizz_subjects for select
  to authenticated
  using (true);

drop policy if exists aprendizz_modules_select_authenticated on public.aprendizz_modules;
create policy aprendizz_modules_select_authenticated
  on public.aprendizz_modules for select
  to authenticated
  using (true);

-- Extend lessons for hierarchy
alter table public.aprendizz_lessons
  add column if not exists module_id uuid references public.aprendizz_modules(id) on delete cascade;

alter table public.aprendizz_lessons
  add column if not exists kind text not null default 'lesson';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'aprendizz_lessons_kind_check'
  ) then
    alter table public.aprendizz_lessons
      add constraint aprendizz_lessons_kind_check check (kind in ('lesson', 'assessment'));
  end if;
end $$;

create index if not exists aprendizz_lessons_module_idx on public.aprendizz_lessons (module_id, sort_order);

-- Clear legacy flat curriculum before hierarchical reseed
truncate table
  public.aprendizz_exercise_submissions,
  public.aprendizz_lesson_progress,
  public.aprendizz_exercises,
  public.aprendizz_lessons
restart identity cascade;

truncate table public.aprendizz_modules, public.aprendizz_subjects restart identity cascade;
