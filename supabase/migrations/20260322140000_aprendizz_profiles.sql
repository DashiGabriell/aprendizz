-- Aprendizz profiles + avatar storage (shared project, aprendizz_ prefix)

create table if not exists public.aprendizz_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aprendizz_profiles enable row level security;

drop policy if exists aprendizz_profiles_select_own on public.aprendizz_profiles;
create policy aprendizz_profiles_select_own
  on public.aprendizz_profiles for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists aprendizz_profiles_insert_own on public.aprendizz_profiles;
create policy aprendizz_profiles_insert_own
  on public.aprendizz_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists aprendizz_profiles_update_own on public.aprendizz_profiles;
create policy aprendizz_profiles_update_own
  on public.aprendizz_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'aprendizz_avatars',
  'aprendizz_avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists aprendizz_avatars_public_read on storage.objects;
create policy aprendizz_avatars_public_read
  on storage.objects for select
  to public
  using (bucket_id = 'aprendizz_avatars');

drop policy if exists aprendizz_avatars_insert_own on storage.objects;
create policy aprendizz_avatars_insert_own
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'aprendizz_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists aprendizz_avatars_update_own on storage.objects;
create policy aprendizz_avatars_update_own
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'aprendizz_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'aprendizz_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists aprendizz_avatars_delete_own on storage.objects;
create policy aprendizz_avatars_delete_own
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'aprendizz_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
