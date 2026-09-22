import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cacheClear,
  cacheGet,
  cacheGetOrFetch,
  cacheInvalidate,
  cacheSet,
  invalidateUserProgressViews,
} from './queryCache'

afterEach(() => {
  cacheClear()
})

describe('queryCache', () => {
  it('returns cached value without calling fetcher again', async () => {
    const fetcher = vi.fn(async () => ({ data: 1, error: null }))
    const a = await cacheGetOrFetch('k1', fetcher, { shouldCache: (v) => !v.error })
    const b = await cacheGetOrFetch('k1', fetcher, { shouldCache: (v) => !v.error })
    expect(a).toEqual({ data: 1, error: null })
    expect(b).toEqual({ data: 1, error: null })
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('dedupes concurrent fetches', async () => {
    let resolve!: (value: string) => void
    const fetcher = vi.fn(
      () =>
        new Promise<string>((r) => {
          resolve = r
        }),
    )
    const p1 = cacheGetOrFetch('k2', fetcher)
    const p2 = cacheGetOrFetch('k2', fetcher)
    expect(fetcher).toHaveBeenCalledTimes(1)
    resolve('ok')
    await expect(Promise.all([p1, p2])).resolves.toEqual(['ok', 'ok'])
  })

  it('does not cache failed results when shouldCache returns false', async () => {
    type R = { error: string | null; data?: number }
    const fetcher = vi
      .fn<() => Promise<R>>()
      .mockResolvedValueOnce({ error: 'boom' })
      .mockResolvedValueOnce({ error: null, data: 2 })
    const first = await cacheGetOrFetch('k3', fetcher, { shouldCache: (v) => !v.error })
    const second = await cacheGetOrFetch('k3', fetcher, { shouldCache: (v) => !v.error })
    expect(first).toEqual({ error: 'boom' })
    expect(second).toEqual({ error: null, data: 2 })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('invalidates user progress views by prefix', () => {
    cacheSet('courses:u1', { data: [] })
    cacheSet('tree:u1:backend', { data: null })
    cacheSet('userprog:u1:lp:x', { data: null })
    cacheSet('lesson:slug-a', { data: { id: 1 } })
    invalidateUserProgressViews('u1')
    expect(cacheGet('courses:u1')).toBeUndefined()
    expect(cacheGet('tree:u1:backend')).toBeUndefined()
    expect(cacheGet('userprog:u1:lp:x')).toBeUndefined()
    expect(cacheGet('lesson:slug-a')).toEqual({ data: { id: 1 } })
  })

  it('cacheInvalidate removes exact and prefix keys', () => {
    cacheSet('profile:u1', { name: 'A' })
    cacheSet('profile:u2', { name: 'B' })
    cacheInvalidate('profile:u1')
    expect(cacheGet('profile:u1')).toBeUndefined()
    expect(cacheGet('profile:u2')).toEqual({ name: 'B' })
  })
})
