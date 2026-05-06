'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import TitleBar from './TitleBar'
import ActivityBar from './ActivityBar'
import Sidebar from './Sidebar'
import TabBar from './TabBar'
import StatusBar from './StatusBar'
import CommandPalette from './CommandPalette'
import BottomPanel from './BottomPanel'
import CopilotPanel from './CopilotPanel'
import AboutModal from './modals/AboutModal'
import KeyboardShortcutsModal from './modals/KeyboardShortcutsModal'
import HomePanel from './panels/HomePanel'
import AboutPanel from './panels/AboutPanel'
import ProjectsPanel from './panels/ProjectsPanel'
import SkillsPanel from './panels/SkillsPanel'
import ExperiencePanel from './panels/ExperiencePanel'
import ContactPanel from './panels/ContactPanel'
import ReadmePanel from './panels/ReadmePanel'
import ResumePanel from './panels/ResumePanel'
import FileEditorPanel, { type ViewMode } from './panels/FileEditorPanel'
import SourceControlPopup from './SourceControlPopup'
import SettingsPopup from './SettingsPopup'
import AiActionModal from './AiActionModal'
import { TABS } from '@/lib/data'
import { DEFAULT_CONTENT } from '@/lib/defaultContent'
import type { TerminalHandle } from './TerminalTab'
import type { SidePanel } from './ActivityBar'
import type { CustomFile, CustomFolder, AiFileAction } from '@/lib/fileSystem'

const BREADCRUMB: Record<string, string> = {
  home:       'home.tsx',
  about:      'about.html',
  projects:   'projects.js',
  skills:     'skills.json',
  experience: 'experience.ts',
  contact:    'contact.css',
  readme:     'README.md',
  resume:     'Dwijesh_Dookraz_Resume.pdf',
}

const ZOOM_LEVELS = [0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5]

