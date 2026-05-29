'use client'

import { useEffect } from 'react'

export function useEditorPrefetch() {
  useEffect(() => {
    // Warm up dynamic imports so first tab click is instant
    import('@monaco-editor/react')
    import('@/components/renderers/MarkdownRenderer')
    import('@/components/renderers/HTMLRenderer')
    import('@/components/renderers/LiveCodeRenderer')

    // Warm up edge functions + OpenRouter connection.
    // Chat uses SSE — abort via signal immediately after headers to avoid ECONNRESET.
    // ai-action is non-streaming — let it complete (fast, primes the model).
    const ctrl = new AbortController()
    fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
      signal:  ctrl.signal,
    }).catch(() => {})
    ctrl.abort()

    fetch('/api/ai-action', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: 'hi' }),
    }).catch(() => {})
  }, [])
}
