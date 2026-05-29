'use client'

import { useEffect, useState } from 'react'

const THINKING_WORDS = [
  'Thinking', 'Reasoning', 'Cogitating', 'Computing',
  'Pondering', 'Deliberating', 'Ruminating', 'Considering',
]

export function ThinkingIndicator() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % THINKING_WORDS.length), 1500)
    return () => clearInterval(t)
  }, [])
  return <span className="text-vsc-muted/50 text-xs italic">{THINKING_WORDS[idx]}&hellip;</span>
}
