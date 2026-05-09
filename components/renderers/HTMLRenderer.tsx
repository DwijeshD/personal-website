'use client'

import { useEffect, useState } from 'react'

interface Props {
  content: string
}

function injectBaseTarget(html: string): string {
  return /<head>/i.test(html)
    ? html.replace(/<head>/i, '<head><base target="_blank">')
    : '<base target="_blank">' + html
}

export default function HTMLRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(content)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), 300)
    return () => clearTimeout(t)
  }, [content])

  return (
    <iframe
      sandbox="allow-popups"
      srcDoc={injectBaseTarget(debounced)}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="HTML Preview"
    />
  )
}
