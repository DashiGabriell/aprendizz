import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { gradeFreeTextWithOpenRouter } from './server/gradeTextAgent.ts'

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function gradeTextDevPlugin(apiKey: string) {
  return {
    name: 'aprendizz-grade-text-api',
    configureServer(server: { middlewares: { use: (path: string, fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use('/api/grade-text', (req, res, next) => {
        void (async () => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }
          if (req.method !== 'POST') {
            sendJson(res, 405, { error: 'Method not allowed' })
            return
          }
          try {
            const body = (await readJsonBody(req)) as {
              prompt?: string
              answer?: string
              lessonTitle?: string
              objectives?: string[]
            }
            if (!body?.prompt?.trim() || !body?.answer?.trim() || !body?.lessonTitle?.trim()) {
              sendJson(res, 400, { error: 'prompt, answer e lessonTitle são obrigatórios' })
              return
            }
            if (!apiKey) {
              sendJson(res, 500, { error: 'API_KEY_OPENROUTER não configurada no .env' })
              return
            }
            const result = await gradeFreeTextWithOpenRouter(
              {
                prompt: body.prompt,
                answer: body.answer,
                lessonTitle: body.lessonTitle,
                objectives: Array.isArray(body.objectives) ? body.objectives : [],
              },
              apiKey,
            )
            sendJson(res, 200, result)
          } catch (err) {
            sendJson(res, 502, {
              error: err instanceof Error ? err.message : 'Falha ao corrigir texto',
            })
          }
        })().catch(next)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const openRouterKey = env.API_KEY_OPENROUTER ?? process.env.API_KEY_OPENROUTER ?? ''

  return {
    plugins: [react(), tailwindcss(), gradeTextDevPlugin(openRouterKey)],
    test: {
      environment: 'jsdom',
      globals: true,
    },
  }
})
