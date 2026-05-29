import { useEffect, useRef } from 'react'
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { PREFETCH_QUERIES, fetchFullResponse } from '@/features/copilot/lib/fetchChat'

export function usePrefetchCache(
  setMsgsLeft: Dispatch<SetStateAction<number | null>>,
): MutableRefObject<Map<string, string>> {
  const prefetchCache = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    let cancelled = false

    // Stagger requests to avoid hammering the API
    PREFETCH_QUERIES.forEach((query, i) => {
      setTimeout(() => {
        if (cancelled || prefetchCache.current.has(query)) return
        fetchFullResponse(query)
          .then(({ text, remaining }) => {
            if (!cancelled && text) prefetchCache.current.set(query, text)
            if (!cancelled && remaining !== null && remaining >= 0) setMsgsLeft(remaining)
          })
          .catch(() => { /* prefetch failures are silent */ })
      }, i * 600)
    })

    return () => { cancelled = true }
  }, [setMsgsLeft])

  return prefetchCache
}
