'use client'

import { useEffect } from 'react'

export function useEditorPrefetch() {
  useEffect(() => {
    // Defer heavy imports until after initial paint + hydration settles
    const importTimer = setTimeout(() => {
      import('@monaco-editor/react')
      import('@/components/renderers/MarkdownRenderer')
      import('@/components/renderers/HTMLRenderer')
      import('@/components/renderers/LiveCodeRenderer')
    }, 2000)

    // Warm up edge functions after user has had time to interact
    const apiTimer = setTimeout(() => {
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
    }, 5000)

    return () => {
      clearTimeout(importTimer)
      clearTimeout(apiTimer)
    }
  }, [])
}
