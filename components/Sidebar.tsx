'use client'

import { useEffect, useRef, useState } from 'react'
import { TABS } from '@/lib/data'
import type { SidePanel } from './ActivityBar'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'

interface Props {
  panel: SidePanel
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onToggleCopilot: () => void
  copilotOpen: boolean
  hiddenBuiltins: string[]
  onHideBuiltin: (id: string) => void
  onFileDeleted: (id: string) => void
  // Lifted file-system state
  customFiles:          CustomFile[]
  customFolders:        CustomFolder[]
  onCustomFilesChange:  (files: CustomFile[]) => void
  onCustomFoldersChange:(folders: CustomFolder[]) => void
  // Content for Find in Files
  fileContents:    Record<string, string>
  defaultContents: Record<string, string>
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ReactIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <circle cx="16" cy="16" r="16" fill="#20232a"/>
    <g fill="none" stroke="#61dafb" strokeWidth="1.4">
      <ellipse cx="16" cy="16" rx="11" ry="4.2"/>
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)"/>
    </g>
    <circle cx="16" cy="16" r="2.2" fill="#61dafb"/>
  </svg>
)

const HtmlIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#e34c26"/>
    <text x="4" y="23" fontSize="13" fontWeight="900" fill="#fff" fontFamily="monospace">&lt;/&gt;</text>
  </svg>
)

const JsIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#f7df1e"/>
    <text x="3" y="24" fontSize="14" fontWeight="900" fill="#222" fontFamily="monospace">JS</text>
  </svg>
)

const JsonIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#f5a623"/>
    <text x="2" y="24" fontSize="16" fontWeight="900" fill="#fff" fontFamily="monospace">{'{}'}</text>
  </svg>
)

const TsIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#3178c6"/>
    <text x="2" y="24" fontSize="14" fontWeight="900" fill="#fff" fontFamily="monospace">TS</text>
  </svg>
)

const CssIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#264de4"/>
    <path d="M8 4l1.6 18L16 24l6.4-2L24 4H8z" fill="#2965f1"/>
    <path d="M16 22.3l5.2-1.4 1.4-15.4H16v16.8z" fill="#ebebeb"/>
    <path d="M16 7.5H11.3l.3 3.5H16V7.5z" fill="#fff"/>
    <path d="M16 17.2l-.1.1-2.6-.7-.2-2H10.5l.4 4.4 5.1 1.4v-3.2z" fill="#fff"/>
    <path d="M16 10.9v3.4h2.4l-.2 2.6-2.2.6v3.2l5.1-1.4.9-10.4H16z" fill="#ebebeb"/>
    <path d="M16 7.5v3.5h4.8l-.3-3.5H16z" fill="#ebebeb"/>
  </svg>
)

const MdIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#519aba"/>
    <text x="4" y="13" fontSize="8" fontWeight="700" fill="#fff" fontFamily="monospace">MD</text>
    <path d="M5 20v-7l3.5 4.5 3.5-4.5v7M13 20v-7l4 6M17 13v7M20 13v7" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PdfIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18">
    <rect width="32" height="32" rx="3" fill="#e44d26"/>
    <text x="2" y="23" fontSize="11" fontWeight="900" fill="#fff" fontFamily="monospace">PDF</text>
  </svg>
)

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#858585" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const FolderIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={open ? '#dcb67a' : '#c09553'}>
    {open
      ? <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      : <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    }
  </svg>
)

// Map known tab IDs → icons
const ICON_MAP: Record<string, React.ReactNode> = {
  home:       <ReactIcon />,
  about:      <HtmlIcon />,
  projects:   <JsIcon />,
  skills:     <JsonIcon />,
  experience: <TsIcon />,
  contact:    <CssIcon />,
  readme:     <MdIcon />,
  resume:     <PdfIcon />,
}

function iconForFile(name: string): React.ReactNode {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  switch (ext) {
    case 'tsx': case 'jsx': return <ReactIcon />
    case 'ts':              return <TsIcon />
    case 'js':              return <JsIcon />
    case 'html': case 'htm': return <HtmlIcon />
    case 'css': case 'scss': return <CssIcon />
    case 'json':            return <JsonIcon />
    case 'md':              return <MdIcon />
    case 'pdf':             return <PdfIcon />
    default:                return <FileIcon />
  }
}

