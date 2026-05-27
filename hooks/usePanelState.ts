'use client'

import { useCallback, useRef, useState } from 'react'
import type { BottomTab } from '@/components/BottomPanel'
import type { SidePanel } from '@/components/ActivityBar'
import type { AiFileAction } from '@/lib/fileSystem'

// Exported so VSCodeLayout can reference ZOOM_LEVELS without re-importing
export const ZOOM_LEVELS = [0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5]

export function usePanelState() {
  const [sidePanel, setSidePanel]               = useState<SidePanel>(null)
  const [terminalOpen, setTerminalOpen]         = useState(false)
  const [copilotOpen, setCopilotOpen]           = useState(false)
  const [bugReportTrigger, setBugReportTrigger] = useState(0)
  const [palOpen, setPalOpen]                   = useState(false)
  const [searchQuery, setSearchQuery]           = useState('')
  const [aiThinking, setAiThinking]             = useState(false)
  const [lastCommand, setLastCommand]           = useState<string | null>(null)
  const [zoomIdx, setZoomIdx]                   = useState(3)
  const [aboutOpen, setAboutOpen]               = useState(false)
  const [shortcutsOpen, setShortcutsOpen]       = useState(false)
  const [sourceControlOpen, setSourceControlOpen] = useState(false)
  const [settingsOpen, setSettingsOpen]         = useState(false)
  const [selectedTheme, setSelectedTheme]       = useState('default')
  const [pendingAiAction, setPendingAiAction]   = useState<AiFileAction | null>(null)
  const [bottomTab, setBottomTab]               = useState<BottomTab>('TERMINAL')
  const pendingActionResultRef = useRef<((applied: boolean) => void) | null>(null)

  const toggleSide = useCallback((panel: SidePanel) => {
    setSidePanel(prev => prev === panel ? null : panel)
  }, [])

  function toggleTerminal() { setTerminalOpen(v => !v) }
  function toggleCopilot()  { setCopilotOpen(v => !v) }
  function openBugReport()  { setCopilotOpen(true); setBugReportTrigger(n => n + 1) }

  function applyTheme(theme: string) {
    setSelectedTheme(theme)
    if (theme === 'default') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
  }

  function enterFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {})
    else document.exitFullscreen().catch(() => {})
  }

  return {
    sidePanel, setSidePanel,
    terminalOpen, setTerminalOpen,
    copilotOpen, setCopilotOpen,
    bugReportTrigger,
    palOpen, setPalOpen,
    searchQuery, setSearchQuery,
    aiThinking, setAiThinking,
    lastCommand, setLastCommand,
    zoomIdx, setZoomIdx,
    aboutOpen, setAboutOpen,
    shortcutsOpen, setShortcutsOpen,
    sourceControlOpen, setSourceControlOpen,
    settingsOpen, setSettingsOpen,
    selectedTheme,
    pendingAiAction, setPendingAiAction,
    pendingActionResultRef,
    bottomTab, setBottomTab,
    toggleSide, toggleTerminal, toggleCopilot, openBugReport,
    applyTheme, enterFullscreen,
  }
}
