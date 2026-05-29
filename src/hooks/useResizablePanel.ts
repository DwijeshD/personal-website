'use client'

import { useState } from 'react'
import type React from 'react'

export function useResizablePanel(defaultHeight = 240) {
  const [height, setHeight]         = useState(defaultHeight)
  const [isResizing, setIsResizing] = useState(false)

  function startResize(e: React.MouseEvent) {
    e.preventDefault()
    const startY = e.clientY
    const startH = height
    setIsResizing(true)

    function cleanup() {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    function onMove(ev: MouseEvent) {
      if (ev.buttons === 0) { cleanup(); return }
      setHeight(Math.max(100, Math.min(500, startH + (startY - ev.clientY))))
    }
    function onUp() { cleanup() }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return { height, isResizing, startResize }
}
