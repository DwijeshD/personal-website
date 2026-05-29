'use client'

import { useEffect, useRef } from 'react'

export interface KeyboardHandlers {
  openPalette:     () => void
  closeTab:        (id: string) => void
  closeAllTabs:    () => void
  openHomeTab:     () => void
  toggleSidebar:   () => void
  toggleTerminal:  () => void
  toggleCopilot:   () => void
  enterFullscreen: () => void
  zoomIn:          () => void
  zoomOut:         () => void
  resetZoom:       () => void
  closePalette:    () => void
}

export function useKeyboardShortcuts(handlers: KeyboardHandlers, activeTab: string) {
  // Stable ref so onKey never captures stale callbacks
  const ref = useRef(handlers)
  useEffect(() => { ref.current = handlers })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const h    = ref.current
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === 'p')                              { e.preventDefault(); h.openPalette() }
      if (ctrl && e.key === 'w')                              { e.preventDefault(); if (activeTab) h.closeTab(activeTab) }
      if (ctrl && e.shiftKey && e.key === 'W')                { e.preventDefault(); h.closeAllTabs() }
      if (ctrl && e.key === 't')                              { e.preventDefault(); h.openHomeTab() }
      if (ctrl && e.key === 'b')                              { e.preventDefault(); h.toggleSidebar() }
      if (ctrl && e.key === '`')                              { e.preventDefault(); h.toggleTerminal() }
      if (ctrl && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); h.toggleCopilot() }
      if (e.key === 'F11')                                    { e.preventDefault(); h.enterFullscreen() }
      if (ctrl && (e.key === '=' || e.key === '+'))           { e.preventDefault(); h.zoomIn() }
      if (ctrl && e.key === '-')                              { e.preventDefault(); h.zoomOut() }
      if (ctrl && e.key === '0')                              { e.preventDefault(); h.resetZoom() }
      if (e.key === 'Escape')                                 { h.closePalette() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeTab]) // re-register only when activeTab changes
}