export default function VSCodeLayout() {
  const [openTabs, setOpenTabs]           = useState<string[]>(['home'])
  const [activeTab, setActiveTab]         = useState('home')
  const [sidePanel, setSidePanel]         = useState<SidePanel>('explorer')
  const [terminalOpen, setTerminalOpen]   = useState(false)
  const [copilotOpen, setCopilotOpen]     = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(240)
  const [palOpen, setPalOpen]             = useState(false)
  const [searchQuery, setSearchQuery]     = useState('')
  const [aiThinking, setAiThinking]       = useState(false)
  const [recentFiles, setRecentFiles]     = useState<string[]>([])
  const [lastCommand, setLastCommand]     = useState<string | null>(null)
  const [zoomIdx, setZoomIdx]             = useState(3)
  const [aboutOpen, setAboutOpen]                 = useState(false)
  const [shortcutsOpen, setShortcutsOpen]         = useState(false)
  const [sourceControlOpen, setSourceControlOpen] = useState(false)
  const [settingsOpen, setSettingsOpen]           = useState(false)
  const [selectedTheme, setSelectedTheme]         = useState('default')
  const [fileContents, setFileContents]           = useState<Record<string, string>>({})
  const [fileModes, setFileModes]                 = useState<Record<string, ViewMode>>({})
  const [hiddenBuiltins, setHiddenBuiltins]       = useState<string[]>([])
  const [customFiles, setCustomFiles]             = useState<CustomFile[]>([])
  const [customFolders, setCustomFolders]         = useState<CustomFolder[]>([])
  const [pendingAiAction, setPendingAiAction]     = useState<AiFileAction | null>(null)

  const terminalRef = useRef<TerminalHandle | null>(null)
  const zoom = ZOOM_LEVELS[zoomIdx]

  const navigate = useCallback((id: string) => {
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setActiveTab(id)
    setRecentFiles((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 8))
  }, [])

  const closeTab = useCallback((id: string) => {
    setOpenTabs((prev) => {
      const next = prev.filter((t) => t !== id)
      if (activeTab === id && next.length > 0) setActiveTab(next[next.length - 1])
      return next
    })
  }, [activeTab])

  const toggleSide = useCallback((panel: SidePanel) => {
    setSidePanel((prev) => (prev === panel ? null : panel))
  }, [])

  function toggleTerminal() {
    setTerminalOpen((v) => !v)
  }

  function toggleCopilot() {
    setCopilotOpen((v) => !v)
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 'p')                              { e.preventDefault(); setPalOpen(true) }
      if (ctrl && e.key === 'w')                              { e.preventDefault(); if (activeTab) closeTab(activeTab) }
      if (ctrl && e.shiftKey && e.key === 'W')                { e.preventDefault(); setOpenTabs([]) }
      if (ctrl && e.key === 't')                              { e.preventDefault(); navigate('home') }
      if (ctrl && e.key === 'b')                              { e.preventDefault(); setSidePanel((p) => p ? null : 'explorer') }
      if (ctrl && e.key === '`')                              { e.preventDefault(); toggleTerminal() }
      if (ctrl && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); toggleCopilot() }
      if (e.key === 'F11')                                    { e.preventDefault(); enterFullscreen() }
      if (ctrl && (e.key === '=' || e.key === '+'))           { e.preventDefault(); setZoomIdx((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1)) }
      if (ctrl && e.key === '-')                              { e.preventDefault(); setZoomIdx((i) => Math.max(i - 1, 0)) }
      if (ctrl && e.key === '0')                              { e.preventDefault(); setZoomIdx(3) }
      if (e.key === 'Escape')                                 { setPalOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, closeTab, navigate])

  function applyTheme(theme: string) {
    setSelectedTheme(theme)
    if (theme === 'default') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
  }

  function enterFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {})
    else document.exitFullscreen().catch(() => {})
  }

  function executeAiAction(action: AiFileAction) {
    const { path, content = '' } = action
    const id = 'file:' + path
    switch (action.action) {
      case 'create_file':
        setCustomFiles(prev => prev.some(f => f.id === id) ? prev : [...prev, { id, name: path }])
        setFileContents(prev => ({ ...prev, [id]: content }))
        navigate(id)
        break
      case 'update_file':
        setFileContents(prev => ({ ...prev, [id]: content }))
        navigate(id)
        break
      case 'delete_file':
        setCustomFiles(prev => prev.filter(f => f.id !== id))
        setCustomFolders(prev => prev.map(folder => ({
          ...folder, files: folder.files.filter(f => f.id !== id),
        })))
        closeTab(id)
        setFileContents(prev => { const n = { ...prev }; delete n[id]; return n })
        setFileModes(prev => { const n = { ...prev }; delete n[id]; return n })
        break
      case 'create_folder': {
        const folderId = 'folder:' + path
        setCustomFolders(prev =>
          prev.some(f => f.id === folderId) ? prev : [...prev, { id: folderId, name: path, open: true, files: [] }]
        )
        break
      }
    }
    setPendingAiAction(null)
  }

  // Drag resize for terminal
  function startResize(e: React.MouseEvent) {
    e.preventDefault()
    const startY = e.clientY
    const startH = terminalHeight
    function onMove(ev: MouseEvent) {
      setTerminalHeight(Math.max(100, Math.min(500, startH + (startY - ev.clientY))))
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const activeFile = activeTab.startsWith('file:')
    ? activeTab.slice(5)
    : (BREADCRUMB[activeTab] ?? 'untitled')

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        transformOrigin: 'top left',
        transform: `scale(${zoom})`,
        width: `${100 / zoom}%`,
        height: `${100 / zoom}vh`,
      }}
    >
      <TitleBar
        onCommandPalette={() => setPalOpen(true)}
        onNewTab={() => navigate('home')}
        onOpenFile={() => setPalOpen(true)}
        onCloseTab={() => activeTab && closeTab(activeTab)}
        onCloseAllTabs={() => setOpenTabs([])}
        recentFiles={recentFiles}
        onOpenRecent={navigate}
        onFind={() => { setSidePanel('search'); setSearchQuery('') }}
        onSelectAll={() => document.execCommand('selectAll')}
        onCopy={() => {
          const s = window.getSelection()?.toString()
          if (s) navigator.clipboard.writeText(s).catch(() => {})
        }}
        onToggleSidebar={() => setSidePanel((p) => p ? null : 'explorer')}
        onToggleTerminal={toggleTerminal}
        onToggleCopilot={toggleCopilot}
        onEnterFullscreen={enterFullscreen}
        onZoomIn={() => setZoomIdx((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1))}
        onZoomOut={() => setZoomIdx((i) => Math.max(i - 1, 0))}
        onResetZoom={() => setZoomIdx(3)}
        onGoToFile={() => setPalOpen(true)}
        onNavigate={navigate}
        onStartTerminal={() => setTerminalOpen(true)}
        onRunLastCommand={() => {
          if (lastCommand && terminalRef.current) {
            setTerminalOpen(true)
            terminalRef.current.runCommand(lastCommand)
          }
        }}
        lastCommand={lastCommand}
        onNewTerminal={() => { terminalRef.current?.clear(); setTerminalOpen(true) }}
        onClearTerminal={() => terminalRef.current?.clear()}
        onShowShortcuts={() => setShortcutsOpen(true)}
        onAbout={() => setAboutOpen(true)}
        copilotActive={copilotOpen}
      />

      {/* Source Control floating popup */}
      {sourceControlOpen && (
        <SourceControlPopup onClose={() => setSourceControlOpen(false)} />
      )}

      {/* Settings popup */}
      {settingsOpen && (
        <SettingsPopup
          onClose={() => setSettingsOpen(false)}
          onCommandPalette={() => { setPalOpen(true); setSettingsOpen(false) }}
          onToggleTerminal={() => { toggleTerminal(); setSettingsOpen(false) }}
          onToggleCopilot={() => { toggleCopilot(); setSettingsOpen(false) }}
          onEnterFullscreen={() => { enterFullscreen(); setSettingsOpen(false) }}
          selectedTheme={selectedTheme}
          onThemeChange={applyTheme}
        />
      )}

      {/* Main row */}
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activePanel={sidePanel}
          onToggle={toggleSide}
          onSourceControl={() => setSourceControlOpen((v) => !v)}
          sourceControlOpen={sourceControlOpen}
          onToggleAI={toggleCopilot}
          aiOpen={copilotOpen}
          onSettings={() => setSettingsOpen((v) => !v)}
          settingsOpen={settingsOpen}
        />

        <Sidebar
          panel={sidePanel}
          activeTab={activeTab}
          openTabs={openTabs}
          onNavigate={navigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleCopilot={toggleCopilot}
          copilotOpen={copilotOpen}
          hiddenBuiltins={hiddenBuiltins}
          onHideBuiltin={(id) => setHiddenBuiltins(prev => [...prev, id])}
          onFileDeleted={(id) => {
            closeTab(id)
            setFileContents(prev => { const n = { ...prev }; delete n[id]; return n })
            setFileModes(prev => { const n = { ...prev }; delete n[id]; return n })
          }}
          customFiles={customFiles}
          customFolders={customFolders}
          onCustomFilesChange={setCustomFiles}
          onCustomFoldersChange={setCustomFolders}
        />

        {/* Editor column */}
        <div className="flex flex-col flex-1 overflow-hidden bg-vsc-bg min-w-0">
          {openTabs.length > 0 && (
            <TabBar
              openTabs={openTabs}
              activeTab={activeTab}
              onSelect={setActiveTab}
              onClose={closeTab}
            />
          )}

          {/* Breadcrumb */}
          <div className="h-[22px] flex items-center px-4 text-xs text-vsc-muted bg-vsc-bg border-b border-vsc-border/20 shrink-0 select-none">
            <span>portfolio</span>
            <span className="mx-1">›</span>
            <span>src</span>
            <span className="mx-1">›</span>
            <span className="text-vsc-text">{activeFile}</span>
          </div>

          {/* Panels */}
          <div className="flex-1 overflow-hidden relative">
            {openTabs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-vsc-muted flex-col gap-3">
                <div className="text-4xl opacity-20">📄</div>
                <div className="text-sm">No file open</div>
                <button onClick={() => navigate('home')} className="text-xs text-vsc-accent hover:underline">
                  Open home.tsx
                </button>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                {activeTab === 'resume' && <ResumePanel />}

                {activeTab !== 'resume' && openTabs.includes(activeTab) && (() => {
                  const isBuiltin = TABS.some(t => t.id === activeTab)
                  const isCustom  = activeTab.startsWith('file:')
                  if (!isBuiltin && !isCustom) return null

                  const filename = isCustom
                    ? activeTab.slice(5)
                    : (BREADCRUMB[activeTab] ?? activeTab)

                  const previewNode = isBuiltin ? (() => {
                    switch (activeTab) {
                      case 'home':       return <HomePanel onNavigate={navigate} />
                      case 'about':      return <AboutPanel />
                      case 'projects':   return <ProjectsPanel />
                      case 'skills':     return <SkillsPanel />
                      case 'experience': return <ExperiencePanel />
                      case 'contact':    return <ContactPanel />
                      case 'readme':     return <ReadmePanel />
                      default:           return undefined
                    }
                  })() : undefined

                  return (
                    <FileEditorPanel
                      key={activeTab}
                      filename={filename}
                      content={fileContents[activeTab] ?? (isBuiltin ? DEFAULT_CONTENT[activeTab] ?? '' : '')}
                      onChange={(v) => setFileContents(prev => ({ ...prev, [activeTab]: v }))}
                      mode={fileModes[activeTab] ?? (isBuiltin ? 'preview' : 'code')}
                      onModeChange={(m) => setFileModes(prev => ({ ...prev, [activeTab]: m }))}
                      previewNode={previewNode}
                    />
                  )
                })()}
              </div>
            )}
          </div>

          {/* Terminal panel */}
          {terminalOpen && (
            <>
              <div className="ai-panel-resize shrink-0" onMouseDown={startResize} />
              <div style={{ height: terminalHeight }} className="shrink-0 overflow-hidden">
                <BottomPanel
                  onClose={() => setTerminalOpen(false)}
                  onNavigate={navigate}
                  onLastCommandChange={setLastCommand}
                  terminalRef={terminalRef}
                />
              </div>
            </>
          )}
        </div>

        {/* Right: Copilot panel */}
        {copilotOpen && (
          <CopilotPanel
            onThinkingChange={setAiThinking}
            onClose={() => setCopilotOpen(false)}
            onPendingAction={setPendingAiAction}
            workspaceFiles={[
              ...TABS.filter(t => !hiddenBuiltins.includes(t.id)).map(t => BREADCRUMB[t.id] ?? t.id),
              ...customFolders.flatMap(f => f.files.map(fi => `${f.name}/${fi.name}`)),
              ...customFiles.map(f => f.name),
            ]}
          />
        )}
      </div>

      {/* AI Action confirmation modal */}
      {pendingAiAction && (
        <AiActionModal
          action={pendingAiAction}
          onApprove={() => executeAiAction(pendingAiAction)}
          onReject={() => setPendingAiAction(null)}
        />
      )}

      <StatusBar
        activeTab={activeTab}
        aiThinking={aiThinking}
        onToggleAI={toggleCopilot}
        zoom={zoom}
      />

      <CommandPalette
        open={palOpen}
        onClose={() => setPalOpen(false)}
        onNavigate={(id) => { navigate(id); setPalOpen(false) }}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
