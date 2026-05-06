'use client'

import { useEffect, useState } from 'react'

interface Props {
  content: string
}

export default function HTMLRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(content)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), 300)
    return () => clearTimeout(t)
  }, [content])

  return (
    <iframe
      sandbox="allow-scripts"
      srcDoc={debounced}
      className="w-full h-full border-0 bg-white"
      title="HTML Preview"
    />
  )
}