// ─── GitStatus ────────────────────────────────────────────────────────────────

function GitStatus() {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-vsc-muted select-none">
      <span className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
        </svg>
        main
      </span>
      <span className="flex items-center gap-0.5 text-[#89d185]">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/>
        </svg>
        1
      </span>
      <span className="flex items-center gap-0.5 text-[#f14c4c]">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.53 8.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L2.97 9.28a.75.75 0 0 1 1.06-1.06L7 11.19V3.75a.75.75 0 0 1 1.5 0v7.44l2.97-2.97a.75.75 0 0 1 1.06 0z"/>
        </svg>
        3
      </span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CtxTarget {
  x: number; y: number
  id: string; name: string
  isBuiltin: boolean
  folderId?: string
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
  hiddenBuiltins,
  onHideBuiltin,
  onFileDeleted,
  customFiles,
  customFolders,
  onCustomFilesChange,
  onCustomFoldersChange,
  fileContents,
  defaultContents,
}: Props) {
  const setCustomFiles   = onCustomFilesChange
  const setCustomFolders = onCustomFoldersChange

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
      setCustomFiles([...customFiles, { id, name }])
      onNavigate(id)
    } else if (newMode === 'folder') {
      setCustomFolders([...customFolders, { id: 'folder:' + name, name, open: true, files: [] }])
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
    setCustomFolders(customFolders.map(f => f.id === folderId ? { ...f, open: true } : f))
    setNewInFolder(folderId)
    setNewInFolderName('')
    setTimeout(() => folderInputRef.current?.focus(), 0)
  }

  function commitFolderFile(folderId: string) {
    const name = newInFolderName.trim()
    if (!name) { cancelFolderFile(); return }
    const fileId = 'file:' + name
    setCustomFolders(customFolders.map(f =>
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

  function openCtx(e: React.MouseEvent, id: string, name: string, isBuiltin: boolean, folderId?: string) {
    e.preventDefault()
    e.stopPropagation()
    setCtx({ x: e.clientX, y: e.clientY, id, name, isBuiltin, folderId })
  }

  function handleDelete() {
    if (!ctx) return
    const { id, isBuiltin, folderId } = ctx
    setCtx(null)
    if (isBuiltin) {
      onHideBuiltin(id)
    } else if (folderId) {
      setCustomFolders(customFolders.map(f =>
        f.id === folderId ? { ...f, files: f.files.filter(fi => fi.id !== id) } : f
      ))
    } else {
      setCustomFiles(customFiles.filter(f => f.id !== id))
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
      setCustomFiles(customFiles.map(f => f.id === id ? { ...f, name } : f))
      setCustomFolders(customFolders.map(folder => ({
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
    setCustomFiles([...customFiles, { id: newId, name: newName }])
    onNavigate(newId)
    setCtx(null)
  }

  function handleCopyPath() {
    if (!ctx) return
    navigator.clipboard.writeText(ctx.name).catch(() => {})
    setCtx(null)
  }

  const BottomSection = () => (
    <div className="shrink-0 border-t border-vsc-border/40">
      <div className="px-2 pt-2 pb-1">
        <button
          onClick={onToggleCopilot}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-all
            ${copilotOpen
              ? 'bg-[#2d2b55] border border-[#7c6af7]/50 text-[#a78bfa]'
              : 'bg-[#1e1e2e] border border-vsc-border/50 text-vsc-muted hover:text-vsc-text hover:border-vsc-border'}
          `}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className={copilotOpen ? 'text-[#a78bfa]' : 'text-vsc-muted'}>
            <path d="M12 1l2.39 7.26L22 10l-7.61 2.74L12 20l-2.39-7.26L2 10l7.61-2.74L12 1z"/>
          </svg>
          <span className="flex-1 text-left">Dwijesh&apos;s Copilot</span>
          {copilotOpen && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#7c6af7]/20 text-[10px] text-[#a78bfa] border border-[#7c6af7]/30 shrink-0">
              open ✓
            </span>
          )}
        </button>
      </div>
      <GitStatus />
    </div>
  )

  const FileRow = ({ id, name, icon, depth = 0, folderId }: { id: string; name: string; icon: React.ReactNode; depth?: number; folderId?: string }) => {
    const isBuiltin    = TABS.some(t => t.id === id)
    const displayName  = nameOverrides[id] ?? name
    const isRenaming   = renamingId === id
    return (
      <li
        onClick={() => !isRenaming && onNavigate(id)}
        onContextMenu={(e) => openCtx(e, id, displayName, isBuiltin, folderId)}
        className={`
          flex items-center gap-2 pr-3 py-[4px] cursor-pointer transition-colors relative
          ${activeTab === id ? 'bg-vsc-selection text-vsc-text' : 'text-[#cccccc] hover:bg-vsc-hover'}
        `}
        style={{ paddingLeft: `${20 + depth * 12}px` }}
      >
        {activeTab === id && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-vsc-accent" />}
        <span className="shrink-0">{icon}</span>
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
    <div ref={sidebarRef} className="w-[220px] bg-vsc-sidebar shrink-0 flex flex-col border-r border-vsc-border/30 overflow-hidden">
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
          <ul className="flex-1 overflow-y-auto panel-scroll py-0.5">
            {portfolioOpen && (
              <>
                {/* Static portfolio files */}
                {TABS.filter(tab => !hiddenBuiltins.includes(tab.id)).map((tab) => (
                  <FileRow
                    key={tab.id}
                    id={tab.id}
                    name={tab.label}
                    icon={ICON_MAP[tab.id]}
                    depth={1}
                  />
                ))}

                {/* Custom folders */}
                {customFolders.map((folder) => (
                  <li key={folder.id}>
                    <div
                      className="group flex items-center gap-2 pr-2 py-[4px] cursor-pointer text-[#cccccc] hover:bg-vsc-hover transition-colors"
                      style={{ paddingLeft: '20px' }}
                      onContextMenu={(e) => openCtx(e, folder.id, folder.name, false)}
                    >
                      <button
                        className="flex items-center gap-2 flex-1 min-w-0"
                        onClick={() => setCustomFolders(
                          customFolders.map(f => f.id === folder.id ? { ...f, open: !f.open } : f)
                        )}
                      >
                        <span className="text-vsc-muted text-[9px] w-3 text-center shrink-0">{folder.open ? '▾' : '▸'}</span>
                        <FolderIcon open={folder.open} />
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

                {/* Custom files */}
                {customFiles.map((f) => (
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
                ...TABS.filter(t => !hiddenBuiltins.includes(t.id)).map(t => ({
                  id: t.id, label: t.label, path: t.label,
                  content: fileContents[t.id] ?? defaultContents[t.id] ?? '',
                })),
                ...customFiles.map(f => ({
                  id: f.id, label: f.name, path: f.name,
                  content: fileContents[f.id] ?? '',
                })),
                ...customFolders.flatMap(folder =>
                  folder.files.map(f => ({
                    id: f.id, label: f.name, path: `${folder.name}/${f.name}`,
                    content: fileContents[f.id] ?? '',
                  }))
                ),
              ]
              const results = allSearchable.flatMap(file => {
                const lines = file.content.split('\n')
                const hits = lines
                  .map((line, i) => ({ line, lineNum: i + 1 }))
                  .filter(({ line }) => line.toLowerCase().includes(q))
                  .slice(0, 3)
                const nameMatch = file.path.toLowerCase().includes(q)
                return (hits.length > 0 || nameMatch) ? [{ ...file, hits }] : []
              })
              return (
                <ul className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] panel-scroll">
                  {results.length === 0 && (
                    <li className="px-2 py-2 text-sm text-vsc-muted">No results</li>
                  )}
                  {results.map(file => (
                    <li key={file.id}>
                      <div
                        onClick={() => { onNavigate(file.id); onSearchChange('') }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-vsc-hover transition-colors"
                      >
                        <span className="shrink-0">{ICON_MAP[file.id] ?? iconForFile(file.label)}</span>
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
          <div className="flex-1" />
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
          <CtxSep />
          <CtxBtn label="Copy"      shortcut="Ctrl+C" onClick={handleCopy}     disabled={ctx.isBuiltin} />
          <CtxBtn label="Paste"     shortcut="Ctrl+V" onClick={handlePaste}    disabled={!clipboard} />
          <CtxBtn label="Copy Path"                   onClick={handleCopyPath} />
          <CtxSep />
          <CtxBtn label="Rename"    shortcut="F2"     onClick={handleRename} />
          <CtxBtn label="Delete"    shortcut="Del"    onClick={handleDelete} danger />
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
