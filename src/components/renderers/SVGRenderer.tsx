'use client'

import { useEffect, useState } from 'react'

const DARK_BASE = `<style>
html, body { margin: 0; padding: 16px; background: #1e1e1e; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
svg { max-width: 100%; max-height: 100%; }
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #555; }
</style>`

function wrap(svg: string): string {
  return `<!DOCTYPE html><html><head>${DARK_BASE}</head><body>${svg}</body></html>`
}

interface Props {
  content: string
}

export default function SVGRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(() => wrap(content))

  useEffect(() => {
    const t = setTimeout(() => setDebounced(wrap(content)), 300)
    return () => clearTimeout(t)
  }, [content])

  return (
    <iframe
      sandbox="allow-scripts"
      srcDoc={debounced}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="SVG Preview"
    />
  )
}
