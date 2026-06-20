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

    return () => {
      clearTimeout(importTimer)
    }
  }, [])
}
