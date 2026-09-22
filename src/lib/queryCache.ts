type CacheEntry<T> = {
  value: T
  expiresAt: number
}

type Inflight = Promise<unknown>

const store = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Inflight>()

/** Default TTL: curriculum rarely changes within a session. */
export const CACHE_TTL_MS = 5 * 60 * 1000

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return undefined
  }
  return entry.value as T
}

export function cacheSet<T>(key: string, value: T, ttlMs = CACHE_TTL_MS): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export function cacheInvalidate(prefixOrKey: string): void {
  for (const key of store.keys()) {
    if (key === prefixOrKey || key.startsWith(prefixOrKey)) {
      store.delete(key)
    }
  }
  for (const key of inflight.keys()) {
    if (key === prefixOrKey || key.startsWith(prefixOrKey)) {
      inflight.delete(key)
    }
  }
}

export function cacheClear(): void {
  store.clear()
  inflight.clear()
}

/**
 * Return cached value or run fetcher once (shared across concurrent callers).
 * By default every resolved value is stored; pass `shouldCache` to skip failures.
 */
export async function cacheGetOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttlMs?: number; shouldCache?: (value: T) => boolean },
): Promise<T> {
  const ttlMs = options?.ttlMs ?? CACHE_TTL_MS
  const hit = cacheGet<T>(key)
  if (hit !== undefined) return hit

  const pending = inflight.get(key) as Promise<T> | undefined
  if (pending) return pending

  const request = (async () => {
    try {
      const value = await fetcher()
      if (!options?.shouldCache || options.shouldCache(value)) {
        cacheSet(key, value, ttlMs)
      }
      return value
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, request)
  return request
}

export const cacheKeys = {
  progressEnsured: (userId: string) => `progress:ensured:${userId}`,
  courses: (userId: string) => `courses:${userId}`,
  tree: (userId: string, courseSlug: string) => `tree:${userId}:${courseSlug}`,
  treeDefault: (userId: string) => `tree:${userId}:__default__`,
  profile: (userId: string) => `profile:${userId}`,
  lesson: (slug: string) => `lesson:${slug}`,
  module: (moduleId: string) => `module:${moduleId}`,
  exercise: (lessonId: string) => `exercise:${lessonId}`,
  neighbors: (sortOrder: number) => `neighbors:${sortOrder}`,
  userProgressPrefix: (userId: string) => `userprog:${userId}:`,
  submission: (userId: string, exerciseId: string) => `userprog:${userId}:sub:${exerciseId}`,
  lessonProgress: (userId: string, lessonId: string) => `userprog:${userId}:lp:${lessonId}`,
} as const

/** Drop course lists + trees + progress snapshots after unlock/complete. */
export function invalidateUserProgressViews(userId: string): void {
  cacheInvalidate(cacheKeys.courses(userId))
  cacheInvalidate(`tree:${userId}:`)
  cacheInvalidate(cacheKeys.userProgressPrefix(userId))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aprendizz-progress-updated', { detail: { userId } }))
  }
}
