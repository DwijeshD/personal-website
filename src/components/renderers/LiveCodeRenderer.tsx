'use client'
import { useEffect, useState } from 'react'
import { buildDoc } from '@/features/renderer/lib/syntaxHighlight'

interface Props {
  filename: string
  content: string
}

export default function LiveCodeRenderer({ filename, content }: Props) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const delay = (ext === 'tsx' || ext === 'jsx') ? 800 : 400
  const [debounced, setDebounced] = useState(content)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), delay)
    return () => clearTimeout(t)
  }, [content, delay])
  const { html, isScript } = buildDoc(ext, debounced)
  return (
    <iframe
      key={isScript ? debounced : undefined}
      sandbox={isScript ? 'allow-scripts allow-popups' : 'allow-popups'}
      srcDoc={html}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="Code Preview"
    />
  )
}
