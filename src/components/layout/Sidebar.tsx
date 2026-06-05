'use client'

import { useEffect, useRef, useState } from 'react'
import type { SidePanel } from './ActivityBar'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { FileTree } from '@/features/sidebar/components/FileTree'
import { SearchPanel } from '@/features/sidebar/components/SearchPanel'
import { GitStatus } from '@/features/sidebar/components/GitStatus'

interface Props {
  panel: SidePanel
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onToggleCopilot: () => void
  copilotOpen: boolean
  onFileDeleted: (id: string) => void
  onFileRenamed: (oldId: string, newId: string, newName: string) => void
  workspaceFiles:          CustomFile[]
  workspaceFolders:        CustomFolder[]
  onWorkspaceFilesChange:  (files: CustomFile[]) => void
  onWorkspaceFoldersChange:(folders: CustomFolder[]) => void
  fileContents:    Record<string, string>
  defaultContents: Record<string, string>
}

export default function Sidebar({
  panel,
  activeTab,
  openTabs,
  onNavigate,
  searchQuery,
  onSearchChange,
  onToggleCopilot,
  copilotOpen: _copilotOpen,
  onFileDeleted,
  onFileRenamed,
  workspaceFiles,
  workspaceFolders,
  onWorkspaceFilesChange,
  onWorkspaceFoldersChange,
  fileContents,
  defaultContents,
}: Props) {
  const [portfolioOpen, setPortfolioOpen] = useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sidebarRef.current
    if (!el) return
    const block = (e: Event) => e.preventDefault()
    el.addEventListener('contextmenu', block)
    return () => el.removeEventListener('contextmenu', block)
  }, [])

  if (!panel) return null

  return (
    <div ref={sidebarRef} className="w-[220px] bg-vsc-sidebar shrink-0 flex flex-col border-r border-vsc-border/30 overflow-hidden panel-slide-left">
      {panel === 'explorer' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">
            Explorer
          </div>
          <FileTree
            portfolioOpen={portfolioOpen}
            setPortfolioOpen={setPortfolioOpen}
            workspaceFiles={workspaceFiles}
            workspaceFolders={workspaceFolders}
            onWorkspaceFilesChange={onWorkspaceFilesChange}
            onWorkspaceFoldersChange={onWorkspaceFoldersChange}
            activeTab={activeTab}
            openTabs={openTabs}
            onNavigate={onNavigate}
            onFileDeleted={onFileDeleted}
            onFileRenamed={onFileRenamed}
          />
          <div className="shrink-0 px-3 py-2 flex">
            <button
              onClick={onToggleCopilot}
              className="copilot-pill flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] whitespace-nowrap"
              title="Dwijesh's Copilot"
            >
              <span className="copilot-live-dot" />
              Dwijesh&apos;s Copilot
            </button>
          </div>
          <div className="shrink-0 border-t border-vsc-border/40">
            <GitStatus />
          </div>
        </>
      )}

      {panel === 'search' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">
            Search
          </div>
          <SearchPanel
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            workspaceFiles={workspaceFiles}
            workspaceFolders={workspaceFolders}
            fileContents={fileContents}
            defaultContents={defaultContents}
            onNavigate={onNavigate}
          />
          <div className="flex-1" />
          <div className="shrink-0 border-t border-vsc-border/40">
            <GitStatus />
          </div>
        </>
      )}
    </div>
  )
}
