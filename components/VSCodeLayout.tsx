'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TitleBar from './TitleBar'
import ActivityBar from './ActivityBar'
import Sidebar from './Sidebar'
import TabBar from './TabBar'
import StatusBar from './StatusBar'
import CommandPalette from './CommandPalette'
import BottomPanel, { type BottomTab } from './BottomPanel'
import { computeDiagnostics } from '@/lib/diagnostics'
import CopilotPanel from './CopilotPanel'
import AboutModal from './modals/AboutModal'
import KeyboardShortcutsModal from './modals/KeyboardShortcutsModal'
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

const ZOOM_LEVELS = [0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5]

// All IDs are 'file:<filename>' — derive filename by slicing prefix
function idToFilename(id: string): string {
  return id.startsWith('file:') ? id.slice(5) : id
}

// Default view mode: files with rich live previews open in split
function defaultMode(filename: string): ViewMode {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'md' || ext === 'markdown') return 'preview'
  const splitExts = new Set(['html', 'htm', 'tsx', 'jsx', 'css', 'scss'])
  return splitExts.has(ext) ? 'split' : 'code'
}

export default function VSCodeLayout() {
  const [openTabs, setOpenTabs]           = useState<string[]>(['file:home.html'])
  const [activeTab, setActiveTab]         = useState('file:home.html')
  const [sidePanel, setSidePanel]         = useState<SidePanel>(null)
  const [terminalOpen, setTerminalOpen]   = useState(false)
  const [copilotOpen, setCopilotOpen]     = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(240)
  const [isResizing, setIsResizing]         = useState(false)
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
  const [fileModes, setFileModes]                 = useState<Record<string, ViewMode>>({ 'file:home.html': 'preview' })
  const [workspaceFiles, setWorkspaceFiles]       = useState<CustomFile[]>(() => TABS.map(t => ({ id: t.id, name: t.label })))
  const [workspaceFolders, setWorkspaceFolders]   = useState<CustomFolder[]>([])
  const [pendingAiAction, setPendingAiAction]     = useState<AiFileAction | null>(null)
  const pendingActionResultRef = useRef<((applied: boolean) => void) | null>(null)
  const [gitStatus, setGitStatus]                 = useState<{ branch: string; totalCommits: number } | null>(null)

  const [bottomTab, setBottomTab] = useState<BottomTab>('TERMINAL')

  const defaultFileIds = useMemo(() => new Set(TABS.map(t => t.id)), [])

  const diagnostics = useMemo(
    () => computeDiagnostics(fileContents, workspaceFiles, defaultFileIds),
    [fileContents, workspaceFiles, defaultFileIds],
  )

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

  // Warm up edge functions + OpenRouter connection on mount.
  // Chat uses SSE — abort via signal immediately after headers to avoid ECONNRESET.
  // ai-action is non-streaming — let it complete (it's fast and primes the model).
  // Preload all editor dynamic imports so first tab click is instant
  useEffect(() => {
    import('@monaco-editor/react')
    import('./renderers/MarkdownRenderer')
    import('./renderers/HTMLRenderer')
    import('./renderers/LiveCodeRenderer')
  }, [])

  // git-status is fetched eagerly so the source control popup shows data instantly.
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
      signal: ctrl.signal,
    }).catch(() => {})
    ctrl.abort()

    fetch('/api/ai-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hi' }),
    }).catch(() => {})

    fetch('/api/git-status')
      .then(r => r.json())
      .then(d => setGitStatus({ branch: d.branch, totalCommits: d.totalCommits }))
      .catch(() => {})
  }, [])


  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 'p')                              { e.preventDefault(); setPalOpen(true) }
      if (ctrl && e.key === 'w')                              { e.preventDefault(); if (activeTab) closeTab(activeTab) }
      if (ctrl && e.shiftKey && e.key === 'W')                { e.preventDefault(); setOpenTabs([]) }
      if (ctrl && e.key === 't')                              { e.preventDefault(); navigate('file:home.html') }
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
      case 'update_file':
        setWorkspaceFiles(prev => prev.some(f => f.id === id) ? prev : [...prev, { id, name: path }])
        setFileContents(prev => ({ ...prev, [id]: content }))
        navigate(id)
        break
      case 'delete_file':
        setWorkspaceFiles(prev => prev.filter(f => f.id !== id))
        setWorkspaceFolders(prev => prev.map(folder => ({
          ...folder, files: folder.files.filter(f => f.id !== id),
        })))
        closeTab(id)
        setFileContents(prev => { const n = { ...prev }; delete n[id]; return n })
        setFileModes(prev => { const n = { ...prev }; delete n[id]; return n })
        break
      case 'create_folder': {
        const folderId = 'folder:' + path
        setWorkspaceFolders(prev =>
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
    setIsResizing(true)
    function cleanup() {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    function onMove(ev: MouseEvent) {
      if (ev.buttons === 0) { cleanup(); return }
      setTerminalHeight(Math.max(100, Math.min(500, startH + (startY - ev.clientY))))
    }
    function onUp() { cleanup() }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const activeFile = idToFilename(activeTab)

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        transformOrigin: 'top left',
        transform: `scale(${zoom})`,
        width: `${100 / zoom}%`,
        height: `${100 / zoom}dvh`,
      }}
    >
      {isResizing && <div className="fixed inset-0 z-[9999] cursor-row-resize" />}
      <TitleBar
        onCommandPalette={() => setPalOpen(true)}
        onNewTab={() => navigate('file:home.html')}
        onOpenFile={() => setPalOpen(true)}
        onCloseTab={() => activeTab && closeTab(activeTab)}
        onCloseAllTabs={() => setOpenTabs([])}
        recentFiles={recentFiles}
        onOpenRecent={navigate}
        onFind={() => { setSidePanel('search'); setSearchQuery('') }}
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
        <SourceControlPopup onClose={() => setSourceControlOpen(false)} gitStatus={gitStatus} />
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
          isDark={selectedTheme !== 'light'}
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
          workspaceFiles={workspaceFiles}
          workspaceFolders={workspaceFolders}
          onWorkspaceFilesChange={setWorkspaceFiles}
          onWorkspaceFoldersChange={setWorkspaceFolders}
          onFileDeleted={(id) => {
            closeTab(id)
            setFileContents(prev => { const n = { ...prev }; delete n[id]; return n })
            setFileModes(prev => { const n = { ...prev }; delete n[id]; return n })
          }}
          fileContents={fileContents}
          defaultContents={DEFAULT_CONTENT}
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
                <button onClick={() => navigate('file:home.html')} className="text-xs text-vsc-accent hover:underline">
                  Open home.html
                </button>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                {openTabs.includes(activeTab) && (() => {
                  const filename = idToFilename(activeTab)
                  if (filename === 'Dwijesh_Dookraz_Resume.pdf') return <ResumePanel />
                  return (
                    <FileEditorPanel
                      key={activeTab}
                      filename={filename}
                      content={fileContents[activeTab] ?? DEFAULT_CONTENT[filename] ?? ''}
                      onChange={(v) => setFileContents(prev => {
                        if (v === (DEFAULT_CONTENT[filename] ?? '')) {
                          const next = { ...prev }
                          delete next[activeTab]
                          return next
                        }
                        return { ...prev, [activeTab]: v }
                      })}
                      mode={fileModes[activeTab] ?? defaultMode(filename)}
                      onModeChange={(m) => setFileModes(prev => ({ ...prev, [activeTab]: m }))}
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
                  diagnostics={diagnostics}
                  activeTab={bottomTab}
                  onTabChange={setBottomTab}
                  onThemeChange={applyTheme}
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
            onPendingAction={(action, onResult) => {
                pendingActionResultRef.current = onResult
                setPendingAiAction(action)
              }}
            workspaceFiles={[
              ...workspaceFiles.map(f => f.name),
              ...workspaceFolders.flatMap(f => f.files.map(fi => `${f.name}/${fi.name}`)),
            ]}
            fileContents={fileContents}
          />
        )}
      </div>

      {/* AI Action confirmation modal */}
      {pendingAiAction && (
        <AiActionModal
          action={pendingAiAction}
          onApprove={() => {
            executeAiAction(pendingAiAction)
            pendingActionResultRef.current?.(true)
            pendingActionResultRef.current = null
            setPendingAiAction(null)
          }}
          onReject={() => {
            pendingActionResultRef.current?.(false)
            pendingActionResultRef.current = null
            setPendingAiAction(null)
          }}
        />
      )}

      <StatusBar
        activeTab={activeTab}
        aiThinking={aiThinking}
        onToggleAI={toggleCopilot}
        zoom={zoom}
        errorCount={diagnostics.filter((d) => d.severity === 'error').length}
        warningCount={diagnostics.filter((d) => d.severity === 'warning').length}
        onShowProblems={() => {
          setTerminalOpen(true)
          setBottomTab('PROBLEMS')
        }}
      />

      <CommandPalette
        open={palOpen}
        onClose={() => setPalOpen(false)}
        onNavigate={(id) => { navigate(id); setPalOpen(false) }}
        workspaceFiles={workspaceFiles}
        workspaceFolders={workspaceFolders}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
