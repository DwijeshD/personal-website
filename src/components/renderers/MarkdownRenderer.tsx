'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Props {
  content: string
}

export default function MarkdownRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(content)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), 300)
    return () => clearTimeout(t)
  }, [content])

  return (
    <div className="h-full overflow-y-auto panel-scroll px-8 py-6 prose-vsc" style={{ maxWidth: 'none' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {debounced}
      </ReactMarkdown>
    </div>
  )
}
