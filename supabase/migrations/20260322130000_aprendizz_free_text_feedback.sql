-- Optional AI feedback for free-text answers
alter table public.aprendizz_exercise_submissions
  add column if not exists free_text_feedback text not null default '';
