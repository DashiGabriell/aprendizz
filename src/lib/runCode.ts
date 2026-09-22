import { transform } from 'sucrase'
import type { CodeTest } from './types'

export type RunCodeResult = {
  passed: boolean
  results: Array<{ name: string; ok: boolean; error?: string }>
  logs: string[]
}

function transpile(code: string): string {
  // Strip ESM exports so function declarations stay on the iframe global scope for asserts.
  const prepared = code
    .replace(/^export\s+type[\s\S]*?;$/gm, '')
    .replace(/export\s+async\s+function/g, 'async function')
    .replace(/export\s+function/g, 'function')
    .replace(/export\s+const/g, 'const')
    .replace(/export\s+\{[^}]+\};?/g, '')

  return transform(prepared, {
    transforms: ['typescript'],
  }).code
}

export async function runStudentCode(
  source: string,
  tests: CodeTest[],
  timeoutMs = 2500,
): Promise<RunCodeResult> {
  let js: string
  try {
    js = transpile(source)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      passed: false,
      results: tests.map((t) => ({ name: t.name, ok: false, error: `Transpile: ${message}` })),
      logs: [],
    }
  }

  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.sandbox.add('allow-scripts')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const logs: string[] = []
    let settled = false

    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      iframe.remove()
    }

    const finish = (result: RunCodeResult) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      cleanup()
      resolve(result)
    }

    const timer = window.setTimeout(() => {
      finish({
        passed: false,
        results: tests.map((t) => ({ name: t.name, ok: false, error: 'Timeout' })),
        logs,
      })
    }, timeoutMs)

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return
      const data = event.data as { type?: string; results?: RunCodeResult['results']; logs?: string[] }
      if (data?.type !== 'aprendizz-run-result') return
      const results = data.results ?? []
      finish({
        passed: results.length > 0 && results.every((r) => r.ok),
        results,
        logs: data.logs ?? logs,
      })
    }

    window.addEventListener('message', onMessage)

    const testPayload = JSON.stringify(tests)
    const srcdoc = `<!DOCTYPE html><html><body><script>
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => { logs.push(args.map(String).join(' ')); originalLog(...args); };
      try {
        ${js}
        const tests = ${testPayload};
        const results = tests.map((t) => {
          try {
            const ok = Boolean((0, eval)(t.assert));
            return { name: t.name, ok, error: ok ? undefined : 'Assertion failed' };
          } catch (e) {
            return { name: t.name, ok: false, error: String(e && e.message ? e.message : e) };
          }
        });
        parent.postMessage({ type: 'aprendizz-run-result', results, logs }, '*');
      } catch (e) {
        parent.postMessage({
          type: 'aprendizz-run-result',
          results: [{ name: 'runtime', ok: false, error: String(e && e.message ? e.message : e) }],
          logs
        }, '*');
      }
    <\/script></body></html>`

    iframe.srcdoc = srcdoc
  })
}
