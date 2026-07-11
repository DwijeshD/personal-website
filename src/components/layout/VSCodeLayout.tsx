'use client'

import React, { Suspense, useRef } from 'react'
import UrlSync from './UrlSync'
import TitleBar from './TitleBar'
import ActivityBar from './ActivityBar'
import Sidebar from './Sidebar'
import TabBar from './TabBar'
import StatusBar from './StatusBar'
import dynamic from 'next/dynamic'
import FileEditorPanel from '../panels/FileEditorPanel'

const CommandPalette    = dynamic(() => import('../overlays/CommandPalette'))
const BottomPanel       = dynamic(() => import('../panels/BottomPanel'))
const CopilotPanel      = dynamic(() => import('../panels/CopilotPanel'))
const AboutModal        = dynamic(() => import('../modals/AboutModal'))
const KeyboardShortcutsModal = dynamic(() => import('../modals/KeyboardShortcutsModal'))
const ResumePanel       = dynamic(() => import('../panels/ResumePanel'))
const SourceControlPopup = dynamic(() => import('../overlays/SourceControlPopup'))
const SettingsPopup     = dynamic(() => import('../overlays/SettingsPopup'))
const AiActionModal     = dynamic(() => import('../overlays/AiActionModal'))
import { DEFAULT_CONTENT } from '@/shared/content'
import { computeDiagnostics } from '@/lib/diagnostics'
import type { TerminalHandle } from '../panels/TerminalTab'
import { useEditorState, idToFilename, defaultMode } from '@/hooks/useEditorState'
import { usePanelState, ZOOM_LEVELS } from '@/hooks/usePanelState'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useResizablePanel } from '@/hooks/useResizablePanel'
import { useGitStatus } from '@/hooks/useGitStatus'
import { useGitHubStats } from '@/hooks/useGitHubStats'
import { useEditorPrefetch } from '@/hooks/useEditorPrefetch'

