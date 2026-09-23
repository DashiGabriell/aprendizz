-- Tutor chat memory (per user + lesson)

create table if not exists public.aprendizz_tutor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.aprendizz_lessons(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists aprendizz_tutor_messages_user_lesson_idx
  on public.aprendizz_tutor_messages (user_id, lesson_id, created_at);

create index if not exists aprendizz_tutor_messages_user_created_idx
  on public.aprendizz_tutor_messages (user_id, created_at desc);

alter table public.aprendizz_tutor_messages enable row level security;

drop policy if exists aprendizz_tutor_messages_select_own on public.aprendizz_tutor_messages;
create policy aprendizz_tutor_messages_select_own
  on public.aprendizz_tutor_messages for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists aprendizz_tutor_messages_insert_own on public.aprendizz_tutor_messages;
create policy aprendizz_tutor_messages_insert_own
  on public.aprendizz_tutor_messages for insert
  to authenticated
  with check (auth.uid() = user_id);
