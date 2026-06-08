'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { Components } from 'react-markdown'

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), { ssr: false })

interface Props {
  content: string
}


const components: Components = {
  img({ src, alt }) {
    const s = typeof src === 'string' ? src : ''
    const proxied =
      s.includes('shields.io') || s.includes('skillicons.dev')
        ? `/api/proxy-image?url=${encodeURIComponent(s)}`
        : s
    return <img src={proxied} alt={alt ?? ''} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
  },
  code({ className, children }) {
    const lang = (className ?? '').replace('language-', '')
    const raw = String(children).replace(/\n$/, '')
    if (lang === 'mermaid') {
      return <MermaidDiagram chart={raw} />
    }
    return (
      <code className={className}>
        {children}
      </code>
    )
  },
}

export default function MarkdownRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(content)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), 300)
    return () => clearTimeout(t)
  }, [content])

  return (
    <div className="h-full overflow-y-auto panel-scroll px-8 py-6 prose-vsc" style={{ maxWidth: 'none' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {debounced}
      </ReactMarkdown>
    </div>
  )
}
