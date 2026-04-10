import { useState, useCallback, useEffect } from 'react'

/**
 * Drop-in replacement for @github/spark useKV hook.
 * Uses localStorage instead of Spark KV to avoid rate limiting in local dev.
 */
export function useKV<T>(key: string, defaultValue?: T): [T | undefined, (updater: (prev: T | undefined) => T) => void] {
  const [value, setValue] = useState<T | undefined>(() => {
    try {
      const stored = localStorage.getItem(`spark-kv:${key}`)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // ignore parse errors
    }
    return defaultValue
  })

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === `spark-kv:${key}` && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T)
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key])

  const setKV = useCallback((updater: (prev: T | undefined) => T) => {
    setValue(prev => {
      const next = updater(prev)
      try {
        localStorage.setItem(`spark-kv:${key}`, JSON.stringify(next))
      } catch {
        // storage full, ignore
      }
      return next
    })
  }, [key])

  return [value, setKV]
}
