'use client'
/* eslint-disable react-hooks/static-components */

import { useEffect, useRef, useState } from 'react'
import type { SidePanel } from './ActivityBar'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { iconSrcForFile } from '@/lib/fileIcons'

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
  // Unified file-system state (all files — initial + user-created)
  workspaceFiles:          CustomFile[]
  workspaceFolders:        CustomFolder[]
  onWorkspaceFilesChange:  (files: CustomFile[]) => void
  onWorkspaceFoldersChange:(folders: CustomFolder[]) => void
  // Content for Find in Files
  fileContents:    Record<string, string>
  defaultContents: Record<string, string>
}

// ─── Icons (material-icon-theme SVGs) ─────────────────────────────────────────

const FolderIcon = ({ open }: { open: boolean }) => (
  <img src={open ? '/icons/files/folder-open.svg' : '/icons/files/folder.svg'} width={16} height={16} alt="" aria-hidden />
)

function iconForFile(name: string): React.ReactNode {
  return <img src={iconSrcForFile(name)} width={16} height={16} alt="" aria-hidden />
}

// ─── GitStatus ────────────────────────────────────────────────────────────────

function GitStatus() {
  const [data, setData] = useState<{ branch: string; ahead: number; behind: number } | null>(null)

  useEffect(() => {
    fetch('/api/git-status')
      .then((r) => r.json())
      .then((d) => setData({ branch: d.branch ?? 'main', ahead: d.ahead ?? 0, behind: d.behind ?? 0 }))
      .catch(() => setData({ branch: 'main', ahead: 0, behind: 0 }))
  }, [])

  const branch = data?.branch ?? 'main'
  const ahead  = data?.ahead  ?? 0
  const behind = data?.behind ?? 0

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-vsc-muted select-none">
      <span className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
        </svg>
        {branch}
      </span>
      {ahead > 0 && (
        <span className="flex items-center gap-0.5 text-[#89d185]">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/>
          </svg>
          {ahead}
        </span>
      )}
      {behind > 0 && (
        <span className="flex items-center gap-0.5 text-[#f14c4c]">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.53 8.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L2.97 9.28a.75.75 0 0 1 1.06-1.06L7 11.19V3.75a.75.75 0 0 1 1.5 0v7.44l2.97-2.97a.75.75 0 0 1 1.06 0z"/>
          </svg>
          {behind}
        </span>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CtxTarget {
  x: number; y: number
  id: string; name: string
  folderId?: string
  blank?: boolean
}

export default function Sidebar({
  panel,
  activeTab,
  openTabs,
  onNavigate,
  searchQuery,
  onSearchChange,
  onToggleCopilot,
  copilotOpen,
  onFileDeleted,
  workspaceFiles,
  workspaceFolders,
  onWorkspaceFilesChange,
  onWorkspaceFoldersChange,
  fileContents,
  defaultContents,
}: Props) {
  const setWorkspaceFiles   = onWorkspaceFilesChange
  const setWorkspaceFolders = onWorkspaceFoldersChange

  const [portfolioOpen, setPortfolioOpen] = useState(true)
  const [newMode, setNewMode]             = useState<'file' | 'folder' | null>(null)
  const [newName, setNewName]             = useState('')
  const [newInFolder, setNewInFolder]     = useState<string | null>(null)
  const [newInFolderName, setNewInFolderName] = useState('')
  const [ctx, setCtx]                     = useState<CtxTarget | null>(null)
  const [renamingId, setRenamingId]       = useState<string | null>(null)
  const [renameVal, setRenameVal]         = useState('')
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({})
  const [clipboard, setClipboard]         = useState<{ id: string; name: string } | null>(null)
  const sidebarRef     = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const renameRef      = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = sidebarRef.current
    if (!el) return
    const block = (e: Event) => e.preventDefault()
    el.addEventListener('contextmenu', block)
    return () => el.removeEventListener('contextmenu', block)
  }, [])

  useEffect(() => {
    if (!ctx) return
    const close = () => setCtx(null)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [ctx])

  if (!panel) return null

  function commitNew() {
    const name = newName.trim()
    if (!name) { cancelNew(); return }
    if (newMode === 'file') {
      const id = 'file:' + name
      setWorkspaceFiles(workspaceFiles.some(f => f.id === id) ? workspaceFiles : [...workspaceFiles, { id, name }])
      onNavigate(id)
    } else if (newMode === 'folder') {
      setWorkspaceFolders([...workspaceFolders, { id: 'folder:' + name, name, open: true, files: [] }])
    }
    cancelNew()
  }

  function cancelNew() {
    setNewMode(null)
    setNewName('')
  }

  function startNew(mode: 'file' | 'folder') {
    setNewMode(mode)
    setNewName('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function startNewInFolder(folderId: string) {
    setWorkspaceFolders(workspaceFolders.map(f => f.id === folderId ? { ...f, open: true } : f))
    setNewInFolder(folderId)
    setNewInFolderName('')
    setTimeout(() => folderInputRef.current?.focus(), 0)
  }

  function commitFolderFile(folderId: string) {
    const name = newInFolderName.trim()
    if (!name) { cancelFolderFile(); return }
    const fileId = 'file:' + name
    setWorkspaceFolders(workspaceFolders.map(f =>
      f.id === folderId ? { ...f, files: [...f.files, { id: fileId, name }] } : f
    ))
    onNavigate(fileId)
    cancelFolderFile()
  }

  function cancelFolderFile() {
    setNewInFolder(null)
    setNewInFolderName('')
  }

  // ── Context menu actions ────────────────────────────────────────────────

  function openCtx(e: React.MouseEvent, id: string, name: string, folderId?: string) {
    e.preventDefault()
    e.stopPropagation()
    setCtx({ x: e.clientX, y: e.clientY, id, name, folderId })
  }

  function openBlankCtx(e: React.MouseEvent) {
    e.preventDefault()
    setCtx({ x: e.clientX, y: e.clientY, id: '', name: '', blank: true })
  }

  function handleDelete() {
    if (!ctx) return
    const { id, folderId } = ctx
    setCtx(null)
    if (folderId) {
      setWorkspaceFolders(workspaceFolders.map((f: CustomFolder) =>
        f.id === folderId ? { ...f, files: f.files.filter((fi: CustomFile) => fi.id !== id) } : f
      ))
    } else {
      setWorkspaceFiles(workspaceFiles.filter((f: CustomFile) => f.id !== id))
    }
    onFileDeleted(id)
  }

  function handleRename() {
    if (!ctx) return
    const displayName = nameOverrides[ctx.id] ?? ctx.name
    setCtx(null)
    setRenamingId(ctx.id)
    setRenameVal(displayName)
    setTimeout(() => renameRef.current?.focus(), 0)
  }

  function commitRename(id: string) {
    const name = renameVal.trim()
    if (name) {
      setNameOverrides(prev => ({ ...prev, [id]: name }))
      setWorkspaceFiles(workspaceFiles.map(f => f.id === id ? { ...f, name } : f))
      setWorkspaceFolders(workspaceFolders.map(folder => ({
        ...folder,
        files: folder.files.map(f => f.id === id ? { ...f, name } : f),
      })))
    }
    setRenamingId(null)
  }

  function handleCopy() {
    if (!ctx) return
    setClipboard({ id: ctx.id, name: nameOverrides[ctx.id] ?? ctx.name })
    setCtx(null)
  }

  function handlePaste() {
    if (!clipboard) return
    const base = clipboard.name
    const dotIdx = base.lastIndexOf('.')
    const newName = dotIdx > 0
      ? base.slice(0, dotIdx) + '_copy' + base.slice(dotIdx)
      : base + '_copy'
    const newId = 'file:' + newName
    setWorkspaceFiles(workspaceFiles.some(f => f.id === newId) ? workspaceFiles : [...workspaceFiles, { id: newId, name: newName }])
    onNavigate(newId)
    setCtx(null)
  }

  function handleCopyPath() {
    if (!ctx) return
    navigator.clipboard.writeText(ctx.name).catch(() => {})
    setCtx(null)
  }

  const CopilotButton = () => (
    <div className="shrink-0 px-3 py-2">
      {/* Ambient glow behind entire button */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-md pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #f0abfc, #818cf8, #38bdf8)' }}
        />
        {/* 1px gradient border via padding trick */}
        <div
          className="relative p-px rounded-full"
          style={{ background: 'linear-gradient(135deg, #f0abfc 0%, #a78bfa 45%, #38bdf8 100%)' }}
        >
          <button
            onClick={onToggleCopilot}
            className="relative w-full flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 hover:brightness-125 active:scale-[0.98]"
            style={{ background: '#1e1e2e' }}
            title="Open Dwijesh's Copilot"
          >
            {/* Gradient star */}
            <svg width="13" height="13" viewBox="0 0 24 24" className="shrink-0 flex-none">
              <defs>
                <linearGradient id="copilot-star" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0abfc"/>
                  <stop offset="100%" stopColor="#38bdf8"/>
                </linearGradient>
              </defs>
              <path fill="url(#copilot-star)" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            {/* Gradient text */}
            <span
              className="truncate"
              style={{
                background: 'linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 50%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dwijesh&apos;s Copilot
            </span>
          </button>
        </div>
      </div>
    </div>
  )

  const BottomSection = () => (
    <div className="shrink-0 border-t border-vsc-border/40">
      <GitStatus />
    </div>
  )

  const FileRow = ({ id, name, icon, depth = 0, folderId }: { id: string; name: string; icon: React.ReactNode; depth?: number; folderId?: string }) => {
    const displayName  = nameOverrides[id] ?? name
    const isRenaming   = renamingId === id
    return (
      <li
        onClick={() => !isRenaming && onNavigate(id)}
        onContextMenu={(e) => openCtx(e, id, displayName, folderId)}
        className={`
          flex items-center gap-2 pr-3 py-[4px] cursor-pointer transition-colors relative
          ${activeTab === id ? 'bg-vsc-selection text-vsc-text' : 'text-[#cccccc] hover:bg-vsc-hover'}
        `}
        style={{ paddingLeft: `${20 + depth * 12}px` }}
      >
        {activeTab === id && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-vsc-accent" />}
        <span className="shrink-0 flex items-center">{icon}</span>
        {isRenaming ? (
          <input
            ref={renameRef}
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(id); if (e.key === 'Escape') setRenamingId(null) }}
            onBlur={() => commitRename(id)}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0"
          />
        ) : (
          <span className="truncate text-[13px]">{displayName}</span>
        )}
        {!isRenaming && openTabs.includes(id) && activeTab !== id && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vsc-muted/50 shrink-0" />
        )}
      </li>
    )
  }

  return (
    <div ref={sidebarRef} className="w-[220px] bg-vsc-sidebar shrink-0 flex flex-col border-r border-vsc-border/30 overflow-hidden panel-slide-left">
      {panel === 'explorer' && (
        <>
          {/* EXPLORER header */}
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">
            Explorer
          </div>

          {/* PORTFOLIO folder header */}
          <div className="group flex items-center gap-1.5 px-2 py-1 select-none shrink-0 hover:bg-vsc-hover/50 transition-colors">
            <button
              onClick={() => setPortfolioOpen(v => !v)}
              className="flex items-center gap-1.5 flex-1 min-w-0"
            >
              <span className="text-vsc-muted text-[10px] w-3 text-center shrink-0">
                {portfolioOpen ? '▾' : '▸'}
              </span>
              <span className="font-semibold text-vsc-muted tracking-wide text-[11px] uppercase truncate">
                Portfolio
              </span>
            </button>

            {/* New file / new folder buttons — show on hover */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => { setPortfolioOpen(true); startNew('file') }}
                title="New File"
                className="w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="13" x2="12" y2="19"/>
                  <line x1="9" y1="16" x2="15" y2="16"/>
                </svg>
              </button>
              <button
                onClick={() => { setPortfolioOpen(true); startNew('folder') }}
                title="New Folder"
                className="w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  <line x1="12" y1="11" x2="12" y2="17"/>
                  <line x1="9" y1="14" x2="15" y2="14"/>
                </svg>
              </button>
            </div>
          </div>

          {/* File list */}
          <ul className="flex-1 overflow-y-auto panel-scroll py-0.5" onContextMenu={openBlankCtx}>
            {portfolioOpen && (
              <>
                {/* Folders */}
                {workspaceFolders.map((folder) => (
                  <li key={folder.id}>
                    <div
                      className="group flex items-center gap-2 pr-2 py-[4px] cursor-pointer text-[#cccccc] hover:bg-vsc-hover transition-colors"
                      style={{ paddingLeft: '20px' }}
                      onContextMenu={(e) => openCtx(e, folder.id, folder.name)}
                    >
                      <button
                        className="flex items-center gap-2 flex-1 min-w-0"
                        onClick={() => setWorkspaceFolders(
                          workspaceFolders.map(f => f.id === folder.id ? { ...f, open: !f.open } : f)
                        )}
                      >
                        <span className="text-vsc-muted text-[9px] w-3 text-center shrink-0">{folder.open ? '▾' : '▸'}</span>
                        <span className="flex items-center shrink-0"><FolderIcon open={folder.open} /></span>
                        <span className="truncate text-[13px]">{folder.name}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); startNewInFolder(folder.id) }}
                        title="New File in Folder"
                        className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors shrink-0"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="12" y1="13" x2="12" y2="19"/>
                          <line x1="9" y1="16" x2="15" y2="16"/>
                        </svg>
                      </button>
                    </div>
                    {folder.open && (
                      <>
                        {folder.files.map(f => (
                          <FileRow key={f.id} id={f.id} name={f.name} icon={iconForFile(f.name)} depth={2} folderId={folder.id} />
                        ))}
                        {newInFolder === folder.id && (
                          <li className="flex items-center gap-2 pr-3 py-[4px]" style={{ paddingLeft: '44px' }}>
                            <span className="shrink-0">{iconForFile(newInFolderName || 'file')}</span>
                            <input
                              ref={folderInputRef}
                              value={newInFolderName}
                              onChange={e => setNewInFolderName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') commitFolderFile(folder.id)
                                if (e.key === 'Escape') cancelFolderFile()
                              }}
                              onBlur={cancelFolderFile}
                              placeholder="filename.ext"
                              className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0"
                            />
                          </li>
                        )}
                      </>
                    )}
                  </li>
                ))}

                {/* All files */}
                {workspaceFiles.map((f: CustomFile) => (
                  <FileRow
                    key={f.id}
                    id={f.id}
                    name={f.name}
                    icon={iconForFile(f.name)}
                    depth={1}
                  />
                ))}

                {/* Inline input for new file/folder */}
                {newMode && (
                  <li className="flex items-center gap-2 pr-3 py-[4px]" style={{ paddingLeft: '20px' }}>
                    <span className="shrink-0 w-3" />
                    <span className="shrink-0">
                      {newMode === 'file' ? iconForFile(newName || 'file') : <FolderIcon open={false} />}
                    </span>
                    <input
                      ref={inputRef}
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitNew()
                        if (e.key === 'Escape') cancelNew()
                      }}
                      onBlur={cancelNew}
                      placeholder={newMode === 'file' ? 'filename.ext' : 'folder name'}
                      className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0"
                    />
                  </li>
                )}
              </>
            )}
          </ul>

          <CopilotButton />
          <BottomSection />
        </>
      )}

      {panel === 'search' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">
            Search
          </div>
          <div className="px-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search files..."
              autoFocus
              className="w-full bg-vsc-input border border-vsc-border text-vsc-text text-sm px-3 py-1.5 rounded outline-none focus:border-vsc-accent placeholder:text-vsc-muted"
            />
            {searchQuery && (() => {
              const q = searchQuery.toLowerCase()
              const allSearchable = [
                ...workspaceFiles.map((f: CustomFile) => ({
                  id: f.id, label: f.name, path: f.name,
                  content: fileContents[f.id] ?? defaultContents[f.name] ?? '',
                })),
                ...workspaceFolders.flatMap((folder: CustomFolder) =>
                  folder.files.map((f: CustomFile) => ({
                    id: f.id, label: f.name, path: `${folder.name}/${f.name}`,
                    content: fileContents[f.id] ?? '',
                  }))
                ),
              ]
              const results = allSearchable.flatMap((file: { id: string; label: string; path: string; content: string }) => {
                const lines = file.content.split('\n')
                const hits = lines
                  .map((line: string, i: number) => ({ line, lineNum: i + 1 }))
                  .filter(({ line }: { line: string; lineNum: number }) => line.toLowerCase().includes(q))
                  .slice(0, 3)
                const nameMatch = file.path.toLowerCase().includes(q)
                return (hits.length > 0 || nameMatch) ? [{ ...file, hits }] : []
              })
              return (
                <ul className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] panel-scroll">
                  {results.length === 0 && (
                    <li className="px-2 py-2 text-sm text-vsc-muted">No results</li>
                  )}
                  {results.map((file: { id: string; label: string; path: string; hits: { line: string; lineNum: number }[] }) => (
                    <li key={file.id}>
                      <div
                        onClick={() => { onNavigate(file.id); onSearchChange('') }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-vsc-hover transition-colors"
                      >
                        <span className="shrink-0">{iconForFile(file.label)}</span>
                        <span className="text-sm text-vsc-text font-medium truncate flex-1">{file.path}</span>
                        {file.hits.length > 0 && (
                          <span className="text-[10px] text-vsc-muted shrink-0">{file.hits.length}</span>
                        )}
                      </div>
                      {file.hits.map(({ line, lineNum }) => (
                        <div
                          key={lineNum}
                          onClick={() => { onNavigate(file.id); onSearchChange('') }}
                          className="flex items-start gap-2 pl-8 pr-2 py-0.5 cursor-pointer hover:bg-vsc-hover/50 transition-colors"
                        >
                          <span className="text-[10px] text-vsc-muted w-6 text-right shrink-0 pt-px">{lineNum}</span>
                          <span className="text-[11px] font-mono text-vsc-muted truncate">{line.trim()}</span>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              )
            })()}
          </div>
          <div className="flex-1" onContextMenu={openBlankCtx} />
          <BottomSection />
        </>
      )}

      {/* ── Context menu ───────────────────────────────────────────────── */}
      {ctx && (
        <div
          className="fixed z-[1000] bg-[#1f1f1f] border border-[#3c3c3c] rounded shadow-2xl py-1 min-w-[200px] text-[13px]"
          style={{
            left: Math.min(ctx.x, window.innerWidth  - 210),
            top:  Math.min(ctx.y, window.innerHeight - 290),
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <CtxBtn label="New File"   onClick={() => { setCtx(null); setPortfolioOpen(true); startNew('file')   }} />
          <CtxBtn label="New Folder" onClick={() => { setCtx(null); setPortfolioOpen(true); startNew('folder') }} />
          {!ctx.blank && (
            <>
              <CtxSep />
              <CtxBtn label="Copy"      shortcut="Ctrl+C" onClick={handleCopy} />
              <CtxBtn label="Paste"     shortcut="Ctrl+V" onClick={handlePaste}    disabled={!clipboard} />
              <CtxBtn label="Copy Path"                   onClick={handleCopyPath} />
              <CtxSep />
              <CtxBtn label="Rename"    shortcut="F2"     onClick={handleRename} />
              <CtxBtn label="Delete"    shortcut="Del"    onClick={handleDelete} danger />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function CtxBtn({ label, shortcut, onClick, disabled, danger }: {
  label: string; shortcut?: string; onClick: () => void; disabled?: boolean; danger?: boolean
}) {
  return (
    <button
      onMouseDown={disabled ? undefined : onClick}
      className={`w-full flex items-center justify-between px-3 py-[5px] text-left transition-colors ${
        disabled ? 'opacity-35 cursor-default text-[#858585]' :
        danger   ? 'text-[#f48771] hover:bg-[#f4877122]' :
                   'text-[#cccccc] hover:bg-[#094771]'
      }`}
    >
      <span>{label}</span>
      {shortcut && <span className="text-[11px] text-[#858585] ml-6">{shortcut}</span>}
    </button>
  )
}

function CtxSep() {
  return <div className="my-1 border-t border-[#3c3c3c]" />
}