export default function VSCodeLayout() {
  const editor    = useEditorState()
  const panels    = usePanelState()
  const terminal  = useResizablePanel(240)
  const gitStatus  = useGitStatus()
  const ghStats    = useGitHubStats()
  useEditorPrefetch()

  const terminalRef = useRef<TerminalHandle | null>(null)
  const zoom = ZOOM_LEVELS[panels.zoomIdx]

  const diagnostics = React.useMemo(
    () => computeDiagnostics(editor.fileContents, editor.workspaceFiles, editor.defaultFileIds),
    [editor.fileContents, editor.workspaceFiles, editor.defaultFileIds],
  )

  useKeyboardShortcuts({
    openPalette:     () => panels.setPalOpen(true),
    closeTab:        editor.closeTab,
    closeAllTabs:    () => editor.setOpenTabs([]),
    openHomeTab:     () => editor.navigate('file:home.html'),
    toggleSidebar:   () => panels.setSidePanel(p => p ? null : 'explorer'),
    toggleTerminal:  panels.toggleTerminal,
    toggleCopilot:   panels.toggleCopilot,
    enterFullscreen: panels.enterFullscreen,
    zoomIn:          () => panels.setZoomIdx(i => Math.min(i + 1, ZOOM_LEVELS.length - 1)),
    zoomOut:         () => panels.setZoomIdx(i => Math.max(i - 1, 0)),
    resetZoom:       () => panels.setZoomIdx(3),
    closePalette:    () => panels.setPalOpen(false),
  }, editor.activeTab)

  const activeFile = idToFilename(editor.activeTab)

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
      {terminal.isResizing && <div className="fixed inset-0 z-[9999] cursor-row-resize" />}

      <TitleBar
        onCommandPalette={() => panels.setPalOpen(true)}
        onNewTab={() => editor.navigate('file:home.html')}
        onOpenFile={() => panels.setPalOpen(true)}
        onCloseTab={() => editor.activeTab && editor.closeTab(editor.activeTab)}
        onCloseAllTabs={() => editor.setOpenTabs([])}
        recentFiles={editor.recentFiles}
        onOpenRecent={editor.navigate}
        onFind={() => { panels.setSidePanel('search'); panels.setSearchQuery('') }}
        onCopy={() => {
          const s = window.getSelection()?.toString()
          if (s) navigator.clipboard.writeText(s).catch(() => {})
        }}
        onToggleSidebar={() => panels.setSidePanel(p => p ? null : 'explorer')}
        onToggleTerminal={panels.toggleTerminal}
        onToggleCopilot={panels.toggleCopilot}
        onEnterFullscreen={panels.enterFullscreen}
        onZoomIn={() => panels.setZoomIdx(i => Math.min(i + 1, ZOOM_LEVELS.length - 1))}
        onZoomOut={() => panels.setZoomIdx(i => Math.max(i - 1, 0))}
        onResetZoom={() => panels.setZoomIdx(3)}
        onGoToFile={() => panels.setPalOpen(true)}
        onNavigate={editor.navigate}
        onStartTerminal={() => panels.setTerminalOpen(true)}
        onRunLastCommand={() => {
          if (panels.lastCommand && terminalRef.current) {
            panels.setTerminalOpen(true)
            terminalRef.current.runCommand(panels.lastCommand)
          }
        }}
        lastCommand={panels.lastCommand}
        onNewTerminal={() => { terminalRef.current?.clear(); panels.setTerminalOpen(true) }}
        onClearTerminal={() => terminalRef.current?.clear()}
        onShowShortcuts={() => panels.setShortcutsOpen(true)}
        onAbout={() => panels.setAboutOpen(true)}
        onReportBug={panels.openBugReport}
        copilotActive={panels.copilotOpen}
      />

      {panels.sourceControlOpen && (
        <SourceControlPopup onClose={() => panels.setSourceControlOpen(false)} gitStatus={gitStatus} ghStats={ghStats} />
      )}

      {panels.settingsOpen && (
        <SettingsPopup
          onClose={() => panels.setSettingsOpen(false)}
          onCommandPalette={() => { panels.setPalOpen(true); panels.setSettingsOpen(false) }}
          onToggleTerminal={() => { panels.toggleTerminal(); panels.setSettingsOpen(false) }}
          onToggleCopilot={() => { panels.toggleCopilot(); panels.setSettingsOpen(false) }}
          onEnterFullscreen={() => { panels.enterFullscreen(); panels.setSettingsOpen(false) }}
          selectedTheme={panels.selectedTheme}
          onThemeChange={panels.applyTheme}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activePanel={panels.sidePanel}
          onToggle={panels.toggleSide}
          onSourceControl={() => panels.setSourceControlOpen(v => !v)}
          sourceControlOpen={panels.sourceControlOpen}
          onToggleAI={panels.toggleCopilot}
          aiOpen={panels.copilotOpen}
          onSettings={() => panels.setSettingsOpen(v => !v)}
          settingsOpen={panels.settingsOpen}
          isDark={panels.selectedTheme !== 'light'}
        />

        <Sidebar
          panel={panels.sidePanel}
          activeTab={editor.activeTab}
          openTabs={editor.openTabs}
          onNavigate={editor.navigate}
          searchQuery={panels.searchQuery}
          onSearchChange={panels.setSearchQuery}
          onToggleCopilot={panels.toggleCopilot}
          copilotOpen={panels.copilotOpen}
          workspaceFiles={editor.workspaceFiles}
          workspaceFolders={editor.workspaceFolders}
          onWorkspaceFilesChange={editor.setWorkspaceFiles}
          onWorkspaceFoldersChange={editor.setWorkspaceFolders}
          onFileDeleted={editor.deleteFileFromState}
          onFileRenamed={editor.renameFileInState}
          fileContents={editor.fileContents}
          defaultContents={DEFAULT_CONTENT}
        />

        <div className="flex flex-col flex-1 overflow-hidden bg-vsc-bg min-w-0">
          {editor.openTabs.length > 0 && (
            <TabBar
              openTabs={editor.openTabs}
              activeTab={editor.activeTab}
              onSelect={editor.setActiveTab}
              onClose={editor.closeTab}
            />
          )}

          <div className="h-[22px] flex items-center px-4 text-xs text-vsc-muted bg-vsc-bg border-b border-vsc-border/20 shrink-0 select-none">
            <span>portfolio</span>
            <span className="mx-1">›</span>
            <span>src</span>
            <span className="mx-1">›</span>
            <span className="text-vsc-text">{activeFile}</span>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {editor.openTabs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-vsc-muted flex-col gap-3">
                <div className="text-4xl opacity-20">📄</div>
                <div className="text-sm">No file open</div>
                <button onClick={() => editor.navigate('file:home.html')} className="text-xs text-vsc-accent hover:underline">
                  Open home.html
                </button>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                {editor.openTabs.includes(editor.activeTab) && (() => {
                  const filename = idToFilename(editor.activeTab)
                  if (filename === 'resume.pdf') return <ResumePanel />
                  return (
                    <FileEditorPanel
                      key={editor.activeTab}
                      filename={filename}
                      content={editor.fileContents[editor.activeTab] ?? DEFAULT_CONTENT[filename] ?? ''}
                      onChange={(v) => editor.updateFileContent(editor.activeTab, v, filename)}
                      mode={editor.fileModes[editor.activeTab] ?? defaultMode(filename)}
                      onModeChange={(m) => editor.setFileModes(prev => ({ ...prev, [editor.activeTab]: m }))}
                      gotoLine={editor.gotoTarget?.id === editor.activeTab ? editor.gotoTarget.line : undefined}
                    />
                  )
                })()}
              </div>
            )}
          </div>

          {panels.terminalOpen && (
            <>
              <div className="ai-panel-resize shrink-0" onMouseDown={terminal.startResize} />
              <div style={{ height: terminal.height }} className="shrink-0 overflow-hidden panel-slide-bottom">
                <BottomPanel
                  onClose={() => panels.setTerminalOpen(false)}
                  onNavigate={editor.navigate}
                  onLastCommandChange={panels.setLastCommand}
                  terminalRef={terminalRef}
                  diagnostics={diagnostics}
                  activeTab={panels.bottomTab}
                  onTabChange={panels.setBottomTab}
                  onThemeChange={panels.applyTheme}
                />
              </div>
            </>
          )}
        </div>

        {panels.copilotOpen && (
          <CopilotPanel
            onThinkingChange={panels.setAiThinking}
            onClose={() => panels.setCopilotOpen(false)}
            triggerBugReport={panels.bugReportTrigger}
            onPendingAction={(action, onResult) => {
              // eslint-disable-next-line react-hooks/immutability
              panels.pendingActionResultRef.current = onResult
              panels.setPendingAiAction(action)
            }}
            workspaceFiles={[
              ...editor.workspaceFiles.map(f => f.name),
              ...editor.workspaceFolders.flatMap(f => f.files.map(fi => `${f.name}/${fi.name}`)),
            ]}
            fileContents={editor.fileContents}
          />
        )}
      </div>

      {panels.pendingAiAction && (
        <AiActionModal
          action={panels.pendingAiAction}
          onApprove={() => {
            editor.executeAiAction(panels.pendingAiAction!)
            panels.pendingActionResultRef.current?.(true)
            // eslint-disable-next-line react-hooks/immutability
            panels.pendingActionResultRef.current = null
            panels.setPendingAiAction(null)
          }}
          onReject={() => {
            panels.pendingActionResultRef.current?.(false)
            // eslint-disable-next-line react-hooks/immutability
            panels.pendingActionResultRef.current = null
            panels.setPendingAiAction(null)
          }}
        />
      )}

      <StatusBar
        activeTab={editor.activeTab}
        aiThinking={panels.aiThinking}
        onToggleAI={panels.toggleCopilot}
        onToggleTerminal={panels.toggleTerminal}
        terminalOpen={panels.terminalOpen}
        zoom={zoom}
        errorCount={diagnostics.filter(d => d.severity === 'error').length}
        warningCount={diagnostics.filter(d => d.severity === 'warning').length}
        onShowProblems={() => {
          panels.setTerminalOpen(true)
          panels.setBottomTab('PROBLEMS')
        }}
      />

      <CommandPalette
        open={panels.palOpen}
        onClose={() => panels.setPalOpen(false)}
        onNavigate={(id) => { editor.navigate(id); panels.setPalOpen(false) }}
        workspaceFiles={editor.workspaceFiles}
        workspaceFolders={editor.workspaceFolders}
      />

      <AboutModal open={panels.aboutOpen} onClose={() => panels.setAboutOpen(false)} />
      <KeyboardShortcutsModal open={panels.shortcutsOpen} onClose={() => panels.setShortcutsOpen(false)} />

      <Suspense fallback={null}>
        <UrlSync activeTab={editor.activeTab} navigate={editor.navigate} />
      </Suspense>
    </div>
  )
}
