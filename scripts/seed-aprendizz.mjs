/**
 * Seeds hierarchical curriculum: Matéria → Módulo → Aula (+ avaliação).
 * Usage: node --env-file=.env scripts/seed-aprendizz.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { curriculumData } from './curriculum-data.mjs'
import { withLessonDiagram } from './lesson-diagrams.mjs'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
/** JWT service_role (eyJ…) — required for upsert bypassing RLS. sbp_ is Management API only. */
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY

if (!url || !serviceKey) {
  console.error(
    'Missing SUPABASE_URL (or VITE_SUPABASE_URL) and a service role key (SUPABASE_SERVICE_ROLE_SECRET).',
  )
  process.exit(1)
}

if (serviceKey.startsWith('sbp_')) {
  console.error(
    'SUPABASE_TOKEN (sbp_…) is the Management API token, not a PostgREST key. Use SUPABASE_SERVICE_ROLE_SECRET for seed.',
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  const { subject, modules } = curriculumData
  console.log('Seeding subject', subject.slug)

  const { data: subjectRow, error: subjectError } = await supabase
    .from('aprendizz_subjects')
    .upsert(
      {
        slug: subject.slug,
        title: subject.title,
        description_md: subject.description_md,
        sort_order: subject.sort_order,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' },
    )
    .select('id')
    .single()

  if (subjectError) {
    console.error(subjectError.message)
    process.exit(1)
  }

  let globalOrder = 0

  for (const mod of modules) {
    const { data: moduleRow, error: moduleError } = await supabase
      .from('aprendizz_modules')
      .upsert(
        {
          subject_id: subjectRow.id,
          slug: mod.slug,
          title: mod.title,
          description_md: mod.description_md,
          sort_order: mod.sort_order,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single()

    if (moduleError) {
      console.error('Module', mod.slug, moduleError.message)
      process.exit(1)
    }

    for (const lesson of mod.lessons) {
      globalOrder += 1
      const content = withLessonDiagram(lesson.slug, lesson.content_md)
      const { data: lessonRow, error: lessonError } = await supabase
        .from('aprendizz_lessons')
        .upsert(
          {
            module_id: moduleRow.id,
            slug: lesson.slug,
            sort_order: globalOrder,
            title: lesson.title,
            phase: mod.title,
            kind: lesson.kind,
            objectives: lesson.objectives,
            content_md: content,
            unlocked_by_default: Boolean(lesson.unlocked_by_default),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' },
        )
        .select('id')
        .single()

      if (lessonError) {
        console.error('Lesson', lesson.slug, lessonError.message)
        process.exit(1)
      }

      const { error: exErr } = await supabase.from('aprendizz_exercises').upsert(
        {
          lesson_id: lessonRow.id,
          mcq: lesson.mcq,
          free_text_prompt: lesson.free_text_prompt ?? '',
          code_prompt: lesson.code_prompt ?? '',
          starter_code: lesson.starter_code ?? '',
          tests: lesson.tests ?? [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'lesson_id' },
      )

      if (exErr) {
        console.error('Exercise', lesson.slug, exErr.message)
        process.exit(1)
      }

      console.log('✓', globalOrder, mod.slug, lesson.slug, `(${lesson.kind})`)
    }
  }

  console.log('Done.', globalOrder, 'units')
}

main()
